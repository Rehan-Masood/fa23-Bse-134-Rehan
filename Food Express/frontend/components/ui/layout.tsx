import React from 'react'

/**
 * Premium wrapper for customer screens
 * White background for mobile, clean modern design
 */
export const MobileScreenFrame: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-white dark:bg-slate-900 flex flex-col ${className}`}>
      {children}
    </div>
  )
}

/**
 * Bottom navigation for mobile app
 */
export interface BottomNavItem {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  onClick?: () => void
}

export const BottomNav: React.FC<{ items: BottomNavItem[] }> = ({ items }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="flex justify-around h-20">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center gap-1 flex-1 transition ${
              item.active
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="text-2xl">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}

/**
 * Premium app container
 */
export const Container: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Section wrapper with consistent spacing
 */
export const Section: React.FC<{
  children?: React.ReactNode
  className?: string
  title?: string
}> = ({ children, className = '', title }) => {
  return (
    <section className={`py-8 ${className}`}>
      {title && <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{title}</h2>}
      {children}
    </section>
  )
}

/**
 * Premium header for pages
 */
export const PageHeader: React.FC<{
  title: string
  subtitle?: string
  action?: React.ReactNode
}> = ({ title, subtitle, action }) => {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
