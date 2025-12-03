import { cn } from '@/lib/utils/cn'

interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: React.ReactNode
  user?: {
    name: string
    avatar?: string
  }
  type?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export default function Timeline({ items, className }: TimelineProps) {
  const getTypeStyles = (type: TimelineItem['type'] = 'default') => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-600 border-green-200'
      case 'warning':
        return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'error':
        return 'bg-red-100 text-red-600 border-red-200'
      case 'info':
        return 'bg-blue-100 text-blue-600 border-blue-200'
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200'
    }
  }

  const getLineColor = (type: TimelineItem['type'] = 'default') => {
    switch (type) {
      case 'success':
        return 'bg-green-200'
      case 'warning':
        return 'bg-orange-200'
      case 'error':
        return 'bg-red-200'
      case 'info':
        return 'bg-blue-200'
      default:
        return 'bg-neutral-200'
    }
  }

  if (items.length === 0) {
    return (
      <div className={cn('text-center py-8 text-neutral-500', className)}>
        No activity yet
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative pl-8 pb-6 last:pb-0">
          {/* Vertical Line */}
          {index < items.length - 1 && (
            <div 
              className={cn(
                'absolute left-[11px] top-6 bottom-0 w-0.5',
                getLineColor(item.type)
              )} 
            />
          )}
          
          {/* Icon/Dot */}
          <div 
            className={cn(
              'absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2',
              getTypeStyles(item.type)
            )}
          >
            {item.icon ? (
              <span className="scale-75">{item.icon}</span>
            ) : (
              <div className="w-2 h-2 rounded-full bg-current" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 text-sm">{item.title}</p>
                {item.description && (
                  <p className="text-sm text-neutral-600 mt-0.5">{item.description}</p>
                )}
              </div>
              <time className="text-xs text-neutral-400 whitespace-nowrap">
                {item.timestamp}
              </time>
            </div>
            
            {item.user && (
              <div className="flex items-center gap-2 mt-2">
                {item.user.avatar ? (
                  <img 
                    src={item.user.avatar} 
                    alt={item.user.name}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-700">
                      {item.user.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-xs text-neutral-500">{item.user.name}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Compact version for sidebars or smaller spaces
interface CompactTimelineProps {
  items: Array<{
    id: string
    label: string
    timestamp: string
    color?: 'green' | 'blue' | 'orange' | 'red' | 'neutral'
  }>
  className?: string
}

export function CompactTimeline({ items, className }: CompactTimelineProps) {
  const getColor = (color: string = 'neutral') => {
    const colors: Record<string, string> = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      neutral: 'bg-neutral-400',
    }
    return colors[color] || colors.neutral
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className={cn('w-2 h-2 rounded-full shrink-0', getColor(item.color))} />
          <span className="text-sm text-neutral-700 flex-1 truncate">{item.label}</span>
          <time className="text-xs text-neutral-400 shrink-0">{item.timestamp}</time>
        </div>
      ))}
    </div>
  )
}
