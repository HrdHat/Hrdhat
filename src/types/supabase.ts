export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company: string | null;
          department: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company?: string | null;
          department?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company?: string | null;
          department?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      forms: {
        Row: {
          id: string;
          title: string;
          status: string;
          created_by: string;
          created_at: string;
          updated_at: string;
          metadata: {
            version: string;
            lastModified: string;
          } | null;
        };
        Insert: {
          id: string;
          title: string;
          status: "draft" | "submitted" | "archived";
          created_by: string;
          created_at?: string;
          updated_at?: string;
          submitted_at?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          title?: string;
          status?: "draft" | "submitted" | "archived";
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          submitted_at?: string | null;
          metadata?: Json;
        };
      };
      form_modules: {
        Row: {
          id: string;
          form_id: string;
          module_type: string;
          module_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          form_id: string;
          module_type: string;
          module_data: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          module_type?: string;
          module_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
