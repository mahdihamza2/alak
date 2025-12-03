import { createBrowserClient } from '@supabase/ssr';
import type { 
  Inquiry, 
  InquiryInsert, 
  InquiryUpdate,
  InquiryLog,
  AuditLog,
  SiteSetting,
  AdminProfile,
  AuditAction,
  Notification,
  NotificationType,
  NotificationCategory,
  Database,
  Json,
  // Blog & Pricing Types
  BlogPost,
  BlogPostInsert,
  BlogPostUpdate,
  BlogCategory,
  BlogCategoryInsert,
  BlogCategoryUpdate,
  BlogPostTemplate,
  OilPrice,
  OilPriceInsert,
  NewsArticle,
  NewsArticleInsert,
  NewsArticleUpdate,
  ApiConfig,
  ApiConfigUpdate,
  ScheduledJob,
  ScheduledJobUpdate,
  JobExecutionLog,
  JobStatusDashboard,
  PendingNewsForReview,
  BlogPostStatus,
  AutoPostStatus,
} from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create browser client that properly handles session cookies
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export types for convenience
export type { 
  Inquiry, InquiryInsert, InquiryUpdate, InquiryLog, AuditLog, SiteSetting, AdminProfile, 
  Notification, NotificationType, NotificationCategory,
  // Blog & Pricing Types
  BlogPost, BlogPostInsert, BlogPostUpdate,
  BlogCategory, BlogCategoryInsert, BlogCategoryUpdate,
  BlogPostTemplate,
  OilPrice, OilPriceInsert,
  NewsArticle, NewsArticleInsert, NewsArticleUpdate,
  ApiConfig, ApiConfigUpdate,
  ScheduledJob, ScheduledJobUpdate,
  JobExecutionLog,
  JobStatusDashboard,
  PendingNewsForReview,
  BlogPostStatus,
  AutoPostStatus,
};

