import React from 'react'
import { Check, Clock, AlertCircle } from 'lucide-react'
import { Badge } from './badge'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

interface TimelineStep {
  status: OrderStatus
  label: string
  completed: boolean
  timestamp?: string
}

export const OrderTimeline: React.FC<{ currentStatus: OrderStatus }> = ({ currentStatus }) => {
  const steps: TimelineStep[] = [
    { status: 'PENDING', label: 'Order Placed', completed: true },
    { status: 'CONFIRMED', label: 'Confirmed', completed: ['CONFIRMED', 'PREPARING', 'READY', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus) },
    { status: 'PREPARING', label: 'Preparing', completed: ['PREPARING', 'READY', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus) },
    { status: 'READY', label: 'Ready', completed: ['READY', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus) },
    { status: 'PICKED_UP', label: 'Picked Up', completed: ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus) },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus) },
    { status: 'DELIVERED', label: 'Delivered', completed: currentStatus === 'DELIVERED' },
  ]

  return (
    <div className="py-8">
      <div className="flex items-start gap-4">
        {steps.map((step, index) => (
          <div key={step.status} className="flex flex-col items-center gap-2 flex-1">
            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                step.completed
                  ? 'bg-green-500 text-white'
                  : step.status === currentStatus
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {step.completed ? <Check size={20} /> : index + 1}
            </div>

            {/* Step Label */}
            <span
              className={`text-xs font-medium text-center ${
                step.completed || step.status === currentStatus
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {step.label}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-0.5 h-12 ${
                  step.completed ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface OrderCardProps {
  id: string
  restaurantName: string
  restaurantImage?: string
  status: OrderStatus
  amount: number
  itemCount: number
  createdAt: string
  onClick?: () => void
}

export const OrderCard: React.FC<OrderCardProps> = ({
  id,
  restaurantName,
  restaurantImage,
  status,
  amount,
  itemCount,
  createdAt,
  onClick,
}) => {
  const getStatusColor = (status: OrderStatus): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple' => {
    switch (status) {
      case 'DELIVERED':
        return 'success'
      case 'CANCELLED':
        return 'danger'
      case 'PENDING':
      case 'CONFIRMED':
        return 'warning'
      case 'PICKED_UP':
      case 'OUT_FOR_DELIVERY':
        return 'purple'
      default:
        return 'neutral'
    }
  }

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      PREPARING: 'Preparing',
      READY: 'Ready',
      ASSIGNED: 'Assigned',
      PICKED_UP: 'Picked Up',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    }
    return labels[status]
  }

  const date = new Date(createdAt)
  const dateStr = date.toLocaleDateString()
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex gap-4">
        {restaurantImage && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={restaurantImage}
              alt={restaurantName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{restaurantName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{itemCount} items</p>
            </div>
            <Badge variant={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {dateStr} at {timeStr}
            </p>
            <p className="font-bold text-slate-900 dark:text-white">₹{amount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
