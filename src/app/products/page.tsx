'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import ProductList from '@/components/ProductList';
import { Product } from '@/types';

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      'kläder-dam': 'Kläder Dam',
      'kläder-herr': 'Kläder Herr',
      'skor-dam': 'Skor Dam',
      'skor-herr': 'Skor Herr',
      'parfym': 'Parfym',
      'skönhet': 'Skönhet',
      'hemredskap': 'Hemredskap',
      'accessoarer': 'Accessoarer',
    };
    return categories[categoryId] || categoryId;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Laddar produkter...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">
          {categoryFilter ? getCategoryName(categoryFilter) : 'Våra Produkter'}
        </h1>
        
        {(searchQuery || categoryFilter) && (
          <p className="mb-6 text-gray-600">
            Visar {filteredProducts.length} av {products.length} produkter
            {searchQuery && ` för "${searchQuery}"`}
            {categoryFilter && !searchQuery && ` i ${getCategoryName(categoryFilter)}`}
          </p>
        )}
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              {searchQuery || categoryFilter
                ? `Inga produkter hittades`
                : 'Inga produkter tillgängliga för tillfället.'}
            </p>
          </div>
        ) : (
          <ProductList products={filteredProducts} />
        )}
      </div>
    </Layout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Laddar produkter...</div>
        </div>
      </Layout>
    }>
      <ProductsContent />
    </Suspense>
  );
}
