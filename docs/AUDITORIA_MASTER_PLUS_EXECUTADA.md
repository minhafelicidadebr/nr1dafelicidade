# Auditoria Master Plus — Execução do Super Comitê (ToT)

> Documento preliminar. Não é certificação de conformidade, parecer jurídico nem validação
> psicométrica. Notas ancoradas em evidência de código do snapshot; sujeitas a revisão técnica,
> metodológica, jurídica e a aprovação formal de gate.
> Data: 03/07/2026 · Gate vigente: G0/G1 sintético · Decisão: No-Go para dados reais.

---

## 0. Veredito executivo (5 linhas)

- **Maturidade de arquitetura demonstrável: 71/100** — fundação de privacidade e governança acima da média; ainda dependente de instrumento e provas externas.
- **Prontidão para SaaS produtivo escalável: 46/100** — falta operação (observabilidade, SLO, suporte), instrumento canônico e RAG governado.
- **Estágio real:** Fundação governada + MVP sintético demonstrável, com gates fail-closed reais no código.
- **Decisão de gate:** NO-GO para dados reais, campanhas com trabalhadores, laudo a cliente, certificação e promessa de conformidade. GO condicionado para demonstração sintética interna e oferta Design Partner de descoberta.
- **Virtude #1 a integrar já:** modelo "risco bruto → controle → risco residual" da tela *Controles Implantados* (referência NCOPSII), adaptado ao seu `controlEvidence.ts`, que já bloqueia redução automática de risco.

---

## 1. Base de evidência verificada (o que existe de fato)

| Camada | Evidência no snapshot (arquivo) | Leitura do comitê |
|---|---|---|
| Runtime gate | `src/data/runtimePolicy.ts` (`Object.freeze`, `maximumAllowedDataMode:"synthetic"`, `realDataApprovalReference:null`) + `src/lib/runtime/dataGate.ts` (`DataGateBlockedError`, bloqueia remoto/real sem aprovação) | Fail-closed real e testável. Ponto forte. |
| Privacy Vault | `supabase/migrations/20260623013000_privacy_vault_g1.sql`: `CHECK (k_min >= 5)`, RLS revogada de anon/authenticated em `responses/risk_scores/risk_scores_history/invitations`, RPCs `SECURITY DEFINER` com supressão `HAVING COUNT(*) >= _k`, exige `status='closed'`, remove `invitation_hash`, ciclo monotônico | Decisão arquitetural correta; k≥5 aplicado no servidor, não só na UI. |
| k-anonimato cliente | `src/lib/privacy.ts` (`K_ANONYMITY_MIN=5`, `redactIfBelowK`) | Dupla camada coerente com o servidor. |
| Instrument Registry | `src/lib/instruments/registry.ts` (aprovação exige fonte+licença+SHA-256+scoring server+runtimeReady) + `src/data/instrumentRegistry.ts` (`0.1.0-draft`, `sourceStatus:"unverified"`, `runtimeReady:false`) | Honestidade epistêmica exemplar. Instrumento **bloqueado**, como deve ser. |
| Criteria Engine | `src/lib/risk/criteriaEngine.ts` (lança `criteria_version_not_approved`; severidade=máx, probabilidade=média; risco 1–25) + `src/data/criteriaPolicy.ts` (`status:"draft"`) | Mecanismo puro e versionado; cálculo legado bloqueado. |
| Edge Functions IA | `supabase/functions/_shared/security.ts` (POST-only, allowlist Origin, `Content-Type` obrigatório, corpo ≤65.536 B, Bearer + `auth.getUser`, rate-limit via RPC, `X-Trace-Id`, `no-store`) | Superfície de borda forte, acima da média Lovable/Supabase. |
| Governança | `actionGovernance.ts` (bloqueia `done` sem revisão técnica), `controlEvidence.ts` (`CONTROL_EVIDENCE_DISCLAIMER`), `gateReadiness.ts`, `regulatoryJourney.ts`, `g1ReadinessCriteria.ts` (14 critérios `gateBlocking`) | Cadeia sinal→contexto→decisão→evidência mapeada em código. |
| Qualidade | `package.json` (`npm@11.9.0`, script `ci` com ~17 checks, `recharts ^2.15.4`, `@supabase/supabase-js ^2.98.0`, `vite ^8.1.0`) + `.github/workflows/ci.yml` (job `verify` + `database-security` com pgTAP, Actions pinadas por SHA) + `scripts/check-build-budget.mjs` (500 kB/chunk) | Pipeline reprodutível **existe versionado**. Recharts 2 declarado (P0 do laudo anterior resolvido). |
| Dívida | `tsconfig.json` (`noImplicitAny:false`, `strictNullChecks:false`); `any` localizado (não difuso); repositório duplicado em `app-lente01-cop-nr1/` | Dívida real, mas contida e declarada. |
| Overclaim | `src/pages/NR1CopsoqPage.tsx` rotula tudo como "Demo educativa e sintética", "não valida instrumento", "Limite metodológico" | Anti-overclaim consistente na UI própria. |

