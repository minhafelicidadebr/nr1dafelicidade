# Sequência de revisão do candidato — G1

Data: 14/07/2026

## Resultado

Foi criado o plano `g1-release-review-sequence`, versão `2026-07-14.1-planned`, para ordenar a revisão das seis frentes da carta do candidato antes de qualquer ação Git.

Estado atual:

- estrutura do plano válida e pronta para solicitar autorização de revisão;
- seis frentes cobertas exatamente uma vez;
- dependências existentes, acíclicas e anteriores às etapas consumidoras;
- papéis revisores, critérios de saída e comandos de validação presentes;
- revisão ainda não iniciada nem autorizada;
- commit, PR, merge, deploy, avanço de gate e dados reais bloqueados.

Política executável: `g1-release-review-plan-2026-07-14`.

## Problema e evidência

Problema: um manifesto de 126 arquivos reduz ambiguidade de escopo, mas ainda pode produzir revisão superficial se não houver ordem, especialidade responsável e saída verificável por frente.

Usuários: engenharia, produto, metodologia/psicometria, SST, jurídico/comercial, privacidade/segurança, QA, maintainer e revisor independente.

Evidência produzida: DAG versionado com cobertura bijetiva dos workstreams, dependências, papéis, critérios de saída, validações e bloqueios de execução.

## Alternativas comparadas

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Checklist linear apenas no documento | 6 | 7 | 10 | 6 | 6 | 4 | 10 | 4 | 10 | 63 |
| B | DAG tipado com critérios e fail-closed no card existente | 9 | 10 | 8 | 10 | 9 | 9 | 8 | 9 | 8 | 80 |
| C | Simular recibos de revisão | 4 | 5 | 9 | 4 | 4 | 4 | 9 | 3 | 9 | 51 |
| D | Adiar a sequência até existir SHA | 3 | 7 | 10 | 5 | 4 | 2 | 10 | 2 | 4 | 47 |
| E | Usar GitHub Projects ou ferramenta externa | 8 | 7 | 3 | 5 | 7 | 8 | 3 | 9 | 3 | 53 |
| F | Engine genérica de workflow de reviews | 7 | 9 | 3 | 7 | 8 | 10 | 3 | 10 | 3 | 60 |

Decisão: **ramo B**. Ele converte o risco de um review amplo em uma sequência testável, sem adicionar dependência, persistência ou outra tela.

## Sequência recomendada

| Ordem | Frente | Dependências | Papéis mínimos | Saída mínima |
|---:|---|---|---|---|
| 1 | Fundação e claims | — | Engenharia; Produto e claims | Runtime sintético e claims compatíveis |
| 2 | Metodologia e instrumentos | Fundação | Metodologia/Psicometria; SST | Proveniência e lacunas visíveis |
| 3 | Prontidão comercial | Fundação | Produto; Jurídico/Comercial | Oferta sem promessa de conformidade ou operação real |
| 4 | Operação sintética | Fundação; Metodologia | QA; Produto; SST | Cenários determinísticos e sem dado real |
| 5 | Governança externa | Comercial; Operação sintética | SST; Privacidade/Segurança; Produto | Decision Room No-Go e accountability não nominativa |
| 6 | Candidato e release | Governança externa | Maintainer; Segurança; Revisor independente | Escopo aceito ou dividido e repositório oficial decidido |

Metodologia e comercial compartilham a fundação, mas não dependem entre si. A ordem numérica é recomendada para reduzir troca de contexto; a dependência é a fonte de verdade para bloqueio.

## Orçamento observado de revisão

O auditor combina `git diff --numstat --no-renames HEAD` para arquivos rastreados com a contagem integral de linhas dos arquivos novos. Seis arquivos que registram o próprio orçamento permanecem excluídos para evitar autorreferência; o recibo de conteúdo mantém suas duas exclusões próprias.

| Frente | Arquivos | Adições | Remoções | Delta | Participação |
|---|---:|---:|---:|---:|---:|
| Fundação e claims | 6 | 111 | 13 | 124 | 1,1% |
| Prontidão comercial | 30 | 3.727 | 76 | 3.803 | 32,4% |
| Metodologia e instrumentos | 8 | 327 | 6 | 333 | 2,8% |
| Operação sintética | 22 | 1.236 | 10 | 1.246 | 10,6% |
| Governança externa | 37 | 3.936 | 35 | 3.971 | 33,8% |
| Governança de release | 17 | 2.257 | 0 | 2.257 | 19,2% |
| **Total** | **120** | **11.594** | **140** | **11.734** | **100%** |

Não há binários neste escopo. Arquivos novos representam 99/120 arquivos mensurados; os seis registros excluídos continuam no manifesto e devem ser revisados, mas não alimentam a própria métrica.

