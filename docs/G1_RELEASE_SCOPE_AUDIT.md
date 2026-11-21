# Auditoria mecânica do escopo de release — G1

Data: 14/07/2026

## Resultado

O escopo do candidato deixou de depender apenas de contagem declarativa. O manifesto machine-readable `g1-release-scope-manifest`, versão `2026-07-15.1-observed`, atribui cada caminho modificado ou novo a exatamente uma das seis frentes da carta.

O auditor local:

- consulta somente `git diff --name-only HEAD` e `git ls-files --others --exclude-standard`;
- somente após validar caminhos, lê bytes dos arquivos permitidos para hashing local; nunca lê `.env`, histórico remoto ou credenciais;
- exige igualdade exata entre worktree e manifesto;
- bloqueia caminho duplicado, não classificado, obsoleto ou sensível;
- confirma contagens por origem e categoria;
- emite SHA-256 do conjunto de caminhos, do manifesto, da árvore de conteúdo e de cada frente;
- não emite conteúdo nem hash individual de arquivo;
- agrega numstat, linhas de arquivos novos e concentração por frente, sem threshold automático;
- escreve apenas o recibo JSON em stdout.

## Alternativas comparadas

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Manter somente contagens manuais | 4 | 6 | 10 | 4 | 5 | 3 | 10 | 3 | 10 | 55 |
| B | Manifesto exato e recibo agregado de conteúdo fail-closed | 10 | 10 | 8 | 10 | 9 | 9 | 8 | 9 | 8 | 81 |
| C | Classificação heurística por regex | 7 | 7 | 8 | 5 | 7 | 8 | 7 | 8 | 8 | 65 |
| D | Adiar auditoria até o PR | 3 | 6 | 10 | 4 | 4 | 2 | 10 | 2 | 3 | 44 |
| E | Usar scanner externo de supply chain | 8 | 7 | 3 | 5 | 7 | 8 | 3 | 9 | 3 | 53 |
| F | Criar engine genérica de change attribution | 8 | 9 | 3 | 7 | 8 | 10 | 3 | 10 | 3 | 61 |

Decisão: **ramo B**. O custo de manter a lista explícita é aceitável neste candidato e evita falsos positivos de classificadores heurísticos. Uma engine genérica só se justifica após repetição do processo em múltiplos releases.

## Contrato observado

- total esperado: 126 arquivos;
- rastreados modificados: 23;
- não rastreados: 92;
- categorias: 26 documentos, 86 arquivos-fonte, 1 E2E e 2 arquivos de tooling;
- arquivos sensíveis esperados: zero;
- workstreams obrigatórios: fundação/claims, comercial, metodologia/instrumentos, operação sintética, governança externa e governança de release.
- conteúdo: 124 arquivos incluídos e 2 exclusões anti-circularidade;
- algoritmo: `sha256-path-null-file-sha256-v1`, aplicado sobre caminho relativo e SHA-256 dos bytes brutos;

O manifesto inclui o próprio manifesto, o auditor, seus self-tests e este documento. Qualquer mudança futura no worktree deve atualizar explicitamente a atribuição e as contagens antes de produzir novo recibo verde.

## Regras fail-closed

- workstream obrigatório ausente, duplicado ou desconhecido bloqueia;
- workstream vazio bloqueia;
- caminho presente em mais de uma frente bloqueia;
- caminho sujo sem atribuição bloqueia;
- caminho declarado que não está mais sujo bloqueia;
- `.env*`, Supabase, `.github`, `package.json` ou lockfile no escopo bloqueiam;
- caminho sensível nunca chega à leitura de conteúdo;
- caminho não regular bloqueia o recibo de conteúdo;
- divergência em total, estado Git ou categoria bloqueia;
- recibo bloqueado retorna exit code diferente de zero.

## Critérios de aceite

- auditor usa argumentos estruturados de processo, sem shell dinâmico;
- nenhuma leitura de conteúdo sensível;
- manifesto cobre o worktree um-para-um;
- self-tests cobrem sucesso, drift, duplicidade e caminho sensível;
- auditoria viva retorna `verified` e zero blockers;
- mutação de um byte altera o digest da árvore e da frente correspondente;
- nenhum hash individual é exposto no recibo;
- orçamento de revisão fecha em 120 arquivos após seis exclusões anticirculares próprias, separadas das duas exclusões do recibo de conteúdo;
- documentação registra hashes e validações sem promover o release.

## Evidência de execução

- auditoria viva: `verified`;
- 126 caminhos: 23 rastreados modificados e 103 não rastreados;
- categorias: 28 documentos, 95 arquivos-fonte, 1 E2E, 2 de tooling e 0 outros;
- frentes: fundação 6, comercial 30, metodologia 8, operação sintética 22, governança externa 39 e release 21;
- duplicados, não classificados, obsoletos e sensíveis: zero;
- SHA-256 do conjunto ordenado de caminhos: `f24ae74c971d9e64d1922cca93b7bcad8324d6328eae480362f316855852e5dd`;
- SHA-256 do manifesto: `ad492014ef1f2a07b7f95212cd3fc971501060ec67ece2f9e7533271018f67ca`;
- árvore agregada de conteúdo: 124 arquivos, 739.172 bytes, SHA-256 `cfdbb1492a3957c56c367776ec157a744ea71a2d2fb8e4b57659e07153ac20c5`;
- fundação/claims: `cdc75f75aeb58dd1fc19dc9d4369dfc8705f0d2f10c0e6649ccdca40da482435`;
- comercial: `a2ad9c143a5b92e6ae6c91c9bea709796256287521cd58b5242929ec813104fb`;
- metodologia/instrumentos: `334c08db7b541e740391feb69e4dec4810ba46af2f9bc0cef19a3265b7643f6d`;
- operação sintética: `d7d7c43bff42d452e842a2e559bd40ae8f95d338d8f070e7147e45616f72b2b6`;
- governança externa: `5abd590f76a86136f24989502bd33536243f249624af5b5852c1a1ed03c52107`;
- governança de release: `6db7f4f604ac4ab3775a727e32cfda3ba5238217feb168f7c2c0c665b4813fd2`;
- orçamento anticircular: 120 arquivos, 11.594 adições, 140 remoções e 11.734 mudanças; governança externa concentra 33,8%;
- 9 self-tests Node verdes: escopo exato, drift, duplicidade/sensível, determinismo, mutação, caminho não regular, numstat, binário e exclusão anticircular.
- 15 testes focados de governança de release verdes;
- 74 arquivos e 405 testes da aplicação verdes;
- lint, typecheck, build de produção e orçamento de bundle verdes;
- workspace detalhado em 111,85 kB e pacote comercial isolado em 10,39 kB; auditor não integra o bundle da aplicação;
- matriz browser anterior com 21 cenários verdes e 3 skips intencionais; não reexecutada nesta onda.

Limite: o digest usa bytes brutos do working tree e pode variar com normalização de line endings entre ambientes. Ele comprova este workspace local; não substitui Git blob, commit assinado ou atestação remota.

## Rollback

Remover o manifesto, `audit-release-scope.mjs`, seus self-tests e este documento; restaurar as contagens anteriores da carta. Não há package script, workflow, commit, push, PR, deploy, migration ou integração externa a reverter.
