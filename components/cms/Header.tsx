'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Bell, 
  Search, 
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ExternalLink
} from 'lucide-react'
import { logout } from '@/app/cms/auth/actions'
import type { AdminProfile } from '@/lib/supabase/database.types'

interface HeaderProps {
  profile: AdminProfile | null
  sidebarCollapsed?: boolean
}

export default function Header({ profile, sidebarCollapsed = false }: HeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getRoleDisplay = (role: string) => {
    const roles: Record<string, { label: string; color: string }> = {
      'super_admin': { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
      'admin': { label: 'Admin', color: 'bg-blue-100 text-blue-700' },
      'editor': { label: 'Editor', color: 'bg-green-100 text-green-700' },
      'viewer': { label: 'Viewer', color: 'bg-neutral-100 text-neutral-700' },
    }
    return roles[role] || roles['viewer']
  }

  const roleInfo = profile ? getRoleDisplay(profile.role) : null

  return (
    <header 
      className={`
        fixed top-0 right-0 z-30 h-16 bg-white border-b border-neutral-200
        transition-all duration-300
        ${sidebarCollapsed ? 'left-20' : 'left-64'}
      `}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search inquiries, reports..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl
                       text-sm placeholder:text-neutral-400
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                       transition-all duration-200"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex
                          px-2 py-0.5 text-xs text-neutral-400 bg-neutral-100 rounded border border-neutral-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 ml-4">
          {/* View Site Link */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-600 
                     hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ExternalLink size={16} />
            <span>View Site</span>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 
                       rounded-lg transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 
                            overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-900">Notifications</h3>
                  <button className="text-xs text-primary-600 hover:text-primary-700">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-8 text-center">
                    <Bell size={32} className="mx-auto text-neutral-300 mb-2" />
                    <p className="text-sm text-neutral-500">No new notifications</p>
                  </div>
                </div>
                <Link
                  href="/cms/notifications"
                  className="block px-4 py-3 text-center text-sm text-primary-600 hover:bg-neutral-50 
                           border-t border-neutral-200"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt={profile.full_name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-sm font-semibold text-primary-700">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900 leading-tight">
                  {profile?.full_name || 'Admin User'}
                </p>
                <p className="text-xs text-neutral-500 leading-tight">
                  {profile?.job_title || 'Administrator'}
                </p>
              </div>
              <ChevronDown size={16} className="text-neutral-400 hidden md:block" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-200 
                            overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Profile Header */}
                <div className="px-4 py-4 bg-neutral-50 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? (
                        <Image 
                          src={profile.avatar_url} 
                          alt={profile.full_name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-lg font-semibold text-primary-700">
                          {profile?.full_name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        {profile?.full_name || 'Admin User'}
                      </p>
                      <p className="text-sm text-neutral-500 truncate">
                        {profile?.email}
                      </p>
                    </div>
                  </div>
                  {roleInfo && (
                    <span className={`inline-flex mt-3 px-2.5 py-1 text-xs font-medium rounded-lg ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/cms/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/cms/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <Link
                    href="/cms/dashboard/help"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <HelpCircle size={18} />
                    <span>Help & Support</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-neutral-200 py-2">
                  <form action={logout}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      <span>Sign out</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
