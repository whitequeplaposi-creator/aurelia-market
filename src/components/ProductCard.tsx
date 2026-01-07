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
      <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col border border-gray-100 hover:border-gold-300">
        <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <span className="text-gray-400 text-sm">Produktbild</span>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Slutsåld
              </span>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                Få kvar!
              </span>
            )}
          </div>
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gold-600 px-4 py-2 rounded-lg">
              Visa detaljer
            </span>
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
            {product.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-gold-600">
                {product.price} kr
              </span>
              <span className="text-xs text-gray-500">Inkl. moms</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-4 md:px-6 py-3 rounded-lg transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-sm md:text-base font-semibold w-full sm:w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {product.stock === 0 ? 'Slut i lager' : '🛒 Lägg i varukorg'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
