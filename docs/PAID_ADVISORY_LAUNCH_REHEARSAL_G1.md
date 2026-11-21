# Ensaio de lançamento da primeira proposta paga — G1

Data: 14/07/2026

## Problema, usuário e evidência

Problema: a oferta assistida possui escopo e pacote de autorização preparados, mas um rascunho comercial pode induzir preço inventado, uso prematuro de dados reais, envio sem alçada ou confusão entre ensaio técnico e autorização de venda.

Usuários: sponsor comercial, Jurídico, responsável pela entrega, Financeiro/Administrativo e revisor independente do release manual.

Resultado operacional: permitir um ensaio local e inteiramente sintético da primeira proposta, com template versionado, situações adversariais e comprovante somente em memória, sem destinatário, preço, assinatura, cobrança ou entrega.

Evidência: contrato puro fail-closed, catálogo sem dados reais, interface acessível no workspace protegido e testes do caminho atual, do caminho hipotético aprovado e das principais violações.

## Lentes aplicadas

- Produto/comercial: qualidade da proposta, clareza do comprador, escopo, entregáveis, aceite e próxima decisão humana.
- Jurídico/financeiro: preço, moeda, tributos, validade, pagamento, responsabilidade, cancelamento e assinatura permanecem placeholders.
- Segurança/privacidade: modo sintético obrigatório, zero persistência, zero transporte remoto, zero destinatário externo e zero dado real.
- Operação/UX: preflight explícito, seis decisões adversariais, feedback contextual, reset e comprovante que desaparece no reload.
- Arquitetura: mecanismo comercial específico e puro, composto com o pacote de autorização sem criar workflow, banco ou integração.

## Decisão Fable 5 — Master Plus

Escala 0–10; em custo, risco e complexidade, maior representa condição mais favorável. Total máximo: 90.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Checklist estático e um booleano de ensaio | 6 | 7 | 9 | 6 | 6 | 4 | 9 | 4 | 9 | 60 |
| B | Ensaio comercial específico, puro e composto com autorização | 10 | 10 | 8 | 9 | 9 | 8 | 8 | 8 | 8 | 78 |
| C | Manter somente documentação da proposta | 4 | 7 | 10 | 6 | 5 | 3 | 10 | 3 | 10 | 58 |
| D | Adiar o ensaio até G3 | 2 | 10 | 10 | 9 | 4 | 2 | 10 | 2 | 2 | 51 |
| E | Integrar CRM, assinatura e billing agora | 7 | 5 | 2 | 3 | 6 | 8 | 2 | 9 | 3 | 45 |
| F | Criar engine genérica de ensaios e aprovações | 7 | 8 | 4 | 6 | 8 | 10 | 4 | 9 | 4 | 60 |

Decisão: **ramo B**. A competência comercial difere do ensaio do facilitador e merece contrato próprio, mas ainda não há repetição suficiente para justificar uma engine genérica. Integrações externas ampliariam superfície de dados e autoridade antes dos responsáveis formais.

## Template versionado

Referência: `paid-advisory-proposal-g1@2026-07-14.1-internal-draft`.

Seções controladas:

1. contexto do comprador — somente empresa e situação fictícias;
2. escopo e exclusões;
3. entregáveis;
4. fronteiras regulatórias, clínicas, jurídicas e de dados;
5. cronograma condicionado à aprovação e capacidade;
6. condições comerciais sem valores;
7. critérios de aceite e evidências;
8. cancelamento e responsabilidade sujeitos ao Jurídico;
9. governança dos quatro papéis;
10. assinatura e liberação exclusivamente humanas.

Onze campos permanecem apenas como chaves sem valor: comprador, data, validade, preço, moeda, tributos, pagamento e responsáveis Comercial, Jurídico/evidência, Entrega e Financeiro.

## Fluxo e estados

