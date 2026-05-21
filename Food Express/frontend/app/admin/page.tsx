'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, Clock, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/lib/api-client'
import { Container, PageHeader, MobileScreenFrame } from '@/components/ui/layout'
import { AdminMetricCard, AdminDataTable } from '@/components/ui/admin-components'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { LoadingSkeleton, ErrorState } from '@/components/ui/states'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  ASSIGNED: 'Assigned',
  PICKED_UP: 'Picked Up',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [dashboard, setDashboard] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadDashboard = async () => {
    if (!user || user.role !== 'ADMIN') return

    try {
      setError(null)
      const [dashboardRes, ordersRes] = await Promise.all([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/orders'),
      ])
      setDashboard(dashboardRes.data?.data ?? dashboardRes.data)
      const ordersData = ordersRes.data?.data ?? ordersRes.data ?? []
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setLastUpdated(new Date())
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load admin dashboard'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboard, 30000)
    return () => clearInterval(interval)
  }, [user])

  if (!user || user.role !== 'ADMIN') {
    return (
      <MobileScreenFrame>
        <Container className="py-12">
          <ErrorState
            title="Access Denied"
            message="This section is only available to admin users"
            action={
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
            }
          />
        </Container>
      </MobileScreenFrame>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Container className="py-8">
          <PageHeader title="Admin Dashboard" />
          <LoadingSkeleton count={4} />
        </Container>
      </div>
    )
  }

  if (error && !dashboard) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Container className="py-8">
          <PageHeader title="Admin Dashboard" />
          <ErrorState
            title="Could not load dashboard"
            message={error}
            action={
              <Button onClick={loadDashboard} variant="secondary">
                Try Again
              </Button>
            }
          />
        </Container>
      </div>
    )
  }

  const recentOrders = orders.slice(0, 8)

  // Normalize chart data — backend returns revenueChart, not monthlyRevenue
  const revenueChartData = dashboard?.revenueChart || dashboard?.monthlyRevenue || []

  // Normalize order status chart
  const orderStatusData = (dashboard?.orderStatusChart || []).map((item: any) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count || item.value || 0,
  }))

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Monitor your business metrics in real-time</p>
            {lastUpdated && (
              <p className="text-xs text-slate-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={loadDashboard}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary-900/30 text-primary-400">
                <ShoppingCart size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                <TrendingUp size={14} /> +12%
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-white mt-1">{(dashboard?.totalOrders || 0).toLocaleString()}</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-900/30 text-green-400">
                <DollarSign size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                <TrendingUp size={14} /> +23%
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-white mt-1">
              ₹{(dashboard?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-amber-900/30 text-amber-400">
                <Users size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                <TrendingUp size={14} /> +15%
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-white mt-1">{(dashboard?.totalUsers || 0).toLocaleString()}</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-900/30 text-red-400">
                <Package size={24} />
              </div>
              <span className="text-slate-400 text-sm font-semibold">—</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Restaurants</p>
            <p className="text-3xl font-bold text-white mt-1">{(dashboard?.totalRestaurants || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-bold text-white mb-4">Revenue Overview</h3>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ff6b00"
                    strokeWidth={2}
                    dot={{ fill: '#ff6b00', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No revenue data available
              </div>
            )}
          </div>

          {/* Order Status Chart */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-bold text-white mb-4">Order Status</h3>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No order data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock size={20} />
              Recent Orders
            </h3>
            <Link href="/admin/orders">
              <Button variant="secondary" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                View All
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-400 text-sm">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-400 text-sm">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-400 text-sm">Restaurant</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-400 text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-400 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-400 text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition"
                  >
                    <td className="py-3 px-4 text-white font-mono text-sm">
                      #{order.orderNumber?.slice(-6) || order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-sm">{order.user?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-300 text-sm">{order.restaurant?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">
                      ₹{(order.totalAmount || order.total || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-900/50 text-green-400'
                            : order.status === 'PENDING'
                              ? 'bg-yellow-900/50 text-yellow-400'
                              : order.status === 'CANCELLED'
                                ? 'bg-red-900/50 text-red-400'
                                : order.status === 'PREPARING'
                                  ? 'bg-purple-900/50 text-purple-400'
                                  : 'bg-blue-900/50 text-blue-400'
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Restaurants */}
        {dashboard?.topRestaurants && dashboard.topRestaurants.length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-bold text-white mb-4">Top Restaurants</h3>
            <div className="space-y-3">
              {dashboard.topRestaurants.map((restaurant: any, index: number) => (
                <div
                  key={restaurant.id}
                  className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg"
                >
                  <span className="text-slate-400 font-bold w-6 text-center">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{restaurant.name}</p>
                    <p className="text-sm text-slate-400">
                      {restaurant._count?.orders || 0} orders • ⭐ {restaurant.rating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
