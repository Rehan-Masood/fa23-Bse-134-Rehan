'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { CartItemRow } from '@/components/ui/domain-cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Container, PageHeader, MobileScreenFrame } from '@/components/ui/layout'
import { EmptyState, ErrorState } from '@/components/ui/states'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore()
  const { user } = useAuthStore()

  if (!user) {
    return (
      <MobileScreenFrame>
        <Container className="py-12">
          <ErrorState
            title="Please log in"
            message="You need to be logged in to view your cart"
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

  const items = cart?.items || []
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 299
  const tax = subtotal * 0.05
  const total = subtotal + deliveryFee + tax

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <MobileScreenFrame>
        <Container className="py-12">
          <EmptyState
            title="Your cart is empty"
            icon="🛒"
            text="Start ordering your favorite food from our restaurants"
            action={
              <Link href="/restaurants">
                <Button size="lg">Browse Restaurants</Button>
              </Link>
            }
          />
        </Container>
      </MobileScreenFrame>
    )
  }

  return (
    <MobileScreenFrame>
      <Container className="py-8">
        <PageHeader title="Shopping Cart" subtitle="Review and customize your order" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {items.length} Item{items.length !== 1 ? 's' : ''}
                </h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                    onQuantityChange={(qty) => handleUpdateQuantity(item.id, qty)}
                    onRemove={() => {
                      removeItem(item.id)
                      toast.success('Item removed from cart')
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Order Summary</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                    <span className="text-slate-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Tax (5%)</span>
                    <span className="text-slate-900 dark:text-white">₹{Math.round(tax).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Delivery Fee</span>
                    <span className="text-slate-900 dark:text-white">₹{deliveryFee}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span className="text-slate-900 dark:text-white">Total</span>
                    <span className="text-primary-600">₹{Math.round(total).toLocaleString()}</span>
                  </div>

                  <Link href="/checkout" className="w-full block">
                    <Button className="w-full" size="lg">
                      <Zap size={18} className="mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/restaurants" className="w-full block mt-3">
                    <Button variant="outline" className="w-full" size="lg">
                      Add More Items
                    </Button>
                  </Link>

                  <button
                    onClick={() => {
                      clearCart()
                      toast.success('Cart cleared')
                    }}
                    className="w-full mt-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </MobileScreenFrame>
  )
}
