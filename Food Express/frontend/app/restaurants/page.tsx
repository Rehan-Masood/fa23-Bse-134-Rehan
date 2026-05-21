'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, MapPin, Search } from 'lucide-react'
import { useRestaurants } from '@/hooks'
import { RestaurantCard } from '@/components/ui/domain-cards'
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ui/states'
import { Container, MobileScreenFrame, Section } from '@/components/ui/layout'
import { Button } from '@/components/ui/button'

const cuisines = ['All', 'Pizza', 'Burger', 'Biryani', 'Dessert', 'Beverage']

export default function RestaurantsPage() {
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('All')
  const { data, isLoading, error } = useRestaurants(search, cuisine)
  const restaurants = data?.data ?? data ?? []

  return (
    <MobileScreenFrame>
      <Container className="py-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-primary-600" />
              Deliver to
            </p>
            <h1 className="text-lg font-bold text-slate-950 dark:text-white">Home, 123 Main Street</h1>
          </div>
          <button className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>
        </header>

        {/* Search */}
        <section className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="h-14 w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Search restaurants, cuisines..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        {/* Promo Banner */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white shadow-xl">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Welcome50</p>
            <h2 className="mt-2 text-3xl font-bold">50% off your first order</h2>
            <p className="mt-2 text-sm text-white/80">Apply the promo code during checkout on eligible orders.</p>
          </div>
        </section>

        {/* Cuisine Filter */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {cuisines.map((item) => (
            <button
              key={item}
              onClick={() => setCuisine(item)}
              className={`min-w-fit rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition ${
                cuisine === item
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <Section title="Popular Restaurants">
          <p className="text-slate-600 dark:text-slate-400 mb-6">Order something excellent</p>

          {/* Loading */}
          {isLoading && <LoadingSkeleton count={3} />}

          {/* Error */}
          {error && !isLoading && (
            <ErrorState
              title="Could not load restaurants"
              message="Check that the backend is running on port 3001."
              action={
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              }
            />
          )}

          {/* Empty */}
          {!isLoading && !error && restaurants.length === 0 && (
            <EmptyState
              title="No restaurants found"
              text="Try another search or category"
              action={
                <Button variant="secondary" onClick={() => setCuisine('All')}>
                  Reset Filters
                </Button>
              }
            />
          )}

          {/* Restaurant Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant: any) => (
              <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
                <RestaurantCard
                  id={restaurant.id}
                  name={restaurant.name}
                  image={restaurant.imageUrl}
                  rating={restaurant.rating || 4.5}
                  reviews={restaurant.reviewCount || 100}
                  deliveryTime={restaurant.deliveryTime || 30}
                  deliveryFee={restaurant.deliveryFee || 0}
                  cuisine={restaurant.categories?.map((c: any) => c.name).join(', ') || 'Multi-cuisine'}
                  isOpen={restaurant.isOpen !== false}
                />
              </Link>
            ))}
          </div>
        </Section>
      </Container>
    </MobileScreenFrame>
  )
}


