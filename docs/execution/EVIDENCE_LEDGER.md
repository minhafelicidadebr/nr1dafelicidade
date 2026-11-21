# Evidence Ledger — Onda 0

## Escopo da evidência

Esta onda prova somente o contrato local de autorização comercial do Readiness & Governance Sprint. Não prova cobrança, contrato executável, entrega remota, conformidade, operação SaaS, dados reais ou avanço de gate.

## Evidências planejadas

| ID | Evidência | Estado | Referência |
| --- | --- | --- | --- |
| E-001 | Estado canônico expõe escopo, venda bloqueada/autorizada e CTA paga | Passou | `src/data/commercialAuthorization.ts` |
| E-002 | Avaliador bloqueia preço, owner, termos ou capacidade ausentes | Passou | `src/lib/commercial/commercialAuthorization.test.ts` |
| E-003 | Card e plano usam a fonte canônica | Passou | `src/components/sales/ReadinessGovernanceSprintCard.tsx`, `src/pages/SalesPage.tsx` |
| E-004 | Guardrail público preserva exclusões e ausência de overclaim | Passou | `src/test/publicClaimsGuardrail.test.ts` |
| E-005 | Lint, typecheck, testes direcionados e build | Passou | `npm run lint`, `npm run typecheck`, `npm run test:repro`, `npm run build` |
| E-006 | Rótulo de CTA paga ausente enquanto autorização estiver incompleta | Passou | `src/lib/commercial/commercialAuthorization.test.ts`, `src/data/commercialAuthorization.ts` |
| E-007 | Workspace interno separa pacote upstream de estado canônico de venda | Passou | `src/components/governance/PaidAdvisoryAuthorizationCard.test.tsx`, `src/pages/app/ExternalReadinessWorkspacePage.test.tsx` |
| E-008 | Ensaio interno usa autorização canônica para venda | Passou | `src/components/governance/PaidAdvisoryLaunchRehearsalCard.test.tsx` |
| E-009 | Workspace interno exibe os bloqueios canônicos da venda | Passou | `src/components/governance/PaidAdvisoryAuthorizationCard.tsx`, `src/components/governance/PaidAdvisoryAuthorizationCard.test.tsx` |
| E-010 | Contexto estático do ensaio não deriva autorização de venda fora da fonte canônica | Passou | `src/data/g1PaidAdvisoryLaunchRehearsal.ts`, `src/lib/commercial/paidAdvisoryLaunchRehearsal.test.ts` |
| E-011 | Guardrail público rejeita drift para autorização upstream | Passou | `src/test/publicClaimsGuardrail.test.ts` |
| E-012 | Próximo gate institucional possui template explícito sem autorização implícita | Passou | `docs/execution/INSTITUTIONAL_AUTHORIZATION_INPUT.md`, `docs/execution/WAVE_PLAN.md` |
| E-013 | Gate de saída da Onda 0 permanece fechado sem decisões institucionais | Pendente/No-Go | `docs/execution/WAVE_PLAN.md`, `src/data/commercialAuthorization.ts` |
| E-014 | Dados institucionais declarados são separados de evidência formal | Passou | `docs/execution/INSTITUTIONAL_AUTHORIZATION_INPUT.md`, `docs/execution/CURRENT_STATE.md` |
| E-015 | Papéis, substitutos e hipóteses de preço foram documentados sem habilitar venda | Passou | `docs/execution/PROPOSED_ROLES_AND_PRICING.md` |
| E-016 | Atribuição operacional confirmada e Core/BRL registrados como hipótese sem habilitar venda | Passou | `src/data/commercialAuthorization.ts`, `docs/execution/PROPOSED_ROLES_AND_PRICING.md`, `docs/execution/DECISIONS_LEDGER.md` |
| E-017 | Suíte completa após registrar a atribuição operacional continua verde | Passou | `npm run test:repro` — 96 arquivos, 485 testes |
| E-018 | Invariantes impedem que a atribuição operacional seja confundida com preço aprovado | Passou | `src/lib/commercial/commercialAuthorization.test.ts` |
| E-019 | Minuta comercial não contradiz mais a atribuição operacional e mantém aprovações pendentes | Passou | `docs/READINESS_GOVERNANCE_SPRINT_TERMS_DRAFT.md`, `docs/execution/DECISIONS_LEDGER.md` |
| E-020 | Mercado Pago é registrado sem confundir assinatura sandbox existente com checkout Core de pagamento único | Passou | `docs/execution/INSTITUTIONAL_AUTHORIZATION_INPUT.md`, `docs/execution/CURRENT_STATE.md`, `docs/execution/DECISIONS_LEDGER.md`, documentação oficial do [Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/overview) e de [Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/overview) |

## Limitações

- O estado comercial real continua não autorizado.
- Nenhuma integração externa é exercitada.
- Aprovação jurídica, comercial, financeira e operacional não é criada por código.
- O build mantém apenas um aviso preexistente de chunks grandes; `check:bundle` passou dentro do orçamento.

