DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'sst', 'gestor', 'colaborador');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.cycle_status AS ENUM ('draft', 'open', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.cycle_horizon AS ENUM ('short', 'medium', 'long');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.control_level AS ENUM ('elimination','substitution','engineering','administrative','ppe');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.action_status AS ENUM ('planned','in_progress','done','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.document_kind AS ENUM ('drps','action_plan','executive_summary');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT,
  sector TEXT,
  size_band TEXT,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_organizations_updated BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _org_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND organization_id = _org_id AND role = _role);
$$;
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND organization_id = _org_id);
$$;
CREATE OR REPLACE FUNCTION public.is_org_manager(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND organization_id = _org_id AND role IN ('admin','sst','gestor'));
$$;
CREATE OR REPLACE FUNCTION public.is_global_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin');
$$;

CREATE POLICY "members read own org" ON public.organizations FOR SELECT TO authenticated USING (public.is_org_member(auth.uid(), id));
CREATE POLICY "users create org as owner" ON public.organizations FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "admins update org" ON public.organizations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), id, 'admin') OR public.has_role(auth.uid(), id, 'sst'));

CREATE POLICY "user reads own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read org roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), organization_id, 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), organization_id, 'admin'))
  WITH CHECK (public.has_role(auth.uid(), organization_id, 'admin'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS persona TEXT,
  ADD COLUMN IF NOT EXISTS sector TEXT,
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'pt-BR';

CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  headcount INT DEFAULT 0,
  sector TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.units TO authenticated;
GRANT ALL ON public.units TO service_role;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_units_updated BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "org members read units" ON public.units FOR SELECT TO authenticated USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "org managers manage units" ON public.units FOR ALL TO authenticated
  USING (public.is_org_manager(auth.uid(), organization_id)) WITH CHECK (public.is_org_manager(auth.uid(), organization_id));

CREATE TABLE IF NOT EXISTS public.cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  horizon public.cycle_horizon NOT NULL DEFAULT 'short',
  status public.cycle_status NOT NULL DEFAULT 'draft',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  questionnaire TEXT NOT NULL DEFAULT 'copsoq_iii_short',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cycles TO authenticated;
GRANT ALL ON public.cycles TO service_role;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_cycles_updated BEFORE UPDATE ON public.cycles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "org members read cycles" ON public.cycles FOR SELECT TO authenticated USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "org managers manage cycles" ON public.cycles FOR ALL TO authenticated
  USING (public.is_org_manager(auth.uid(), organization_id)) WITH CHECK (public.is_org_manager(auth.uid(), organization_id));

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.cycles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  token TEXT NOT NULL UNIQUE,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '60 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO authenticated;
GRANT SELECT, UPDATE ON public.invitations TO anon;
GRANT ALL ON public.invitations TO service_role;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "managers read invitations" ON public.invitations FOR SELECT TO authenticated USING (public.is_org_manager(auth.uid(), organization_id));
CREATE POLICY "managers create invitations" ON public.invitations FOR INSERT TO authenticated WITH CHECK (public.is_org_manager(auth.uid(), organization_id));
CREATE POLICY "managers update invitations" ON public.invitations FOR UPDATE TO authenticated USING (public.is_org_manager(auth.uid(), organization_id));

CREATE TABLE IF NOT EXISTS public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.cycles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  invitation_hash TEXT NOT NULL,
  answers JSONB NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.responses TO anon, authenticated;
GRANT ALL ON public.responses TO service_role;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.cycles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  dimension TEXT NOT NULL,
  driver_slug TEXT,
  severity INT NOT NULL CHECK (severity BETWEEN 1 AND 5),
  probability INT NOT NULL CHECK (probability BETWEEN 1 AND 5),
  risk_level INT GENERATED ALWAYS AS (severity * probability) STORED,
  n_responses INT NOT NULL DEFAULT 0,
  k_anonymity_met BOOLEAN NOT NULL DEFAULT false,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risk_scores TO authenticated;
GRANT ALL ON public.risk_scores TO service_role;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read risk" ON public.risk_scores FOR SELECT TO authenticated USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "managers manage risk" ON public.risk_scores FOR ALL TO authenticated
  USING (public.is_org_manager(auth.uid(), organization_id)) WITH CHECK (public.is_org_manager(auth.uid(), organization_id));

CREATE TABLE IF NOT EXISTS public.control_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  level public.control_level NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  driver_slug TEXT,
  evidence_strength TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.control_catalog TO anon, authenticated;
GRANT ALL ON public.control_catalog TO service_role;
ALTER TABLE public.control_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads catalog" ON public.control_catalog FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.org_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  catalog_id UUID NOT NULL REFERENCES public.control_catalog(id) ON DELETE RESTRICT,
  status public.action_status NOT NULL DEFAULT 'planned',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_controls TO authenticated;
GRANT ALL ON public.org_controls TO service_role;
ALTER TABLE public.org_controls ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_org_controls_updated BEFORE UPDATE ON public.org_controls FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "members read org_controls" ON public.org_controls FOR SELECT TO authenticated USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "managers manage org_controls" ON public.org_controls FOR ALL TO authenticated
  USING (public.is_org_manager(auth.uid(), organization_id)) WITH CHECK (public.is_org_manager(auth.uid(), organization_id));

CREATE TABLE IF NOT EXISTS public.action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES public.cycles(id) ON DELETE SET NULL,
  driver_slug TEXT,
  dimension TEXT,
  title TEXT NOT NULL,
  description TEXT,
  level public.control_level NOT NULL DEFAULT 'administrative',
  status public.action_status NOT NULL DEFAULT 'planned',
  owner_id UUID,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.action_items TO authenticated;
GRANT ALL ON public.action_items TO service_role;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_action_items_updated BEFORE UPDATE ON public.action_items FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "members read actions" ON public.action_items FOR SELECT TO authenticated USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "managers manage actions" ON public.action_items FOR ALL TO authenticated
  USING (public.is_org_manager(auth.uid(), organization_id)) WITH CHECK (public.is_org_manager(auth.uid(), organization_id));

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES public.cycles(id) ON DELETE SET NULL,
  kind public.document_kind NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  storage_path TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read documents" ON public.documents FOR SELECT TO authenticated USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "managers create documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (public.is_org_manager(auth.uid(), organization_id));
CREATE POLICY "managers update documents" ON public.documents FOR UPDATE TO authenticated USING (public.is_org_manager(auth.uid(), organization_id));

DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.crm_leads;
CREATE POLICY "global admins read leads" ON public.crm_leads FOR SELECT TO authenticated USING (public.is_global_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.create_sst_organization(
  _name TEXT, _cnpj TEXT DEFAULT NULL, _sector TEXT DEFAULT NULL, _size_band TEXT DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _org_id UUID;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'auth required'; END IF;
  INSERT INTO public.organizations (name, cnpj, sector, size_band, owner_id)
  VALUES (_name, _cnpj, _sector, _size_band, _uid)
  RETURNING id INTO _org_id;
  INSERT INTO public.user_roles (user_id, organization_id, role) VALUES (_uid, _org_id, 'admin');
  INSERT INTO public.user_roles (user_id, organization_id, role) VALUES (_uid, _org_id, 'sst');
  UPDATE public.profiles SET organization_id = _org_id WHERE id = _uid;
  RETURN _org_id;
END $$;
GRANT EXECUTE ON FUNCTION public.create_sst_organization(TEXT,TEXT,TEXT,TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.validate_invitation(_token TEXT)
RETURNS TABLE (cycle_id UUID, organization_id UUID, unit_id UUID, cycle_name TEXT, org_name TEXT, expired BOOLEAN, used BOOLEAN)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT i.cycle_id, i.organization_id, i.unit_id, c.name, o.name,
         (i.expires_at < now()), (i.used_at IS NOT NULL)
  FROM public.invitations i
  JOIN public.cycles c ON c.id = i.cycle_id
  JOIN public.organizations o ON o.id = i.organization_id
  WHERE i.token = _token
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.validate_invitation(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_response(
  _token TEXT, _answers JSONB, _meta JSONB DEFAULT '{}'::jsonb
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE
  _inv public.invitations%ROWTYPE;
  _resp_id UUID;
  _hash TEXT;
BEGIN
  SELECT * INTO _inv FROM public.invitations WHERE token = _token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'invalid token'; END IF;
  IF _inv.used_at IS NOT NULL THEN RAISE EXCEPTION 'token already used'; END IF;
  IF _inv.expires_at < now() THEN RAISE EXCEPTION 'token expired'; END IF;
  _hash := encode(digest(_token || _inv.id::text, 'sha256'), 'hex');
  INSERT INTO public.responses (cycle_id, organization_id, unit_id, invitation_hash, answers, meta)
  VALUES (_inv.cycle_id, _inv.organization_id, _inv.unit_id, _hash, _answers, _meta)
  RETURNING id INTO _resp_id;
  UPDATE public.invitations SET used_at = now() WHERE id = _inv.id;
  RETURN _resp_id;
END $$;
GRANT EXECUTE ON FUNCTION public.submit_response(TEXT,JSONB,JSONB) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.compute_cycle_risk(_cycle_id UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _org UUID;
  _count INT := 0;
  _dim RECORD;
  _avg NUMERIC;
  _n INT;
  _sev INT;
  _prob INT;
BEGIN
  SELECT organization_id INTO _org FROM public.cycles WHERE id = _cycle_id;
  IF _org IS NULL THEN RAISE EXCEPTION 'cycle not found'; END IF;
  IF NOT public.is_org_manager(_uid, _org) THEN RAISE EXCEPTION 'forbidden'; END IF;
  DELETE FROM public.risk_scores WHERE cycle_id = _cycle_id;
  FOR _dim IN
    SELECT key AS dimension, AVG((value)::numeric) AS avg_val, COUNT(*) AS n
    FROM public.responses r, LATERAL jsonb_each_text(r.answers)
    WHERE r.cycle_id = _cycle_id AND value ~ '^-?[0-9]+(\.[0-9]+)?$'
    GROUP BY key
  LOOP
    _avg := _dim.avg_val;
    _n := _dim.n;
    _sev := LEAST(5, GREATEST(1, CEIL(_avg / 20.0)::int));
    _prob := LEAST(5, GREATEST(1, CEIL((_n::numeric / GREATEST(_n,1)) * _sev)::int));
    INSERT INTO public.risk_scores (cycle_id, organization_id, dimension, severity, probability, n_responses, k_anonymity_met)
    VALUES (_cycle_id, _org, _dim.dimension, _sev, _prob, _n, _n >= 5);
    _count := _count + 1;
  END LOOP;
  RETURN _count;
END $$;
GRANT EXECUTE ON FUNCTION public.compute_cycle_risk(UUID) TO authenticated;