import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { fetchMyOrg, updateOrganization } from "@/lib/api/nr1";
import { EmptyState } from "@/components/app/EmptyState";
import { Building2, MapPin, Plus, Tag, Users } from "lucide-react";
import { TagSelector } from "@/components/app/TagSelector";
import { DEFAULT_COMPANY_SECTORS } from "@/data/companySectors";

export default function UnitsPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [org, setOrg] = useState<any>(null);
  const [orgSectors, setOrgSectors] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", headcount: 0, sector: "", location: "" });

  async function load() {
    const o = await fetchMyOrg();
    setOrg(o);
    if (!o) return;
    setOrgSectors(Array.isArray(o.sectors) ? o.sectors : []);
    const { data } = await supabase.from("units").select("*").eq("organization_id", o.id).order("name");
    setUnits(data ?? []);
  }
  useEffect(() => { load(); }, []);

  const availableSectors = useMemo(() => {
    const set = new Set<string>([
      ...orgSectors,
      ...DEFAULT_COMPANY_SECTORS,
      ...units.map((u) => u.sector).filter(Boolean),
    ]);
    return Array.from(set);
  }, [orgSectors, units]);

  async function persistNewSector(tag: string) {
    if (!org) return;
    if (orgSectors.includes(tag)) return;
    const next = [...orgSectors, tag];
    setOrgSectors(next);
    try {
      await updateOrganization(org.id, { sectors: next });
    } catch (e: any) {
      toast.error("Não foi possível salvar o novo setor na empresa: " + e.message);
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!org) return toast.error("Crie a organização primeiro");
    if (!form.name.trim()) return toast.error("Informe o nome da unidade");
    const { error } = await supabase.from("units").insert({ ...form, organization_id: org.id });
    if (error) toast.error(error.message);
    else {
      toast.success("Unidade criada");
      setForm({ name: "", headcount: 0, sector: "", location: "" });
      load();
    }
  }

  return (
    <div className="space-y-6">
      {!org && (
        <EmptyState
          icon={Building2}
          title="Crie a organização primeiro"
          description="Unidades são recortes (filial, setor, função, turno) que recebem ciclos de avaliação. É preciso ter uma organização cadastrada para começar."
          primary={{ label: "Criar organização", to: "/app/company" }}
        />
      )}

      {org && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" /> Nova unidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={add} className="space-y-5">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <Label>Nome *</Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Matriz, Operação Norte"
                  />
                </div>
                <div>
                  <Label>Headcount</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.headcount || ""}
                    onChange={(e) => setForm({ ...form, headcount: +e.target.value })}
                    placeholder="ex: 25"
                  />
                </div>
                <div>
                  <Label>Local</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Cidade / endereço"
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" /> Setor
                </Label>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Clique em uma tag para vincular esta unidade — novos setores ficam disponíveis também em <strong>Empresa</strong>.
                </p>
                <TagSelector
                  available={availableSectors}
                  selected={form.sector ? [form.sector] : []}
                  onChange={(next) => setForm({ ...form, sector: next[0] ?? "" })}
                  onAddNew={persistNewSector}
                  multi={false}
                  placeholder="Adicionar novo setor (ex: Atendimento)"
                />
              </div>


              <div className="flex justify-end">
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-1" /> Criar unidade
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {org && (
        <Card>
          <CardHeader>
            <CardTitle>Unidades ({units.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {units.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="Nenhuma unidade ainda"
                description="Cadastre ao menos uma unidade (ex.: Matriz, Operação Norte, Linha de Produção A) para vincular ciclos e preservar o k-anonimato no recorte."
                hints={[
                  "Recortes com headcount < 5 não exibem agregados (k-anonimato).",
                  "Setor e local ajudam a contextualizar planos de ação.",
                ]}
                primary={{ label: "Voltar ao roteiro", to: "/app" }}
              />
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                {units.map((u) => (
                  <li
                    key={u.id}
                    className="min-w-0 rounded-xl border border-border bg-card p-3.5 sm:p-4 hover:border-primary/40 transition"
                  >
                    <div className="flex items-start justify-between gap-2.5 min-w-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base break-words leading-snug">
                          {u.name}
                        </p>
                        {u.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 break-words">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{u.location}</span>
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        <Users className="h-3 w-3 mr-1" /> {u.headcount ?? 0}
                      </Badge>
                    </div>
                    {u.sector && (
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
                          <Tag className="h-3 w-3 shrink-0" /> {u.sector}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
