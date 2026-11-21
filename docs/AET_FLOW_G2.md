# WS-03 — Fluxo técnico AET

## Resultado

Foi implementada uma vertical AET completa em estado preliminar: gatilho AEP explícito → escopo e responsável → execução e evidências → achados → recomendações acionáveis → revisão independente → aprovação → encerramento.

A AET nunca nasce de score, IA, cor de dashboard ou diagnóstico automático. O protocolo `aet-g2-2026.06-draft` requer validação do responsável de SST/Ergonomia antes de qualquer uso controlado.

## Decisão Fable 5

Lentes consideradas: SST/ergonomia, privacidade, jurídico-regulatório, arquitetura, produto e operação.

Alternativas avaliadas:

- transformar o gatilho em checklist: rejeitado por baixa rastreabilidade;
- gerar AET automaticamente após score: rejeitado por violar julgamento técnico;
- anexar texto livre à AEP: rejeitado por ausência de estados, revisão e evidência;
- fluxo técnico versionado: escolhido;
- integração com software externo: adiada até requisitos e fornecedor;
- abstrair em workflow genérico: mecanismo reutilizável, mantendo configuração AET separada.

Principal risco residual: migração e testes PostgreSQL passaram localmente, mas o protocolo ainda precisa de validação profissional externa.

## Fluxo e estados

Gatilho: `open → accepted → completed|dismissed`.

AET: `draft → scoped → in_progress → technical_review → approved → closed`, com `superseded` para substituição versionada.

1. somente gatilho AEP aberto cria AET;
2. escopo, método e responsável pertencem ao mesmo tenant;
3. execução exige observação e participação de trabalhadores/CIPA;
4. achados registram determinantes, variabilidades e consequências possíveis;
5. cada achado se liga a evidências;
6. cada achado exige recomendação com responsável, prazo, justificativa e resultado esperado;
7. recomendação cria `action_item` rastreável;
8. revisão congela conteúdo e gera SHA-256 canônico;
9. autor não pode aprovar o próprio trabalho;
10. encerramento exige síntese e completa o gatilho original.

## Invariantes

- tabelas AET são service-only; interface usa RPCs delimitadas;
- autor, responsável e revisor pertencem à organização;
- conteúdo individual sensível é proibido;
- evidências, achados e recomendações ficam imutáveis em revisão;
- ledger de revisão é append-only;
- recomendação e action item pertencem ao mesmo ciclo e organização;
- vínculo opcional de risco com `aet_finding_id` aceita somente achado de AET aprovada/encerrada;
- documento permanece preliminar até revisão independente;
- aprovação não garante conformidade e não substitui responsabilidade profissional.

## Evidências

- mecanismo: `src/lib/work/aetAssessment.ts`;
- migração: `supabase/migrations/20260623053000_aet_flow_g2.sql`;
- API: `src/lib/api/aetAssessment.ts`;
- interface: `src/pages/app/AetAnalysisPage.tsx`;
- teste de domínio: `src/lib/work/aetAssessment.test.ts`;
- teste estático: `src/test/aetFlowMigration.test.ts`;
- contrato SQL: `supabase/tests/aet_flow_contract.sql`.

## Critérios de aceite

- [x] fluxo completo e estados monotônicos;
- [x] origem obrigatória em gatilho AEP;
- [x] observação e participação obrigatórias;
- [x] achados ligados a evidências e recomendações;
- [x] recomendações geram ações atribuídas;
- [x] revisão independente, hash e imutabilidade;
- [x] isolamento multi-tenant e privacidade no servidor;
- [x] encerramento completa o gatilho original;
- [x] testes TypeScript, estáticos e pgTAP definidos;
- [x] migração e 34 asserções pgTAP executadas em banco novo local;
- [ ] protocolo validado por SST/ergonomista responsável;
- [ ] anexos seguros e inspeção de malware;
- [ ] teste de usabilidade com profissionais e participação representativa;
- [ ] revisão regulatória independente.

Esta fatia conclui a ação 18 em código, mas **não autoriza piloto ou dados reais**.
