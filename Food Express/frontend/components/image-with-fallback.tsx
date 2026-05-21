'use client'

import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'

const DEFAULT_IMAGES = {
  food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
  pizza: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
  sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop',
  restaurant: 'https://images.unsplash.com/photo-1544025162-d76694cb3da7?w=400&h=400&fit=crop',
  bread: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd6dcf2?w=400&h=400&fit=crop',
}

interface ImageWithFallbackProps {
  src?: string | null
  alt: string
  className?: string
  type?: keyof typeof DEFAULT_IMAGES
  priority?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  className = 'w-full h-full object-cover',
  type = 'food',
  priority = false,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(!src)
  const fallbackImage = DEFAULT_IMAGES[type]
  const imageUrl = !hasError && src ? src : fallbackImage

  return (
    <div className="relative overflow-hidden bg-slate-200 dark:bg-slate-700">
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
        loading={priority ? 'eager' : 'lazy'}
      />
      {hasError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <UtensilsCrossed className="w-8 h-8 text-slate-400" />
        </div>
      )}
    </div>
  )
}
