# Onda 0U — Narrativa pública de acesso e prontidão

## Decisão

Esta é uma onda `MASTER`: textos públicos de acesso, contratação e disponibilidade podem induzir uma pessoa compradora a concluir que existe um SaaS self-service em operação. O gate atual é sintético e não autoriza checkout, assinatura, dados reais ou operação produtiva.

## Problema

Enquanto a página comercial já encaminha para descoberta e Design Partner, a Home e a jornada de drivers ainda usavam sinais de freemium e upgrade: versão gratuita, cartão de crédito, plano Professional, conteúdo Premium e desbloqueio de dinâmicas. Esses sinais criavam uma expectativa incompatível com o estado de produto e governança.

## Alternativas consideradas

| Caminho | Decisão | Motivo |
| --- | --- | --- |
| Reescrever apenas os CTAs e os estados visíveis | **adotado** | Corrige a expectativa sem ampliar acesso ou escopo técnico. |
| Remover os bloqueios de conteúdo | rejeitado | Mudaria autorização e disponibilidade sem gate aprovado. |
| Simular checkout ou assinatura | rejeitado | Criaria uma promessa comercial não entregue. |
| Manter a linguagem freemium até o lançamento | rejeitado | Preserva a contradição pública atual. |
| Integrar Mercado Pago agora | adiado | Depende de autorização comercial, termos, segurança e gate próprio. |
| Criar um novo mecanismo genérico de entitlement | adiado | O mecanismo existente não é o problema desta fatia. |

## Implementado

- O CTA final da Home passa de aquisição freemium para exploração de demonstração sintética, com o bloqueio de dados reais e operações formais visível.
- A jornada de drivers troca `Pro`, `Premium`, `Professional` e `desbloquear` por disponibilidade em revisão; o bloqueio técnico permanece inalterado.
- O leitor de tela recebe a mesma explicação de disponibilidade em revisão no cartão de dinâmica.
- O guardrail público passa a bloquear retorno de termos de freemium e upsell de assinatura antes do gate.

## Fora de escopo

- Não há mudança em autenticação, `isPremium`, autorização, dados, banco, Mercado Pago, preços, checkout, CRM, campanhas, IA ou gates.
- Não há venda, contratação, reunião, envio de contato ou coleta de dados reais.
- A rota `/planos` continua sendo uma jornada de descoberta e prontidão, não uma página de assinatura.

## Critérios de aceite

- Nenhuma superfície pública coberta promete plano gratuito, cartão dispensado, upgrade Professional ou desbloqueio por assinatura.
- A Home oferece uma próxima ação clara sem sugerir que uma contratação foi iniciada.
- A dinâmica bloqueada explica o motivo sem pressionar a pessoa usuária a comprar.
- O teste de claims, typecheck, lint, testes de regressão, build e auditoria de escopo passam.

## Risco residual e rollback

- O código de acesso legado continua existindo como mecanismo interno e exigirá uma decisão de produto antes de qualquer abertura comercial.
- A redução de linguagem comercial pode diminuir conversão de curto prazo, mas evita intenção de compra incompatível com a entrega atual.
- Rollback: um único commit de interface, teste e documentação, sem dado persistido, migração ou configuração remota.
