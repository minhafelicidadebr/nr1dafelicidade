# Ação, KPI, evidência e revisão - G1

Data: 29/06/2026

## Objetivo

Fortalecer a cadeia `agir -> evidenciar -> reavaliar` sem avançar gate, sem habilitar dados reais e sem criar schema novo.

Esta fatia cria uma governança conservadora sobre `action_items` existente:

- responsável definido;
- prazo definido;
- origem em ciclo ou dimensão;
- evidência esperada descrita;
- KPI, indicador ou reavaliação descritos;
- revisão técnica citada antes do fechamento operacional.

## Decisão

Implementado como mecanismo puro em `src/lib/actions/actionGovernance.ts`, com UI de apoio em `ActionsPage` e checklist em `DocumentsPage`.

Não foi criada migration. O banco legado não possui campos formais de KPI, evidência, revisão ou anexos; por isso esta fatia usa sinais textuais e bloqueio de conclusão na interface. O workflow persistido completo fica pendente para etapa posterior.

## Alternativas avaliadas

- Mínimo viável: apenas texto orientativo no formulário. Rejeitado por não impedir fechamento superficial.
- Robusto: novas tabelas de evidência, anexos, revisão e ledger. Adiado por tocar schema, RLS e contrato auditável.
- Simulação/protótipo: mecanismo puro com testes e UI. Escolhido por ser reversível e demonstrável.
- Adiar: manter ação 22 como não iniciada. Rejeitado porque a tese do produto precisava de avanço seguro.
- Comprar/integrar: gestão documental externa. Fora de escopo para G1 local.
- Abstrair: avaliador genérico em `src/lib/actions`. Escolhido para evitar regra hardcoded em React.

## Comportamento

- Sugestões adotadas passam a incluir, na descrição, origem, evidência esperada, KPI/reavaliação e revisão técnica.
- Ações existentes mostram painel "Governança da ação" com sinais OK/Pendente.
- Tentativas de marcar como `done` são bloqueadas se faltarem responsável, prazo, evidência esperada, KPI/reavaliação ou revisão técnica.
- A prontidão documental agora diferencia "ações criadas" de "ações com evidência, KPI e revisão".
- A geração documental continua bloqueada apenas pelos requisitos mínimos já existentes: ciclo com `n >= 5` e riscos computados.

## Limites e riscos

- Sinais textuais não substituem workflow formal, anexos, assinatura, hash ou revisão independente.
- O bloqueio ocorre na interface; enforcement server-side exige schema e RLS específicos.
- Não há leitura de respostas individuais nem mudança em scoring, k-anonimato, RLS, instrumento ou Edge Function.
- Documentos seguem preliminares até revisão/assinatura competente.

## Critérios de aceite

- Mecanismo puro sem dependência de Supabase/React.
- Testes cobrem ação incompleta, ação pronta, conclusão sem revisão e cancelamento.
- UI mostra pendências antes do fechamento.
- Checklist documental reflete qualidade das ações sem avançar gate.
- Typecheck, testes, lint, build e orçamento de bundle verdes antes de declarar pronto.

