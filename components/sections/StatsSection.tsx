interface StatsSectionProps {
  title?: string
  description?: string
  stats: {
    value: string
    label: string
    suffix?: string
  }[]
  variant?: 'default' | 'dark' | 'cards'
  className?: string
}

export default function StatsSection({
  title,
  description,
  stats,
  variant = 'default',
  className = '',
}: StatsSectionProps) {
  const variants = {
    default: 'bg-white',
    dark: 'bg-neutral-900',
    cards: 'bg-neutral-50',
  }

  const textColors = {
    default: {
      title: 'text-neutral-900',
      description: 'text-neutral-600',
      value: 'text-primary-600',
      label: 'text-neutral-500',
    },
    dark: {
      title: 'text-white',
      description: 'text-neutral-300',
      value: 'text-primary-400',
      label: 'text-neutral-400',
    },
    cards: {
      title: 'text-neutral-900',
      description: 'text-neutral-600',
      value: 'text-primary-600',
      label: 'text-neutral-500',
    },
  }

  return (
    <section className={`py-16 lg:py-24 ${variants[variant]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || description) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {title && (
              <h2 className={`text-3xl sm:text-4xl font-bold ${textColors[variant].title}`}>
                {title}
              </h2>
            )}
            {description && (
              <p className={`mt-4 text-lg ${textColors[variant].description}`}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-${stats.length} gap-8 lg:gap-12`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center ${variant === 'cards' ? 'bg-white rounded-2xl p-6 shadow-sm' : ''}`}
            >
              <p className={`text-4xl sm:text-5xl font-bold ${textColors[variant].value}`}>
                {stat.value}
                {stat.suffix && <span className="text-2xl ml-1">{stat.suffix}</span>}
              </p>
              <p className={`mt-2 text-sm sm:text-base ${textColors[variant].label}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
