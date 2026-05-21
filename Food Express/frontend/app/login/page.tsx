'use client'

import { useState } from 'react'
import type React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiClient.post('/auth/login', { email, password, rememberMe })
      const authData = response.data?.data ?? response.data
      const accessToken = authData?.accessToken
      const userFromApi = authData?.user

      if (!accessToken || !userFromApi?.id) {
        throw new Error('Invalid login response from server')
      }

      setToken(accessToken)
      setUser({
        id: userFromApi.id,
        email: userFromApi.email,
        name: userFromApi.name,
        role: userFromApi.role,
        phone: userFromApi.phone,
        createdAt: userFromApi.createdAt || new Date().toISOString(),
        updatedAt: userFromApi.updatedAt || new Date().toISOString(),
      })

      toast.success('Login successful')
      router.push(userFromApi.role === 'ADMIN' ? '/admin' : userFromApi.role === 'DELIVERY_PERSON' ? '/delivery' : '/')
    } catch (error: any) {
      setToken(null)
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error.response?.data?.message || error.message || 'Login failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1fr]">
        <section className="hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl lg:block">
          <div className="mb-12 inline-flex rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold">
            Food Express
          </div>
          <h1 className="mb-4 text-4xl font-bold">Premium delivery for every role.</h1>
          <p className="text-slate-300">Customers, admins, and delivery partners all use one secure Food Express account.</p>
        </section>

        <section className="rounded-2xl bg-white p-8 text-slate-950 shadow-2xl">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary-600">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold">Log in to Food Express</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input aria-label="Email" className="input-field pl-10" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password</span>
              <span className="relative block">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input aria-label="Password" className="input-field pl-10 pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" type="button" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
              Remember me
            </label>

            <button className="btn-primary w-full gap-2" disabled={isLoading} type="submit">
              {isLoading ? 'Logging in...' : 'Login'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New here? <Link className="font-semibold text-primary-600" href="/signup">Create an account</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