## E-021 — Release pós-merge confirmado

| ID | Evidência | Estado | Referência |
| --- | --- | --- | --- |
| E-021 | PR #33 integrou a correção React 19 / React Router 8 após CI verde | Passou | [PR #33](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/33), merge `6d8b024` |
| E-022 | PR #32 foi integrado na `main` após `verify`, `database-security` e `browser-quality` verdes | Passou | [PR #32](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/32), SHA `eee91f6` |
| E-023 | CI pós-merge da `main` confirmou o release técnico | Passou | [GitHub Actions](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30372136655) |
| E-024 | O release não habilitou venda, checkout, cobrança live ou dados reais | Passou | `docs/execution/CURRENT_STATE.md`, `src/data/commercialAuthorization.ts` |
| E-025 | Pacote de decisão pré-preenchido mantém preço sugerido, papéis e modalidade como pendentes | Passou | `docs/execution/INSTITUTIONAL_DECISION_PACKET_DRAFT.md` |
| E-026 | Revisão em 2026-07-30 confirma ausência de drift remoto e manutenção de `sale_blocked` | Passou | `main` em `eee91f6`, `src/data/commercialAuthorization.ts`, `src/lib/commercial/commercialAuthorization.test.ts` |

## E-027 — Release técnico pós-merge confirmado

| ID | Evidência | Estado | Referência |
| --- | --- | --- | --- |
| E-027 | PR #35 integrou o transporte Supabase pelo `dataGate` e o contrato de release npm após CI verde | Passou | [PR #35](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/35), `main` em `34c8859`, `src/integrations/supabase/client.ts`, `src/test/supabaseClientRuntimeConfig.test.ts` |
| E-028 | Workflow do PR #35 passou com auditoria de escopo e verificações de release | Passou | [GitHub Actions run 30678712507](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30678712507), `package.json`, `scripts/audit-release-scope.mjs`, `docs/release/G1_PR_SCOPE_MANIFEST.json` |
| E-029 | Lockfiles removidos continuam cobertos por allowlist explícita e o contrato canônico usa npm 11.9.0 | Passou | `docs/release/G1_PR_SCOPE_MANIFEST.json`, `package.json`, `package-lock.json` |
| E-030 | Fechamento técnico não promoveu o gate comercial | Passou | `docs/execution/CURRENT_STATE.md`, `src/data/commercialAuthorization.ts`, `src/lib/commercial/commercialAuthorization.test.ts` |

## E-031 — Drift automático do Lovable detectado e bloqueado

