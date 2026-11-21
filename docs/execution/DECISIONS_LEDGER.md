# Ledger de decisões — APP-A

## D-001 — Fonte canônica de autorização comercial

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** manter a avaliação existente de autorização G1 como evidência upstream e adicionar uma camada canônica de autorização comercial para o serviço, exigindo explicitamente preço aprovado, moeda, owner comercial, owner de entrega, termos aprovados, referência dos termos, capacidade, guardrail de claims e escopo seguro.
- **Motivo:** a autorização upstream cobre papéis e decisões, mas as superfícies públicas precisam de um único estado fail-closed e não podem inferir preço ou capacidade a partir de templates.
- **Alternativas consideradas:** estender o modelo upstream; hardcodear o estado nos componentes; adiar a integração; integrar billing externo; criar um gate comercial genérico. A opção escolhida é a menor camada de composição, sem nova dependência e sem habilitar compra.
- **Trade-off:** há uma pequena duplicação de campos de apresentação, compensada pela separação entre mecanismo puro e configuração canônica.
- **Rollback:** remover o novo módulo e os imports/wiring desta onda; manter o estado upstream bloqueado.
- **Aceite:** a CTA paga só pode ser habilitada quando todos os requisitos explícitos forem verdadeiros; o estado atual deve permanecer bloqueado.
- **Resultado:** implementado em `src/lib/commercial/commercialAuthorization.ts` e consumido por `src/data/commercialAuthorization.ts`, `ReadinessGovernanceSprintCard` e `SalesPage`.

## D-002 — CTA pública permanece como rascunho local

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** enquanto `paidCtaEnabled` for falso, a superfície mantém somente a CTA de preparação/rascunho local; não há checkout, proposta executável ou cobrança.
- **Motivo:** escopo disponível não equivale a venda autorizada e o intake atual não entrega dados à equipe.
- **Aceite:** a CTA visível continua `Preparar escopo` e o formulário continua `Salvar escopo local`.

## D-003 — Apresentação paga deriva do estado canônico

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** o rótulo de proposta paga permanece `null` enquanto `paidCtaEnabled` for falso; o card deriva também a mensagem de estado da mesma fonte.
- **Motivo:** evitar que um rótulo futuro seja interpretado como caminho de contratação disponível.
- **Resultado:** auditoria de drift e teste de apresentação adicionados; estado atual sem rótulo pago.

## D-004 — Revisão upstream separada do estado comercial

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** o workspace interno mantém os detalhes de papéis e decisões upstream, mas o indicador de venda usa obrigatoriamente `g1CommercialAuthorizationSummary`.
- **Motivo:** prontidão para revisão formal não é autorização de venda; os dois estados precisam permanecer visíveis sem se confundirem.
- **Resultado:** `PaidAdvisoryAuthorizationCard` e `ExternalReadinessWorkspacePage` passaram a consumir o estado comercial canônico para o indicador de venda.

## D-005 — Ensaio interno não herda autorização upstream para venda

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** o campo `authorizationForSale` do ensaio sintético usa `commercialAuthorization.saleAuthorized`; o resumo upstream continua apenas como contexto de revisão.
- **Motivo:** impedir que um pacote upstream completo, sem preço/termos/capacidade canônicos, altere o resultado de venda do ensaio.
- **Resultado:** card, página e teste do ensaio foram conectados ao estado canônico.

## D-006 — Bloqueios canônicos visíveis no workspace interno

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** exibir no card interno a lista de bloqueios derivada do mesmo avaliador canônico que governa a venda; nenhum valor de autorização é editável pela superfície pública.
- **Motivo:** revisão institucional precisa identificar o próximo requisito sem transformar escopo disponível em venda autorizada.
- **Resultado:** `PaidAdvisoryAuthorizationCard` renderiza os bloqueios com `commercialAuthorizationBlockerLabel`; o teste cobre a presença do heading e do bloqueio de preço.