`Risco residual:` o job de banco no CI (`database-security`) e as ~206 asserções pgTAP são citados como verdes localmente, mas a execução no GitHub oficial **não é verificável neste snapshot** (sem histórico `.git` conclusivo).

---

## 2. Scorecard de maturidade (0–5)

| Dimensão | Nota | Diagnóstico (evidência) |
|---|---:|---|
| Proposta de valor / categoria | 4,0 | Cadeia sinal→contexto→ação→evidência, não "survey+dashboard". |
| Arquitetura de software | 3,5 | Separação `lib`/`data` limpa; páginas extensas e repo duplicado pesam. |
| Qualidade de código | 3,0 | `ci` encadeia lint+typecheck+test+build+budget; `strict:false` limita. |
| Segurança e privacidade | 4,0 | Privacy Vault + dataGate + k≥5 server-side. Ponto mais maduro. |
| Multi-tenancy | 3,0 | `is_org_member/manager`, escopo por org nas RPCs; sem prova em produção. |
| Governança de dados | 3,0 | Lifecycle monotônico, retenção/descarte em draft testado; decisões legais pendentes. |
| Instrumento e validade científica | 1,5 | `0.1.0-draft`, sem fonte/licença/scoring. Corretamente bloqueado. |
| IA supervisionada | 2,5 | Borda forte; prompt estático + gateway externo, **sem RAG governado nem evals**. |
| UX / acessibilidade | 3,0 | Jornadas e estados de segurança presentes; sem E2E browser nem WCAG verificado. |
| Observabilidade / confiabilidade | 1,0 | `X-Trace-Id` existe; sem métricas, alertas, SLO, on-call. |
| DevOps / CI-CD | 3,0 | CI versionado com job de banco (subiu de 0,5 do laudo anterior); falta prova de execução remota. |
| Evidência auditável NR-1 | 2,5 | Cadeia conceitual + engines; depende de revisão técnica/metodológica. |
| Onboarding / adoção | 2,5 | Fluxos existem; adoção não comprovada. |
| Estratégia comercial | 2,5 | Narrativa Design Partner boa; recorrência plena prematura. |
| Escala enterprise | 2,0 | Potencial arquitetural sem operação/performance provadas. |
| Bem-estar / PERMA+V como diferencial | 3,0 | 12 drivers de bem-estar (`driver-chat`) presentes; falta amarrar ao ciclo de risco com evidência. |

`Risco residual:` notas de IA e observabilidade são o teto de crescimento para SaaS; sem elas não há operação enterprise defensável.

---

## 3. Matriz de extração de virtudes (núcleo do pedido)

Ramos ToT: **A** integrar como está · **B** integrar com guardrail · **C** simular/adiar · **D** rejeitar.

