import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { amount } = body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
  });
  return NextResponse.json({ paymentIntent });
};
