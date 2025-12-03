'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import type { AdminProfile } from '@/lib/supabase/database.types'

interface DashboardShellProps {
  children: React.ReactNode
  profile: AdminProfile | null
}

export default function DashboardShell({ children, profile }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
      <Header profile={profile} sidebarCollapsed={sidebarCollapsed} />
      <main 
        className={`
          pt-16 min-h-screen transition-all duration-300
          ${sidebarCollapsed ? 'pl-20' : 'pl-64'}
        `}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
