# Estado atual da execução — APP-A

- **Branch de release:** `main` remota
- **SHA de release:** `7570396` (`feat(g0): define synthetic action command boundary`)
- **Workspace local:** branch de trabalho limpa; o estado remoto canônico é a `main`.
- **Onda:** Onda 0 — autorização institucional e freeze
- **Objetivo:** distinguir escopo disponível, venda bloqueada e venda autorizada para o Readiness & Governance Sprint.
- **Gate:** G0/G1 local e sintético. Dados reais de trabalhadores continuam No-Go.
- **Arquivos canônicos da execução:** este arquivo, `DECISIONS_LEDGER.md`, `EVIDENCE_LEDGER.md` e `WAVE_PLAN.md`.
- **Implementado antes desta onda:** escopo G1 do Sprint, avaliação de autorização de advisory pago e intake comercial somente local.
- **Implementado nesta onda:** fonte canônica comercial fail-closed, bloqueios explícitos por preço/owners/termos/capacidade, wiring de card/CTA local e testes de claims.
- **Arquivos alterados:** `src/lib/commercial/commercialAuthorization.ts`, `src/data/commercialAuthorization.ts`, testes comerciais, card de venda, `SalesPage`, guardrail público e documentação de execução.
- **Validação:** a suíte atual possui 98 arquivos e 513 testes; lint, typecheck, build, bundle budget, auditoria de dependências, auditoria de escopo e CI pós-merge passaram.
- **Continuação auditada:** rótulo de CTA paga agora é nulo, cards e ensaio interno derivam venda do estado canônico e o workspace separa revisão upstream de venda; 20 testes direcionados passaram após os ajustes.
- **Restrições preservadas:** nenhum secret, deploy, cobrança live, ambiente remoto, migration destrutiva ou dado real foi usado; os pushes e merges ocorreram somente nos fluxos autorizados registrados nos PRs #32, #33, #35–#39, #2, #41 e #43.
- **Próxima ação:** revisão humana do pacote comercial; não habilitar venda até os bloqueios documentados serem aceitos formalmente.
- **Artefato do próximo gate:** `docs/execution/INSTITUTIONAL_AUTHORIZATION_INPUT.md` lista campos, evidências e proibições sem receber valores reais.
- **Pacote de decisão em rascunho:** `docs/execution/INSTITUTIONAL_DECISION_PACKET_DRAFT.md` pré-preenche a proposta Core de R$ 9.900,00 como recomendação não aprovada e organiza as confirmações necessárias.
- **Gate do plano master:** pendente; a Onda 1 não está autorizada porque os valores e aceites institucionais ainda não existem no repositório.
- **Dados institucionais recebidos:** gestor, instituição, CNPJ informado e equipe foram declarados pelo solicitante; permanecem como contexto não verificado, sem alterar a autorização canônica.
- **Atribuição operacional recebida:** João foi confirmado como owner comercial, Ana como owner de entrega, Olga como privacy/security/quality e o Core como referência inicial em BRL; autoridade, evidência, valor final e aceites permanecem pendentes.
- **Atualização pós-validação:** a lista de bloqueios canônicos está visível no workspace interno, o contexto derivado do ensaio usa `saleAuthorized` canônico e o guardrail verifica drift nas superfícies públicas; o último slice direcionado passou com 18 testes e a suíte completa passou com 485 testes.
- **Continuação em 2026-07-28:** adicionados invariantes de teste para owners operacionais nomeados, BRL provisório, valor nulo e preço não aprovado; nenhuma autorização externa ou mudança remota ocorreu.
- **Provedor de pagamento indicado:** Mercado Pago; a modalidade ainda não foi escolhida. O código existente permanece restrito a assinaturas sandbox e não deve ser usado para o Core de pagamento único.

## Atualização pós-release — 2026-07-28

- PR #33 integrou a migração React 19 / React Router 8 na branch de trabalho; PR #32 integrou o produto na `main`.
- O CI pós-merge da `main` passou em `verify`, `database-security` e `browser-quality` no SHA `eee91f6`.
- A correção de dependências resultou em `npm audit` com 0 vulnerabilidades; nenhuma cobrança live ou integração de pagamento foi habilitada.
- O release técnico não altera o gate comercial: o estado permanece `sale_blocked` e a Onda 1 continua não autorizada.
- Próximo gate real: preencher e aprovar formalmente preço, autoridade/evidência, capacidade/substituição, termos e aceites Comercial, Jurídico e Financeiro.

