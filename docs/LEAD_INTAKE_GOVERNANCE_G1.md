# Governanca de Intake Comercial - G1

Data original: 01/07/2026

Revisao de fronteira local: 12/07/2026

## Objetivo

Permitir apenas captura controlada de interesse B2B para conversa Design Partner, sem abrir CRM remoto, piloto pago, campanha real ou dados de trabalhadores durante G1.

## Decisao Fable 5

Opcoes avaliadas:

- Manter insert direto em CRM remoto: rejeitado em G1 por depender de DPA, operador, acesso, retencao e revisao formal.
- Remover formulario publico: adiado, pois a oferta precisa validar demanda e linguagem de ICP.
- Usar rascunho local controlado: escolhido como menor mecanismo seguro para preparar contato B2B no ambiente de demonstracao, sem alegar entrega.
- Aceitar lead para piloto pago: bloqueado ate accountables, termos, DPA, metodologia e operacao produtiva.
- Integrar CRM externo: futuro, somente depois de revisao juridica/LGPD e criterio de gate.

## Implementacao

- `src/lib/commercial/leadIntakeGovernance.ts`
  - avalia finalidade, transporte, retencao, consentimento, DPA, dados de trabalhadores, campos sensiveis e campos livres;
  - falha fechado para CRM remoto sem DPA, piloto pago, campanha real, texto livre sensivel e qualquer dado de trabalhador;
  - gera rascunho saneado com comprovante local, status `local_draft_not_delivered` e expiracao individual;
  - preserva leitura de registros legados sem apresenta-los como entregues;
  - valida e-mail, limites de tamanho e catalogos permitidos.
- `src/data/g1LeadIntakeGovernance.ts`
  - define politica `g1-lead-intake-governance-2026-07-01`;
  - limita transporte a `local_queue`;
  - define retencao local de 30 dias e maximo de 20 itens;
  - declara campos permitidos do formulario.
- `src/components/sales/LeadCaptureForm.tsx`
  - remove gravacao direta em `crm_leads`;
  - grava somente em `localStorage` com envelope de retencao;
  - remove WhatsApp, opt-ins sem efeito e objetivos comerciais ambiguos;
  - elimina itens individualmente expirados ao abrir ou salvar;
  - gera comprovante local e permite exclusao imediata pelo usuario;
  - informa antes e depois do salvamento que nada chegou a equipe e nenhuma reuniao foi agendada.
- `src/index.css`
  - remove importacao publica de Google Fonts para impedir requisicao remota na jornada.
- `e2e/public-lead-intake.spec.ts`
  - prova rascunho, recibo, expiracao individual, descarte, exclusao, axe e ausencia de `fetch`/XHR remoto.
- `src/data/g1DesignPartnerOffer.ts`
  - marca intake local como pronto;
  - adiciona bloqueio explicito para CRM remoto, DPA e retencao antes de piloto pago.

## Estado Atual

Liberado:

- rascunho B2B consentido e temporario no navegador do usuario;
- finalidade de descoberta Design Partner;
- armazenamento local temporario em ambiente de demonstracao;
- preparacao de conversa de aderencia sem dados reais de trabalhadores.

Bloqueado:

- CRM remoto;
- entrega do rascunho a equipe ou agendamento pelo produto;
- DPA/operador ainda nao aprovado;
- contrato pago de piloto;
- campanha real;
- dados reais de trabalhadores;
- campo livre sensivel ou relato individual;
- uso do lead como aceite juridico, SST, DPO ou comercial.

## Criterios de Aceite

- O avaliador puro deve retornar `controlled_contact_ready` somente para `local_queue` sem bloqueios.
- CRM remoto sem DPA deve retornar bloqueio `remote_crm_without_dpa`.
- Retencao invalida deve retornar bloqueio `retention_invalid`.
- Campos de trabalhador, sensiveis ou livres devem bloquear o intake.
- Intencao de piloto pago ou campanha real deve bloquear o intake.
- O registro local deve normalizar strings, exigir consentimento LGPD e expirar em 30 dias.
- Cada item deve expirar pela propria data, mesmo quando o envelope for renovado.
- O usuario deve receber comprovante exclusivamente local e conseguir excluir o rascunho.
- A jornada nao pode disparar `fetch`/XHR remoto nem apresentar o rascunho como entregue ou agendado.

## Rollback

Reverter `src/lib/commercial/leadIntakeGovernance.ts`, `src/data/g1LeadIntakeGovernance.ts`, `src/lib/commercial/leadIntakeGovernance.test.ts`, este documento e as alteracoes em `LeadCaptureForm` e `g1DesignPartnerOffer`. A revisao de 12/07/2026 tambem inclui as CTAs comerciais, o teste E2E e a remocao da importacao remota em `src/index.css`.
