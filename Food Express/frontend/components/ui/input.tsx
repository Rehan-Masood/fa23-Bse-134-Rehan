import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
              startIcon ? 'pl-10' : ''
            } ${endIcon ? 'pr-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
