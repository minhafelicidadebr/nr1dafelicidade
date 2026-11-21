# Relatório de saída — Onda 0

**Projeto:** APP-A · Readiness & Governance Sprint
**Data:** 2026-07-27
**Estado:** `sale_blocked` · Onda 1 não autorizada

## Objetivo

Criar uma fonte técnica fail-closed que distinga escopo disponível, venda bloqueada e venda autorizada, preservando as exclusões de trabalhadores, COPSOQ produtivo, scoring, PGR, laudo, conformidade prometida, checkout, cobrança e entrega remota.

## Alterações realizadas

- Criado o avaliador puro de autorização comercial e seus bloqueadores explícitos.
- Conectados card, página pública, workspace interno e ensaio de lançamento à fonte canônica.
- Mantida apenas a CTA local de preparação enquanto a venda estiver bloqueada.
- Registrada a atribuição operacional confirmada:
  - João Paulo Barboza — owner comercial; Ana para acompanhamento operacional, sem substituir aprovação final sem mandato escrito.
  - Ana Paula Inglez — owner de entrega; Olga como substituta operacional.
  - Olga Mariano — privacy/security/quality; Ana para triagem operacional e parada segura.
  - Jurídico e Financeiro — ainda a designar.
- Registrado `BRL` como moeda de trabalho e o Core como referência inicial; o valor exato permanece nulo e não aprovado.
- Criados termos comerciais e checklist jurídico como rascunhos não executáveis.
- Atualizados Current State, Wave Plan, Decisions Ledger e Evidence Ledger.

## Atualização em 2026-07-28

- Adicionados invariantes de teste para owners operacionais nomeados, BRL provisório, valor nulo e preço não aprovado.
- Alinhada a minuta comercial com Ana como owner operacional de entrega, João como owner comercial, Olga em privacy/security/quality e Olga como substituta operacional da entrega.
- Mantidos como pendentes a autoridade formal, evidências, capacidade, preço exato, termos e aceites.

## Mercado Pago

Mercado Pago foi indicado como provedor pretendido. A recomendação é avaliar Checkout Pro para o Core de pagamento único, que usa uma preferência por pedido, e manter a implementação de Assinaturas separada para um SaaS recorrente futuro. A documentação oficial descreve o [Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/create-payment-preference) como fluxo de preferência de pagamento e [Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/overview) como cobrança recorrente. O repositório continua sandbox-only: nenhuma credencial foi lida, criada ou alterada, e nenhuma função foi conectada ao CTA.

## Preço de referência

Hipótese de teste comercial para o Sprint Core: **R$ 7.900–12.900, pagamento único**, até quatro semanas, entregáveis D1–D8 e até oito interlocutores. Não é média de mercado nem preço aprovado. A embalagem foi comparada com modelos de base mensal, implantação, assentos e Enterprise sob consulta de [Pontotel](https://www.pontotel.com.br/planos/), [SafetyCulture](https://safetyculture.com/pricing/), [Asana](https://asana.com/pricing/) e [Vaipe/Mereo](https://help.mereo.com/hc/pt-br/articles/11423767080340-Quais-s%C3%A3o-os-planos-pre%C3%A7os-da-Vaipe).

## Migrations e ambiente

Nenhuma migration foi criada ou executada. Não houve acesso a ambiente remoto, secrets, cobrança live, deploy, push ou merge.

## Verificações

- Slice direcionado: 18 testes passaram.
- Card interno: 1 teste passou após a última alteração textual.
- Suíte completa: 96 arquivos e 485 testes passaram.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou.
- `npm run check:bundle`: passou; aviso de chunks grandes permanece preexistente.
- `git diff --check`: passou; apenas avisos de normalização LF/CRLF do Git.

## Evidências

- Fonte canônica: `src/data/commercialAuthorization.ts`.
- Mecanismo e testes: `src/lib/commercial/commercialAuthorization.ts` e `src/lib/commercial/commercialAuthorization.test.ts`.
- Ledgers: `docs/execution/DECISIONS_LEDGER.md` e `docs/execution/EVIDENCE_LEDGER.md`.
- Entrada institucional: `docs/execution/INSTITUTIONAL_AUTHORIZATION_INPUT.md`.

## Dívida e riscos

- Não há evidência formal de autoridade, representação, capacidade ou substituição.
- O preço final, tributos, forma de pagamento, cancelamento e reembolso não foram aprovados.
- Termos e checklist jurídico são drafts e não contratos executáveis.
- CNPJ e dados institucionais permanecem informados pelo solicitante, ainda não verificados no repositório.
- Documentos comerciais que descrevem SaaS, provisionamento ou integrações futuras precisam continuar marcados como condicionais ao runtime real.

## Próximo gate

Preencher e aprovar `docs/execution/INSTITUTIONAL_AUTHORIZATION_INPUT.md` com valor exato do Core, autoridade/evidências, capacidade/substituição, termos versionados e aceites Comercial, Jurídico e Financeiro. Até lá, não habilitar Onda 1.

## Recomendação de commit

`feat(g1): registrar atribuicao comercial e referencia core sem liberar venda`