// Database helpers
export const db = {
  inquiries: {
    async create(data: Omit<Inquiry, 'id' | 'created_at' | 'status' | 'source' | 'assigned_to' | 'ip_address' | 'user_agent' | 'notes'>) {
      const { data: inquiry, error } = await supabase
        .from('inquiries')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return inquiry;
    },

    async getAll() {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, data: InquiryUpdate) {
      const { data: inquiry, error } = await supabase
        .from('inquiries')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return inquiry;
    },

    async updateStatus(id: string, status: Inquiry['status'], notes?: string) {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ status, notes })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async getByStatus(status: Inquiry['status']) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getByCategory(category: Inquiry['category']) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getByDateRange(from?: Date, to?: Date) {
      let query = supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (from) {
        query = query.gte('created_at', from.toISOString());
      }
      if (to) {
        query = query.lte('created_at', to.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },

    async getStats() {
      const { data, error } = await supabase
        .from('inquiries')
        .select('status, product_type, category, created_at');

      if (error) throw error;
      return data;
    },

    async getAdjacentIds(currentId: string, createdAt: string) {
      // Get previous inquiry
      const { data: prevData } = await supabase
        .from('inquiries')
        .select('id')
        .gt('created_at', createdAt)
        .order('created_at', { ascending: true })
        .limit(1);

      // Get next inquiry
      const { data: nextData } = await supabase
        .from('inquiries')
        .select('id')
        .lt('created_at', createdAt)
        .order('created_at', { ascending: false })
        .limit(1);

      return {
        prevId: prevData?.[0]?.id || null,
        nextId: nextData?.[0]?.id || null
      };
    },
  },

  inquiryLogs: {
    async getByInquiryId(inquiryId: string) {
      const { data, error } = await supabase
        .from('inquiry_logs')
        .select('*')
        .eq('inquiry_id', inquiryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async create(log: { inquiry_id: string; action: string; old_status?: string; new_status?: string; notes?: string; performed_by?: string }) {
      const { data, error } = await supabase
        .from('inquiry_logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  auditLogs: {
    async getAll(filters?: { 
      action?: AuditAction; 
      resource_type?: string;
      user_id?: string;
      from?: Date;
      to?: Date;
      limit?: number;
      offset?: number;
    }) {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false });

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.resource_type) {
        query = query.eq('resource_type', filters.resource_type);
      }
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters?.from) {
        query = query.gte('timestamp', filters.from.toISOString());
      }
      if (filters?.to) {
        query = query.lte('timestamp', filters.to.toISOString());
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count };
    },

    async create(log: {
      action: AuditAction;
      resource_type: string;
      resource_id?: string;
      resource_name?: string;
      old_data?: Json;
      new_data?: Json;
      metadata?: Json;
    }) {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  settings: {
    async getAll() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category');

      if (error) throw error;
      return data;
    },

    async getByCategory(category: 'general' | 'seo' | 'contact' | 'social' | 'branding' | 'compliance' | 'analytics' | 'features') {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', category);

      if (error) throw error;
      return data;
    },

    async getByKey(key: string) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .single();

      if (error) throw error;
      return data;
    },

    async update(key: string, value: Json) {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async upsert(setting: { key: string; value: Json; label: string; category: 'general' | 'seo' | 'contact' | 'social' | 'branding' | 'compliance' | 'analytics' | 'features'; description?: string; is_public?: boolean }) {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert([{
          ...setting,
          updated_at: new Date().toISOString()
        }], { 
          onConflict: 'key' 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Get only public settings (for frontend display)
    async getPublicSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value, category')
        .eq('is_public', true);

      if (error) throw error;
      return data;
    },
  },

  adminProfiles: {
    async getAll() {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  },

  notifications: {
    async getAll(filters?: {
      category?: 'inquiry' | 'security' | 'system' | 'update';
      read?: boolean;
      limit?: number;
      offset?: number;
    }) {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (typeof filters?.read === 'boolean') {
        query = query.eq('read', filters.read);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count };
    },

    async getUnreadCount() {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },

    async markAsRead(id: string) {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async markAllAsRead() {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async deleteAll() {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all by matching non-null id

      if (error) throw error;
    },

    async create(notification: {
      title: string;
      message: string;
      type?: 'info' | 'success' | 'warning' | 'error';
      category?: 'inquiry' | 'security' | 'system' | 'update';
      user_id?: string;
      action_url?: string;
      metadata?: Json;
    }) {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // ============================================================================
  // Blog Posts
  // ============================================================================
  blogPosts: {
    async getAll(filters?: {
      status?: string;
      category_id?: string;
      is_auto_generated?: boolean;
      limit?: number;
      offset?: number;
    }) {
      let query = supabase
        .from('blog_posts')
        .select('*, blog_categories!blog_posts_category_id_fkey(id, name, slug, color)', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (typeof filters?.is_auto_generated === 'boolean') {
        query = query.eq('is_auto_generated', filters.is_auto_generated);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count };
    },

    async getPublished(limit?: number) {
      let query = supabase
        .from('blog_posts')
        .select('*, blog_categories!blog_posts_category_id_fkey(id, name, slug, color)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories!blog_posts_category_id_fkey(id, name, slug, color)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async getBySlug(slug: string) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories!blog_posts_category_id_fkey(id, name, slug, color)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    },

    async create(post: BlogPostInsert) {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, post: BlogPostUpdate) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...post, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async publish(id: string) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'published', 
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async archive(id: string) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async incrementViewCount(id: string) {
      const { error } = await supabase.rpc('increment_blog_view_count' as never, { post_id: id } as never);
      // Fallback if RPC doesn't exist
      if (error) {
        const { data: post } = await supabase
          .from('blog_posts')
          .select('view_count')
          .eq('id', id)
          .single();
        
        await supabase
          .from('blog_posts')
          .update({ view_count: (post?.view_count || 0) + 1 })
          .eq('id', id);
      }
    },

    async getByCategory(categorySlug: string, limit?: number) {
      let query = supabase
        .from('blog_posts')
        .select('*, blog_categories!blog_posts_category_id_fkey!inner(id, name, slug, color)')
        .eq('blog_categories.slug', categorySlug)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },

    async search(searchTerm: string) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories!blog_posts_category_id_fkey(id, name, slug, color)')
        .eq('status', 'published')
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  },

  // ============================================================================
  // Blog Categories
  // ============================================================================
  blogCategories: {
    async getAll(includeInactive = false) {
      let query = supabase
        .from('blog_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async getBySlug(slug: string) {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },

    async create(category: BlogCategoryInsert) {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, category: BlogCategoryUpdate) {
      const { data, error } = await supabase
        .from('blog_categories')
        .update({ ...category, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async getWithPostCount() {
      const { data, error } = await supabase
        .from('blog_categories')
        .select(`
          *,
          blog_posts(count)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  },

  // ============================================================================
  // Oil Prices
  // ============================================================================
  oilPrices: {
    async getLatest() {
      const { data, error } = await supabase
        .from('oil_prices')
        .select('*')
        .order('price_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async getHistory(days = 30) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('oil_prices')
        .select('*')
        .gte('price_date', startDate.toISOString().split('T')[0])
        .order('price_date', { ascending: true });

      if (error) throw error;
      return data;
    },

    async getAll(filters?: {
      from?: Date;
      to?: Date;
      limit?: number;
      offset?: number;
    }) {
      let query = supabase
        .from('oil_prices')
        .select('*', { count: 'exact' })
        .order('price_date', { ascending: false });

      if (filters?.from) {
        query = query.gte('price_date', filters.from.toISOString().split('T')[0]);
      }
      if (filters?.to) {
        query = query.lte('price_date', filters.to.toISOString().split('T')[0]);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count };
    },

    async create(price: OilPriceInsert) {
      const { data, error } = await supabase
        .from('oil_prices')
        .insert([price])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getByDate(date: string) {
      const { data, error } = await supabase
        .from('oil_prices')
        .select('*')
        .eq('price_date', date)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async upsertByDate(price: OilPriceInsert) {
      const { data, error } = await supabase
        .from('oil_prices')
        .upsert([price], { onConflict: 'price_date' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // ============================================================================
  // News Articles
  // ============================================================================
  newsArticles: {
    async getAll(filters?: {
      auto_post_status?: string;
      category?: string;
      sentiment?: string;
      limit?: number;
      offset?: number;
    }) {
      let query = supabase
        .from('news_articles')
        .select('*, blog_categories!news_articles_target_category_id_fkey(id, name, slug, color)', { count: 'exact' })
        .order('fetched_at', { ascending: false });

      if (filters?.auto_post_status) {
        query = query.eq('auto_post_status', filters.auto_post_status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.sentiment) {
        query = query.eq('sentiment', filters.sentiment);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count };
    },

    async getPendingForReview() {
      const { data, error } = await supabase
        .from('pending_news_for_review')
        .select('*')
        .order('relevance_score', { ascending: false });

      if (error) throw error;
      return data as PendingNewsForReview[];
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*, blog_categories!news_articles_target_category_id_fkey(id, name, slug, color)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async create(article: NewsArticleInsert) {
      const { data, error } = await supabase
        .from('news_articles')
        .insert([article])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, article: NewsArticleUpdate) {
      const { data, error } = await supabase
        .from('news_articles')
        .update(article)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async approve(id: string, reviewNotes?: string) {
      const { data, error } = await supabase
        .from('news_articles')
        .update({ 
          auto_post_status: 'approved',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async reject(id: string, reviewNotes?: string) {
      const { data, error } = await supabase
        .from('news_articles')
        .update({ 
          auto_post_status: 'rejected',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async markAsPosted(id: string, blogPostId: string) {
      const { data, error } = await supabase
        .from('news_articles')
        .update({ 
          auto_post_status: 'posted',
          auto_posted_at: new Date().toISOString(),
          blog_post_id: blogPostId
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getByExternalId(externalId: string) {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('external_id', externalId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  },

  // ============================================================================
  // API Configs
  // ============================================================================
  apiConfigs: {
    async getAll() {
      const { data, error } = await supabase
        .from('api_configs')
        .select('*')
        .order('api_name');

      if (error) throw error;
      return data;
    },

    async getByName(apiName: string) {
      const { data, error } = await supabase
        .from('api_configs')
        .select('*')
        .eq('api_name', apiName)
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, config: ApiConfigUpdate) {
      const { data, error } = await supabase
        .from('api_configs')
        .update({ ...config, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async updateLastFetch(id: string, success: boolean, errorMessage?: string) {
      const now = new Date();
      const { data: config } = await supabase
        .from('api_configs')
        .select('fetch_interval_hours')
        .eq('id', id)
        .single();

      const nextFetch = new Date(now.getTime() + (config?.fetch_interval_hours || 13) * 60 * 60 * 1000);

      const updateData: ApiConfigUpdate = {
        last_fetch_at: now.toISOString(),
        next_fetch_at: nextFetch.toISOString(),
        updated_at: now.toISOString(),
      };

      if (!success) {
        updateData.last_error = errorMessage;
        updateData.last_error_at = now.toISOString();
        updateData.consecutive_failures = (await supabase
          .from('api_configs')
          .select('consecutive_failures')
          .eq('id', id)
          .single()).data?.consecutive_failures || 0 + 1;
      } else {
        updateData.consecutive_failures = 0;
        updateData.last_error = null;
      }

      const { data, error } = await supabase
        .from('api_configs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async toggleActive(id: string, isActive: boolean) {
      const { data, error } = await supabase
        .from('api_configs')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // ============================================================================
  // Scheduled Jobs
  // ============================================================================
  scheduledJobs: {
    async getAll() {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .order('job_name');

      if (error) throw error;
      return data;
    },

    async getDashboard() {
      const { data, error } = await supabase
        .from('job_status_dashboard')
        .select('*')
        .order('job_name');

      if (error) throw error;
      return data as JobStatusDashboard[];
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, job: ScheduledJobUpdate) {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .update({ ...job, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async toggleActive(id: string, isActive: boolean) {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async updateLastRun(id: string, status: string, message?: string, durationMs?: number) {
      const now = new Date();
      const { data: job } = await supabase
        .from('scheduled_jobs')
        .select('interval_hours, successful_runs, failed_runs, total_runs')
        .eq('id', id)
        .single();

      const nextRun = new Date(now.getTime() + (job?.interval_hours || 13) * 60 * 60 * 1000);

      const updateData: ScheduledJobUpdate = {
        last_run_at: now.toISOString(),
        last_run_status: status,
        last_run_message: message,
        last_run_duration_ms: durationMs,
        next_run_at: nextRun.toISOString(),
        total_runs: (job?.total_runs || 0) + 1,
        updated_at: now.toISOString(),
      };

      if (status === 'success') {
        updateData.successful_runs = (job?.successful_runs || 0) + 1;
      } else {
        updateData.failed_runs = (job?.failed_runs || 0) + 1;
      }

      const { data, error } = await supabase
        .from('scheduled_jobs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // ============================================================================
  // Job Execution Logs
  // ============================================================================
  jobExecutionLogs: {
    async getAll(filters?: {
      job_id?: string;
      job_name?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }) {
      let query = supabase
        .from('job_execution_logs')
        .select('*', { count: 'exact' })
        .order('started_at', { ascending: false });

      if (filters?.job_id) {
        query = query.eq('job_id', filters.job_id);
      }
      if (filters?.job_name) {
        query = query.eq('job_name', filters.job_name);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count };
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('job_execution_logs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async getRecentByJob(jobId: string, limit = 10) {
      const { data, error } = await supabase
        .from('job_execution_logs')
        .select('*')
        .eq('job_id', jobId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },

    async startExecution(jobName: string, triggeredBy = 'scheduled') {
      const { data, error } = await supabase
        .from('job_execution_logs')
        .insert([{
          job_name: jobName,
          status: 'running',
          triggered_by: triggeredBy,
          started_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async completeExecution(id: string, status: string, result?: {
      records_processed?: number;
      records_created?: number;
      records_updated?: number;
      records_failed?: number;
      articles_fetched?: number;
      articles_relevant?: number;
      posts_created?: number;
      posts_published?: number;
      prices_fetched?: Json;
      error_message?: string;
      error_stack?: string;
      response_summary?: Json;
    }) {
      const log = await this.getById(id);
      const startTime = new Date(log.started_at).getTime();
      const durationMs = Date.now() - startTime;

      const { data, error } = await supabase
        .from('job_execution_logs')
        .update({
          status,
          completed_at: new Date().toISOString(),
          duration_ms: durationMs,
          ...result,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // ============================================================================
  // Blog Post Templates
  // ============================================================================
  blogPostTemplates: {
    async getAll() {
      const { data, error } = await supabase
        .from('blog_post_templates')
        .select('*')
        .eq('is_active', true)
        .order('template_name');

      if (error) throw error;
      return data;
    },

    async getByType(templateType: string) {
      const { data, error } = await supabase
        .from('blog_post_templates')
        .select('*')
        .eq('template_type', templateType)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('blog_post_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  },
};
