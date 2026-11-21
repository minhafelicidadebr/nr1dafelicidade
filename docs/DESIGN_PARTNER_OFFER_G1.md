# Oferta Design Partner NR-1 — G1

Data: 14/07/2026

## Objetivo

Transformar a visão estratégica premium em uma primeira oferta monetizável, assistida e sintética, sem declarar SaaS pronto, vender piloto com dados reais ou ultrapassar os gates técnicos, metodológicos, jurídicos e de privacidade.

## Decisão Fable 5 — Master Plus

Escala de 0 a 10 por critério. Total máximo: 50.

| Alternativa | Valor agora | Velocidade | Reversibilidade | Segurança G1 | Aderência arquitetural | Total | Decisão |
|---|---:|---:|---:|---:|---:|---:|---|
| A. Vender SaaS ou piloto real agora | 8 | 7 | 2 | 0 | 2 | 19 | Rejeitada |
| B. Estender o contrato existente com serviço pago sintético | 9 | 9 | 9 | 9 | 10 | 46 | Escolhida |
| C. Publicar somente um documento comercial estático | 4 | 8 | 10 | 9 | 4 | 35 | Insuficiente como controle |
| D. Adiar qualquer monetização até G3 | 2 | 2 | 10 | 10 | 6 | 30 | Conservadora demais |
| E. Integrar CRM, billing e calendário externos agora | 6 | 4 | 4 | 3 | 5 | 22 | Prematura |
| F. Criar um novo motor genérico de ofertas | 6 | 3 | 5 | 7 | 5 | 26 | Complexidade sem retorno imediato |

A alternativa B cria uma ponte comercial auditável usando o mecanismo já existente. Ela valida disposição de compra e capacidade de entrega sem confundir serviço assistido com produto SaaS operacional.

## Oferta proposta

Nome de trabalho: **Sprint de Prontidão NR-1 — Assistido e Sintético**.

Público inicial:

- empresas de 250 a 2.000 colaboradores;
- liderança patrocinadora de RH, SST ou governança;
- necessidade de estruturar decisões, responsabilidades e evidências antes de operar dados reais.

Entregáveis controlados:

- mapa de maturidade e bloqueios de prontidão;
- roadmap executivo de 90 dias;
- matriz de governança, responsáveis e decisões pendentes;
- arquitetura preliminar de evidências;
- registro de riscos, premissas e próximos gates.

Limites obrigatórios:

- nenhuma coleta de dados de trabalhadores;
- nenhum questionário, campanha, scoring ou diagnóstico real;
- nenhuma declaração de conformidade, validação metodológica, PGR, AEP ou AET concluídos;
- resultados preliminares sujeitos a revisão humana qualificada;
- nenhuma integração remota, CRM, calendário, SLA ou operação SaaS produtiva;
- nenhum avanço de gate por consequência da contratação.

## Contrato de prontidão implementado

O mecanismo separa explicitamente:

1. brief da oferta publicável;
2. pacote do serviço pago pronto para revisão Comercial/Jurídica;
3. serviço pago formalmente autorizado para venda;
4. piloto pago formalmente autorizado;
5. operação SaaS real, que permanece fora do escopo de G1.

O serviço pago nunca herda autorização do brief. O piloto nunca herda autorização do serviço assistido. Contexto inseguro — dados reais, claim produtivo, avanço de gate, CI ou guardrail vermelho — falha fechado.

## Estado atual

| Camada | Estado | Evidência |
|---|---|---|
| Brief e descoberta sintética | Disponível | 100% dos critérios do brief prontos |
| Serviço pago assistido e sintético | Pronto para revisão | 7 de 10 critérios prontos; nenhum bloqueio estrutural nessa camada |
| Venda do serviço pago | Não autorizada | aprovação Comercial/Jurídica e três critérios operacionais pendentes |
| Piloto pago | Bloqueado | metodologia, DPA, accountables, operação e aprovações pendentes |
| SaaS com dados reais | Bloqueado | somente após gates e aprovações formais aplicáveis |

