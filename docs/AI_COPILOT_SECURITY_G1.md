# Segurança do copiloto e retenção local — G1

## Estado

- Gate: `G1 — campanha sintética segura`, ainda não aprovado.
- Decisão vigente: **No-Go para dados reais, trabalhadores reais, RAG externo e IA remota em produção**.
- Escopo desta fatia: hardening uniforme das Edge Functions relacionadas a IA/documentos e retenção local verificável das conversas Aurora/EstratégIA.

Este registro não constitui aprovação de gate, parecer jurídico, validação metodológica ou autorização de uso com dados reais.

## Decisão Fable 5

Problema: funções Edge e histórico local de conversa precisavam de fronteira técnica comum, limites explícitos e descarte verificável antes de qualquer avaliação G1 do copiloto supervisionado.

Lentes consideradas: privacidade/LGPD, segurança de aplicação, arquitetura, UX operacional e governança de evidência.

Alternativas avaliadas:

- manter funções como estavam e confiar no bloqueio G0: rejeitado por não criar controle próprio de G1;
- desligar todas as funções de IA: seguro, mas não produz evidência técnica da fronteira;
- hardening compartilhado com autenticação, CORS restrito, schema e quota: escolhido para G1 sintético;
- proxy/serviço dedicado separado: adiado por custo e por depender de arquitetura posterior;
- persistência server-side de conversas: adiada; exigiria política legal e banco aprovado;
- retenção local versionada com TTL e limpeza manual: escolhida para reduzir retenção indefinida sem ampliar superfície.

Risco principal: controles técnicos criarem impressão de liberação do copiloto. Mitigação: documentação explícita de No-Go, gate runtime preservado, avisos na interface e sem ativar dados reais.

## Implementado

- `supabase/functions/_shared/security.ts`: boundary fail-closed com método POST, CORS por allowlist, autenticação Bearer, usuário Supabase, limite de payload, `Cache-Control: no-store`, trace id e quota por RPC.
- `supabase/functions/_shared/schemas.ts`: schemas Zod estritos para entradas de chat, reescrita e documentos.
- Seis Edge Functions passam por `preflightResponse`, `guardEdgeRequest` e `parseJsonBody` antes do processamento: `driver-chat`, `driver-dynamic`, `estrategia-chat`, `strategia-rewrite`, `generate-document`, `generate-pdf`.
- `supabase/migrations/20260623180000_ai_edge_security_g1.sql`: tabela service-only de rate limit e RPC `consume_ai_request_quota` com lock transacional.
- `src/lib/governance/localRetention.ts`: mecanismo puro para envelope de retenção com versão, `savedAt`, `expiresAt`, TTL, limite de itens, descarte de expirados/inválidos e poda por prefixo.
- `src/data/auroraRetentionPolicy.ts`: política `aurora-local-history-g1-2026-06-29`, TTL de 7 dias e máximo de 20 interações.
- `src/lib/aurora/chatHistory.ts`: adaptador Aurora que valida, minimiza campos persistidos e remove estados transitórios.
- `src/pages/app/EstrategiaPage.tsx` e `src/components/app/AuroraFloatingAssistant.tsx`: histórico local agora usa política versionada, limpeza manual remove a chave e aviso de retenção aparece junto ao disclaimer.
- `supabase/functions/driver-dynamic/index.ts`: o bloco estático legado deixou de ser apresentado como RAG, base oficial ou validação contra Playbook; agora exige fonte aprovada ou rotula a saída como hipótese preliminar.

## Critérios de aceite cobertos

- nenhuma função Edge relevante usa `req.json()` direto;
- nenhuma função Edge define `Access-Control-Allow-Origin: *`;
- toda entrada passa por schema estrito e limite de payload;
- quota por usuário e escopo é consumida atomicamente no banco;
- usuários `anon` e `authenticated` não inspecionam a tabela de quotas;
- histórico Aurora/EstratégIA não fica mais indefinido em `localStorage`;
- histórico expirado, inválido ou legado sem envelope pode ser descartado de forma verificável;
- estados transitórios (`rewriting`, `rewriteFailed`) não são persistidos;
- limpeza manual continua disponível na UI.
- conteúdo estático de prompt não pode voltar a ser rotulado como RAG governado, base oficial ou evidência aprovada.

## Evidência local

- TypeScript: `npm run typecheck` aprovado em 29/06/2026.
- Vitest: `npm run test` aprovado em 29/06/2026, 15 arquivos e 143 testes.
- ESLint: `npm run lint` aprovado em 29/06/2026.
- Dependências: `npm run audit:dependencies` aprovado em 29/06/2026, zero vulnerabilidades reportadas.
- Build: `npm run build` aprovado em 29/06/2026, Vite 8.1.0.
- Orçamento: `npm run check:bundle` aprovado em 29/06/2026; maior chunk `vendor-pdf-Cxd_NDhN.js` com 400,68 kB.
- Testes adicionados:
  - `src/lib/governance/localRetention.test.ts`;
  - `src/lib/aurora/chatHistory.test.ts`.
- Contrato estático existente: `src/test/aiEdgeSecurity.test.ts`.
- Contrato pgTAP existente: `supabase/tests/ai_edge_security_contract.sql`.

## Pendências e limites

- Executar lint, build, orçamento de bundle e banco no repositório oficial aprovado.
- Revisão independente de segurança/threat model ainda pendente.
- Aprovação formal de CORS allowlist, rate limits, payload, retenção e incident response ainda pendente.
- Catálogo Aurora, fontes, claims e evals continuam pendentes.
- Retenção local não substitui política jurídica de conversas, consentimento, descarte server-side ou DPA.
- RAG, fornecedor externo, ferramentas mutáveis, dados reais e trabalhadores reais continuam bloqueados até gate aplicável.
