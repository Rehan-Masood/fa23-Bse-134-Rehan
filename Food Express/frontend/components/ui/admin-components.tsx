import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from './card'

interface AdminMetricCardProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendPercent?: number
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

export const AdminMetricCard: React.FC<AdminMetricCardProps> = ({
  label,
  value,
  trend,
  trendPercent,
  icon,
  color = 'primary',
}) => {
  const colorStyles = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600',
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          {icon && <div className={`p-3 rounded-lg ${colorStyles[color]}`}>{icon}</div>}
          {trend && trendPercent !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                trend === 'up'
                  ? 'text-green-600'
                  : trend === 'down'
                    ? 'text-red-600'
                    : 'text-slate-600'
              }`}
            >
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {trendPercent}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface AdminDataTableProps {
  columns: {
    key: string
    label: string
    width?: string
    render?: (value: any, row: any) => React.ReactNode
  }[]
  data: any[]
  isLoading?: boolean
  isEmpty?: boolean
}

export const AdminDataTable: React.FC<AdminDataTableProps> = ({
  columns,
  data,
  isLoading,
  isEmpty,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (isEmpty || data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">No data available</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm ${
                  col.width ? col.width : ''
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              {columns.map((col) => (
                <td
                  key={`${idx}-${col.key}`}
                  className={`py-3 px-4 text-sm text-slate-900 dark:text-white ${
                    col.width ? col.width : ''
                  }`}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface AdminSidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

export const AdminSidebarItem: React.FC<AdminSidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition ${
        active
          ? 'bg-primary-600 text-white'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <div className="text-lg">{icon}</div>
      <span>{label}</span>
    </button>
  )
}
