import { Elements as StripeElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import Stripe from 'stripe';

import PaymentForm from 'components/payform';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

const PaymentPage: NextPage<PaymentProps> = ({ clientSecret }) => {
  if (!clientSecret) return null;
  return (
    <StripeElements stripe={stripe} options={{ clientSecret }}>
      <PaymentForm />
    </StripeElements>
  );
};

export const getStaticProps: GetStaticProps<PaymentProps> = async () => {
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SK!, {
    apiVersion: '2020-08-27',
  });

  const quantity = 1;
  const type = 'pdf';
  const perUnitCharge = type === 'pdf' ? 0.69 : 0.49;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(perUnitCharge * quantity * 100),
    currency: 'gbp',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    props: {
      clientSecret: paymentIntent.client_secret,
    },
  };
};

export default PaymentPage;

interface PaymentProps {
  clientSecret: string | null;
}
