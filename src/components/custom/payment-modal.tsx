import {
  useElements,
  useStripe,
  PaymentElement,
} from "@stripe/react-stripe-js";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Dispatch, SetStateAction, useState } from "react";

import { confirmSubscription } from "@/lib/payment";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  isClientSecretCreated: boolean;
  setIsClientSecretCreated: Dispatch<SetStateAction<boolean>>;
  user: User;
  paymentInfo: PaymentInfo;
};

function PaymentModal({
  isClientSecretCreated,
  setIsClientSecretCreated,
  user,
  paymentInfo,
}: Props) {
  const { clientSecret, paymentAmount, plan, token } = paymentInfo;

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  const updateToken = useMutation(api.users.updateToken);

  const router = useRouter();

  // Handle card payment submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.error(submitError);
      return;
    }
    // Confirm the payment and get the payment method
    const paymentConfirmation = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret,
      redirect: "if_required",
    });

    if (paymentConfirmation.error) {
      setMessage(paymentConfirmation.error.message);
      setIsLoading(false);
      return;
    }

    // After successful confirmation, pass the payment method to the backend
    const paymentMethodId = paymentConfirmation.paymentIntent?.payment_method;

    if (paymentMethodId) {
      try {
        await confirmSubscription({
          paymentMethod: paymentMethodId.toString(),
          customerId: user.customerId,
          plan,
        });

        await updateToken({
          userId: user._id as Id<"users">,
          plan,
          token,
        });

        setIsClientSecretCreated(false);

        router.refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage("Payment method not found");
    }
  };

  return (
    <Dialog
      open={isClientSecretCreated}
      onOpenChange={setIsClientSecretCreated}
    >
      <DialogContent className="bg-primary-foreground">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl"></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement
            id="payment-element"
            options={{
              layout: "auto",
              paymentMethodOrder: ["Card"], // Only card method is allowed
            }}
          />
          <Button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            type="submit"
            className="mt-4 w-full"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              `Pay $${paymentAmount}`
            )}
          </Button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentModal;
