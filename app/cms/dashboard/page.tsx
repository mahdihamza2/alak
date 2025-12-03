'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db, Inquiry } from '@/lib/supabase/client'
import { StatsCard, PageHeader } from '@/components/cms'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Droplet,
  Fuel,
  Plane,
  Calendar,
  Building2,
  ArrowRight,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  MessageSquare,
  UserCheck
} from 'lucide-react'
import { formatDateTime, getProductLabel } from '@/lib/utils/helpers'

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    qualified: 0,
    contacted: 0,
  })

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    
    try {
      const data = await db.inquiries.getAll()
      setInquiries(data)

      setStats({
        total: data.length,
        pending: data.filter(i => i.status === 'pending').length,
        qualified: data.filter(i => i.status === 'qualified').length,
        contacted: data.filter(i => i.status === 'contacted').length,
      })
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'error' }> = {
      pending: { label: 'Pending', variant: 'warning' },
      contacted: { label: 'Contacted', variant: 'info' },
      qualified: { label: 'Qualified', variant: 'success' },
      negotiating: { label: 'Negotiating', variant: 'info' },
      closed_won: { label: 'Closed Won', variant: 'success' },
      closed_lost: { label: 'Closed Lost', variant: 'error' },
    }
    const config = statusConfig[status] || { label: status, variant: 'default' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Overview of partnership inquiries and business leads"
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchInquiries(true)}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} />
              Export
            </Button>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Inquiries"
          value={stats.total}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Contacted"
          value={stats.contacted}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Qualified Leads"
          value={stats.qualified}
          icon={CheckCircle}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link 
          href="/cms/dashboard/inquiries?status=pending"
          className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors group"
        >
          <div className="p-3 bg-orange-100 rounded-lg">
            <Clock size={20} className="text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">Review Pending</p>
            <p className="text-sm text-neutral-600">{stats.pending} inquiries waiting</p>
          </div>
          <ArrowRight size={20} className="text-orange-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link 
          href="/cms/dashboard/inquiries?status=contacted"
          className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors group"
        >
          <div className="p-3 bg-purple-100 rounded-lg">
            <MessageSquare size={20} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">Follow Up</p>
            <p className="text-sm text-neutral-600">{stats.contacted} need follow-up</p>
          </div>
          <ArrowRight size={20} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link 
          href="/cms/dashboard/inquiries?status=qualified"
          className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <UserCheck size={20} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">Qualified Leads</p>
            <p className="text-sm text-neutral-600">{stats.qualified} ready to convert</p>
          </div>
          <ArrowRight size={20} className="text-green-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Recent Inquiries</h2>
            <p className="text-sm text-neutral-500">Latest partnership requests</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Filter size={16} />
              Filter
            </Button>
            <Link href="/cms/dashboard/inquiries">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No inquiries yet</h3>
            <p className="text-neutral-500 max-w-sm mx-auto">
              When potential partners submit inquiries through the contact form, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {inquiries.slice(0, 10).map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-primary-700">
                            {inquiry.full_name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 truncate">{inquiry.full_name}</p>
                          <a 
                            href={`mailto:${inquiry.email}`}
                            className="text-sm text-neutral-500 hover:text-primary-600 truncate block"
                          >
                            {inquiry.email}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-neutral-400 shrink-0" />
                        <span className="text-neutral-900">{inquiry.company_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getProductIcon(inquiry.product_type)}
                        <span className="text-neutral-700">{getProductLabel(inquiry.product_type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-900">
                        {inquiry.estimated_volume} {inquiry.volume_unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Calendar size={14} />
                        <span className="text-sm">{formatDateTime(inquiry.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/cms/dashboard/inquiries/${inquiry.id}`}>
                          <button className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye size={18} />
                          </button>
                        </Link>
                        <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {inquiries.length > 10 && (
          <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
            <Link href="/cms/dashboard/inquiries" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all {inquiries.length} inquiries →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
