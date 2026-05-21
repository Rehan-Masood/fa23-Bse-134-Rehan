'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, CreditCard, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PageHeader, Container, Section, MobileScreenFrame } from '@/components/ui/layout'
import { ErrorState, EmptyState } from '@/components/ui/states'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { cart, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return (
      <MobileScreenFrame>
        <Container className="py-12">
          <ErrorState
            title="Please log in"
            message="You need to be logged in to checkout"
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <MobileScreenFrame>
        <Container className="py-12">
          <EmptyState
            title="Your cart is empty"
            text="Add some items before checking out"
            action={
              <Link href="/restaurants">
                <Button>Browse Restaurants</Button>
              </Link>
            }
          />
        </Container>
      </MobileScreenFrame>
    )
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 299
  const tax = subtotal * 0.05
  const total = subtotal + deliveryFee + tax - promoDiscount

  const applyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code')
      return
    }

    try {
      setIsLoading(true)
      // Static promo validation — backend validates on order creation
      const code = promoCode.toUpperCase()
      const discount = code === 'WELCOME50' ? subtotal * 0.5 : code === 'FLAT100' ? 100 : 0
      if (discount > 0) {
        setPromoDiscount(discount)
        toast.success(`Promo applied! Saving ₹${Math.round(discount)}`)
      } else {
        toast.error('Invalid promo code. Try WELCOME50 or FLAT100')
      }
    } catch {
      toast.error('Could not apply promo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address')
      return
    }

    if (!phone.trim()) {
      toast.error('Please enter phone number')
      return
    }

    try {
      setIsLoading(true)

      const orderData = {
        restaurantId: cart.items[0]?.restaurantId,
        items: cart.items.map((item) => ({
          menuItemId: item.menuItemId || item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        deliveryAddress,
        deliveryPhone: phone,
        notes: notes.trim() || undefined,
        promoCode: promoCode.trim() || undefined,
        paymentMethod: 'CASH_ON_DELIVERY',
      }

      const response = await apiClient.post('/orders', orderData)
      const order = response.data?.data ?? response.data

      toast.success('Order placed successfully!')
      clearCart()
      router.push(`/orders/${order.id}`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to place order'
      toast.error(Array.isArray(message) ? message.join(', ') : message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MobileScreenFrame>
      <Container className="py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <PageHeader title="Checkout" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Section title="Delivery Address">
              <Input
                label="Address"
                placeholder="Enter your full delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                startIcon={<MapPin size={18} />}
              />
            </Section>

            {/* Contact Info */}
            <Section title="Contact Information">
              <Input
                label="Phone Number"
                placeholder="Your phone number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Section>

            {/* Delivery Instructions */}
            <Section title="Delivery Instructions">
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Any special instructions for delivery? (Optional)"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Section>

            {/* Promo Code */}
            <Section title="Promo Code">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code (e.g., WELCOME50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="mb-0"
                />
                <Button
                  variant="secondary"
                  onClick={applyPromo}
                  disabled={isLoading}
                  className="mt-auto"
                >
                  Apply
                </Button>
              </div>
              {promoDiscount > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✓ Promo applied! Saving ₹{Math.round(promoDiscount)}
                </p>
              )}
            </Section>

            {/* Payment Method */}
            <Section title="Payment Method">
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-primary-600" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Cash on Delivery</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Pay when order arrives</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Order Summary</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                    <span className="text-slate-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Tax (5%)</span>
                    <span className="text-slate-900 dark:text-white">₹{Math.round(tax).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Delivery</span>
                    <span className="text-slate-900 dark:text-white">₹{deliveryFee}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span>-₹{Math.round(promoDiscount).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-slate-900 dark:text-white">Total</span>
                    <span className="text-primary-600">₹{Math.round(total).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  isLoading={isLoading}
                  size="lg"
                >
                  <Zap size={18} className="mr-2" />
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </MobileScreenFrame>
  )
}
