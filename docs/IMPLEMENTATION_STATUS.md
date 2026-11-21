# Estado de implementação do Plano Mestre

Data: 30/06/2026

## Gate

- G0: implementado no código; CI local verde.
- G1: em execução; **não aprovado**.
- Dados reais: **No-Go**.
- Campanhas: bloqueadas no servidor enquanto não houver versão de instrumento aprovada e pronta para runtime.

## Primeiras 24 ações

| # | Ação | Estado | Evidência/pendência |
|---:|---|---|---|
| 1 | Aprovar plano e responsáveis | Parcial | Pacote de aceite G1 preparado; accountables organizacionais ainda não nomeados |
| 2 | Bloquear dados reais | Implementado | Gate fail-closed `g0-2026-06-23` |
| 3 | Higiene de `.env` | Parcial | Ignorado e exemplo local criado; histórico indisponível no snapshot sem `.git` |
| 4 | Lockfile e CI | Parcial oficial / local verde | `npm ci` e script local audit/lint/typecheck/test/build/orçamento de bundle verdes; workflow GitHub e job PostgreSQL/Supabase exigem token com escopo `workflow` |
| 5 | Revogar leitura de `responses` | Implementado e testado localmente | Migração aplicada do zero; acesso direto negado na matriz pgTAP |
| 6 | Remover consultas frontend a `responses` | Implementado | Teste estático impede regressão |
| 7 | Restringir scores e histórico | Implementado e testado localmente | Service-only + RPCs de leitura segura aprovados no PostgreSQL |
| 8 | RPC segura de contagem/agregação | Implementado e testado localmente | Supressão e contagem final com `k` aprovadas no PostgreSQL |
| 9 | Eliminar correlação convite-resposta | Implementado e testado localmente | Hash removido; tokens show-once; ciclo monotônico e anti-differencing testados |
| 10 | Retenção, acesso e descarte | Draft aplicado e testado localmente | Matriz, dupla aprovação, hold e gates passaram; decisões legais continuam pendentes |
| 11 | Testes RLS/cross-tenant/differencing | Executado localmente | 56/56 asserções, carga máxima e replay concorrente aprovados; GitHub ainda não comprovado |
| 12 | Instrument Registry mínimo | Implementado e testado localmente | Schema, estados, ledger, hash e gates aprovados em 21/21 asserções |
| 13 | Versionar instrumento atual | Implementado como rascunho bloqueado | Registro honesto `0.1.0-draft`, fonte não verificada, licença desconhecida e runtime desabilitado |
| 14 | Modelar 26 subescalas e preservar scoring original | Pendente externo | Requer fonte, licença, população e especificação verificáveis |
| 15 | Fixtures e testes psicométricos independentes | Pendente externo | Nenhuma fixture de referência aprovada foi fornecida |
| 16 | Remover alegações e fluxos indisponíveis | Implementado | SRQ-20, formulários médio/longo, anonimato absoluto e validação não comprovada removidos/bloqueados |
| 17 | AEP, trabalho real, fontes, circunstâncias e grupos expostos | Draft aplicado e testado localmente | 33/33 asserções; requer validação SST/Ergonomia |
| 18 | Gatilhos e fluxo AET | Draft aplicado e testado localmente | 34/34 asserções; requer validação SST/Ergonomia |
| 19 | Criteria Engine contextual e versionado | Draft aplicado e testado localmente | 36/36 asserções; requer validação SST/Metodologia |
| 20 | Controles, eficácia e risco residual | Pré-fatia aplicada e testada localmente | Evidência/revisão de controles em UI e mecanismo puro; cálculo residual oficial segue bloqueado; ver `docs/CONTROL_EVIDENCE_REVIEW_G1.md` |
| 21 | Sincronizar Playbook 2.0 | Gate de fontes aplicado localmente | Sincronização segue bloqueada até fonte canônica, hash, licença, revisão técnica e claims aprovados; ver `docs/MASTER_PLUS_SPRINT_EXECUTION.md` |
| 22 | Ação → KPI → evidência → revisão | Draft aplicado e testado localmente | Mecanismo puro + UI/checklist documental; sem migration, sem enforcement server-side; ver `docs/ACTION_EVIDENCE_REVIEW_G1.md` |
| 23 | Testes regulatórios E2E | Contrato sintético aplicado localmente | Avaliador puro + configuração versionada + UI de Governança cobrem a jornada empresa→governança sem dados reais; browser E2E e GitHub ainda não executados; ver `docs/REGULATORY_E2E_JOURNEY_G1.md` |
| 24 | Submeter G2 ao comitê | Prontidão bloqueante aplicada localmente | Contrato de submissão G2 mostra bloqueios formais: G1, accountables, fontes, fixtures, revisões, GitHub/Lovable, CIPA, LGPD e incidente; ver `docs/G2_COMMITTEE_SUBMISSION_READINESS.md` |

