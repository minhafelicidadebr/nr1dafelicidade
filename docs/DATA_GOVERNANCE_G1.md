# WS-01 — Governança do ciclo de vida dos dados

## Decisão

A matriz de retenção, acesso, descarte e incidentes foi implementada como capacidade versionada e **fail-closed**. O seed é estrutural e permanece em `draft`: não define prazo legal, base legal ou autorização por conta própria.

Foram consideradas as lentes de privacidade/segurança, jurídico-regulatório, SST, arquitetura e operação. Entre política apenas documental, automação imediata de descarte, integração externa e mecanismo genérico versionado, foi escolhido o mecanismo genérico com gates server-side. Automação destrutiva foi adiada até existir política aprovada e teste operacional.

## Estados e controles

- política: `draft → review → approved → retired`;
- descarte: `requested → approved → executing → completed|failed`, com cancelamento controlado;
- acesso emergencial: `requested → approved|denied → expired|revoked`;
- incidente: `detected → contained|investigating → resolved → closed`;
- hold legal: `active → released`.

Políticas aprovadas, regras, aprovações e ledgers tornam-se imutáveis. Descarte e acesso emergencial exigem solicitante e aprovador diferentes. Acesso emergencial expira em até quatro horas, permanece service-only e não cria RPC para ler respostas.

## Invariantes

- sete classes de dados obrigatórias;
- prazo e fundamento de retenção explícitos por classe;
- método de descarte explícito;
- microdados de resposta sempre service-only e não exportáveis;
- quatro disciplinas de aprovação: DPO, Jurídico, Segurança e SST, com ao menos duas pessoas;
- matriz canônica protegida por SHA-256;
- hold legal impede descarte;
- conclusão de descarte exige evidência com hash;
- resolução de incidente exige data e referência ao runbook;
- campanha, convite e materialização de risco dependem de política organizacional aprovada;
- nenhuma política do repositório autoriza dados reais atualmente.

## Evidências

- mecanismo: `src/lib/governance/dataLifecycle.ts`;
- configuração honesta: `src/data/dataLifecyclePolicy.ts`;
- migração: `supabase/migrations/20260623033000_data_governance_g1.sql`;
- RPC: `src/lib/api/dataGovernance.ts`;
- interface: `src/pages/app/GovernancePage.tsx`;
- testes de domínio: `src/lib/governance/dataLifecycle.test.ts`;
- teste estático: `src/test/dataGovernanceMigration.test.ts`;
- contrato pgTAP: `supabase/tests/data_governance_contract.sql`.
- exercício lógico de descarte e recuperação: `supabase/tests/data_lifecycle_recovery.sh`.

## Critérios de aceite

- [x] mecanismo e máquinas de estado implementados;
- [x] tabelas sensíveis e ledgers service-only;
- [x] política draft sem decisões legais inventadas;
- [x] dupla aprovação, expiração e hold legal impostos no banco;
- [x] gate de campanha e saídas sensíveis imposto no banco;
- [x] tela segura expõe apenas estado e matriz não sensível;
- [x] testes TypeScript, estáticos e pgTAP definidos;
- [x] migração e 26 asserções pgTAP executadas em banco novo local;
- [ ] prazos, bases, responsáveis e métodos aprovados pelo controlador/DPO/Jurídico;
- [ ] runbook exercitado com tempos de detecção, contenção, revogação e comunicação;
- [x] descarte e restore lógico testados em ambiente sintético com hash canônico e detecção de adulteração;
- [ ] revisão independente de segurança e privacidade.

Até o aceite integral, **o gate retorna bloqueio e dados reais permanecem proibidos**.
