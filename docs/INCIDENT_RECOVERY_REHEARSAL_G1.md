# Ensaio sintético de incidente e recuperação — G1

Data: 15/07/2026

## Resultado

Foi implementado um cockpit local para exercitar `detectar → conter → investigar → recuperar → encerrar` usando exclusivamente um cenário sintético de tentativa de exposição de agregado abaixo de `k=5`.

O mecanismo emite apenas um recibo efêmero na sessão do navegador. Ele não persiste dados, não usa transporte remoto, não coleta texto livre e retorna invariavelmente:

- `canCountAsFormalExercise=false`;
- `canApproveRunbook=false`;
- `canEnableRealData=false`.

O item de maturidade “Incidente e DR exercitados” evolui de `blocked` para `partial`. O risco residual continua aberto e bloqueante porque runbook aprovado, responsáveis nomeados, tabletop formal, ata, evidência persistente e DR produtivo ainda não existem.

## Decisão Fable 5

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Checklist documental | 5 | 8 | 10 | 7 | 6 | 4 | 10 | 3 | 10 | 63 |
| B | Cockpit local + avaliador puro | 9 | 10 | 8 | 9 | 9 | 9 | 8 | 8 | 8 | 78 |
| C | Mock visual | 4 | 8 | 10 | 8 | 4 | 3 | 10 | 2 | 10 | 59 |
| D | Adiar até G3 | 2 | 9 | 10 | 8 | 3 | 2 | 10 | 2 | 3 | 49 |
| E | Integrar plataforma externa | 7 | 4 | 3 | 3 | 7 | 8 | 3 | 9 | 3 | 47 |
| F | Engine genérica completa | 7 | 8 | 3 | 6 | 8 | 10 | 3 | 10 | 3 | 58 |

Decisão: ramo B. Ele cria capacidade operacional demonstrável sem inventar infraestrutura, aprovação ou evidência externa.

## Lentes e invariantes

- **Segurança e privacidade:** cenário sintético, sem identificadores, persistência, rede ou acesso a microdados.
- **Operação:** fases monotônicas, objetivo e evidência esperada visíveis; ordem inválida falha fechada.
- **SST/DPO/Jurídico:** o ensaio local não aprova runbook, política, incidente formal ou gate.
- **Produto e acessibilidade:** fluxo por teclado, botões com alvo mínimo, lista semântica e estado anunciado por `aria-live`.
- **Arquitetura:** mecanismo puro em `src/lib`, configuração versionada em `src/data` e interface isolada.

## Critérios de aceite

- cinco fases obrigatórias, únicas e ordenadas;
- bloqueio de modo não sintético, dados reais, persistência e transporte remoto;
- recibo local somente após todas as fases;
- nenhuma promoção de G1, SaaS real, runbook ou dados reais;
- maturidade elevada apenas para `partial`;
- testes focados, typecheck, lint, build e revisão de diff verdes.

## Risco residual e próximo passo

O exercício ainda precisa ser realizado formalmente por responsáveis nomeados, sobre runbook aprovado, com ata, logs não sensíveis, critérios de RTO/RPO e teste de recuperação produtiva. Até lá, G1 e dados reais permanecem No-Go.

## Rollback

Remover o mecanismo, configuração, card e testes do ensaio; restaurar o item `incident_response` para `blocked` e a referência anterior do risco residual. Não há migration, dado, integração ou artefato remoto a reverter.
