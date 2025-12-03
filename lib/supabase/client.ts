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
  Json
} from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create browser client that properly handles session cookies
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export types for convenience
export type { Inquiry, InquiryInsert, InquiryUpdate, InquiryLog, AuditLog, SiteSetting, AdminProfile, Notification, NotificationType, NotificationCategory };

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
};
