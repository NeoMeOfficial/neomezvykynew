// Auto-generated types for Supabase — matches 001_initial_schema.sql
// Regenerate with: npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          language: string;
          date_of_birth: string | null;
          role: 'user' | 'admin' | 'coach';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: 'free' | 'plus' | 'program';
          status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['subscriptions']['Row']> & { user_id: string };
        Update: Partial<Database['public']['Tables']['subscriptions']['Row']>;
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          duration_days: number;
          unit: string;
          target_per_day: number;
          start_date: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['habits']['Row']> & { user_id: string; name: string };
        Update: Partial<Database['public']['Tables']['habits']['Row']>;
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          date: string;
          count: number;
        };
        Insert: Partial<Database['public']['Tables']['habit_completions']['Row']> & { habit_id: string; user_id: string; date: string };
        Update: Partial<Database['public']['Tables']['habit_completions']['Row']>;
      };
      cycle_data: {
        Row: {
          id: string;
          user_id: string;
          last_period_start: string | null;
          cycle_length: number;
          period_length: number;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['cycle_data']['Row']> & { user_id: string };
        Update: Partial<Database['public']['Tables']['cycle_data']['Row']>;
      };
      cycle_symptoms: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          symptoms: Json;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['cycle_symptoms']['Row']> & { user_id: string; date: string };
        Update: Partial<Database['public']['Tables']['cycle_symptoms']['Row']>;
      };
      diary_entries: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          date: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['diary_entries']['Row']> & { user_id: string; text: string };
        Update: Partial<Database['public']['Tables']['diary_entries']['Row']>;
      };
      recipes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          image: string | null;
          prep_time: number | null;
          calories: number | null;
          protein: number | null;
          carbs: number | null;
          fat: number | null;
          ingredients: Json;
          steps: string[];
          allergens: string[];
          dietary: string[];
          tags: string[];
          is_free: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['recipes']['Row']> & { id: string; title: string; category: string };
        Update: Partial<Database['public']['Tables']['recipes']['Row']>;
      };
      recipe_favorites: {
        Row: { user_id: string; recipe_id: string; created_at: string };
        Insert: { user_id: string; recipe_id: string };
        Update: Partial<Database['public']['Tables']['recipe_favorites']['Row']>;
      };
      programs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          tagline: string | null;
          image: string | null;
          weeks: number | null;
          per_week: number | null;
          price_cents: number | null;
          stripe_price_id: string | null;
          published: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['programs']['Row']> & { id: string; name: string };
        Update: Partial<Database['public']['Tables']['programs']['Row']>;
      };
      program_exercises: {
        Row: {
          id: string;
          program_id: string;
          week: number;
          day: number;
          title: string;
          description: string | null;
          video_url: string | null;
          thumbnail_url: string | null;
          duration_seconds: number | null;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['program_exercises']['Row']> & { program_id: string; week: number; day: number; title: string };
        Update: Partial<Database['public']['Tables']['program_exercises']['Row']>;
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          content: string;
          image_url: string | null;
          pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['community_posts']['Row']> & { user_id: string; content: string };
        Update: Partial<Database['public']['Tables']['community_posts']['Row']>;
      };
      community_comments: {
        Row: { id: string; post_id: string; user_id: string; content: string; created_at: string };
        Insert: Partial<Database['public']['Tables']['community_comments']['Row']> & { post_id: string; user_id: string; content: string };
        Update: Partial<Database['public']['Tables']['community_comments']['Row']>;
      };
      conversations: {
        Row: { id: string; created_at: string };
        Insert: Partial<Database['public']['Tables']['conversations']['Row']>;
        Update: Partial<Database['public']['Tables']['conversations']['Row']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          content: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['messages']['Row']> & { conversation_id: string; user_id: string; content: string };
        Update: Partial<Database['public']['Tables']['messages']['Row']>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          excerpt: string | null;
          image_url: string | null;
          author_id: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']> & { slug: string; title: string; content: string };
        Update: Partial<Database['public']['Tables']['blog_posts']['Row']>;
      };
      meditations: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string | null;
          audio_url: string | null;
          duration_seconds: number | null;
          is_free: boolean;
          published: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['meditations']['Row']> & { title: string };
        Update: Partial<Database['public']['Tables']['meditations']['Row']>;
      };
      app_settings: {
        Row: { key: string; value: Json; updated_at: string };
        Insert: { key: string; value: Json };
        Update: Partial<Database['public']['Tables']['app_settings']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json;
          read: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['notifications']['Row']> & { user_id: string; type: string; title: string };
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
    };
  };
}