| Funcionalidade candidata | Fonte | Padrão de valor | Ramo | Guardrails obrigatórios | Invariante em risco | Status realista |
|---|---|---|---|---|---|---|
| Controles Implantados (bruto→controle→residual + alerta divergência) | NCOPSII / print | Evita sugerir ação já feita; sinaliza "controle existe + risco vermelho = revisar eficácia" | **B** | Ligar a `controlEvidence.ts`; controle declarado **não** altera escore; residual só com evidência+eficácia+revisão | Fórmula auditável | Base pronta (`controlEvidence.ts`), UI a integrar |
| Tradução automática p/ 13 Fatores MTE 2025 | Guia MTE / NCOPSII | Auditor vê fatores nomeados, não só dimensões | **B** | Rótulo "mapeamento preliminar"; citar dimensões que sustentam; sem claim de cobertura total | Overclaim de conformidade | Rascunho recomendado |
| Matriz AIHA 5×5 + tolerabilidade combinada | Guia MTE / NCOPSII | Severidade×Probabilidade legível p/ PGR | **B** | Seu `criteriaEngine` já faz 1–25; expor como *draft* até `criteriaPolicy` aprovada | Scoring/fórmula | Motor pronto, política em draft |
| Inventário: fontes, circunstâncias, agravos (1.5.4.4.6.1) | Guia MTE | Rastreabilidade exigida na fiscalização | **B** | Campos por dimensão; agravos com CID só como referência, não diagnóstico | Documento preliminar | Rascunho recomendado |
| Hierarquia de controles etiquetada (Eliminação→EPI) | Guia MTE / NCOPSII | Prioriza medida estrutural sobre EPI | **A** | Nenhum — alinhado à NR-1 1.5.4.3 | — | Integrar |
| Tag Causal × Atenuante nas ações | NCOPSII | Impede confundir apoio paliativo com prevenção | **A** | Rótulo informativo | — | Integrar (alto valor, baixo custo) |
| Comparativo Líder × Liderado | NCOPSII | Revela conflito de percepção que a média esconde | **B** | Só exibir com **ambos os grupos ≥ k=5**; senão suprimir | k-anonimato | Rascunho com trava k |
| Representatividade por setor | NCOPSII | Expõe adesão baixa por área | **B** | Supressão < k; nunca expor contagem individual | k-anonimato | Rascunho com trava k |
| Documentos orientativos (Texto-PGR, Comunicado, Manifesto) | NCOPSII / modelos | Acelera entrega; evidência de participação | **B** | Marca d'água "preliminar até revisão/assinatura"; sem preencher claims de validação | Documentos preliminares | Já há `ORIENTATIVE_DOCUMENT_TEMPLATES_G1` |
| Devolutiva/apresentação aos trabalhadores (1.5.7.4) | NCOPSII | Fecha comunicação exigida | **A** | Linguagem neutra, sem gamificação coercitiva | — | Integrar |
| Reteste antes/depois + consolidado multi-CNPJ | NCOPSII | Prova eficácia longitudinal | **C** | Só pós-instrumento aprovado e dados reais liberados (G3+) | No real data | Adiar |
| Copiloto como decisor de risco / emissor de laudo | NCOPSII (implícito) | — | **D** | — | IA não diagnostica/assina | Rejeitar |

`Risco residual:` toda linha marcada B depende de o instrumento sair do estado draft; sem isso, permanecem demonstrações sintéticas.

---

## 4. Filtro de conformidade — o que NÃO copiar

| Claim da referência | Por que viola | Versão conforme a adotar |
|---|---|---|
| "COPSOQ II validado e pronto para uso" | Seu registro é `0.1.0-draft`, fonte não verificada | "Instrumento exploratório em rascunho; runtime bloqueado até fonte, licença e scoring aprovados" |
| "100% anônimo" | Constituição proíbe anonimato absoluto; exige k≥5 | "Agregação protegida por k-anonimato (mínimo 5); sem correlação identidade-resposta" |
| "Laudo aceito em auditoria fiscal" | Presume conformidade não provada | "Documento preliminar, insumo técnico; validade depende de revisão/assinatura competente" |
| SRQ-20, versões média/longa, item de ideação em runtime | Fluxos removidos/bloqueados (Ação 16) | Manter fora do runtime; se reintroduzir, tratar como MASTER com fluxo de cuidado e aprovação |
| Scoring autoral sob marca "COPSOQ" | Mistura marca com scoring não licenciado | Escolher trilha canônica única (COPSOQ III licenciado **ou** instrumento próprio não equivalente) |
| "Conformidade NR-1" como resultado do produto | Overclaim regulatório | "Apoio à gestão de riscos psicossociais do GRO/PGR; não substitui AEP/AET/CIPA/revisão técnica" |

`Risco residual:` o texto "Conformidade NR-1" aparece na UI (`NR1CopsoqPage.tsx`) mesmo com ressalva ao lado — recomendo trocar por "Prontidão para o GRO psicossocial" para eliminar ambiguidade.

