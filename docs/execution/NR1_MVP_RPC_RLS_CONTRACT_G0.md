# Contrato sintético RPC/RLS — núcleo de ações — G0

**Status:** desenhado e testado localmente; não é migration, aprovação de schema, autorização de produção ou avanço de gate.

**Data:** 2026-08-11  
**ADR relacionada:** `ADR_NR1_EXECUTION_CORE_MVP.md`  
**Evidência executável:** `src/lib/actions/actionCommandContract.ts` e `src/lib/actions/actionCommandContract.test.ts`

## Objetivo e limite

Esta fatia transforma o núcleo puro de execução em um contrato de comando que uma futura RPC ou Edge Function poderá chamar dentro de uma transação. O objetivo é provar, em dados sintéticos, que uma transição:

- deriva tenant, ator e revisor do contexto server-side;
- não aceita `organizationId`, `actorId` ou `reviewerId` como autoridade do payload;
- exige papel organizacional autorizado;
- mantém respostas individuais, convites, identidade do respondente e scores fora da superfície de ações;
- rejeita concorrência obsoleta e replay do mesmo comando;
- conserva o histórico por evento, sem sobrescrever a origem da decisão.

O contrato não cria tabelas, não executa SQL, não acessa Supabase e não libera dados reais.

## Decisão verificável

| Alternativa | Uso nesta fase | Motivo |
| --- | --- | --- |
| A — RPC direta com `organization_id` no payload | Rejeitada | permitiria que o cliente tentasse escolher o tenant da autorização. |
| B — RPC transacional command-only | Contrato escolhido | deriva o tenant do registro, valida o ator no servidor e combina versão esperada com idempotência. |
| C — mock de UI/localStorage | Rejeitada | não prova a fronteira de autorização nem a semântica de concorrência. |
| D — migration imediata | Adiada | schema, grants, rollback e impacto no legado ainda exigem revisão formal. |
| E — serviço externo de workflow | Adiada | adicionaria fornecedor e custódia antes de resolver o contrato mínimo. |
| F — mecanismo genérico | Mantida | o núcleo permanece independente de COPSOQ, SRQ-20, AEP, AET e fórmulas. |

## Contrato de entrada

A futura operação é conceitualmente:

```text
advance_action(
  action_id,
  target,
  expected_version,
  command_id,
  occurred_at,
  reason,
  review_outcome,
  review_rationale
)
```

O payload não contém:

- `organization_id`;
- `actor_id`;
- `reviewer_id`;
- e-mail, nome ou identidade de trabalhador;
- resposta, convite, token, score individual ou conteúdo de crise.

O `action_id` apenas localiza o registro. A organização é lida do registro persistido; o ator é `auth.uid()`/identidade equivalente; o revisor é o mesmo ator autenticado para este comando. Em caso de tenant inexistente ou membership ausente, a resposta é `forbidden` sem retornar detalhes da ação. A resposta de falha não devolve o estado interno da organização; o `nextState` usado nos testes existe somente no adaptador de memória.

## Matriz de autoridade proposta

| Papel | Ler workspace de ações do próprio tenant | Emitir comando de transição | Aprovar revisão | Acessar resposta/convite individual |
| --- | --- | --- | --- | --- |
| `admin` | sim | sim | sim, sujeito à independência | não |
| `sst` | sim | sim | sim, sujeito à independência | não |
| `gestor` | sim | sim | sim, sujeito à independência | não |
| `colaborador` | não nesta fatia | não | não | não |
| outsider/cross-tenant | não | não | não | não |

O papel é verificado contra membership do tenant derivado da ação. A matriz é contrato de desenho; ainda não é policy SQL aplicada ao banco.

## Resultado e invariantes

O sucesso retorna somente snapshot de ação, evento de transição e receipt técnico. O adaptador de memória mantém um `nextState` separado para encadear testes; esse estado não cruza o boundary de comando. O estado persistido futuro deverá manter:

1. `organization_id` imutável durante a transição;
2. `expected_version` obrigatório e atômico;
3. `command_id` único por ação/ator e replay seguro;
4. evento append-only com origem, destino, ator, versão, data e resultado;
5. revisor derivado do contexto e distinto do owner quando a prioridade for alta/crítica;
6. nenhuma transição direta para `done`;
7. evidência e medição antes da revisão;
8. saída coletiva separada e filtrada por `k ≥ 5` no servidor.

O filtro coletivo existente em `src/lib/privacy/outcomeRows.ts` aceita somente linhas com `n_responses ≥ 5` e `k_anonymity_met = true`; esse contrato não recebe nem produz linhas de resposta individual.

## Mapeamento futuro para RPC/RLS

| Operação proposta | Fonte de autoridade | Saída | Grant/policy a validar em migration futura |
| --- | --- | --- | --- |
| `list_action_workspace(action_id ou filtro)` | membership do tenant derivado | ações sem respostas/convites | `EXECUTE` autenticado; leitura limitada ao tenant |
| `advance_action(...)` | `auth.uid()` + membership + papel | snapshot/evento/receipt | `EXECUTE` autenticado; sem DML direto |
| `record_action_evidence(...)` | ator autorizado + ação do mesmo tenant | receipt de evidência estruturada | `EXECUTE` autenticado; binários fora do MVP |
| `record_action_measurement(...)` | ator autorizado + ação do mesmo tenant | receipt de medição | `EXECUTE` autenticado; sem score individual |
| `review_action(...)` | revisor autenticado independente | evento de revisão | `EXECUTE` autenticado; ledger append-only |

Todas as funções futuras devem usar `SECURITY DEFINER` somente quando necessário, `SET search_path` explícito, grants mínimos e testes de cross-tenant. Nenhuma operação deve aceitar `organization_id` do cliente como autoridade.

## Falhas, rollback e observabilidade

Falhas mínimas do contrato: `action_not_found`, `forbidden`, `role_not_authorized`, `stale_version`, `invalid_transition`, `domain_blocked` e `command_id_conflict`. A implementação pura não grava logs externos; uma RPC futura deverá registrar somente metadados técnicos mínimos, sem token, resposta, e-mail ou conteúdo sensível.

Rollback desta fatia: remover o módulo e seus testes/documentos. Como não há migration nem chamada remota, não existe estado externo para restaurar. Em migration futura, o rollback deve desabilitar o comando novo sem apagar ledger ou texto legado.

## Critérios de aceite desta fatia local

- [x] comando não recebe tenant/ator/revisor como autoridade;
- [x] papel e membership são verificados contra tenant derivado;
- [x] cross-tenant e colaborador são bloqueados;
- [x] versão obsoleta não muta snapshot;
- [x] replay do mesmo `command_id` não duplica transição;
- [x] revisor é derivado do ator autenticado;
- [x] saída coletiva continua sujeita a `k ≥ 5`;
- [ ] migration reversível revisada e autorizada;
- [ ] RPC/RLS executados em Supabase local;
- [ ] pgTAP cross-tenant e grants executados;
- [ ] aprovação formal completa da ADR e gate correspondente.

## Próxima revisão obrigatória

Antes de qualquer migration, revisar com engenharia, SST/ergonomia e privacidade: modelo de evidência estruturada, política de revisão independente, vínculo AEP/AET, grants, ledger append-only, retenção, storage/scanning e cenários pgTAP. Dados reais permanecem No-Go.
