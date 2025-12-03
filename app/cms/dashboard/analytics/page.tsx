'use client'

import { useEffect, useState, useCallback } from 'react'
import { db, Inquiry } from '@/lib/supabase/client'
import { PageHeader, StatsCard } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import DateRangePicker, { DateRange } from '@/components/ui/DateRangePicker'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Calendar,
  Droplet,
  Fuel,
  Plane,
  Building2,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { formatDateTime, getProductLabel, getCategoryLabel } from '@/lib/utils/helpers'

interface AnalyticsStats {
  total: number
  pending: number
  contacted: number
  qualified: number
  closed_won: number
  closed_lost: number
  byProduct: Record<string, number>
  byCategory: Record<string, number>
  bySource: Record<string, number>
  dailyTrend: { date: string; count: number }[]
  conversionRate: number
  avgResponseTime: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Get all inquiries within date range
      const data = await db.inquiries.getByDateRange(
        dateRange.from || undefined,
        dateRange.to || undefined
      )
      
      setInquiries(data || [])
      
      // Calculate stats
      const stats: AnalyticsStats = {
        total: data?.length || 0,
        pending: 0,
        contacted: 0,
        qualified: 0,
        closed_won: 0,
        closed_lost: 0,
        byProduct: {},
        byCategory: {},
        bySource: {},
        dailyTrend: [],
        conversionRate: 0,
        avgResponseTime: 0
      }
      
      // Count by status
      data?.forEach((inquiry: Inquiry) => {
        // Status counts
        switch (inquiry.status) {
          case 'pending': stats.pending++; break
          case 'contacted': stats.contacted++; break
          case 'qualified': stats.qualified++; break
          case 'closed_won': stats.closed_won++; break
          case 'closed_lost': stats.closed_lost++; break
        }
        
        // By product
        const product = inquiry.product_type || 'unknown'
        stats.byProduct[product] = (stats.byProduct[product] || 0) + 1
        
        // By category
        const category = inquiry.category || 'unknown'
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
        
        // By source
        const source = inquiry.source || 'direct'
        stats.bySource[source] = (stats.bySource[source] || 0) + 1
      })
      
