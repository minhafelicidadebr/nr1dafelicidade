# Pacote de decisão institucional — rascunho para confirmação

**Política:** `g1-commercial-authorization-2026-07-26`
**ID de controle:** `G1-COMM-DECISION-2026-08-04-01`
**Versão:** `0.2-draft`
**Status:** RASCUNHO · não é aprovação, contrato, proposta executável ou autorização de cobrança
**Estado técnico enquanto houver pendências:** `sale_blocked`
**Veredicto atual:** `NO-GO`

Este pacote transforma as informações já declaradas em itens objetivos para confirmação humana. Nenhuma linha abaixo altera a fonte canônica do produto. Não inserir secrets, credenciais, dados de trabalhadores ou dados pessoais desnecessários.

## 1. Proposta comercial para decisão

| Item | Proposta inicial | Estado |
| --- | --- | --- |
| Oferta | Readiness & Governance Sprint — Core | Referência de trabalho |
| Preço sugerido | **R$ 9.900,00** | A aprovar por Comercial e Financeiro |
| Moeda | BRL | A aprovar |
| Modelo | Pagamento único por organização e escopo | A aprovar |
| Provedor pretendido | Mercado Pago | Indicado; não configurado |
| Modalidade pretendida | Checkout Pro para pagamento único | A confirmar; não habilitado |
| Duração de referência | Até 4 semanas | A aprovar na SOW |
| Limite operacional | Até 8 interlocutores profissionais | A confirmar capacidade |
| Validade da proposta | 15 dias | A aprovar |

O valor de R$ 9.900,00 é uma recomendação de teste dentro da faixa Core já registrada (`R$ 7.900–12.900`). Não é preço de mercado, preço publicado ou preço aprovado.

## 2. Papéis e limites

| Função | Nome informado | Decisão necessária | Evidência mínima |
| --- | --- | --- | --- |
| Owner comercial | João Paulo Barboza | Confirmar alçada para propor e aprovar a oferta | mandato, contrato social, procuração ou decisão institucional |
| Owner de entrega | Ana Paula Inglez | Confirmar autoridade operacional e capacidade | designação escrita e plano de capacidade |
| Privacy/security/quality | Olga Mariano | Confirmar autoridade para bloquear e registrar riscos | designação escrita e escopo de atuação |
| Substituto de entrega | Olga Mariano | Confirmar disponibilidade e mandato de substituição | registro operacional |
| Acompanhamento comercial | Ana Paula Inglez | Confirmar que não substitui aprovação final sem mandato | registro de limite |
| Revisão Jurídica | A designar | Designar revisor competente | nome, data, parecer/checklist e versão |
| Revisão Financeira | A designar | Designar responsável por preço, tributos e faturamento | nome, data e decisão |

Os nomes acima são atribuições operacionais informadas pelo solicitante. Não comprovam poderes de representação, qualificação, disponibilidade ou aceite.

## 3. Termos que precisam de decisão

Referência: [`READINESS_GOVERNANCE_SPRINT_TERMS_DRAFT.md`](../READINESS_GOVERNANCE_SPRINT_TERMS_DRAFT.md), versão 0.1, ainda não aprovada.

Confirmar, no mínimo:

- escopo e entregáveis Core;
- preço, tributos, documento fiscal e prazo de pagamento;
- início, duração, capacidade e critérios de aceite;
- cancelamento, rescisão, reembolso e despesas;
- confidencialidade, propriedade intelectual e uso de marca;
- limites de responsabilidade, suporte e parada segura;
- exclusões de trabalhadores, COPSOQ produtivo, scoring, PGR, laudo e claims de conformidade;
- privacidade mínima para contatos profissionais;
- lei aplicável, foro e mecanismo de aceite.

## 4. Matriz de decisão humana

Valores permitidos para **Estado**: `PENDENTE`, `APROVADO`, `APROVADO_COM_CONDIÇÕES` ou `REJEITADO`. Somente `APROVADO`, acompanhado da evidência e dos aceites exigidos, pode ser submetido à revisão técnica. Aprovação condicional ou campo vazio mantém `sale_blocked`.

