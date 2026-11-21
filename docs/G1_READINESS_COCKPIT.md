# Cockpit de prontidao G1

Data: 29/06/2026

## Objetivo

Dar visibilidade operacional ao estado de G1 sem aprovar gate, sem habilitar dados reais e sem substituir revisoes formais.

O cockpit consolida, no dashboard, evidencias ja produzidas pelo app:

- gate local sintetico ativo;
- organizacao, unidades e ciclo com `n >= 5`;
- riscos agregados computados;
- acoes com evidencia, KPI e revisao;
- controles com evidencia e revisao;
- documentos preliminares gerados e revisados;
- bloqueadores formais ainda pendentes.

## Decisao

Implementado com configuracao de criterios em `src/data/g1ReadinessCriteria.ts` e mecanismo puro em `src/lib/governance/gateReadiness.ts`.

O componente React apenas coleta evidencias agregadas e renderiza o resultado. Regras de gate nao ficam hardcoded no dashboard.

## Alternativas avaliadas

- Minimo viavel: manter status apenas em documento markdown. Rejeitado por nao orientar a operacao dentro do app.
- Robusto: workflow formal de aprovacoes, anexos, assinaturas e ledger. Adiado por exigir schema, RLS e decisoes externas.
- Simulacao segura: cockpit local com criterios versionados e bloqueadores formais fixos. Escolhido.
- Adiar: deixar G1 dependente de leitura manual do status. Rejeitado por reduzir rastreabilidade operacional.
- Comprar/integrar: sistema externo de governanca de gates. Fora de escopo.
- Abstrair: avaliador generico em `src/lib/governance`. Escolhido para reutilizacao futura.

## Comportamento

- O dashboard mostra percentual operacional, percentual total G1, bloqueios e pendencias formais.
- O proximo bloqueio acionavel aparece com CTA quando existe rota interna.
- Mesmo com evidencias operacionais completas, o gate permanece No-Go enquanto faltarem fontes, revisao independente, accountables, CI oficial e aceite formal.
- O texto explicita que o cockpit nao aprova G1 nem libera dados reais.

## Limites

- Nao cria aprovacoes formais.
- Nao substitui revisao SST/metodologia/juridico.
- Nao consulta respostas individuais.
- Nao altera RLS, schema, Edge Functions, scoring, instrumentos ou runtime.
- Nao fecha G1.

## Criterios de aceite

- Mecanismo puro testado.
- Criterios versionados fora do componente React.
- Dashboard mostra bloqueadores operacionais e formais.
- Dados reais continuam No-Go.
- Typecheck, testes, lint, build e orcamento de bundle verdes.

