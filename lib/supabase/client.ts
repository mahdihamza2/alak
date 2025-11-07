import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface Inquiry {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  category: 'verified-buyer' | 'verified-seller' | 'strategic-partner';
  product_type: 'crude-oil' | 'pms' | 'ago' | 'jet-fuel' | 'multiple';
  estimated_volume: string;
  volume_unit: 'BBLs' | 'MT' | 'Liters';
  message: string;
  status: 'pending' | 'reviewing' | 'contacted' | 'qualified' | 'rejected' | 'closed';
  assigned_to: string | null;
  source: string;
  ip_address: string | null;
  user_agent: string | null;
  notes: string | null;
}

export interface InquiryLog {
  id: string;
  inquiry_id: string;
  created_at: string;
  action: string;
  old_status: string | null;
  new_status: string | null;
  performed_by: string | null;
  notes: string | null;
}

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
  },
};
