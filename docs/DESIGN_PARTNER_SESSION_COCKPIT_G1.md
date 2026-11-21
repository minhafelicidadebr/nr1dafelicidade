# Cockpit de sessão Design Partner — G1 sintético

## Status

Implementado localmente para sessão guiada, sintética e em memória. Não aprova G1, demo externa autônoma, instrumento, scoring, tratamento de dados reais, entrega comercial ou operação produtiva.

Política executável: `g1-design-partner-session-2026-07-14`.

## Objetivo

Transformar os limites da demonstração em controles de interface verificáveis. O fluxo não depende apenas de aviso textual: CTAs manuais e cenários determinísticos permanecem desabilitados até o preflight completo.

## Contrato de liberação

A sessão local guiada é liberada somente quando todas as condições abaixo são verdadeiras:

- modo máximo de dados igual a `synthetic`;
- runtime do instrumento permanece bloqueado;
- transporte remoto desabilitado;
- ao menos um cenário sintético disponível;
- runbook disponível;
- reconhecimento de uso exclusivamente fictício;
- reconhecimento de ausência de diagnóstico ou decisão técnica;
- reconhecimento de memória local, sem persistência ou envio.

Qualquer ausência bloqueia a jornada. A avaliação nunca libera sessão externa autônoma.

## Capacidade visível

| Capacidade | Estado desta versão | Limite operacional |
|---|---|---|
| Sessão | Local, em uma aba | Sem sincronização entre dispositivos |
| Dados | Exclusivamente fictícios | Dados reais continuam proibidos |
| Persistência | Nenhuma | Reload descarta todo o estado |
| Transporte | Desabilitado | Sem CRM, banco, API ou envio de feedback |
| Offline | Não garantido | Só continuar se os assets já estiverem carregados |
| Entrega | Não realizada | Sem exportação, relatório ou evidência formal |
| Instrumento/scoring | Bloqueados | A visualização exploratória não valida metodologia |

## Encerramento e handoff

Após o resultado, o facilitador confirma localmente:

1. limites metodológicos e operacionais explicados;
2. comprovante local conferido;
3. feedback estruturado testado;
4. descarte por reload explicado e ausência de dados reais confirmada.

O estado `Sessão sintética encerrada localmente` somente aparece com as quatro confirmações. Ele não é persistido, não autoriza compartilhamento externo e desaparece ao recarregar.

## Recuperação e rollback

- Voltar do formulário preserva o preflight na mesma sessão para permitir revisão e troca de cenário.
- `Refazer` inicia uma nova sessão e exige as confirmações novamente.
- Reload descarta preflight, respostas, resultado, comprovante, feedback e handoff.
- Para rollback técnico, remover a integração dos componentes de cockpit mantendo os mecanismos puros isolados; não há migration, schema ou estado remoto a reverter.

## Evidência automatizada

- testes unitários cobrem liberação válida e falha fechada para modo real, runtime habilitado, transporte, ausência de cenário/runbook e confirmações incompletas;
- E2E comprova CTAs bloqueados antes do preflight, liberação após três confirmações, encerramento após quatro confirmações e descarte por reload;
- guardrail de claims inclui as duas novas superfícies públicas;
- axe e matriz cross-browser continuam parte da validação pública.

## Bloqueios preservados

Permanecem dependentes de evidência externa e aceite formal: preview sincronizado, pacote de audiência, responsáveis, riscos residuais, narrativa externa e aprovação de gate. Este cockpit não altera esses bloqueios.
