import { redirect } from 'next/navigation'
import { getUser, getAdminProfile } from '@/lib/supabase/server'
import type { AdminRole, AdminProfile } from '@/lib/supabase/database.types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: AdminRole
}

export default async function AuthGuard({ children, requiredRole = 'viewer' }: AuthGuardProps) {
  const user = await getUser()
  
  if (!user) {
    redirect('/cms/login')
  }
  
  const profile = await getAdminProfile()
  
  if (!profile) {
    redirect('/cms/login?error=no_profile')
  }
  
  if (!profile.is_active) {
    redirect('/cms/login?error=inactive')
  }
  
  // Check role hierarchy
  const roleHierarchy: Record<AdminRole, number> = {
    'super_admin': 4,
    'admin': 3,
    'editor': 2,
    'viewer': 1
  }
  
  if (roleHierarchy[profile.role] < roleHierarchy[requiredRole]) {
    redirect('/cms/login?error=insufficient_permissions')
  }
  
  return <>{children}</>
}

// Hook-like function to get user context in server components
export async function getAuthContext(): Promise<{
  user: Awaited<ReturnType<typeof getUser>>
  profile: AdminProfile | null
  isAuthenticated: boolean
  role: AdminRole | null
}> {
  const user = await getUser()
  const profile = user ? await getAdminProfile() : null
  
  return {
    user,
    profile,
    isAuthenticated: !!user && !!profile && !!profile.is_active,
    role: profile?.role ?? null
  }
}

// Utility to check if user has at least the required role
export function hasRole(userRole: AdminRole | null, requiredRole: AdminRole): boolean {
  if (!userRole) return false
  
  const roleHierarchy: Record<AdminRole, number> = {
    'super_admin': 4,
    'admin': 3,
    'editor': 2,
    'viewer': 1
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
