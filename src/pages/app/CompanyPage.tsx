// @ts-nocheck -- pre-existing type errors carried over from the original project
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createOrganization, fetchMyOrg, updateOrganization } from "@/lib/api/nr1";
import type { Database } from "@/lib/runtime/databaseTypes";
import { useNavigate, useSearchParams } from "@/lib/router/compat";
import { Building2, Copy, CheckCircle2, Sparkles, Pencil, X, Save } from "lucide-react";
import { TagSelector } from "@/components/app/TagSelector";
import { DEFAULT_COMPANY_SECTORS } from "@/data/companySectors";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
}

export default function CompanyPage() {
  const [form, setForm] = useState({ name: "", cnpj: "", sector: "", size_band: "" });
  const [org, setOrg] = useState<Organization | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState({
    name: "",
    cnpj: "",
    sector: "",
    size_band: "",
    headcount: 0,
    sectors: [] as string[],
  });
  const [extraSectors, setExtraSectors] = useState<string[]>([]);
  const nav = useNavigate();
  const [params] = useSearchParams();
  const justCreated = params.get("welcome") === "1";

  useEffect(() => { fetchMyOrg().then(o => { setOrg(o); setLoading(false); }); }, []);

  function startEdit() {
    if (!org) return;
    setEdit({
      name: org.name ?? "",
      cnpj: org.cnpj ?? "",
      sector: org.sector ?? "",
      size_band: org.size_band ?? "",
      headcount: org.headcount ?? 0,
      sectors: Array.isArray(org.sectors) ? org.sectors : [],
    });
    setExtraSectors([]);
    setEditing(true);
  }

  async function saveEdit() {
    if (!org) return;
    if (!edit.name.trim()) return toast.error("Nome é obrigatório");
    setSaving(true);
    try {
      const updated = await updateOrganization(org.id, {
        name: edit.name.trim(),
        cnpj: edit.cnpj.trim() || null,
        sector: edit.sector.trim() || null,
        size_band: edit.size_band.trim() || null,
        headcount: edit.headcount || null,
        sectors: edit.sectors,
      });
      setOrg(updated);
      setEditing(false);
      toast.success("Empresa atualizada");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao salvar"));
    } finally {
      setSaving(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await createOrganization(form);
      toast.success("Organização criada");
      nav(`/app/company?welcome=1&code=${r.invite_code}`);
      const o = await fetchMyOrg();
      setOrg(o);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao criar organização"));
    } finally { setSaving(false); }
  }

  function copyCode() {
    if (!org?.invite_code) return;
    navigator.clipboard.writeText(org.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (loading) return <p className="text-muted-foreground">Carregando…</p>;

  if (org) {
    const orgSectors: string[] = Array.isArray(org.sectors) ? org.sectors : [];

    return (
      <div className="space-y-6">
        {justCreated && (
          <Card className="border-success/40 bg-success/5">
            <CardContent className="pt-6 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Empresa criada com sucesso 🎉</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Compartilhe o código abaixo com gestores/RH para que eles se vinculem à empresa.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> {org.name}</CardTitle>
            {!editing ? (
              <Button size="sm" variant="outline" onClick={startEdit}>
                <Pencil className="h-4 w-4 mr-1" /> Editar empresa
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
                <Button size="sm" onClick={saveEdit} disabled={saving}>
                  <Save className="h-4 w-4 mr-1" /> {saving ? "Salvando…" : "Salvar alterações"}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            {!editing ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><p className="text-xs uppercase tracking-wider text-muted-foreground">CNPJ</p><p>{org.cnpj ?? "—"}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Setor principal</p><p>{org.sector ?? "—"}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Porte</p><p>{org.size_band ?? "—"}</p></div>
                  {org.headcount != null && <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Colaboradores</p><p>{org.headcount}</p></div>}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Setores da empresa</p>
                  {orgSectors.length === 0 ? (
                    <p className="text-muted-foreground text-xs">Nenhum setor cadastrado. Clique em <strong>Editar empresa</strong> para adicionar.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {orgSectors.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Nome *</Label><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
                  <div><Label>CNPJ</Label><Input value={edit.cnpj} onChange={(e) => setEdit({ ...edit, cnpj: e.target.value })} /></div>
                  <div><Label>Setor principal</Label><Input value={edit.sector} onChange={(e) => setEdit({ ...edit, sector: e.target.value })} placeholder="ex: Indústria" /></div>
                  <div><Label>Porte</Label><Input value={edit.size_band} onChange={(e) => setEdit({ ...edit, size_band: e.target.value })} placeholder="ex: 51-200" /></div>
                  <div><Label>Colaboradores</Label><Input type="number" min={0} value={edit.headcount || ""} onChange={(e) => setEdit({ ...edit, headcount: +e.target.value })} /></div>
                </div>
                <div>
                  <Label>Setores da empresa</Label>
                  <p className="text-[11px] text-muted-foreground mb-2">Clique nas tags para incluir/remover. Adicione novos setores conforme necessário.</p>
                  <TagSelector
                    available={Array.from(new Set([...DEFAULT_COMPANY_SECTORS, ...edit.sectors, ...extraSectors]))}
                    selected={edit.sectors}
                    onChange={(next) => setEdit({ ...edit, sectors: next })}
                    onAddNew={(t) => setExtraSectors((s) => [...s, t])}
                    multi
                  />
                </div>
              </div>
            )}

            {org.invite_code && (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Código de convite (Gestores/RH)</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="text-lg font-mono font-bold text-primary">{org.invite_code}</code>
                  <Button size="sm" variant="outline" onClick={copyCode}>
                    {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copiado" : "Copiar"}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Compartilhe com gestores e RH em <code>/signup/manager</code>. Colaboradores respondem por link anônimo via ciclos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Criar organização</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Esta organização será a base do seu ciclo NR-1 (Mensurar → Educar → Transformar → Relatar).
        </p>
        <form onSubmit={submit} className="space-y-4 max-w-md">
          <div><Label>Nome*</Label><Input required value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/></div>
          <div><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e)=>setForm({...form, cnpj:e.target.value})}/></div>
          <div><Label>Setor</Label><Input value={form.sector} onChange={(e)=>setForm({...form, sector:e.target.value})}/></div>
          <div><Label>Porte</Label><Input placeholder="ex: 51-200" value={form.size_band} onChange={(e)=>setForm({...form, size_band:e.target.value})}/></div>
          <Button type="submit" disabled={saving}>{saving ? "Criando…" : "Criar organização"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
