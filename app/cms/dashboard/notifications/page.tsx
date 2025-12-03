'use client'

import { useEffect, useState, useCallback } from 'react'
import { db, Notification as NotificationType } from '@/lib/supabase/client'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Accordion } from '@/components/ui/Accordion'
import { formatDateTime } from '@/lib/utils/helpers'
import { 
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  MessageSquare,
  Shield,
  Settings,
  AlertCircle,
  Info,
  AlertTriangle,
  Clock,
  Filter
} from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    
    try {
      const result = await db.notifications.getAll({
        read: filter === 'unread' ? false : undefined,
        limit: 100,
      })
      setNotifications(result.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const getFilteredNotifications = () => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read)
    }
    return notifications
  }

  const groupedNotifications = () => {
    const filtered = getFilteredNotifications()
    return {
      inquiry: filtered.filter(n => n.category === 'inquiry'),
      security: filtered.filter(n => n.category === 'security'),
      system: filtered.filter(n => n.category === 'system'),
      update: filtered.filter(n => n.category === 'update')
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = async (id: string) => {
    try {
      await db.notifications.markAsRead(id)
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await db.notifications.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await db.notifications.delete(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const clearAll = async () => {
    if (!confirm('Are you sure you want to delete all notifications?')) return
    
    try {
      await db.notifications.deleteAll()
      setNotifications([])
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  const getTypeIcon = (type: NotificationType['type']) => {
    switch (type) {
      case 'success':
        return <Check size={16} className="text-green-600" />
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-600" />
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />
      default:
        return <Info size={16} className="text-blue-600" />
    }
  }

  const getCategoryIcon = (category: NotificationType['category']) => {
    switch (category) {
      case 'inquiry':
        return <MessageSquare size={18} />
      case 'security':
        return <Shield size={18} />
      case 'system':
        return <Settings size={18} />
      case 'update':
        return <Bell size={18} />
      default:
        return <Bell size={18} />
    }
  }

  const getCategoryLabel = (category: NotificationType['category']) => {
    switch (category) {
      case 'inquiry':
        return 'Inquiry Notifications'
      case 'security':
        return 'Security Alerts'
      case 'system':
        return 'System Notifications'
      case 'update':
        return 'Updates & Reports'
      default:
        return 'Notifications'
    }
  }

  const getCategoryColor = (category: NotificationType['category']) => {
    switch (category) {
      case 'inquiry':
        return 'text-blue-600 bg-blue-100'
      case 'security':
        return 'text-red-600 bg-red-100'
      case 'system':
        return 'text-purple-600 bg-purple-100'
      case 'update':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-neutral-600 bg-neutral-100'
    }
  }

  const renderNotificationItem = (notification: NotificationType) => (
    <div 
      key={notification.id}
      className={`p-4 rounded-xl border transition-all ${
        notification.read 
          ? 'bg-white border-neutral-200' 
          : 'bg-primary-50 border-primary-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          notification.type === 'success' ? 'bg-green-100' :
          notification.type === 'warning' ? 'bg-yellow-100' :
          notification.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          {getTypeIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-medium ${notification.read ? 'text-neutral-700' : 'text-neutral-900'}`}>
              {notification.title}
              {!notification.read && (
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full ml-2" />
              )}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Mark as read"
                >
                  <Check size={14} />
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <p className={`text-sm mt-1 ${notification.read ? 'text-neutral-500' : 'text-neutral-600'}`}>
            {notification.message}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Clock size={12} />
              {formatDateTime(notification.created_at || '')}
            </span>
            {notification.action_url && (
              <a 
                href={notification.action_url}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                View Details →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const grouped = groupedNotifications()

  const accordionItems = [
    {
      id: 'inquiry',
      title: (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor('inquiry')}`}>
            {getCategoryIcon('inquiry')}
          </div>
          <span className="font-semibold text-neutral-900">{getCategoryLabel('inquiry')}</span>
          {grouped.inquiry.length > 0 && (
            <Badge variant="info">{grouped.inquiry.filter(n => !n.read).length} unread</Badge>
          )}
        </div>
      ),
      content: (
        <div className="space-y-3">
          {grouped.inquiry.length > 0 ? (
            grouped.inquiry.map(renderNotificationItem)
          ) : (
            <p className="text-sm text-neutral-500 text-center py-4">No inquiry notifications</p>
          )}
        </div>
      )
    },
    {
      id: 'security',
      title: (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor('security')}`}>
            {getCategoryIcon('security')}
          </div>
          <span className="font-semibold text-neutral-900">{getCategoryLabel('security')}</span>
          {grouped.security.filter(n => !n.read).length > 0 && (
            <Badge variant="error">{grouped.security.filter(n => !n.read).length} unread</Badge>
          )}
        </div>
      ),
      content: (
        <div className="space-y-3">
          {grouped.security.length > 0 ? (
            grouped.security.map(renderNotificationItem)
          ) : (
            <p className="text-sm text-neutral-500 text-center py-4">No security alerts</p>
          )}
        </div>
      )
    },
    {
      id: 'system',
      title: (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor('system')}`}>
            {getCategoryIcon('system')}
          </div>
          <span className="font-semibold text-neutral-900">{getCategoryLabel('system')}</span>
          {grouped.system.filter(n => !n.read).length > 0 && (
            <Badge variant="warning">{grouped.system.filter(n => !n.read).length} unread</Badge>
          )}
        </div>
      ),
      content: (
        <div className="space-y-3">
          {grouped.system.length > 0 ? (
            grouped.system.map(renderNotificationItem)
          ) : (
            <p className="text-sm text-neutral-500 text-center py-4">No system notifications</p>
          )}
        </div>
      )
    },
    {
      id: 'update',
      title: (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor('update')}`}>
            {getCategoryIcon('update')}
          </div>
          <span className="font-semibold text-neutral-900">{getCategoryLabel('update')}</span>
          {grouped.update.filter(n => !n.read).length > 0 && (
            <Badge variant="success">{grouped.update.filter(n => !n.read).length} unread</Badge>
          )}
        </div>
      ),
      content: (
        <div className="space-y-3">
          {grouped.update.length > 0 ? (
            grouped.update.map(renderNotificationItem)
          ) : (
            <p className="text-sm text-neutral-500 text-center py-4">No updates available</p>
          )}
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated with the latest activities and alerts"
        breadcrumb={[
          { label: 'Dashboard', href: '/cms/dashboard' },
          { label: 'Notifications' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCheck size={18} />
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="outline" onClick={clearAll}>
                <Trash2 size={18} />
                Clear All
              </Button>
            )}
          </div>
        }
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Bell size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{notifications.length}</p>
            <p className="text-xs text-neutral-500">Total</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Info size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{unreadCount}</p>
            <p className="text-xs text-neutral-500">Unread</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{grouped.security.length}</p>
            <p className="text-xs text-neutral-500">Security</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageSquare size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">{grouped.inquiry.length}</p>
            <p className="text-xs text-neutral-500">Inquiries</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-neutral-400" />
            <span className="text-sm font-medium text-neutral-700">Filter:</span>
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all' 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'unread' 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>
          
          {filter === 'unread' && unreadCount === 0 && (
            <span className="text-sm text-neutral-500">All caught up! ��</span>
          )}
        </div>
      </div>

      {/* Notifications Accordion */}
      {notifications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <Accordion 
            items={accordionItems}
            allowMultiple
            defaultOpenIds={['inquiry', 'security']}
            className="divide-y divide-neutral-200"
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellOff size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Notifications</h3>
          <p className="text-neutral-500 max-w-sm mx-auto">
            You're all caught up! New notifications will appear here when there's activity such as new inquiries or security events.
          </p>
        </div>
      )}

      {/* Notification Settings Link */}
      <div className="mt-6 bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200 flex items-center justify-center">
              <Settings size={24} className="text-neutral-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Notification Preferences</h3>
              <p className="text-sm text-neutral-500">Customize what notifications you receive</p>
            </div>
          </div>
          <a href="/cms/dashboard/settings">
            <Button variant="outline">
              Manage Settings
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
