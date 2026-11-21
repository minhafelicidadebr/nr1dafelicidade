CREATE OR REPLACE FUNCTION public.is_global_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'platform_admin');
$$;

DROP POLICY IF EXISTS "global admins read leads" ON public.crm_leads;
CREATE POLICY "platform admins read leads" ON public.crm_leads FOR SELECT TO authenticated USING (public.is_global_admin(auth.uid()));
CREATE POLICY "platform admins update leads" ON public.crm_leads FOR UPDATE TO authenticated
  USING (public.is_global_admin(auth.uid())) WITH CHECK (public.is_global_admin(auth.uid()));
CREATE POLICY "platform admins delete leads" ON public.crm_leads FOR DELETE TO authenticated USING (public.is_global_admin(auth.uid()));
GRANT UPDATE, DELETE ON public.crm_leads TO authenticated;

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org managers read audit logs" ON public.audit_logs FOR SELECT TO authenticated
  USING (organization_id IS NOT NULL AND public.is_org_manager(auth.uid(), organization_id));
CREATE POLICY "platform admins read all audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_global_admin(auth.uid()));
CREATE INDEX IF NOT EXISTS audit_logs_org_idx ON public.audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON public.audit_logs(entity_type, entity_id);

CREATE OR REPLACE FUNCTION public.write_audit_log(
  _organization_id UUID, _entity_type TEXT, _entity_id UUID, _action TEXT, _metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _id UUID;
BEGIN
  INSERT INTO public.audit_logs (organization_id, user_id, entity_type, entity_id, action, metadata)
  VALUES (_organization_id, auth.uid(), _entity_type, _entity_id, _action, COALESCE(_metadata, '{}'::jsonb))
  RETURNING id INTO _id;
  RETURN _id;
END $$;

DROP FUNCTION IF EXISTS public.validate_invitation(text);
CREATE OR REPLACE FUNCTION public.validate_invitation(_token text)
RETURNS TABLE(cycle_id uuid, organization_id uuid, unit_id uuid, cycle_name text, org_name text,
  cycle_status public.cycle_status, expired boolean, used boolean, can_respond boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT i.cycle_id, i.organization_id, i.unit_id, c.name, o.name, c.status,
    (i.expires_at < now()) AS expired,
    (i.used_at IS NOT NULL) AS used,
    (c.status = 'open' AND i.used_at IS NULL AND i.expires_at >= now()) AS can_respond
  FROM public.invitations i
  JOIN public.cycles c ON c.id = i.cycle_id
  JOIN public.organizations o ON o.id = i.organization_id
  WHERE i.token = _token
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.validate_invitation(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_response(_token text, _answers jsonb, _meta jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE
  _inv public.invitations%ROWTYPE;
  _cycle_status public.cycle_status;
  _resp_id UUID;
  _hash TEXT;
BEGIN
  SELECT * INTO _inv FROM public.invitations WHERE token = _token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'invalid token'; END IF;
  IF _inv.used_at IS NOT NULL THEN RAISE EXCEPTION 'token already used'; END IF;
  IF _inv.expires_at < now() THEN RAISE EXCEPTION 'token expired'; END IF;
  SELECT status INTO _cycle_status FROM public.cycles WHERE id = _inv.cycle_id;
  IF _cycle_status IS DISTINCT FROM 'open' THEN
    RAISE EXCEPTION 'cycle not open (status=%)', _cycle_status;
  END IF;
  IF _answers IS NULL OR jsonb_typeof(_answers) <> 'object' THEN
    RAISE EXCEPTION 'invalid answers payload';
  END IF;
  _hash := encode(digest(_token || _inv.id::text, 'sha256'), 'hex');
  INSERT INTO public.responses (cycle_id, organization_id, unit_id, invitation_hash, answers, meta)
  VALUES (_inv.cycle_id, _inv.organization_id, _inv.unit_id, _hash, _answers, COALESCE(_meta, '{}'::jsonb))
  RETURNING id INTO _resp_id;
  UPDATE public.invitations SET used_at = now() WHERE id = _inv.id;
  PERFORM public.write_audit_log(_inv.organization_id, 'response', _inv.cycle_id, 'submitted',
    jsonb_build_object('unit_id', _inv.unit_id, 'invitation_hash', _hash));
  RETURN _resp_id;
END $$;

REVOKE EXECUTE ON FUNCTION public.is_global_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_org_manager(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.write_audit_log(uuid, text, uuid, text, jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_sst_organization(text, text, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.compute_cycle_risk(uuid) FROM PUBLIC, anon;