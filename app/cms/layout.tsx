import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Alak CMS',
    default: 'Alak CMS',
  },
  description: 'Content Management System for Alak Oil and Gas',
  robots: 'noindex, nofollow',
}

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {children}
    </div>
  )
}
