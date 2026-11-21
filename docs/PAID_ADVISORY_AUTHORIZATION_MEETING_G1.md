# Sala de decisão da primeira venda assistida — G1

Data: 15/07/2026

## Problema, usuários e evidência

Problema: cartas, templates e ensaio da proposta já estão preparados, mas ainda faltava um contrato verificável para organizar a reunião humana que deverá decidir preço, termos, capacidade e faturamento. Um checklist informal poderia ser confundido com convocação, reunião realizada ou autorização de venda.

Usuários: owner comercial, revisor Jurídico, owner da entrega, owner Financeiro/Administrativo, responsável externo pela ata e revisor independente da convocação.

Resultado operacional: disponibilizar pauta, pré-leituras, quórum esperado, evidências e quatro saídas decisórias sem receber nomes, agendar reunião, enviar convite, registrar ata ou aprovar venda.

Evidência: mecanismo puro fail-closed, catálogo G1 versionado, painel somente leitura incorporado ao pacote comercial e testes de caminho atual, caminho hipotético, catálogos inválidos e contextos inseguros.

## Lentes aplicadas

- Comercial/Financeiro: preço, moeda, tributos, pagamento, desconto, emissão, cobrança, conciliação e suporte precisam de decisão atribuída.
- Jurídico/governança: alçada, substituição, conflitos, termos, responsabilidade, ressalvas e ata permanecem atos humanos externos.
- Operação: capacidade, agenda, dependências, runbook e parada segura entram antes da venda.
- Segurança/privacidade: zero PII, persistência, transporte, integração de agenda ou convite externo.
- Produto/UX: prontidão do pacote, quórum e alçadas aparecem como estados diferentes; não existem inputs ou CTAs de aprovação.
- Arquitetura: a sala comercial reutiliza o pacote de quatro papéis sem duplicar o ledger geral de nove accountables do G1.

## Decisão Fable 5 — Master Plus

Escala 0–10; em custo, risco e complexidade, maior representa condição mais favorável. Total máximo: 90.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Checklist estático dentro do card atual | 6 | 8 | 9 | 7 | 6 | 5 | 9 | 5 | 9 | 64 |
| B | Avaliador específico e painel composto com a autorização | 10 | 10 | 8 | 9 | 9 | 8 | 8 | 8 | 8 | 78 |
| C | Documento ou mock sem contrato executável | 5 | 8 | 10 | 7 | 5 | 4 | 10 | 4 | 10 | 63 |
| D | Adiar a preparação até existirem nomes | 3 | 9 | 10 | 8 | 5 | 2 | 10 | 3 | 4 | 54 |
| E | Integrar calendário, e-mail, assinatura ou GRC | 8 | 6 | 3 | 4 | 7 | 9 | 3 | 10 | 3 | 53 |
| F | Criar workflow genérico de comitês e aprovações | 7 | 8 | 3 | 6 | 8 | 10 | 3 | 10 | 3 | 58 |

Decisão: **ramo B**. O contrato específico reduz ambiguidade e reutiliza o mecanismo comercial existente. Integração externa exigiria PII, autorização, retenção e novos controles; abstração genérica ainda não possui repetição suficiente para justificar o custo.

## Fluxo e estados

1. O pacote de autorização precisa estar completo para revisão interna.
2. O avaliador reconcilia exatamente quatro papéis e quatro decisões.
3. Sete blocos de pauta, cinco pré-leituras e quatro templates de saída precisam estar completos e versionados.
4. PII, persistência, agendamento remoto, convite enviado, alegação de reunião ou alegação de autorização bloqueiam o pacote.
5. O pacote interno pronto entra em `packet_ready_for_external_nomination`.
6. A revisão humana da convocação exige, fora do produto, 4/4 indicados, 4/4 alçadas comprovadas, pré-leituras distribuídas, responsável pela ata e revisão independente.
7. O estado máximo é `ready_for_human_convocation_review`; o sistema continua sem poder agendar ou convidar.
8. Se a autorização já estiver completa, a sala não reabre a decisão e retorna `authorization_already_complete`.

