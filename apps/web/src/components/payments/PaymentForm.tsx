'use client';

import { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentsApi } from '@/lib/api/payments';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  amount: number;
  currency: string;
  type: 'membership' | 'event';
  metadata?: any;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PaymentFormContent({
  amount,
  currency,
  type,
  metadata,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const { clientSecret } = await paymentsApi.createPaymentIntent({
        amount,
        currency,
        type,
        metadata,
      });

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        onError(confirmError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment processing failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
        <span className="text-lg font-medium text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">
          ${amount.toFixed(2)} {currency.toUpperCase()}
        </span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: props.amount * 100, // Convert to cents
    currency: props.currency.toLowerCase(),
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}

