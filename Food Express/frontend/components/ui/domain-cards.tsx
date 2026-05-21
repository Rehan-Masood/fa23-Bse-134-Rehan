import React from 'react'
import { Star, Clock, MapPin, Truck } from 'lucide-react'
import { Card, CardContent } from './card'
import { ImageWithFallback } from '@/components/image-with-fallback'

interface RestaurantCardProps {
  id: string
  name: string
  image?: string
  rating?: number
  reviews?: number
  deliveryTime?: number
  deliveryFee?: number
  cuisine?: string
  isOpen?: boolean
  onClick?: () => void
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  image,
  rating = 4.5,
  reviews = 100,
  deliveryTime = 30,
  deliveryFee = 299,
  cuisine = 'Multi-cuisine',
  isOpen = true,
  onClick,
}) => {
  return (
    <Card
      interactive
      onClick={onClick}
      className="overflow-hidden h-full flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          type="restaurant"
        />
        {!isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Closed</span>
          </div>
        )}
      </div>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">{name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{cuisine}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span>({reviews})</span>
          </div>
        </div>

        <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{deliveryTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>₹{deliveryFee}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MenuItemCardProps {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  isVegetarian?: boolean
  rating?: number
  onAddClick?: () => void
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  isVegetarian = false,
  rating = 4.5,
  onAddClick,
}) => {
  return (
    <Card
      interactive
      onClick={onAddClick}
      className="overflow-hidden flex flex-row gap-3 h-auto"
    >
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          type="food"
        />
      </div>
      <CardContent className="flex-1 flex flex-col justify-between py-3 px-4">
        <div>
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex-1">{name}</h3>
            {isVegetarian && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">🥬 Veg</span>
            )}
          </div>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white">₹{price}</span>
          {rating && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface CartItemRowProps {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  id,
  name,
  price,
  quantity,
  image,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="flex gap-4 py-4 border-b border-slate-200 dark:border-slate-700">
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          type="food"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{name}</h4>
          <p className="text-primary-600 font-semibold text-sm">₹{(price * quantity).toLocaleString()}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-1">
            <button
              onClick={() => onQuantityChange?.(quantity - 1)}
              className="text-slate-600 dark:text-slate-300 font-bold"
            >
              −
            </button>
            <span className="text-slate-900 dark:text-white font-semibold text-sm w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange?.(quantity + 1)}
              className="text-slate-600 dark:text-slate-300 font-bold"
            >
              +
            </button>
          </div>
          <button
            onClick={onRemove}
            className="text-red-600 dark:text-red-400 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
