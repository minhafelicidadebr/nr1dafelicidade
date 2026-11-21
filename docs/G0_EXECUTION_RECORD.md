# Registro de execução — G0

## Estado

- Gate: `G0 — Congelamento de risco`
- Política de runtime: `g0-2026-06-23`
- Decisão: **No-Go para dados reais**
- Dados permitidos: exclusivamente sintéticos em serviços locais
- Início da execução: 23/06/2026

## Fatia 1 — build, secrets e bloqueio de dados reais

Problema: o snapshot recebido não possuía build npm reproduzível, continha `.env` local e poderia alcançar serviços Supabase remotos.

Resultado operacional esperado: desenvolvimento e demonstração local continuam possíveis, mas nenhuma chamada do frontend alcança banco, autenticação, Edge Function ou IA remota.

Evidência produzida:

- `.env` e variantes ignorados; `.env.example` contém somente configuração local/sintética;
- política de gate versionada em `src/data/runtimePolicy.ts`;
- mecanismo fail-closed em `src/lib/runtime/dataGate.ts`;
- todos os caminhos de `fetch` do frontend passam pelo gate;
- banner visível informa o bloqueio;
- teste automatizado cobre local, remoto, configuração inválida e tentativa de bypass por `VITE_DATA_MODE=real`;
- CI executa instalação limpa, lint, typecheck, testes e build.

## Limitações e pendências

- O snapshot foi entregue sem diretório `.git`; portanto, não foi possível provar se `.env` já integrou histórico Git. Antes de republicar, o responsável deve auditar o repositório de origem e rotacionar qualquer credencial que possa ter sido exposta.
- Chaves publicáveis do Supabase não substituem RLS. O bloqueio G0 reduz exposição operacional, mas não conclui o Privacy Vault.
- O gate de frontend não revoga acessos existentes no banco remoto. A próxima fatia deve criar migração deny-by-default e testes de papéis/tenants.
- A base usa `strict: false` e contém `any` legado em larga escala. `no-explicit-any` permanece temporariamente desativado no baseline; cada fatia migrada deve ganhar tipos explícitos e testes antes de reativação global.
- Não usar este registro como certificação de conformidade, parecer jurídico ou validação psicométrica.

## Próximo gate técnico

`WS-01 / Privacy Vault` e as migrações subsequentes foram executados do zero em Supabase local; lint SQL, 206 asserções pgTAP, carga máxima, replay concorrente e recuperação lógica sintética foram aprovados. Ver `docs/DATABASE_SECURITY_EXECUTION_G0.md`. G1 continua aberto por pendências metodológicas, revisões independentes e aprovações formais.
