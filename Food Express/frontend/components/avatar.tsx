'use client'

import { User, Lock } from 'lucide-react'

interface AvatarProps {
  name?: string
  avatar?: string | null
  size?: 'sm' | 'md' | 'lg'
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorFromName(name?: string): string {
  if (!name) return 'bg-slate-400'
  
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ]
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export function Avatar({ name, avatar, size = 'md' }: AvatarProps) {
  const initials = getInitials(name)
  const bgColor = getColorFromName(name)
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  // If there's a real avatar URL, use it
  if (avatar && avatar.startsWith('http')) {
    return (
      <img
        src={avatar}
        alt={name || 'User'}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    )
  }

  // Use initials-based avatar
  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center font-bold text-white`}
    >
      {initials}
    </div>
  )
}

export function AccountButton({ name }: { name?: string }) {
  const initials = getInitials(name)
  const bgColor = getColorFromName(name)

  return (
    <div
      className={`${bgColor} w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-sm cursor-pointer hover:opacity-80 transition-opacity`}
    >
      {initials}
    </div>
  )
}
