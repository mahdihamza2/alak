import { getAdminProfile } from '@/lib/supabase/server'
import { PageHeader } from '@/components/cms'
import ProfileForm from './ProfileForm'
import Image from 'next/image'

export const metadata = {
  title: 'My Profile',
  description: 'Manage your admin profile and settings',
}

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const profile = await getAdminProfile()

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="My Profile" description="Profile not found" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700">Unable to load profile. Please try logging in again.</p>
        </div>
      </div>
    )
  }

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Viewer',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="My Profile" 
        description="Manage your account information and preferences"
        breadcrumb={[
          { label: 'Dashboard', href: '/cms/dashboard' },
          { label: 'My Profile' }
        ]}
      />

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-6">
        <div className="bg-linear-to-r from-primary-600 to-primary-700 px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              {profile.avatar_url ? (
                <Image 
                  src={profile.avatar_url} 
                  alt={profile.full_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-4xl font-bold text-primary-600">
                  {profile.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">{profile.full_name}</h2>
              <p className="text-primary-100 mb-2">{profile.job_title || 'Team Member'}</p>
              <span className="inline-flex px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
                {roleLabels[profile.role] || profile.role}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-neutral-500">Email Address</label>
              <p className="mt-1 text-neutral-900">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Phone Number</label>
              <p className="mt-1 text-neutral-900">{profile.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Department</label>
              <p className="mt-1 text-neutral-900">{profile.department || 'Not assigned'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Last Login</label>
              <p className="mt-1 text-neutral-900">
                {profile.last_login_at 
                  ? new Date(profile.last_login_at).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">Edit Profile</h3>
          <p className="text-sm text-neutral-500">Update your personal information and profile photo</p>
        </div>
        <div className="p-6">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}
