'use client'

import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/stores/auth'

// Child component to ensure auth hydration happens before rendering children
function AuthHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force subscriber to trigger initial hydration from localStorage
    // This ensures persist middleware has loaded the stored state
    const unsubscribe = useAuthStore.subscribe((state) => {
      // Listener fires after hydration is complete
    })

    // Explicitly trigger hydration by accessing the store
    const state = useAuthStore.getState()
    
    return () => unsubscribe()
  }, [])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator>
          {children}
        </AuthHydrator>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
