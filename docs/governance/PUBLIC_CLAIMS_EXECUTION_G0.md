# Execução G0 — confiança pública e claims

## Estado

- Data: 12/07/2026
- Branch: `codex/onda-0-baseline-fidelity-runtime`
- Escopo: superfícies públicas, metadados, fontes regulatórias e guardrail automatizado
- Gate: G0/G1 local e sintético; nenhum avanço de gate
- Dados reais: No-Go

## Problema confirmado

A comunicação pública estava mais assertiva do que a governança interna: usava “Ciência de Oxford”, volume científico como prova do produto, multa fixa, marco regulatório desatualizado, linguagem de diagnóstico e metadados de plataforma consolidada. O registro interno, por outro lado, mantém fonte, licença, hash e revisão de claims pendentes.

## Decisão

Adotar uma política versionada de claims públicos e fazer a copy refletir o estágio demonstrativo:

- atribuir corretamente o Work Wellbeing Playbook à World Wellbeing Movement, com colaboração acadêmica do Wellbeing Research Centre;
- declarar que a referência não implica validação, afiliação ou chancela do produto;
- remover volume científico como selo local, ROI “comprovado” e associação institucional promocional;
- substituir multa fixa e urgência coercitiva por escopo preventivo e revisão técnica;
- usar 26/05/2026 como marco vigente do capítulo 1.5 da NR-1;
- substituir CTAs e promessas de diagnóstico por avaliação de prontidão ou demonstração sintética;
- manter AEP, AET, responsável competente e análise das condições de trabalho como limites explícitos.

## Alternativas consideradas

| Alternativa | Decisão | Motivo |
|---|---|---|
| Corrigir somente quatro frases | rejeitada | deixaria metadados e superfícies comerciais contraditórios |
| Política versionada + correção das superfícies críticas | escolhida | rastreável, reversível e coberta por teste |
| CMS completo de claims | adiada | complexidade desproporcional ao G0 |
| Ocultar toda referência externa | rejeitada | reduziria transparência e rastreabilidade |
| Integração automática com fontes | adiada | exige operação, cache, revisão e observabilidade |
| Abstração genérica de compliance editorial | limitada | a política atual é suficiente; generalização maior depende de novos casos |

## Fontes primárias consultadas

- MTE — página oficial da NR-1: https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1
- MTE — Manual GRO/PGR 2026: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/manuais-e-publicacoes/2026/manual_gro_pgr_da_nr_1.pdf
- MTE — Guia de fatores de riscos psicossociais: https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/guia-nr-01-revisado.pdf
- Wellbeing Research Centre — Work Wellbeing Playbook: https://wellbeing.hmc.ox.ac.uk/publications/work-wellbeing-playbook/

Fontes regulatórias prevalecem sobre esta síntese. Os guias têm caráter orientativo e não substituem o texto normativo.

## Evidência automatizada

O teste `src/test/publicClaimsGuardrail.test.ts` passou a cobrir metadados, política versionada, Home, About, NR1/COPSOQ, Sales e componentes comerciais. O gate bloqueia:

- chancela ou validação institucional indevida;
- “Ciência de Oxford” e equivalentes;
- volume “3.000+” usado como claim local;
- multa monetária genérica;
- marco “a partir de 2025”;
- diagnóstico como ação do produto;
- posicionamento de plataforma consolidada antes do gate;
- claims preexistentes de conformidade, anonimato absoluto, causalidade e operação real.

## Verificações

| Comando | Resultado |
|---|---|
| testes de claims e fontes regulatórias | PASS — 10/10 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 45/45 arquivos; 292/292 testes |
| `npm run build` | PASS |

## Riscos residuais

- A revisão jurídica, metodológica e de marca continua externa ao código.
- A licença e o hash do acervo local do Playbook permanecem pendentes.
- O guardrail textual reduz regressões conhecidas, mas não substitui revisão humana de contexto.
- Superfícies autenticadas e PDFs técnicos exigem auditoria própria em fatia futura.
- Browser E2E e revisão visual em dispositivos reais não foram executados nesta fatia.

## Rollback

Reverter o commit local da Onda 0 restaura a copy anterior. Esse rollback não é recomendado enquanto os claims anteriores permanecerem sem trilha jurídica, metodológica ou de afiliação.

## Próximo passo

Executar browser smoke E2E + axe para as jornadas públicas e registrar evidência visual/mobile, sem alterar o gate de dados.
