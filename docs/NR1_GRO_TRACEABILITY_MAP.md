# Mapa de rastreabilidade NR-1 (GRO) -> invariantes e mecanismos

Data: 04/07/2026

## Objetivo e limites

Mapear os requisitos do capitulo 1.5 da NR-1 (GRO) e da NR-17, conforme o
Guia Oficial do MTE 2026, contra os invariantes (SKILL_MESTRA §7) e mecanismos
do projeto. Serve para orientar o backlog do Criteria Engine e da geracao de
PGR.

**Este documento NAO e atestado de conformidade.** Consonancia de arquitetura
nao equivale a conformidade legal, que e julgada por fiscalizacao contra o GRO
documentado de um estabelecimento especifico. Prevalece o texto legal (DOU).
Fontes primarias registradas em `src/data/regulatorySources.ts`.

## Legenda de status

- **Coberto (doutrina):** invariante/mecanismo do projeto ja endereca o requisito no nivel de principio/arquitetura.
- **Parcial:** endereçado em parte; falta implementacao ou verificacao.
- **A codificar:** requisito claro ainda nao traduzido em mecanismo/config verificavel.
- **Externo:** depende de decisao humana/organizacional (nao e codigo).

## Mapa

| # | Requisito NR-1/NR-17 (subitem) | Exigencia | Onde no projeto | Status |
|---|---|---|---|---|
| 1 | GRO como processo continuo PDCA (1.5.1; Anexo I) | identificar -> avaliar -> controlar -> acompanhar -> revisar | Tese/cadeia da SKILL_MESTRA §0; Criteria Engine | Coberto (doutrina) |
| 2 | GRO contempla todos os riscos, incl. psicossociais (1.5.3.1.4) | risco psicossocial no mesmo GRO/PGR | Modulo COPSOQ + Criteria Engine | Parcial |
| 3 | Responsabilidade sempre interna; consultor assessora (Passo 4) | org nomeia responsavel interno pelo GRO | Modelo de accountability (intake) + `g1FormalAcceptance` | Externo |
| 4 | Participacao/consulta/comunicacao aos trabalhadores e CIPA (1.5.3.3; 6.x) | mecanismos rastreaveis; via de mao dupla | Invariante 10 | Parcial |
| 5 | Questionario nao e avaliacao; psicossocial considera exigencias da atividade + eficacia (1.5.4.4.5.3) | escore nao basta; exige trabalho real | Invariante 6; §6; fluxo AEP/AET | Coberto (doutrina) |
| 6 | Severidade pelo pior cenario (1.5.4.4.4 / 1.5.4.4.4.1) | consequencia de maior magnitude | `criteriaEngine` (max de dimensoes + `additionalConsequences`) | Coberto (mecanismo, draft) |
| 7 | Probabilidade: nao atender requisito de NR eleva a gradacao maxima (1.5.4.4.5.1) | inclui falhas de NR-17 | `criteriaEngine` (`regulatory` -> prob. maxima, bloqueia reducao) | Coberto (mecanismo, draft) |
| 8 | Criterios documentados: severidade, probabilidade, niveis, classificacao, decisao (1.5.4.4.2.2) | documento de criterios versionado | `criteriaEngine` + `criteriaPolicy` versionada | Parcial |
| 9 | Gradacoes integradas entre todos os tipos de risco (1.5.4.4.2.1) | psicossocial na mesma matriz dos demais | `criteriaEngine` (matriz unica ate 25 + `riskType`) | Coberto (mecanismo) |
| 10 | Hierarquia de prevencao: evitar>eliminar>substituir>coletiva>administrativa>EPI (1.5.5.1.2) | EPI como ultima medida | `criteriaEngine` (`hierarchyTier` + `hierarchyReductionCap`) | Coberto (mecanismo, draft) |
| 11 | Controle so reduz risco apos evidencia de implementacao + eficacia mantida (1.5.4.4.6 "a"; 11.4.4) | risco residual pos-medida | Invariante 7; `controlEvidence`; `criteriaEngine` | Coberto (doutrina) |
| 12 | AEP alinhada ao GRO; AET nas situacoes do 17.3.2 (NR-17) | dois metodos complementares | Docs AEP/AET (`AEP_WORK_CONTEXT`, `AET_FLOW`) | Parcial |
| 13 | Documentacao do PGR: Inventario, Plano de Acao, Criterios; assinatura e data (13.x) | documentos minimos, disponiveis | Geracao de documentos (bloqueada em dados reais) | Parcial |
| 14 | Revisao periodica (2/3 anos) e imediata (6 situacoes, 1.5.4.4.6) | reavaliar por gatilhos | `reviewTriggers` + `reviewTriggerPolicy` | Coberto (mecanismo, draft) |
| 15 | Acao -> KPI -> evidencia -> revisao das medidas (1.5.5.3.2) | acompanhamento planejado do desempenho | `actionGovernance` + `controlEvidence` | Coberto (doutrina) |
| 16 | GRO nao caracteriza insalubridade/periculosidade (1.5.2) | escopo separado de NR-15/16 | Guardrail de claims | A verificar |
| 17 | Privacidade e protecao de dados dos respondentes (LGPD; anonimato/confidencialidade) | respostas individuais protegidas | Invariantes 1-3, 9; k>=5; Privacy Vault | Coberto (doutrina) |
| 18 | Cobertura dos fatores psicossociais do MTE (Quadro 2 do guia) | sobrecarga, assedio, suporte, clareza de papel, recompensas, controle, eventos, demanda cognitiva | Dimensoes COPSOQ (a mapear formalmente ao Quadro 2) | Parcial |

