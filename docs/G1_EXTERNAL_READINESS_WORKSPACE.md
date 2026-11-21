# Workspace de prontidão externa — G1 sintético

Data: 14/07/2026

## Resultado

A preparação de uma eventual sessão externa sintética foi separada da página longa de Governança em `/app/governance/external-readiness`. A rota continua protegida pelo `AuthGuard`, é carregada sob demanda e mantém o estado vigente **No-Go externo**.

Governança conserva o resumo decisório 2/6 e o critical path. O workspace concentra:

- Decision Room e próxima evidência bloqueante;
- quadro de fechamento com critical path, dependências e owners esperados;
- pacote não nominativo para preparar papéis, autoridade e agenda;
- carta do candidato que separa escopo revisável de autorização de promoção;
- sequência acíclica de revisão com papéis e critérios de saída;
- pacote de comprovação que separa prova local, histórica e atual do release;
- pacote versionado de audiência;
- simulador local de condutas do facilitador.
- ensaio local do lançamento comercial com proposta interna versionada e recibo `No-Go`.
- sala de decisão comercial com pauta e pré-leituras prontas, mas quórum e convocação externos pendentes.

Não há migration, persistência, integração remota, agenda, assinatura, mudança de gate ou habilitação de dados reais.

## Decisão Fable 5

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Manter todos os cards na página de Governança | 5 | 8 | 10 | 7 | 6 | 6 | 9 | 4 | 10 | 65 |
| B | Workspace focado, lazy-loaded, com resumo em Governança | 9 | 9 | 8 | 9 | 9 | 9 | 8 | 9 | 8 | 78 |
| C | Criar abas dentro de Governança | 7 | 8 | 7 | 7 | 7 | 7 | 6 | 6 | 7 | 62 |
| D | Manter a preparação somente em documentos | 4 | 8 | 10 | 8 | 5 | 4 | 10 | 3 | 10 | 62 |
| E | Adotar portal externo de GRC/enablement | 7 | 8 | 3 | 5 | 7 | 8 | 3 | 9 | 3 | 53 |
| F | Criar engine genérica de workspaces de gate | 7 | 8 | 4 | 6 | 8 | 10 | 4 | 9 | 4 | 60 |

Decisão: **ramo B**. Ele reduz carga cognitiva e bundle da página principal, preserva descoberta pelo Decision Room e cria um contexto operacional coeso sem infraestrutura prematura.

## Arquitetura e limites

- `g1ExternalReadinessWorkspace` compõe um único snapshot fail-closed para as duas páginas;
- `externalReadinessClosure` deriva quatro trilhas do snapshot sem criar estado paralelo;
- o pacote de autorização do serviço assistido é composto separadamente e não altera o No-Go externo;
- o ensaio comercial deriva desse pacote, permanece somente em memória e nunca envia proposta ou inicia entrega;
- a sala comercial permanece somente leitura e nunca agenda, convida, registra ata ou autoriza venda;
- a rota nova é irmã de Governança dentro do shell autenticado;
- não foi criado item na navegação global, pois o workspace é uma atividade contextual de Governança;
- o link de retorno e o título de página preservam orientação e navegação por teclado;
- o status No-Go aparece antes das ferramentas de preparação;
- o simulador permanece em memória e é revogado por reset ou reload;
- não existe CTA para aprovar, publicar, agendar ou liberar sessão externa.
- não existe checkbox de conclusão; toda prontidão depende de evidência verificada na fonte.
- o pacote de nomeação contém somente cartas e campos explicitamente em branco.
- cartas e agenda pertencem apenas ao chunk desta rota; Governança não carrega o pacote preparatório não nominativo.

## Critérios de aceite

- Governança não importa nem renderiza os cards detalhados de audiência e ensaio;
- o resumo do Decision Room aponta para o workspace;
- a rota detalhada é lazy-loaded e permanece sob `AuthGuard`;
- as duas superfícies usam o mesmo snapshot de decisão;
- o quadro mostra 0/4 trilhas prontas e prioriza accountability sem preencher nomes;
- o pacote comercial mostra 4/4 cartas e 4/4 templates, mas 0/4 papéis e 0/4 decisões autorizados;
- o ensaio comercial exige quatro confirmações, seis decisões e termina em `No-Go` no estado atual;
- a sala comercial mostra pauta 7/7 e pré-leituras 5/5, mas quórum e alçadas 0/4;
- uso externo, coleta de audiência e dados reais continuam bloqueados;
- página e composição têm testes focados;
- testes, typecheck, lint, build e orçamento de bundle permanecem verdes.

## Evidência de validação

- 74 arquivos e 405 testes unitários/componentes verdes;
- lint e typecheck verdes;
- build de produção e orçamento de bundle verdes;
- chunk específico de Governança permanece em 58,56 kB;
- pacote comercial isolado em 10,39 kB e workspace detalhado em 111,85 kB;
- snapshot compartilhado permanece em 53,72 kB;
- `git diff --check` sem erro.

## Rollback

Remover a rota `governance/external-readiness`, a página, o snapshot compartilhado e o link opcional do Decision Room; então recolocar os dois cards detalhados em `GovernancePage`. Não há banco, dado ou integração a reverter.
