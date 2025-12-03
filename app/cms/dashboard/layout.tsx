import type { Metadata } from 'next'
import { AuthGuard } from '@/components/auth'
import { getAdminProfile } from '@/lib/supabase/server'
import DashboardShell from '@/components/cms/DashboardShell'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard for managing inquiries and leads',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAdminProfile()
  
  return (
    <AuthGuard requiredRole="viewer">
      <DashboardShell profile={profile}>
        {children}
      </DashboardShell>
    </AuthGuard>
  )
}
