# Constituição Operacional — Playbook NR-1

## Tese

Construir o Sistema Operacional de Evidências e Intervenções para Trabalho Saudável: medir → contextualizar no trabalho real → avaliar → agir → evidenciar → reavaliar, protegendo o trabalhador e mantendo decisões técnicas rastreáveis.

## Gate Atual

- G0/G1 local e sintético.
- G1 ainda não aprovado.
- Dados reais, trabalhadores reais, campanhas reais, IA remota em produção e avanço de gate seguem **No-Go** até G3 e aprovações formais.

## Invariantes

- Respostas individuais nunca ficam acessíveis a usuários da organização.
- `k >= 5` é obrigatório no servidor e em toda saída.
- Identidade, convite e resposta não podem ser correlacionados por atores organizacionais.
- Questionário não substitui AEP, AET, observação do trabalho real, participação de trabalhadores/CIPA ou avaliação técnica.
- Relatórios, recomendações e documentos são preliminares até revisão/assinatura competente.
- IA não diagnostica, pune, classifica trabalhadores, assina documentos ou garante conformidade.
- Fórmula, fonte, versão, premissas, autoria, override e hash devem ser auditáveis.

## Arquitetura

- `src/lib`: mecanismos puros e transitórios.
- `src/data`: configuração de domínio, políticas, textos, fontes e registros versionados.
- Componentes React não devem hardcodar regra regulatória, psicométrica, privacidade ou scoring.
- `src/engine` e `src/domain/packs` só entram como migração explícita e testada.

## Roteador de Tokens

Classifique toda tarefa como `LITE`, `SPRINT` ou `MASTER` usando `docs/FABLE5_TOKEN_ECONOMY.md`.

Escalar para `MASTER` ao tocar em schema, RLS, autenticação, privacidade/LGPD, k-anonimato, scoring, instrumento, IA/RAG, documento auditável, fonte normativa/psicométrica, risco residual, consentimento, dados reais ou mudança difícil de reverter.

## Validação

Escolha a validação proporcional ao risco. Não declarar pronto com teste, lint, typecheck, build ou contrato relevante vermelho.
