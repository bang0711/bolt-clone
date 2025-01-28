import {
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  ExpressCheckoutElement,
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

import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  isClientSecretCreated: boolean;
  setIsClientSecretCreated: Dispatch<SetStateAction<boolean>>;
  amount: number;
};

function PaymentModal({
  isClientSecretCreated,
  setIsClientSecretCreated,
  amount = 0,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();

  // Handle card payment submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000",
        payment_method_data: {
          allow_redisplay: "unspecified",
          billing_details: {
            email: "never",

            name: "never",
            phone: "never",
          },
        },
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
              fields: {
                billingDetails: {
                  email: "never",
                  address: "never",
                  name: "never",
                  phone: "never",
                },
              },
            }}
          />
          <Button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            type="submit"
            className="mt-4 w-full"
          >
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              `Pay $${amount}`
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
