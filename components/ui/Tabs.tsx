'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: number | string
  content?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

// Simple controlled tabs (no content)
interface SimpleTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'default'
}: SimpleTabsProps) {
  const tabStyles = {
    default: {
      container: 'bg-neutral-100 p-1 rounded-xl',
      tab: 'px-4 py-2 rounded-lg text-sm font-medium transition-all',
      active: 'bg-white text-neutral-900 shadow-sm',
      inactive: 'text-neutral-600 hover:text-neutral-900',
    },
    pills: {
      container: 'flex gap-2',
      tab: 'px-4 py-2 rounded-full text-sm font-medium transition-all',
      active: 'bg-primary-600 text-white',
      inactive: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
    },
    underline: {
      container: '',
      tab: 'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all',
      active: 'border-primary-600 text-primary-600',
      inactive: 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300',
    },
  }

  const styles = tabStyles[variant]

  return (
    <div className={cn('flex', styles.container, className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            styles.tab,
            'flex items-center gap-2',
            activeTab === tab.id ? styles.active : styles.inactive
          )}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function TabsWithContent({ 
  tabs, 
  defaultTab, 
  onChange, 
  className,
  variant = 'default' 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content

  const tabStyles = {
    default: {
      container: 'bg-neutral-100 p-1 rounded-xl',
      tab: 'px-4 py-2 rounded-lg text-sm font-medium transition-all',
      active: 'bg-white text-neutral-900 shadow-sm',
      inactive: 'text-neutral-600 hover:text-neutral-900',
    },
    pills: {
      container: 'flex gap-2',
      tab: 'px-4 py-2 rounded-full text-sm font-medium transition-all',
      active: 'bg-primary-600 text-white',
      inactive: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
    },
    underline: {
      container: 'border-b border-neutral-200',
      tab: 'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all',
      active: 'border-primary-600 text-primary-600',
      inactive: 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300',
    },
  }

  const styles = tabStyles[variant]

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={cn('flex', styles.container)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              styles.tab,
              'flex items-center gap-2',
              activeTab === tab.id ? styles.active : styles.inactive
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={cn(
                'px-1.5 py-0.5 text-xs rounded-full',
                activeTab === tab.id 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-neutral-200 text-neutral-600'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeContent}
      </div>
    </div>
  )
}

// Controlled Tabs version
interface ControlledTabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

export function ControlledTabs({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'default'
}: ControlledTabsProps) {
  const activeContent = tabs.find(tab => tab.id === activeTab)?.content

  const tabStyles = {
    default: {
      container: 'bg-neutral-100 p-1 rounded-xl',
      tab: 'px-4 py-2 rounded-lg text-sm font-medium transition-all',
      active: 'bg-white text-neutral-900 shadow-sm',
      inactive: 'text-neutral-600 hover:text-neutral-900',
    },
    pills: {
      container: 'flex gap-2',
      tab: 'px-4 py-2 rounded-full text-sm font-medium transition-all',
      active: 'bg-primary-600 text-white',
      inactive: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
    },
    underline: {
      container: 'border-b border-neutral-200',
      tab: 'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all',
      active: 'border-primary-600 text-primary-600',
      inactive: 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300',
    },
  }

  const styles = tabStyles[variant]

  return (
    <div className={className}>
      <div className={cn('flex', styles.container)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              styles.tab,
              'flex items-center gap-2',
              activeTab === tab.id ? styles.active : styles.inactive
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={cn(
                'px-1.5 py-0.5 text-xs rounded-full',
                activeTab === tab.id 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-neutral-200 text-neutral-600'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeContent}
      </div>
    </div>
  )
}
