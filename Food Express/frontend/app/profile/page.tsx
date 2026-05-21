'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User, Phone, Mail, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Container, PageHeader, MobileScreenFrame, Section } from '@/components/ui/layout'
import { ErrorState } from '@/components/ui/states'
import Link from 'next/link'

interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: string
  createdAt: string
}

interface UserAddress {
  id: string
  label?: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadProfile()
  }, [user])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load user profile
      const profileRes = await apiClient.get('/auth/profile')
      const profileData = profileRes.data?.data ?? profileRes.data
      setProfile(profileData)

      // Try to load addresses if available
      try {
        const addressRes = await apiClient.get('/addresses')
        setAddresses(addressRes.data?.data ?? addressRes.data ?? [])
      } catch (err) {
        // Addresses not available yet, that's okay
        console.log('Addresses not available yet')
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load profile'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (!user) {
    return (
      <MobileScreenFrame>
        <Container className="py-12">
          <ErrorState
            title="Please log in"
            message="You need to be logged in to view your profile"
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

  return (
    <MobileScreenFrame>
      <Container className="py-8">
        <PageHeader title="My Profile" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Personal Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Name</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{profile?.name || user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Email</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{profile?.email || user.email}</p>
                </div>
                {profile?.phone && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Phone</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{profile.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Role</p>
                  <p className="font-semibold text-slate-900 dark:text-white capitalize">{user.role?.toLowerCase().replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Member Since</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(profile?.createdAt || user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            {addresses.length > 0 && (
              <Section title="Saved Addresses">
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <Card key={address.id} interactive>
                      <CardContent className="py-4">
                        <div className="flex gap-3">
                          <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <p className="font-semibold text-slate-900 dark:text-white">{address.label || 'Address'}</p>
                              {address.isDefault && (
                                <span className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {address.street}, {address.city}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                              {address.state} {address.postalCode}, {address.country}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>
            )}

            {/* Logout Button */}
            <Button variant="danger" size="lg" onClick={handleLogout} className="w-full">
              <LogOut size={18} className="mr-2" />
              Log Out
            </Button>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-white">Quick Stats</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-3xl font-bold text-primary-600">5</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                </div>
                <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-3xl font-bold text-green-600">₹2,450</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">4.8</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </MobileScreenFrame>
  )
}
