# Onda 1C — Ratchet incremental de TypeScript

## Objetivo

Evitar regressão de tipagem sem ativar `noImplicitAny` globalmente antes de mapear os 14 pontos implícitos existentes. O guardrail conta nós `AnyKeyword` no AST TypeScript, não ocorrências textuais em comentários ou strings.

## Contrato

- O baseline inicial registra 66 usos explícitos em `src/**/*.ts` e `src/**/*.tsx`.
- Um arquivo existente pode reduzir sua contagem, mas não aumentá-la.
- Um arquivo novo com `any` explícito falha no CI até ser tipado ou receber revisão dedicada.
- A allowlist não autoriza dados reais, scoring, autenticação, RLS, IA ou integrações críticas; apenas registra dívida técnica existente.
- O baseline não é aprovação de produto nem promoção de gate.

## Validação

O comando `npm run check:type-strictness` executa `scripts/check-explicit-any.mjs` e foi incluído em `npm run ci`. A remoção dos usos existentes será feita em lotes separados, começando por componentes não sensíveis e com testes próprios.
