import { ReactNode } from 'react'
import Card from '@/components/ui/Card'

interface Feature {
  icon: ReactNode
  title: string
  description: string
}

interface FeaturesSectionProps {
  badge?: string
  title: string
  description?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  className?: string
}

export default function FeaturesSection({
  badge,
  title,
  description,
  features,
  columns = 3,
  className = '',
}: FeaturesSectionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          {badge && (
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
              {badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-neutral-600">
              {description}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6 lg:gap-8`}>
          {features.map((feature, index) => (
            <Card key={index} className="p-6 lg:p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