      // Daily trend (last 14 days)
      const dailyMap = new Map<string, number>()
      const today = new Date()
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        dailyMap.set(dateStr, 0)
      }
      
      data?.forEach((inquiry: Inquiry) => {
        const dateStr = new Date(inquiry.created_at).toISOString().split('T')[0]
        if (dailyMap.has(dateStr)) {
          dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1)
        }
      })
      
      stats.dailyTrend = Array.from(dailyMap.entries()).map(([date, count]) => ({
        date,
        count
      }))
      
      // Conversion rate
      const closedTotal = stats.closed_won + stats.closed_lost
      stats.conversionRate = closedTotal > 0 ? (stats.closed_won / closedTotal) * 100 : 0
      
      setStats(stats)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getMaxTrendValue = () => {
    if (!stats) return 1
    const max = Math.max(...stats.dailyTrend.map(d => d.count))
    return max || 1
  }

  const getProductIcon = (product: string) => {
    switch (product) {
      case 'crude-oil':
        return <Droplet size={16} className="text-amber-600" />
      case 'pms':
      case 'ago':
        return <Fuel size={16} className="text-blue-600" />
      case 'jet-fuel':
        return <Plane size={16} className="text-purple-600" />
      default:
        return <Droplet size={16} className="text-neutral-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Insights and statistics about your inquiries"
        breadcrumb={[
          { label: 'Dashboard', href: '/cms/dashboard' },
          { label: 'Analytics' }
        ]}
        actions={
          <div className="flex items-center gap-4">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-64"
            />
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Inquiries"
          value={stats.total.toString()}
          icon={MessageSquare}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending"
          value={stats.pending.toString()}
          icon={Clock}
          trend={{ value: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0, isPositive: false }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Closed Won"
          value={stats.closed_won.toString()}
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Inquiry Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Inquiry Trend</h3>
            <Badge variant="info">Last 14 days</Badge>
          </div>
          
          <div className="h-64">
            <div className="flex items-end justify-between h-52 gap-1">
              {stats.dailyTrend.map((day, index) => {
                const height = (day.count / getMaxTrendValue()) * 100
                const date = new Date(day.date)
                const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' })
                const dateLabel = date.getDate().toString()
                
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center h-48">
                      <div 
                        className="w-full max-w-8 bg-primary-500 rounded-t-lg transition-all duration-300 hover:bg-primary-600 relative group"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.count} inquiries
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium text-neutral-600">{dateLabel}</p>
                      <p className="text-xs text-neutral-400">{dayLabel}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Status Distribution</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
              { label: 'Contacted', value: stats.contacted, color: 'bg-blue-500' },
              { label: 'Qualified', value: stats.qualified, color: 'bg-green-500' },
              { label: 'Closed Won', value: stats.closed_won, color: 'bg-emerald-600' },
              { label: 'Closed Lost', value: stats.closed_lost, color: 'bg-red-500' },
            ].map((item) => {
              const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                    <span className="text-sm text-neutral-500">
                      {item.value} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Product */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">By Product Type</h3>
          
          <div className="space-y-3">
            {Object.entries(stats.byProduct).sort((a, b) => b[1] - a[1]).map(([product, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              return (
                <div key={product} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  {getProductIcon(product)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-900">
                        {getProductLabel(product)}
                      </span>
                      <span className="text-sm text-neutral-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            {Object.keys(stats.byProduct).length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* By Category */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">By Category</h3>
          
          <div className="space-y-3">
            {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([category, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              return (
                <div key={category} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <Building2 size={16} className="text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-900">
                        {getCategoryLabel(category)}
                      </span>
                      <span className="text-sm text-neutral-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            {Object.keys(stats.byCategory).length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* By Source */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">By Source</h3>
          
          <div className="space-y-3">
            {Object.entries(stats.bySource).sort((a, b) => b[1] - a[1]).map(([source, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              return (
                <div key={source} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <Globe size={16} className="text-purple-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-900 capitalize">
                        {source.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-neutral-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            {Object.keys(stats.bySource).length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="mt-6 bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Sales Funnel</h3>
        
        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {[
              { stage: 'Total Inquiries', value: stats.total, color: 'bg-neutral-200' },
              { stage: 'Contacted', value: stats.contacted + stats.qualified + stats.closed_won + stats.closed_lost, color: 'bg-blue-200' },
              { stage: 'Qualified', value: stats.qualified + stats.closed_won + stats.closed_lost, color: 'bg-green-200' },
              { stage: 'Closed', value: stats.closed_won + stats.closed_lost, color: 'bg-orange-200' },
              { stage: 'Won', value: stats.closed_won, color: 'bg-emerald-300' },
            ].map((stage, index, arr) => {
              const percentage = arr[0].value > 0 ? (stage.value / arr[0].value) * 100 : 0
              const width = 100 - (index * 12) // Decreasing width for funnel effect
              
              return (
                <div key={stage.stage} className="flex items-center gap-4 mb-2">
                  <div className="w-32 text-right">
                    <span className="text-sm font-medium text-neutral-700">{stage.stage}</span>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div 
                      className={`${stage.color} h-10 rounded-lg flex items-center justify-center transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-sm font-semibold text-neutral-800">
                        {stage.value} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-24">
                    {index > 0 && (
                      <span className="text-xs text-neutral-500">
                        {arr[index - 1].value > 0 
                          ? `${((stage.value / arr[index - 1].value) * 100).toFixed(0)}% conv.`
                          : '-'
                        }
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Recent Inquiries</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Contact</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Product</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.slice(0, 5).map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-neutral-900">{inquiry.full_name}</p>
                      <p className="text-sm text-neutral-500">{inquiry.company_name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getProductIcon(inquiry.product_type)}
                      <span className="text-sm text-neutral-700">{getProductLabel(inquiry.product_type)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant={
                        inquiry.status === 'pending' ? 'warning' :
                        inquiry.status === 'contacted' ? 'info' :
                        inquiry.status === 'qualified' || inquiry.status === 'closed_won' ? 'success' :
                        inquiry.status === 'closed_lost' ? 'error' : 'default'
                      }
                    >
                      {inquiry.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-500">
                    {formatDateTime(inquiry.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
