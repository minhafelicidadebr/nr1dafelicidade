# Plano de Integração — Controles Implantados: divergência e supressão de sugestão

> Documento de planejamento. Fatia vertical MASTER. Não altera scoring, não libera dados reais,
> não avança gate. Rótulo de saída permanece preliminar até revisão técnica competente.
> Modo: MASTER — toca controles, risco residual, k-anonimato e documento auditável.

## 1. Objetivo

Trazer da referência (NCOPSII, tela "Controles Implantados") o padrão de valor
**risco bruto → controle declarado → risco residual**, entregando dois comportamentos ausentes:

- **A. Alerta de divergência de eficácia:** quando um controle está declarado como implantado para
  uma dimensão e essa dimensão continua em faixa alta/crítica no ciclo fechado, sinalizar
  "revisar eficácia" — sem alterar o escore.
- **B. Supressão de sugestão:** não sugerir, no Plano de Ação, controles que a organização já
  declarou e comprovou — o que a `suggest_controls_for_cycle` ainda não faz.

## 2. Estado atual verificado (não reinventar)

| Peça existente | Arquivo | O que já faz |
|---|---|---|
| Catálogo de controles + ligação à dimensão | `supabase/migrations/20260606041827_*.sql` (`control_catalog.dimension_key`) | 2 controles por dimensão COPSOQ, com `evidence_strength` e `level` |
| Controles adotados pela org | `org_controls` (migration `20260606032323_*.sql`) | `catalog_id`, `status`, `notes`; RLS por org (`is_org_manager`) |
| Avaliador de evidência de controle | `src/lib/controls/controlEvidence.ts` | Sinais implementação/manutenção/eficácia/revisão; `canInformResidualRiskReview`; `CONTROL_EVIDENCE_DISCLAIMER` (não reduz risco automaticamente) |
| UI de controles | `src/pages/app/ControlsPage.tsx` | Adotar, notas, status, painel de evidência por controle |
| Riscos seguros por ciclo | RPC `list_safe_risk_scores` (`privacy_vault_g1.sql`) | Só ciclo `closed`, só `n_responses >= k`, já suprime < k |
| Sugestão de controles | RPC `suggest_controls_for_cycle` | Cruza dimensões de risco × catálogo; **não exclui** controles já adotados |

`Conclusão:` a base de privacidade e evidência já existe. A integração é uma **camada de leitura
consultiva** sobre dados já seguros, mais um filtro na sugestão.

## 3. Decisão de arquitetura (ToT)

Onde calcular a divergência:

- **Ramo A — Avaliador puro no cliente** cruzando saídas já seguras (`list_safe_risk_scores`) com
  `org_controls`+`control_catalog.dimension_key`. Sem migration. Reversível. **← escolhido.**
- **Ramo B — Nova RPC `evaluate_control_divergence` (SECURITY DEFINER).** Mais auditável no
  servidor, porém adiciona superfície, migration e pgTAP. Adiar até haver enforcement server-side.
- **Ramo C — Aplicar redução residual ao escore.** **Rejeitado:** viola invariante (o escore
  reflete a percepção dos trabalhadores; controle não altera escore).

Critérios (0–5): valor 5 · aderência NR-1 5 · risco a invariante (invertido) A=5/B=4/C=0 ·
custo A=2/B=4. Ramo A vence.

`Guardrail-chave:` a divergência **nunca** recalcula risco. Ela apenas confronta um controle
declarado com o risco percebido remanescente e sugere revisão humana de eficácia — exatamente o
que a NR-1 (1.5.4.4.6 "c") e a ISO 45003 esperam.

## 4. Fatia vertical (mecanismo → tipos → wiring → estados → testes)

### 4.1 Mecanismo puro — novo arquivo `src/lib/controls/controlDivergence.ts`

Função pura, sem I/O, testável isoladamente:

```
type SafeRiskScore = { dimension: string; riskLevel: number; riskBand?: string; nResponses: number };
type DeclaredControl = {
  catalogId: string; dimensionKey: string | null; title: string;
  status: string; evidence: ControlEvidenceEvaluation; // reusa controlEvidence.ts
};
type DivergenceSeverity = "aligned" | "review_efficacy" | "unproven_control";
type ControlDivergence = {
  dimension: string; riskLevel: number; controlTitle: string;
  severity: DivergenceSeverity; reason: string;
};

evaluateControlDivergence(controls: DeclaredControl[], scores: SafeRiskScore[], opts: {
  highRiskBandMin: number;           // vem de criteriaPolicy, não hardcode
}): ControlDivergence[]
```

