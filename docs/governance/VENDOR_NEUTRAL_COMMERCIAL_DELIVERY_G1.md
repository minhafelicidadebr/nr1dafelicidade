# Gate vendor-neutral de entrega comercial — G1

## Estado

- Data: 14/07/2026
- Gate: G0/G1 local e sintético; G1 não aprovado
- Decisão: CRM, calendário e entrega remota permanecem bloqueados
- Resultado do contrato: `ready_for_vendor_review` não significa aprovação nem habilitação

## Objetivo

Criar uma lista verificável para avaliar futura entrega de contatos B2B a um fornecedor, sem escolher fornecedor, enviar dados ou substituir decisão do DPO, Jurídico, Comercial ou responsável operacional.

## Critérios obrigatórios

O contrato exige finalidade, fornecedor e subprocessadores, DPA, base legal, aviso de privacidade, RBAC, retenção/descarte, recibo, incidente e capacidade operacional. Qualquer ausência mantém o estado `blocked`.

## Decisão Fable 5

- Mínimo viável: checklist manual sem contrato — rejeitado por não produzir estado testável.
- Robusto: contrato puro, política versionada e testes — escolhido para preparar revisão sem habilitar transporte.
- Simular: fixture local completa — permitido apenas em teste, sem rede.
- Adiar: não registrar critérios — mantém a dependência invisível.
- Comprar/integrar: CRM ou calendário — bloqueado até revisão e aprovações.
- Abstrair: mecanismo genérico de critérios — limitado ao contrato atual; integração futura exige fatia própria.

## Implementação e aceite

- `src/lib/commercial/vendorDeliveryReadiness.ts` contém o mecanismo puro.
- `src/data/g1VendorDeliveryReadiness.ts` contém a política e o estado atual bloqueado.
- `src/lib/commercial/vendorDeliveryReadiness.test.ts` cobre bloqueio, completude e o invariante de transporte.
- Mesmo com 100% dos critérios, `canEnableRemoteDelivery` permanece `false` no G1.

Esta fatia não aprova DPA, base legal, fornecedor, G1 ou dados reais; não executa migration, seed, deploy, chamada remota ou entrega à equipe.
