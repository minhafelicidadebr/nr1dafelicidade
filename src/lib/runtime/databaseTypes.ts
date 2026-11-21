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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      action_items: {
        Row: {
          assignee_name: string | null
          assignee_user_id: string | null
          created_at: string
          cycle_id: string | null
          description: string | null
          dimension: string | null
          driver_slug: string | null
          due_date: string | null
          id: string
          level: Database["public"]["Enums"]["control_level"]
          organization_id: string
          owner_id: string | null
          status: Database["public"]["Enums"]["action_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_name?: string | null
          assignee_user_id?: string | null
          created_at?: string
          cycle_id?: string | null
          description?: string | null
          dimension?: string | null
          driver_slug?: string | null
          due_date?: string | null
          id?: string
          level?: Database["public"]["Enums"]["control_level"]
          organization_id: string
          owner_id?: string | null
          status?: Database["public"]["Enums"]["action_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_name?: string | null
          assignee_user_id?: string | null
          created_at?: string
          cycle_id?: string | null
          description?: string | null
          dimension?: string | null
          driver_slug?: string | null
          due_date?: string | null
          id?: string
          level?: Database["public"]["Enums"]["control_level"]
          organization_id?: string
          owner_id?: string | null
          status?: Database["public"]["Enums"]["action_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
          organization_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
          organization_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
          organization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      control_catalog: {
        Row: {
          code: string
          created_at: string
          description: string | null
          dimension_key: string | null
          driver_slug: string | null
          evidence_strength: string | null
          id: string
          level: Database["public"]["Enums"]["control_level"]
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          dimension_key?: string | null
          driver_slug?: string | null
          evidence_strength?: string | null
          id?: string
          level: Database["public"]["Enums"]["control_level"]
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          dimension_key?: string | null
          driver_slug?: string | null
          evidence_strength?: string | null
          id?: string
          level?: Database["public"]["Enums"]["control_level"]
          title?: string
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          company_name: string
          composite_mql_score: number | null
          consent_email_opt_in: boolean | null
          consent_lgpd: boolean
          consent_version: string
          consent_whatsapp_opt_in: boolean | null
          contact_name: string
          created_at: string
          current_stage_id: string
          employee_count_band: string
          fit_score: number | null
          form_profile_id: string
          id: string
          institution_type: string | null
          intent_score: number | null
          landing_variant_id: string | null
          notes: string | null
          primary_goal: string | null
          role: string | null
          route_id: string
          sector: string | null
          source_channel: string
          source_page_id: string
          updated_at: string | null
          urgency_score: number | null
          utm_campaign: string | null
          utm_source: string | null
          whatsapp: string | null
          work_email: string
        }
        Insert: {
          company_name: string
          composite_mql_score?: number | null
          consent_email_opt_in?: boolean | null
          consent_lgpd?: boolean
          consent_version?: string
          consent_whatsapp_opt_in?: boolean | null
          contact_name: string
          created_at?: string
          current_stage_id?: string
          employee_count_band: string
          fit_score?: number | null
          form_profile_id: string
          id?: string
          institution_type?: string | null
          intent_score?: number | null
          landing_variant_id?: string | null
          notes?: string | null
          primary_goal?: string | null
          role?: string | null
          route_id: string
          sector?: string | null
          source_channel?: string
          source_page_id?: string
          updated_at?: string | null
          urgency_score?: number | null
          utm_campaign?: string | null
          utm_source?: string | null
          whatsapp?: string | null
          work_email: string
        }
        Update: {
          company_name?: string
          composite_mql_score?: number | null
          consent_email_opt_in?: boolean | null
          consent_lgpd?: boolean
          consent_version?: string
          consent_whatsapp_opt_in?: boolean | null
          contact_name?: string
          created_at?: string
          current_stage_id?: string
          employee_count_band?: string
          fit_score?: number | null
          form_profile_id?: string
          id?: string
          institution_type?: string | null
          intent_score?: number | null
          landing_variant_id?: string | null
          notes?: string | null
          primary_goal?: string | null
          role?: string | null
          route_id?: string
          sector?: string | null
          source_channel?: string
          source_page_id?: string
          updated_at?: string | null
          urgency_score?: number | null
          utm_campaign?: string | null
          utm_source?: string | null
          whatsapp?: string | null
          work_email?: string
        }
        Relationships: []
      }
      cycles: {
        Row: {
          created_at: string
          created_by: string
          ends_at: string | null
          horizon: Database["public"]["Enums"]["cycle_horizon"]
          id: string
          name: string
          organization_id: string
          questionnaire: string
          starts_at: string | null
          status: Database["public"]["Enums"]["cycle_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          ends_at?: string | null
          horizon?: Database["public"]["Enums"]["cycle_horizon"]
          id?: string
          name: string
          organization_id: string
          questionnaire?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["cycle_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          ends_at?: string | null
          horizon?: Database["public"]["Enums"]["cycle_horizon"]
          id?: string
          name?: string
          organization_id?: string
          questionnaire?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["cycle_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cycles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dimension_catalog: {
        Row: {
          created_at: string
          default_severity: number
          description: string | null
          dimension_key: string
          dimension_type: string
          label: string
          mte_factor: string | null
          possible_harms: string | null
          recommended_controls: string | null
          source_or_circumstance: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_severity: number
          description?: string | null
          dimension_key: string
          dimension_type: string
          label: string
          mte_factor?: string | null
          possible_harms?: string | null
          recommended_controls?: string | null
          source_or_circumstance?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_severity?: number
          description?: string | null
          dimension_key?: string
          dimension_type?: string
          label?: string
          mte_factor?: string | null
          possible_harms?: string | null
          recommended_controls?: string | null
          source_or_circumstance?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          assinado_em: string | null
          content: Json
          created_at: string
          created_by: string
          cycle_id: string | null
          id: string
          kind: Database["public"]["Enums"]["document_kind"]
          organization_id: string
          revisao_por: string | null
          sha256: string | null
          signature_note: string | null
          storage_path: string | null
          superseded_by: string | null
          title: string
          version: number
        }
        Insert: {
          assinado_em?: string | null
          content?: Json
          created_at?: string
          created_by: string
          cycle_id?: string | null
          id?: string
          kind: Database["public"]["Enums"]["document_kind"]
          organization_id: string
          revisao_por?: string | null
          sha256?: string | null
          signature_note?: string | null
          storage_path?: string | null
          superseded_by?: string | null
          title: string
          version?: number
        }
        Update: {
          assinado_em?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          cycle_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["document_kind"]
          organization_id?: string
          revisao_por?: string | null
          sha256?: string | null
          signature_note?: string | null
          storage_path?: string | null
          superseded_by?: string | null
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          cycle_id: string
          expires_at: string
          id: string
          organization_id: string
          token: string
          unit_id: string | null
          used_at: string | null
        }
        Insert: {
          created_at?: string
          cycle_id: string
          expires_at?: string
          id?: string
          organization_id: string
          token: string
          unit_id?: string | null
          used_at?: string | null
        }
        Update: {
          created_at?: string
          cycle_id?: string
          expires_at?: string
          id?: string
          organization_id?: string
          token?: string
          unit_id?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      mp_entitlements: {
        Row: {
          active: boolean
          created_at: string
          environment: Database["public"]["Enums"]["mp_environment"]
          id: string
          organization_id: string
          plan_code: string
          source_subscription_id: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          environment?: Database["public"]["Enums"]["mp_environment"]
          id?: string
          organization_id: string
          plan_code: string
          source_subscription_id?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          environment?: Database["public"]["Enums"]["mp_environment"]
          id?: string
          organization_id?: string
          plan_code?: string
          source_subscription_id?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mp_entitlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mp_entitlements_source_subscription_id_fkey"
            columns: ["source_subscription_id"]
            isOneToOne: false
            referencedRelation: "mp_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      mp_events: {
        Row: {
          error_reason: string | null
          event_type: string
          http_status: number | null
          id: string
          mp_event_id: string
          payload_sha256: string
          processed_at: string | null
          received_at: string
          resource_id: string | null
          resource_type: string | null
          signature_valid: boolean
          status: Database["public"]["Enums"]["mp_event_status"]
          subscription_id: string | null
        }
        Insert: {
          error_reason?: string | null
          event_type: string
          http_status?: number | null
          id?: string
          mp_event_id: string
          payload_sha256: string
          processed_at?: string | null
          received_at?: string
          resource_id?: string | null
          resource_type?: string | null
          signature_valid?: boolean
          status?: Database["public"]["Enums"]["mp_event_status"]
          subscription_id?: string | null
        }
        Update: {
          error_reason?: string | null
          event_type?: string
          http_status?: number | null
          id?: string
          mp_event_id?: string
          payload_sha256?: string
          processed_at?: string | null
          received_at?: string
          resource_id?: string | null
          resource_type?: string | null
          signature_valid?: boolean
          status?: Database["public"]["Enums"]["mp_event_status"]
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mp_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "mp_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      mp_prices: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          environment: Database["public"]["Enums"]["mp_environment"]
          id: string
          interval: Database["public"]["Enums"]["mp_price_interval"]
          interval_count: number
          mp_preapproval_plan_id: string | null
          product_id: string
          unit_amount: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          environment?: Database["public"]["Enums"]["mp_environment"]
          id?: string
          interval: Database["public"]["Enums"]["mp_price_interval"]
          interval_count?: number
          mp_preapproval_plan_id?: string | null
          product_id: string
          unit_amount: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          environment?: Database["public"]["Enums"]["mp_environment"]
          id?: string
          interval?: Database["public"]["Enums"]["mp_price_interval"]
          interval_count?: number
          mp_preapproval_plan_id?: string | null
          product_id?: string
          unit_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mp_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "mp_products"
            referencedColumns: ["id"]
          },
        ]
      }
      mp_products: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      mp_subscriptions: {
        Row: {
          created_at: string
          created_by: string
          current_period_end: string | null
          current_period_start: string | null
          environment: Database["public"]["Enums"]["mp_environment"]
          external_reference: string
          id: string
          init_point: string | null
          last_verified_at: string | null
          mp_preapproval_id: string | null
          organization_id: string
          price_id: string
          status: Database["public"]["Enums"]["mp_subscription_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: Database["public"]["Enums"]["mp_environment"]
          external_reference?: string
          id?: string
          init_point?: string | null
          last_verified_at?: string | null
          mp_preapproval_id?: string | null
          organization_id: string
          price_id: string
          status?: Database["public"]["Enums"]["mp_subscription_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: Database["public"]["Enums"]["mp_environment"]
          external_reference?: string
          id?: string
          init_point?: string | null
          last_verified_at?: string | null
          mp_preapproval_id?: string | null
          organization_id?: string
          price_id?: string
          status?: Database["public"]["Enums"]["mp_subscription_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mp_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mp_subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "mp_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      org_controls: {
        Row: {
          catalog_id: string
          created_at: string
          id: string
          notes: string | null
          organization_id: string
          status: Database["public"]["Enums"]["action_status"]
          updated_at: string
        }
        Insert: {
          catalog_id: string
          created_at?: string
          id?: string
          notes?: string | null
          organization_id: string
          status?: Database["public"]["Enums"]["action_status"]
          updated_at?: string
        }
        Update: {
          catalog_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          status?: Database["public"]["Enums"]["action_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_controls_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "control_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_controls_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          cnpj: string | null
          created_at: string
          headcount: number | null
          id: string
          invite_code: string | null
          name: string
          owner_id: string
          sector: string | null
          sectors: string[] | null
          size_band: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          headcount?: number | null
          id?: string
          invite_code?: string | null
          name: string
          owner_id: string
          sector?: string | null
          sectors?: string[] | null
          size_band?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          headcount?: number | null
          id?: string
          invite_code?: string | null
          name?: string
          owner_id?: string
          sector?: string | null
          sectors?: string[] | null
          size_band?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badge_count: number | null
          company_name: string | null
          company_size: string | null
          created_at: string | null
          full_name: string | null
          id: string
          ift_balance: number | null
          locale: string | null
          organization_id: string | null
          persona: string | null
          plan: string | null
          role: string | null
          sector: string | null
          streak_days: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          badge_count?: number | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          ift_balance?: number | null
          locale?: string | null
          organization_id?: string | null
          persona?: string | null
          plan?: string | null
          role?: string | null
          sector?: string | null
          streak_days?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          badge_count?: number | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          ift_balance?: number | null
          locale?: string | null
          organization_id?: string | null
          persona?: string | null
          plan?: string | null
          role?: string | null
          sector?: string | null
          streak_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      readiness_assessments: {
        Row: {
          action_governance_score: number
          company_name: string | null
          created_at: string
          data_diagnosis_score: number
          employee_count_band: string | null
          evidence_reporting_score: number
          id: string
          lead_id: string | null
          learning_capability_score: number
          score_band: string
          total_score: number
          user_id: string | null
        }
        Insert: {
          action_governance_score?: number
          company_name?: string | null
          created_at?: string
          data_diagnosis_score?: number
          employee_count_band?: string | null
          evidence_reporting_score?: number
          id?: string
          lead_id?: string | null
          learning_capability_score?: number
          score_band?: string
          total_score?: number
          user_id?: string | null
        }
        Update: {
          action_governance_score?: number
          company_name?: string | null
          created_at?: string
          data_diagnosis_score?: number
          employee_count_band?: string | null
          evidence_reporting_score?: number
          id?: string
          lead_id?: string | null
          learning_capability_score?: number
          score_band?: string
          total_score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "readiness_assessments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          answers: Json
          cycle_id: string
          id: string
          invitation_hash: string
          meta: Json
          organization_id: string
          submitted_at: string
          unit_id: string | null
        }
        Insert: {
          answers: Json
          cycle_id: string
          id?: string
          invitation_hash: string
          meta?: Json
          organization_id: string
          submitted_at?: string
          unit_id?: string | null
        }
        Update: {
          answers?: Json
          cycle_id?: string
          id?: string
          invitation_hash?: string
          meta?: Json
          organization_id?: string
          submitted_at?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_scores: {
        Row: {
          computed_at: string
          criteria_version: string | null
          cycle_id: string
          dimension: string
          driver_slug: string | null
          id: string
          k_anonymity_met: boolean
          mean_score: number | null
          n_responses: number
          organization_id: string
          probability: number
          risk_level: number | null
          severity: number
          unfavorable_percentage: number | null
          unit_id: string | null
        }
        Insert: {
          computed_at?: string
          criteria_version?: string | null
          cycle_id: string
          dimension: string
          driver_slug?: string | null
          id?: string
          k_anonymity_met?: boolean
          mean_score?: number | null
          n_responses?: number
          organization_id: string
          probability: number
          risk_level?: number | null
          severity: number
          unfavorable_percentage?: number | null
          unit_id?: string | null
        }
        Update: {
          computed_at?: string
          criteria_version?: string | null
          cycle_id?: string
          dimension?: string
          driver_slug?: string | null
          id?: string
          k_anonymity_met?: boolean
          mean_score?: number | null
          n_responses?: number
          organization_id?: string
          probability?: number
          risk_level?: number | null
          severity?: number
          unfavorable_percentage?: number | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_scores_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_scores_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_scores_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_scores_history: {
        Row: {
          computation_id: string
          computed_at: string
          computed_by: string | null
          created_at: string
          criteria_version: string | null
          cycle_id: string
          dimension: string
          id: string
          mean_score: number | null
          n_responses: number
          organization_id: string
          probability: number
          risk_level: number
          severity: number
          unfavorable_percentage: number | null
        }
        Insert: {
          computation_id: string
          computed_at?: string
          computed_by?: string | null
          created_at?: string
          criteria_version?: string | null
          cycle_id: string
          dimension: string
          id?: string
          mean_score?: number | null
          n_responses: number
          organization_id: string
          probability: number
          risk_level: number
          severity: number
          unfavorable_percentage?: number | null
        }
        Update: {
          computation_id?: string
          computed_at?: string
          computed_by?: string | null
          created_at?: string
          criteria_version?: string | null
          cycle_id?: string
          dimension?: string
          id?: string
          mean_score?: number | null
          n_responses?: number
          organization_id?: string
          probability?: number
          risk_level?: number
          severity?: number
          unfavorable_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_scores_history_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_scores_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string
          headcount: number | null
          id: string
          location: string | null
          name: string
          organization_id: string
          sector: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          headcount?: number | null
          id?: string
          location?: string | null
          name: string
          organization_id: string
          sector?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          headcount?: number | null
          id?: string
          location?: string | null
          name?: string
          organization_id?: string
          sector?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          driver_slug: string
          dynamic_id: string
          id: string
          ift_earned: number | null
          score: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          driver_slug: string
          dynamic_id: string
          id?: string
          ift_earned?: number | null
          score?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          driver_slug?: string
          dynamic_id?: string
          id?: string
          ift_earned?: number | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aggregate_cycle_outcomes: {
        Args: { _cycle_id: string }
        Returns: {
          k_anonymity_met: boolean
          mean_score: number
          n_responses: number
          outcome: string
        }[]
      }
      aggregate_unit_risk: {
        Args: { _cycle_id: string }
        Returns: {
          dimension: string
          k_anonymity_met: boolean
          mean_score: number
          n_responses: number
          unit_id: string
          unit_name: string
        }[]
      }
      compute_cycle_risk: { Args: { _cycle_id: string }; Returns: number }
      create_document_version: {
        Args: {
          _content: Json
          _cycle_id: string
          _kind: Database["public"]["Enums"]["document_kind"]
          _title: string
        }
        Returns: Database["public"]["Tables"]["documents"]["Row"]
      }
      create_sst_organization: {
        Args: {
          _cnpj?: string
          _headcount?: number
          _instrument?: string
          _name: string
          _sector?: string
          _sectors?: string[]
          _size_band?: string
        }
        Returns: {
          id: string
          invite_code: string
        }[]
      }
      find_org_by_invite_code: {
        Args: { _code: string }
        Returns: {
          name: string
          sectors: string[]
        }[]
      }
      has_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      invitation_lookup: {
        Args: { _token: string }
        Returns: {
          expired: boolean
          uses_remaining: number
        }[]
      }
      is_global_admin: { Args: { _user_id: string }; Returns: boolean }
      is_org_manager: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      join_org_by_invite_code: {
        Args: { _code: string; _persona?: string; _sector?: string }
        Returns: string
      }
      list_org_members: {
        Args: { _org_id: string }
        Returns: {
          full_name: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      review_document: {
        Args: { _document_id: string; _signature_note?: string | null }
        Returns: Database["public"]["Tables"]["documents"]["Row"]
      }
      submit_response: {
        Args: { _answers: Json; _meta?: Json; _token: string }
        Returns: string
      }
      suggest_controls_for_cycle: {
        Args: { _cycle_id: string; _top_n?: number }
        Returns: {
          control_code: string
          control_description: string
          control_level: string
          control_title: string
          dimension: string
          driver_slug: string
          evidence_strength: string
          n_responses: number
          risk_level: number
        }[]
      }
      validate_invitation: {
        Args: { _token: string }
        Returns: {
          can_respond: boolean
          cycle_id: string
          cycle_name: string
          cycle_status: Database["public"]["Enums"]["cycle_status"]
          expired: boolean
          org_name: string
          organization_id: string
          unit_id: string
          used: boolean
        }[]
      }
      write_audit_log: {
        Args: {
          _action: string
          _entity_id: string
          _entity_type: string
          _metadata?: Json
          _organization_id: string
        }
        Returns: string
      }
    }
    Enums: {
      action_status: "planned" | "in_progress" | "done" | "cancelled"
      app_role:
        | "admin"
        | "sst"
        | "gestor"
        | "colaborador"
        | "platform_admin"
        | "org_owner"
        | "viewer"
      control_level:
        | "elimination"
        | "substitution"
        | "engineering"
        | "administrative"
        | "ppe"
      cycle_horizon: "short" | "medium" | "long"
      cycle_status: "draft" | "open" | "closed" | "archived"
      document_kind: "drps" | "action_plan" | "executive_summary"
      mp_environment: "sandbox"
      mp_event_status:
        | "received"
        | "verified"
        | "processed"
        | "rejected_signature"
        | "rejected_lookup"
        | "duplicate"
        | "ignored"
      mp_price_interval: "month" | "year"
      mp_subscription_status:
        | "pending"
        | "authorized"
        | "paused"
        | "cancelled"
        | "expired"
        | "rejected"
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
      action_status: ["planned", "in_progress", "done", "cancelled"],
      app_role: [
        "admin",
        "sst",
        "gestor",
        "colaborador",
        "platform_admin",
        "org_owner",
        "viewer",
      ],
      control_level: [
        "elimination",
        "substitution",
        "engineering",
        "administrative",
        "ppe",
      ],
      cycle_horizon: ["short", "medium", "long"],
      cycle_status: ["draft", "open", "closed", "archived"],
      document_kind: ["drps", "action_plan", "executive_summary"],
      mp_environment: ["sandbox"],
      mp_event_status: [
        "received",
        "verified",
        "processed",
        "rejected_signature",
        "rejected_lookup",
        "duplicate",
        "ignored",
      ],
      mp_price_interval: ["month", "year"],
      mp_subscription_status: [
        "pending",
        "authorized",
        "paused",
        "cancelled",
        "expired",
        "rejected",
      ],
    },
  },
} as const
