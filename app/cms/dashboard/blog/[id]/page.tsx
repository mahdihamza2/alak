'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { db, BlogPost, BlogCategory, BlogPostUpdate } from '@/lib/supabase/client'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft,
  Save,
  Send,
  Eye,
  Calendar,
  Tag,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Globe,
  X,
  Plus,
} from 'lucide-react'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [newTag, setNewTag] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category_id: '',
    tags: [] as string[],
    featured_image: '',
    featured_image_alt: '',
    meta_title: '',
    meta_description: '',
    author_name: '',
    author_role: '',
    status: 'draft',
    scheduled_for: '',
    analysis_summary: '',
    market_outlook: '',
    key_factors: [] as string[],
  })

  useEffect(() => {
    fetchData()
  }, [postId])

  const fetchData = async () => {
    try {
      const [postData, categoriesData] = await Promise.all([
        db.blogPosts.getById(postId),
        db.blogCategories.getAll(true),
      ])

      setPost(postData)
      setCategories(categoriesData)

      setFormData({
        title: postData.title || '',
        slug: postData.slug || '',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        category_id: postData.category_id || '',
        tags: postData.tags || [],
        featured_image: postData.featured_image || '',
        featured_image_alt: postData.featured_image_alt || '',
        meta_title: postData.meta_title || '',
        meta_description: postData.meta_description || '',
        author_name: postData.author_name || '',
        author_role: postData.author_role || '',
        status: postData.status || 'draft',
        scheduled_for: postData.scheduled_for || '',
        analysis_summary: postData.analysis_summary || '',
        market_outlook: postData.market_outlook || '',
        key_factors: postData.key_factors || [],
      })
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updateData: BlogPostUpdate = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        category_id: formData.category_id || null,
        tags: formData.tags,
        featured_image: formData.featured_image || null,
        featured_image_alt: formData.featured_image_alt || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        author_name: formData.author_name || null,
        author_role: formData.author_role || null,
        status: formData.status,
        scheduled_for: formData.scheduled_for || null,
        analysis_summary: formData.analysis_summary || null,
        market_outlook: formData.market_outlook || null,
        key_factors: formData.key_factors.length > 0 ? formData.key_factors : null,
      }

      await db.blogPosts.update(postId, updateData)
      alert('Post saved successfully!')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await db.blogPosts.publish(postId)
      router.push('/cms/dashboard/blog')
    } catch (error) {
      console.error('Error publishing post:', error)
      alert('Error publishing post. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }))
  }

  const addKeyFactor = () => {
    setFormData(prev => ({
      ...prev,
      key_factors: [...prev.key_factors, ''],
    }))
  }

  const updateKeyFactor = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      key_factors: prev.key_factors.map((f, i) => i === index ? value : f),
    }))
  }

  const removeKeyFactor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      key_factors: prev.key_factors.filter((_, i) => i !== index),
    }))
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    setFormData(prev => ({ ...prev, slug }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Post not found</h2>
        <Link href="/cms/dashboard/blog">
          <Button>
            <ArrowLeft size={16} />
            Back to Posts
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Edit Post"
        description={post.is_auto_generated ? 'Auto-generated post from market data' : 'Edit blog post content and settings'}
        actions={
          <>
            <Link href="/cms/dashboard/blog">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} />
                Back
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            {formData.status !== 'published' && (
              <Button 
                size="sm"
                onClick={handlePublish}
                disabled={publishing}
              >
                <Send size={16} />
                {publishing ? 'Publishing...' : 'Publish'}
              </Button>
            )}
          </>
        }
      />

      {post.is_auto_generated && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Sparkles size={20} className="text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">Auto-Generated Content</p>
            <p className="text-sm text-amber-700">
              This post was automatically generated from {post.auto_source || 'market data'}. 
              Review and edit before publishing.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <FileText size={18} />
              Post Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter post title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Slug *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="post-url-slug"
                  />
                  <Button variant="outline" size="sm" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief summary of the post..."
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Content *</h3>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={20}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              placeholder="Write your post content here... (Markdown supported)"
            />
          </div>

          {/* Market Analysis (for oil/gas posts) */}
          {(post.is_auto_generated || formData.category_id) && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Sparkles size={18} />
                Market Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Analysis Summary
                  </label>
                  <textarea
                    value={formData.analysis_summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, analysis_summary: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief market analysis summary..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Market Outlook
                  </label>
                  <select
                    value={formData.market_outlook}
                    onChange={(e) => setFormData(prev => ({ ...prev, market_outlook: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select outlook...</option>
                    <option value="bullish">Bullish</option>
                    <option value="bearish">Bearish</option>
                    <option value="neutral">Neutral</option>
                    <option value="volatile">Volatile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Key Factors
                  </label>
                  <div className="space-y-2">
                    {formData.key_factors.map((factor, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={factor}
                          onChange={(e) => updateKeyFactor(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          placeholder="Enter key factor..."
                        />
                        <button
                          onClick={() => removeKeyFactor(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addKeyFactor}>
                      <Plus size={14} />
                      Add Factor
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Globe size={18} />
              SEO Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="SEO title (defaults to post title)"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="SEO description (defaults to excerpt)"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Publish Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {formData.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Schedule For
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_for}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <FileText size={18} />
              Category
            </h3>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Tag size={18} />
              Tags
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Add tag..."
              />
              <Button variant="outline" size="sm" onClick={addTag}>
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                >
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)}
                    className="text-neutral-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <ImageIcon size={18} />
              Featured Image
            </h3>
            <div className="space-y-3">
              {formData.featured_image && (
                <img 
                  src={formData.featured_image} 
                  alt={formData.featured_image_alt || 'Featured image'}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Image URL..."
              />
              <input
                type="text"
                value={formData.featured_image_alt}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_alt: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Alt text..."
              />
            </div>
          </div>

          {/* Author */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Author</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Author name..."
              />
              <input
                type="text"
                value={formData.author_role}
                onChange={(e) => setFormData(prev => ({ ...prev, author_role: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Author role..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