1. O pacote de autorização e a sala de decisão precisam estar completos para revisão interna, sem implicar convocação ou aceite.
2. O operador confirma quatro fronteiras: somente ficção, nenhum termo improvisado, nenhum envio/assinatura/cobrança e nenhum claim de autorização.
3. O avaliador bloqueia dados reais, persistência, transporte remoto e destinatário externo.
4. Seis situações testam privacidade, preço, assinatura, claim regulatório, integração e conversão prematura em piloto.
5. Todas as respostas alinhadas permitem gerar comprovante local do ensaio.
6. Sem autorização de venda, campos comerciais aprovados e destinatário validado, o comprovante é obrigatoriamente `no_go`.
7. Mesmo com todos os insumos hipoteticamente aprovados, o máximo técnico é `ready_for_human_release_review`.
8. `canSendProposal` e `canStartDelivery` são sempre falsos; envio e início de entrega não são capacidades deste mecanismo.

| Estado | Significado | Efeito permitido |
|---|---|---|
| `blocked` | Preflight, template, catálogo ou contexto inseguro | Nenhum ensaio |
| `ready_for_internal_rehearsal` | Fronteiras confirmadas | Responder às situações locais |
| `in_progress` | Decisões incompletas ou desalinhadas | Revisar e continuar |
| `complete_no_go` | Ensaio concluído, autorizações pendentes | Emitir recibo somente em memória |
| `complete_ready_for_human_release_review` | Ensaio e insumos aprovados | Solicitar revisão humana; não enviar |

## Estado atual

| Controle | Estado atual |
|---|---|
| Template da proposta | Versionado e completo como rascunho interno |
| Situações adversariais | 6/6 catalogadas |
| Pacote para revisão da autorização | Pronto |
| Papéis formalmente autorizados | 0/4 |
| Decisões formalmente aprovadas | 0/4 |
| Campos comerciais | Não aprovados; placeholders sem valor |
| Comprador e destinatário | Não definidos nem aprovados |
| Resultado após ensaio completo | `complete_no_go` |
| Envio, assinatura, cobrança e entrega | Indisponíveis |

## Implementação

- `src/lib/commercial/paidAdvisoryLaunchRehearsal.ts`: estados, blockers, avaliação e recibo fail-closed.
- `src/data/g1PaidAdvisoryLaunchRehearsal.ts`: política, template e seis situações inteiramente sintéticas.
- `src/components/governance/PaidAdvisoryLaunchRehearsalCard.tsx`: preflight, decisões, feedback, reset e recibo em memória.
- `src/pages/app/ExternalReadinessWorkspacePage.tsx`: composição no workspace autenticado após o pacote de autorização.
- testes cobrem No-Go atual, caminho hipotético de revisão humana, resposta incorreta, contexto inseguro, catálogo inválido, recibo e interação acessível.

## Critérios de aceite

- Nenhum campo aceita nome, e-mail, empresa, preço, termo ou outro dado livre.
- O ensaio não inicia antes das quatro confirmações.
- Contexto inseguro falha fechado antes das situações.
- Resposta incorreta não produz recibo.
- Recibo só existe em memória e registra proposta não emitida, venda não autorizada e entrega não iniciada.
- Autorizações hipotéticas não transformam revisão humana em envio automático.
- Reset ou reload revoga todo o estado da interação.
- Testes focados, suíte completa, typecheck, lint, build, bundle e auditoria de escopo devem permanecer verdes.

## Riscos residuais

- O mecanismo não valida preço, impostos, contrato, identidade, alçada, capacidade ou conta de faturamento.
- Pessoas ainda podem copiar o rascunho fora do sistema; isso exige processo e revisão humana organizacional.
- Um ensaio bem-sucedido comprova apenas aderência às condutas simuladas, não competência jurídica, SST, financeira ou comercial.
- A primeira venda assistida ainda depende de quatro papéis e quatro decisões formais fora deste fluxo.
- SaaS, piloto, dados reais, CRM, assinatura e billing continuam fora do escopo G1.

## Rollback

Remover mecanismo, catálogo, card, testes, composição no workspace e este documento. Não há banco, migration, dado, destinatário, integração, assinatura, cobrança ou aprovação a reverter.

## Limites

Este ensaio não é proposta, contrato, orçamento, aceite, autorização de venda, parecer jurídico, aprovação SST, aprovação de gate ou permissão para dados reais. O comprovante local não deve ser apresentado a cliente como evidência de autorização.
