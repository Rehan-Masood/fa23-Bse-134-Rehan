'use client'

import { useState } from 'react'
import type React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.post('/auth/register', { name, email, phone, password, confirmPassword })
      const authData = response.data?.data ?? response.data
      const accessToken = authData?.accessToken
      const userFromApi = authData?.user

      if (!accessToken || !userFromApi?.id) {
        throw new Error('Invalid signup response from server')
      }

      setToken(accessToken)
      setUser({
        id: userFromApi.id,
        email: userFromApi.email,
        name: userFromApi.name,
        phone: userFromApi.phone,
        role: userFromApi.role,
        createdAt: userFromApi.createdAt || new Date().toISOString(),
        updatedAt: userFromApi.updatedAt || new Date().toISOString(),
      })

      toast.success('Account created')
      router.push('/')
    } catch (error: any) {
      setToken(null)
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error.response?.data?.message || error.message || 'Signup failed'
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
          <h1 className="mb-4 text-4xl font-bold">Your favorite meals, delivered fast.</h1>
          <p className="text-slate-300">Create a customer account and start ordering from the premium Food Express marketplace.</p>
        </section>

        <section className="rounded-2xl bg-white p-8 text-slate-950 shadow-2xl">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary-600">Create account</p>
            <h2 className="mt-2 text-3xl font-bold">Join Food Express</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={<User />} label="Full name" value={name} onChange={setName} />
            <Field icon={<Mail />} label="Email" type="email" value={email} onChange={setEmail} />
            <Field icon={<Phone />} label="Phone" type="tel" value={phone} onChange={setPhone} />

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

            <Field icon={<Lock />} label="Confirm password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={setConfirmPassword} />

            <button className="btn-primary w-full gap-2" disabled={isLoading} type="submit">
              {isLoading ? 'Creating account...' : 'Create account'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? <Link className="font-semibold text-primary-600" href="/login">Login</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = 'text',
}: {
  icon: React.ReactElement
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <span className="relative block">
        <span className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">{icon}</span>
        <input aria-label={label} className="input-field pl-10" type={type} value={value} onChange={(event) => onChange(event.target.value)} required />
      </span>
    </label>
  )
}
