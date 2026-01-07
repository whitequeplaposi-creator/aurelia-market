'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
    setMobileMenuOpen(false);
  };

  const showSearch = pathname === '/products' || pathname?.startsWith('/products');

  const categories = [
    { id: 'kläder-dam', name: 'Kläder Dam', icon: '👗' },
    { id: 'kläder-herr', name: 'Kläder Herr', icon: '👔' },
    { id: 'skor-dam', name: 'Skor Dam', icon: '👠' },
    { id: 'skor-herr', name: 'Skor Herr', icon: '👞' },
    { id: 'parfym', name: 'Parfym', icon: '🌸' },
    { id: 'skönhet', name: 'Skönhet', icon: '💄' },
    { id: 'hemredskap', name: 'Hemredskap', icon: '🏠' },
    { id: 'accessoarer', name: 'Accessoarer', icon: '👜' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Desktop & Mobile Top Bar */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Search */}
          {showSearch && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sök produkter..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-gold-600 transition text-sm font-medium">
              Produkter
            </Link>
            {user && (
              <Link href="/orders" className="text-gray-700 hover:text-gold-600 transition text-sm font-medium">
                Mina Ordrar
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-gold-600 transition text-sm font-medium">
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Auth & Cart */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-xs text-gray-600 hidden xl:inline max-w-[150px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gold-600 transition text-sm font-medium"
                >
                  Logga ut
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-gold-600 transition text-sm font-medium"
              >
                Logga in
              </Link>
            )}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-gold-600 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-gold-600 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gold-600 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <form onSubmit={handleSearch} className="md:hidden mt-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök produkter..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
        )}
      </div>

      {/* Category Navigation - Desktop */}
      <div className="hidden lg:block border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group flex flex-col items-center px-4 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 min-w-[100px]"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gold-600 transition-colors text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-gold-600 transition font-medium"
            >
              Alla Produkter
            </Link>
            
            {/* Categories in Mobile Menu */}
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Kategorier</p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 py-2 text-gray-700 hover:text-gold-600 transition"
                >
                  <span>{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </Link>
              ))}
            </div>

            {user && (
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-gold-600 transition font-medium border-t border-gray-200 pt-3"
              >
                Mina Ordrar
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-gold-600 transition font-medium"
              >
                Admin
              </Link>
            )}
            <div className="border-t border-gray-200 pt-3">
              {user ? (
                <>
                  <p className="text-sm text-gray-600 mb-2 truncate">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-gray-700 hover:text-gold-600 transition font-medium"
                  >
                    Logga ut
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-gold-600 transition font-medium"
                >
                  Logga in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
