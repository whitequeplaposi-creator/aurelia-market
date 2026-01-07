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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-8 md:mb-12">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <span className="text-xs md:text-sm font-medium mt-2 text-gray-700">Varukorg</span>
              </div>
              <div className="flex-1 h-1 bg-gold-500 mx-2"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <span className="text-xs md:text-sm font-medium mt-2 text-gray-700">Betalning</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <span className="text-xs md:text-sm font-medium mt-2 text-gray-500">Bekräftelse</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Slutför Ditt Köp</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Order Summary - Left Side on Desktop */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 sticky top-24">
                <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Ordersammanfattning
                </h2>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.quantity} × {item.product.price} kr
                        </p>
                      </div>
                      <p className="font-bold text-gold-600 whitespace-nowrap">
                        {item.quantity * item.product.price} kr
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delsumma:</span>
                    <span className="font-semibold">{getTotalPrice()} kr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frakt:</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Moms (25%):</span>
                    <span className="font-semibold">{Math.round(getTotalPrice() * 0.2)} kr</span>
                  </div>
                  <div className="flex justify-between text-xl md:text-2xl font-bold pt-3 border-t-2 border-gray-200">
                    <span>Totalt:</span>
                    <span className="text-gold-600">{getTotalPrice()} kr</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-3">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Säker betalning med SSL-kryptering</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>30 dagars öppet köp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form - Right Side on Desktop */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Betalningsinformation
                </h2>
                
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Vi accepterar följande betalningsmetoder:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 px-4 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
                      💳 VISA
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 px-4 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
                      💳 Mastercard
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 px-4 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
                      💰 PayPal
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 px-4 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
                      🛍️ Klarna
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
      </div>
    </Layout>
  );
}
