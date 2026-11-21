# Evidência da Onda 1 — máquina de estados pura

- Data: 07/08/2026
- Estado: `implementado-local`
- Modo: `MASTER`

## Escopo entregue

Foi implementado o mecanismo puro do núcleo de execução de ações, sem Supabase, React, storage, secrets, migration ou dados reais.

Arquivos:

- `src/lib/actions/actionExecutionCore.ts`;
- `src/lib/actions/actionExecutionCore.test.ts`.

## Contratos cobertos

- estados monotônicos: `draft → planned → approved → in_progress → under_review → verified`;
- resultado alternativo `corrective_required` para eficácia parcial/ineficaz;
- cancelamento justificado, sem reabertura da ação histórica;
- ausência de estado direto `done`;
- origem, tipo de intervenção, responsável, prazo, método de monitoramento e resultado esperado antes do planejamento/aprovação;
- evidência e medição obrigatórias antes da revisão;
- revisor e justificativa obrigatórios para verificação;
- revisor distinto do executor em prioridades alta/crítica;
- `expectedVersion` para rejeitar transição obsoleta;
- evento de transição com versão, ator, data, origem, destino e resultado de eficácia;
- nenhuma mutação do snapshot original em caso de falha.

## Verificações executadas

| Comando | Resultado |
|---|---|
| `npm test -- src/lib/actions/actionExecutionCore.test.ts` | 1 arquivo, 9 testes aprovados. |
| `npm run typecheck` | Aprovado. |
| `npx eslint src/lib/actions/actionExecutionCore.ts src/lib/actions/actionExecutionCore.test.ts` | Aprovado. |

## O que ainda não está implementado

- autorização por papel no servidor;
- RPC, RLS, trigger e ledger persistente;
- entidades persistentes de evidência, medição e revisão;
- vínculo real com `action_items`, AEP/AET ou documentos;
- interface e estados de loading/erro/conflito;
- testes pgTAP e cross-tenant;
- upload/storage, malware scanning, retenção e restore;
- uso com dados reais ou avanço de gate.

## Risco residual

O mecanismo puro não é uma barreira de segurança por si só. Um consumidor pode ignorá-lo até que a próxima fatia coloque a transição atrás de um comando server-side autorizado. Por isso, esta evidência demonstra o contrato de domínio, não a segurança ou a persistência do produto.

## Próximo passo

Após aprovação da ADR da Onda 0, desenhar e testar o contrato RPC/RLS da Onda 1 em ambiente sintético. A migration continua condicionada a autorização explícita e revisão de rollback.
