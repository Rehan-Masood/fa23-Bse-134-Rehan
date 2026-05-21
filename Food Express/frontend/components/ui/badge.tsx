import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple'
  children?: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    }

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]} ${className || ''}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
