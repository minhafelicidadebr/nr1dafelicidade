# Ledger de aceite formal G1

Data: 30/06/2026

## Objetivo

Transformar o pacote de aceite G1 em um controle operacional verificavel: papeis obrigatorios, autoridade, substitutos, decisoes disciplinares, ressalvas e bloqueios. A melhoria nao cria assinatura real, nao aprova G1 e nao libera dados reais.

## Decisao Fable 5

Opcoes avaliadas:

- Manter apenas o documento `docs/G1_APPROVAL_PACKET.md`: insuficiente para cockpit operacional.
- Criar banco de aprovacoes agora: adiado, pois exige schema, RLS, trilha de assinatura e accountables reais.
- Criar avaliador puro + dados versionados + card de Governanca: escolhido como fatia segura.
- Integrar GRC externo: fora do escopo atual.
- Aceitar aprovacao manual sem teste: rejeitado por risco de overclaim.

## Implementacao

- `src/lib/governance/formalAcceptance.ts`
  - avalia papeis obrigatorios, autoridade, substitutos e decisoes;
  - exige referencia e SHA-256 valido para toda decisao que nao esteja pendente e para cada evidencia de ressalva;
  - aceita aprovacao com ressalvas somente se cada ressalva tiver responsavel, prazo e evidencia;
  - falha fechado em decisao pendente, rejeicao, ausencia de evidencia ou escopo de dados reais.
- `src/data/g1FormalAcceptance.ts`
  - define a politica `g1-formal-acceptance-2026-06-30`;
  - registra o estado atual: todos os accountables e decisoes formais permanecem pendentes.
- `src/lib/governance/formalAcceptance.test.ts`
  - comprova bloqueio atual;
  - comprova caminho positivo apenas com papeis e decisoes completos;
  - bloqueia rejeicao e ressalva sem responsavel, prazo e evidencia.
- `src/pages/app/GovernancePage.tsx`
  - exibe "Aceite formal G1" como controle explicito de Governanca.

## Estado atual

O workspace de prontidão externa representa este ledger como primeira trilha do critical path, mas permanece somente leitura: não nomeia pessoas, não registra autoridade e não cria decisões em nome dos accountables.

O documento `docs/G1_ACCOUNTABLE_NOMINATION_PACK.md` e seu card preparam cartas de papel e agenda sem receber nomes. Template pronto não muda nenhum contador deste ledger.

Bloqueado:

- sponsor/direcao do produto nao nomeado;
- responsavel SST nao nomeado;
- ergonomista nao nomeado;
- responsavel metodologico/psicometrico nao nomeado;
- DPO/LGPD nao nomeado;
- juridico/regulatorio nao nomeado;
- seguranca/arquitetura nao nomeado;
- representacao de trabalhadores/CIPA nao nomeada;
- operacao/incident commander nao nomeado;
- nenhuma decisao disciplinar formal foi registrada.

## Criterios de aceite futuro

- Todos os papeis obrigatorios nomeados.
- Autoridade/registro/mandato e substituto registrados.
- Todas as disciplinas com decisao diferente de `pending` e `rejected`.
- Toda decisao possui referencia e SHA-256 valido da evidencia, sem armazenar o artefato ou conteudo no aplicativo.
- Toda aprovacao com ressalva possui responsavel, prazo, referencia e SHA-256 valido da evidencia.
- Ata ou parecer vinculados a cada decisao.
- Escopo permanece `G1 - campanha sintetica segura`.
- Dados reais continuam proibidos ate G3 e aprovacoes especificas.

## Limites

- Nao substitui assinatura, ata, parecer juridico, decisao de DPO, revisao SST/Ergonomia ou revisao psicometrica.
- Nao cria workflow persistido de aprovacao.
- SHA-256 comprova integridade do artefato referenciado, nao autoria, competencia, assinatura ou aprovacao humana.
- Nao muda RLS, banco, auth ou runtime.
- Nao aprova G1.

## Rollback

Remover `src/lib/governance/formalAcceptance.ts`, `src/data/g1FormalAcceptance.ts`, `src/lib/governance/formalAcceptance.test.ts` e o card `FormalAcceptanceCard` em `src/pages/app/GovernancePage.tsx`.