## Estratégia de fatiamento

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Um commit e uma revisão monolítica | 4 | 4 | 9 | 3 | 5 | 3 | 9 | 4 | 9 | 50 |
| B | Um candidato com revisão fatiada pelo DAG e subpacotes na governança externa | 10 | 10 | 8 | 10 | 10 | 9 | 8 | 9 | 8 | 82 |
| C | Seis PRs empilhados por workstream | 8 | 8 | 4 | 7 | 8 | 8 | 4 | 8 | 4 | 59 |
| D | Adiar a revisão até existir repositório oficial | 3 | 7 | 10 | 5 | 4 | 2 | 10 | 2 | 3 | 46 |
| E | Importar o escopo em ferramenta externa de review | 7 | 7 | 3 | 5 | 6 | 7 | 3 | 8 | 3 | 49 |
| F | Criar engine genérica de partitioning | 7 | 9 | 3 | 7 | 7 | 10 | 3 | 10 | 3 | 59 |

Decisão: **ramo B**. A etapa de governança externa não deve ser tratada como bloco único: ela precisa de subpacotes internos para decisão/closure, accountability e audiência/workspace. A composição em commits continua pendente de revisão e autorização explícita.

## Pré-revisão técnica do worktree

Uma pré-revisão de engenharia foi executada sobre as seis frentes, sem alterar o estado `planned` das etapas e sem representar aceite dos papéis revisores. Foram verificadas fronteiras de claims, separação entre mecanismo e domínio, transporte/persistência, fail-closed, integridade de catálogo, UX acessível e cobertura automatizada.

| Frente | Resultado técnico observado | Limite preservado |
|---|---|---|
| Fundação e claims | Guardrails públicos e runtime sintético coerentes; nenhum novo overclaim comprovado | Não constitui revisão de Produto/claims |
| Metodologia e instrumentos | Bloqueios de fonte, licença, scoring e revisão independente continuam explícitos | Nenhum instrumento foi validado |
| Prontidão comercial | Descoberta controlada, autorização e ensaio da proposta separados de piloto pago e entrega vendor-neutral | Não autoriza proposta, CRM remoto, cobrança ou piloto |
| Operação sintética | Estado local, comprovantes em memória e descarte permanecem testados | Não permite participante ou dado real |
| Governança externa | Achado de integridade de catálogo corrigido em audiência e ensaio do facilitador | Papéis, pareceres e decisão formal continuam pendentes |
| Candidato e release | Manifesto exato, recibos agregados e promoção bloqueada | Não cria SHA, commit, push, PR ou aceite |

### Decisão da correção

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Registrar o achado sem alterar o avaliador | 4 | 5 | 10 | 4 | 5 | 3 | 10 | 3 | 10 | 54 |
| B | Fortalecer audiência externa e ensaio com validação estrutural | 10 | 10 | 8 | 10 | 10 | 8 | 8 | 8 | 8 | 80 |
| C | Simular catálogos inválidos apenas em documentação | 3 | 5 | 9 | 4 | 4 | 3 | 9 | 3 | 9 | 49 |
| D | Adiar até a revisão formal dos accountables | 2 | 6 | 10 | 4 | 3 | 2 | 10 | 2 | 3 | 42 |
| E | Adotar biblioteca externa de schema validation | 7 | 8 | 4 | 6 | 7 | 8 | 4 | 8 | 4 | 56 |
| F | Criar engine genérica de validação de catálogos | 7 | 9 | 3 | 7 | 8 | 10 | 3 | 9 | 3 | 59 |

Decisão: **ramo B**. Duplicidades, chaves vazias, linhas em branco e cenários incompletos agora bloqueiam o ensaio; a correção reutiliza os avaliadores existentes, não adiciona dependência e não muda qualquer permissão externa.

## Regras fail-closed

- cada workstream obrigatório deve aparecer exatamente uma vez;
- workstream desconhecido, stage duplicado ou ordem repetida bloqueia o plano;
- dependência ausente, posterior ou cíclica bloqueia o plano;
- papel revisor, critério de saída ou comando de validação vazio bloqueia o plano;
- iniciar revisão sem autorização explícita bloqueia a execução;
- a autorização de revisão não autoriza commit ou PR;
- merge, deploy, avanço de gate e dados reais permanecem falsos em qualquer estado deste plano.

## Critérios de aceite

- mecanismo puro separado da configuração G1;
- cobertura exata das seis frentes da carta;
- ordenação determinística e detecção de ciclos;
- cenários estruturais, positivos e adversariais testados;
- sequência visível no card existente, sem CTA ou estado editável;
- linguagem de papéis, sem nomes ou identidade pessoal;
- documentação, carta e pacote de comprovação coerentes.
- orçamento de revisão derivado de métricas reais, sem threshold ou score automático no código;
- governança externa subdividida para revisão antes de qualquer composição Git.

## Evidência de validação

- 74 arquivos e 405 testes unitários/componentes verdes na matriz integral;
- 10 testes focados cobrindo plano, carta, card e composição da página;
- lint e typecheck verdes;
- build de produção e orçamento de bundle verdes;
- workspace detalhado em 111,85 kB, pacote comercial em 10,39 kB, snapshot compartilhado em 53,72 kB e Governança em 58,56 kB;
- inventário Git confirmado em 126 arquivos e zero arquivos sensíveis no diff;
- matriz browser anterior com 21 cenários verdes e 3 skips intencionais; não reexecutada nesta onda.

## Rollback

Remover `releaseReviewPlan`, sua configuração G1, a seção de sequência no card e este documento. A carta do candidato e o pacote de comprovação permanecem independentes. Não há commit, push, PR, merge, deploy, migration ou integração a reverter.
