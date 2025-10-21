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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_used: boolean
          used_at: string | null
          used_by_user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_used?: boolean
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_used?: boolean
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Relationships: []
      }
      admin_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          is_used: boolean
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          used_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          content: string
          created_at: string
          excerpt: string
          id: string
          published: boolean
          read_time: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          published?: boolean
          read_time?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          read_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cycle_data: {
        Row: {
          access_code: string
          created_at: string
          custom_settings: Json
          cycle_length: number
          history: Json | null
          id: string
          last_period_start: string | null
          period_length: number
          updated_at: string
        }
        Insert: {
          access_code: string
          created_at?: string
          custom_settings?: Json
          cycle_length?: number
          history?: Json | null
          id?: string
          last_period_start?: string | null
          period_length?: number
          updated_at?: string
        }
        Update: {
          access_code?: string
          created_at?: string
          custom_settings?: Json
          cycle_length?: number
          history?: Json | null
          id?: string
          last_period_start?: string | null
          period_length?: number
          updated_at?: string
        }
        Relationships: []
      }
      cycle_tips: {
        Row: {
          category: string
          created_at: string
          created_by: string
          day: number
          id: string
          is_approved: boolean
          tip_text: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string
          day?: number
          id?: string
          is_approved?: boolean
          tip_text: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          day?: number
          id?: string
          is_approved?: boolean
          tip_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      habit_entries: {
        Row: {
          access_code: string | null
          created_at: string
          date: string
          habit_id: string
          id: string
          updated_at: string
          user_id: string | null
          value: number
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          date: string
          habit_id: string
          id?: string
          updated_at?: string
          user_id?: string | null
          value?: number
        }
        Update: {
          access_code?: string | null
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          updated_at?: string
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "habit_entries_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          access_code: string | null
          color: string
          created_at: string
          emoji: string
          id: string
          name: string
          target: number
          unit: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_code?: string | null
          color?: string
          created_at?: string
          emoji?: string
          id?: string
          name: string
          target?: number
          unit?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_code?: string | null
          color?: string
          created_at?: string
          emoji?: string
          id?: string
          name?: string
          target?: number
          unit?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      periods: {
        Row: {
          created_at: string
          end_date: string | null
          flow_intensity: string | null
          id: string
          notes: string | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          flow_intensity?: string | null
          id?: string
          notes?: string | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          flow_intensity?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reflections: {
        Row: {
          access_code: string | null
          created_at: string
          date: string
          id: string
          improve: string | null
          updated_at: string
          user_id: string | null
          well_done: string | null
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          date: string
          id?: string
          improve?: string | null
          updated_at?: string
          user_id?: string | null
          well_done?: string | null
        }
        Update: {
          access_code?: string | null
          created_at?: string
          date?: string
          id?: string
          improve?: string | null
          updated_at?: string
          user_id?: string | null
          well_done?: string | null
        }
        Relationships: []
      }
      shared_access_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          last_viewed_at: string | null
          owner_access_code: string
          view_count: number
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          last_viewed_at?: string | null
          owner_access_code: string
          view_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          last_viewed_at?: string | null
          owner_access_code?: string
          view_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_random_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_share_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      populate_access_codes: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
