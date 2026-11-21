CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  company_size TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  ift_balance INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  badge_count INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  driver_slug TEXT NOT NULL,
  dynamic_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  ift_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, driver_slug, dynamic_id)
);
GRANT SELECT, INSERT, UPDATE ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO service_role;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source_channel text NOT NULL DEFAULT 'public_landing',
  source_page_id text NOT NULL DEFAULT 'landing_work_wellbeing_employee_saas',
  form_profile_id text NOT NULL,
  route_id text NOT NULL,
  contact_name text NOT NULL,
  work_email text NOT NULL,
  company_name text NOT NULL,
  employee_count_band text NOT NULL,
  primary_goal text,
  role text,
  sector text,
  whatsapp text,
  institution_type text,
  current_stage_id text NOT NULL DEFAULT 'raw_inbound',
  utm_source text,
  utm_campaign text,
  landing_variant_id text,
  consent_lgpd boolean NOT NULL DEFAULT false,
  consent_email_opt_in boolean DEFAULT false,
  consent_whatsapp_opt_in boolean DEFAULT false,
  consent_version text NOT NULL DEFAULT 'landing_terms_v1',
  fit_score integer DEFAULT 0,
  intent_score integer DEFAULT 0,
  urgency_score integer DEFAULT 0,
  composite_mql_score integer DEFAULT 0,
  notes text,
  updated_at timestamptz DEFAULT now()
);
GRANT INSERT ON public.crm_leads TO anon;
GRANT SELECT, INSERT ON public.crm_leads TO authenticated;
GRANT ALL ON public.crm_leads TO service_role;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead form" ON public.crm_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can view leads" ON public.crm_leads FOR SELECT TO authenticated USING (true);

CREATE TABLE public.readiness_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  user_id uuid,
  data_diagnosis_score integer NOT NULL DEFAULT 0,
  learning_capability_score integer NOT NULL DEFAULT 0,
  action_governance_score integer NOT NULL DEFAULT 0,
  evidence_reporting_score integer NOT NULL DEFAULT 0,
  total_score integer NOT NULL DEFAULT 0,
  score_band text NOT NULL DEFAULT 'inicial',
  company_name text,
  employee_count_band text
);
GRANT INSERT ON public.readiness_assessments TO anon;
GRANT SELECT, INSERT ON public.readiness_assessments TO authenticated;
GRANT ALL ON public.readiness_assessments TO service_role;
ALTER TABLE public.readiness_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create assessment" ON public.readiness_assessments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view own assessments" ON public.readiness_assessments FOR SELECT TO authenticated USING (auth.uid() = user_id);