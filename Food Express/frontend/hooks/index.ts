import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

// Hook for fetching restaurants
export function useRestaurants(search?: string, cuisine?: string) {
  return useQuery({
    queryKey: ['restaurants', search, cuisine],
    queryFn: async () => {
      const response = await apiClient.get('/restaurants', {
        params: { search, cuisine },
      })
      return response.data
    },
  })
}

// Hook for fetching restaurant details
export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const response = await apiClient.get(`/restaurants/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Hook for fetching menu
export function useMenu(restaurantId: string) {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: async () => {
      const response = await apiClient.get(`/restaurants/${restaurantId}/menu`)
      return response.data
    },
    enabled: !!restaurantId,
  })
}

// Hook for user orders
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders')
      return response.data
    },
  })
}

// Hook for order details
export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Hook for creating order
export function useCreateOrder() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/orders', data)
      return response.data
    },
  })
}

// Hook for admin dashboard
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard')
      return response.data
    },
  })
}

// Hook for all admin orders
export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/orders')
      return response.data
    },
  })
}

// Hook for user profile
export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.get('/users/profile')
      return response.data
    },
  })
}

// Hook for smooth scroll
export function useSmoothScroll() {
  const scroll = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }
  return { scroll }
}

// Hook for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key)
      if (item) {
        try {
          setStoredValue(JSON.parse(item))
        } catch (error) {
          console.error('Error parsing localStorage:', error)
        }
      }
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  }

  return [storedValue, setValue] as const
}

// Hook for debouncing
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Hook for managing form state
export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [state, setState] = useState(initialState)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const reset = () => setState(initialState)

  return { state, setState, handleChange, reset }
}
