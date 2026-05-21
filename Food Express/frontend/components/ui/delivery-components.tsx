import React from 'react'
import { MapPin, Clock, DollarSign, Phone } from 'lucide-react'
import { Card, CardContent } from './card'
import { Badge } from './badge'

interface DeliveryOrderCardProps {
  id: string
  restaurantName: string
  customerPhone?: string
  pickupAddress: string
  deliveryAddress: string
  amount: number
  itemCount: number
  estimatedTime?: number
  onAccept?: () => void
  onDecline?: () => void
  isAccepted?: boolean
}

export const DeliveryOrderCard: React.FC<DeliveryOrderCardProps> = ({
  id,
  restaurantName,
  customerPhone,
  pickupAddress,
  deliveryAddress,
  amount,
  itemCount,
  estimatedTime,
  onAccept,
  onDecline,
  isAccepted = false,
}) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-800">
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{restaurantName}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{itemCount} items • ₹{amount}</p>
          </div>
          {isAccepted && <Badge variant="purple">Accepted</Badge>}
        </div>

        {/* Locations */}
        <div className="space-y-3 bg-white/50 dark:bg-slate-700/50 p-3 rounded-lg">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Pickup</p>
              <p className="text-sm text-slate-900 dark:text-white">{pickupAddress}</p>
            </div>
          </div>

          <div className="border-l-2 border-dashed border-slate-300 dark:border-slate-600 ml-2 h-6"></div>

          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Delivery</p>
              <p className="text-sm text-slate-900 dark:text-white">{deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex gap-4 text-sm">
          {estimatedTime && (
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock size={16} />
              <span>{estimatedTime} min</span>
            </div>
          )}
          {customerPhone && (
            <a
              href={`tel:${customerPhone}`}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <Phone size={16} />
              <span>Call</span>
            </a>
          )}
        </div>

        {/* Actions */}
        {!isAccepted && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2.5 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 font-semibold transition"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold transition"
            >
              Accept
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DeliveryMapPlaceholderProps {
  title?: string
  subtitle?: string
}

export const DeliveryMapPlaceholder: React.FC<DeliveryMapPlaceholderProps> = ({
  title = 'Live Tracking',
  subtitle = 'Maps integration available in premium version',
}) => {
  return (
    <div className="w-full h-80 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center flex-col gap-3">
      <div className="text-5xl">🗺️</div>
      <div className="text-center">
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  )
}

interface DeliveryEarningsCardProps {
  period: string
  earnings: number
  completedOrders?: number
  distance?: number
  onlineHours?: number
}

export const DeliveryEarningsCard: React.FC<DeliveryEarningsCardProps> = ({
  period,
  earnings,
  completedOrders,
  distance,
  onlineHours,
}) => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{period}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹{earnings}</p>
          </div>
          <DollarSign className="w-10 h-10 text-green-600 opacity-50" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          {completedOrders !== undefined && (
            <div className="text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">Orders</p>
              <p className="font-bold text-slate-900 dark:text-white">{completedOrders}</p>
            </div>
          )}
          {distance !== undefined && (
            <div className="text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">Distance</p>
              <p className="font-bold text-slate-900 dark:text-white">{distance} km</p>
            </div>
          )}
          {onlineHours !== undefined && (
            <div className="text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">Hours</p>
              <p className="font-bold text-slate-900 dark:text-white">{onlineHours}h</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
