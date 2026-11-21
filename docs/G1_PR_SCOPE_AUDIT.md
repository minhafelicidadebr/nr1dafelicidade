# Auditoria de escopo do PR — Onda 0R

Data: 16/07/2026

## Objetivo

Auditar a fatia pós-merge que substitui snapshots manuais e obsoletos por um Release Evidence Control Plane machine-readable, sem alterar banco, autenticação, billing, deploy ou gate.

Base de comparação: `c096d9191189cc394cce64c78465cdb79f8a6d11` (`main` após o merge do PR 9).

## Escopo esperado

- 22 caminhos;
- 7 adicionados;
- 15 modificados;
- 0 removidos;
- 7 documentos;
- 14 arquivos de source;
- 1 arquivo de configuração TypeScript;
- 0 migrations, Edge Functions, policies, secrets, workflows ou dependências.

O manifesto `docs/release/ONDA_0R_RELEASE_SCOPE_MANIFEST.json` atribui cada caminho a exatamente uma frente. O manifesto de PR usa essa fotografia como parent e exige igualdade exata para a faixa `c096d919...HEAD`.

## Frentes

1. `foundation_and_claims`: cockpit G0/G1 e seus testes.
2. `commercial_readiness`: maturidade SaaS e billing sandbox-only.
3. `methodology_and_instruments`: política que mantém metodologia bloqueada.
4. `synthetic_operation`: prontidão de sync derivada do mesmo artefato.
5. `external_governance`: wiring do workspace e dashboard.
6. `release_governance`: manifesto, parser, pacote, documentação e drift tests.

## Segurança

- nenhum `.env` ou secret;
- nenhum arquivo Supabase;
- nenhum workflow GitHub;
- nenhum `package.json` ou lockfile;
- nenhum dado real;
- nenhum deploy, merge, publicação ou integração externa;
- `resolveJsonModule` é habilitado apenas para importar o manifesto versionado no bundle.

## Validação executada antes do commit

- testes focados do control plane e contratos derivados: verdes;
- typecheck: verde;
- `npm run ci`: verde, incluindo auditoria de dependências com 0 vulnerabilidades, lint, typecheck, 81 arquivos/441 testes Vitest, build e orçamento de bundle;
- bundle: 71 chunks; maior chunk `vendor-charts` com 526,00 kB, dentro do orçamento vigente e ainda sujeito à otimização futura;
- Playwright integral em desktop e mobile, Chromium, Firefox e WebKit: 49 testes verdes e 3 skips intencionais;
- a primeira inicialização do Playwright encontrou a porta 4173 ocupada por outro projeto Vite; nenhum teste foi executado nessa tentativa e a matriz foi repetida integralmente, sem interromper o outro processo, com `PLAYWRIGHT_PORT=4187`;
- `git diff --check`: sem erros;
- auditoria da faixa commitada contra `c096d919...`: `verified`, 22/22 caminhos, 7 adições, 15 modificações, 0 exclusões e 0 blockers.

## Recibo da faixa commitada

- status: `verified`;
- caminhos: 22/22;
- duplicados, não classificados e obsoletos: 0;
- caminhos sensíveis ou governados: 0;
- SHA-256 do conjunto de caminhos: `fbb46cbbe48376f8a3cf4f1b4ccc538b8bb2a82d68de1dc50cb9e7c063442548`;
- blobs incluídos: 20;
- blobs excluídos por autorreferência: 2;
- bytes mensurados: 92.506;
- SHA-256 da árvore de conteúdo: `26217f7dbc9361c11c498f36def9aff18ec9b53fc1be7eededc0c26621aca8a3`;
- blockers: 0.

## Critérios de bloqueio

O PR deve falhar se:

- caminho estiver ausente, duplicado ou obsoleto no manifesto;
- houver deleção;
- parent hash ou merge-base divergirem;
- SHA de baseline, merge e jobs de CI não coincidir;
- G1 for tratado como aprovado;
- dados reais, publicação externa ou billing live forem habilitados;
- documento canônico continuar apontando para o Draft PR pré-merge.

## Rollback

Reverter os 22 caminhos desta faixa. Não há migration, dado, secret, deploy ou operação externa a desfazer.
