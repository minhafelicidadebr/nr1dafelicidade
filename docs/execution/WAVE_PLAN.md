# Plano da onda ativa — Onda 0

## Objetivo

Criar o contrato técnico local que distingue escopo disponível, venda bloqueada e venda autorizada para o Readiness & Governance Sprint.

## Escopo permitido

- ler e editar código e documentação local;
- criar mecanismo puro e configuração canônica;
- conectar cards e CTAs existentes;
- criar testes unitários e de componente;
- atualizar o guardrail de claims e evidências;
- executar lint, typecheck, testes e build local.

## Fora de escopo e gates de parada

- preço real, cobrança live ou serviço pago externo;
- secrets, ambiente remoto, push, merge ou deploy;
- dados de trabalhadores, campanhas reais, scoring, PGR ou laudo;
- qualquer alteração destrutiva ou migration remota.

## Fatia vertical

1. compor a autorização upstream e requisitos comerciais explícitos;
2. produzir um resumo fail-closed;
3. expor o resumo às superfícies de venda;
4. bloquear qualquer CTA paga sem autorização completa;
5. preservar a CTA de rascunho local;
6. testar estado atual, casos adversos e claims.

## Critérios de aceite

- o estado atual é `sale_blocked`;
- escopo disponível não é confundido com autorização de venda;
- preço, moeda, owners, termos, referência, capacidade e claims são obrigatórios;
- CTA paga é falsa no estado incompleto;
- exclusões obrigatórias permanecem visíveis;
- testes direcionados, lint, typecheck e build passam.

## Checkpoint de saída local

- **Resultado:** critérios técnicos locais da Onda 0 passaram.
- **Testes:** `npm run test:repro` — 96 arquivos, 485 testes.
- **Qualidade:** `npm run lint`, `npm run typecheck`, `npm run build` e `npm run check:bundle` passaram.
- **Não concluído:** aceite institucional, preço final aprovado, termos aprovados, autoridade/evidência formal dos owners, capacidade e substituição formal, cobrança e qualquer habilitação remota.
- **Próximo gate humano:** preencher e aprovar `INSTITUTIONAL_AUTHORIZATION_INPUT.md`; nenhum preenchimento textual, isoladamente, altera `sale_blocked`.
- **Relatório de saída:** `WAVE_0_REPORT.md` consolida alterações, evidências, riscos e recomendação de commit.

## Gate de saída institucional do plano master

- **Estado:** Pendente — Onda 1 não autorizada.
- **Faltam:** valor e moeda aprovados; modalidade de pagamento e ambiente; autoridade e evidência do owner comercial e de entrega; termos aprovados; capacidade e substituição formal; aceite de Jurídico, Comercial e Financeiro.
- **Efeito:** permanecer em `sale_blocked`; não implementar checkout, CRM externo, e-sign, billing, provisioning ou entrega real.

## Preparação da próxima fatia — sem avanço de gate

- **Objetivo técnico:** tornar o pacote de decisão institucional conferível e rastreável, sem preencher valores, inventar evidências ou alterar a fonte canônica.
- **Artefatos de entrada:** `INSTITUTIONAL_AUTHORIZATION_INPUT.md`, `INSTITUTIONAL_DECISION_PACKET_DRAFT.md`, `EVIDENCE_LEDGER.md` e `DECISIONS_LEDGER.md`.
- **Critério de passagem:** cada decisão obrigatória deve ter responsável, data, referência versionada e evidência verificável; ausência mantém `sale_blocked`.
- **Hard stop:** não criar checkout, integração Mercado Pago, cobrança live, CRM externo, e-sign, provisioning, entrega remota ou acesso a dados reais nesta preparação.
- **Dependência humana:** a Onda 1 somente poderá ser reavaliada depois de preço/moeda, modalidade/ambiente, poderes dos owners, termos, capacidade/substituição e aceites Jurídico, Comercial e Financeiro.

## Hard-stop para integração com Lovable

- Commits automáticos do Lovable na `main` não são considerados aceite técnico nem autorização de publicação.
- Qualquer alteração em migration, RLS, `SECURITY DEFINER`, grants, autenticação, dependências ou lockfiles deve entrar por branch/PR, com auditoria e CI verde.
- Enquanto houver drift não revisado, não publicar a prévia, não executar migration e não habilitar dados reais, cobrança ou entrega remota.
- Correções de segurança devem preservar os contratos pgTAP existentes e o contrato canônico `npm@11.9.0`; a ação “corrigir tudo” do Lovable não substitui essa revisão.
