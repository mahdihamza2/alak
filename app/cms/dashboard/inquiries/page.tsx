'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { db, Inquiry } from '@/lib/supabase/client'
import { PageHeader } from '@/components/cms'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  Building2,
  Calendar,
  Droplet,
  Fuel,
  Plane,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import { formatDateTime, getProductLabel } from '@/lib/utils/helpers'

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
]

const ITEMS_PER_PAGE = 15

export default function InquiriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([])

  useEffect(() => {
    fetchInquiries()
  }, [])

  useEffect(() => {
    filterInquiries()
  }, [inquiries, searchQuery, statusFilter])

  const fetchInquiries = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    
    try {
      const data = await db.inquiries.getAll()
      setInquiries(data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const filterInquiries = useCallback(() => {
    let filtered = [...inquiries]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(i => 
        i.full_name.toLowerCase().includes(query) ||
        i.email.toLowerCase().includes(query) ||
        i.company_name.toLowerCase().includes(query) ||
        i.phone.includes(query)
      )
    }

    setFilteredInquiries(filtered)
    setCurrentPage(1)
  }, [inquiries, searchQuery, statusFilter])

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

  // Pagination
  const totalPages = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE)
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleSelectAll = () => {
    if (selectedInquiries.length === paginatedInquiries.length) {
      setSelectedInquiries([])
    } else {
      setSelectedInquiries(paginatedInquiries.map(i => i.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedInquiries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading inquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Inquiries"
        description={`${filteredInquiries.length} total inquiries`}
        breadcrumb={[
          { label: 'Dashboard', href: '/cms/dashboard' },
          { label: 'Inquiries' }
        ]}
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
              Export CSV
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by name, email, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(statusFilter !== 'all' || searchQuery) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
            <span className="text-sm text-neutral-500">Active filters:</span>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 
                         rounded-lg text-sm hover:bg-primary-100"
              >
                Status: {statusOptions.find(s => s.value === statusFilter)?.label}
                <X size={14} />
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 
                         rounded-lg text-sm hover:bg-primary-100"
              >
                Search: "{searchQuery}"
                <X size={14} />
              </button>
            )}
            <button
              onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
              className="text-sm text-neutral-500 hover:text-neutral-700 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No inquiries found</h3>
            <p className="text-neutral-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'When potential partners submit inquiries, they will appear here.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={selectedInquiries.length === paginatedInquiries.length && paginatedInquiries.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                      />
                    </th>
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
                  {paginatedInquiries.map((inquiry) => (
                    <tr 
                      key={inquiry.id} 
                      className={`hover:bg-neutral-50 transition-colors ${
                        selectedInquiries.includes(inquiry.id) ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedInquiries.includes(inquiry.id)}
                          onChange={() => toggleSelect(inquiry.id)}
                          className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-primary-700">
                              {inquiry.full_name.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{inquiry.full_name}</p>
                            <div className="flex items-center gap-3 text-sm text-neutral-500">
                              <a href={`mailto:${inquiry.email}`} className="hover:text-primary-600 flex items-center gap-1">
                                <Mail size={12} />
                                <span className="truncate max-w-[150px]">{inquiry.email}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-neutral-400 shrink-0" />
                          <span className="text-neutral-900 truncate max-w-[150px]">{inquiry.company_name}</span>
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
                          <button 
                            onClick={() => router.push(`/cms/dashboard/inquiries/${inquiry.id}`)}
                            className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredInquiries.length)} of {filteredInquiries.length} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-neutral-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors
                            ${currentPage === page 
                              ? 'bg-primary-600 text-white' 
                              : 'hover:bg-neutral-100 text-neutral-700'
                            }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))
                  }
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Bulk Actions */}
        {selectedInquiries.length > 0 && (
          <div className="px-6 py-4 bg-primary-50 border-t border-primary-100 flex items-center justify-between">
            <p className="text-sm font-medium text-primary-700">
              {selectedInquiries.length} item{selectedInquiries.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Update Status
              </Button>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
              <button
                onClick={() => setSelectedInquiries([])}
                className="text-sm text-primary-600 hover:text-primary-700 ml-2"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
