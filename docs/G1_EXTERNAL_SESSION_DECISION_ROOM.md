# Decision room — sessão externa sintética G1

Data: 14/07/2026

## Resultado

O estado atual é **No-Go externo**. O walkthrough privado, local e sintético permanece permitido; sessão externa, audiência pública, agenda, dados reais e avanço de gate permanecem bloqueados.

Política executável: `g1-external-session-decision-2026-07-14`.

## Problema e resultado operacional

Os sinais necessários para decidir uma sessão externa estavam distribuídos entre ensaio, demo pública, release, aceite formal e risco residual. O decision room compõe esses avaliadores sem substituir suas regras e produz:

- uma decisão única e fail-closed;
- a próxima evidência bloqueante;
- separação entre `No-Go`, `pronto para revisão formal` e `aprovado para sessão externa sintética`;
- evidência explícita de que nenhuma dessas etapas permite dados reais.

Usuários principais: sponsor de produto, SST, ergonomia, metodologia, DPO, jurídico, segurança, representação de trabalhadores/CIPA e operação.

## Lentes aplicadas

- **SST e ergonomia:** sessão externa não pode transformar visualização exploratória em diagnóstico, AEP/AET ou decisão técnica.
- **Jurídico, privacidade e segurança:** claims, escopo, accountables, risco residual e recibo formal são pré-condições; dados reais continuam proibidos.
- **Produto, operação e acessibilidade:** o próximo bloqueio precisa estar visível e acionável sem criar CTA fictício de aprovação ou assinatura.
- **Arquitetura:** mecanismos especializados permanecem fontes de verdade e o novo avaliador apenas os compõe.

## Alternativas comparadas

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Atualizar somente o card de demo pública | 6 | 7 | 9 | 7 | 7 | 4 | 9 | 4 | 9 | 62 |
| B | Compor avaliadores num decision room | 9 | 9 | 7 | 8 | 9 | 8 | 7 | 8 | 7 | 72 |
| C | Simular o pacote apenas em documento | 4 | 8 | 10 | 9 | 5 | 3 | 10 | 3 | 10 | 62 |
| D | Adiar toda decisão externa | 2 | 9 | 10 | 10 | 3 | 2 | 10 | 2 | 2 | 50 |
| E | Integrar GRC/assinatura externa agora | 7 | 8 | 2 | 5 | 7 | 8 | 2 | 9 | 2 | 50 |
| F | Criar engine genérica de gates | 7 | 8 | 4 | 6 | 8 | 10 | 4 | 9 | 4 | 60 |

Decisão: **ramo B**. Ele entrega clareza operacional agora, reutiliza evidências existentes e evita banco, assinatura fictícia, integração prematura ou abstração excessiva.

## Contrato da decisão

Seis dimensões são obrigatórias:

1. runtime e claims em modo seguro;
2. sessão guiada ensaiada;
3. narrativa e limites aprováveis para audiência;
4. release oficial comprovado;
5. accountables e decisões formais;
6. risco residual apto à revisão.

Transições permitidas:

`No-Go` → `pronto para revisão formal` → `aprovado para sessão externa sintética`.

Regras:

- qualquer dimensão ausente, parcial ou bloqueada mantém `No-Go`;
- evidências completas permitem apenas solicitar revisão formal;
- aprovação exige decisão `approved` e referência verificável de ata/parecer;
- decisão rejeitada produz estado `rejected`;
- modo real ou alegação de avanço de gate bloqueia todo o fluxo;
- `canUseRealData` é sempre `false`.

## Estado atual

| Dimensão | Estado | Evidência principal |
|---|---|---|
| Runtime | Pronta | `docs/G0_EXECUTION_RECORD.md` |
| Sessão guiada | Pronta | `docs/DESIGN_PARTNER_SESSION_COCKPIT_G1.md` |
| Narrativa externa | Parcial — draft ensaiável | `docs/G1_EXTERNAL_AUDIENCE_PACK.md` |
| Release oficial | Bloqueado | `docs/GITHUB_LOVABLE_SYNC_HANDOFF.md` |
| Accountables | Bloqueados | `docs/G1_FORMAL_ACCEPTANCE_LEDGER.md` |
| Risco residual | Bloqueado | `docs/G1_RESIDUAL_RISK_REGISTER.md` |

Prontidão atual: **2/6**. Próxima decisão: nomear facilitador e accountable, revisar o roteiro com Jurídico/SST e registrar decisão formal. Isso não elimina os bloqueios posteriores de release, accountables e risco.

O resumo permanece em Governança e abre o workspace protegido `/app/governance/external-readiness`, onde pacote e ensaio são apresentados sem alterar esta decisão. A separação e seus critérios estão em `docs/G1_EXTERNAL_READINESS_WORKSPACE.md`.

O quadro `docs/G1_EXTERNAL_READINESS_CLOSURE_BOARD.md` transforma as quatro dimensões não prontas em critical path verificável. Ele não altera 2/6 nem concede aprovação: hoje são 0/4 trilhas fechadas e accountability é a próxima ação humana.

## Critérios de aceite

- mecanismo puro separado da configuração G1;
- composição usa os resumos especializados existentes;
- nenhuma dimensão obrigatória pode faltar silenciosamente;
- aprovação sem ata/parecer falha fechada;
- interface apresenta status, evidências, próximo bloqueio e escopo permitido;
- detalhes de preparação são carregados sob demanda em workspace protegido;
- estados de No-Go, revisão, aprovação e rejeição cobertos por testes;
- typecheck, lint, testes e build verdes.

## Rollback

Remover o avaliador `externalSessionDecision`, sua configuração/compositor, o card do decision room e esta documentação. Não há migration, persistência, integração remota ou dado a reverter.