## D-007 — Contexto derivado do ensaio usa autorização canônica

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** `g1PaidAdvisoryLaunchContext.authorizationForSale` deve derivar de `g1CommercialAuthorizationSummary.saleAuthorized`, preservando o resumo upstream somente para prontidão de revisão.
- **Motivo:** impedir drift entre o contexto estático do ensaio, o card de lançamento e as superfícies públicas.
- **Resultado:** fonte e teste do ensaio foram alinhados; o estado atual continua No-Go.

## D-008 — Guardrail estático contra drift upstream nas superfícies públicas

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** o guardrail público deve exigir a presença da fonte comercial canônica e rejeitar referências diretas a `canAuthorizeSale` nas superfícies públicas.
- **Motivo:** impedir que uma alteração futura reintroduza autorização upstream como CTA ou estado comercial público.
- **Resultado:** teste adicionado em `publicClaimsGuardrail.test.ts`; o estado atual continua bloqueado.

## D-009 — Template de entrada institucional sem autorização implícita

- **Data:** 2026-07-26
- **Onda:** Onda 0
- **Decisão:** preparar um template separado para a decisão humana, mantendo todos os campos pendentes e sem permitir que texto documental altere o estado runtime.
- **Motivo:** o próximo gate depende de autoridade externa ao código, mas precisa de uma entrada rastreável e sem coleta indevida de dados.
- **Resultado:** criado `docs/execution/INSTITUTIONAL_AUTHORIZATION_INPUT.md`.

## D-010 — Dados institucionais recebidos sem promoção automática de gate

- **Data:** 2026-07-27
- **Onda:** Onda 0
- **Decisão:** registrar gestor, instituição, CNPJ informado e equipe como contexto declarado, mantendo preço, papéis, evidências e aceites pendentes.
- **Motivo:** identidade institucional não substitui autorização comercial, poderes de representação, capacidade ou revisão jurídica.
- **Resultado:** o template foi atualizado; a fonte canônica e a CTA permanecem bloqueadas.

## D-011 — Papéis segregados e preço híbrido como hipótese

- **Data:** 2026-07-27
- **Onda:** Onda 0
- **Decisão:** propor João como sponsor/owner comercial, Ana como owner de entrega e Olga como privacy/security/quality owner; propor preço fixo por Sprint agora e assinatura híbrida somente após plataforma real.
- **Motivo:** separar decisão comercial, execução e bloqueio de privacidade; evitar preço por trabalhador e evitar cobrar SaaS antes de existir plataforma/entitlement operacional.
- **Resultado:** proposta registrada sem alterar `g1CommercialAuthorizationInput`; papéis, preço, tributos e substitutos continuam pendentes.

## D-012 — Atribuição operacional confirmada e Core como referência inicial

- **Data:** 2026-07-27
- **Onda:** Onda 0
- **Decisão:** registrar João como owner comercial, Ana como owner de entrega, Olga como owner de privacy/security/quality e o Sprint Core como referência inicial de preço em BRL.
- **Motivo:** a confirmação do solicitante permite organizar a responsabilidade operacional e a próxima decisão de preço sem transformar uma referência comercial em preço aprovado.
- **Limite:** a atribuição não comprova poderes de representação, autoridade formal, evidência, capacidade, substitutos, aceite Jurídico/Financeiro ou valor final.
- **Resultado:** `g1CommercialAuthorizationInput` registra os owners como nomeados e BRL como moeda de trabalho; `amount` permanece nulo, `approved` permanece falso e a venda continua `sale_blocked`.

## D-013 — Minuta comercial alinhada à hipótese sem efeito executável

- **Data:** 2026-07-28
- **Onda:** Onda 0
- **Decisão:** refletir na minuta a atribuição operacional de Ana, João e Olga e a referência Core em BRL, mantendo autoridade, capacidade, preço final, termos e aceites pendentes.
- **Motivo:** eliminar drift entre a decisão registrada e os documentos de revisão, sem transformar rascunho em contrato ou autorização.
- **Resultado:** `READINESS_GOVERNANCE_SPRINT_TERMS_DRAFT.md` permanece versão 0.1, não aprovada e não executável.

