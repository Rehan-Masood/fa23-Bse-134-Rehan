'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/lib/api-client'
import { Container, PageHeader, MobileScreenFrame } from '@/components/ui/layout'
import { OrderCard } from '@/components/ui/order-components'
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/states'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

interface Order {
  id: string
  restaurantId: string
  restaurant?: { name: string; imageUrl?: string }
  status: OrderStatus
  items: any[]
  orderItems?: any[]
  total: number
  totalAmount?: number
  createdAt: string
}

export default function OrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'ALL' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'>('ALL')

  const loadOrders = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get('/orders')
      const data = response.data?.data ?? response.data ?? []
      setOrders(Array.isArray(data) ? data : [])
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load orders'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [user])

  if (!user) {
    return (
      <MobileScreenFrame>
        <Container className="py-12">
          <ErrorState
            title="Please log in"
            message="You need to be logged in to view your orders"
            action={
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            }
          />
        </Container>
      </MobileScreenFrame>
    )
  }

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'ONGOING') {
      return ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(
        order.status
      )
    }
    if (activeTab === 'COMPLETED') {
      return order.status === 'DELIVERED'
    }
    if (activeTab === 'CANCELLED') {
      return order.status === 'CANCELLED'
    }
    return true // ALL
  })

  return (
    <MobileScreenFrame>
      <Container className="py-8">
        <PageHeader
          title="My Orders"
          action={
            <Link href="/restaurants">
              <Button variant="secondary">Order Again</Button>
            </Link>
          }
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-2">
          {(['ALL', 'ONGOING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 font-medium text-sm transition whitespace-nowrap border-b-2 ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading && <LoadingSkeleton count={3} />}

        {error && !isLoading && (
          <ErrorState
            title="Could not load orders"
            message={error}
            action={
              <Button onClick={loadOrders} variant="secondary">
                Try Again
              </Button>
            }
          />
        )}

        {!isLoading && !error && filteredOrders.length === 0 && (
          <EmptyState
            title={activeTab === 'ALL' ? 'No orders yet' : `No ${activeTab.toLowerCase()} orders`}
            text="Start ordering from your favorite restaurants!"
            action={
              <Link href="/restaurants">
                <Button>Browse Restaurants</Button>
              </Link>
            }
          />
        )}

        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const itemCount = (order.items || order.orderItems || []).length
            const amount = order.total ?? order.totalAmount ?? 0
            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <OrderCard
                  id={order.id}
                  restaurantName={order.restaurant?.name || 'Restaurant'}
                  restaurantImage={order.restaurant?.imageUrl}
                  status={order.status}
                  amount={amount}
                  itemCount={itemCount}
                  createdAt={order.createdAt}
                />
              </Link>
            )
          })}
        </div>
      </Container>
    </MobileScreenFrame>
  )
}
