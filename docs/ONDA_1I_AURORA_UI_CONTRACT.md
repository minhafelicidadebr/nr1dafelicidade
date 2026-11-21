# Onda 1I — contrato visual dos destaques Aurora

## Decisão

A transformação de `AuroraAnswer.highlights` em barras de risco saiu do componente React e foi isolada em `projectRiskHighlights`. O mecanismo aceita somente o contrato de tom `neutral | warn | good | danger` e projeta valores que começam com `R` seguido de número.

## Guardrails

- valores sem score numérico são descartados e não viram barra;
- o tom visual permanece derivado do contrato fechado do Aurora;
- a interface mostra apenas destaques agregados já produzidos pela resposta institucional;
- não há ranking individual, diagnóstico, decisão de RH ou nova chamada de IA;
- quando não há destaque válido, a seção de barras não é renderizada.

## Evidência e UX

O teste cobre múltiplos tons, decimal, valor inválido e conjunto vazio. A UI mantém o estado vazio silencioso para não sugerir uma métrica inexistente; a informação textual e os disclaimers continuam sendo a fonte principal para leitores de tela e usuários em mobile.

## Limites

Esta onda não altera o conteúdo Aurora, fontes, scoring, k-anonimato, persistência, retenção ou gate. O conteúdo continua preliminar, local/determinístico e sujeito a revisão técnica competente.