## D-014 — Mercado Pago como provedor pretendido, modalidade ainda pendente

- **Data:** 2026-07-28
- **Onda:** Onda 0
- **Decisão:** registrar Mercado Pago como provedor pretendido. Para o Core, recomendar Checkout Pro/pagamento único; manter Assinaturas como trilha separada para a recorrência futura do SaaS.
- **Motivo:** a oferta Core está modelada como Sprint de pagamento único, enquanto a base existente do repositório implementa apenas um contrato sandbox de assinaturas recorrentes.
- **Limite:** esta decisão não escolhe o fluxo final, não aprova preço, não habilita CTA, não cria credenciais, não configura webhook remoto e não libera cobrança live.
- **Resultado:** a minuta e o template institucional registram o provedor e mantêm a modalidade, termos, ambiente e aprovações pendentes.

## D-015 — Release técnico concluído sem avanço comercial

- **Data:** 2026-07-28
- **Onda:** Onda 0 / pós-release técnico
- **Decisão:** integrar a correção de dependências e o escopo G1 na `main` após CI verde, mantendo `sale_blocked` e sem habilitar cobrança.
- **Motivo:** resolver o bloqueio técnico do `npm audit` e entregar o slice autorizado sem transformar release técnico em aceite institucional ou venda autorizada.
- **Resultado:** `main` está no SHA `eee91f6`; Onda 1, checkout, billing live e dados reais de trabalhadores permanecem não autorizados.

## D-016 — Fechamento técnico pós-merge sem avanço comercial