Pendências para autorização humana da primeira venda assistida:

- preço, tributos, forma e prazo de pagamento;
- duração, agenda e capacidade de entrega;
- cancelamento, reembolso e critérios de aceite;
- responsabilidade, propriedade intelectual e confidencialidade;
- owner, substituto e autoridade de aceite;
- emissão, cobrança, conciliação e passagem para suporte;
- aceite formal de Comercial/Jurídico.

O pacote interno de decisão está preparado em `docs/PAID_ADVISORY_AUTHORIZATION_G1.md`: 4/4 cartas e 4/4 templates completos, mas 0/4 papéis autorizados e 0/4 decisões aprovadas. Preparação documental não altera o contador 7/10 da oferta.

O ensaio de lançamento da proposta também está tecnicamente preparado em `docs/PAID_ADVISORY_LAUNCH_REHEARSAL_G1.md`: template interno versionado, quatro confirmações e seis situações adversariais. Sua conclusão gera somente recibo local `No-Go`; não preenche preço, não define destinatário, não envia proposta e não altera a autorização da oferta.

A sala de decisão descrita em `docs/PAID_ADVISORY_AUTHORIZATION_MEETING_G1.md` acrescenta pauta 7/7, pré-leituras 5/5 e quatro saídas esperadas. Quórum e alçadas permanecem 0/4; o painel não agenda, convida, registra ata ou autoriza venda.

## Implementação

- `src/lib/commercial/designPartnerOffer.ts` avalia as quatro camadas comerciais e seus bloqueios independentes.
- `src/data/g1DesignPartnerOffer.ts` mantém 15 critérios, dos quais 10 compõem a prontidão do serviço pago.
- `src/lib/commercial/paidAdvisoryAuthorization.ts` exige papéis, alçadas, capacidade, decisões e evidências antes de autorizar a venda.
- `src/data/g1PaidAdvisoryAuthorization.ts` mantém o pacote atual pronto para revisão e não autorizado.
- `src/lib/commercial/paidAdvisoryLaunchRehearsal.ts` prova o ensaio interno sem conceder envio, assinatura, cobrança ou entrega.
- `src/lib/commercial/commercialReadiness.ts` expõe `available`, `review_ready` e `blocked` sem converter revisão em disponibilidade.
- `src/components/sales/VendorDeliveryReadinessCard.tsx` apresenta o estado e o próximo passo na página pública.
- `src/pages/SalesPage.tsx` descreve o sprint como preparação comercial, sem preço, contratação ou piloto liberados.
- `src/lib/commercial/designPartnerOffer.test.ts` prova separação entre revisão, venda assistida e piloto.
- `src/test/publicClaimsGuardrail.test.ts` protege a superfície contra overclaim público.

## Critérios de aceite

- A página deve distinguir visualmente capacidade disponível, pronta para revisão e bloqueada.
- Nenhum estado parcial pode autorizar venda.
- A venda assistida exige todos os 10 critérios prontos e aprovação formal específica.
- A autorização do serviço assistido não pode autorizar piloto pago.
- Dados reais, claim de produção ou avanço de gate devem bloquear todas as camadas publicáveis.
- Testes focados, guardrail público, typecheck, lint e build devem permanecer verdes.

## Rollback

Reverter os campos de advisory no contrato e no catálogo, remover a capacidade `paid_advisory` do cockpit e restaurar a copy anterior da página. O rollback não altera dados, schema, migrations, integrações ou gates.

## Declarações de segurança

- Este documento não é aceite jurídico, comercial, SST, DPO ou psicométrico.
- Não valida instrumento, scoring, fontes ou Playbook.
- Não aprova G1, G2 ou G3.
- Não habilita dados reais, trabalhadores reais ou IA remota em produção.
