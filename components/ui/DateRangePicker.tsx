'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isWithinInterval } from 'date-fns'

export interface DateRange {
  from: Date | null
  to: Date | null
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
  placeholder?: string
}

const presets = [
  { label: 'Today', getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: 'This month', getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: 'Last month', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: 'Last 3 months', getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
]

export default function DateRangePicker({ 
  value, 
  onChange, 
  className,
  placeholder = 'Select date range'
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selecting, setSelecting] = useState<'from' | 'to'>('from')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDisplayValue = () => {
    if (value.from && value.to) {
      if (isSameDay(value.from, value.to)) {
        return format(value.from, 'MMM d, yyyy')
      }
      return `${format(value.from, 'MMM d')} - ${format(value.to, 'MMM d, yyyy')}`
    }
    if (value.from) {
      return `${format(value.from, 'MMM d, yyyy')} - ...`
    }
    return placeholder
  }

  const handleDateClick = (date: Date) => {
    if (selecting === 'from') {
      onChange({ from: date, to: null })
      setSelecting('to')
    } else {
      if (value.from && date < value.from) {
        onChange({ from: date, to: value.from })
      } else {
        onChange({ from: value.from, to: date })
      }
      setSelecting('from')
    }
  }

  const handlePresetClick = (preset: typeof presets[0]) => {
    onChange(preset.getValue())
    setIsOpen(false)
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day
        const isCurrentMonth = isSameMonth(day, currentMonth)
        const isSelected = (value.from && isSameDay(day, value.from)) || 
                          (value.to && isSameDay(day, value.to))
        const isInRange = value.from && value.to && 
                         isWithinInterval(day, { start: value.from, end: value.to })
        const isToday = isSameDay(day, new Date())

        days.push(
          <button
            key={day.toString()}
            onClick={() => handleDateClick(currentDay)}
            className={cn(
              'w-8 h-8 text-sm rounded-lg transition-colors',
              !isCurrentMonth && 'text-neutral-300',
              isCurrentMonth && !isSelected && !isInRange && 'text-neutral-700 hover:bg-neutral-100',
              isSelected && 'bg-primary-600 text-white hover:bg-primary-700',
              isInRange && !isSelected && 'bg-primary-50 text-primary-700',
              isToday && !isSelected && 'ring-1 ring-primary-500'
            )}
          >
            {format(day, 'd')}
          </button>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      )
      days = []
    }

    return rows
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl',
          'text-sm text-left hover:border-neutral-300 transition-colors w-full',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
        )}
      >
        <Calendar size={16} className="text-neutral-400" />
        <span className={value.from ? 'text-neutral-900' : 'text-neutral-500'}>
          {formatDisplayValue()}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-neutral-200 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex">
            {/* Presets */}
            <div className="p-2 border-r border-neutral-200 w-36">
              <p className="px-2 py-1 text-xs font-semibold text-neutral-400 uppercase">Quick Select</p>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full px-2 py-1.5 text-sm text-left text-neutral-700 
                           hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="p-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={18} className="text-neutral-600" />
                </button>
                <span className="text-sm font-semibold text-neutral-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <button
                  onClick={() => setCurrentMonth(addDays(currentMonth, 32))}
                  className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={18} className="text-neutral-600" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-neutral-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="space-y-1">
                {renderCalendar()}
              </div>

              {/* Selection Info */}
              <div className="mt-4 pt-4 border-t border-neutral-200 text-xs text-neutral-500">
                {selecting === 'from' ? 'Select start date' : 'Select end date'}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
            <button
              onClick={() => {
                onChange({ from: null, to: null })
                setSelecting('from')
              }}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 
                       hover:bg-primary-700 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
