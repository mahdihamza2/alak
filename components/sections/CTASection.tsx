import Link from 'next/link'
import Button from '@/components/ui/Button'

interface CTASectionProps {
  title: string
  description: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  variant?: 'default' | 'dark' | 'gradient'
  className?: string
}

export default function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = 'default',
  className = '',
}: CTASectionProps) {
  const variants = {
    default: 'bg-neutral-50',
    dark: 'bg-neutral-900 text-white',
    gradient: 'bg-linear-to-br from-primary-600 to-primary-800 text-white',
  }

  const textColors = {
    default: {
      title: 'text-neutral-900',
      description: 'text-neutral-600',
    },
    dark: {
      title: 'text-white',
      description: 'text-neutral-300',
    },
    gradient: {
      title: 'text-white',
      description: 'text-primary-100',
    },
  }

  return (
    <section className={`py-16 lg:py-24 ${variants[variant]} ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={`text-3xl sm:text-4xl font-bold ${textColors[variant].title}`}>
          {title}
        </h2>
        <p className={`mt-4 text-lg ${textColors[variant].description}`}>
          {description}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={primaryCTA.href}>
            <Button
              size="lg"
              variant={variant === 'default' ? 'primary' : 'outline'}
              className={variant !== 'default' ? 'border-white text-white hover:bg-white/10' : ''}
            >
              {primaryCTA.text}
            </Button>
          </Link>
          {secondaryCTA && (
            <Link href={secondaryCTA.href}>
              <Button
                size="lg"
                variant="ghost"
                className={variant !== 'default' ? 'text-white hover:bg-white/10' : ''}
              >
                {secondaryCTA.text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