| ID | Decisão | Referência de trabalho | Aprovadores mínimos | Referência de evidência | Estado |
| --- | --- | --- | --- | --- | --- |
| P-01 | Preço final e moeda | R$ 9.900,00 · BRL | Comercial + Financeiro | `[PREENCHER]` | `PENDENTE` |
| P-02 | Modelo, provedor e prazo de pagamento | Pagamento único · Mercado Pago Checkout Pro | Comercial + Financeiro + Jurídico | `[PREENCHER]` | `PENDENTE` |
| P-03 | Validade da proposta | 15 dias | Comercial | `[PREENCHER]` | `PENDENTE` |
| R-01 | Owner comercial e alçada | João Paulo Barboza | Comercial + verificação de representação | `[PREENCHER]` | `PENDENTE` |
| R-02 | Owner de entrega e alçada | Ana Paula Inglez | Entrega | `[PREENCHER]` | `PENDENTE` |
| R-03 | Privacy/security/quality e poder de bloqueio | Olga Mariano | Direção + responsável de privacidade/segurança competente | `[PREENCHER]` | `PENDENTE` |
| C-01 | Capacidade mensal, calendário e substituição | Quantidade pendente · Olga Mariano como substituta operacional informada | Entrega + Comercial | `[PREENCHER]` | `PENDENTE` |
| T-01 | Termos comerciais versionados | Minuta 0.1; não aprovada | Jurídico + Comercial + Financeiro | `[PREENCHER]` | `PENDENTE` |
| G-01 | Claims públicos e exclusões | Guardrail técnico verde; aceite institucional pendente | Comercial + Jurídico + privacy/security/quality | `[PREENCHER]` | `PENDENTE` |
| S-01 | Hard-stop de escopo | Sem trabalhadores, dados reais, scoring, PGR, laudo, checkout live ou entrega remota | Entrega + Jurídico + privacy/security/quality | `[PREENCHER]` | `PENDENTE` |

### Regras para evidências

- armazenar documentos comprobatórios somente em repositório institucional com acesso autorizado; não anexar contratos, procurações, documentos pessoais, credenciais ou links secretos ao Git;
- registrar aqui apenas identificador estável, versão, data e custodiante, por exemplo `FIN-2026-08-04-001`;
- cada evidência deve permitir confirmar quem decidiu, sua alçada, a data, a versão analisada e eventuais condições;
- mensagem de chat, texto gerado por IA ou preenchimento deste rascunho não substitui assinatura, aceite institucional ou prova de autoridade;
- se uma decisão for substituída, preservar a referência anterior no sistema institucional e registrar uma nova versão.

## 5. Bloco de encaminhamento

Preencher somente depois de concluir a matriz:

```text
Decisão agregada: [MANTER_NO_GO | SUBMETER_PARA_REVISAO_TECNICA]
Responsável pela consolidação:
Data e hora com fuso:
Versão dos termos analisada:
Aceite Jurídico — responsável, data e referência:
Aceite Comercial — responsável, data e referência:
Aceite Financeiro — responsável, data e referência:
Aceite de Entrega — responsável, data e referência:
Ressalvas, condições e prazo de validade:
```

`SUBMETER_PARA_REVISAO_TECNICA` não equivale a `sale_authorized`. O runtime só pode ser alterado em PR separado, depois da conferência das evidências e da execução dos testes canônicos.

## 6. Critério de liberação

Mesmo com este pacote preenchido, a venda só poderá sair de `sale_blocked` após:

1. conferência cadastral e poderes de representação;
2. aprovação formal de preço e termos;
3. confirmação de capacidade e substituição;
4. aceites Jurídico, Comercial e Financeiro;
5. revisão técnica rastreável da fonte canônica e dos testes;
6. decisão separada sobre ambiente, cobrança e integração Mercado Pago.

Nenhuma etapa deste rascunho habilita checkout, cobrança live, entrega remota ou dados reais de trabalhadores.

## 7. Sequência de handoff

1. Comercial e Financeiro decidem P-01 a P-03.
2. Direção, Entrega e privacy/security/quality comprovam R-01 a R-03 e C-01.
3. Jurídico, Comercial e Financeiro revisam T-01; os responsáveis aplicáveis revisam G-01 e S-01.
4. O consolidador registra somente referências das evidências e escolhe a decisão agregada.
5. Um revisor técnico independente confere o pacote contra `docs/G1_PAID_SERVICE_AUTHORIZATION.md`.
6. Se todos os requisitos passarem, uma mudança separada atualiza a fonte canônica, os testes e os ledgers por PR com CI verde.
7. Cobrança, ambiente remoto e dados reais continuam sujeitos a decisões próprias e não são liberados por este pacote.