| Estado | Significado | Capacidade permitida |
|---|---|---|
| `blocked` | Estrutura, fonte ou contexto inseguro | Nenhuma preparação |
| `packet_ready_for_external_nomination` | Conteúdo pronto; quórum, alçadas e handoff pendentes | Revisão interna do pacote |
| `ready_for_human_convocation_review` | Pré-requisitos externos comprovados | Solicitar revisão humana da convocação |
| `authorization_already_complete` | O pacote de autorização já registra decisão completa | Não reabrir a reunião |

Em todos os estados: `canScheduleMeeting`, `canSendInvitation`, `canRecordDecision` e `canAuthorizeSale` são falsos.

## Pacote deliberativo

Pauta em sete blocos:

1. escopo, objetivo e limites não negociáveis;
2. quórum, alçadas, substitutos e conflitos;
3. escopo, preço e pagamento;
4. termos, responsabilidade e aceite;
5. capacidade e entrega;
6. faturamento e suporte;
7. resoluções, ressalvas, ata e próximos passos.

Pré-leituras:

- oferta Design Partner G1;
- pacote de autorização comercial;
- ensaio de lançamento da proposta;
- constituição e gate vigente;
- pacote de decisão e aceite G1.

Saídas humanas esperadas:

- registro de escopo, preço e pagamento;
- parecer de termos, risco e aceite;
- aceite de capacidade e entrega;
- aceite financeiro e de suporte.

Cada saída futura precisa de decisão, responsável, data e evidência. Aprovação com ressalvas continua exigindo owner, prazo e evidência.

## Estado atual

| Controle | Estado |
|---|---|
| Pacote interno | Pronto para uso interno |
| Pauta | 7/7 blocos completos |
| Pré-leituras | 5/5 disponíveis e versionadas |
| Templates de saída | 4/4 completos |
| Papéis indicados externamente | 0/4 |
| Alçadas comprovadas externamente | 0/4 |
| Pré-leituras distribuídas | Pendente |
| Responsável pela ata | Pendente |
| Revisão independente da convocação | Pendente |
| Revisão humana da convocação | Não solicitável |
| Venda | Bloqueada |

## Implementação

- `src/lib/commercial/paidAdvisoryAuthorizationMeeting.ts`: valida estrutura, contexto e prontidão externa sem executar ações.
- `src/data/g1PaidAdvisoryAuthorizationMeeting.ts`: política, pauta, pré-leituras, saídas e estado atual.
- `src/components/governance/PaidAdvisoryAuthorizationMeetingPanel.tsx`: painel responsivo, somente leitura e sem formulários.
- `src/components/governance/PaidAdvisoryAuthorizationCard.tsx`: incorpora a sala após os quatro templates de decisão.
- testes cobrem estado atual, caminho hipotético, autorização já concluída, sete violações de contexto, catálogos inválidos e chaves inconsistentes.

## Critérios de aceite

- Pacote comercial incompleto bloqueia a sala.
- Pauta, pré-leituras e saídas incompletas ou duplicadas bloqueiam.
- Alçada só pode ser comprovada para papel válido e previamente indicado.
- PII, persistência, agenda remota, convite ou claims de reunião/venda falham fechado.
- Quórum completo não agenda reunião nem envia convite.
- Painel não contém textbox, botão de aprovação ou controle de mutação.
- Estados e microcopy distinguem preparação, convocação, decisão e venda.
- Testes, typecheck, lint, build, bundle e auditoria de escopo permanecem verdes.

## Riscos residuais

- O sistema não verifica identidade, competência, mandato ou alçada real.
- Distribuição de pré-leituras, convocação, ata e assinatura dependem do processo corporativo externo.
- Uma reunião realizada sem evidências válidas não deve alterar o pacote de autorização.
- O card detalhado aumenta o chunk lazy do workspace; o orçamento deve permanecer monitorado.
- A autorização cobre somente serviço assistido e sintético, nunca piloto, SaaS ou dados reais.

## Rollback

Remover mecanismo, configuração, painel, composição no card, testes e este documento. Não há banco, migration, PII, agenda, convite, decisão ou integração a reverter.

## Limites

Este pacote não é convocação, reunião, ata, parecer, assinatura, orçamento, autorização de venda, aprovação de G1 ou permissão para piloto, SaaS e dados reais.
