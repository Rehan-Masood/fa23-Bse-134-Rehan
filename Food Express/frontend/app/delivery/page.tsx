'use client'

import { useEffect, useState, useCallback } from 'react'
import { LogOut, RefreshCw, MapPin, DollarSign, Star, User } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth'
import { Container, MobileScreenFrame, PageHeader, BottomNav } from '@/components/ui/layout'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/states'
import { Button } from '@/components/ui/button'

type TabType = 'home' | 'earnings' | 'history' | 'profile'

interface AvailableOrder {
  id: string
  orderId: string
  status: string
  fee: number
  order?: {
    id: string
    totalAmount: number
    deliveryAddress: string
    restaurant?: { name: string; address: string }
    user?: { name: string; phone?: string }
    orderItems?: any[]
  }
}

export default function DeliveryPage() {
  const { user, logout } = useAuthStore()
  const [availableOrders, setAvailableOrders] = useState<AvailableOrder[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [earnings, setEarnings] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadDeliveryData = useCallback(async () => {
    if (!user || user.role !== 'DELIVERY_PERSON') return

    try {
      setError(null)
      const [ordersRes, profileRes, earningsRes, historyRes] = await Promise.all([
        apiClient.get('/delivery/orders'),
        apiClient.get('/delivery/profile'),
        apiClient.get('/delivery/earnings'),
        apiClient.get('/delivery/history'),
      ])

      const ordersData = ordersRes.data?.data ?? ordersRes.data ?? []
      setAvailableOrders(Array.isArray(ordersData) ? ordersData : [])

      const profileData = profileRes.data?.data ?? profileRes.data
      setProfile(profileData)
      if (profileData?.isOnline !== undefined) {
        setIsOnline(profileData.isOnline)
      }

      setEarnings(earningsRes.data?.data ?? earningsRes.data)

      const historyData = historyRes.data?.data ?? historyRes.data ?? []
      setHistory(Array.isArray(historyData) ? historyData : [])

      setLastUpdated(new Date())
    } catch (err: any) {
      const message = err.response?.data?.message || 'Could not load delivery data'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadDeliveryData()
    // Refresh every 15 seconds for real-time feel
    const interval = setInterval(loadDeliveryData, 15000)
    return () => clearInterval(interval)
  }, [loadDeliveryData])

  const acceptOrder = async (orderId: string) => {
    try {
      await apiClient.post(`/delivery/orders/${orderId}/accept`)
      toast.success('Delivery accepted!')
      await loadDeliveryData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not accept order')
    }
  }

  const rejectOrder = async (orderId: string) => {
    try {
      await apiClient.post(`/delivery/orders/${orderId}/reject`)
      toast.success('Delivery declined')
      await loadDeliveryData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not reject order')
    }
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await apiClient.patch(`/delivery/orders/${orderId}/status`, { status })
      toast.success(`Status updated to ${status}`)
      await loadDeliveryData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not update status')
    }
  }

  const toggleOnline = async () => {
    try {
      const newStatus = !isOnline
      await apiClient.patch('/delivery/profile', { isOnline: newStatus })
      setIsOnline(newStatus)
      toast.success(newStatus ? 'You are now online' : 'You are now offline')
    } catch {
      toast.error('Could not update online status')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    window.location.href = '/login'
  }

  if (!user || user.role !== 'DELIVERY_PERSON') {
    return (
      <MobileScreenFrame className="bg-slate-950">
        <Container className="py-12">
          <ErrorState
            title="Access Denied"
            message="This section is only available to delivery personnel"
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

  const bottomNavItems = [
    {
      icon: '🏠',
      label: 'Home',
      href: '#home',
      active: activeTab === 'home',
      onClick: () => setActiveTab('home'),
    },
    {
      icon: '💰',
      label: 'Earnings',
      href: '#earnings',
      active: activeTab === 'earnings',
      onClick: () => setActiveTab('earnings'),
    },
    {
      icon: '📋',
      label: 'History',
      href: '#history',
      active: activeTab === 'history',
      onClick: () => setActiveTab('history'),
    },
    {
      icon: '👤',
      label: 'Profile',
      href: '#profile',
      active: activeTab === 'profile',
      onClick: () => setActiveTab('profile'),
    },
  ]

  return (
    <MobileScreenFrame className="bg-slate-950 pb-24">
      <Container className="py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🚴 Delivery App</h1>
            {lastUpdated && (
              <p className="text-xs text-slate-500 mt-0.5">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Online/Offline Toggle */}
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                isOnline
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-700 text-slate-400 border border-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </button>
            <button
              onClick={loadDeliveryData}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* TAB: Home - Available Orders */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center flex-col gap-3 border border-slate-700">
              <div className="text-4xl">🗺️</div>
              <div className="text-center">
                <p className="font-bold text-white text-sm">Live Location Tracking</p>
                <p className="text-xs text-slate-400">Real-time map integration coming soon</p>
              </div>
            </div>

            {/* Available Orders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-lg">📦 Available Deliveries</h3>
                {availableOrders.length > 0 && (
                  <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {availableOrders.length}
                  </span>
                )}
              </div>

              {isLoading && <LoadingSkeleton count={2} />}

              {error && !isLoading && (
                <ErrorState
                  message={error}
                  action={
                    <Button onClick={loadDeliveryData} variant="secondary">
                      Try Again
                    </Button>
                  }
                />
              )}

              {!isLoading && !error && availableOrders.length === 0 && (
                <EmptyState
                  title="No orders available"
                  text="Check back soon for new delivery requests"
                />
              )}

              <div className="space-y-4">
                {availableOrders.map((assignment) => {
                  const order = assignment.order
                  const isAccepted = assignment.status === 'ACCEPTED'
                  return (
                    <div
                      key={assignment.id}
                      className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
                    >
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">New Order</p>
                          <p className="text-2xl font-bold text-white">
                            ₹{(order?.totalAmount || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">
                            {order?.orderItems?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-400">
                            +₹{assignment.fee} fee
                          </p>
                          {isAccepted && (
                            <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-1 rounded-full">
                              Accepted
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Locations */}
                      <div className="space-y-3 bg-slate-700/50 p-3 rounded-lg mb-4">
                        <div className="flex gap-3">
                          <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-slate-400">Pickup</p>
                            <p className="text-sm text-white">
                              {order?.restaurant?.name || 'Restaurant'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {order?.restaurant?.address || 'Restaurant address'}
                            </p>
                          </div>
                        </div>
                        <div className="border-l-2 border-dashed border-slate-600 ml-2 h-4" />
                        <div className="flex gap-3">
                          <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-slate-400">Deliver to</p>
                            <p className="text-sm text-white">
                              {order?.user?.name || 'Customer'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {order?.deliveryAddress || 'Customer address'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {!isAccepted ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => rejectOrder(assignment.orderId)}
                            className="flex-1 py-3 rounded-xl border-2 border-red-800 text-red-400 hover:bg-red-900/20 font-semibold transition text-sm"
                          >
                            ✕ Decline
                          </button>
                          <button
                            onClick={() => acceptOrder(assignment.orderId)}
                            className="flex-1 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-semibold transition text-sm"
                          >
                            ✓ Accept
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 font-semibold mb-2">Update Status:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'].map((status) => (
                              <button
                                key={status}
                                onClick={() => updateStatus(assignment.orderId, status)}
                                className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
                                  status === 'DELIVERED'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : status === 'FAILED'
                                      ? 'bg-red-900/50 text-red-400 hover:bg-red-900/70'
                                      : 'bg-slate-700 text-white hover:bg-slate-600'
                                }`}
                              >
                                {status.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Earnings */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg">💰 Earnings</h3>

            {isLoading ? (
              <LoadingSkeleton count={2} />
            ) : (
              <>
                {/* Total Earnings Card */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-slate-400 text-sm">Total Earnings</p>
                      <p className="text-4xl font-bold text-white mt-1">
                        ₹{(earnings?.totalEarnings || 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-10 h-10 text-green-500 opacity-50" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{earnings?.ordersCompleted || 0}</p>
                      <p className="text-xs text-slate-400">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{earnings?.distance || '0 km'}</p>
                      <p className="text-xs text-slate-400">Distance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{earnings?.onlineHours || '0h'}</p>
                      <p className="text-xs text-slate-400">Online</p>
                    </div>
                  </div>
                </div>

                {/* Earnings History Chart Placeholder */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <p className="font-semibold text-white mb-4">Earnings History</p>
                  <div className="flex h-36 items-end gap-3">
                    {[60, 42, 36, 55, 44, 68, 52].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-lg bg-purple-500 opacity-80 hover:opacity-100 transition"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <span key={day} className="text-xs text-slate-500 flex-1 text-center">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB: History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">📋 Delivery History</h3>

            {isLoading ? (
              <LoadingSkeleton count={3} />
            ) : history.length === 0 ? (
              <EmptyState
                title="No history yet"
                text="Your completed deliveries will appear here"
              />
            ) : (
              history.map((assignment: any) => (
                <div
                  key={assignment.id}
                  className="bg-slate-800 rounded-2xl p-4 border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white">
                        {assignment.order?.restaurant?.name || 'Restaurant'}
                      </p>
                      <p className="text-sm text-slate-400">
                        {assignment.order?.deliveryAddress || 'Address'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">+₹{assignment.fee}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          assignment.status === 'DELIVERED'
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-red-900/50 text-red-400'
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                  {assignment.deliveredAt && (
                    <p className="text-xs text-slate-500">
                      {new Date(assignment.deliveredAt).toLocaleDateString()} at{' '}
                      {new Date(assignment.deliveredAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">👤 Profile</h3>

            {isLoading ? (
              <LoadingSkeleton count={2} />
            ) : (
              <>
                {/* Profile Card */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-900/50 border-2 border-purple-500">
                    <User className="h-10 w-10 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {profile?.user?.name || user.name}
                  </h2>
                  <p className="text-slate-400 text-sm">{profile?.user?.email || user.email}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-amber-400 font-semibold">{profile?.rating || 4.8}</span>
                    <span className="text-slate-400 text-sm">/ 5.0</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                    <p className="text-2xl font-bold text-white">{profile?.completedOrders || 0}</p>
                    <p className="text-xs text-slate-400">Orders</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                    <p className="text-2xl font-bold text-white">{profile?.rating || 4.8}</p>
                    <p className="text-xs text-slate-400">Rating</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                    <p className="text-2xl font-bold text-white">98%</p>
                    <p className="text-xs text-slate-400">Completion</p>
                  </div>
                </div>

                {/* Vehicle Info */}
                {(profile?.vehicleType || profile?.vehicleNumber) && (
                  <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                    <p className="text-sm font-semibold text-slate-400 mb-2">Vehicle</p>
                    <p className="text-white">
                      {profile.vehicleType} — {profile.vehicleNumber}
                    </p>
                  </div>
                )}

                {/* Menu Items */}
                {[
                  'Personal Information',
                  'Vehicle Information',
                  'Documents',
                  'Bank Details',
                  'Settings',
                  'Help & Support',
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 border border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-700 transition"
                  >
                    <span>{item}</span>
                    <span className="text-slate-500">›</span>
                  </div>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-red-900/20 border border-red-800 py-3 font-semibold text-red-400 hover:bg-red-900/40 transition"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        )}
      </Container>

      {/* Bottom Navigation */}
      <BottomNav items={bottomNavItems} />
    </MobileScreenFrame>
  )
}
