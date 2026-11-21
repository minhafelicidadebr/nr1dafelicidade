# WS-02 — Instrument Registry e gate metodológico

## Decisão

Nenhuma campanha pode abrir, emitir convites, produzir score ou alimentar histórico sem uma versão de instrumento com fonte e licença verificadas, definição canônica íntegra, scoring server-side, runtime pronto e aprovação auditável.

O questionário encontrado no snapshot foi registrado honestamente como `exploratory_psychosocial_screening@0.1.0-draft`. Ele não é apresentado como COPSOQ/SRQ-20 validado, não possui licença ou fonte verificadas e permanece bloqueado.

## Invariantes

- estados permitidos: `draft → review → approved → retired`;
- versão aprovada é imutável;
- aprovação exige autor, data, justificativa, fonte, licença e população-alvo;
- contagens declaradas de itens e subescalas precisam corresponder aos registros;
- o SHA-256 é calculado sobre definição JSON canônica no banco;
- a função de scoring deve existir no servidor;
- ciclos carregam uma versão imutável de instrumento;
- somente versão aprovada e runtime-ready pode abrir ciclo;
- convites, scores e histórico repetem a validação no servidor;
- eventos de revisão são append-only e service-only.

## Modelo implementado

- `instruments`: identidade conceitual e proveniência;
- `instrument_versions`: versão semântica, status, hash, scoring e aprovação;
- `instrument_subscales`: estrutura e regras de subescala;
- `instrument_items`: texto, ordem, respostas e reverse scoring;
- `instrument_review_events`: ledger imutável das transições;
- `cycles.instrument_version_id`: vínculo metodológico obrigatório e imutável.

RPCs pequenas expõem somente o status metodológico necessário para a UI e versões aprovadas elegíveis. As tabelas do registro permanecem service-only.

## UX e alegações

- abertura de ciclo e emissão de convite exibem os bloqueadores do servidor;
- fluxo do trabalhador é neutro, sem confete, avatar, recompensa ou pressão;
- voluntariedade, limites do questionário e canal de cuidado aparecem separadamente;
- demos de instrumentos indisponíveis e alegações de SRQ-20/COPSOQ médio-longo foram removidas;
- não há promessa de anonimato absoluto, diagnóstico individual ou conformidade automática.

## Evidências

- migração: `supabase/migrations/20260623023000_instrument_registry_g1.sql`;
- domínio: `src/lib/instruments/registry.ts`;
- prontidão metodológica: `src/lib/instruments/methodologyReadiness.ts`;
- registro frontend: `src/data/instrumentRegistry.ts`;
- política metodológica: `src/data/instrumentMethodologyReadiness.ts`;
- API: `src/lib/api/instruments.ts`;
- teste de domínio: `src/lib/instruments/registry.test.ts`;
- teste de prontidão metodológica: `src/lib/instruments/methodologyReadiness.test.ts`;
- teste estático: `src/test/instrumentRegistryMigration.test.ts`;
- contrato SQL: `supabase/tests/instrument_registry_contract.sql`;
- gates de UI: `src/pages/app/CyclesPage.tsx` e `src/pages/RespondPage.tsx`.

## Matriz automatizada definida

O contrato pgTAP contém 21 asserções para privilégios, seed bloqueado, blockers metodológicos, ausência de versões aprovadas, indisponibilidade de scoring ao usuário, abertura/score negados, transição controlada e ledger append-only.

## Critérios de aceite

- [x] mecanismo de estados e elegibilidade implementado;
- [x] registro service-only e ledger append-only definidos;
- [x] seed legado classificado como rascunho não verificável;
- [x] gates server-side repetidos nos pontos críticos;
- [x] UI fail-closed e linguagem metodológica neutra;
- [x] testes TypeScript e pgTAP definidos;
- [x] migração e 21 asserções pgTAP executadas em banco novo local;
- [x] gate metodológico frontend para fonte, licença, subescalas, scoring e fixtures;
- [ ] fonte primária, licença e população-alvo verificadas;
- [ ] pacote de 26 subescalas definido e revisado independentemente;
- [ ] função de scoring server-side validada com fixtures publicadas;
- [ ] versão aprovada por responsáveis científico, SST, privacidade e segurança.

Até o aceite integral, **nenhuma versão é elegível e todas as campanhas permanecem bloqueadas**.
