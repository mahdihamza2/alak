import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    icon: 'text-blue-600',
    value: 'text-blue-700',
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    icon: 'text-green-600',
    value: 'text-green-700',
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    icon: 'text-orange-600',
    value: 'text-orange-700',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    icon: 'text-purple-600',
    value: 'text-purple-700',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    icon: 'text-red-600',
    value: 'text-red-700',
  },
}

export default function StatsCard({ title, value, icon: Icon, trend, color = 'blue' }: StatsCardProps) {
  const styles = colorStyles[color]

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${styles.value}`}>{value}</p>
          {trend && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-neutral-400 ml-1">vs last month</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <Icon size={24} className={styles.icon} />
        </div>
      </div>
    </div>
  )
}
