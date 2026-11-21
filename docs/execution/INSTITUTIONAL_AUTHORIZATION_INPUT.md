# Entrada para decisão institucional — G1

Este arquivo é um template de decisão humana. Não é aprovação, contrato, proposta, checkout ou autorização de produção. Não preencher com secrets, credenciais, dados de trabalhadores ou dados pessoais desnecessários.

## Estado inicial

- **Política:** `g1-commercial-authorization-2026-07-26`
- **Escopo:** disponível somente no ambiente local e sintético.
- **Venda:** `sale_blocked` até todos os requisitos abaixo possuírem decisão e evidência verificável.
- **Responsável pelo preenchimento:** pendente.
- **Data da decisão:** pendente.

## Dados recebidos do solicitante — 2026-07-27

Estes dados são declarações de contexto e ainda não constituem evidência formal nem alteram o estado canônico:

- **Gestor/fundador informado:** João Paulo Barboza.
- **Instituição de promoção informada:** Instituto Felicidade para Todos.
- **Prestadora/razão social informada:** Inovação, Bem-Estar e Sustentabilidade Ltda.
- **CNPJ informado:** 59.604.731/0001-99.
- **Equipe indicada:** João Paulo Barboza, Ana Paula Inglez e Olga Mariano.
- **Site informado:** https://www.felicidadeparatodos.com.br
- **Links profissionais:** recebidos na conversa, mas não replicados neste repositório para minimizar exposição de dados pessoais.

Ainda falta confirmar: valor final; papel formal e poderes de representação; substitutos; capacidade; evidências; termos; aceite Jurídico; aceite Comercial; e aceite Financeiro. A moeda BRL está registrada apenas como hipótese operacional.

## Proposta de organização e preços

Consultar `docs/execution/PROPOSED_ROLES_AND_PRICING.md`. O solicitante confirmou a atribuição operacional de João como sponsor/owner comercial, Ana como owner de entrega e Olga como privacy/security/quality owner, com o Sprint Core como referência inicial de preço em BRL. A fonte canônica registra somente essa nomeação de trabalho e a moeda provisória; autoridade, evidência, substitutos formais, valor final e aprovações Comercial/Financeira/Jurídica continuam pendentes.

## Decisões obrigatórias

| Campo canônico | Decisão necessária | Evidência mínima | Estado |
| --- | --- | --- | --- |
| `price.amount` / `price.currency` | definir preço positivo e moeda | registro aprovado por Comercial/Financeiro | Pendente |
| `price.approved` | aprovar o preço | decisão, autoridade e data | Pendente |
| `payment.provider/mode` | registrar Mercado Pago e escolher a modalidade compatível com o Core | termo aprovado, ambiente e fluxo definidos | Provedor indicado; modalidade pendente |
| `commercialOwner` | nomear owner comercial com alçada | referência profissional, autoridade e evidência | Pendente |
| `deliveryOwner` | nomear owner de entrega com alçada | referência profissional, autoridade e evidência | Pendente |
| `terms.approved` | aprovar termos aplicáveis | decisão Jurídica/Comercial e versão | Pendente |
| `terms.reference` | vincular referência versionada | identificador do documento aprovado | Pendente |
| `capacity.confirmed` | confirmar capacidade e substituição | registro operacional aprovado | Pendente |
| `capacity.evidenceRef` | vincular evidência de capacidade | identificador da evidência | Pendente |
| `claimsGuardrailGreen` | confirmar claims limitados e honestos | revisão do guardrail público | Pendente |

## Decisões que permanecem proibidas nesta onda

Mesmo com a autorização comercial completa, não habilitar:

- dados reais de trabalhadores ou respostas individuais;
- COPSOQ produtivo, scoring de risco psicossocial, PGR ou laudo;
- entrega remota, campanha produtiva, checkout, cobrança live ou CRM;
- promessas de conformidade, diagnóstico, resultado ou certificação.

## Critério de transição

O estado só pode mudar para `sale_authorized` quando a fonte canônica receber valores aprovados para todos os campos obrigatórios e os gates de segurança permanecerem verdes. A atualização deve ocorrer por revisão técnica rastreável; texto deste template não altera o estado do produto.

## Próximo gate

Após a decisão humana, revisar o pacote contra [G1_PAID_SERVICE_AUTHORIZATION.md](../G1_PAID_SERVICE_AUTHORIZATION.md), registrar as evidências no ledger e executar novamente os testes antes de qualquer decisão sobre commit, push, cobrança ou ambiente remoto.
