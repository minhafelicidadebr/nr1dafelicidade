# Intake canonico do instrumento - G1

Data: 30/06/2026

## Objetivo

Abrir o Sprint 1 sem inventar fonte, subescala ou scoring. A melhoria cria um contrato de recebimento do pacote canonico do instrumento: fonte primaria, licenca, itens, escala, 26 subescalas, scoring original, fixtures, limitacoes e pacote de revisao independente.

## Decisao Fable 5

Opcoes avaliadas:

- Modelar as 26 subescalas a partir do snapshot legado: rejeitado por falta de fonte, licenca e fixtures.
- Buscar fonte externa e codificar imediatamente: adiado ate haver permissao, hash e revisao metodologica.
- Criar intake canonico verificavel: escolhido para transformar pendencia externa em criterio operacional testado.
- Persistir intake no banco agora: adiado por exigir schema, RLS, assinatura e accountables.
- Comprar/integrar uma ferramenta de gestao documental: fora do escopo G1 local.

## Implementacao

- `src/lib/instruments/canonicalIntake.ts`
  - avalia artefatos obrigatorios do pacote canonico;
  - exige owner, hash SHA-256 e submissao antes de revisao;
  - exige aprovacao de todos os artefatos antes de promover para o gate metodologico;
  - falha fechado se runtime, dados reais ou gate advance forem acionados.
- `src/data/g1CanonicalInstrumentIntake.ts`
  - define a politica `canonical-instrument-intake-g1-2026-06-30`;
  - registra o estado atual: pacote canonico ainda ausente, com limites documentados apenas como item submetido.
- `src/lib/instruments/canonicalIntake.test.ts`
  - comprova bloqueio atual;
  - abre revisao somente com artefatos submetidos, owner e hash;
  - promove ao gate metodologico somente com todos os artefatos aprovados;
  - bloqueia runtime/dados reais/gate inseguros.
- `src/pages/NR1CopsoqPage.tsx`
  - exibe "Intake canonico Sprint 1" antes da prontidao metodologica.

## Decisao de jurisdicao e alvo (04/07/2026)

Registrada pelo solicitante:

- Jurisdicao oficial: **Brasil**. Objetivo: atender NR-1/NR-17 (mapeamento de riscos psicossociais e insercao no PGR/GRO).
- Familia-alvo: **COPSOQ-BR** (COPSOQ II e III adaptados ao Brasil).
- Modelo de accountability: consultoria (solicitante + equipe) como prestadora do servico tecnico; empresa contratante nomeia seu proprio responsavel tecnico. Revisores independentes (psicometrista + SST), externos a equipe, a serem nomeados.

Papel do manual anexado (COPSOQ II, versao portuguesa pt-PT, Silva et al., 2011, FCT/Univ. de Aveiro):

- Entra apenas como **referencia estrutural** (3 formatos: curta 41 itens/26 subescalas, media 76/29, longa 119/35; scoring por media fator-a-fator; tercis 2,33 e 3,66; itens invertidos 42/45 na media).
- **Nao** e a fonte canonica brasileira e **nao** pode ser marcado como "oficial" para o alvo BR: linguagem, itens e normas sao pt-PT. Normas portuguesas (N=4162) nao valem para populacao BR.

Alegacoes ainda **nao verificadas** (nao gravadas como aprovadas):

- "COPSOQ II/III validados e adaptados ao Brasil": requer documento-fonte BR (itens pt-BR, mapa de subescalas, normas brasileiras, licenca, fixtures) e revisao psicometrica independente.
- "Atende as exigencias da NR-1/NR-17": decisao de responsavel tecnico SST + juridico; a NR-1 nao obriga instrumento especifico.

## Estado atual

Bloqueado:

- manual/fonte primaria canonica;
- licenca e permissao de uso;
- banco canonico de itens;
- escala de resposta e ausentes;
- mapa de 26 subescalas;
- scoring original;
- fixtures psicometricas independentes;
- pacote de revisao independente.

Preservado:

- runtime do instrumento permanece bloqueado;
- nenhuma campanha real pode abrir;
- nenhuma subescala ou formula e inventada;
- nenhum dado real e habilitado.

## Limites

- Nao valida COPSOQ, SRQ-20 ou outro instrumento.
- Nao cria item, subescala, cutoff, scoring ou fixture sem fonte.
- Nao substitui revisao psicometrica, SST, juridica, DPO ou seguranca.
- Nao avanca G1.

## Rollback

Remover `src/lib/instruments/canonicalIntake.ts`, `src/data/g1CanonicalInstrumentIntake.ts`, `src/lib/instruments/canonicalIntake.test.ts`, este documento e o card `CanonicalInstrumentIntakeCard` em `src/pages/NR1CopsoqPage.tsx`.
