'use client'

import { useEffect, useState } from 'react'
import { db, NewsArticle, PendingNewsForReview, BlogCategory } from '@/lib/supabase/client'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { 
  RefreshCw,
  Newspaper,
  Check,
  X,
  Eye,
  ExternalLink,
  Calendar,
  Clock,
  Filter,
  Star,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Send,
  ArrowUpRight,
  MessageSquare,
  Globe,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils/helpers'

export default function NewsPage() {
  const [pendingNews, setPendingNews] = useState<PendingNewsForReview[]>([])
  const [allNews, setAllNews] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<PendingNewsForReview | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')
  const [filters, setFilters] = useState({
    status: '',
    category: '',
  })
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    posted: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const [pending, allResult, categoriesData] = await Promise.all([
        db.newsArticles.getPendingForReview(),
        db.newsArticles.getAll({ limit: 100 }),
        db.blogCategories.getAll(true),
      ])

      setPendingNews(pending)
      setAllNews(allResult.data || [])
      setCategories(categoriesData)

      // Calculate stats
      const all = allResult.data || []
      setStats({
        pending: all.filter(n => n.auto_post_status === 'pending').length,
        approved: all.filter(n => n.auto_post_status === 'approved').length,
        rejected: all.filter(n => n.auto_post_status === 'rejected').length,
        posted: all.filter(n => n.auto_post_status === 'posted').length,
      })
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleApprove = async (id: string, notes?: string) => {
    setProcessing(id)
    try {
      await db.newsArticles.approve(id, notes)
      fetchData(true)
      setIsDetailModalOpen(false)
      setReviewNotes('')
    } catch (error) {
      console.error('Error approving article:', error)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string, notes?: string) => {
    setProcessing(id)
    try {
      await db.newsArticles.reject(id, notes)
      fetchData(true)
      setIsDetailModalOpen(false)
      setReviewNotes('')
    } catch (error) {
      console.error('Error rejecting article:', error)
    } finally {
      setProcessing(null)
    }
  }

  const openArticleDetail = (article: PendingNewsForReview) => {
    setSelectedArticle(article)
    setReviewNotes('')
    setIsDetailModalOpen(true)
  }

  const getSentimentBadge = (sentiment: string | null) => {
    const config: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'error' }> = {
      positive: { label: 'Positive', variant: 'success' },
      negative: { label: 'Negative', variant: 'error' },
      neutral: { label: 'Neutral', variant: 'default' },
      mixed: { label: 'Mixed', variant: 'warning' },
    }
    const c = config[sentiment || 'neutral'] || { label: sentiment || 'Unknown', variant: 'default' as const }
    return <Badge variant={c.variant}>{c.label}</Badge>
  }

  const getStatusBadge = (status: string | null) => {
    const config: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'error' }> = {
      pending: { label: 'Pending Review', variant: 'warning' },
      approved: { label: 'Approved', variant: 'info' },
      rejected: { label: 'Rejected', variant: 'error' },
      posted: { label: 'Posted', variant: 'success' },
      skipped: { label: 'Skipped', variant: 'default' },
    }
    const c = config[status || 'pending'] || { label: status || 'Unknown', variant: 'default' as const }
    return <Badge variant={c.variant}>{c.label}</Badge>
  }

  const getRelevanceColor = (score: number | null) => {
    if (!score) return 'bg-neutral-100 text-neutral-600'
    if (score >= 0.8) return 'bg-green-100 text-green-700'
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading news articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="News Review"
        description="Review and approve fetched news articles for auto-posting"
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.pending}</p>
              <p className="text-sm text-neutral-500">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Check size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.approved}</p>
              <p className="text-sm text-neutral-500">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <X size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.rejected}</p>
              <p className="text-sm text-neutral-500">Rejected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Send size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.posted}</p>
              <p className="text-sm text-neutral-500">Posted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-6">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Pending Review ({pendingNews.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            All Articles ({allNews.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        pendingNews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Newspaper size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No pending articles</h3>
            <p className="text-neutral-500 max-w-sm mx-auto">
              All fetched news articles have been reviewed. New articles will appear here after the next API fetch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingNews.map((article) => (
              <div 
                key={article.id}
                className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span>{article.source_name || 'Unknown Source'}</span>
                      <span>•</span>
                      <span>{formatDateTime(article.published_at || article.fetched_at || '')}</span>
                    </div>
                  </div>
                  {article.image_url && (
                    <img 
                      src={article.image_url} 
                      alt=""
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                  )}
                </div>

                <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                  {article.description || 'No description available'}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(article.relevance_score)}`}>
                    <Star size={12} className="inline mr-1" />
                    {((article.relevance_score || 0) * 100).toFixed(0)}% Relevance
                  </span>
                  {getSentimentBadge(article.sentiment)}
                  {article.target_category_name && (
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                      {article.target_category_name}
                    </span>
                  )}
                  {article.can_auto_post && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                      <Sparkles size={12} />
                      Auto-Post Ready
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => openArticleDetail(article)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(article.id!)}
                      disabled={processing === article.id}
                    >
                      <X size={14} />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(article.id!)}
                      disabled={processing === article.id}
                    >
                      <Check size={14} />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center gap-4">
            <Filter size={18} className="text-neutral-400" />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="posted">Posted</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Relevance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Fetched
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {allNews
                  .filter(a => !filters.status || a.auto_post_status === filters.status)
                  .filter(a => !filters.category || a.target_category_id === filters.category)
                  .map((article) => (
                    <tr key={article.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-sm">
                          <p className="font-medium text-neutral-900 truncate">{article.title}</p>
                          <p className="text-sm text-neutral-500 truncate">
                            {article.description || 'No description'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {article.source_icon && (
                            <img src={article.source_icon} alt="" className="w-4 h-4 rounded" />
                          )}
                          <span className="text-sm text-neutral-700">{article.source_name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(article.relevance_score)}`}>
                          {((article.relevance_score || 0) * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(article.auto_post_status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-500">
                          {formatDateTime(article.fetched_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {article.source_url && (
                            <a
                              href={article.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          {article.blog_post_id && (
                            <a
                              href={`/cms/dashboard/blog/${article.blog_post_id}`}
                              className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View Blog Post"
                            >
                              <ArrowUpRight size={16} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Article Details"
        size="lg"
      >
        {selectedArticle && (
          <div className="space-y-4">
            {selectedArticle.image_url && (
              <img 
                src={selectedArticle.image_url} 
                alt=""
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <h2 className="text-xl font-semibold text-neutral-900">
              {selectedArticle.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(selectedArticle.relevance_score)}`}>
                <Star size={12} className="inline mr-1" />
                {((selectedArticle.relevance_score || 0) * 100).toFixed(0)}% Relevance
              </span>
              {getSentimentBadge(selectedArticle.sentiment)}
              {selectedArticle.target_category_name && (
                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                  {selectedArticle.target_category_name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <Globe size={14} />
                {selectedArticle.source_name || 'Unknown Source'}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDateTime(selectedArticle.published_at || selectedArticle.fetched_at || '')}
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4">
              <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
              <p className="text-neutral-600">{selectedArticle.description || 'No description'}</p>
            </div>

            {selectedArticle.content && (
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 mb-2">Content</h4>
                <p className="text-neutral-600 text-sm whitespace-pre-wrap line-clamp-10">
                  {selectedArticle.content}
                </p>
              </div>
            )}

            {selectedArticle.generated_narrative && (
              <div className="bg-amber-50 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                  <Sparkles size={16} />
                  Generated Narrative
                </h4>
                <p className="text-amber-800 text-sm whitespace-pre-wrap">
                  {selectedArticle.generated_narrative}
                </p>
              </div>
            )}

            {selectedArticle.relevance_keywords && selectedArticle.relevance_keywords.length > 0 && (
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Matched Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.relevance_keywords.map((keyword, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <MessageSquare size={14} className="inline mr-1" />
                Review Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add notes about this article..."
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              {selectedArticle.source_url && (
                <a
                  href={selectedArticle.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <ExternalLink size={14} />
                  View Original
                </a>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedArticle.id!, reviewNotes)}
                  disabled={processing === selectedArticle.id}
                >
                  <X size={16} />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedArticle.id!, reviewNotes)}
                  disabled={processing === selectedArticle.id}
                >
                  <Check size={16} />
                  Approve for Posting
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
