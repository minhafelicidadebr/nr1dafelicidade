# Onda 1D — Contexto Aurora tipado e minimizado

## Decisão

O boundary `src/lib/aurora/contextBuilder.ts` agora projeta `SafeRiskScore` para uma estrutura `AuroraScore` explícita. A projeção funciona como allowlist de campos: a Aurora recebe apenas dimensão, risco agregado, severidade, probabilidade, tamanho da amostra e médias agregadas permitidas.

Identificadores de score, ciclo, organização, driver, versão, datas e nome do ciclo não são encaminhados para o contexto da IA. A organização continua reduzida a `id` e nome para o estado visual, sem copiar o registro completo.

## Guardrails preservados

- `k-anonimato`: somente linhas com `n >= 5` entram em `visibleScores`;
- linhas abaixo do limiar permanecem apenas na contagem de supressão;
- nenhum dado individual, resposta, convite ou texto livre é consultado;
- Aurora continua determinística no contexto local; a reescrita externa permanece sujeita aos guardrails já existentes;
- a mudança não altera RPCs, migrations, RLS, autenticação ou dados reais.

## Evidência

`contextBuilder.test.ts` verifica a allowlist de campos e o bloqueio de linhas abaixo de `k`. O baseline de strictness cai de 66 para 64 usos explícitos de `any`.

## Limites

Esta alteração melhora o contrato de dados, mas não transforma Aurora em decisora técnica, diagnóstica ou regulatória. A revisão humana, as fontes aprovadas e o responsável técnico continuam obrigatórios.
