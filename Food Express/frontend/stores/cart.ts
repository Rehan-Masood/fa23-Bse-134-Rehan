import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ClientCart {
  items: CartItem[]
  total?: number
}

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  restaurantId?: string
  menuItemId?: string
}

interface CartState {
  cart: ClientCart | null
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setCart: (cart: ClientCart) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      addItem: (item) =>
        set((state) => {
          if (!state.cart) {
            // Create new cart if doesn't exist
            return {
              cart: {
                items: [item],
                total: item.price * item.quantity,
              },
            }
          }
          const existingItem = state.cart.items.find((i) => i.id === item.id)
          if (existingItem) {
            const updatedItems = state.cart.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
            const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
            return {
              cart: {
                ...state.cart,
                items: updatedItems,
                total: newTotal,
              },
            }
          }
          const newItems = [...state.cart.items, item]
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return {
            cart: {
              ...state.cart,
              items: newItems,
              total: newTotal,
            },
          }
        }),
      removeItem: (itemId) =>
        set((state) => {
          if (!state.cart) return state
          const updatedItems = state.cart.items.filter((i) => i.id !== itemId)
          const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return {
            cart: {
              ...state.cart,
              items: updatedItems,
              total: newTotal,
            },
          }
        }),
      updateQuantity: (itemId, quantity) =>
        set((state) => {
          if (!state.cart) return state
          const finalQuantity = Math.max(1, quantity)
          const updatedItems = state.cart.items.map((i) =>
            i.id === itemId ? { ...i, quantity: finalQuantity } : i
          )
          const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return {
            cart: {
              ...state.cart,
              items: updatedItems,
              total: newTotal,
            },
          }
        }),
      clearCart: () => set({ cart: null }),
      setCart: (cart) => set({ cart }),
    }),
    {
      name: 'food-express-cart',
    }
  )
)

