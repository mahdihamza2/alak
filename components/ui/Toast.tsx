'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto remove after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {mounted && createPortal(
        <ToastContainer toasts={toasts} removeToast={removeToast} />,
        document.body
      )}
    </ToastContext.Provider>
  )
}

function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: Toast[]
  removeToast: (id: string) => void 
}) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    warning: <AlertTriangle size={20} className="text-orange-500" />,
    info: <Info size={20} className="text-blue-500" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-orange-50 border-orange-200',
    info: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg',
        'animate-in slide-in-from-right-full duration-300',
        bgColors[toast.type]
      )}
    >
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 text-sm">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-neutral-600">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 text-neutral-400 hover:text-neutral-600 
                 hover:bg-neutral-200/50 rounded transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}

// Standalone toast function for simpler usage
let toastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null

export function setToastFunction(fn: (toast: Omit<Toast, 'id'>) => void) {
  toastFn = fn
}

export function toast(options: Omit<Toast, 'id'>) {
  if (toastFn) {
    toastFn(options)
  } else {
    console.warn('Toast provider not initialized')
  }
}

// Convenience methods
toast.success = (title: string, message?: string) => toast({ type: 'success', title, message })
toast.error = (title: string, message?: string) => toast({ type: 'error', title, message })
toast.warning = (title: string, message?: string) => toast({ type: 'warning', title, message })
toast.info = (title: string, message?: string) => toast({ type: 'info', title, message })