## Entregáveis adicionais já concluídos

- UX de resposta neutra: sem gamificação; limites, voluntariedade e canal de cuidado separados.
- Gate metodológico de campanha: abertura, convite, score e histórico falham fechados no banco.
- Instrument Registry: 21 asserções pgTAP e testes TypeScript de domínio/contrato.
- Criteria Engine: mecanismo puro, configuração draft, governança server-side, 36 asserções pgTAP e bloqueio explícito do cálculo legado.
- Pacote formal de G1: responsáveis, decisões bloqueantes, evidências e regra de aceite sem presumir assinaturas.
- Tipos Supabase: regenerados do schema local aplicado, com typecheck e build verdes.
- Recuperação lógica: cadeia sintética descartada e restaurada com hash idêntico e adulteração detectada.
- Runtime G0 revalidado: destinos remotos e `VITE_DATA_MODE=real` falham antes de qualquer chamada de rede.
- Baseline React: módulos compatíveis com Fast Refresh, efeitos com dependências estáveis e lint sem avisos.
- Frontend sob demanda: rotas carregadas por `React.lazy`, dependências particionadas por capacidade e fallback acessível durante navegação.
- Toolchain atualizado: Vite 8.1.0, Vitest 4.1.9 e plugin React compatível; auditoria npm sem vulnerabilidades conhecidas.
- Mídia responsiva: avatar da assistente reduzido de 1,43 MB para 9,95 kB em WebP 256×256, com dimensões intrínsecas declaradas.
- Segurança do copiloto G1: seis Edge Functions passam por boundary compartilhado com CORS restrito, autenticação, schemas, payload limit e quota; ver `docs/AI_COPILOT_SECURITY_G1.md`.
- Retenção local Aurora/EstratégIA: histórico em `localStorage` agora usa política versionada, TTL de 7 dias, máximo de 20 interações, limpeza manual e testes de descarte.
- Anti-overclaim do copiloto: `driver-dynamic` não apresenta texto estático como RAG, base oficial ou validação contra Playbook; teste estático impede regressão.
- Economia de tokens Fable 5: `docs/PROJECT_CONSTITUTION.md`, `docs/FABLE5_TOKEN_ECONOMY.md` e `AGENTS.md` integram roteador ToT `LITE/SPRINT/MASTER`; skill global `fable5-token-router` criada e validada em `~/.codex/skills`.
- Ação/KPI/evidência/revisão G1: avaliador puro em `src/lib/actions/actionGovernance.ts`, bloqueio de conclusão superficial em ações, prontidão documental qualificada e evidência em `docs/ACTION_EVIDENCE_REVIEW_G1.md`.
- Controles/evidência/revisão G1: avaliador puro em `src/lib/controls/controlEvidence.ts`, notas/status provisórios em controles, bloqueio de conclusão superficial e prontidão documental qualificada em `docs/CONTROL_EVIDENCE_REVIEW_G1.md`.
- Cockpit de prontidão G1: critérios versionados em `src/data/g1ReadinessCriteria.ts`, avaliador puro em `src/lib/governance/gateReadiness.ts` e dashboard com bloqueios operacionais/formais; ver `docs/G1_READINESS_COCKPIT.md`.
- Gate de fontes Playbook 2.0: avaliador puro em `src/lib/content/sourceReadiness.ts`, política em `src/data/playbookSourceReadiness.ts` e Biblioteca rotulada como curadoria até aprovação; ver `docs/MASTER_PLUS_SPRINT_EXECUTION.md`.
- Jornada regulatória E2E sintética: contrato versionado em `src/data/regulatoryJourney.ts`, avaliador puro em `src/lib/governance/regulatoryJourney.ts` e Governança exibindo prontidão local sem liberar G1; ver `docs/REGULATORY_E2E_JOURNEY_G1.md`.
- Handoff GitHub/Lovable: contrato de atestação pontual no módulo compatível `src/lib/release/syncReadiness.ts`, evidência derivada em `src/data/releaseSyncReadiness.ts` e Governança exibindo bloqueios da revisão; o receipt comprova o baseline observado, não o `HEAD` atual nem sincronização contínua; ver `docs/GITHUB_LOVABLE_SYNC_HANDOFF.md`.
- Submissão G2 ao comitê: contrato bloqueante em `src/lib/governance/committeeSubmission.ts`, evidência local em `src/data/g2CommitteeSubmission.ts` e Governança expondo por que Action 24 ainda não pode avançar; ver `docs/G2_COMMITTEE_SUBMISSION_READINESS.md`.
- Dossiê de evidências G1: política versionada em `src/data/g1EvidenceDossier.ts`, avaliador puro em `src/lib/governance/evidenceDossier.ts` e Governança consolidando prontidão técnica/formal; ver `docs/G1_EVIDENCE_DOSSIER.md`.
- Ledger de aceite formal G1: política versionada em `src/data/g1FormalAcceptance.ts`, avaliador puro em `src/lib/governance/formalAcceptance.ts` e Governança expondo responsáveis, autoridade, substitutos, decisões e ressalvas pendentes; ver `docs/G1_FORMAL_ACCEPTANCE_LEDGER.md`.
- Intake canônico do instrumento: política versionada em `src/data/g1CanonicalInstrumentIntake.ts`, avaliador puro em `src/lib/instruments/canonicalIntake.ts` e módulo de instrumento exigindo fonte, licença, itens, 26 subescalas, scoring, fixtures, hash e owner antes de revisão; ver `docs/CANONICAL_INSTRUMENT_INTAKE_G1.md`.
- Manifesto canonico do pacote G1: politica versionada em `src/data/g1CanonicalPackageManifest.ts`, avaliador puro em `src/lib/instruments/canonicalPackageManifest.ts` e modulo de instrumento exigindo manifesto, versao, hashes, owners, dependencias validas e aprovacao dos artefatos antes de selagem; ver `docs/CANONICAL_PACKAGE_MANIFEST_G1.md`.
- Prontidão metodológica do instrumento: política versionada em `src/data/instrumentMethodologyReadiness.ts`, avaliador puro em `src/lib/instruments/methodologyReadiness.ts` e módulo de instrumento exibindo bloqueios de fonte/licença/scoring/fixtures; ver `docs/INSTRUMENT_METHODOLOGY_READINESS_G1.md`.
- Maturidade SaaS Fable 5: política versionada em `src/data/saasMaturityAssessment.ts`, avaliador puro em `src/lib/governance/saasMaturity.ts` e Governança separando fundação, MVP sintético, piloto, SaaS real e escala; ver `docs/SAAS_MATURITY_ASSESSMENT.md`.
- Ensaio sintético de incidente e recuperação G1: cockpit em memória, cinco fases monotônicas e bloqueios explícitos para dados reais, persistência, rede e valor formal; a maturidade operacional avança somente para `partial`; ver `docs/INCIDENT_RECOVERY_REHEARSAL_G1.md`.
- Ensaio de demo sintética G1: política versionada em `src/data/g1DemoRehearsal.ts`, avaliador puro em `src/lib/governance/demoRehearsal.ts` e Governança distinguindo ensaio interno pronto de demo externa bloqueada; ver `docs/G1_SYNTHETIC_DEMO_REHEARSAL.md`.
- Guardrail de claims públicos G1: teste estático em `src/test/publicClaimsGuardrail.test.ts` bloqueia promessas de conformidade garantida/total/contínua, validação indevida, chancela institucional, causalidade, anonimato absoluto, dados reais, G1 aprovado e SaaS real pronto; copy pública ajustada; ver `docs/PUBLIC_CLAIMS_GUARDRAIL_G1.md`.
- Prontidão de demo pública G1: política versionada em `src/data/g1PublicDemoReadiness.ts`, avaliador puro em `src/lib/governance/publicDemoReadiness.ts` e Governança separando walkthrough privado sintético de demo pública externa; ver `docs/G1_PUBLIC_DEMO_READINESS.md`.
- Registro de riscos residuais G1: política versionada em `src/data/g1ResidualRiskRegister.ts`, avaliador puro em `src/lib/governance/residualRiskRegister.ts` e Governança consolidando severidade, dono, evidência, mitigação e próximo risco bloqueante; ver `docs/G1_RESIDUAL_RISK_REGISTER.md`.
- Oferta Design Partner NR-1 G1: política versionada em `src/data/g1DesignPartnerOffer.ts`, avaliador puro em `src/lib/commercial/designPartnerOffer.ts` e página comercial reposicionada para descoberta/piloto assistido sem vender SaaS enterprise, billing, API/HRIS/SSO/SLA ou dados reais como prontos; ver `docs/DESIGN_PARTNER_OFFER_G1.md`.
- Governanca de intake comercial G1: politica versionada em `src/data/g1LeadIntakeGovernance.ts`, avaliador puro em `src/lib/commercial/leadIntakeGovernance.ts` e formulario comercial usando fila local com retencao de 30 dias; CRM remoto/DPA e piloto pago seguem bloqueados; ver `docs/LEAD_INTAKE_GOVERNANCE_G1.md`.
- Guard de runtime Lovable/Supabase: `src/lib/runtime/supabaseConfig.ts` evita tela branca quando `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` faltam no deploy; auth fica indisponivel e fail-closed ate configuracao formal; ver `docs/LOVABLE_DEPLOYMENT_RUNTIME_GUARD.md`.

