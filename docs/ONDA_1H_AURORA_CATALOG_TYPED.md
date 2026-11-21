# Onda 1H — catálogo Aurora e crosswalk MTE tipados

## Decisão

Aurora continua determinística e local: a seleção de driver reutiliza `topDriverForDimension`, enquanto o crosswalk MTE usa o tipo inferido do registro `nr1Framework.thirteenMteFactors`. A onda remove duplicação sem alterar a configuração de domínio.

## Fluxo protegido

`SafeRiskScore` agregado → contexto Aurora allowlisted → driver catalogado → fator MTE/intervenção catalogados → recomendação preliminar com fonte e limitação.

Dimensões não cadastradas permanecem em fallback fail-closed, sem driver ou intervenção inventados. A ausência de LLM, RAG remoto e dados individuais permanece explícita.

## Evidência

O teste cobre uma dimensão catalogada (`demands_quant`) e uma dimensão desconhecida. Typecheck e ratchet comprovam que a leitura não depende de `any`; a validação completa deve manter lint, build, CI e auditoria de escopo verdes.

## Limites

Tipagem não aprova fontes, licenças, subescalas, scoring, claims regulatórios ou método psicométrico. Aurora não diagnostica, não decide RH e não substitui SST/ergonomia, AEP, AET ou revisão humana competente.
