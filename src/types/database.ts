
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          sport_id: string
          start_time: string
          end_time: string | null
          stream_url: string | null
          thumbnail_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          sport_id: string
          start_time: string
          end_time?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          sport_id?: string
          start_time?: string
          end_time?: string | null
          stream_url?: string | null
          thumbnail_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      event_teams: {
        Row: {
          event_id: string
          team_id: string
        }
        Insert: {
          event_id: string
          team_id: string
        }
        Update: {
          event_id?: string
          team_id?: string
        }
      }
      favorite_sports: {
        Row: {
          user_id: string
          sport_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          sport_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          sport_id?: string
          created_at?: string
        }
      }
      favorite_teams: {
        Row: {
          user_id: string
          team_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          team_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          team_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          event_id: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          title?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
      sports: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          payment_method: string
          payment_id: string | null
          start_date: string
          end_date: string | null
          amount: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          payment_method: string
          payment_id?: string | null
          start_date?: string
          end_date?: string | null
          amount: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          payment_method?: string
          payment_id?: string | null
          start_date?: string
          end_date?: string | null
          amount?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          sport_id: string
          logo_url: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sport_id: string
          logo_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sport_id?: string
          logo_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_active_subscription: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      generate_event_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_payment: {
        Args: {
          p_user_id: string
          p_payment_method: string
          p_payment_id?: string
          p_amount?: number
          p_currency?: string
        }
        Returns: Json
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