# Recibo de validação do repositório novo

## Identificação

- Repositório: `playbook-nr1-chagpt-sol`
- Branch: `codex/onda-0-baseline-fidelity-runtime`
- Baseline inicial: `82836479eb01da93ebf48bebb2faf483934d1b13`
- Commit documental: `4e66d3f`
- Commit técnico: `d137dce`
- Ambiente: Windows 11 / PowerShell 5.1 / Node 24.14.0 / npm 11.9.0
- Data: 12/07/2026

## Gates executados

| Comando | Duração observada | Resultado | Evidência | Ação |
|---|---:|---|---|---|
| `npm ci` | 57,8 s | PASS | 644 pacotes instalados; 0 vulnerabilidades | nenhuma |
| `npm run audit:dependencies` | 3,8 s | PASS | 0 vulnerabilidades | nenhuma |
| `npm run lint` | 19,3 s | PASS | ESLint sem erros | nenhuma |
| `npm run typecheck` | 34,1 s | PASS | TypeScript sem erros | nenhuma |
| `npm test` | 18,8 s | PASS | 45/45 arquivos; 291/291 testes | hang histórico não reproduzido |
| `npm run build` | 5,1 s | PASS | build Vite concluído | manter warning de charts como P1 |
| `npm run check:bundle` | 1,1 s | PASS | 66 chunks; maior chunk 526,00 kB | otimização futura separada |

## Runtime Supabase

Problema reproduzido no baseline: o cliente consumia `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` diretamente e chamava `createClient` durante o import. O guard do `AuthProvider` não impedia uma falha anterior à montagem quando as variáveis estavam ausentes.

Correção aplicada: o cliente volta a usar `resolveSupabaseRuntimeConfig(import.meta.env)`, preserva o fallback local sintético e exporta o estado de configuração. Um teste contratual impede regressão para o consumo direto de env.

Validações específicas:

- `src/lib/runtime/supabaseConfig.test.ts`: fallback ausente e configuração explícita;
- `src/test/supabaseClientRuntimeConfig.test.ts`: wiring guardado antes de `createClient`;
- build executado sem `.env.local`, sem tela branca no carregamento estático;
- `supabase/config.toml` preserva `project_id = "gbvsmtnqhsefburjdkdv"`.

## Limitações

- Browser E2E, axe, teclado, leitor de tela e dispositivo real não foram executados.
- Supabase local, pgTAP, cross-tenant, race e recovery não foram reexecutados.
- Nenhum serviço remoto, migration, seed, deploy, push ou dado real foi usado.
- O build em linha de comando valida compilação e bundling; não constitui sozinho prova visual de ausência de tela branca.

## Prontidão resultante

- Nível: **1 — protótipo demonstrável avançado / fundação de MVP sintético**.
- Decisão: **GO** para descoberta e demonstração privada sintética; **GO CONDICIONAL** para promoção pública após correção de claims; **NO-GO** para trabalhadores reais, piloto operacional, relatório formal e SaaS self-service.
- Gate atual: G0/G1 local e sintético; G1 não aprovado formalmente.
- Próxima onda recomendada: Onda 0 de confiança pública, corrigindo claims e ampliando o guardrail automatizado.
