import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  interactive?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm ${
        interactive ? 'cursor-pointer transition hover:shadow-md hover:-translate-y-0.5' : ''
      } ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
)

Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 border-b border-slate-200 dark:border-slate-700 ${className || ''}`} {...props}>
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 ${className || ''}`} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 border-t border-slate-200 dark:border-slate-700 ${className || ''}`} {...props}>
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'
