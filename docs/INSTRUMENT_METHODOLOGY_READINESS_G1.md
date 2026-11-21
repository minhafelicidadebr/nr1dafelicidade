# Prontidao metodologica do instrumento - G1

Data: 30/06/2026

## Objetivo

Organizar o bloqueio metodologico do instrumento recebido em um contrato verificavel: fonte primaria, licenca, idioma/jurisdicao, itens, subescalas, scoring, fixtures, limitacoes, revisao independente e runtime. A melhoria nao aprova o instrumento, nao valida COPSOQ/SRQ-20, nao cria scoring e nao libera campanha.

## Decisao Fable 5

Opcoes avaliadas:

- Aprovar provisoriamente o instrumento recebido: rejeitado por ausencia de fonte, licenca, scoring e fixtures.
- Buscar e incorporar uma fonte externa agora: adiado, pois exige fonte primaria, licenca, revisao metodologica e decisao formal.
- Manter somente o bloqueio no texto do Instrument Registry: insuficiente para revisao operacional.
- Criar avaliador puro + politica versionada + card no modulo de instrumento: escolhido.
- Persistir workflow de revisao no banco: adiado por exigir schema, RLS, accountables e assinaturas.

## Implementacao

- `src/lib/instruments/methodologyReadiness.ts`
  - avalia criterios metodologicos gate-blocking;
  - separa missing, draft, review e approved;
  - falha fechado se runtime for habilitado antes da aprovacao completa.
- `src/data/instrumentMethodologyReadiness.ts`
  - define a politica `instrument-methodology-g1-2026-06-30`;
  - registra o estado honesto do instrumento `exploratory_psychosocial_screening@0.1.0-draft`.
- `src/lib/instruments/methodologyReadiness.test.ts`
  - comprova bloqueio atual;
  - comprova caminho para revisao somente sem itens missing/draft;
  - comprova caminho de runtime somente com todos os criterios aprovados;
  - bloqueia runtime antecipado.
- `src/pages/NR1CopsoqPage.tsx`
  - exibe "Prontidao metodologica G1" no modulo publico do instrumento.

## Estado atual

Bloqueado:

- fonte primaria canonica ausente;
- licenca e permissao de uso desconhecidas;
- idioma, populacao e jurisdicao sem aprovacao;
- itens canonicos, polaridade e escala sem pacote aprovado;
- 26 subescalas exigidas para G1 nao fornecidas;
- scoring original, tratamento de ausentes e transformacoes sem especificacao aprovada;
- scoring server-side nao implementado para este instrumento;
- fixtures psicometricas independentes ausentes;
- limites e usos proibidos ainda sem aceite disciplinar formal;
- revisao metodologica independente ausente.

Preservado:

- `runtime_ready=false`;
- nenhuma versao elegivel para campanha;
- nenhuma alegacao de instrumento validado;
- nenhuma liberacao de dados reais.

## Limites

- Nao valida COPSOQ, SRQ-20 ou qualquer instrumento psicometrico.
- Nao substitui fonte primaria, licenca, parecer metodologico, SST, DPO, juridico ou seguranca.
- Nao cria itens, subescalas, scoring ou fixtures.
- Nao avanca G1.

## Rollback

Remover `src/lib/instruments/methodologyReadiness.ts`, `src/data/instrumentMethodologyReadiness.ts`, `src/lib/instruments/methodologyReadiness.test.ts` e o card `InstrumentMethodologyCard` em `src/pages/NR1CopsoqPage.tsx`.
