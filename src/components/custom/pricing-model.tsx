"use client";

import { PRICING_OPTIONS } from "@/data/lookup";

import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

import { loadStripe } from "@stripe/stripe-js";
import { instance } from "@/config/instance";
import { useState } from "react";
import PaymentModal from "./payment-modal";
import { Elements } from "@stripe/react-stripe-js";
import { checkout, generateClientSecret } from "@/lib/payment";

type Props = {
  user: User | undefined;
};
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function PricingModel({ user }: Props) {
  const updateToken = useMutation(api.users.updateToken);

  const [isClientSecretCreated, setIsClientSecretCreated] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    clientSecret: "",
    paymentAmount: 0,
  });

  const [isGeneratingPaymentIntent, setIsGeneratingPaymentIntent] =
    useState(false);

  const onCheckOut = async (value: number, price: number) => {
    if (user === undefined) return;
    const token = user.token + value;
    console.log("Checkout", token);
    try {
      setIsGeneratingPaymentIntent(true);
      const amount = Math.round(price * 100);
      const clientSecret = await generateClientSecret(amount);
      if (clientSecret) {
        console.log(clientSecret);
        setPaymentInfo({ clientSecret, paymentAmount: price });
        setIsClientSecretCreated(true);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create payment intent");
    } finally {
      setIsGeneratingPaymentIntent(false);
    }
    // const res = await checkout(price);
    // console.log(res);
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {PRICING_OPTIONS.map((option, i) => (
        <div
          key={i}
          className="flex flex-col justify-between gap-3 rounded-xl border p-4"
        >
          <h2 className="text-2xl font-bold">{option.name}</h2>
          <h2 className="text-lg font-medium">{option.tokens}</h2>
          <p className="text-primary/50">{option.desc}</p>
          <h2 className="text-center text-4xl font-bold">${option.price}</h2>
          <Button
            onClick={() => onCheckOut(option.value, option.price)}
            disabled={isGeneratingPaymentIntent}
          >
            Upgrade to {option.name}
          </Button>{" "}
        </div>
      ))}

      {isClientSecretCreated && (
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
            amount={paymentInfo.paymentAmount}
            isClientSecretCreated={isClientSecretCreated}
            setIsClientSecretCreated={setIsClientSecretCreated}
          />
        </Elements>
      )}
    </div>
  );
}

export default PricingModel;