## Revisão de gate — 2026-07-30

- Não houve mudança remota após o release: `main` permanece no SHA `eee91f6` e o CI pós-merge permanece verde.
- A fonte canônica continua com `price.amount = null`, `price.approved = false`, `saleAuthorized = false` e CTA paga desabilitada.
- O pacote de decisão continua sendo um rascunho local; nenhum aceite novo foi inferido e nenhum PR automático foi incluído neste escopo.

## Fechamento técnico pós-merge — 2026-07-31

- PR #35 integrou a correção que força o transporte Supabase pelo `dataGate` e fixa o contrato de release em npm, após CI verde: [PR #35](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/35), `main` em `34c8859`.
- O workflow de verificação do PR #35 passou no run [30678712507](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30678712507), incluindo auditoria de escopo, testes, lint, typecheck e build conforme o contrato do repositório.
- A remoção de `bun.lock` e `bun.lockb` permaneceu explicitamente governada pelo manifesto de escopo; o contrato canônico de instalação e CI é `npm@11.9.0`.
- A correção é técnica e não altera o gate comercial: `price.amount` permanece `null`, `price.approved` permanece `false`, `saleAuthorized` permanece `false` e a CTA paga continua desabilitada.
- A próxima fatia segura é preparar a conferência do pacote institucional e suas evidências; Onda 1, checkout, billing live, entrega remota e dados reais continuam não autorizados.

## Incidente de drift Lovable e recuperação — 2026-08-01

- Após a troca do Lovable para `main`, a ação de correção automática de segurança criou commits diretos na branch (`e3a9ea4`, `3c88f63`, `e668b1c` e `22b6170`), fora de PR e sem revisão do repositório.
- O drift reintroduziu `bun.lock`, alterou `src/integrations/supabase/types.ts` e adicionou uma migration que revogava `EXECUTE` de funções `SECURITY DEFINER` sem preservar todos os grants necessários.
- O CI detectou a regressão no [run 30699707536](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol): `verify` falhou no contrato npm e `database-security` falhou em RPCs AEP/AET, privacidade, governança e NEXO.
- O PR #37 removeu somente o drift automático; a `main` foi restaurada no commit `40672ba` após CI pós-merge verde no [run 30702451679](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30702451679).
- Nenhuma migration foi executada por este fluxo. A ocorrência não altera `sale_blocked`, não autoriza Onda 1 e não libera dados reais.

## Reconciliação pós-PR #38 — 2026-08-01

- O PR #38 registrou o incidente de drift, a recuperação via PR #37 e o hard-stop operacional para alterações diretas do Lovable.
- O PR foi mesclado por squash na `main` no commit `3e33744c`; o CI pós-merge passou em `verify`, `database-security` e `browser-quality` no [run 30704353822](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30704353822).
- A reconciliação documental não altera código, banco, RLS, migrations, `sale_blocked` ou a autorização da Onda 1.

## Fechamento da correção de dependência — 2026-08-04

- O PR #41 resolveu o advisory `GHSA-rgw5-rvv9-x895` de `brace-expansion` e reconciliou o manifesto de escopo após a atualização do workflow no PR #2.
- O PR foi mesclado por squash na `main` no commit `33dff6f`; `verify`, `database-security` e `browser-quality` passaram no [run 30918134245](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30918134245).
- A correção não alterou runtime, banco, RLS, migrations, billing, dados reais ou o gate comercial. `sale_blocked` permanece ativo.

## Handoff institucional preparado — 2026-08-04

- O pacote `INSTITUTIONAL_DECISION_PACKET_DRAFT.md` recebeu ID de controle, versão, matriz de decisões, responsáveis mínimos, regras de referência de evidência e sequência de conferência.
- O veredicto continua `NO-GO`; preço sugerido, modalidade, papéis e termos permanecem referências de trabalho até aprovação humana verificável.
- O preenchimento do pacote não muda o runtime. Qualquer eventual transição exige conferência independente e PR separado com testes canônicos e CI verde.

