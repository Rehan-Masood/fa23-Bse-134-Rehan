'use client'

import { useState } from 'react'
import { Star, Clock, MapPin, Heart, ShoppingCart, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { MenuItem } from '@/types'
import { useCartStore } from '@/stores/cart'
import { ImageWithFallback } from '@/components/image-with-fallback'
import { useMenu, useRestaurant } from '@/hooks'
import toast from 'react-hot-toast'

export default function RestaurantPage({
  params,
}: {
  params: { slug: string }
}) {
  // Use API to fetch real menu items instead of hardcoded data
  // The slug should be the restaurant ID
  const restaurantId = params.slug
  const { data: menuData, isLoading } = useMenu(restaurantId)
  const { data: restaurantData } = useRestaurant(restaurantId)
  const restaurant = restaurantData?.data ?? restaurantData
  
  const menuItems: MenuItem[] = (menuData?.data || menuData || []).map((item: any) => ({
    id: item.id,
    restaurantId: item.restaurantId,
    name: item.name,
    price: item.price,
    description: item.description,
    image: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
    category: item.category?.name || 'Other',
    isAvailable: item.isAvailable,
    isVegetarian: false,
    spicyLevel: 'medium',
    rating: item.averageRating || 4.5,
    reviewCount: 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }))

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  )
  
  // Initialize with first category or empty string
  const [selectedCategory, setSelectedCategory] = useState<string>(() => categories[0] || '')
  
  const { cart, addItem, removeItem, updateQuantity } = useCartStore()

  const filteredItems = selectedCategory ? menuItems.filter(
    (item) => item.category === selectedCategory
  ) : menuItems

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      restaurantId: item.restaurantId,
    })
    toast.success(`${item.name} added to cart!`)
  }

  const cartItems = cart?.items || []
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Restaurant Header */}
      <div className="relative h-72 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&h=400&fit=crop"
          alt="Restaurant"
          className="w-full h-full object-cover"
          type="restaurant"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container-premium">
            <h1 className="text-4xl font-bold mb-2">{restaurant?.name || 'Restaurant Details'}</h1>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span>{restaurant?.rating?.toFixed?.(1) || '4.5'} rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant ? `${restaurant.deliveryTimeMin}-${restaurant.deliveryTimeMax}` : '30'} min delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant?.address || 'Food Express partner'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-premium py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="card-premium p-4 flex gap-4 hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                      type="food"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                            {item.name}
                          </h3>
                          {item.isVegetarian && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              🌱 Vegetarian
                            </span>
                          )}
                        </div>
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {item.description}
                      </p>
                      {item.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {item.rating} ({item.reviewCount})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price and Add Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        Rs {item.price.toFixed(0)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="card-premium p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Order Summary
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No items added yet
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Rs {item.price.toFixed(0)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-medium text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              removeItem(item.id)
                              toast.success('Item removed')
                            }}
                            className="ml-2 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Subtotal
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        Rs {cartTotal.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Delivery Fee
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        Rs 299
                      </span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold">
                      <span className="text-slate-900 dark:text-white">Total</span>
                      <span className="text-primary-600">
                        Rs {(cartTotal + 299).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout" className="btn-primary w-full mt-4 inline-block text-center">
                    Proceed to Checkout
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
