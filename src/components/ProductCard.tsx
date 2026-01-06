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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="h-48 sm:h-56 md:h-64 bg-gray-200 flex items-center justify-center relative">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <span className="text-gray-400 text-sm">Produktbild</span>
          )}
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <h3 className="text-lg md:text-xl font-semibold mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
            <span className="text-xl md:text-2xl font-bold text-gold-600">
              {product.price} kr
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-gold-500 hover:bg-gold-600 text-white px-4 md:px-6 py-2 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base font-medium w-full sm:w-auto"
            >
              {product.stock === 0 ? 'Slut i lager' : 'Lägg i varukorg'}
            </button>
          </div>
          {product.stock > 0 && product.stock < 5 && (
            <p className="text-xs md:text-sm text-orange-600 mt-2 font-medium">
              Endast {product.stock} kvar i lager!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
