'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  BarChart3,
  Bell,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { logout } from '@/app/cms/auth/actions'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/cms/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Inquiries', href: '/cms/dashboard/inquiries', icon: <Users size={20} /> },
  { name: 'Analytics', href: '/cms/dashboard/analytics', icon: <BarChart3 size={20} /> },
  { name: 'Reports', href: '/cms/dashboard/reports', icon: <FileText size={20} /> },
]

const settingsNavItems: NavItem[] = [
  { name: 'Site Settings', href: '/cms/dashboard/settings', icon: <Settings size={20} /> },
  { name: 'Notifications', href: '/cms/dashboard/notifications', icon: <Bell size={20} /> },
  { name: 'Audit Logs', href: '/cms/dashboard/audit-logs', icon: <Shield size={20} /> },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/cms/dashboard') {
      return pathname === '/cms/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside 
      className={`
        fixed left-0 top-0 z-40 h-screen bg-white border-r border-neutral-200
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
        <Link href="/cms/dashboard" className="flex items-center gap-3">
          <Image
            src="/images/logo/alak-logo-full.svg"
            alt="Alak Oil & Gas"
            width={40}
            height={40}
            className="shrink-0"
            priority
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-neutral-900 text-lg">Alak CMS</span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100vh-4rem)] justify-between p-4">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            {!collapsed && (
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-3">
                Main Menu
              </p>
            )}
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      ${isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.name : undefined}
                  >
                    <span className={isActive(item.href) ? 'text-primary-600' : ''}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.name}</span>}
                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto bg-primary-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Settings Navigation */}
          <div>
            {!collapsed && (
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-3">
                Settings
              </p>
            )}
            <ul className="space-y-1">
              {settingsNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      ${isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.name : undefined}
                  >
                    <span className={isActive(item.href) ? 'text-primary-600' : ''}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-neutral-200 pt-4">
          <form action={logout}>
            <button
              type="submit"
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </form>
        </div>
      </nav>
    </aside>
  )
}
