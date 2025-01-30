"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCustomer = async (email: string, name: string) => {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer.id;
};

export const generateClientSecret = async (amount: number) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    setup_future_usage: "off_session",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return paymentIntent.client_secret;
};

export const confirmSubscription = async ({
  paymentMethod,
  customerId,
  plan,
}: ConfirmSubscription) => {
  const priceOption: { [key: number]: string } = {
    2: `${process.env.STARTER_PLAN_PRICE_ID}`,
    3: `${process.env.PRO_PLAN_PRICE_ID}`,
    4: `${process.env.UNLIMITED_PLAN_PRICE_ID}`,
  };

  const priceId = priceOption[plan];

  // Step 1: Check if the customer already has an active subscription
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  if (subscriptions.data.length > 0) {
    const existingSubscription = subscriptions.data[0];
    console.log(existingSubscription);
    // Optionally, you can cancel the subscription immediately:
    await stripe.subscriptions.cancel(existingSubscription.id);
  }

  // Step 3: Attach the payment method to the customer
  await stripe.paymentMethods.attach(paymentMethod, {
    customer: customerId,
  });

  // Step 4: Set the default payment method for the customer
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethod,
    },
  });

  // Step 5: Create a new subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
  });

  return subscription.id;
};

export const backToFreePlan = async (customerId: string) => {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  await stripe.subscriptions.cancel(subscriptions.data[0].id);
};
