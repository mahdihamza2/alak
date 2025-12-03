export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          job_title: string | null
          last_login_at: string | null
          phone: string | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          last_login_at?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          last_login_at?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_configs: {
        Row: {
          additional_config: Json | null
          api_endpoint: string | null
          api_key_encrypted: string | null
          api_name: string
          api_provider: string
          api_secret_encrypted: string | null
          consecutive_failures: number | null
          created_at: string
          current_day_calls: number | null
          current_hour_calls: number | null
          current_minute_calls: number | null
          description: string | null
          fetch_interval_hours: number | null
          id: string
          is_active: boolean | null
          last_error: string | null
          last_error_at: string | null
          last_fetch_at: string | null
          next_fetch_at: string | null
          preferred_fetch_time: string | null
          rate_limit_per_day: number | null
          rate_limit_per_hour: number | null
          rate_limit_per_minute: number | null
          rate_limit_reset_at: string | null
          request_headers: Json | null
          request_params: Json | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          additional_config?: Json | null
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          api_name: string
          api_provider: string
          api_secret_encrypted?: string | null
          consecutive_failures?: number | null
          created_at?: string
          current_day_calls?: number | null
          current_hour_calls?: number | null
          current_minute_calls?: number | null
          description?: string | null
          fetch_interval_hours?: number | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_error_at?: string | null
          last_fetch_at?: string | null
          next_fetch_at?: string | null
          preferred_fetch_time?: string | null
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          rate_limit_per_minute?: number | null
          rate_limit_reset_at?: string | null
          request_headers?: Json | null
          request_params?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          additional_config?: Json | null
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          api_name?: string
          api_provider?: string
          api_secret_encrypted?: string | null
          consecutive_failures?: number | null
          created_at?: string
          current_day_calls?: number | null
          current_hour_calls?: number | null
          current_minute_calls?: number | null
          description?: string | null
          fetch_interval_hours?: number | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_error_at?: string | null
          last_fetch_at?: string | null
          next_fetch_at?: string | null
          preferred_fetch_time?: string | null
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          rate_limit_per_minute?: number | null
          rate_limit_reset_at?: string | null
          request_headers?: Json | null
          request_params?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          compliance_flag: string | null
          id: string
          ip_address: unknown
          is_sensitive: boolean | null
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          resource_id: string | null
          resource_name: string | null
          resource_type: string
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          compliance_flag?: string | null
          id?: string
          ip_address?: unknown
          is_sensitive?: boolean | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_name?: string | null
          resource_type: string
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          compliance_flag?: string | null
          id?: string
          ip_address?: unknown
          is_sensitive?: boolean | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_name?: string | null
          resource_type?: string
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          auto_post_enabled: boolean | null
          auto_post_min_relevance: number | null
          auto_post_requires_review: boolean | null
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          auto_post_enabled?: boolean | null
          auto_post_min_relevance?: number | null
          auto_post_requires_review?: boolean | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          auto_post_enabled?: boolean | null
          auto_post_min_relevance?: number | null
          auto_post_requires_review?: boolean | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_templates: {
        Row: {
          analysis_template: string | null
          bearish_intro: string | null
          bullish_intro: string | null
          content_template: string
          created_at: string
          default_author_name: string | null
          default_category_id: string | null
          default_tags: string[] | null
          description: string | null
          excerpt_template: string | null
          factors_template: string | null
          id: string
          is_active: boolean | null
          meta_description_template: string | null
          meta_title_template: string | null
          neutral_intro: string | null
          outlook_template: string | null
          template_name: string
          template_type: string
          title_template: string
          updated_at: string
          volatile_intro: string | null
        }
        Insert: {
          analysis_template?: string | null
          bearish_intro?: string | null
          bullish_intro?: string | null
          content_template: string
          created_at?: string
          default_author_name?: string | null
          default_category_id?: string | null
          default_tags?: string[] | null
          description?: string | null
          excerpt_template?: string | null
          factors_template?: string | null
          id?: string
          is_active?: boolean | null
          meta_description_template?: string | null
          meta_title_template?: string | null
          neutral_intro?: string | null
          outlook_template?: string | null
          template_name: string
          template_type: string
          title_template: string
          updated_at?: string
          volatile_intro?: string | null
        }
        Update: {
          analysis_template?: string | null
          bearish_intro?: string | null
          bullish_intro?: string | null
          content_template?: string
          created_at?: string
          default_author_name?: string | null
          default_category_id?: string | null
          default_tags?: string[] | null
          description?: string | null
          excerpt_template?: string | null
          factors_template?: string | null
          id?: string
          is_active?: boolean | null
          meta_description_template?: string | null
          meta_title_template?: string | null
          neutral_intro?: string | null
          outlook_template?: string | null
          template_name?: string
          template_type?: string
          title_template?: string
          updated_at?: string
          volatile_intro?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_templates_default_category_id_fkey"
            columns: ["default_category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          analysis_summary: string | null
          author_id: string | null
          author_name: string | null
          author_role: string | null
          auto_source: string | null
          canonical_url: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          featured_image_alt: string | null
          id: string
          is_auto_generated: boolean | null
          key_factors: string[] | null
          market_outlook: string | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          scheduled_for: string | null
          slug: string
          source_reference_id: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          analysis_summary?: string | null
          author_id?: string | null
          author_name?: string | null
          author_role?: string | null
          auto_source?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          is_auto_generated?: boolean | null
          key_factors?: string[] | null
          market_outlook?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          slug: string
          source_reference_id?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          analysis_summary?: string | null
          author_id?: string | null
          author_name?: string | null
          author_role?: string | null
          auto_source?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          is_auto_generated?: boolean | null
          key_factors?: string[] | null
          market_outlook?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          slug?: string
          source_reference_id?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          assigned_to: string | null
          category: string
          company_name: string
          created_at: string
          email: string
          estimated_volume: string
          full_name: string
          id: string
          ip_address: unknown
          message: string
          notes: string | null
          phone: string
          product_type: string
          source: string | null
          status: string
          user_agent: string | null
          volume_unit: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          company_name: string
          created_at?: string
          email: string
          estimated_volume: string
          full_name: string
          id?: string
          ip_address?: unknown
          message: string
          notes?: string | null
          phone: string
          product_type: string
          source?: string | null
          status?: string
          user_agent?: string | null
          volume_unit?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          company_name?: string
          created_at?: string
          email?: string
          estimated_volume?: string
          full_name?: string
          id?: string
          ip_address?: unknown
          message?: string
          notes?: string | null
          phone?: string
          product_type?: string
          source?: string | null
          status?: string
          user_agent?: string | null
          volume_unit?: string
        }
        Relationships: []
      }
      inquiry_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          inquiry_id: string
          new_status: string | null
          notes: string | null
          old_status: string | null
          performed_by: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          inquiry_id: string
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          performed_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          inquiry_id?: string
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_logs_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      job_execution_logs: {
        Row: {
          articles_fetched: number | null
          articles_relevant: number | null
          completed_at: string | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          error_stack: string | null
          execution_context: Json | null
          id: string
          job_id: string | null
          job_name: string
          posts_created: number | null
          posts_published: number | null
          prices_fetched: Json | null
          records_created: number | null
          records_failed: number | null
          records_processed: number | null
          records_updated: number | null
          request_payload: Json | null
          response_summary: Json | null
          started_at: string
          status: string
          triggered_by: string | null
        }
        Insert: {
          articles_fetched?: number | null
          articles_relevant?: number | null
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          error_stack?: string | null
          execution_context?: Json | null
          id?: string
          job_id?: string | null
          job_name: string
          posts_created?: number | null
          posts_published?: number | null
          prices_fetched?: Json | null
          records_created?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          request_payload?: Json | null
          response_summary?: Json | null
          started_at?: string
          status?: string
          triggered_by?: string | null
        }
        Update: {
          articles_fetched?: number | null
          articles_relevant?: number | null
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          error_stack?: string | null
          execution_context?: Json | null
          id?: string
          job_id?: string | null
          job_name?: string
          posts_created?: number | null
          posts_published?: number | null
          prices_fetched?: Json | null
          records_created?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          request_payload?: Json | null
          response_summary?: Json | null
          started_at?: string
          status?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_execution_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_status_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_execution_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scheduled_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          auto_post_status: string | null
          auto_posted_at: string | null
          blog_post_id: string | null
          category: string | null
          content: string | null
          country: string | null
          created_at: string
          description: string | null
          external_id: string | null
          fetched_at: string
          generated_analysis: string | null
          generated_narrative: string | null
          id: string
          image_url: string | null
          keywords: string[] | null
          language: string | null
          published_at: string | null
          relevance_keywords: string[] | null
          relevance_score: number | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sentiment: string | null
          source_icon: string | null
          source_name: string | null
          source_url: string | null
          target_category_id: string | null
          title: string
        }
        Insert: {
          auto_post_status?: string | null
          auto_posted_at?: string | null
          blog_post_id?: string | null
          category?: string | null
          content?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          fetched_at?: string
          generated_analysis?: string | null
          generated_narrative?: string | null
          id?: string
          image_url?: string | null
          keywords?: string[] | null
          language?: string | null
          published_at?: string | null
          relevance_keywords?: string[] | null
          relevance_score?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sentiment?: string | null
          source_icon?: string | null
          source_name?: string | null
          source_url?: string | null
          target_category_id?: string | null
          title: string
        }
        Update: {
          auto_post_status?: string | null
          auto_posted_at?: string | null
          blog_post_id?: string | null
          category?: string | null
          content?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          fetched_at?: string
          generated_analysis?: string | null
          generated_narrative?: string | null
          id?: string
          image_url?: string | null
          keywords?: string[] | null
          language?: string | null
          published_at?: string | null
          relevance_keywords?: string[] | null
          relevance_score?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sentiment?: string | null
          source_icon?: string | null
          source_name?: string | null
          source_url?: string | null
          target_category_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_target_category_id_fkey"
            columns: ["target_category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          category: Database["public"]["Enums"]["notification_category"]
          created_at: string | null
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      oil_prices: {
        Row: {
          analyst_notes: string | null
          auto_post_id: string | null
          auto_posted: boolean | null
          auto_posted_at: string | null
          bonny_light_change: number | null
          bonny_light_change_percent: number | null
          bonny_light_premium: number | null
          bonny_light_price: number | null
          brent_change: number | null
          brent_change_percent: number | null
          brent_price: number | null
          created_at: string
          currency: string | null
          diesel_price: number | null
          dubai_crude_change: number | null
          dubai_crude_change_percent: number | null
          dubai_crude_price: number | null
          dubai_date: string | null
          dubai_time: string | null
          fetched_at: string
          gasoline_price: number | null
          id: string
          jet_fuel_price: number | null
          lpg_change: number | null
          lpg_change_percent: number | null
          lpg_price: number | null
          market_trend: string | null
          murban_change: number | null
          murban_change_percent: number | null
          murban_price: number | null
          natural_gas_change: number | null
          natural_gas_change_percent: number | null
          natural_gas_price: number | null
          price_date: string
          secondary_source: string | null
          source: string | null
          trend_factors: string[] | null
          wti_change: number | null
          wti_change_percent: number | null
          wti_price: number | null
        }
        Insert: {
          analyst_notes?: string | null
          auto_post_id?: string | null
          auto_posted?: boolean | null
          auto_posted_at?: string | null
          bonny_light_change?: number | null
          bonny_light_change_percent?: number | null
          bonny_light_premium?: number | null
          bonny_light_price?: number | null
          brent_change?: number | null
          brent_change_percent?: number | null
          brent_price?: number | null
          created_at?: string
          currency?: string | null
          diesel_price?: number | null
          dubai_crude_change?: number | null
          dubai_crude_change_percent?: number | null
          dubai_crude_price?: number | null
          dubai_date?: string | null
          dubai_time?: string | null
          fetched_at?: string
          gasoline_price?: number | null
          id?: string
          jet_fuel_price?: number | null
          lpg_change?: number | null
          lpg_change_percent?: number | null
          lpg_price?: number | null
          market_trend?: string | null
          murban_change?: number | null
          murban_change_percent?: number | null
          murban_price?: number | null
          natural_gas_change?: number | null
          natural_gas_change_percent?: number | null
          natural_gas_price?: number | null
          price_date?: string
          secondary_source?: string | null
          source?: string | null
          trend_factors?: string[] | null
          wti_change?: number | null
          wti_change_percent?: number | null
          wti_price?: number | null
        }
        Update: {
          analyst_notes?: string | null
          auto_post_id?: string | null
          auto_posted?: boolean | null
          auto_posted_at?: string | null
          bonny_light_change?: number | null
          bonny_light_change_percent?: number | null
          bonny_light_premium?: number | null
          bonny_light_price?: number | null
          brent_change?: number | null
          brent_change_percent?: number | null
          brent_price?: number | null
          created_at?: string
          currency?: string | null
          diesel_price?: number | null
          dubai_crude_change?: number | null
          dubai_crude_change_percent?: number | null
          dubai_crude_price?: number | null
          dubai_date?: string | null
          dubai_time?: string | null
          fetched_at?: string
          gasoline_price?: number | null
          id?: string
          jet_fuel_price?: number | null
          lpg_change?: number | null
          lpg_change_percent?: number | null
          lpg_price?: number | null
          market_trend?: string | null
          murban_change?: number | null
          murban_change_percent?: number | null
          murban_price?: number | null
          natural_gas_change?: number | null
          natural_gas_change_percent?: number | null
          natural_gas_price?: number | null
          price_date?: string
          secondary_source?: string | null
          source?: string | null
          trend_factors?: string[] | null
          wti_change?: number | null
          wti_change_percent?: number | null
          wti_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "oil_prices_auto_post_fkey"
            columns: ["auto_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_jobs: {
        Row: {
          config: Json | null
          created_at: string
          cron_expression: string | null
          description: string | null
          failed_runs: number | null
          id: string
          interval_hours: number
          is_active: boolean | null
          job_name: string
          job_type: string
          last_run_at: string | null
          last_run_duration_ms: number | null
          last_run_message: string | null
          last_run_status: string | null
          next_run_at: string | null
          successful_runs: number | null
          timezone: string | null
          total_runs: number | null
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          cron_expression?: string | null
          description?: string | null
          failed_runs?: number | null
          id?: string
          interval_hours?: number
          is_active?: boolean | null
          job_name: string
          job_type: string
          last_run_at?: string | null
          last_run_duration_ms?: number | null
          last_run_message?: string | null
          last_run_status?: string | null
          next_run_at?: string | null
          successful_runs?: number | null
          timezone?: string | null
          total_runs?: number | null
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          cron_expression?: string | null
          description?: string | null
          failed_runs?: number | null
          id?: string
          interval_hours?: number
          is_active?: boolean | null
          job_name?: string
          job_type?: string
          last_run_at?: string | null
          last_run_duration_ms?: number | null
          last_run_message?: string | null
          last_run_status?: string | null
          next_run_at?: string | null
          successful_runs?: number | null
          timezone?: string | null
          total_runs?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: Database["public"]["Enums"]["setting_category"]
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          is_sensitive: boolean | null
          key: string
          label: string
          updated_at: string | null
          updated_by: string | null
          validation_schema: Json | null
          value: Json
        }
        Insert: {
          category: Database["public"]["Enums"]["setting_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_sensitive?: boolean | null
          key: string
          label: string
          updated_at?: string | null
          updated_by?: string | null
          validation_schema?: Json | null
          value: Json
        }
        Update: {
          category?: Database["public"]["Enums"]["setting_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_sensitive?: boolean | null
          key?: string
          label?: string
          updated_at?: string | null
          updated_by?: string | null
          validation_schema?: Json | null
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      audit_summary: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"] | null
          count: number | null
          date: string | null
          resource_type: string | null
          unique_users: number | null
        }
        Relationships: []
      }
      job_status_dashboard: {
        Row: {
          current_status: string | null
          description: string | null
          failed_runs: number | null
          id: string | null
          interval_hours: number | null
          is_active: boolean | null
          job_name: string | null
          job_type: string | null
          last_error: string | null
          last_run_at: string | null
          last_run_status: string | null
          next_run_at: string | null
          success_rate: number | null
          successful_runs: number | null
          total_runs: number | null
        }
        Insert: {
          current_status?: never
          description?: string | null
          failed_runs?: number | null
          id?: string | null
          interval_hours?: number | null
          is_active?: boolean | null
          job_name?: string | null
          job_type?: string | null
          last_error?: never
          last_run_at?: string | null
          last_run_status?: string | null
          next_run_at?: string | null
          success_rate?: never
          successful_runs?: number | null
          total_runs?: number | null
        }
        Update: {
          current_status?: never
          description?: string | null
          failed_runs?: number | null
          id?: string | null
          interval_hours?: number | null
          is_active?: boolean | null
          job_name?: string | null
          job_type?: string | null
          last_error?: never
          last_run_at?: string | null
          last_run_status?: string | null
          next_run_at?: string | null
          success_rate?: never
          successful_runs?: number | null
          total_runs?: number | null
        }
        Relationships: []
      }
      pending_news_for_review: {
        Row: {
          auto_post_enabled: boolean | null
          auto_post_min_relevance: number | null
          auto_post_requires_review: boolean | null
          auto_post_status: string | null
          auto_posted_at: string | null
          blog_post_id: string | null
          can_auto_post: boolean | null
          category: string | null
          content: string | null
          country: string | null
          created_at: string | null
          description: string | null
          external_id: string | null
          fetched_at: string | null
          generated_analysis: string | null
          generated_narrative: string | null
          id: string | null
          image_url: string | null
          keywords: string[] | null
          language: string | null
          published_at: string | null
          relevance_keywords: string[] | null
          relevance_level: string | null
          relevance_score: number | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sentiment: string | null
          source_icon: string | null
          source_name: string | null
          source_url: string | null
          target_category_id: string | null
          target_category_name: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_target_category_id_fkey"
            columns: ["target_category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      complete_job_execution: {
        Args: {
          p_duration_ms?: number
          p_job_id: string
          p_log_id: string
          p_message?: string
          p_status: string
        }
        Returns: undefined
      }
      create_audit_log: {
        Args: {
          p_action: Database["public"]["Enums"]["audit_action"]
          p_compliance_flag?: string
          p_is_sensitive?: boolean
          p_metadata?: Json
          p_new_data?: Json
          p_old_data?: Json
          p_resource_id?: string
          p_resource_name?: string
          p_resource_type: string
        }
        Returns: string
      }
      create_notification: {
        Args: {
          p_action_url?: string
          p_category?: Database["public"]["Enums"]["notification_category"]
          p_expires_at?: string
          p_message: string
          p_metadata?: Json
          p_title: string
          p_type?: Database["public"]["Enums"]["notification_type"]
          p_user_id?: string
        }
        Returns: string
      }
      generate_blog_slug: { Args: { p_title: string }; Returns: string }
      get_latest_oil_prices: {
        Args: Record<PropertyKey, never>
        Returns: {
          bonny_light_change_percent: number
          bonny_light_price: number
          brent_change_percent: number
          brent_price: number
          dubai_crude_change_percent: number
          dubai_crude_price: number
          fetched_at: string
          market_trend: string
          natural_gas_change_percent: number
          natural_gas_price: number
          price_date: string
          wti_change_percent: number
          wti_price: number
        }[]
      }
      get_oil_price_history: {
        Args: { p_days?: number }
        Returns: {
          bonny_light_price: number
          brent_price: number
          dubai_crude_price: number
          natural_gas_price: number
          price_date: string
          wti_price: number
        }[]
      }
      get_setting: { Args: { setting_key: string }; Returns: Json }
      is_admin: {
        Args: { min_role?: Database["public"]["Enums"]["admin_role"] }
        Returns: boolean
      }
      is_admin_bypass_rls: { Args: Record<PropertyKey, never>; Returns: boolean }
      is_super_admin_bypass_rls: { Args: Record<PropertyKey, never>; Returns: boolean }
      start_job_execution: {
        Args: { p_job_name: string; p_triggered_by?: string }
        Returns: string
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "editor" | "viewer"
      audit_action:
        | "login"
        | "logout"
        | "create"
        | "read"
        | "update"
        | "delete"
        | "export"
        | "import"
        | "approve"
        | "reject"
        | "archive"
        | "restore"
      notification_category: "inquiry" | "security" | "system" | "update"
      notification_type: "info" | "success" | "warning" | "error"
      setting_category:
        | "general"
        | "seo"
        | "contact"
        | "social"
        | "branding"
        | "compliance"
        | "analytics"
        | "features"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "editor", "viewer"],
      audit_action: [
        "login",
        "logout",
        "create",
        "read",
        "update",
        "delete",
        "export",
        "import",
        "approve",
        "reject",
        "archive",
        "restore",
      ],
      notification_category: ["inquiry", "security", "system", "update"],
      notification_type: ["info", "success", "warning", "error"],
      setting_category: [
        "general",
        "seo",
        "contact",
        "social",
        "branding",
        "compliance",
        "analytics",
        "features",
      ],
    },
  },
} as const

// ============================================================================
// Convenience Type Aliases for Blog & Pricing System
// ============================================================================

export type OilPrice = Tables<"oil_prices">
export type OilPriceInsert = TablesInsert<"oil_prices">
export type OilPriceUpdate = TablesUpdate<"oil_prices">

export type BlogPost = Tables<"blog_posts">
export type BlogPostInsert = TablesInsert<"blog_posts">
export type BlogPostUpdate = TablesUpdate<"blog_posts">

export type BlogCategory = Tables<"blog_categories">
export type BlogCategoryInsert = TablesInsert<"blog_categories">
export type BlogCategoryUpdate = TablesUpdate<"blog_categories">

export type BlogPostTemplate = Tables<"blog_post_templates">
export type BlogPostTemplateInsert = TablesInsert<"blog_post_templates">
export type BlogPostTemplateUpdate = TablesUpdate<"blog_post_templates">

export type NewsArticle = Tables<"news_articles">
export type NewsArticleInsert = TablesInsert<"news_articles">
export type NewsArticleUpdate = TablesUpdate<"news_articles">

export type ApiConfig = Tables<"api_configs">
export type ApiConfigInsert = TablesInsert<"api_configs">
export type ApiConfigUpdate = TablesUpdate<"api_configs">

export type ScheduledJob = Tables<"scheduled_jobs">
export type ScheduledJobInsert = TablesInsert<"scheduled_jobs">
export type ScheduledJobUpdate = TablesUpdate<"scheduled_jobs">

export type JobExecutionLog = Tables<"job_execution_logs">
export type JobExecutionLogInsert = TablesInsert<"job_execution_logs">
export type JobExecutionLogUpdate = TablesUpdate<"job_execution_logs">

export type JobStatusDashboard = Tables<"job_status_dashboard">
export type PendingNewsForReview = Tables<"pending_news_for_review">

// ============================================================================
// Admin Profile Types
// ============================================================================

export type AdminProfile = Tables<"admin_profiles">
export type AdminProfileInsert = TablesInsert<"admin_profiles">
export type AdminProfileUpdate = TablesUpdate<"admin_profiles">

export type AdminRole = "super_admin" | "admin" | "editor" | "viewer"

// ============================================================================
// Inquiry Types
// ============================================================================

export type Inquiry = Tables<"inquiries">
export type InquiryInsert = TablesInsert<"inquiries">
export type InquiryUpdate = TablesUpdate<"inquiries">

export type InquiryLog = Tables<"inquiry_logs">
export type InquiryLogInsert = TablesInsert<"inquiry_logs">
export type InquiryLogUpdate = TablesUpdate<"inquiry_logs">

// ============================================================================
// Notification Types
// ============================================================================

export type Notification = Tables<"notifications">
export type NotificationInsert = TablesInsert<"notifications">
export type NotificationUpdate = TablesUpdate<"notifications">

export type NotificationType = "info" | "success" | "warning" | "error"
export type NotificationCategory = "inquiry" | "security" | "system" | "update"

// ============================================================================
// Site Settings Types
// ============================================================================

export type SiteSetting = Tables<"site_settings">
export type SiteSettingInsert = TablesInsert<"site_settings">
export type SiteSettingUpdate = TablesUpdate<"site_settings">

// ============================================================================
// Audit Log Types
// ============================================================================

export type AuditLog = Tables<"audit_logs">
export type AuditLogInsert = TablesInsert<"audit_logs">
export type AuditLogUpdate = TablesUpdate<"audit_logs">

export type AuditAction = 
  | "login" 
  | "logout" 
  | "create" 
  | "read" 
  | "update" 
  | "delete" 
  | "export" 
  | "import" 
  | "approve" 
  | "reject" 
  | "archive" 
  | "restore"

// ============================================================================
// Market Trend Types
// ============================================================================

export type MarketTrend = "bullish" | "bearish" | "neutral" | "volatile"
export type AutoPostStatus = "pending" | "approved" | "rejected" | "posted" | "skipped"
export type BlogPostStatus = "draft" | "scheduled" | "published" | "archived"
export type NewsSentiment = "positive" | "negative" | "neutral" | "mixed"
