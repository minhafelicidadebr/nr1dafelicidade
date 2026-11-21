# Controles, evidência e revisão técnica - G1

Data: 29/06/2026

## Objetivo

Criar uma pré-fatia segura para controles organizacionais antes de qualquer cálculo oficial de eficácia ou risco residual.

Esta entrega não calcula redução de risco. Ela verifica se um controle adotado tem sinais mínimos para ser levado à revisão técnica:

- evidência de implementação;
- manutenção, rotina ou responsável;
- KPI, indicador, baseline ou reavaliação de eficácia;
- revisão técnica por SST/SESMT/CIPA, ergonomia ou auditoria.

## Decisão

Implementado como mecanismo puro em `src/lib/controls/controlEvidence.ts`, usando os campos já existentes de `org_controls.status` e `org_controls.notes`.

Não foi criada migration. Não há anexos, ledger formal, hash de evidência, assinatura independente ou enforcement server-side nesta fatia.

## Alternativas avaliadas

- Mínimo viável: manter apenas "controle adotado". Rejeitado porque poderia sugerir eficácia sem evidência.
- Robusto: criar tabelas de evidência, anexos, revisão, ledger e vínculo com criteria engine. Adiado por tocar schema, RLS e cálculo sensível.
- Simulação/protótipo: usar `notes/status` existentes com avaliador puro e testes. Escolhido por ser reversível e demonstrável.
- Adiar: manter ação 20 totalmente sem avanço. Rejeitado porque a UI atual tratava adoção como suficiente.
- Comprar/integrar: gestão documental externa. Fora do escopo G1 local.
- Abstrair: avaliador genérico em `src/lib/controls`. Escolhido para evitar regra hardcoded em React.

## Comportamento

- Controles adotados exibem painel "Evidência do controle".
- O usuário pode registrar notas provisórias de implementação, manutenção, eficácia/KPI e revisão.
- A UI bloqueia marcar controle como `done` se faltarem sinais mínimos.
- A prontidão documental agora separa "controles declarados" de "controles com evidência e revisão".
- O texto da interface afirma explicitamente que controle declarado não reduz risco automaticamente.

## Limites

- Sinais são textuais e provisórios; não substituem workflow formal de evidências.
- Não há cálculo de risco residual, redução de probabilidade ou severidade.
- Não há alteração no criteria engine, scoring, RLS, Edge Function ou instrumento.
- Ação 20 ainda não está concluída como capacidade oficial; esta fatia apenas remove ambiguidade operacional e prepara a revisão.

## Critérios de aceite

- Mecanismo puro sem dependência de React/Supabase.
- Testes cobrem controle declarado, controle pronto para revisão, `done` sem revisão e cancelamento.
- UI bloqueia conclusão superficial.
- Checklist documental expõe qualidade dos controles sem bloquear geração além dos requisitos já existentes.
- Typecheck, testes, lint, build e orçamento de bundle verdes antes de declarar pronto.

