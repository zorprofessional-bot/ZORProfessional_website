export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDefinition<Row, Insert = Row, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<
        {
          id: string;
          email: string | null;
          full_name: string | null;
          role: "admin" | "editor" | "viewer";
          created_at: string;
        },
        {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: "admin" | "editor" | "viewer";
          created_at?: string;
        }
      >;
      deck_chapters: TableDefinition<
        {
          id: string;
          slug: string;
          locale: "hr" | "en";
          label: string;
          nav_label: string | null;
          route_path: string;
          theme: string | null;
          background_variant: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          slug: string;
          locale: "hr" | "en";
          label: string;
          nav_label?: string | null;
          route_path: string;
          theme?: string | null;
          background_variant?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      deck_slides: TableDefinition<
        {
          id: string;
          chapter_id: string;
          locale: "hr" | "en";
          slide_key: string;
          eyebrow: string | null;
          title: string;
          body: string | null;
          primary_cta_label: string | null;
          primary_cta_href: string | null;
          secondary_cta_label: string | null;
          secondary_cta_href: string | null;
          visual_type: string | null;
          image_url: string | null;
          background_variant: string | null;
          layout_variant: string | null;
          content_alignment: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          chapter_id: string;
          locale: "hr" | "en";
          slide_key: string;
          eyebrow?: string | null;
          title: string;
          body?: string | null;
          primary_cta_label?: string | null;
          primary_cta_href?: string | null;
          secondary_cta_label?: string | null;
          secondary_cta_href?: string | null;
          visual_type?: string | null;
          image_url?: string | null;
          background_variant?: string | null;
          layout_variant?: string | null;
          content_alignment?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      products: TableDefinition<
        {
          id: string;
          slug: string;
          status: "draft" | "published";
          name_hr: string;
          name_en: string;
          short_description_hr: string | null;
          short_description_en: string | null;
          description_hr: string | null;
          description_en: string | null;
          package_size: string | null;
          roll_count: number | null;
          layers: number | null;
          price_eur: number | null;
          business_note_hr: string | null;
          business_note_en: string | null;
          recommended_for_hr: string | null;
          recommended_for_en: string | null;
          image_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          slug: string;
          status?: "draft" | "published";
          name_hr: string;
          name_en: string;
          short_description_hr?: string | null;
          short_description_en?: string | null;
          description_hr?: string | null;
          description_en?: string | null;
          package_size?: string | null;
          roll_count?: number | null;
          layers?: number | null;
          price_eur?: number | null;
          business_note_hr?: string | null;
          business_note_en?: string | null;
          recommended_for_hr?: string | null;
          recommended_for_en?: string | null;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      blog_posts: TableDefinition<
        {
          id: string;
          slug: string;
          status: "draft" | "published";
          locale: "hr" | "en";
          title: string;
          excerpt: string | null;
          content: string | null;
          seo_title: string | null;
          seo_description: string | null;
          cover_image_url: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          slug: string;
          status?: "draft" | "published";
          locale: "hr" | "en";
          title: string;
          excerpt?: string | null;
          content?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          cover_image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      leads: TableDefinition<
        {
          id: string;
          type: "contact" | "product" | "calculator" | "career";
          status: "new" | "contacted" | "won" | "lost" | "archived";
          name: string | null;
          email: string | null;
          phone: string | null;
          company: string | null;
          message: string | null;
          product_id: string | null;
          calculator_payload: Json | null;
          source_page: string | null;
          source_slide: string | null;
          created_at: string;
        },
        {
          id?: string;
          type: "contact" | "product" | "calculator" | "career";
          status?: "new" | "contacted" | "won" | "lost" | "archived";
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          message?: string | null;
          product_id?: string | null;
          calculator_payload?: Json | null;
          source_page?: string | null;
          source_slide?: string | null;
          created_at?: string;
        }
      >;
      career_positions: TableDefinition<
        {
          id: string;
          status: "draft" | "published" | "archived";
          title_hr: string;
          title_en: string;
          location: string | null;
          employment_type: string | null;
          description_hr: string | null;
          description_en: string | null;
          requirements_hr: string | null;
          requirements_en: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          status?: "draft" | "published" | "archived";
          title_hr: string;
          title_en: string;
          location?: string | null;
          employment_type?: string | null;
          description_hr?: string | null;
          description_en?: string | null;
          requirements_hr?: string | null;
          requirements_en?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      career_applications: TableDefinition<
        {
          id: string;
          position_id: string | null;
          status: "new" | "reviewed" | "contacted" | "rejected" | "archived";
          name: string | null;
          phone: string | null;
          email: string | null;
          experience: string | null;
          available_from: string | null;
          message: string | null;
          cv_url: string | null;
          created_at: string;
        },
        {
          id?: string;
          position_id?: string | null;
          status?: "new" | "reviewed" | "contacted" | "rejected" | "archived";
          name?: string | null;
          phone?: string | null;
          email?: string | null;
          experience?: string | null;
          available_from?: string | null;
          message?: string | null;
          cv_url?: string | null;
          created_at?: string;
        }
      >;
      site_settings: TableDefinition<
        {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        },
        {
          id?: string;
          key: string;
          value?: Json;
          updated_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
