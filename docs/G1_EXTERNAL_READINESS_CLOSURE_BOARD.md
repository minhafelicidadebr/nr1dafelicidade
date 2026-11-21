# Quadro de fechamento da prontidão externa — G1

Data: 14/07/2026

## Resultado

O workspace de prontidão externa agora apresenta um critical path somente leitura, composto diretamente pelos avaliadores de audiência, release, aceite formal e risco residual.

Estado atual:

- **0/4 trilhas prontas**;
- três trilhas em curso: release, narrativa e risco residual;
- uma trilha bloqueada: accountables e autoridade;
- próxima ação humana: nomear o sponsor/direção do produto, registrar autoridade e substituto;
- pacote preparatório não nominativo disponível em `docs/G1_ACCOUNTABLE_NOMINATION_PACK.md`;
- revisão formal, sessão externa, avanço de gate e dados reais permanecem bloqueados.

Política executável: `g1-external-readiness-closure-2026-07-14`.

## Problema e resultado operacional

Os quatro bloqueios do Decision Room estavam visíveis, mas ainda exigiam que o revisor deduzisse ordem, dependências, papéis e evidências em cards separados. O quadro produz:

- ordem crítica versionada;
- próxima ação segura e verificável;
- papel accountable esperado por trilha;
- dependências explícitas;
- referência de evidência e estado de verificação;
- separação entre trabalho em curso, trilha pronta e permissão para solicitar revisão formal.

Ele não grava conclusão manual. O estado muda somente quando os avaliadores de origem recebem evidência válida.

## Lentes aplicadas

- **SST, Jurídico e governança:** parecer, nomeação e aceite permanecem atos humanos externos ao sistema.
- **Privacidade e segurança:** dados reais e avanço de gate são invariantes falsos; qualquer alegação contrária falha fechada.
- **Produto e operação:** o revisor vê uma próxima ação única sem perder o contexto das quatro trilhas.
- **Arquitetura:** o mecanismo é genérico em `src/lib`; política e composição G1 permanecem em `src/data`.
- **UX e acessibilidade:** ordem semântica, status textual, ícones redundantes, leitura móvel e ausência de controles decorativos.

## Alternativas comparadas

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Checklist editável local | 6 | 5 | 9 | 4 | 6 | 5 | 9 | 5 | 9 | 58 |
| B | Quadro derivado, fail-closed e somente leitura | 9 | 10 | 8 | 9 | 9 | 9 | 8 | 9 | 8 | 79 |
| C | Mock visual sem mecanismo | 5 | 7 | 10 | 7 | 5 | 3 | 10 | 3 | 10 | 60 |
| D | Adiar até existirem accountables reais | 3 | 9 | 10 | 9 | 5 | 2 | 10 | 2 | 3 | 53 |
| E | Integrar GRC/workflow de aprovação | 8 | 8 | 3 | 5 | 8 | 9 | 3 | 10 | 3 | 57 |
| F | Engine genérica de workflow persistido | 7 | 7 | 3 | 5 | 8 | 10 | 3 | 10 | 3 | 56 |

Decisão: **ramo B**. Ele melhora ação e auditabilidade sem inventar estado, assinatura, persistência ou integração prematura.

## Critical path

| Ordem | Trilha | Dependências | Estado atual | Evidência |
|---:|---|---|---|---|
| 1 | Accountables e autoridade de suspensão | Nenhuma | Bloqueada | `docs/G1_FORMAL_ACCEPTANCE_LEDGER.md` |
| 2 | Release oficial e sincronização | Paralela à nomeação | Em curso | `docs/GITHUB_LOVABLE_SYNC_HANDOFF.md` |
| 3 | Narrativa para audiência sintética | Accountability | Em curso | `docs/G1_EXTERNAL_AUDIENCE_PACK.md` |
| 4 | Risco residual apto à revisão | Accountability e release | Em curso | `docs/G1_RESIDUAL_RISK_REGISTER.md` |

Todas as trilhas prontas permitem apenas `ready_for_formal_review`. O mecanismo retorna permanentemente `canAdvanceGate=false` e `canUseRealData=false`.

O pacote de nomeação reduz ambiguidade sobre papéis e agenda, mas não altera a primeira trilha: ela continuará bloqueada até existirem nomes, mandato, substitutos e decisões verificáveis fora do template local.

O pacote `docs/G1_RELEASE_PROOF_PACKET.md` detalha a segunda trilha. O CI e o deployment público do baseline `4a21c1c...` estão atestados; isso fecha a evidência técnica do release, mas não fecha o G1.

## Casos fail-closed

- trilha obrigatória ausente ou duplicada;
- dependência ausente, cíclica ou não pronta, inclusive de forma transitiva;
- status pronto sem owner;
- status pronto sem referência ou verificação da evidência;
- dados reais habilitados;
- alegação de avanço de gate.

## Critérios de aceite

- mecanismo puro separado da configuração G1;
- quadro derivado do snapshot único do workspace;
- quatro trilhas e dependências visíveis em ordem semântica;
- próxima ação aponta accountability, sem preencher nomes;
- nenhuma conclusão manual ou CTA de aprovação;
- casos positivos, estruturais e adversariais cobertos por testes;
- testes, lint, typecheck, build e orçamento de bundle verdes.

## Evidência de validação

- 69 arquivos e 371 testes verdes;
- 8 testes focados do mecanismo, composição e interface;
- lint e typecheck verdes;
- build e orçamento de bundle verdes;
- workspace detalhado em 71,25 kB e snapshot compartilhado em 52,87 kB;
- `git diff --check` sem erro.

## Rollback

Remover `externalReadinessClosure`, sua configuração G1, o componente do quadro e este documento. O Decision Room, pacote de audiência e simulador continuam independentes. Não há migration, persistência ou integração a reverter.
