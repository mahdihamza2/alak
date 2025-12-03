'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { AdminProfile } from '@/lib/supabase/database.types'
import { 
  User, 
  Phone, 
  Building2, 
  Briefcase, 
  Save, 
  Loader2, 
  Camera, 
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'

interface ProfileFormProps {
  profile: AdminProfile
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    phone: profile.phone || '',
    job_title: profile.job_title || '',
    department: profile.department || '',
  })

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.')
      return
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 2MB.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload the file
    handleAvatarUpload(file)
  }, [])

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload avatar')
      }

      setAvatarUrl(data.url)
      setPreviewUrl(null)
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error uploading avatar:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload avatar')
      setPreviewUrl(null)
    } finally {
      setUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove avatar')
      }

      setAvatarUrl(null)
      setPreviewUrl(null)
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error removing avatar:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone || null,
          job_title: formData.job_title || null,
          department: formData.department || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess(true)
      router.refresh()
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const displayUrl = previewUrl || avatarUrl

  return (
    <div className="space-y-8">
      {/* Avatar Upload Section */}
      <div className="pb-6 border-b border-neutral-200">
        <h4 className="text-sm font-semibold text-neutral-900 mb-4">Profile Photo</h4>
        <div className="flex items-start gap-6">
          {/* Avatar Preview */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-100 border-2 border-neutral-200">
              {displayUrl ? (
                <Image
                  src={displayUrl}
                  alt={profile.full_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized={previewUrl !== null}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary-100 to-primary-200">
                  <span className="text-3xl font-bold text-primary-600">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Upload Overlay */}
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
            )}

            {/* Hover Actions */}
            {!uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
                  title="Change photo"
                >
                  <Camera size={16} />
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Upload Instructions */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="mb-3"
            >
              {uploadingAvatar ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Photo
                </>
              )}
            </Button>

            <p className="text-xs text-neutral-500 mb-1">
              Recommended: Square image, at least 200x200px
            </p>
            <p className="text-xs text-neutral-400">
              Accepted formats: JPEG, PNG, GIF, WebP (max 2MB)
            </p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle size={18} className="shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="pl-10"
                required
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10"
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-neutral-700 mb-2">
              Job Title
            </label>
            <div className="relative">
              <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="pl-10"
                placeholder="e.g., Sales Manager"
              />
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-neutral-700 mb-2">
              Department
            </label>
            <div className="relative">
              <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="pl-10"
                placeholder="e.g., Operations"
              />
            </div>
          </div>
        </div>

        {/* Email Info (read-only) */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <p className="text-xs font-medium text-neutral-500 mb-1">Email Address</p>
          <p className="text-sm text-neutral-900">{profile.email}</p>
          <p className="text-xs text-neutral-400 mt-1">
            Contact your administrator to change your email address.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