Regras:
- Só considera `scores` que chegaram (ou seja, já passaram por k≥5 e ciclo fechado na RPC).
- Para cada controle com `dimensionKey` que casa uma dimensão em faixa alta/crítica:
  - se `evidence.canInformResidualRiskReview === true` → `review_efficacy`
    ("controle comprovado, risco ainda alto — revisar eficácia/adesão").
  - se evidência insuficiente → `unproven_control`
    ("controle declarado sem evidência de eficácia; não sustenta redução").
- Dimensões sem controle declarado → não geram divergência (é lacuna de plano, tratada em Ações).
- `highRiskBandMin` derivado de `repositoryCriteriaDraft.riskBands` (`src/data/criteriaPolicy.ts`),
  nunca número mágico.

### 4.2 Supressão de sugestão (comportamento B)

Duas opções, começar pela leve:
- **B1 (agora):** filtrar client-side no `ActionsPage.tsx` o resultado de
  `suggest_controls_for_cycle`, removendo `catalog_id` presente em `org_controls` com evidência
  suficiente; exibir os removidos numa seção "Já contemplado pelos controles declarados".
- **B2 (depois, se virar contrato):** parâmetro opcional na RPC para excluir adotados no servidor,
  com pgTAP. Só quando o comportamento estabilizar.

### 4.3 Wiring de UI (sem novos endpoints)

- `ControlsPage.tsx`: novo painel "Divergências de eficácia" que carrega `list_safe_risk_scores`
  do ciclo fechado selecionado e roda `evaluateControlDivergence`. Badge âmbar por divergência,
  com o texto de revisão. Reusa `getDimensionLabel`.
- `DocumentsPage.tsx`: incluir a seção "Controles declarados × risco remanescente" no rascunho,
  com marca d'água preliminar (padrão `DISCLAIMER_PRELIMINAR` já usado).
- Nenhuma tela exibe contagem individual; tudo vem de agregados já suprimidos < k.

### 4.4 Estados de borda
- Nenhum ciclo fechado → painel mostra "Sem ciclo fechado com k≥5; divergência indisponível".
- Controle sem `dimensionKey` → não entra na divergência (evita falso positivo).
- Dimensão suprimida por k → simplesmente não aparece (herdado da RPC).

### 4.5 Testes
- `src/lib/controls/controlDivergence.test.ts` (Vitest): controle comprovado + risco alto →
  `review_efficacy`; controle sem evidência + risco alto → `unproven_control`; risco baixo →
  `aligned`/vazio; dimensão sem controle → vazio; banda vinda de `criteriaPolicy`.
- Teste estático garantindo que o cálculo **não importa** nem chama nada que grave escore.

## 5. Guardrails mapeados às invariantes

| Invariante (Constituição) | Como o plano respeita |
|---|---|
| Escore reflete percepção; IA/controle não altera risco | Divergência é consultiva; nenhum caminho recalcula escore |
| k ≥ 5 no servidor e em toda saída | Usa `list_safe_risk_scores` (já suprime < k, exige ciclo fechado) |
| Documentos preliminares até revisão | Seção sai com `DISCLAIMER_PRELIMINAR` |
| Fórmula/fonte/versão auditáveis | `highRiskBandMin` vem de `criteriaPolicy` versionada, não hardcode |
| Sem dado real antes do gate | Puramente sobre dados sintéticos/agregados; nenhuma mudança no `dataGate` |

## 6. Rollout e rollback
- **Rollout:** 1) mecanismo + testes; 2) filtro de sugestão no `ActionsPage`; 3) painel em
  `ControlsPage`; 4) seção no rascunho de documento. Cada passo com `npm run ci` verde.
- **Rollback:** como não há migration no Ramo A, reverter é remover o arquivo `controlDivergence.ts`
  e o wiring; sem impacto em schema, RLS ou dados.

## 7. Critérios de aceite
1. `evaluateControlDivergence` coberto por testes verdes (Vitest).
2. `ControlsPage` mostra divergência apenas a partir de ciclo fechado com k≥5.
3. `ActionsPage` deixa de sugerir controles já comprovados e lista os "já contemplados".
4. Escore COPSOQ inalterado antes/depois (teste de regressão).
5. `npm run ci` (lint, typecheck, test, build, bundle) verde no mesmo commit.
6. Nenhuma migration nova; nenhuma mudança em `dataGate`, RLS ou tabelas do vault.

## 8. Fora de escopo (explicitamente adiado)
- Enforcement server-side da divergência (Ramo B2) — só quando o contrato estabilizar.
- Reteste antes/depois e consolidado multi-CNPJ — dependem de dados reais (G3+).
- Qualquer redução automática de probabilidade pelo controle — permanece decisão técnica humana
  no `criteriaEngine`, com evidência.
