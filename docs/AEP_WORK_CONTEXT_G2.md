# WS-03 — AEP e trabalho real

## Resultado

Foi implementada uma vertical de evidência contextual: criar AEP preliminar, delimitar atividade/posto/grupo, registrar observação e participação sem conteúdo individual, documentar achado completo, sinalizar aprofundamento AET com tarefa e submeter o conjunto a revisão independente.

O fluxo não gera laudo, não faz diagnóstico, não substitui AET e não insere risco no inventário a partir de score isolado.

## Decisão Fable 5

Lentes consideradas: SST/ergonomia, privacidade, jurídico-regulatório, arquitetura, produto e operação.

Alternativas avaliadas:

- checklist simples: rejeitado por não produzir evidência rastreável;
- formulário livre: rejeitado pelo risco de conteúdo individual e baixa comparabilidade;
- fluxo versionado e contextual: escolhido;
- automatizar decisão AET: rejeitado; a indicação exige julgamento técnico;
- integrar ferramenta externa de ergonomia: adiado até requisitos e fornecedor serem definidos;
- abstrair como evidência genérica: mecanismo preparado, mantendo configuração AEP separada.

Principal risco residual: o protocolo `aep-g2-2026.06-draft` ainda requer validação por responsável competente e execução real no PostgreSQL.

## Fluxo

1. gestor/SST autorizado cria AEP vinculada a organização, ciclo, unidade e contexto;
2. estado inicia em `draft` e avança para `collecting_evidence`;
3. evidências registram método, fonte, data, autor e síntese organizacional;
4. observação do trabalho real e participação de trabalhadores/CIPA são obrigatórias;
5. achado registra perigo, fonte geradora, circunstância, duração, frequência, grupo exposto e agravo possível;
6. cada achado se vincula a evidências do mesmo assessment;
7. possível necessidade de AET gera registro e tarefa com responsável e prazo;
8. ao entrar em `technical_review`, o conteúdo é congelado e recebe SHA-256;
9. somente revisor diferente do autor pode aprovar;
10. aprovado pode apenas ser substituído por nova versão; histórico permanece append-only.

## Invariantes

- tabelas contextuais são service-only; usuários usam RPCs delimitadas;
- contexto, unidade, ciclo, responsável e evidências respeitam tenant;
- conteúdo individual sensível é proibido nesse fluxo;
- revisão exige observação, participação e achado contextual completo;
- materialização de risco exige `aep_finding_id` pertencente a AEP aprovada do mesmo ciclo;
- risco não nasce apenas de questionário ou cor de score;
- indicação AET cria tarefa, mas não declara automaticamente que AET é necessária;
- relatórios e avaliações permanecem preliminares até revisão competente.

## Evidências

- mecanismo: `src/lib/work/assessment.ts`;
- protocolo draft: `src/data/aepProtocol.ts`;
- migração: `supabase/migrations/20260623043000_aep_work_context_g2.sql`;
- API: `src/lib/api/workAssessment.ts`;
- interface: `src/pages/app/WorkAnalysisPage.tsx`;
- testes de domínio: `src/lib/work/assessment.test.ts`;
- teste estático: `src/test/aepMigration.test.ts`;
- contrato SQL: `supabase/tests/aep_work_context_contract.sql`.

## Critérios de aceite

- [x] máquina de estados implementada;
- [x] observação e participação obrigatórias para aprovação;
- [x] achado contextual completo e ligado a evidências;
- [x] revisão independente, hash e imutabilidade;
- [x] privacidade e isolamento multi-tenant impostos no servidor;
- [x] gatilho AET cria tarefa atribuída;
- [x] risco futuro exige achado AEP aprovado;
- [x] interface cobre vazio, coleta, bloqueadores, revisão e aprovação;
- [x] testes TypeScript, estáticos e pgTAP definidos;
- [x] migração e 33 asserções pgTAP executadas em banco novo local;
- [ ] protocolo e campos validados por SST/ergonomista;
- [ ] teste de usabilidade com profissionais e representantes dos trabalhadores;
- [ ] anexos seguros, malware scanning e política de armazenamento implementados;
- [ ] fluxo AET completo com escopo, achados, recomendações e encerramento.

Esta fatia implementa a ação 17 e apenas a entrada controlada da ação 18. **Não autoriza piloto real.**
