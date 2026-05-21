import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { apiClient } from '@/lib/api-client'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, name: string, password: string, phone?: string, confirmPassword?: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post('/auth/login', {
            email,
            password,
          })
          
          const authData = response.data?.data ?? response.data
          const accessToken = authData?.accessToken
          const userFromApi = authData?.user

          if (!accessToken || !userFromApi?.id) {
            throw new Error('Invalid login response from server')
          }

          set({ token: accessToken, user: userFromApi, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      signup: async (email: string, name: string, password: string, phone?: string, confirmPassword?: string) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post('/auth/register', {
            name,
            email,
            phone: phone || null,
            password,
            confirmPassword: confirmPassword || password,
          })
          
          const authData = response.data?.data ?? response.data
          const accessToken = authData?.accessToken
          const userFromApi = authData?.user

          if (!accessToken || !userFromApi?.id) {
            throw new Error('Invalid signup response from server')
          }

          set({ token: accessToken, user: userFromApi, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      logout: () => {
        // Clear user and token on logout
        set({ user: null, token: null })
        // CRITICAL: Clear cart on logout to prevent data leakage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('food-express-cart')
          // Explicitly clear the auth store from localStorage
          localStorage.removeItem('auth-store')
        }
      },
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-store',
    }
  )
)
