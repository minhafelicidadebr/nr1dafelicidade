# NEXO — Inteligência de Drivers

Data: 2026-07-01
Gate: G0/G1 local e sintético
Status: fatia demonstrável server-side, com persistência auditável G1, sem dados reais e sem avanço de gate

## Decisão

| Decisão | Alternativas | Escolha | Justificativa | Risco | Critério de aceite |
|---|---|---|---|---|---|
| Introduzir NEXO como ponte mensuração -> drivers -> ação | A. card estático; B. dashboard dinâmico; C. fluxo NEXO completo; D. dashboard separado; E. motor configurável; F. IA EstratégIA | C + E, com fronteira Edge Function | Entrega valor operacional, mantém mecanismo configurável e não mistura regra de domínio em React | Parecer mais maduro do que o gate permite | UI mostra limites, disclaimer, versões e não promete causalidade, conformidade ou melhoria garantida |
| Calcular recomendação oficial fora do navegador | RPC/tabelas novas; Edge Function; cálculo local; adiar | RPC `generate_driver_recommendations` atrás da Edge Function `nexo-driver-recommendations` | Remove a recomendação oficial do React e centraliza validação de ciclo, escopo, tenant, k e snapshot | Pode gerar múltiplas execuções se o dashboard for aberto repetidamente | Cada execução gera run auditável com hash e blockers |
| Persistir execuções e evidências | Criar tabelas agora; registrar só no log existente; adiar | Criar `driver_recommendation_*` service-only | Histórico fica rastreável por matriz, algoritmo, instrumento, privacidade e evidências agregadas | Ainda falta pgTAP executado contra banco local nesta rodada | Migration tem contrato estático e CI local verde |
| Usar IA EstratégIA | IA como fonte; IA como explicadora; sem IA | IA apenas orientativa | A recomendação vem do motor determinístico; IA não diagnostica nem afirma conformidade | Usuário interpretar IA como laudo | Prompt de sistema reforçado com limites e validação humana |

## Escopo Implementado

Arquivos criados:

- `src/lib/nexo/driverRecommendation.ts`
- `src/lib/nexo/driverRecommendation.test.ts`
- `src/data/nexoDriverMatrix.ts`
- `src/components/app/nexo/NexoDriverIntelligenceCard.tsx`
- `src/lib/api/nexo.ts`
- `src/test/nexoServerBoundary.test.ts`
- `supabase/functions/nexo-driver-recommendations/index.ts`
- `supabase/migrations/20260701143000_nexo_driver_recommendations_g1.sql`
- `supabase/tests/nexo_driver_recommendations_contract.sql`
- `docs/NEXO_DRIVER_INTELLIGENCE_G1.md`

Arquivos alterados:

- `src/pages/app/DashboardPage.tsx`
- `src/pages/app/RiskPage.tsx`
- `src/pages/DriverWorldPage.tsx`
- `src/pages/app/ActionsPage.tsx`
- `src/pages/app/DocumentsPage.tsx`
- `supabase/functions/_shared/schemas.ts`
- `supabase/functions/estrategia-chat/index.ts`

Migrations criadas: `20260701143000_nexo_driver_recommendations_g1.sql`.
RPCs criadas: `generate_driver_recommendations`, `list_driver_recommendation_runs`.
Policies revisadas: novas tabelas NEXO ficam service-only com RLS habilitado; acesso autenticado ocorre apenas pelas RPCs `SECURITY DEFINER`.

## Matriz

Nome oficial: Matriz de Alinhamento Operacional COPSOQ -> Drivers do Playbook.

Versão inicial: `nexo-operational-alignment-v0.1.0-2026-07-01`
Algoritmo: `nexo-priority-v0.1.0`
Tipo de associação inicial: `operational_alignment`
Cobertura mínima: `0.60`

Drivers configurados:

- `management`
- `trust`
- `stress`
- `support`
- `energy`
- `inclusion_belonging`
- `compensation`
- `flexibility`
- `learning`
- `purpose`
- `appreciation`
- `achievement`

## Fórmula

Entrada permitida: resultados agregados retornados por `list_safe_risk_scores`, com campanha fechada, k-anonimato atendido e `criteria_version`. A RPC NEXO também consulta `get_cycle_privacy_summary` para registrar bloqueios de k quando aplicável.

Para cada driver:

```text
weighted_need = soma(weight * need_score) / soma(weight disponivel)
coverage = soma(weight disponivel) / soma(weight total)
criticality = percentual ponderado de dimensoes em risco critico
priority_score = 0.55 weighted_need + 0.20 criticality + 0.15 trend + 0.10 control_gap
```

Quando tendência ou lacuna de controle não existem, os pesos são redistribuídos proporcionalmente. Ausência não é preenchida com valor inventado.

## Elegibilidade

O NEXO bloqueia recomendação quando:

- escopo não autorizado;
- campanha não encerrada;
- grupo abaixo de k;
- instrumento legado;
- instrumento não comparável;
- snapshot/versão técnica ausente;
- cálculo não server-side;
- score sem validação;
- cobertura inferior a 60%;
- não há agregados seguros.

Disclaimer obrigatório exibido:

> Esta recomendação é orientativa e foi gerada a partir de resultados agregados, da matriz de alinhamento do Playbook e de regras configuradas. Ela não estabelece causalidade individual, não substitui avaliação técnica e deve ser contextualizada pela organização e pelo responsável técnico.

## Fluxo Integrado

Dashboard e Riscos:

- seção “Da Mensuração à Transformação”;
- card “Driver Prioritário Agora”;
- cards secundários sem ranking competitivo;
- jornada coletiva Mensurar -> Compreender -> Priorizar -> Transformar -> Comprovar -> Reavaliar.

Educar:

- `/drivers/:slug?source=nexo&cycle_id=...&scope_id=...`;
- camada contextual com microcopy de agregados e contexto organizacional.

Transformar:

- `/app/actions?source=nexo&driver_key=...&cycle_id=...&scope_id=...`;
- rascunho pré-preenchido para revisão técnica;
- perguntas antes de criar ação.

Relatar:

- `/app/documents?source=nexo&driver_key=...&cycle_id=...&scope_id=...`;
- narrativa marcada como rascunho técnico para revisão;
- sem texto de conformidade automática.

IA EstratégIA:

- prompt reforçado para atuar apenas como copiloto orientativo;
- não é fonte oficial da recomendação.

## Riscos Remanescentes

- Contrato pgTAP foi criado, mas a CLI Supabase não estava disponível neste ambiente para executá-lo contra banco local.
- Tendência longitudinal e lacuna de controle permanecem indisponíveis até regras comparáveis e controles eficazes versionados.
- A matriz inicial é operacional e deve ser revisada por especialistas antes de piloto assistido.
- Validação visual mobile/leitor de tela precisa ser executada em ambiente de QA.

## Checklist de Rollout

- Build, lint, typecheck e testes unitários verdes.
- Edge Function implantada no ambiente permitido.
- `VITE_DATA_MODE` mantido sintético/local enquanto G1 não for aprovado.
- Nenhum dado real, trabalhador real ou campanha real.
- Revisão técnica da matriz e pesos.
- Revisão jurídica/DPO antes de persistência auditável e piloto.
- Executar `supabase/tests/nexo_driver_recommendations_contract.sql` antes de piloto assistido ou dados reais.

## Veredito

Veredito desta fatia: APTO PARA DEMO local/sintética se a suíte local permanecer verde.
Não está apto para piloto B2B assistido, venda restrita, dados reais ou avanço de gate.