---

## 5. Camada de diferenciação premium (Ciência da Felicidade)

Reposicionar de "risco/dashboard" para **florescimento com evidência**, sem individualizar o risco nem prometer felicidade:

- **PERMA+V como leitura de proteção, não de risco:** cada dimensão em zona verde vira *fator de proteção* documentado (mecanismo → evidência), alimentando o status "Manter/Monitorar" — coerente com a Lei 14.831/2024 e ISO 45003.
- **Drivers já existentes (`driver-chat`) como copiloto educacional:** os 12 drivers (liderança, confiança, propósito, energia, reconhecimento...) operam como facilitadores de reflexão e organização de hipóteses — nunca decisores. Já há regra anti-alucinação no prompt; falta o RAG governado para citar fonte.
- **Economia comportamental sem coerção:** nudges para participação voluntária e devolutiva, com limites explícitos, canal de cuidado separado e zero gamificação que pressione resposta (a UX neutra já é um entregável concluído).
- **FIB / bem-comum como métrica de resultado coletivo:** indicadores agregados de florescimento por unidade, sempre sob k≥5, para medir o ambiente que protege — não a pessoa.

`Risco residual:` diferenciação de felicidade só é defensável se nunca cruzar a linha do diagnóstico individual nem sugerir causalidade; manter como promoção coletiva.

---

## 6. Roadmap por ondas com gates de aceite

- **Onda 0 — Integridade de release:** ✔ majoritariamente feita (npm único, Recharts 2, CI, budget). Gate: `npm run ci` verde no mesmo commit + prova de execução no GitHub oficial.
- **Onda 1 — CI e qualidade contínua:** consolidar execução remota do job `database-security`, branch protection efetiva, E2E browser (Playwright) das jornadas empresa→ciclo→risco→documento. Gate: pipeline reproduzível com evidência arquivada.
- **Onda 2 — Fechamento metodológico:** trilha canônica única de instrumento, licença, scoring server-side, fixtures independentes, revisão SST/ergonomia/metodologia. Gate: `campaignEligibility` retornando `allowed:true` para versão aprovada.
- **Onda 3 — Piloto assistido:** DPA, base legal, aviso de privacidade, retenção, plano de incidentes, CIPA. Gate: dados reais só em organização parceira com governança formal ativa.
- **Onda 4 — Operação SaaS:** observabilidade, alertas, SLO, backups testados, runbooks, suporte. Gate: operação repetível e auditável.
- **Onda 5 — Diferenciação defensável:** RAG governado (Source Registry → chunks citáveis → source_id + eval), benchmark consentido, integrações RH/SST. Gate: valor recorrente além da coleta.

`Risco residual:` Ondas 2 e 4 são as travas reais de receita recorrente; sem elas, o produto vende descoberta, não SaaS pleno.

---

## 7. Definition of Done (liberar dados reais) e proposta comercial

**DoD — todas simultâneas:** release reproduzível + CI verde comprovado no GitHub; RLS/RPCs testadas em homologação real; instrumento aprovado/licenciado/versionado; scoring server-side validado; DPA e definição controlador/operador; aviso de privacidade e base legal revisados; política de retenção/descarte/incidentes aprovada; plano de suporte para situações sensíveis; E2E completo; pentest/revisão independente; auditoria de IA e fontes; aceite formal de SST, DPO/jurídico e produto.

**Proposta comercial ideal (uma frase):** *Plataforma operacional que transforma sinais coletivos de riscos psicossociais em contexto de trabalho, planos de ação, controles, evidências e ciclos de melhoria — com privacidade por design, supervisão técnica e florescimento organizacional mensurável.*

---

## Assinatura do comitê

Comitê Interdisciplinar Master Plus (Prompt Engineering & IA · Psicometria/SST · Segurança & LGPD ·
UX/IX/Acessibilidade · Ciência de Dados · Direito Regulatório NR-1 · Ciência da Felicidade/PERMA+V ·
Estratégia SaaS B2B). Documento preliminar, sujeito a revisão técnica, metodológica, jurídica e a
aprovação formal de gate. Não libera dados reais nem avança gate.
