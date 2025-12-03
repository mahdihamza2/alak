import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface HeroSectionProps {
  badge?: {
    text: string
    variant?: 'default' | 'success' | 'warning' | 'info'
  }
  title: string
  titleHighlight?: string
  description: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  trustIndicators?: {
    label: string
    value: string
  }[]
  className?: string
}

export default function HeroSection({
  badge,
  title,
  titleHighlight,
  description,
  primaryCTA,
  secondaryCTA,
  trustIndicators,
  className = '',
}: HeroSectionProps) {
  return (
    <section className={`relative overflow-hidden bg-linear-to-br from-neutral-900 via-neutral-800 to-primary-900 ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <div className="mb-6">
              <Badge variant={badge.variant || 'default'} className="px-4 py-2">
                {badge.text}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            {title}
            {titleHighlight && (
              <>
                <br />
                <span className="text-primary-400">{titleHighlight}</span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCTA && (
                <Link href={primaryCTA.href}>
                  <Button size="lg" className="w-full sm:w-auto">
                    {primaryCTA.text}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
              )}
              {secondaryCTA && (
                <Link href={secondaryCTA.href}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                    {secondaryCTA.text}
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Trust Indicators */}
          {trustIndicators && trustIndicators.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {indicator.value}
                    </p>
                    <p className="text-sm text-neutral-400 mt-1">
                      {indicator.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent" />
    </section>
  )
}
