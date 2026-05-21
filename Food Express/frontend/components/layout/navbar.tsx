'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/theme-toggle'
import { AccountButton, Avatar } from '@/components/avatar'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { theme } = useTheme()

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-lg ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'} border-b border-slate-200/20 dark:border-slate-700/20 shadow-glass`}>
      <div className="container-premium">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl bg-gradient-premium bg-clip-text text-transparent">
            🍕 Food Express
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/restaurants" className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Restaurants
            </Link>
            <Link href="/orders" className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Orders
            </Link>
            {user?.role && (user.role === 'ADMIN' || user.role === 'admin') && (
              <Link href="/admin" className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                Admin
              </Link>
            )}
            {user?.role === 'DELIVERY_PERSON' && (
              <Link href="/delivery" className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                Delivery
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ShoppingCart size={20} className="text-slate-700 dark:text-slate-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar name={user.name} avatar={user.avatar} size="sm" />
                <button
                  onClick={async () => {
                    try {
                      await apiClient.post('/auth/logout')
                    } catch {
                      // Continue with local logout even if server logout fails
                    }
                    logout()
                    window.location.href = '/'
                  }}
                  className="text-sm px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } pb-4 border-t border-slate-200/20 dark:border-slate-700/20`}
        >
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/restaurants" className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              Restaurants
            </Link>
            <Link href="/orders" className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              Orders
            </Link>
            {user?.role && (user.role === 'ADMIN' || user.role === 'admin') && (
              <Link href="/admin" className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium">
                Admin
              </Link>
            )}
            {user?.role === 'DELIVERY_PERSON' && (
              <Link href="/delivery" className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium">
                Delivery
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
