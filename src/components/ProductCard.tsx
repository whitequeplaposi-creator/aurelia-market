'use client';

import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    alert(`${product.name} har lagts till i varukorgen!`);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full flex flex-col border-2 border-gray-100 hover:border-gold-400 transform hover:-translate-y-1">
        {/* Image Container with Enhanced Styling */}
        <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
          {product.image ? (
            <div className="relative w-full h-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={90}
              />
              {/* Gradient Overlay for Better Text Visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400 text-sm font-medium">Produktbild</span>
              </div>
            </div>
          )}
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.stock === 0 && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl backdrop-blur-sm">
                Slutsåld
              </span>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl animate-pulse backdrop-blur-sm">
                Få kvar!
              </span>
            )}
            {product.stock >= 10 && (
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl backdrop-blur-sm">
                I lager
              </span>
            )}
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
            <span className="text-white font-bold text-sm md:text-base opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-gold-600 hover:bg-gold-700 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Visa detaljer
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 md:p-6 lg:p-7 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3 flex-grow leading-relaxed">
            {product.description}
          </p>
          
          {/* Price and Action */}
          <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-500">
                  {product.price} kr
                </span>
                <span className="text-xs text-gray-500 font-medium">Inkl. moms & frakt</span>
              </div>
              {product.stock > 0 && (
                <div className="text-right">
                  <span className="text-sm font-semibold text-green-600">{product.stock} st</span>
                  <p className="text-xs text-gray-500">i lager</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 hover:from-gold-600 hover:via-gold-700 hover:to-gold-600 text-white px-6 py-3.5 rounded-xl transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-sm md:text-base font-bold w-full shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group/btn"
            >
              {product.stock === 0 ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Slut i lager
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Lägg i varukorg
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
