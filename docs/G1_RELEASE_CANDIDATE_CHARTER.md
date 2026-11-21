# Carta do candidato de release — G1

Data da observação: 14/07/2026

## Resultado

Foi criado o manifesto `g1-local-candidate-scope`, versão `2026-07-14.2-audited`, para tornar o worktree revisável antes de qualquer ação Git externa.

O snapshot observado contém:

- 126 arquivos no escopo após a inclusão da sala comercial e da auditoria mecânica;
- 23 arquivos rastreados modificados e 103 arquivos ainda não rastreados;
- 28 documentos, 95 arquivos em `src`, um cenário E2E e dois arquivos de tooling;
- zero mudanças em `.github`, Supabase, migrations, `.env`, dependências ou arquivos não classificados;
- seis frentes com mecanismo, teste e documentação identificados.

Estado executável:

- escopo pronto para revisão interna;
- repositório oficial não confirmado;
- commit candidato, push e PR sem autorização explícita;
- SHA candidato ausente;
- merge, deploy, avanço de gate e dados reais invariavelmente bloqueados.

Política: `g1-release-candidate-charter-2026-07-14`.

## Problema, usuários e evidência

Problema: o worktree acumulou várias fatias coerentes e validadas, mas ainda não existe uma composição explícita que um revisor possa aceitar ou dividir antes de gerar o SHA candidato.

Usuários:

- engenharia e arquitetura, que precisam revisar escopo e risco;
- responsáveis de produto, SST, metodologia e privacidade, que precisam localizar as frentes sob sua autoridade;
- mantenedor do repositório, que precisa distinguir revisão interna de autorização para publicar.

Evidência produzida: inventário versionado, seis workstreams, camadas de teste/documentação, riscos, conflito de repositório e bloqueadores de promoção.

## Lentes consideradas

- produto e arquitetura: coesão das fatias, tamanho do review e ausência de refactor paralelo;
- segurança e supply chain: repositório oficial, SHA, autorização e exclusão de escopo sensível;
- governança e auditoria: proveniência, separação entre evidência local e aprovação formal;
- UX e acessibilidade: leitura rápida, risco visível, sem CTA enganoso ou ação mutável.

## Alternativas comparadas

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Documento manual com lista de arquivos | 6 | 7 | 10 | 6 | 6 | 4 | 10 | 4 | 10 | 63 |
| B | Manifesto tipado, fail-closed e visível no workspace | 9 | 10 | 8 | 9 | 9 | 9 | 8 | 9 | 8 | 79 |
| C | Mock de um candidato futuro | 4 | 7 | 10 | 6 | 4 | 4 | 10 | 3 | 10 | 58 |
| D | Adiar composição até a autorização de commit | 3 | 8 | 10 | 6 | 4 | 2 | 10 | 2 | 4 | 49 |
| E | Integrar ferramenta externa de release management | 8 | 7 | 3 | 5 | 7 | 8 | 3 | 9 | 3 | 53 |
| F | Engine genérica de composição e supply-chain | 7 | 9 | 3 | 6 | 8 | 10 | 3 | 10 | 3 | 59 |

Decisão: **ramo B**. Ele produz uma fronteira auditável entre escopo revisável e promoção autorizada sem introduzir integração, dependência ou automação externa prematura.

## Frentes do candidato

1. fundação, runtime e claims públicos;
2. prontidão comercial vendor-neutral;
3. metodologia e instrumentos;
4. operação e ensaio sintéticos;
5. governança e prontidão externa;
6. governança do candidato e do release.

Cada frente exige artefato representativo, teste, documentação, nota de revisão e ausência de escopo sensível. `review_ready` significa somente que a frente pode ser revisada; não significa aprovada, publicada ou aceita no gate.

A ordem, dependências, papéis e critérios de saída são definidos separadamente em `docs/G1_RELEASE_REVIEW_SEQUENCE.md`. O plano está estruturalmente pronto, mas sua execução ainda não foi autorizada.

A atribuição exata dos 126 caminhos é verificada pelo manifesto `docs/release/G1_RELEASE_SCOPE_MANIFEST.json` e pelo auditor local. O snapshot passou com zero duplicidades, caminhos não classificados, entradas obsoletas ou caminhos sensíveis.

Após a validação dos caminhos, o auditor calcula um digest agregado dos bytes de 124 arquivos e digests por frente. O manifesto e o documento que registra o recibo são as duas exclusões explícitas para evitar autorreferência; nenhum conteúdo ou hash individual é emitido.

O orçamento anticircular medido soma 11.734 linhas de delta em 120 arquivos. Governança externa concentra 33,8%, prontidão comercial 32,4% e release 19,2%; portanto, revisão monolítica foi rejeitada e essas frentes deverão ser subdivididas antes de qualquer composição Git. Seis registros que reproduzem o orçamento permanecem revisáveis, mas não alimentam a própria métrica.

## Regras fail-closed

- inventário deve fechar tanto por estado Git quanto por categoria de arquivo;
- workstream obrigatório ausente ou duplicado bloqueia a revisão;
- frente sem teste, documentação ou artefato representativo bloqueia a revisão;
- arquivo sensível ou não classificado bloqueia a revisão;
- checkout atual e handoff anterior não são promovidos silenciosamente a repositório oficial;
- commit, push e PR dependem de autorizações explícitas e separadas;
- merge, deploy, avanço de gate e dados reais permanecem falsos mesmo no cenário positivo do candidato.

## Critérios de aceite

- mecanismo puro em `src/lib/release` e snapshot G1 em `src/data`;
- inventário aritmeticamente consistente;
- seis frentes completas e sem escopo sensível;
- revisão de escopo separada de autorização de promoção;
- interface somente leitura, responsiva e sem botões ou links de mutação;
- casos positivo, estrutural, sensível e de claims proibidos cobertos por testes;
- documentação e pacote de release vinculados ao mesmo modelo mental.

## Evidência de validação

- 74 arquivos e 405 testes unitários/componentes verdes na matriz integral;
- 6 testes focados no mecanismo, card e composição da página;
- lint e typecheck verdes;
- build de produção e orçamento de bundle verdes;
- workspace detalhado em 111,85 kB, pacote comercial em 10,39 kB, snapshot compartilhado em 53,72 kB e Governança em 58,56 kB;
- inventário Git auditado em 126 arquivos, sem `.env`, migration, workflow, dependência ou arquivo Supabase;
- matriz browser anterior com 21 cenários verdes e 3 skips intencionais; não reexecutada nesta onda.

## Rollback

Remover `releaseCandidateCharter`, sua configuração G1, o card do workspace e este documento. O pacote de comprovação do release continua independente e bloqueado. Não há commit, push, PR, merge, deploy, migration ou integração a reverter.
