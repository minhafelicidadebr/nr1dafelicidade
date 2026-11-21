# WS-04 — Criteria Engine contextual e versionado

## Resultado

Foi implementada uma vertical preliminar para avaliação contextual de risco: achado AEP aprovado → versão de critérios aprovada → cálculo reproduzível → override técnico evidenciado → revisão independente → materialização service-only.

O seed `criteria-g2-2026.06-draft` permanece em estado `draft`. Nenhuma fórmula, banda ou redução por controle foi aprovada para uso real, e o cálculo legado baseado em percentual/catálogo permanece desabilitado.

## Decisão Fable 5

Lentes consideradas: SST/ergonomia, metodologia, privacidade, arquitetura, produto e auditabilidade.

Alternativas avaliadas:

- manter o cálculo legado por percentual e severidade de catálogo: rejeitado por não representar o trabalho real;
- calcular diretamente no React: rejeitado por falta de governança, reprodutibilidade e controle de acesso;
- publicar uma matriz fixa como regra aprovada: rejeitado porque faltam fontes e aceites técnicos;
- simular somente a interface: insuficiente para provar estados, permissões e trilha de revisão;
- integrar um motor externo: adiado até existirem requisitos e fornecedor verificáveis;
- mecanismo puro mais configuração versionada e execução server-side: escolhido como draft seguro e reutilizável.

Principal risco residual: a fórmula proposta não possui aprovação metodológica/regulatória; migrações e testes PostgreSQL passaram apenas em ambiente local descartável.

## Fluxo e estados

Versão de critérios: `draft → review → approved → retired`.

Avaliação contextual: `draft → computed → technical_review → approved → superseded`.

1. somente achado AEP aprovado e ciclo fechado com `n ≥ k` podem originar avaliação;
2. AET aprovada/encerrada pode complementar o contexto, mas não é inferida por score;
3. severidade usa consequências contextuais justificadas e referenciadas;
4. probabilidade bruta usa intensidade, duração, frequência e abrangência, com sinais coletivos opcionais;
5. controle só reduz probabilidade quando há evidência de implementação, manutenção, eficácia e confiança mínima;
6. override exige campo, valor, justificativa, fonte e autoria, preservando o valor original;
7. entrada, saída, overrides, fórmula e versão compõem snapshot reproduzível;
8. autor não pode aprovar o próprio snapshot;
9. somente avaliação aprovada pode ser materializada em `risk_scores`;
10. relatórios continuam preliminares até revisão e assinatura competente.

## Invariantes

- tabelas de critérios, avaliações, overrides e ledgers são service-only;
- o seed do repositório é deliberadamente não aprovado e não executa cálculo;
- aprovação dos critérios exige SST e metodologia, com duas pessoas distintas;
- critérios aprovados, snapshots em revisão e ledgers são imutáveis;
- score coletivo não define sozinho severidade ou probabilidade;
- controle declarado não reduz risco;
- severidade não é reduzida pela existência de controle;
- origem AEP, tenant, ciclo, `k` e eventual AET são validados no servidor;
- toda materialização referencia a avaliação contextual aprovada;
- o cálculo legado falha fechado.

## Evidências

- mecanismo puro: `src/lib/risk/criteriaEngine.ts`;
- configuração de domínio: `src/data/criteriaPolicy.ts`;
- migração: `supabase/migrations/20260623063000_contextual_criteria_engine_g2.sql`;
- API: `src/lib/api/criteriaEngine.ts`;
- interface: `src/pages/app/CriteriaEnginePage.tsx`;
- testes de mecanismo: `src/lib/risk/criteriaEngine.test.ts`;
- teste estático: `src/test/criteriaEngineMigration.test.ts`;
- contrato SQL: `supabase/tests/criteria_engine_contract.sql`.

## Critérios de aceite

- [x] mecanismo separado da configuração de domínio;
- [x] versão draft falha fechada;
- [x] origem em achado AEP aprovado e `k ≥ 5` no servidor;
- [x] contexto de severidade e exposição com justificativa e fonte;
- [x] controle sem evidência não reduz risco;
- [x] override técnico append-only com valor original, justificativa e fonte;
- [x] snapshot, hash, revisão independente e estados monotônicos;
- [x] isolamento multi-tenant e tabelas service-only;
- [x] materialização somente após aprovação;
- [x] cálculo legado desabilitado;
- [x] 21 testes TypeScript/estáticos aprovados localmente;
- [x] 36 asserções pgTAP definidas;
- [x] migração e 36 asserções pgTAP executadas em banco novo local;
- [ ] fórmula, dimensões e bandas validadas por SST/Ergonomia e metodologia;
- [ ] fontes primárias e decisão técnica registradas;
- [ ] teste de usabilidade e revisão regulatória independente;
- [ ] gate anterior formalmente aceito.

Esta fatia conclui a ação 19 em código como draft bloqueado. Não autoriza `WS-05`, piloto, campanha ou dados reais sem as evidências e aprovações de gate.
