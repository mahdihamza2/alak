import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumb?: { label: string; href?: string }[]
}

export default function PageHeader({ title, description, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-4">
          <ol className="flex items-center gap-2 text-sm">
            {breadcrumb.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-neutral-300">/</span>}
                {item.href ? (
                  <a href={item.href} className="text-neutral-500 hover:text-neutral-700">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-neutral-900 font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {description && (
            <p className="mt-1 text-neutral-500">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
