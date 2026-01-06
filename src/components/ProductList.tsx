'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';
import { useState } from 'react';

interface ProductListProps {
  products: Product[];
  itemsPerPage?: number;
}

export default function ProductList({ products, itemsPerPage = 9 }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Visa max 5 sidnummer på mobil, fler på desktop
  const getPageNumbers = () => {
    const maxVisible = window.innerWidth < 640 ? 3 : 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 md:gap-2 flex-wrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            <span className="hidden sm:inline">Föregående</span>
            <span className="sm:hidden">‹</span>
          </button>

          {currentPage > 2 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-base"
              >
                1
              </button>
              {currentPage > 3 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base ${
                currentPage === page
                  ? 'bg-gold-500 text-white border-gold-500'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => goToPage(totalPages)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-base"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            <span className="hidden sm:inline">Nästa</span>
            <span className="sm:hidden">›</span>
          </button>
        </div>
      )}
    </div>
  );
}
