# Onda 1F — Driver de risco tipado e determinístico

## Decisão

O resumo visual de riscos agora usa o mecanismo puro `topDriver.ts`, recebendo a matriz `dimensionToDriver` como configuração de domínio. A UI não faz casts para `any` nem altera a fórmula existente.

O cálculo global permanece:

`score do driver = soma(peso configurado × risk_level visível)`

Dimensões desconhecidas são ignoradas e conjuntos sem riscos visíveis retornam `{ slug: null, score: 0 }`.

## Invariantes preservados

- os dados chegam do contrato `list_safe_risk_scores`, que já limita organização, ciclo fechado e `n >= k` no servidor;
- o mecanismo não recalcula severidade, probabilidade, risco ou cutoff;
- a matriz de drivers continua fonte de configuração legada não aprovada, sem novos claims psicométricos;
- o resumo não expõe respostas individuais nem altera a priorização persistida;
- a revisão técnica continua necessária para interpretar risco e controles.

## Evidência

`topDriver.test.ts` cobre seleção por dimensão, soma ponderada, dimensão desconhecida e conjunto vazio. A correção remove quatro usos explícitos de `any` do componente.
