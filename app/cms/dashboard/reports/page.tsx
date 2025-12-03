'use client'

import { useEffect, useState, useCallback } from 'react'
import { db, Inquiry, AdminProfile } from '@/lib/supabase/client'
import { AuditLog } from '@/lib/supabase/database.types'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import DateRangePicker, { DateRange } from '@/components/ui/DateRangePicker'
import { formatDateTime, getProductLabel, getCategoryLabel } from '@/lib/utils/helpers'
import { 
  FileText,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Calendar,
  Filter,
  MessageSquare,
  Shield,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Loader2
} from 'lucide-react'

type ReportType = 'inquiries' | 'activity' | 'performance'

interface ReportFilters {
  dateRange: DateRange
  status?: string
  product?: string
  category?: string
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('inquiries')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null)
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: { from: null, to: null }
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [inquiriesData, auditData, adminsData] = await Promise.all([
        db.inquiries.getByDateRange(
          filters.dateRange.from || undefined,
          filters.dateRange.to || undefined
        ),
        db.auditLogs.getAll({
          from: filters.dateRange.from || undefined,
          to: filters.dateRange.to || undefined,
          limit: 500
        }),
        db.adminProfiles.getAll()
      ])
      
      setInquiries(inquiriesData || [])
      setAuditLogs(auditData.data || [])
      setAdmins(adminsData || [])
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }, [filters.dateRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getFilteredInquiries = () => {
    let filtered = [...inquiries]
    if (filters.status) {
      filtered = filtered.filter(i => i.status === filters.status)
    }
    if (filters.product) {
      filtered = filtered.filter(i => i.product_type === filters.product)
    }
    if (filters.category) {
      filtered = filtered.filter(i => i.category === filters.category)
    }
    return filtered
  }

  const getAdminName = (userId: string) => {
    const admin = admins.find(a => a.id === userId)
    return admin?.full_name || 'Unknown'
  }

  const generateCSV = () => {
    setExporting('csv')
    
    let csvContent = ''
    
    if (reportType === 'inquiries') {
      const filtered = getFilteredInquiries()
      csvContent = [
        ['ID', 'Full Name', 'Company', 'Email', 'Phone', 'Category', 'Product', 'Volume', 'Status', 'Source', 'Created At'].join(','),
        ...filtered.map(i => [
          i.id,
          `"${i.full_name}"`,
          `"${i.company_name}"`,
          i.email,
          i.phone,
          getCategoryLabel(i.category),
          getProductLabel(i.product_type),
          `${i.estimated_volume} ${i.volume_unit}`,
          i.status,
          i.source || 'direct',
          formatDateTime(i.created_at)
        ].join(','))
      ].join('\n')
    } else if (reportType === 'activity') {
      csvContent = [
        ['Timestamp', 'User', 'Action', 'Resource Type', 'Resource ID', 'Resource Name'].join(','),
        ...auditLogs.map(log => [
          formatDateTime(log.timestamp || ''),
          `"${getAdminName(log.user_id || '')}"`,
          log.action,
          log.resource_type || '',
          log.resource_id || '',
          `"${(log.resource_name || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n')
    } else {
      // Performance report
      const stats = calculatePerformanceStats()
      csvContent = [
        ['Metric', 'Value'].join(','),
        ['Total Inquiries', stats.total],
        ['Pending', stats.pending],
        ['Contacted', stats.contacted],
        ['Qualified', stats.qualified],
        ['Closed Won', stats.closedWon],
        ['Closed Lost', stats.closedLost],
        ['Conversion Rate', `${stats.conversionRate.toFixed(2)}%`],
        ['Report Generated', formatDateTime(new Date().toISOString())]
      ].join('\n')
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setExporting(null)
  }

  const generatePDF = async () => {
    setExporting('pdf')
    
    try {
      // Dynamically import jsPDF
      const { default: jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      let yPos = 20
      
      // Header
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Alak Oil and Gas', pageWidth / 2, yPos, { align: 'center' })
      yPos += 10
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      const reportTitle = reportType === 'inquiries' ? 'Inquiries Report' 
        : reportType === 'activity' ? 'Activity Report' 
        : 'Performance Report'
      doc.text(reportTitle, pageWidth / 2, yPos, { align: 'center' })
      yPos += 8
      
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Generated: ${formatDateTime(new Date().toISOString())}`, pageWidth / 2, yPos, { align: 'center' })
      yPos += 15
      
      // Horizontal line
      doc.setDrawColor(200)
      doc.line(20, yPos, pageWidth - 20, yPos)
      yPos += 10
      
      doc.setTextColor(0)
      
      if (reportType === 'inquiries') {
        const filtered = getFilteredInquiries()
        
        // Summary stats
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Summary', 20, yPos)
        yPos += 8
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Total Inquiries: ${filtered.length}`, 25, yPos)
        yPos += 6
        doc.text(`Pending: ${filtered.filter(i => i.status === 'pending').length}`, 25, yPos)
        yPos += 6
        doc.text(`Closed Won: ${filtered.filter(i => i.status === 'closed_won').length}`, 25, yPos)
        yPos += 6
        doc.text(`Closed Lost: ${filtered.filter(i => i.status === 'closed_lost').length}`, 25, yPos)
        yPos += 15
        
        // Table Header
        doc.setFont('helvetica', 'bold')
        doc.setFillColor(240, 240, 240)
        doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F')
        
        const colWidths = [50, 50, 40, 30]
        const colStarts = [20, 70, 120, 160]
        
        doc.text('Contact', colStarts[0], yPos)
        doc.text('Company', colStarts[1], yPos)
        doc.text('Product', colStarts[2], yPos)
        doc.text('Status', colStarts[3], yPos)
        yPos += 8
        
        doc.setFont('helvetica', 'normal')
        
        // Table rows
        filtered.slice(0, 30).forEach((inquiry) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          
          doc.text(inquiry.full_name.slice(0, 20), colStarts[0], yPos)
          doc.text(inquiry.company_name.slice(0, 20), colStarts[1], yPos)
          doc.text(getProductLabel(inquiry.product_type).slice(0, 15), colStarts[2], yPos)
          doc.text(inquiry.status.replace('_', ' '), colStarts[3], yPos)
          yPos += 6
        })
        
        if (filtered.length > 30) {
          yPos += 5
          doc.setFont('helvetica', 'italic')
          doc.text(`... and ${filtered.length - 30} more inquiries`, 20, yPos)
        }
        
      } else if (reportType === 'activity') {
        // Activity log summary
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Activity Summary', 20, yPos)
        yPos += 8
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Total Activities: ${auditLogs.length}`, 25, yPos)
        yPos += 15
        
        // Activity by type
        const byAction: Record<string, number> = {}
        auditLogs.forEach(log => {
          byAction[log.action] = (byAction[log.action] || 0) + 1
        })
        
        doc.setFont('helvetica', 'bold')
        doc.text('Activities by Type', 20, yPos)
        yPos += 8
        
        doc.setFont('helvetica', 'normal')
        Object.entries(byAction).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([action, count]) => {
          doc.text(`• ${action.replace('_', ' ')}: ${count}`, 25, yPos)
          yPos += 6
        })
        
      } else {
        // Performance stats
        const stats = calculatePerformanceStats()
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Performance Metrics', 20, yPos)
        yPos += 10
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        const metrics = [
          ['Total Inquiries', stats.total.toString()],
          ['Pending', stats.pending.toString()],
          ['Contacted', stats.contacted.toString()],
          ['Qualified', stats.qualified.toString()],
          ['Closed Won', stats.closedWon.toString()],
          ['Closed Lost', stats.closedLost.toString()],
          ['Conversion Rate', `${stats.conversionRate.toFixed(2)}%`]
        ]
        
        metrics.forEach(([label, value]) => {
          doc.text(`${label}:`, 25, yPos)
          doc.text(value, 100, yPos)
          yPos += 8
        })
        
        // Funnel visualization (simple text version)
        yPos += 10
        doc.setFont('helvetica', 'bold')
        doc.text('Sales Funnel', 20, yPos)
        yPos += 10
        
        doc.setFont('helvetica', 'normal')
        const funnel = [
          { stage: 'Total', value: stats.total },
          { stage: 'Contacted', value: stats.contacted + stats.qualified + stats.closedWon + stats.closedLost },
          { stage: 'Qualified', value: stats.qualified + stats.closedWon + stats.closedLost },
          { stage: 'Closed', value: stats.closedWon + stats.closedLost },
          { stage: 'Won', value: stats.closedWon }
        ]
        
        funnel.forEach(({ stage, value }) => {
          const percentage = stats.total > 0 ? ((value / stats.total) * 100).toFixed(1) : '0'
          const barLength = stats.total > 0 ? (value / stats.total) * 100 : 0
          
          doc.text(`${stage}: ${value} (${percentage}%)`, 25, yPos)
          doc.setFillColor(59, 130, 246)
          doc.rect(90, yPos - 3, barLength * 0.8, 4, 'F')
          yPos += 8
        })
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
          `Page ${i} of ${pageCount} | Alak Oil and Gas - Confidential`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        )
      }
      
      doc.save(`${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setExporting(null)
    }
  }

  const calculatePerformanceStats = () => {
    const filtered = getFilteredInquiries()
    const pending = filtered.filter(i => i.status === 'pending').length
    const contacted = filtered.filter(i => i.status === 'contacted').length
    const qualified = filtered.filter(i => i.status === 'qualified').length
    const closedWon = filtered.filter(i => i.status === 'closed_won').length
    const closedLost = filtered.filter(i => i.status === 'closed_lost').length
    const closedTotal = closedWon + closedLost
    
    return {
      total: filtered.length,
      pending,
      contacted,
      qualified,
      closedWon,
      closedLost,
      conversionRate: closedTotal > 0 ? (closedWon / closedTotal) * 100 : 0
    }
  }

  const tabs = [
    { id: 'inquiries', label: 'Inquiries Report', icon: <MessageSquare size={18} /> },
    { id: 'activity', label: 'Activity Report', icon: <Shield size={18} /> },
    { id: 'performance', label: 'Performance Report', icon: <TrendingUp size={18} /> },
  ]

  const stats = calculatePerformanceStats()

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export reports for your data"
        breadcrumb={[
          { label: 'Dashboard', href: '/cms/dashboard' },
          { label: 'Reports' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={generateCSV} 
              disabled={loading || exporting !== null}
            >
              {exporting === 'csv' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={18} />
              )}
              Export CSV
            </Button>
            <Button 
              onClick={generatePDF} 
              disabled={loading || exporting !== null}
            >
              {exporting === 'pdf' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileText size={18} />
              )}
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date Range</label>
            <DateRangePicker
              value={filters.dateRange}
              onChange={(dateRange) => setFilters(f => ({ ...f, dateRange }))}
              className="w-64"
            />
          </div>
          
          {reportType === 'inquiries' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined }))}
                  className="px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product</label>
                <select
                  value={filters.product || ''}
                  onChange={(e) => setFilters(f => ({ ...f, product: e.target.value || undefined }))}
                  className="px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="">All Products</option>
                  <option value="crude-oil">Crude Oil</option>
                  <option value="pms">PMS (Petrol)</option>
                  <option value="ago">AGO (Diesel)</option>
                  <option value="jet-fuel">Jet Fuel</option>
                </select>
              </div>
            </>
          )}
          
          <div className="flex-1" />
          
          <Button variant="outline" onClick={fetchData} disabled={loading} className="self-end">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <Tabs
          tabs={tabs}
          activeTab={reportType}
          onChange={(tab) => setReportType(tab as ReportType)}
          variant="underline"
          className="px-6 pt-4 border-b border-neutral-200"
        />
        
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-neutral-600">Loading report data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Inquiries Report */}
              {reportType === 'inquiries' && (
                <div>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <p className="text-sm text-neutral-500 mb-1">Total</p>
                      <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <p className="text-sm text-yellow-600 mb-1">Pending</p>
                      <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-sm text-green-600 mb-1">Closed Won</p>
                      <p className="text-2xl font-bold text-green-700">{stats.closedWon}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <p className="text-sm text-red-600 mb-1">Closed Lost</p>
                      <p className="text-2xl font-bold text-red-700">{stats.closedLost}</p>
                    </div>
                  </div>
                  
                  {/* Table Preview */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Volume</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {getFilteredInquiries().slice(0, 10).map((inquiry) => (
                          <tr key={inquiry.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-neutral-900">{inquiry.full_name}</p>
                              <p className="text-sm text-neutral-500">{inquiry.email}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-700">{inquiry.company_name}</td>
                            <td className="px-4 py-3 text-sm text-neutral-700">{getProductLabel(inquiry.product_type)}</td>
                            <td className="px-4 py-3 text-sm text-neutral-700">{inquiry.estimated_volume} {inquiry.volume_unit}</td>
                            <td className="px-4 py-3">
                              <Badge variant={
                                inquiry.status === 'pending' ? 'warning' :
                                inquiry.status === 'closed_won' ? 'success' :
                                inquiry.status === 'closed_lost' ? 'error' : 'info'
                              }>
                                {inquiry.status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-500">{formatDateTime(inquiry.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {getFilteredInquiries().length > 10 && (
                    <p className="text-sm text-neutral-500 mt-4 text-center">
                      Showing 10 of {getFilteredInquiries().length} inquiries. Export to see all.
                    </p>
                  )}
                </div>
              )}

              {/* Activity Report */}
              {reportType === 'activity' && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <p className="text-sm text-neutral-500 mb-1">Total Activities</p>
                      <p className="text-2xl font-bold text-neutral-900">{auditLogs.length}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-blue-600 mb-1">Unique Users</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {new Set(auditLogs.map(l => l.user_id)).size}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-sm text-green-600 mb-1">Logins</p>
                      <p className="text-2xl font-bold text-green-700">
                        {auditLogs.filter(l => l.action === 'login').length}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <p className="text-sm text-purple-600 mb-1">Changes Made</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {auditLogs.filter(l => ['create', 'update', 'delete'].includes(l.action)).length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Timestamp</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">User</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Action</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Resource</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Name</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {auditLogs.slice(0, 10).map((log) => (
                          <tr key={log.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-3 text-sm text-neutral-700">{formatDateTime(log.timestamp || '')}</td>
                            <td className="px-4 py-3 text-sm font-medium text-neutral-900">{getAdminName(log.user_id || '')}</td>
                            <td className="px-4 py-3">
                              <Badge variant={
                                log.action === 'login' ? 'success' :
                                log.action === 'delete' ? 'error' :
                                log.action === 'update' ? 'warning' : 'info'
                              }>
                                {log.action}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-700">{log.resource_type || '-'}</td>
                            <td className="px-4 py-3 text-sm text-neutral-500 max-w-xs truncate">{log.resource_name || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {auditLogs.length > 10 && (
                    <p className="text-sm text-neutral-500 mt-4 text-center">
                      Showing 10 of {auditLogs.length} activities. Export to see all.
                    </p>
                  )}
                </div>
              )}

              {/* Performance Report */}
              {reportType === 'performance' && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-neutral-50 rounded-xl p-4 text-center">
                      <MessageSquare size={24} className="mx-auto mb-2 text-neutral-500" />
                      <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                      <p className="text-xs text-neutral-500">Total</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 text-center">
                      <Clock size={24} className="mx-auto mb-2 text-yellow-500" />
                      <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                      <p className="text-xs text-yellow-600">Pending</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <Users size={24} className="mx-auto mb-2 text-blue-500" />
                      <p className="text-2xl font-bold text-blue-700">{stats.contacted}</p>
                      <p className="text-xs text-blue-600">Contacted</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <TrendingUp size={24} className="mx-auto mb-2 text-purple-500" />
                      <p className="text-2xl font-bold text-purple-700">{stats.qualified}</p>
                      <p className="text-xs text-purple-600">Qualified</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <CheckCircle size={24} className="mx-auto mb-2 text-green-500" />
                      <p className="text-2xl font-bold text-green-700">{stats.closedWon}</p>
                      <p className="text-xs text-green-600">Closed Won</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 text-center">
                      <XCircle size={24} className="mx-auto mb-2 text-red-500" />
                      <p className="text-2xl font-bold text-red-700">{stats.closedLost}</p>
                      <p className="text-xs text-red-600">Closed Lost</p>
                    </div>
                  </div>
                  
                  {/* Conversion Rate */}
                  <div className="bg-linear-to-r from-primary-50 to-primary-100 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-primary-600 font-medium mb-1">Overall Conversion Rate</p>
                        <p className="text-4xl font-bold text-primary-900">{stats.conversionRate.toFixed(1)}%</p>
                        <p className="text-sm text-primary-600 mt-1">
                          {stats.closedWon} won out of {stats.closedWon + stats.closedLost} closed
                        </p>
                      </div>
                      <div className="w-32 h-32 relative">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-primary-200"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray={`${stats.conversionRate * 3.52} 352`}
                            className="text-primary-600"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sales Funnel */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-6">Sales Funnel</h4>
                    <div className="space-y-3">
                      {[
                        { stage: 'Total Inquiries', value: stats.total, color: 'bg-neutral-300' },
                        { stage: 'Contacted', value: stats.contacted + stats.qualified + stats.closedWon + stats.closedLost, color: 'bg-blue-400' },
                        { stage: 'Qualified', value: stats.qualified + stats.closedWon + stats.closedLost, color: 'bg-purple-400' },
                        { stage: 'Closed', value: stats.closedWon + stats.closedLost, color: 'bg-orange-400' },
                        { stage: 'Won', value: stats.closedWon, color: 'bg-green-500' },
                      ].map((item, index) => {
                        const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0
                        return (
                          <div key={item.stage} className="flex items-center gap-4">
                            <div className="w-24 text-sm font-medium text-neutral-700">{item.stage}</div>
                            <div className="flex-1 h-8 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${item.color} rounded-full flex items-center justify-end pr-3 transition-all duration-500`}
                                style={{ width: `${Math.max(percentage, 10)}%` }}
                              >
                                <span className="text-xs font-semibold text-white">
                                  {item.value}
                                </span>
                              </div>
                            </div>
                            <div className="w-16 text-sm text-neutral-500 text-right">
                              {percentage.toFixed(0)}%
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
