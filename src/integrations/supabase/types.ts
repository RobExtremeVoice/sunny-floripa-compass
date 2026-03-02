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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          address: string | null
          amenities: string[] | null
          booking_url: string | null
          checkin_date: string | null
          checkout_date: string | null
          city: string | null
          created_at: string
          currency: string | null
          data_source: string | null
          description: string | null
          external_id: string
          hotel_type: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          photo_url: string | null
          photos: string[] | null
          price_per_night: number | null
          review_count: number | null
          review_score: number | null
          star_rating: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          booking_url?: string | null
          checkin_date?: string | null
          checkout_date?: string | null
          city?: string | null
          created_at?: string
          currency?: string | null
          data_source?: string | null
          description?: string | null
          external_id: string
          hotel_type?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          photo_url?: string | null
          photos?: string[] | null
          price_per_night?: number | null
          review_count?: number | null
          review_score?: number | null
          star_rating?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          booking_url?: string | null
          checkin_date?: string | null
          checkout_date?: string | null
          city?: string | null
          created_at?: string
          currency?: string | null
          data_source?: string | null
          description?: string | null
          external_id?: string
          hotel_type?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          photo_url?: string | null
          photos?: string[] | null
          price_per_night?: number | null
          review_count?: number | null
          review_score?: number | null
          star_rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      airlines: {
        Row: {
          code: string
          created_at: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      flights: {
        Row: {
          actual_time: string | null
          airline_code: string
          created_at: string
          destination: string
          estimated_time: string | null
          flight_number: string
          gate: string | null
          id: string
          is_arrival: boolean
          origin: string
          scheduled_time: string
          status: Database["public"]["Enums"]["flight_status"]
          terminal: string | null
          updated_at: string
        }
        Insert: {
          actual_time?: string | null
          airline_code: string
          created_at?: string
          destination: string
          estimated_time?: string | null
          flight_number: string
          gate?: string | null
          id?: string
          is_arrival?: boolean
          origin: string
          scheduled_time: string
          status?: Database["public"]["Enums"]["flight_status"]
          terminal?: string | null
          updated_at?: string
        }
        Update: {
          actual_time?: string | null
          airline_code?: string
          created_at?: string
          destination?: string
          estimated_time?: string | null
          flight_number?: string
          gate?: string | null
          id?: string
          is_arrival?: boolean
          origin?: string
          scheduled_time?: string
          status?: Database["public"]["Enums"]["flight_status"]
          terminal?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flights_airline_code_fkey"
            columns: ["airline_code"]
            isOneToOne: false
            referencedRelation: "airlines"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      flight_status:
        | "scheduled"
        | "boarding"
        | "departed"
        | "in_air"
        | "landed"
        | "arrived"
        | "delayed"
        | "cancelled"
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
      flight_status: [
        "scheduled",
        "boarding",
        "departed",
        "in_air",
        "landed",
        "arrived",
        "delayed",
        "cancelled",
      ],
    },
  },
} as const
