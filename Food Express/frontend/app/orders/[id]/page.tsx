'use client'

import { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Container, MobileScreenFrame } from '@/components/ui/layout'
import { OrderTimeline } from '@/components/ui/order-components'
import { DeliveryMapPlaceholder } from '@/components/ui/delivery-components'
import { LoadingSkeleton, ErrorState } from '@/components/ui/states'
import { ImageWithFallback } from '@/components/image-with-fallback'
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

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  menuItem?: { name: string; imageUrl?: string }
}

interface Order {
  id: string
  restaurantId: string
  restaurant?: { name: string; imageUrl?: string }
  status: OrderStatus
  items: OrderItem[]
  orderItems?: OrderItem[]
  total: number
  totalAmount?: number
  subtotal: number
  tax: number
  deliveryFee: number
  deliveryAddress: string
  deliveryPhone: string
  notes?: string
  paymentMethod?: string
  estimatedDeliveryTime?: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailPage() {
  const { user } = useAuthStore()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrder = useCallback(async () => {
    if (!user || !orderId) return

    try {
      setIsLoading((prev) => (order ? false : prev))
      setError(null)
      const response = await apiClient.get(`/orders/${orderId}`)
      setOrder(response.data?.data ?? response.data)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load order details'
      setError(message)
      if (!order) toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [user, orderId])

  useEffect(() => {
    loadOrder()
    // Poll for updates every 10 seconds for live tracking feel
    const interval = setInterval(loadOrder, 10000)
    return () => clearInterval(interval)
  }, [loadOrder])

  if (!user) {
    return (
      <MobileScreenFrame>
        <Container className="py-12">
          <ErrorState
            title="Please log in"
            message="You need to be logged in to view order details"
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

  if (isLoading) {
    return (
      <MobileScreenFrame>
        <Container className="py-8">
          <div className="mb-6">
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <LoadingSkeleton count={2} />
        </Container>
      </MobileScreenFrame>
    )
  }

  if (error || !order) {
    return (
      <MobileScreenFrame>
        <Container className="py-8">
          <div className="mb-6">
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <ErrorState
            title="Order not found"
            message={error || 'Could not load order details'}
            action={
              <Button onClick={loadOrder} variant="secondary">
                Try Again
              </Button>
            }
          />
        </Container>
      </MobileScreenFrame>
    )
  }

  const displayItems = order.items || order.orderItems || []
  const total = order.total ?? order.totalAmount ?? 0

  return (
    <MobileScreenFrame>
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-white">Order Status</h3>
              </CardHeader>
              <CardContent>
                <OrderTimeline currentStatus={order.status} />
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <DeliveryMapPlaceholder />

            {/* Items */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-white">Order Items</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayItems.map((item, idx) => {
                    const itemName = item.name || item.menuItem?.name || 'Item'
                    const itemImage = item.image || item.menuItem?.imageUrl
                    return (
                      <div
                        key={item.id || idx}
                        className="flex gap-3 pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0"
                      >
                        {itemImage && (
                          <ImageWithFallback
                            src={itemImage}
                            alt={itemName}
                            className="w-16 h-16 rounded-lg object-cover"
                            type="food"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white">{itemName}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {item.quantity} × ₹{item.price}
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            ₹{(item.quantity * item.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Instructions */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-slate-900 dark:text-white">Delivery Instructions</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Restaurant Info */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-white">Restaurant</h3>
              </CardHeader>
              <CardContent>
                {order.restaurant?.imageUrl && (
                  <ImageWithFallback
                    src={order.restaurant.imageUrl}
                    alt={order.restaurant?.name || 'Restaurant'}
                    className="w-full h-32 rounded-lg object-cover mb-3"
                    type="restaurant"
                  />
                )}
                <p className="font-bold text-slate-900 dark:text-white">
                  {order.restaurant?.name || 'Restaurant'}
                </p>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-white">Delivery Address</h3>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{order.deliveryAddress}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            {order.deliveryPhone && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-slate-900 dark:text-white">Contact</h3>
                </CardHeader>
                <CardContent>
                  <a
                    href={`tel:${order.deliveryPhone}`}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Phone size={16} />
                    {order.deliveryPhone}
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-white">Price Breakdown</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="text-slate-900 dark:text-white">
                    ₹{(order.subtotal || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Tax</span>
                  <span className="text-slate-900 dark:text-white">
                    ₹{(order.tax || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Delivery</span>
                  <span className="text-slate-900 dark:text-white">
                    ₹{(order.deliveryFee || 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">Total</span>
                  <span className="text-primary-600">₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            {order.paymentMethod && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-slate-900 dark:text-white">Payment Method</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 capitalize">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Estimated Delivery */}
            {order.estimatedDeliveryTime && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-slate-900 dark:text-white">Estimated Delivery</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">
                    {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </MobileScreenFrame>
  )
}