## Lacunas prioritarias - status (04/07/2026)

Implementadas como mecanismo puro + testes (config em `status:"draft"`, ainda
sem aprovacao regulatoria/metodologica; `evaluateContextualRisk` recusa config
nao aprovada):

1. [FEITO] Severidade sempre pelo pior cenario - `criteriaEngine` (max + `additionalConsequences`).
2. [FEITO] "NR nao atendida -> probabilidade maxima", inclusive NR-17 - `criteriaEngine` (`regulatory`).
3. [FEITO] Matriz unica integrando psicossocial - `criteriaEngine` (`riskType`, matriz ate 25).
4. [FEITO] Hierarquia de prevencao com EPI como ultima medida - `criteriaEngine` (`hierarchyTier`/`hierarchyReductionCap`).
5. [FEITO] Gatilhos de revisao imediata (6 hipoteses) e periodica (2/3 anos) - `reviewTriggers`.
6. [BLOQUEADO] Crosswalk formal Quadro 2 (MTE) <-> dimensoes COPSOQ-BR (item 18), pendente da fonte canonica BR.

Cobertura de testes: `src/lib/risk/criteriaEngine.test.ts` e
`src/lib/risk/reviewTriggers.test.ts`. Suite completa verde.

Pendente para sair de "draft": aprovacao do responsavel tecnico SST + revisao
metodologica independente dos parametros (passos de reducao, tetos de hierarquia,
prazos). Nenhum parametro numerico aqui e imposto pela NR-1 alem de: pior caso,
NR nao atendida -> gradacao maxima, EPI por ultimo, prazos 24/36 meses.

## Dependencias externas (nao sao codigo)

- Instrumento canonico COPSOQ-BR (fonte, licenca, itens, normas BR, fixtures) - ver `docs/CANONICAL_INSTRUMENT_INTAKE_G1.md`.
- Nomeacao do responsavel tecnico interno da empresa contratante e dos revisores independentes (psicometrista + SST).
- Parecer de responsavel tecnico SST + juridico sobre aderencia NR-1/NR-17.

## Observacao de honestidade

Os itens marcados "Coberto (doutrina)" significam compatibilidade de principio/
arquitetura, nao implementacao de produto pronta nem conformidade atestada.
Nada neste mapa habilita runtime, dados reais ou avanco de gate.
