# Pacote de nomeação e convocação — G1

Data: 14/07/2026

## Resultado

Foi criado o pacote `g1-accountable-nomination-preparation`, versão `2026-07-14.1-blank`, para preparar externamente a nomeação dos nove papéis obrigatórios do G1.

Estado atual:

- 9/9 cartas de papel completas;
- 6/6 blocos de agenda completos;
- sete limites declarados;
- zero nomes, contatos, assinaturas ou referências pessoais;
- template interno pronto;
- convocação, nomeação, reunião formal, parecer, gate e dados reais bloqueados.

Política executável: `g1-accountable-nomination-pack-2026-07-14`.

## Problema e evidência produzida

O ledger formal identifica os papéis pendentes, mas não detalha em uma única superfície o mandato mínimo, as responsabilidades e as evidências que cada indicado deverá apresentar. O pacote produz um artefato preparatório versionado com:

- propósito de cada papel;
- autoridade mínima e poder de suspensão;
- responsabilidades essenciais;
- evidências esperadas de mandato e parecer;
- campos explicitamente em branco para titular, substituto e autoridade;
- agenda de preparação em seis blocos;
- limites que impedem tratar o template como convocação ou nomeação.

## Lentes aplicadas

- **SST, Ergonomia e metodologia:** competência e poder de veto são explícitos; o sistema não presume habilitação.
- **Jurídico e governança:** designação, mandato, ata e parecer continuam atos externos e verificáveis.
- **Privacidade e segurança:** o template rejeita qualquer campo de identidade, persistência ou transporte remoto.
- **Participação do trabalhador:** representação/CIPA possui carta própria, mandato e canal de objeção.
- **Produto e acessibilidade:** detalhes nativos permitem leitura progressiva, teclado e mobile sem formulário decorativo.

## Alternativas comparadas

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Checklist livre com campos de nomes | 6 | 4 | 9 | 4 | 6 | 5 | 9 | 5 | 9 | 57 |
| B | Pacote versionado, não nominativo e validado | 9 | 10 | 8 | 9 | 9 | 9 | 8 | 9 | 8 | 79 |
| C | Mock ou documento sem validação | 5 | 7 | 10 | 7 | 5 | 4 | 10 | 4 | 10 | 62 |
| D | Adiar preparação até receber nomes | 3 | 9 | 10 | 9 | 5 | 2 | 10 | 2 | 4 | 54 |
| E | Integrar agenda, e-mail ou GRC | 8 | 7 | 3 | 4 | 7 | 9 | 3 | 10 | 3 | 54 |
| F | Criar workflow genérico de nomeações | 7 | 7 | 3 | 5 | 8 | 10 | 3 | 10 | 3 | 56 |

Decisão: **ramo B**. Ele prepara a ação humana prioritária sem coletar PII, simular autoridade ou antecipar infraestrutura de aprovação.

## Nove cartas de papel

1. sponsor/direção do produto;
2. responsável técnico SST;
3. ergonomista responsável;
4. responsável metodológico/psicométrico;
5. DPO/encarregado LGPD;
6. Jurídico/regulatório;
7. Segurança/arquitetura;
8. representação de trabalhadores/CIPA;
9. Operação/incident commander.

Cada carta exige ao menos dois itens de autoridade, duas responsabilidades e duas evidências esperadas. Isso descreve o papel; não comprova que uma pessoa real atende aos requisitos.

## Agenda preparatória

1. abertura, escopo e limites;
2. nomeação dos papéis obrigatórios;
3. autoridade, suspensão e continuidade;
4. matriz de evidências e pareceres;
5. stop conditions e cuidado;
6. próximos passos, decisões e recibos futuros.

## Casos fail-closed

- papel obrigatório ausente ou duplicado;
- carta incompleta;
- bloco obrigatório ausente, duplicado ou com papel desconhecido;
- limites insuficientes;
- qualquer nome, substituto ou referência pessoal preenchida;
- persistência ou transporte remoto habilitado;
- alegação de reunião formal, avanço de gate ou dados reais.

## Critérios de aceite

- mecanismo puro separado da configuração G1;
- nove cartas derivadas dos papéis existentes no ledger;
- agenda e limites versionados;
- ausência de inputs, botões de nomeação ou envio;
- identidade, persistência, transporte, reunião e gate falham fechados;
- testes de estrutura, conteúdo e contexto adversarial;
- testes, lint, typecheck, build e bundle verdes.

## Evidência de validação

- 69 arquivos e 371 testes verdes na matriz integral;
- 8 testes focados do pacote, composição e interface verdes após o code splitting;
- lint, typecheck, build e orçamento de bundle verdes;
- pacote isolado na rota detalhada; snapshot compartilhado preservado em 52,87 kB;
- workspace detalhado em 71,25 kB, carregado somente quando aberto;
- `git diff --check` sem erro.

## Rollback

Remover `accountableNominationPack`, sua configuração G1, o card do workspace e este documento. O ledger e o closure board permanecem independentes. Não há migration, PII, persistência ou integração a reverter.
