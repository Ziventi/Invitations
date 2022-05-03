import { Elements as StripeElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import Stripe from 'stripe';

import * as Crypto from 'constants/functions/crypto';
import { PaymentHash } from 'constants/types';
import { STRIPE_ELEMENTS_OPTIONS } from 'constants/variables';
import PaymentForm from 'fragments/PayForm';
import { RootState } from 'reducers/store';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

const PaymentPage: NextPage<PaymentProps> = ({ clientSecret }) => {
  const state = useSelector(({ state }: RootState) => state);

  return (
    <main className={'payment'}>
      <section className={'payment-summary'}>
        <div>Price £0.49</div>
        <div>{state.namesList.length}</div>
        <div>Price £0.49</div>
      </section>
      <StripeElements
        stripe={stripe}
        options={{
          clientSecret,
          ...STRIPE_ELEMENTS_OPTIONS,
        }}>
        <PaymentForm />
      </StripeElements>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<
  PaymentProps,
  { q: string }
> = async ({ query }) => {
  try {
    const { quantity, format } = Crypto.decryptJSON<PaymentHash>(
      query.q as string,
    );
    const perUnitCharge = format === 'pdf' ? 0.59 : 0.49;
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SK!, {
      apiVersion: '2020-08-27',
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(perUnitCharge * quantity * 100),
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const clientSecret = paymentIntent.client_secret;
    if (!clientSecret) throw new Error('No client secret found.');

    return {
      props: {
        clientSecret,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
};

export default PaymentPage;

interface PaymentProps {
  clientSecret: string;
}
