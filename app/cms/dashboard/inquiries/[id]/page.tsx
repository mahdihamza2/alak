'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { db, Inquiry, InquiryLog, AdminProfile } from '@/lib/supabase/client'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal, { ConfirmModal } from '@/components/ui/Modal'
import Timeline from '@/components/ui/Timeline'
import { formatDateTime, getProductLabel, getCategoryLabel } from '@/lib/utils/helpers'
import { 
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Building2,
  Calendar,
  Droplet,
  Fuel,
  Plane,
  User,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Trash2,
  Edit,
  Save,
  X,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  UserPlus
} from 'lucide-react'

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'contacted', label: 'Contacted', color: 'info' },
  { value: 'qualified', label: 'Qualified', color: 'success' },
  { value: 'negotiating', label: 'Negotiating', color: 'info' },
  { value: 'closed_won', label: 'Closed Won', color: 'success' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'error' },
] as const

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [logs, setLogs] = useState<InquiryLog[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [adjacentIds, setAdjacentIds] = useState<{ prevId: string | null; nextId: string | null }>({ prevId: null, nextId: null })
  
  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  
  // Form states
  const [newStatus, setNewStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')
  const [newNote, setNewNote] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const [inquiryId, setInquiryId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setInquiryId(p.id))
  }, [params])

  const fetchData = useCallback(async () => {
    if (!inquiryId) return
    
    try {
      const [inquiryData, logsData, adminsData] = await Promise.all([
        db.inquiries.getById(inquiryId),
        db.inquiryLogs.getByInquiryId(inquiryId),
        db.adminProfiles.getAll()
      ])
      
      setInquiry(inquiryData)
      setLogs(logsData || [])
      setAdmins(adminsData || [])
      setNewStatus(inquiryData.status)
      setSelectedAdmin(inquiryData.assigned_to || '')

      // Get adjacent inquiry IDs
      const adjacent = await db.inquiries.getAdjacentIds(inquiryId, inquiryData.created_at)
      setAdjacentIds(adjacent)
    } catch (error) {
      console.error('Error fetching inquiry:', error)
    } finally {
      setLoading(false)
    }
  }, [inquiryId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleStatusUpdate = async () => {
    if (!inquiry || newStatus === inquiry.status) return
    
    setIsUpdating(true)
    try {
      await db.inquiries.update(inquiry.id, { status: newStatus })
      await db.inquiryLogs.create({
        inquiry_id: inquiry.id,
        action: 'status_change',
        old_status: inquiry.status,
        new_status: newStatus,
        notes: statusNote || undefined,
      })
      
      await fetchData()
      setShowStatusModal(false)
      setStatusNote('')
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAssignAdmin = async () => {
    if (!inquiry) return
    
    setIsUpdating(true)
    try {
      await db.inquiries.update(inquiry.id, { assigned_to: selectedAdmin || null })
      await db.inquiryLogs.create({
        inquiry_id: inquiry.id,
        action: 'assigned',
        notes: selectedAdmin 
          ? `Assigned to ${admins.find(a => a.id === selectedAdmin)?.full_name}`
          : 'Unassigned',
      })
      
      await fetchData()
    } catch (error) {
      console.error('Error assigning admin:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddNote = async () => {
    if (!inquiry || !newNote.trim()) return
    
    setIsUpdating(true)
    try {
      const currentNotes = inquiry.notes || ''
      const timestamp = new Date().toLocaleString()
      const updatedNotes = currentNotes 
        ? `${currentNotes}\n\n[${timestamp}]\n${newNote}`
        : `[${timestamp}]\n${newNote}`
      
      await db.inquiries.update(inquiry.id, { notes: updatedNotes })
      await db.inquiryLogs.create({
        inquiry_id: inquiry.id,
        action: 'note_added',
        notes: newNote,
      })
      
      await fetchData()
      setShowNoteModal(false)
      setNewNote('')
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!inquiry) return
    
    setIsUpdating(true)
    try {
      await db.inquiries.delete(inquiry.id)
      router.push('/cms/dashboard/inquiries')
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      setIsUpdating(false)
    }
  }

  const getProductIcon = (product: string) => {
    switch (product) {
      case 'crude-oil':
        return <Droplet size={20} className="text-amber-600" />
      case 'pms':
      case 'ago':
        return <Fuel size={20} className="text-blue-600" />
      case 'jet-fuel':
        return <Plane size={20} className="text-purple-600" />
      default:
        return <Droplet size={20} className="text-neutral-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const config = statusOptions.find(s => s.value === status) || { label: status, color: 'default' }
    return <Badge variant={config.color as 'default' | 'success' | 'warning' | 'info' | 'error'}>{config.label}</Badge>
  }

  const getTimelineItems = () => {
    return logs.map(log => {
      let type: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default'
      let icon = <Clock size={14} />
      
      if (log.action === 'status_change') {
        if (log.new_status === 'qualified' || log.new_status === 'closed_won') {
          type = 'success'
          icon = <CheckCircle size={14} />
        } else if (log.new_status === 'closed_lost') {
          type = 'error'
          icon = <XCircle size={14} />
        } else {
          type = 'info'
        }
      } else if (log.action === 'note_added') {
        icon = <MessageSquare size={14} />
      } else if (log.action === 'assigned') {
        icon = <UserPlus size={14} />
        type = 'info'
      }
      
      return {
        id: log.id,
        title: log.action === 'status_change' 
          ? `Status changed from ${log.old_status} to ${log.new_status}`
          : log.action === 'note_added'
          ? 'Note added'
          : log.action === 'assigned'
          ? log.notes || 'Assignment changed'
          : log.action,
        description: log.notes && log.action === 'status_change' ? log.notes : undefined,
        timestamp: formatDateTime(log.created_at),
        icon,
        type,
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading inquiry...</p>
        </div>
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <AlertCircle size={48} className="mx-auto text-neutral-400 mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Inquiry Not Found</h2>
          <p className="text-neutral-600 mb-6">The inquiry you're looking for doesn't exist or has been deleted.</p>
          <Link href="/cms/dashboard/inquiries">
            <Button>
              <ArrowLeft size={18} />
              Back to Inquiries
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title={inquiry.full_name}
        description={inquiry.company_name}
        breadcrumb={[
          { label: 'Dashboard', href: '/cms/dashboard' },
          { label: 'Inquiries', href: '/cms/dashboard/inquiries' },
          { label: inquiry.full_name }
        ]}
        actions={
          <div className="flex items-center gap-2">
            {adjacentIds.prevId && (
              <Link href={`/cms/dashboard/inquiries/${adjacentIds.prevId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} />
                  Previous
                </Button>
              </Link>
            )}
            {adjacentIds.nextId && (
              <Link href={`/cms/dashboard/inquiries/${adjacentIds.nextId}`}>
                <Button variant="outline" size="sm">
                  Next
                  <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Contact Information</h2>
              {getStatusBadge(inquiry.status)}
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-primary-700">
                    {inquiry.full_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">{inquiry.full_name}</h3>
                  <div className="flex items-center gap-2 text-neutral-600 mt-1">
                    <Building2 size={16} />
                    <span>{inquiry.company_name}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <Mail size={18} className="text-neutral-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500">Email</p>
                    <a href={`mailto:${inquiry.email}`} className="text-sm font-medium text-neutral-900 hover:text-primary-600 truncate block">
                      {inquiry.email}
                    </a>
                  </div>
                  <button 
                    onClick={() => handleCopy(inquiry.email, 'email')}
                    className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    {copied === 'email' ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-neutral-400" />}
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <Phone size={18} className="text-neutral-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500">Phone</p>
                    <a href={`tel:${inquiry.phone}`} className="text-sm font-medium text-neutral-900 hover:text-primary-600">
                      {inquiry.phone}
                    </a>
                  </div>
                  <button 
                    onClick={() => handleCopy(inquiry.phone, 'phone')}
                    className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    {copied === 'phone' ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-neutral-400" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Details Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Inquiry Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Category</p>
                  <Badge variant="info">{getCategoryLabel(inquiry.category)}</Badge>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Product</p>
                  <div className="flex items-center gap-2">
                    {getProductIcon(inquiry.product_type)}
                    <span className="font-medium text-neutral-900">{getProductLabel(inquiry.product_type)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Volume</p>
                  <p className="font-semibold text-neutral-900">{inquiry.estimated_volume} {inquiry.volume_unit}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Message</p>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-700 whitespace-pre-wrap">{inquiry.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Calendar size={16} />
                  <span>Submitted: {formatDateTime(inquiry.created_at)}</span>
                </div>
                {inquiry.source && (
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <ExternalLink size={16} />
                    <span>Source: {inquiry.source}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Notes</h2>
              <Button variant="outline" size="sm" onClick={() => setShowNoteModal(true)}>
                <MessageSquare size={16} />
                Add Note
              </Button>
            </div>
            <div className="p-6">
              {inquiry.notes ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-neutral-700 bg-neutral-50 p-4 rounded-xl">
                    {inquiry.notes}
                  </pre>
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-8">No notes yet. Add one to track progress.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <a 
                href={`mailto:${inquiry.email}?subject=Re: Partnership Inquiry - Alak Oil and Gas`}
                className="flex items-center gap-3 w-full p-3 text-left hover:bg-neutral-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Send Email</p>
                  <p className="text-sm text-neutral-500">Reply to inquiry</p>
                </div>
              </a>
              
              <a 
                href={`tel:${inquiry.phone}`}
                className="flex items-center gap-3 w-full p-3 text-left hover:bg-neutral-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Call Contact</p>
                  <p className="text-sm text-neutral-500">{inquiry.phone}</p>
                </div>
              </a>

              <button 
                onClick={() => setShowStatusModal(true)}
                className="flex items-center gap-3 w-full p-3 text-left hover:bg-neutral-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Edit size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Update Status</p>
                  <p className="text-sm text-neutral-500">Change inquiry status</p>
                </div>
              </button>

              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-3 w-full p-3 text-left hover:bg-red-50 rounded-xl transition-colors text-red-600"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Delete Inquiry</p>
                  <p className="text-sm text-red-400">Permanently remove</p>
                </div>
              </button>
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Assignment</h2>
            </div>
            <div className="p-4">
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="">Unassigned</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.full_name} ({admin.role})
                  </option>
                ))}
              </select>
              {selectedAdmin !== (inquiry.assigned_to || '') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={handleAssignAdmin}
                  disabled={isUpdating}
                >
                  {isUpdating ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Assignment
                </Button>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Activity</h2>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <Timeline items={getTimelineItems()} />
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Status"
        description="Change the status of this inquiry"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Note (optional)</label>
            <Textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Add a note about this status change..."
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isUpdating || newStatus === inquiry.status}>
              {isUpdating ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              Update Status
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Add Note"
        description="Add a note to track progress on this inquiry"
      >
        <div className="space-y-4">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            rows={4}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowNoteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={isUpdating || !newNote.trim()}>
              {isUpdating ? <RefreshCw size={16} className="animate-spin" /> : <MessageSquare size={16} />}
              Add Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Inquiry"
        message="Are you sure you want to delete this inquiry? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  )
}
