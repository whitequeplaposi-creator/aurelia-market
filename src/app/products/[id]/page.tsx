'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      alert(`${quantity} x ${product.name} har lagts till i varukorgen!`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Laddar produkt...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Produkten hittades inte</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 text-gold-600 hover:text-gold-700 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Tillbaka
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image - Enhanced */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200 relative group">
              <div className="relative h-96 md:h-[500px] lg:h-[600px]">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    priority
                    quality={95}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-400 text-xl font-medium">Produktbild</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 text-center">
                <svg className="w-8 h-8 mx-auto text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-xs font-semibold text-gray-700">Snabb leverans</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 text-center">
                <svg className="w-8 h-8 mx-auto text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs font-semibold text-gray-700">Säker betalning</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 text-center">
                <svg className="w-8 h-8 mx-auto text-gold-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <p className="text-xs font-semibold text-gray-700">Fri retur</p>
              </div>
            </div>
          </div>

          {/* Product Info - Enhanced */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-500">
                  {product.price} kr
                </span>
                <span className="text-sm text-gray-500 font-medium">Inkl. moms & frakt</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 shadow-inner">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Produktbeskrivning
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Info - Enhanced */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              {product.stock > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-green-700 font-bold text-lg">
                      I lager - {product.stock} st tillgängliga
                    </p>
                  </div>
                  {product.stock < 5 && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                      <p className="text-orange-800 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Skynda! Endast {product.stock} kvar i lager!
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium">Skickas inom 1-2 arbetsdagar</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <p className="text-red-700 font-bold text-lg">Tillfälligt slut i lager</p>
                  </div>
                  <p className="text-gray-600 text-sm">Produkten är för närvarande slutsåld. Kontakta oss för information om när den är tillbaka i lager.</p>
                </div>
              )}
            </div>

            {/* Quantity Selector - Enhanced */}
            {product.stock > 0 && (
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg space-y-4">
                <label className="block text-lg font-bold text-gray-900">
                  Välj antal
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gold-500 transition-all duration-200 flex items-center justify-center font-bold text-xl text-gray-700 hover:text-gold-600 active:scale-95"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-black text-gray-900 block">
                      {quantity}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">st</span>
                  </div>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-14 h-14 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gold-500 transition-all duration-200 flex items-center justify-center font-bold text-xl text-gray-700 hover:text-gold-600 active:scale-95"
                  >
                    +
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Totalt: <span className="font-bold text-gold-600 text-lg">{(product.price * quantity).toFixed(2)} kr</span>
                  </p>
                </div>
              </div>
            )}

            {/* Add to Cart Button - Enhanced */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 hover:from-gold-600 hover:via-gold-700 hover:to-gold-600 text-white py-5 md:py-6 rounded-2xl font-black text-lg md:text-xl transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group"
            >
              {product.stock === 0 ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Slut i lager
                </>
              ) : (
                <>
                  <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Lägg i varukorg
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
