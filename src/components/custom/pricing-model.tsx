"use client";

import { PRICING_OPTIONS } from "@/data/lookup";

import { Button } from "../ui/button";

import { loadStripe } from "@stripe/stripe-js";

import { useState } from "react";

import PaymentModal from "./payment-modal";

import { Elements } from "@stripe/react-stripe-js";

import { backToFreePlan, generateClientSecret } from "@/lib/payment";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  user: User | undefined;
};
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function PricingModel({ user }: Props) {
  const [isClientSecretCreated, setIsClientSecretCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    clientSecret: "",
    paymentAmount: 0,
    plan: user?.plan as number,
    token: user?.token as number,
  });

  const updateToken = useMutation(api.users.updateToken);

  const [isGeneratingPaymentIntent, setIsGeneratingPaymentIntent] =
    useState(false);

  const onCheckOut = async (value: number, price: number, plan: number) => {
    if (user === undefined) return;

    const token = user.token + value;
    if (plan === 1) {
      setIsLoading(true);
      try {
        await backToFreePlan(user.customerId);

        return await updateToken({
          plan: 1,
          token: user.token,
          userId: user._id as Id<"users">,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    try {
      setIsGeneratingPaymentIntent(true);
      const amount = Math.round(price * 100);
      const clientSecret = await generateClientSecret(amount);
      if (clientSecret) {
        console.log(clientSecret);
        setPaymentInfo({
          clientSecret,
          paymentAmount: price,
          plan,
          token,
        });
        setIsClientSecretCreated(true);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create payment intent");
    } finally {
      setIsGeneratingPaymentIntent(false);
    }
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {PRICING_OPTIONS.map((option, i) => (
        <div
          key={i}
          className={`flex flex-col justify-between gap-3 rounded-xl border p-4 ${user?.plan === option.plan && "border-primary"}`}
        >
          <h2 className="text-2xl font-bold">{option.name}</h2>
          <h2 className="text-lg font-medium">{option.tokens}</h2>
          <p className="text-primary/50">{option.desc}</p>
          <h2 className="text-center text-4xl font-bold">
            ${option.plan === 1 ? "0" : option.price}/m
          </h2>
          <Button
            onClick={() => onCheckOut(option.value, option.price, option.plan)}
            disabled={
              isGeneratingPaymentIntent ||
              (user?.plan as number) === option.plan ||
              isLoading
            }
          >
            Upgrade to {option.name}
          </Button>{" "}
        </div>
      ))}

      {isClientSecretCreated && user && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentInfo.clientSecret,
            appearance: {
              theme: "night",
              disableAnimations: false,
              labels: "floating",
            },
          }}
        >
          <PaymentModal
            paymentInfo={paymentInfo}
            user={user}
            isClientSecretCreated={isClientSecretCreated}
            setIsClientSecretCreated={setIsClientSecretCreated}
          />
        </Elements>
      )}
    </div>
  );
}

export default PricingModel;
