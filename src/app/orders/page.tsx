'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';

type FilterStatus = 'all' | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [user]);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.items?.some(item => 
          item.product?.name?.toLowerCase().includes(query)
        )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, filterStatus, searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '📦';
      case 'cancelled':
        return '✕';
      case 'pending':
        return '⏳';
      default:
        return '•';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Väntar';
      case 'paid':
        return 'Betald';
      case 'shipped':
        return 'Skickad';
      case 'delivered':
        return 'Levererad';
      case 'cancelled':
        return 'Avbruten';
      default:
        return status;
    }
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
              <p className="mt-4 text-gray-600">Laddar dina ordrar...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mina Ordrar</h1>
            <p className="text-gray-600">Hantera och spåra alla dina beställningar</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Inga ordrar ännu
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                När du gör ett köp kommer dina ordrar att visas här. Du kan spåra leveranser och hantera dina beställningar.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Börja Handla
              </Link>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Totalt</div>
                </div>
                <div className="bg-yellow-50 rounded-xl shadow-md p-4 border border-yellow-200 hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
                  <div className="text-sm text-yellow-700">Väntar</div>
                </div>
                <div className="bg-green-50 rounded-xl shadow-md p-4 border border-green-200 hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-green-800">{stats.paid}</div>
                  <div className="text-sm text-green-700">Betalda</div>
                </div>
                <div className="bg-blue-50 rounded-xl shadow-md p-4 border border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-blue-800">{stats.shipped}</div>
                  <div className="text-sm text-blue-700">Skickade</div>
                </div>
                <div className="bg-purple-50 rounded-xl shadow-md p-4 border border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-purple-800">{stats.delivered}</div>
                  <div className="text-sm text-purple-700">Levererade</div>
                </div>
                <div className="bg-red-50 rounded-xl shadow-md p-4 border border-red-200 hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-red-800">{stats.cancelled}</div>
                  <div className="text-sm text-red-700">Avbrutna</div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Sök efter order-ID eller produktnamn..."
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      />
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  </div>

                  {/* Status Filter */}
                  <div className="md:w-64">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white"
                    >
                      <option value="all">Alla ordrar ({stats.total})</option>
                      <option value="pending">Väntar ({stats.pending})</option>
                      <option value="paid">Betalda ({stats.paid})</option>
                      <option value="shipped">Skickade ({stats.shipped})</option>
                      <option value="delivered">Levererade ({stats.delivered})</option>
                      <option value="cancelled">Avbrutna ({stats.cancelled})</option>
                    </select>
                  </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-gray-600">
                  Visar {filteredOrders.length} av {orders.length} ordrar
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
                  <p className="text-gray-600">Inga ordrar matchar dina filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gold-300 group"
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-gold-600 transition-colors">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)} {getStatusText(order.status)}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(order.createdAt).toLocaleDateString('sv-SE', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                {order.items?.length || 0} produkt(er)
                              </div>
                            </div>

                            {/* Product preview */}
                            {order.items && order.items.length > 0 && (
                              <div className="mt-3 flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {order.items.slice(0, 3).map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                                    >
                                      {item.product?.image ? (
                                        <img
                                          src={item.product.image}
                                          alt=""
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                      ) : (
                                        '📦'
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {order.items.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{order.items.length - 3} till
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Price and Action */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl md:text-3xl font-bold text-gold-600">
                                {order.totalPrice} kr
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Inkl. moms</div>
                            </div>
                            <div className="flex items-center text-gold-600 group-hover:translate-x-1 transition-transform">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