| ID | Evidência | Estado | Referência |
| --- | --- | --- | --- |
| E-031 | A ação automática de segurança do Lovable criou commits diretos na `main` fora de PR | Passou | `e3a9ea4`, `3c88f63`, `e668b1c`, `22b6170` |
| E-032 | O drift reintroduziu `bun.lock` e quebrou o contrato de release npm | Passou | [CI run 30699707536](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30699707536), `package.json`, `scripts/check-release-integrity.mjs` |
| E-033 | A migration automática revogou grants necessários e falhou nos contratos pgTAP | Passou | `supabase/migrations/20260801122600_43823e51-2f96-4aaa-abe8-3bf0f816e7a6.sql`, logs do job `database-security` no run 30699707536 |
| E-034 | O drift foi removido por PR isolado e o CI pós-merge voltou a verde | Passou | [PR #37](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/37), `main` em `40672ba`, [CI run 30702451679](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30702451679) |
| E-035 | Nenhuma migration foi executada por este fluxo de recuperação | Passou | `docs/execution/CURRENT_STATE.md`, PR #37, ausência de comando de deploy/migration remoto |

## E-036 — Handoff institucional conferível

| ID | Evidência | Estado | Referência |
| --- | --- | --- | --- |
| E-036 | Pacote possui ID, versão, decisões enumeradas, aprovadores mínimos, referências de evidência e sequência de handoff | Passou | `docs/execution/INSTITUTIONAL_DECISION_PACKET_DRAFT.md`, D-018 |
| E-037 | Rascunho proíbe anexar documentos sensíveis ao Git e diferencia submissão técnica de autorização de venda | Passou | `docs/execution/INSTITUTIONAL_DECISION_PACKET_DRAFT.md` |
| E-038 | Preparação do handoff não altera preço canônico, CTA, billing, entrega remota ou dados reais | Passou | `src/data/commercialAuthorization.ts`, `docs/execution/CURRENT_STATE.md` |
| E-039 | Gate institucional continua `NO-GO` e Onda 1 permanece não autorizada | Pendente/No-Go | `docs/execution/INSTITUTIONAL_DECISION_PACKET_DRAFT.md`, `docs/execution/WAVE_PLAN.md` |

## E-040 — Superfície pública fail-closed

| ID | Evidência | Estado | Referência |
| --- | --- | --- | --- |
| E-040 | Cadastro SST, gestor e login consultam disponibilidade do runtime antes de qualquer mutação | Passou | `src/lib/signup.ts`, `src/pages/signup/SignupSstPage.tsx`, `src/pages/signup/SignupManagerPage.tsx`, `src/pages/AuthPage.tsx` |
| E-041 | Interface informa que nenhuma conta ou organização será criada no preview sintético | Passou | `src/components/signup/SignupShell.tsx`, `src/test/publicClaimsGuardrail.test.ts` |
| E-042 | Chave Supabase `sb_secret_` é rejeitada na configuração do navegador | Passou | `src/lib/runtime/supabaseConfig.ts`, `src/lib/runtime/supabaseConfig.test.ts`, `src/test/supabaseClientRuntimeConfig.test.ts` |
| E-043 | Hardening não habilita Supabase remoto, dados reais, billing ou avanço de gate | Passou | `src/data/runtimePolicy.ts`, `docs/LOVABLE_DEPLOYMENT_RUNTIME_GUARD.md`, D-019 |

## E-044 — Fluxos públicos de pesquisa falham fechado

| ID | Evidência | Estado | Referência |
| --- | --- | --- |
| E-044 | Lookup de convite e validação de resposta consultam disponibilidade do runtime antes de qualquer RPC e exibem bloqueio específico de pesquisa | Passou | `src/pages/signup/SignupCollaboratorPage.tsx`, `src/pages/RespondPage.tsx`, `src/components/signup/SignupShell.tsx`, `src/test/supabaseClientRuntimeConfig.test.ts` |
| E-045 | A fatia não altera banco, RLS, dados reais, backend remoto ou avanço de gate | Passou | `src/lib/runtime/dataGate.ts`, `src/data/runtimePolicy.ts`, D-020 |

## E-046 — PR #43 fechado com CI pós-merge verde

| ID | Evidência | Estado | Referência |
| --- | --- | --- |
| E-046 | O hardening público, o núcleo puro de ações e as correções de dependências foram integrados na `main` por PR revisado | Passou | [PR #43](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/43), SHA `6d4e595f2ece3e702c5b2429439dcb72d8b22cf5` |
| E-047 | O CI pós-merge confirmou `verify`, `database-security` e `browser-quality` sem promover o gate | Passou | [GitHub Actions run 31520496658](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/31520496658), D-021 |
| E-048 | O núcleo de execução permanece um mecanismo puro local, sem persistência, RPC/RLS, dados reais ou autorização de segurança | Passou | `docs/execution/NR1_MVP_WAVE1_PURE_CORE_EVIDENCE.md`, `src/lib/actions/actionExecutionCore.ts` |

## E-049 — Contrato sintético command-only para execução de ações

| ID | Evidência | Estado | Referência |
| --- | --- | --- |
| E-049 | Payload não escolhe tenant, ator ou revisor; o contexto deriva essas autoridades | Passou | `src/lib/actions/actionCommandContract.ts`, `src/lib/actions/actionCommandContract.test.ts` |
| E-050 | Membership e papel bloqueiam colaborador e cross-tenant sem mutar o snapshot | Passou | `src/lib/actions/actionCommandContract.test.ts`, `docs/execution/NR1_MVP_RPC_RLS_CONTRACT_G0.md` |
| E-051 | `expectedVersion` rejeita concorrência obsoleta e `commandId` evita replay/dupla transição | Passou | `src/lib/actions/actionCommandContract.test.ts` |
| E-052 | Revisor é derivado do ator autenticado e o núcleo mantém independência para alta/crítica prioridade | Passou | `src/lib/actions/actionCommandContract.ts`, `src/lib/actions/actionExecutionCore.ts` |
| E-053 | Saída coletiva permanece separada e abaixo de `k=5` é ocultada; campo individual não atravessa o boundary | Passou | `src/lib/actions/actionCommandContract.test.ts`, `src/lib/privacy/outcomeRows.ts` |
| E-054 | A fatia não criou migration, RPC, RLS, grant, storage, chamada remota ou dado real | Passou | `docs/execution/NR1_MVP_RPC_RLS_CONTRACT_G0.md`, D-022 |

## E-055 — PR #46 integrado com CI pós-merge verde

| ID | Evidência | Estado | Referência |
| --- | --- | --- |
| E-055 | O contrato sintético command-only foi integrado na `main` por PR revisado | Passou | [PR #46](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/46), SHA `7570396172ccf8453d61b019fb1afd078322f78a` |
| E-056 | O CI pós-merge confirmou `verify`, `database-security` e `browser-quality` | Passou | [GitHub Actions run 31555525769](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/31555525769), D-023 |
| E-057 | A integração não promoveu G0/G1, não alterou `sale_blocked` e não habilitou schema ou dados reais | Passou | `docs/execution/CURRENT_STATE.md`, `docs/execution/NR1_MVP_RPC_RLS_CONTRACT_G0.md`, D-023 |
