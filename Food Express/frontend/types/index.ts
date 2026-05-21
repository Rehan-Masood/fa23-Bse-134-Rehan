export type User = {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_PERSON' | 'customer' | 'admin' | 'delivery_person'
  createdAt: string
  updatedAt: string
}

export type Restaurant = {
  id: string
  name: string
  slug: string
  image: string
  description: string
  cuisine: string[]
  rating: number
  reviewCount: number
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  isOpen: boolean
  address: string
  phone: string
  createdAt: string
  updatedAt: string
}

export type MenuItem = {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  isVegetarian: boolean
  spicyLevel: 'mild' | 'medium' | 'spicy'
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export type CartItem = {
  id: string
  menuItemId?: string
  restaurantId?: string
  quantity: number
  price: number
  name: string
  image: string
  customizations?: string[]
  notes?: string
  menuItem?: MenuItem
}

export type Cart = {
  id: string
  userId: string
  items: CartItem[]
  restaurantId: string
  subtotal: number
  tax: number
  deliveryFee: number
  discount: number
  total: number
  promoCode?: string
}

export type Order = {
  id: string
  userId: string
  restaurantId: string
  items: CartItem[]
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
  deliveryAddress: string
  deliveryPhone: string
  subtotal: number
  tax: number
  deliveryFee: number
  discount: number
  total: number
  estimatedDeliveryTime: string
  actualDeliveryTime?: string
  notes?: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export type Review = {
  id: string
  userId: string
  restaurantId?: string
  menuItemId?: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export type Reservation = {
  id: string
  userId: string
  restaurantId: string
  partySize: number
  dateTime: string
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  updatedAt: string
}
