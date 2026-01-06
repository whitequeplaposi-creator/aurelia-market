'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Layout from '@/components/Layout';
import CheckoutForm from '@/components/CheckoutForm';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const { items, getTotalPrice } = useCartStore();
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    createPaymentIntent();
  }, [user, items]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems: items,
          paymentMethod: 'card'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      alert('Kunde inte initiera betalning. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Förbereder betalning...</div>
        </div>
      </Layout>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#eab308',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Kassa</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Ordersammanfattning</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {item.product.price} kr
                      </p>
                    </div>
                    <p className="font-semibold">
                      {item.quantity * item.product.price} kr
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Totalt:</span>
                  <span className="text-gold-600">{getTotalPrice()} kr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Betalningsinformation</h2>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Vi accepterar följande betalningsmetoder:
                </p>
                <div className="flex space-x-2">
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-semibold">
                    VISA
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-semibold">
                    Mastercard
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-semibold">
                    PayPal
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-semibold">
                    Klarna
                  </div>
                </div>
              </div>

              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
