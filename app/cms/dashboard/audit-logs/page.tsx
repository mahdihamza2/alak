'use client'

import { useEffect, useState, useCallback } from 'react'
import { db, AdminProfile } from '@/lib/supabase/client'
import { AuditLog, AuditAction } from '@/lib/supabase/database.types'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import DateRangePicker, { DateRange } from '@/components/ui/DateRangePicker'
import { formatDateTime } from '@/lib/utils/helpers'
import { 
  Shield,
  Search,
  Filter,
  RefreshCw,
  User,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Monitor,
  Globe,
  X,
  AlertCircle
} from 'lucide-react'

const ACTION_TYPES = [
  { value: '', label: 'All Actions' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'view', label: 'View' },
  { value: 'export', label: 'Export' },
  { value: 'settings_change', label: 'Settings Change' },
  { value: 'password_change', label: 'Password Change' },
  { value: 'role_change', label: 'Role Change' },
]

const ENTITY_TYPES = [
  { value: '', label: 'All Entities' },
  { value: 'inquiry', label: 'Inquiries' },
  { value: 'user', label: 'Users' },
  { value: 'settings', label: 'Settings' },
  { value: 'auth', label: 'Authentication' },
  { value: 'report', label: 'Reports' },
]

const ITEMS_PER_PAGE = 20

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [logsData, adminsData] = await Promise.all([
        db.auditLogs.getAll({
          action: (actionFilter as AuditAction) || undefined,
          resource_type: entityFilter || undefined,
          user_id: userFilter || undefined,
          from: dateRange.from || undefined,
          to: dateRange.to || undefined,
          limit: ITEMS_PER_PAGE,
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
        }),
        db.adminProfiles.getAll()
      ])
      
      setLogs(logsData.data || [])
      setTotalCount(logsData.count || 0)
      setAdmins(adminsData || [])
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }, [actionFilter, entityFilter, userFilter, dateRange, currentPage])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getAdminName = (userId: string) => {
    const admin = admins.find(a => a.id === userId)
    return admin?.full_name || 'Unknown User'
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <LogIn size={16} className="text-green-600" />
      case 'logout':
        return <LogOut size={16} className="text-blue-600" />
      case 'create':
        return <Plus size={16} className="text-green-600" />
      case 'update':
        return <Edit size={16} className="text-orange-600" />
      case 'delete':
        return <Trash2 size={16} className="text-red-600" />
      case 'view':
        return <Eye size={16} className="text-blue-600" />
      case 'export':
        return <Download size={16} className="text-purple-600" />
      case 'settings_change':
        return <Settings size={16} className="text-orange-600" />
      case 'password_change':
        return <Shield size={16} className="text-yellow-600" />
      case 'role_change':
        return <User size={16} className="text-purple-600" />
      default:
        return <FileText size={16} className="text-neutral-600" />
    }
  }

  const getActionBadge = (action: string) => {
    let variant: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default'
    
    switch (action) {
      case 'login':
      case 'create':
        variant = 'success'
        break
      case 'logout':
      case 'view':
        variant = 'info'
        break
      case 'update':
      case 'settings_change':
        variant = 'warning'
        break
      case 'delete':
        variant = 'error'
        break
      default:
        variant = 'default'
    }
    
    return <Badge variant={variant}>{action.replace('_', ' ')}</Badge>
  }

  const clearFilters = () => {
    setSearchQuery('')
    setActionFilter('')
    setEntityFilter('')
    setUserFilter('')
    setDateRange({ from: null, to: null })
    setCurrentPage(1)
  }

  const hasActiveFilters = actionFilter || entityFilter || userFilter || dateRange.from || dateRange.to

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // Filter logs by search query (client-side filtering for resource_name/resource_id)
  const filteredLogs = searchQuery 
    ? logs.filter(log => 
        log.resource_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource_id?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : logs

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource Type', 'Resource ID', 'Resource Name', 'IP Address', 'User Agent'].join(','),
      ...filteredLogs.map(log => [
        formatDateTime(log.timestamp || ''),
        getAdminName(log.user_id || ''),
        log.action,
        log.resource_type || '',
        log.resource_id || '',
        `"${(log.resource_name || '').replace(/"/g, '""')}"`,
        String(log.ip_address || ''),
        `"${(log.user_agent || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Track all system activities and user actions"
        breadcrumb={[
          { label: 'Dashboard', href: '/cms/dashboard' },
          { label: 'Audit Logs' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport} disabled={filteredLogs.length === 0}>
              <Download size={18} />
              Export CSV
            </Button>
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by description or entity ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>
          
          {/* Toggle Filters Button */}
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <X size={18} />
              Clear
            </Button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-200">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1) }}
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {ACTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Entity Type</label>
              <select
                value={entityFilter}
                onChange={(e) => { setEntityFilter(e.target.value); setCurrentPage(1) }}
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {ENTITY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">User</label>
              <select
                value={userFilter}
                onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1) }}
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="">All Users</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.full_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date Range</label>
              <DateRangePicker
                value={dateRange}
                onChange={(range) => { setDateRange(range); setCurrentPage(1) }}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-neutral-600">Loading audit logs...</p>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle size={48} className="text-neutral-300 mb-4" />
            <p className="text-lg font-medium text-neutral-900 mb-1">No audit logs found</p>
            <p className="text-neutral-500">
              {hasActiveFilters ? 'Try adjusting your filters' : 'No activity recorded yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-neutral-400" />
                          <span className="text-neutral-900">{formatDateTime(log.timestamp || '')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-primary-600" />
                          </div>
                          <span className="text-sm font-medium text-neutral-900">
                            {getAdminName(log.user_id || '')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {log.resource_type && (
                            <span className="font-medium text-neutral-900">{log.resource_type}</span>
                          )}
                          {log.resource_id && (
                            <span className="text-neutral-500 ml-1">#{log.resource_id.slice(0, 8)}</span>
                          )}
                          {!log.resource_type && !log.resource_id && (
                            <span className="text-neutral-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-700 max-w-xs truncate" title={log.resource_name || ''}>
                          {log.resource_name || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                          {log.ip_address ? (
                            <div className="flex items-center gap-1" title="IP Address">
                              <Globe size={12} />
                              <span>{String(log.ip_address)}</span>
                            </div>
                          ) : null}
                          {log.user_agent && (
                            <div className="flex items-center gap-1" title={log.user_agent}>
                              <Monitor size={12} />
                              <span className="max-w-[100px] truncate">
                                {log.user_agent.includes('Chrome') ? 'Chrome' :
                                 log.user_agent.includes('Firefox') ? 'Firefox' :
                                 log.user_agent.includes('Safari') ? 'Safari' :
                                 log.user_agent.includes('Edge') ? 'Edge' : 'Browser'}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of{' '}
                <span className="font-medium">{totalCount}</span> results
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                          ${currentPage === page 
                            ? 'bg-primary-600 text-white' 
                            : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
