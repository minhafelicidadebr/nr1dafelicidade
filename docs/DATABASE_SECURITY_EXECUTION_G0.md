# Evidência de execução local — banco e segurança

## Escopo

Execução exclusivamente local e sintética para comprovar o job `database-security`. Nenhum projeto remoto, credencial operacional, trabalhador real ou dado real foi utilizado.

- data/hora da última execução: `2026-06-23T16:39:37-03:00`;
- ambiente: Ubuntu 24.04 em WSL2;
- Docker Engine: `29.1.3`;
- Supabase CLI: `2.107.0`, igual à versão fixada no CI;
- PostgreSQL Supabase: `17.6.1.136`;
- arquivos SQL avaliados: 36 migrações e contratos;
- hash SHA-256 do conjunto ordenado `caminho + hash de arquivo`: `5ccb4048d016bcbb480222116a29f99623a6eb0a7679de7798c585dfed61e224`.
- hash SHA-256 do teste concorrente: `e9e2ba436161d227b0673f928998e0acd2c948b8a0f67af36ee403d6496576a8`.
- hash SHA-256 do exercício de recuperação: `dd22c9db510010b20ebc9d0c8ba95636aff2dbd45e2b5f98d1e2a5c03b65663d`.
- tipos Supabase regenerados: 3.572 linhas, SHA-256 `3f8b1472a920b63a47e4ed14bf7d8298a0f8a4875bf1ad347b0b7c961fcf9e32`.

## Comandos reproduzidos

```sh
supabase db reset --local
supabase db lint --local --level warning --fail-on error
supabase test db
bash supabase/tests/privacy_vault_concurrency.sh
bash supabase/tests/data_lifecycle_recovery.sh
```

O reset aplicou todas as migrações do zero. O lint passou sem erros e reportou somente dois avisos de parâmetro não usado: `_cycle_id` no bloqueio explícito do cálculo legado e `_instrument` em `create_sst_organization` legado.

## Resultado

- `privacy_vault_contract.sql`: 44/44;
- `privacy_vault_load_contract.sql`: 12/12;
- `instrument_registry_contract.sql`: 21/21;
- `data_governance_contract.sql`: 26/26;
- `aep_work_context_contract.sql`: 33/33;
- `aet_flow_contract.sql`: 34/34;
- `criteria_engine_contract.sql`: 36/36;
- total: **206/206 asserções pgTAP aprovadas**.

O contrato de carga comprovou, com dados sintéticos, lote máximo de 500 convites, rejeição de 501, unicidade de tokens, 500 submissões de uso único, replay negado, auditoria e supressão da contagem exata em campanha aberta. Os limites de 30 segundos para emissão e 60 segundos para submissões detectam regressão catastrófica e não representam SLA.

O teste concorrente comprovou duas conexões disputando o mesmo token: um sucesso, uma rejeição `token_already_used`, uma resposta, um convite usado e uma auditoria. A execução local terminou em 1 segundo, abaixo do guardrail catastrófico de 15 segundos.

O exercício de ciclo de vida exportou uma cadeia sintética protegida, calculou hash, descartou todos os registros (`0|0|0|0`), restaurou cinco respostas e seus três níveis de contexto (`5|1|1|1`) e confirmou hash canônico idêntico. Uma cópia adulterada foi detectada por hash divergente. O restore usa allowlist explícita e rejeita colunas geradas.

O CI de aplicação também passou: lint sem erros ou avisos, TypeScript sem erros, 126 testes Vitest aprovados e build de produção concluído.

`src/integrations/supabase/types.ts` foi regenerado pelo Supabase CLI a partir do banco local com todas as migrações aplicadas; o typecheck e o build permaneceram verdes.

## Defeitos encontrados e corrigidos

1. referências ambíguas a `k_min` e `organization_id` em RPCs do Privacy Vault foram qualificadas;
2. o trigger anti-differencing recebeu precedência determinística sobre gates posteriores;
3. contratos AEP, AET e Criteria Engine deixaram de consultar tabelas service-only sob o papel `authenticated` e passaram a usar RPCs seguras;
4. as RPCs de transição AEP/AET agora rejeitam saltos de estado antes de avaliar requisitos do estado de destino;
5. o contrato do Criteria Engine foi completado para executar as 36 asserções planejadas.
6. o teste concorrente ganhou readiness fail-closed e restauração dos triggers mesmo em falha.

## Limites da evidência

Esta execução comprova banco novo, lint, pgTAP, carga/timing sintéticos, corrida concorrente e recuperação lógica local. Não comprova backup produtivo, disaster recovery distribuído, execução do GitHub Actions, revisão independente, aprovação metodológica, aprovação DPO/Jurídico nem autorização de gate. G1 continua aberto e dados reais continuam proibidos.
