# Registro de riscos residuais G1

Data: 30/06/2026

## Objetivo

Transformar os bloqueios tecnicos, formais e comerciais em um registro auditavel de risco residual. A fatia mostra severidade, dono, evidencia, mitigacao e proximo passo sem aprovar G1, sem habilitar dados reais e sem prometer SaaS real.

## Decisao Fable 5

Opcoes avaliadas:

- Manter riscos espalhados nos documentos: rejeitado por dificultar revisao executiva.
- Criar registro persistido no banco: adiado por exigir schema, RLS, assinatura e accountables.
- Criar avaliador puro + politica versionada + card de Governanca: escolhido por ser verificavel, reversivel e alinhado ao estado G1 local.
- Tratar riscos como checklist simples: rejeitado por perder severidade, probabilidade e mitigacao.
- Integrar ferramenta GRC externa: fora do escopo desta fatia.

## Implementacao

- `src/lib/governance/residualRiskRegister.ts`
  - calcula score residual por severidade e probabilidade;
  - bloqueia revisao se houver risco critico aberto, dono ausente, evidencia ausente, mitigacao ausente, dados reais ou gate advance;
  - expõe proximo risco prioritario por score.
- `src/data/g1ResidualRiskRegister.ts`
  - define a politica `g1-residual-risk-register-2026-06-30`;
  - registra riscos atuais de privacidade, metodologia, regulatorio, release, operacao, comercial e seguranca.
- `src/lib/governance/residualRiskRegister.test.ts`
  - comprova que G1 permanece bloqueado no snapshot atual;
  - libera revisao somente com riscos bloqueantes mitigados/controlados;
  - falha fechado se dados reais ou gate advance forem acionados.
- `src/pages/app/GovernancePage.tsx`
  - exibe "Riscos residuais G1" como card de Governanca.

## Estado atual

Riscos bloqueantes principais:

- fonte, licenca e instrumento;
- revisao independente do Privacy Vault;
- accountables e aceite formal G1;
- GitHub/Lovable oficiais;
- validacao trabalhador/CIPA;
- incidente e recuperacao formal.

Controles ja registrados:

- dados reais permanecem No-Go;
- claims publicos protegidos por teste estatico;
- walkthrough privado sintetico separado de demo publica externa.

## Limites

- Nao aprova G1.
- Nao aceita risco em nome de responsaveis formais.
- Nao substitui parecer DPO, juridico, SST, ergonomia, psicometria ou seguranca.
- Nao libera dados reais, trabalhadores reais ou campanha real.

## Rollback

Remover `src/lib/governance/residualRiskRegister.ts`, `src/data/g1ResidualRiskRegister.ts`, `src/lib/governance/residualRiskRegister.test.ts`, este documento e o card `ResidualRiskRegisterCard` em `src/pages/app/GovernancePage.tsx`.
