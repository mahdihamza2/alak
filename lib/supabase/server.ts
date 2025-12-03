import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  
  return user
}

export async function getAdminProfile() {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) return null
  
  const { data: profile, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error getting admin profile:', error)
    return null
  }
  
  return profile
}

export async function isAdmin(minRole: Database['public']['Enums']['admin_role'] = 'viewer') {
  const profile = await getAdminProfile()
  
  if (!profile) return false
  
  const roleHierarchy: Record<Database['public']['Enums']['admin_role'], number> = {
    'super_admin': 4,
    'admin': 3,
    'editor': 2,
    'viewer': 1
  }
  
  return roleHierarchy[profile.role] >= roleHierarchy[minRole]
}

// Site Settings Helper for public pages
export interface SiteSettings {
  // Company Info
  company_name?: string
  company_tagline?: string
  company_description?: string
  company_phone?: string
  company_email?: string
  company_address?: string
  company_founded_year?: string
  
  // Registration Info
  rc_number?: string
  tin_number?: string
  
  // Social Media
  social_facebook?: string
  social_twitter?: string
  social_linkedin?: string
  social_instagram?: string
  
  // Features Toggles
  show_social_links?: string
  show_compliance_bar?: string
  show_contact_form?: string
  
  // Office Info
  head_office_city?: string
  head_office_address?: string
  head_office_phone?: string
  head_office_email?: string
  commercial_office_city?: string
  commercial_office_address?: string
  commercial_office_phone?: string
  commercial_office_email?: string
  
  // SEO
  site_title?: string
  site_description?: string
  
  // Misc
  [key: string]: string | undefined
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('is_public', true)
  
  if (error) {
    console.error('Error fetching site settings:', error)
    return {}
  }
  
  // Convert array of settings to object
  const settings: SiteSettings = {}
  data?.forEach((item) => {
    // Handle JSON values - extract string if it's a wrapped string
    let value = item.value
    if (typeof value === 'string') {
      settings[item.key] = value
    } else if (typeof value === 'object' && value !== null) {
      // If it's a JSON object/array, stringify it
      settings[item.key] = JSON.stringify(value)
    } else {
      settings[item.key] = String(value ?? '')
    }
  })
  
  return settings
}

// Helper to check if a feature is enabled
export function isFeatureEnabled(settings: SiteSettings, key: string, defaultValue = true): boolean {
  const value = settings[key]
  if (value === undefined) return defaultValue
  return value === 'true' || value === '1'
}
