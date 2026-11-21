# Onda 1E — Indicadores sensíveis tipados e fail-closed

## Boundary auditado

`aggregate_cycle_outcomes(uuid)` retorna somente agregados de desfechos e é protegido no banco por organização, gestor autorizado, ciclo fechado, política ativa de `k` e `HAVING COUNT(*) >= _k`. O cliente não assume que o RPC é seguro apenas por estar tipado: ele normaliza a resposta em `normalizeOutcomeRows`.

## Contrato de cliente

O componente aceita exclusivamente:

- `outcome` textual não vazio;
- `mean_score` numérico finito ou `null`;
- `n_responses` inteiro com `n >= 5`;
- `k_anonymity_met === true`.

Campos extras são descartados. Linhas suprimidas, inválidas ou com contrato incoerente não chegam à renderização. Assim, a saída preserva a defesa em profundidade entre RPC, parser e UI.

## Evidência e limites

Os testes sintéticos comprovam minimização de campos e rejeição de linhas abaixo de `k`. Não houve alteração de migration, RLS, RPC, grants ou dados reais. O indicador continua coletivo e preliminar; não é diagnóstico individual nem autorização de encaminhamento clínico automático.
