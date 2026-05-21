import React from 'react'

export const LoadingSkeleton: React.FC<{ count?: number; className?: string }> = ({ count = 3, className }) => {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-slate-200 dark:bg-slate-700 h-48 animate-pulse"></div>
      ))}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  text?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, text, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      {text && <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">{text}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  action?: React.ReactNode
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this section.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 text-5xl">⚠️</div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
