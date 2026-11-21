# Pacote de autorização do serviço pago assistido — G1

Data: 14/07/2026

## Problema, usuário e evidência

Problema: o Sprint de Prontidão NR-1 possui escopo sintético e entregáveis definidos, mas preço, termos, responsáveis, capacidade e faturamento não podem ser considerados aprovados por estarem descritos em uma página ou documento.

Usuários: sponsor comercial, Jurídico, responsável pela entrega, Financeiro/Administrativo e revisor independente.

Resultado operacional: produzir um pacote interno completo para revisão formal, preservando venda, assinatura, cobrança, entrega externa, piloto e dados reais em estado bloqueado até existirem decisões e evidências verificáveis.

Evidência: quatro cartas de papel, quatro templates de decisão, avaliador fail-closed, card somente leitura e composição automática com a oferta Design Partner.

## Lentes aplicadas

- Comercial/Jurídico: preço, tributos, pagamento, aceite, cancelamento, responsabilidade, propriedade intelectual, confidencialidade e limites de claims.
- Operação/Financeiro: agenda, capacidade, substituição, parada segura, emissão, cobrança, conciliação, reembolso e suporte.
- Arquitetura/Segurança/UX: separação entre preparação e autorização, ausência de dados pessoais, sem persistência, sem integração e sem CTA que simule aprovação.

## Decisão Fable 5 — Master Plus

Escala 0–10; em custo, risco e complexidade, maior representa condição mais favorável. Total máximo: 90.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Acrescentar mais booleanos ao contrato da oferta | 6 | 6 | 9 | 5 | 6 | 4 | 8 | 4 | 9 | 57 |
| B | Pacote comercial específico, puro e composto com a oferta | 9 | 10 | 8 | 9 | 9 | 8 | 8 | 8 | 8 | 77 |
| C | Manter somente checklist documental | 5 | 6 | 10 | 5 | 5 | 4 | 10 | 3 | 10 | 58 |
| D | Adiar qualquer preparação até G3 | 2 | 10 | 10 | 8 | 5 | 2 | 10 | 2 | 2 | 51 |
| E | Integrar GRC, assinatura e billing externos agora | 7 | 5 | 2 | 3 | 6 | 8 | 2 | 9 | 3 | 45 |
| F | Criar engine genérica de aprovações | 7 | 8 | 4 | 6 | 8 | 10 | 4 | 9 | 4 | 60 |

Decisão: **ramo B**. O contrato existente continua responsável por publicação e venda; o novo pacote fornece a evidência específica de autorização. Documento isolado não controla transições, enquanto integração externa e abstração genérica ampliariam escopo antes de accountables reais.

## Fluxo e estados

1. O catálogo prepara quatro cartas de papel sem nomes ou dados pessoais.
2. Quatro templates cobrem Comercial, Jurídico, Entrega e Financeiro.
3. O avaliador permite `review_packet_ready` somente com cartas, seções e contexto seguro completos.
4. A autorização de venda exige titular, alçada, substituto, capacidade e evidência para cada papel.
5. Cada decisão exige estado aprovado, responsável, data e evidência.
6. Aprovação com ressalvas exige owner, prazo e evidência para cada condição.
7. A autorização resultante alimenta os três critérios parciais e o aceite formal da oferta.
8. Dados reais, transporte remoto ou claim de piloto bloqueiam revisão e venda mesmo com todas as aprovações.

| Camada | Estado atual | Contador |
|---|---|---:|
| Cartas de papel | Prontas para revisão | 4/4 |
| Templates de decisão | Prontos para revisão | 4/4 |
| Papéis formalmente autorizados | Pendentes | 0/4 |
| Decisões formalmente aprovadas | Pendentes | 0/4 |
| Venda do serviço assistido | Bloqueada | 0% de autorização |
| Piloto, SaaS e dados reais | Bloqueados | fora do escopo |

## Conteúdo dos templates

- Comercial: escopo/exclusões, preço/moeda, tributos, pagamento e alçada de desconto.
- Jurídico: entregáveis/aceite, cancelamento/reembolso, responsabilidade, propriedade intelectual/confidencialidade e limites regulatórios.
- Entrega: duração/calendário, participantes/dependências, capacidade/substituição, qualidade e critérios de parada.
- Financeiro: gatilho de emissão, cobrança/conciliação, reembolso, passagem para suporte e retenção mínima.

## Implementação

- `src/lib/commercial/paidAdvisoryAuthorization.ts`: mecanismo puro e fail-closed.
- `src/data/g1PaidAdvisoryAuthorization.ts`: política, cartas e templates sem nomes ou aprovações inventadas.
- `src/components/governance/PaidAdvisoryAuthorizationCard.tsx`: interface interna, somente leitura e acessível.
- `src/data/g1DesignPartnerOffer.ts`: deriva termos, owner, billing e aceite formal do novo pacote.
- `src/pages/app/ExternalReadinessWorkspacePage.tsx`: apresenta o pacote dentro da rota protegida.
- testes cobrem preparação, autorização positiva, template inválido, contexto inseguro e ressalva sem limites.

## Controle posterior ao pacote

O pacote agora alimenta dois controles complementares:

- `docs/PAID_ADVISORY_AUTHORIZATION_MEETING_G1.md` prepara pauta, pré-leituras, quórum e saídas da deliberação humana, mas não recebe nomes, agenda, convida ou registra decisão;
- `docs/PAID_ADVISORY_LAUNCH_REHEARSAL_G1.md` usa uma proposta interna versionada e seis situações adversariais, mas não preenche preço, recebe comprador ou envia documento.

No estado atual, a sala possui pauta 7/7 e pré-leituras 5/5, porém continua com 0/4 indicados e 0/4 alçadas comprovadas. Um ensaio completo da proposta produz somente comprovante local `No-Go` porque permanecem 0/4 papéis autorizados e 0/4 decisões aprovadas.

## Critérios de aceite

- Template completo não pode autorizar venda.
- Papel sem nome, alçada, substituto, capacidade ou evidência deve bloquear venda.
- Decisão pendente, rejeitada, sem autoria, data ou evidência deve bloquear venda.
- Ressalva sem owner, prazo e evidência deve bloquear venda.
- Nenhum nome, assinatura, dado pessoal, contrato ou cobrança é persistido pela interface.
- Serviço assistido autorizado não pode liberar piloto, SaaS ou dados reais.
- Testes, typecheck, lint, build, bundle e auditoria de escopo devem permanecer verdes.

## Riscos residuais

- As decisões dependem de pessoas com autoridade real fora do sistema.
- O pacote não valida política tributária, contrato, alçada, capacidade ou procedimento financeiro.
- Evidências futuras exigirão governança de armazenamento e assinatura antes de qualquer persistência.
- O fluxo atual não envia proposta, não cobra e não integra CRM, calendário, assinatura ou billing.

## Rollback

Remover o mecanismo, catálogo, card e testes do pacote; retirar sua composição de `g1DesignPartnerOffer` e do workspace protegido. Não há banco, migration, integração, dado ou aprovação a reverter.

## Limites

Este pacote não constitui parecer jurídico, aceite comercial, autorização financeira, contrato, assinatura, aprovação de G1, validação SST ou autorização para dados reais.