- **Data:** 2026-07-31
- **Onda:** Onda 0 / fechamento técnico pós-release
- **Decisão:** registrar a integração do PR #35, que força o transporte Supabase pelo `dataGate` e fixa o contrato de release em npm, mantendo o gate comercial fechado.
- **Motivo:** concluir o hardening técnico verificável sem transformar correção de runtime, auditoria de escopo ou merge em aceite institucional, autorização de venda ou habilitação remota.
- **Evidência:** [PR #35](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/35), [CI run 30678712507](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30678712507), `main` em `34c8859`.
- **Resultado:** `sale_blocked` permanece ativo; Onda 1, checkout, billing live, entrega remota e dados reais de trabalhadores continuam não autorizados. A próxima fatia é a conferência humana do pacote institucional.

## D-017 — Bloquear drift automático do Lovable e recuperar a main

- **Data:** 2026-08-01
- **Onda:** Onda 0 / incidente de integração e recuperação
- **Decisão:** não aceitar alterações de segurança, grants, migrations ou lockfiles criadas diretamente pelo Lovable na `main`; remover o drift por PR revisado e manter mudanças futuras em branch/PR com CI verde.
- **Motivo:** a correção automática reintroduziu `bun.lock` e uma migration de permissões que falhou no contrato npm e em múltiplos testes pgTAP de autorização.
- **Evidência:** [CI contaminado 30699707536](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30699707536), [PR de recuperação #37](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/37), [CI pós-merge 30702451679](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/30702451679).
- **Resultado:** `main` restaurada no SHA `40672ba`; `database-security`, `verify` e `browser-quality` passaram; nenhuma migration foi executada por este fluxo e o gate comercial permaneceu `sale_blocked`.

## D-018 — Handoff institucional estruturado sem autorização implícita

- **Data:** 2026-08-04
- **Onda:** Onda 0 / preparação do gate humano
- **Decisão:** transformar o pacote institucional existente em uma matriz única de decisões, com ID de controle, versão, aprovadores mínimos, referências de evidência e sequência de conferência, preservando o veredicto `NO-GO`.
- **Motivo:** o bloco textual anterior reunia as perguntas corretas, mas não tornava inequívocos o estado de cada decisão, os aprovadores mínimos, a custódia das evidências nem a passagem para revisão técnica.
- **Alternativas consideradas:** manter o texto livre; automatizar aprovação no app; adiar; contratar e-sign/CLM; criar um motor genérico de aprovações; ou estruturar o handoff documental mínimo. Foi escolhido o handoff mínimo por ser verificável, reversível e compatível com o gate atual sem criar dependência externa.
- **Trade-off:** a decisão humana continua fora do produto e exige conferência manual; em troca, não se cria uma falsa trilha de aprovação, não se coleta documentação sensível no Git e não se antecipa billing ou e-sign.
- **Rollback:** reverter a matriz à versão anterior do rascunho; a fonte canônica permanece bloqueada em qualquer cenário.
- **Aceite:** todos os itens permanecem pendentes até evidência verificável; `APROVADO_COM_CONDIÇÕES`, ausência de referência ou preenchimento por chat mantêm `sale_blocked`; eventual alteração do runtime ocorre somente em PR separado com CI verde.
- **Resultado:** `INSTITUTIONAL_DECISION_PACKET_DRAFT.md` está pronto para circulação controlada, sem aprovar preço, termos, owners, capacidade, cobrança, entrega remota ou dados reais.

## D-019 — Cadastro e acesso públicos falham fechado no G0

- **Data:** 2026-08-04
- **Onda:** preparação da superfície pública / sem avanço de gate
- **Decisão:** impedir cadastro, vinculação e login quando a configuração Supabase estiver ausente, contiver chave secreta ou for bloqueada pelo `dataGate`; apresentar estado explícito e apontar para o Sprint assistido.
- **Motivo:** a interface permitia preencher o onboarding e só então exibia erro genérico, embora o runtime G0 proíba transporte remoto. Isso gerava falsa expectativa, retinha rascunho local desnecessário e ocultava um controle de segurança válido.
- **Alternativas consideradas:** remover o gate; configurar Supabase remoto sintético sem nova política; ocultar todas as jornadas; manter o erro genérico; integrar autenticação externa; ou preservar as jornadas demonstrativas com mutações bloqueadas e explicação clara. Foi escolhida a última opção por manter valor de demonstração e segurança fail-closed.
- **Risco principal:** bloquear desenvolvimento local autorizado. A mitigação exige configuração completa, chave publicável e `dataGate` verde antes de liberar operações.
- **Rollback:** reverter notice, preflight de disponibilidade e validação de chave; o `dataGate` permanece como última barreira.
- **Aceite:** nenhuma chamada de cadastro/login ou rascunho de provisionamento ocorre no runtime bloqueado; chave `sb_secret_` nunca chega ao cliente Supabase; local sintético autorizado continua disponível; testes, typecheck e build passam.
- **Resultado esperado:** superfície pública honesta e recuperável, sem habilitar backend remoto, dados reais, cobrança ou Onda 1.

## D-020 — Fluxos públicos de pesquisa também falham fechado no G0

- **Data:** 2026-08-07
- **Onda:** Onda 0 / hardening da superfície pública
- **Decisão:** impedir lookup de convite, validação de campanha e envio de resposta quando o runtime Supabase não estiver disponível; renderizar um estado explícito de pesquisa indisponível.
- **Motivo:** o `dataGate` já bloqueava o transporte, mas as rotas públicas ainda iniciavam RPC e podiam deixar rejeições não tratadas ou loading sem fim no preview bloqueado.
- **Alternativas consideradas:** depender apenas do `dataGate`; habilitar backend remoto sintético; ocultar as jornadas; criar mock de respostas; criar uma camada genérica nova; ou adicionar preflight local nas duas rotas. Foi escolhida a última opção por ser reversível, pequena e compatível com o G0.
- **Risco principal:** bloquear uma pesquisa local sintética configurada corretamente. A mitigação é manter a decisão baseada em `supabaseRuntimeAvailability`, que continua permitindo somente o destino local sintético autorizado.
- **Rollback:** reverter os preflights e o aviso específico de pesquisa; o `dataGate` permanece como última barreira de transporte.
- **Aceite:** runtime bloqueado não chama `invitation_lookup`, `validate_invitation` ou `submit_response`; a interface comunica o bloqueio; testes direcionados e typecheck passam.
- **Resultado esperado:** convite e resposta anônima não aparentam estar disponíveis em preview G0 sem backend autorizado, sem transformar bloqueio de interface em autorização de dados reais.

## D-021 — Fechamento técnico do PR #43 sem avanço de gate

- **Data:** 2026-08-11
- **Onda:** Onda 0 / fechamento técnico pós-merge
- **Decisão:** integrar o hardening fail-closed dos fluxos públicos de pesquisa, o núcleo puro local de execução de ações e as correções de dependências somente após CI verde, mantendo o produto em modo local e sintético.
- **Motivo:** concluir a fatia técnica autorizada e tornar seu limite auditável sem confundir mecanismo de domínio com persistência, autorização server-side ou aceite institucional.
- **Evidência:** [PR #43](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/43), [CI pós-merge 31520496658](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/31520496658), `docs/execution/ADR_NR1_EXECUTION_CORE_MVP.md` e `docs/execution/NR1_MVP_WAVE1_PURE_CORE_EVIDENCE.md`.
- **Limite:** esta decisão não aprova a ADR, schema, migration, RPC, RLS, scoring, instrumento, retenção, storage, uso de IA, dados reais ou gate posterior.
- **Resultado:** `main` está no SHA `6d4e595`; `sale_blocked` permanece ativo e a Onda 1 continua não autorizada até revisão e aprovação formal.

## D-022 — Aprovação da fatia sintética command-only sem autorização de migration

- **Data:** 2026-08-11
- **Onda:** Onda 0 / preparação técnica da Onda 1
- **Decisão:** registrar a aprovação do solicitante para implementar e testar localmente o contrato sintético RPC/RLS do núcleo de ações, mantendo a persistência remota e o gate sob revisão formal.
- **Motivo:** transformar a aprovação em uma fatia verificável de autorização, tenant isolation, concorrência, idempotência e separação de saída coletiva antes de tocar no schema legado.
- **Evidência:** `docs/execution/NR1_MVP_RPC_RLS_CONTRACT_G0.md`, `src/lib/actions/actionCommandContract.ts` e seus testes.
- **Limite:** a aprovação é da fatia local. Não equivale à aprovação completa dos critérios da ADR nem autoriza migration, RPC/RLS em Supabase, grants, storage, dados reais, scoring, instrumento, retenção ou avanço de gate.
- **Rollback:** remover o módulo, testes e evidência local; nenhum estado externo foi criado.
- **Resultado:** contrato sintético implementado para revisão; `sale_blocked` permanece ativo, G0 continua vigente e a Onda 1 continua não autorizada.

## D-023 — Integração do contrato command-only sem promoção de gate

- **Data:** 2026-08-12
- **Onda:** Onda 0 / fechamento técnico da preparação da Onda 1
- **Decisão:** integrar o contrato sintético de comando do núcleo de ações na `main` após CI verde, mantendo a distinção entre mecanismo local, autorização server-side futura e aprovação formal da ADR.
- **Motivo:** tornar o boundary de tenant, papel, concorrência, idempotência e `k ≥ 5` rastreável no release sem tocar no schema legado ou habilitar operações remotas.
- **Evidência:** [PR #46](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/pull/46), [CI pós-merge 31555525769](https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol/actions/runs/31555525769), `docs/execution/NR1_MVP_RPC_RLS_CONTRACT_G0.md` e `E-049`–`E-054`.
- **Limite:** esta decisão não aprova migration, RPC/RLS, grants, storage, retenção, scoring, instrumento, IA, dados reais, gate G1 ou a aprovação formal completa da ADR.
- **Resultado:** `main` está no SHA `7570396`; G0 permanece vigente, `sale_blocked` permanece ativo e a Onda 1 continua não autorizada.
