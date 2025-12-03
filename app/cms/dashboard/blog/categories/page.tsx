'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db, BlogCategory, BlogCategoryInsert, BlogCategoryUpdate } from '@/lib/supabase/client'
import { PageHeader } from '@/components/cms'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { 
  ArrowLeft,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Settings,
  Sparkles,
  GripVertical,
} from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#0066cc',
    icon: '',
    is_active: true,
    auto_post_enabled: false,
    auto_post_min_relevance: 0.70,
    auto_post_requires_review: true,
    sort_order: 0,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const data = await db.blogCategories.getAll(true)
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#0066cc',
      icon: '',
      is_active: true,
      auto_post_enabled: false,
      auto_post_min_relevance: 0.70,
      auto_post_requires_review: true,
      sort_order: categories.length,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (category: BlogCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#0066cc',
      icon: category.icon || '',
      is_active: category.is_active ?? true,
      auto_post_enabled: category.auto_post_enabled ?? false,
      auto_post_min_relevance: category.auto_post_min_relevance ?? 0.70,
      auto_post_requires_review: category.auto_post_requires_review ?? true,
      sort_order: category.sort_order ?? 0,
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert('Please fill in the name and slug.')
      return
    }

    setSaving(true)
    try {
      if (editingCategory) {
        const updateData: BlogCategoryUpdate = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          color: formData.color,
          icon: formData.icon || null,
          is_active: formData.is_active,
          auto_post_enabled: formData.auto_post_enabled,
          auto_post_min_relevance: formData.auto_post_min_relevance,
          auto_post_requires_review: formData.auto_post_requires_review,
          sort_order: formData.sort_order,
        }
        await db.blogCategories.update(editingCategory.id, updateData)
      } else {
        const createData: BlogCategoryInsert = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          color: formData.color,
          icon: formData.icon || null,
          is_active: formData.is_active,
          auto_post_enabled: formData.auto_post_enabled,
          auto_post_min_relevance: formData.auto_post_min_relevance,
          auto_post_requires_review: formData.auto_post_requires_review,
          sort_order: formData.sort_order,
        }
        await db.blogCategories.create(createData)
      }

      setIsModalOpen(false)
      fetchCategories(true)
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Posts in this category will become uncategorized.')) return

    try {
      await db.blogCategories.delete(id)
      fetchCategories(true)
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category. Please try again.')
    }
  }

  const generateSlug = () => {
    const slug = formData.name
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
          <p className="text-neutral-600 font-medium">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Blog Categories"
        description="Manage blog categories and auto-posting settings"
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
              onClick={() => fetchCategories(true)}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreateModal}>
              <Plus size={16} />
              New Category
            </Button>
          </>
        }
      />

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No categories yet</h3>
            <p className="text-neutral-500 max-w-sm mx-auto mb-4">
              Create categories to organize your blog posts.
            </p>
            <Button size="sm" onClick={openCreateModal}>
              <Plus size={16} />
              Create Category
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className="px-6 py-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="text-neutral-300 cursor-move">
                  <GripVertical size={20} />
                </div>
                <div 
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: category.color || '#0066cc' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-900">{category.name}</h3>
                    {!category.is_active && (
                      <Badge variant="warning">Inactive</Badge>
                    )}
                    {category.auto_post_enabled && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                        <Sparkles size={12} />
                        Auto-Post
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 truncate">
                    {category.description || 'No description'}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Slug: /{category.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEditModal(category)}
                    className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Category name..."
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
                placeholder="category-slug"
              />
              <Button variant="outline" size="sm" onClick={generateSlug}>
                Generate
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Category description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-10 border border-neutral-200 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="text-sm text-neutral-700">
              Active (visible on website)
            </label>
          </div>

          {/* Auto-Post Settings */}
          <div className="border-t border-neutral-200 pt-4 mt-4">
            <h4 className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
              <Sparkles size={16} />
              Auto-Post Settings
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_post_enabled"
                  checked={formData.auto_post_enabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, auto_post_enabled: e.target.checked }))}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="auto_post_enabled" className="text-sm text-neutral-700">
                  Enable auto-posting for this category
                </label>
              </div>

              {formData.auto_post_enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Minimum Relevance Score (0-1)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.05"
                      value={formData.auto_post_min_relevance}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        auto_post_min_relevance: parseFloat(e.target.value) || 0.70 
                      }))}
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      News articles with relevance score below this threshold won't be auto-posted
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto_post_requires_review"
                      checked={formData.auto_post_requires_review}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        auto_post_requires_review: e.target.checked 
                      }))}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="auto_post_requires_review" className="text-sm text-neutral-700">
                      Require manual review before publishing
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
