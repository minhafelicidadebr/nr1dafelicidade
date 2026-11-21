# Onda de prontidão comercial G1

## Resultado

Esta onda consolida oferta, intake local e revisão vendor-neutral em um contrato operacional com três estados explícitos: `available`, `review_ready` e `blocked`.

| Capacidade | Estado G1 |
|---|---|
| Descoberta e demonstração sintética | Disponível |
| Rascunho de contato local, consentido e temporário | Disponível |
| Serviço pago assistido e sintético | Pronto para revisão Comercial/Jurídica |
| Entrega a CRM ou calendário | Bloqueada |
| Piloto pago com dados reais | Bloqueado |

`review_ready` não representa disponibilidade, autorização de venda, contrato aprovado ou capacidade de entrega confirmada. O estado não aprova G1, não escolhe fornecedor, não entrega dados e não habilita transporte remoto.

O pacote de autorização interno agora prepara 4/4 cartas de papel e 4/4 templates de decisão. Como nenhum papel ou decisão possui aceite formal, a oferta permanece em 7/10 e `review_ready`.

O controle técnico anterior à primeira proposta também foi preparado: rascunho interno versionado, quatro fronteiras de preflight, seis situações adversariais e recibo somente em memória. Ele termina em `No-Go` enquanto autorização, campos comerciais e destinatário permanecerem pendentes; não envia proposta e não inicia entrega.

A sala de decisão da primeira venda fecha a preparação da deliberação: pauta 7/7, cinco pré-leituras e quatro saídas esperadas. Como nenhum papel ou alçada foi comprovado externamente, a convocação permanece pendente; o sistema não agenda, envia convite, registra ata ou autoriza venda.

## Implementação

- `src/lib/commercial/designPartnerOffer.ts` separa publicação, revisão comercial, venda assistida e piloto pago.
- `src/lib/commercial/paidAdvisoryAuthorization.ts` exige papéis, decisões, autoria e evidências antes da venda.
- `src/components/governance/PaidAdvisoryAuthorizationCard.tsx` expõe o pacote somente leitura na rota protegida.
- `src/lib/commercial/paidAdvisoryLaunchRehearsal.ts` separa ensaio concluído, No-Go e revisão humana de liberação.
- `src/components/governance/PaidAdvisoryLaunchRehearsalCard.tsx` treina o lançamento sem coletar dados ou produzir ação externa.
- `src/lib/commercial/paidAdvisoryAuthorizationMeeting.ts` separa pacote interno, nomeação externa e revisão humana da convocação.
- `src/components/governance/PaidAdvisoryAuthorizationMeetingPanel.tsx` apresenta a pauta sem formulários ou CTAs de mutação.
- `src/data/g1DesignPartnerOffer.ts` registra 10 critérios para o serviço pago: 7 prontos e 3 parciais.
- `src/lib/commercial/commercialReadiness.ts` deriva cinco capacidades a partir dos contratos de oferta, intake e vendor gate.
- `src/components/sales/VendorDeliveryReadinessCard.tsx` apresenta estado, evidência e próximo passo sem transformar revisão em venda.
- `src/pages/SalesPage.tsx` posiciona o Sprint Design Partner como pacote em revisão comercial.
- `src/lib/commercial/designPartnerOffer.test.ts` cobre falha fechada e independência entre serviço assistido e piloto.
- `src/test/publicClaimsGuardrail.test.ts` mantém a superfície protegida contra overclaim.

## Critérios de aceite

- Nenhuma capacidade remota ou com dados reais pode aparecer como disponível no G1.
- Cada capacidade deve mostrar ao menos uma evidência.
- O serviço assistido parcial deve aparecer como `review_ready`, nunca como `available`.
- O próximo passo deve apontar para revisão Comercial/Jurídica dos termos e da operação.
- Aprovar o serviço assistido não pode autorizar piloto pago.
- O painel deve passar testes, typecheck, lint, build, axe e smoke E2E aplicáveis.

## Riscos residuais

- Preço, tributos, pagamento, cancelamento, responsabilidade e aceite dependem de decisão humana.
- Owner, substituto, capacidade e operação manual de billing ainda não foram aprovados.
- `localStorage` continua sendo rascunho temporário, não cofre, CRM ou fila operacional.
- A revisão vendor-neutral ainda depende de decisões externas de DPO/Jurídico, fornecedor e operação.
- O warning de chunk de gráficos acima de 500 kB permanece herdado e fora do escopo desta onda.
