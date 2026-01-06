'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const orders = await ordersResponse.json();

      // Fetch products
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      const products = productsData.products || [];

      // Calculate stats
      const totalRevenue = orders.reduce(
        (sum: number, order: any) =>
          order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
            ? sum + parseFloat(order.total_price)
            : sum,
        0
      );

      const pendingOrders = orders.filter(
        (order: any) => order.status === 'pending' || order.status === 'paid'
      ).length;

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">Laddar statistik...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Totala Ordrar</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Produkter</p>
                    <p className="text-3xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Omsättning</p>
                    <p className="text-3xl font-bold">{stats.totalRevenue.toFixed(0)} kr</p>
                  </div>
                  <div className="bg-gold-100 rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-gold-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Väntande Ordrar</p>
                    <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                  </div>
                  <div className="bg-orange-100 rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Snabbåtgärder</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/admin/products"
                  className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition"
                >
                  <svg
                    className="w-6 h-6 text-gold-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="font-semibold">Lägg till Produkt</span>
                </Link>

                <Link
                  href="/admin/orders"
                  className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition"
                >
                  <svg
                    className="w-6 h-6 text-gold-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="font-semibold">Hantera Ordrar</span>
                </Link>

                <Link
                  href="/"
                  className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition"
                >
                  <svg
                    className="w-6 h-6 text-gold-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="font-semibold">Visa Butiken</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
