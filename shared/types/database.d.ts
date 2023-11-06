export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          created_at: string;
          id: number;
          podcast_id: string;
          podcast_image: string | null;
          podcast_title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          podcast_id: string;
          podcast_image?: string | null;
          podcast_title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          podcast_id?: string;
          podcast_image?: string | null;
          podcast_title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
