# Onda 1Q — Contrato do Readiness & Governance Sprint

Data: 18/07/2026
Classificação: MASTER

## Objetivo

Executar a primeira fatia verificável do plano de elevação SaaS: transformar a receita-ponte recomendada em uma oferta pública assistida, sintética e auditável, sem converter preparação em autorização de venda.

## Evidência de entrada

- `EVIDENCE_LEDGER_APP_A_SAAS.md`: confirma os gates G0/G1, o evaluator comercial fail-closed e a ausência de CRM, billing live e operação produtiva.
- `RESUMO_EXECUTIVO_APP_A_PROMOCAO_SAAS.md`: recomenda receita-ponte sem dados de trabalhadores e mantém SaaS real bloqueado.
- `PLANO_ELEVACAO_180_APP_A_SAAS_PREMIUM.md`: define o Readiness & Governance Sprint, seu dossiê, escopo e exclusões.
- `AVALIACAO_SISTEMICA_180_APP_A_SAAS_2026-07-18.md`: classifica o Sprint como comercializável somente depois de aprovação formal comercial/jurídica.

## Decisão

| Alternativa | Resultado |
|---|---|
| Apenas renomear a copy comercial | Insuficiente: não protege escopo, exclusões ou estado de autorização. |
| Criar checkout, CRM ou cobrança | Rejeitada: amplia o escopo e viola os bloqueios G1 atuais. |
| Criar um motor genérico de ofertas | Adiada: complexidade sem retorno para a primeira fatia. |
| Contrato específico, puro e derivado do evaluator existente | Escolhida: formaliza a oferta de receita-ponte sem duplicar a autorização comercial. |

## Implementado

- `src/lib/commercial/readinessGovernanceSprint.ts` define os controles mínimos de escopo e exclusões e deriva somente quatro estados: bloqueado, escopo disponível, revisão formal requerida e autorização formal registrada.
- `src/data/g1ReadinessGovernanceSprint.ts` registra a oferta, o dossiê, oito itens de escopo e seis exclusões obrigatórias.
- `src/components/sales/ReadinessGovernanceSprintCard.tsx` torna a proposta verificável na superfície pública e mostra o estado atual sem CTA de compra.
- `src/pages/SalesPage.tsx` substitui o rótulo genérico de Sprint Design Partner pelo Readiness & Governance Sprint e usa o contrato como fonte da narrativa comercial.
- Testes focados provam que a remoção de uma exclusão falha fechado e que o estado G1 atual continua sem autorização de venda.
- `e2e/public-lead-intake.spec.ts` acompanha a nova nomenclatura, o novo heading e o novo identificador de rota sem afrouxar as asserções de retenção, acessibilidade ou exclusão local.

## Estado atual confirmado

| Capacidade | Estado |
|---|---|
| Publicar o escopo sintético | Disponível |
| Preparar revisão formal | Disponível |
| Vender o serviço pago | Não autorizado |
| Iniciar operação remota, CRM, checkout ou cobrança | Bloqueado |
| Dados de trabalhadores, scoring, diagnóstico, PGR ou laudo | Fora de escopo e bloqueados |

## Não implementado deliberadamente

- preço, tributos, proposta, contrato, DPA, assinatura, cobrança ou reembolso;
- CRM, calendário, e-sign, integração externa ou envio de dados;
- coleta de dados pessoais ou de trabalhadores;
- instrumento, licença, scoring, avaliação NR-1, PGR, AEP, AET, laudo ou claim de conformidade;
- avanço de G1, G2 ou G3 e qualquer ativação de SaaS real.

## Próximo gate humano

Comercial, Jurídico, Entrega e Financeiro precisam registrar preço/termos, alçadas, capacidade, faturamento, suporte e aceite com evidência verificável. Até isso ocorrer, o contrato só permite escopo público e preparação local para revisão.

## Validação executada

- testes focados: 3 arquivos e 13 testes aprovados;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado sem erros; permanece um aviso pré-existente de Fast Refresh em `src/components/PDFGenerator.tsx`;
- `npm run check:type-strictness`: aprovado, baseline preservada em 10 usos explícitos de `any`;
- `npm run test:repro`: 93 arquivos e 469 testes aprovados em 264,64 s, dentro do orçamento de 300 s;
- `npm run build`: aprovado; permanece o aviso conhecido de chunk acima de 500 kB;
- `npm run check:bundle`: aprovado, 71 chunks dentro do orçamento configurado.
- Playwright focado em `e2e/public-lead-intake.spec.ts`: 4/4 perfis aprovados em 48,4 s, usando porta local isolada porque a porta padrão já estava ocupada;
- `npm run audit:pr-scope`: aprovado; 48 arquivos no range empilhado, sem caminhos sensíveis, duplicados ou fora do manifesto.

## Rollback

Reverter o contrato, catálogo, componente, integração da página e testes desta onda remove a superfície sem tocar em banco, migrations, integrações, dados, billing ou gates.