## Épicos planejados, sem autorização de runtime

- **Copiloto Supervisionado por Evidências:** avaliação Fable 5 e estratégia de integração registradas em `docs/SUPERVISED_COPILOT_FABLE5_PLAN.md`.
- Decisão vigente: incorporar como programa transversal subordinado aos gates atuais; não criar um gate retroativo nem ativar RAG, modelo externo ou dados reais.
- Primeira fatia proposta: resposta sintética e auditável para ciclo abaixo de `k=5`, com modos Decidir/Entender/Auditar.
- Bloqueadores remanescentes: fontes aprovadas, threat model/ADR independente, evals, aprovações formais e autorização explícita de runtime. Hardening uniforme das Edge Functions e retenção local verificável foram implementados.

## Validação local

- ESLint: zero erros e zero avisos.
- TypeScript: sem erros.
- Vitest: 215 testes aprovados.
- Build de produção: aprovado em Vite 8.1.0; entrada JavaScript de 141,02 kB.
- Orçamento de build: teto automatizado de 500 kB por chunk JavaScript e por imagem emitida.
- Dependências npm: `npm audit --audit-level=low` com zero vulnerabilidades após instalação limpa.
- Banco: migrações aplicadas do zero, lint sem erros e 206/206 asserções pgTAP aprovadas em Supabase local.

## Dívidas técnicas visíveis

- `strict: false` e `any` legado; migração gradual por fatia;
- repositório oficial reconciliado em `minhafelicidadebr/playbook-nr1-chagpt-sol`; baseline `4a21c1c...` integrado em `main`, publicado no Lovable e atestado pontualmente com receipt versionado, sem representar o `HEAD` documental atual;
- GitHub Actions pós-merge comprovado para aplicação, banco e browsers; branch protection nativa continua indisponível para comprovação pela limitação de plano/API;
- tipos Supabase regenerados localmente; a geração deve ser repetida e revisada no commit oficial aprovado;
- renderer ainda usa snapshot legado internamente, porém está inacessível até uma versão aprovada ser publicada.

G1 só pode fechar após banco novo + migrações + pgTAP verdes, pacote metodológico verificável, revisão independente e aprovações organizacionais. Até lá, dados reais e campanhas permanecem proibidos.
