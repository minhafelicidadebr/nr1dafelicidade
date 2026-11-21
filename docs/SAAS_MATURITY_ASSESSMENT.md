# Avaliacao de maturidade SaaS - Fable 5

Data: 16/07/2026

## Objetivo

Converter a avaliacao de maturidade do produto em um contrato auditavel: fundacao, MVP sintetico, piloto controlado, SaaS real e escala. O objetivo e impedir overclaim de "SaaS pronto" enquanto o produto ainda esta em G1 nao aprovado e dados reais seguem No-Go.

## Decisao Fable 5

Opcoes avaliadas:

- Manter maturidade apenas como opiniao textual: insuficiente para governanca.
- Criar um score comercial otimista: rejeitado por risco de overclaim.
- Criar avaliador puro + politica versionada + card na Governanca: escolhido.
- Persistir maturidade no banco: adiado, pois exigiria schema, RLS e workflow formal.
- Comprar ferramenta GRC: fora do escopo atual.

## Implementacao

- `src/lib/governance/saasMaturity.ts`
  - avalia estagios `foundation`, `synthetic_mvp`, `controlled_pilot`, `real_saas` e `scale`;
  - calcula score ponderado, prontidao para MVP sintetico e prontidao para SaaS real;
  - falha fechado se dados reais forem habilitados antes de G3.
- `src/data/saasMaturityAssessment.ts`
  - define a politica `saas-maturity-fable5-2026-07-16.2`;
  - registra evidencias atuais e bloqueios para cada camada.
  - deriva CI oficial e browser E2E do pacote de comprovacao do release, evitando flags contraditorias.
- `src/lib/governance/saasMaturity.test.ts`
  - comprova que o estado atual fica em fundacao governada;
  - comprova promocao para MVP sintetico somente com G1 sintetico completo;
  - bloqueia dados reais antes de G3;
  - comprova caminho positivo somente com todos os gates prontos.
- `src/pages/app/GovernancePage.tsx`
  - exibe "Maturidade SaaS Fable 5" como card de governanca.

## Estado atual

Classificacao honesta:

- Gate operacional aprovado: G0; G1 permanece apenas como alvo em preparação.
- Fundacao governada: forte.
- MVP sintetico premium: parcialmente pronto, bloqueado por aceite formal e pacote metodologico.
- Piloto controlado: CI oficial, browser E2E e baseline Lovable atestado pontualmente; continua bloqueado por branch protection não comprovada, revisões independentes e gates anteriores. O atestado não representa o `HEAD` atual.
- SaaS real: bloqueado por G3, LGPD/juridico, instrumento aprovado, incidente/DR e operacao.
- Escala/unicornio: a fundação Mercado Pago existe somente em sandbox; billing live, onboarding self-service, integrações enterprise, observabilidade e IA supervisionada aprovada continuam bloqueados.

## Limites

- Nao aprova G1.
- Nao declara SaaS real pronto.
- Nao libera dados reais.
- Nao substitui revisao de SST, ergonomia, psicometria, DPO, juridico, seguranca ou operacao.

## Rollback

Remover `src/lib/governance/saasMaturity.ts`, `src/data/saasMaturityAssessment.ts`, `src/lib/governance/saasMaturity.test.ts` e o card `SaasMaturityCard` em `src/pages/app/GovernancePage.tsx`.
