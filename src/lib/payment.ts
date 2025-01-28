"use server";

import Stripe from "stripe";

// let stripePromise: Promise<Stripe | null>;
// export const getStripe = () => {
//   if (!stripePromise) {
//     stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
//   }
//   return stripePromise;
// };

export const generateClientSecret = async (amount: number) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
  });
  return paymentIntent.client_secret;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const checkout = async (amount: number) => {
  const price = Math.round(amount * 100);
  console.log(price);
  const res = await stripe.checkout.sessions.create({
    currency: "usd",
    payment_method_types: ["card"],
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?cancel=true`,
    success_url: `${process.env.NEXT_PUBLIC_URL}/pricing?success=true`,
    // redirect_on_completion: "always",
    // return_url: `${process.env.NEXT_PUBLIC_URL}/pricing?success=true`,
    // ui_mode: "embedded",
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: price,
        },
        quantity: 1,
        // price: amount.toString(),
      },
    ],
  });
  console.log(res);
  return res.url;
};
