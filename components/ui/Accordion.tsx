'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AccordionItem {
  id: string
  title: string | React.ReactNode
  subtitle?: string
  icon?: React.ReactNode
  content: React.ReactNode
  defaultOpen?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpenIds?: string[]
  className?: string
}

function AccordionComponent({ items, allowMultiple = false, defaultOpenIds, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (defaultOpenIds) {
      defaultOpenIds.forEach(id => initial.add(id))
    }
    items.forEach(item => {
      if (item.defaultOpen) initial.add(item.id)
    })
    return initial
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <AccordionSection
          key={item.id}
          item={item}
          isOpen={openItems.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  )
}

// Export both as default and named
export default AccordionComponent
export { AccordionComponent as Accordion }

interface AccordionSectionProps {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
}

function AccordionSection({ item, isOpen, onToggle }: AccordionSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-neutral-50 transition-colors"
      >
        {item.icon && (
          <div className="shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
            {item.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900">{item.title}</p>
          {item.subtitle && (
            <p className="text-sm text-neutral-500 mt-0.5">{item.subtitle}</p>
          )}
        </div>
        <ChevronDown 
          size={20} 
          className={cn(
            'shrink-0 text-neutral-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>
      
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 pt-0 border-t border-neutral-100">
          <div className="pt-4">
            {item.content}
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple Accordion Item for individual use
interface SimpleAccordionProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function SimpleAccordion({ 
  title, 
  subtitle, 
  icon, 
  children, 
  defaultOpen = false,
  className 
}: SimpleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('bg-white rounded-xl border border-neutral-200 overflow-hidden', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-neutral-50 transition-colors"
      >
        {icon && (
          <div className="shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900">{title}</p>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <ChevronDown 
          size={20} 
          className={cn(
            'shrink-0 text-neutral-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>
      
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 pt-0 border-t border-neutral-100">
          <div className="pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
