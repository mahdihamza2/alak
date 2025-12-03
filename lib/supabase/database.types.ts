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
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: Database["public"]["Enums"]["notification_type"]
          category: Database["public"]["Enums"]["notification_category"]
          read: boolean | null
          action_url: string | null
          metadata: Json | null
          created_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type?: Database["public"]["Enums"]["notification_type"]
          category?: Database["public"]["Enums"]["notification_category"]
          read?: boolean | null
          action_url?: string | null
          metadata?: Json | null
          created_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: Database["public"]["Enums"]["notification_type"]
          category?: Database["public"]["Enums"]["notification_category"]
          read?: boolean | null
          action_url?: string | null
          metadata?: Json | null
          created_at?: string | null
          expires_at?: string | null
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
    }
    Functions: {
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
      get_setting: { Args: { setting_key: string }; Returns: Json }
      is_admin: {
        Args: { min_role?: Database["public"]["Enums"]["admin_role"] }
        Returns: boolean
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
      notification_type: "info" | "success" | "warning" | "error"
      notification_category: "inquiry" | "security" | "system" | "update"
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
      notification_type: ["info", "success", "warning", "error"],
      notification_category: ["inquiry", "security", "system", "update"],
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

// Convenience type exports
export type AdminProfile = Tables<"admin_profiles">
export type AdminProfileInsert = TablesInsert<"admin_profiles">
export type AdminProfileUpdate = TablesUpdate<"admin_profiles">

export type AuditLog = Tables<"audit_logs">
export type AuditLogInsert = TablesInsert<"audit_logs">

export type Inquiry = Tables<"inquiries">
export type InquiryInsert = TablesInsert<"inquiries">
export type InquiryUpdate = TablesUpdate<"inquiries">

export type InquiryLog = Tables<"inquiry_logs">

export type SiteSetting = Tables<"site_settings">
export type SiteSettingUpdate = TablesUpdate<"site_settings">

export type AuditSummary = Tables<"audit_summary">

export type Notification = Tables<"notifications">
export type NotificationInsert = TablesInsert<"notifications">
export type NotificationUpdate = TablesUpdate<"notifications">

export type AdminRole = Enums<"admin_role">
export type AuditAction = Enums<"audit_action">
export type SettingCategory = Enums<"setting_category">
export type NotificationType = Enums<"notification_type">
export type NotificationCategory = Enums<"notification_category">
