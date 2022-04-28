import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';

export default function PaymentForm() {
  const [state, setState] = useState({
    isPaymentLoading: false,
  });
  const stripe = useStripe();
  const stripeElements = useElements();

  // useEffect(() => {
  //   checkPaymentStatus();
  // }, []);

  async function submitPayment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    if (!stripe || !stripeElements) return;

    e.preventDefault();
    setState((current) => ({
      ...current,
      isPaymentLoading: true,
    }));

    const { error } = await stripe.confirmPayment({
      elements: stripeElements,
      confirmParams: {
        // TODO: Make sure to change this to your payment completion page
        return_url: 'http://localhost:3000',
      },
    });

    // If payment fails or requires authorization.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      alert(error.message);
    } else {
      alert('An unexpected error occured.');
    }

    setState((current) => ({
      ...current,
      isPaymentLoading: false,
    }));
  }

  async function checkPaymentStatus() {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) return;

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    switch (paymentIntent?.status) {
      case 'succeeded':
        alert('Payment succeeded!');
        break;
      case 'processing':
        alert('Your payment is processing.');
        break;
      case 'requires_payment_method':
        alert('Your payment was not successful, please try again.');
        break;
      default:
        alert('Something went wrong.');
        break;
    }
  }

  return (
    <form>
      <PaymentElement id={'payment-form'} />
      <button onClick={submitPayment} disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
}