## Hardening da superfície pública — 2026-08-04

- Cadastro SST, cadastro de gestor e login passam a falhar antes de rede e antes de salvar provisionamento quando Supabase estiver ausente, inseguro ou bloqueado pelo gate G0.
- A interface informa que cadastro e acesso produtivos estão indisponíveis na demonstração sintética e oferece o Sprint assistido como próxima ação honesta.
- A configuração de navegador rejeita chave Supabase com prefixo `sb_secret_`; nenhuma chave real foi adicionada ou lida por esta mudança.
- O documento de runtime Lovable foi reconciliado: `VITE_DATA_MODE=synthetic` não autoriza Supabase remoto. Ambiente remoto sintético ou real exige decisão e evidência próprias.
- Este hardening não altera `sale_blocked`, não autoriza Onda 1 e não habilita autenticação remota, dados reais, billing ou entrega produtiva.

## Preflight dos fluxos públicos de pesquisa — 2026-08-07

- A entrada de colaborador e a rota de resposta agora consultam a disponibilidade do runtime antes de iniciar lookup, validação ou envio de resposta.
- Preview sem configuração, com chave insegura ou com destino bloqueado informa que a pesquisa está indisponível; não armazena convite, resposta ou dados da organização e não deixa a tela em loading infinito.
- O fluxo local sintético autorizado permanece disponível; nenhuma migration, RLS, backend remoto, dado real ou avanço de gate foi habilitado.
- A evidência direcionada passou com 22 testes, o typecheck, lint e build passaram após a alteração; a suíte completa passou com 503 testes em execução serial.

## Fechamento técnico do PR #43 — 2026-08-11

- O PR [#43](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/43) foi integrado por squash na `main` no SHA `6d4e595f2ece3e702c5b2429439dcb72d8b22cf5`.
- O CI pós-merge passou em `verify`, `database-security` e `browser-quality` no [run 31520496658](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/31520496658).
- A entrega inclui o preflight fail-closed dos fluxos públicos de pesquisa, o núcleo puro local de execução de ações e a correção dos advisories de `dompurify` e `nanoid`; o núcleo ainda não é persistência nem barreira de segurança.
- A validação não altera `sale_blocked`, não autoriza a Onda 1, não libera autenticação remota ou dados reais e não executa migration, RLS ou RPC novo.
- A próxima decisão técnica continua condicionada à aprovação formal da `ADR_NR1_EXECUTION_CORE_MVP.md`; seus critérios permanecem pendentes, assim como os aceites institucionais do pacote comercial.

## Contrato sintético RPC/RLS da execução de ações — 2026-08-11

- A aprovação do solicitante autorizou a implementação local do contrato command-only descrito em `docs/execution/NR1_MVP_RPC_RLS_CONTRACT_G0.md`.
- O contrato deriva tenant, ator e revisor de contexto server-side simulado, bloqueia `colaborador` e cross-tenant, rejeita versão obsoleta e torna replay idempotente por `commandId`.
- A fatia inclui somente mecanismo puro e testes; não cria migration, RPC, policy RLS, grant, chamada Supabase, storage, dado real ou gate novo.
- A saída coletiva permanece separada do comando e filtrada por `k ≥ 5`; respostas individuais, convites e identidade continuam fora da superfície organizacional.
- A aprovação desta fatia não substitui os aceites formais de Produto, Engenharia, SST/Ergonomia e Privacidade exigidos pela ADR, nem autoriza migration da Onda 1.

## Fechamento técnico do PR #46 — 2026-08-12

- O PR [#46](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/46) foi integrado por squash na `main` no SHA `7570396172ccf8453d61b019fb1afd078322f78a`.
- O CI pós-merge passou em `verify`, `database-security` e `browser-quality` no [run 31555525769](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/31555525769).
- A integração consolida o contrato sintético command-only, sem criar migration, RPC, policy RLS, grant, storage, chamada Supabase ou dado real.
- `sale_blocked`, G0 e a não autorização da Onda 1 permanecem inalterados; a aprovação registrada é apenas da fatia local, não da ADR completa.
- Próxima fatia condicionada: revisão formal do contrato de evidência estruturada, revisão independente, vínculo AEP/AET, grants, ledger append-only, retenção, storage/scanning e cenários pgTAP.
