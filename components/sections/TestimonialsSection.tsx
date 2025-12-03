import Card from '@/components/ui/Card'

interface Testimonial {
  quote: string
  author: string
  title: string
  company: string
  avatar?: string
}

interface TestimonialsSectionProps {
  title?: string
  description?: string
  testimonials: Testimonial[]
  className?: string
}

export default function TestimonialsSection({
  title,
  description,
  testimonials,
  className = '',
}: TestimonialsSectionProps) {
  return (
    <section className={`py-16 lg:py-24 bg-neutral-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || description) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-neutral-600">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 lg:p-8">
              {/* Quote Icon */}
              <svg
                className="w-10 h-10 text-primary-200 mb-4"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

              {/* Quote */}
              <blockquote className="text-neutral-700 leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
                    <span className="text-lg font-semibold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-neutral-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {testimonial.title}, {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
