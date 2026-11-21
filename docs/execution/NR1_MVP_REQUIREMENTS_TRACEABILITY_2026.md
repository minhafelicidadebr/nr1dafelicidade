# Matriz de rastreabilidade — MVP de execução NR-1

- Status: `draft`
- Data: 07/08/2026
- Fonte principal: `Guia Oficial MTE 2026 Comentado.pdf`
- Uso: contrato de Onda 0; não é parecer jurídico nem aceite de gate.

## Como ler

Cada requisito precisa apontar para: fonte, regra de produto, mecanismo, evidência de teste/uso e responsável pelo aceite. A coluna “estado atual” separa o que já está implementado do que está apenas documentado, mockado, hardcoded, aspiracional, não confirmado ou bloqueado.

Estados usados:

- `implementado-local`: existe e foi exercitado em ambiente sintético/local;
- `documentado`: há regra ou template, mas não há enforcement completo;
- `draft-bloqueado`: mecanismo existe, porém método/fonte/aceite externo impedem uso;
- `parcial`: existe uma parte da capacidade, normalmente na interface;
- `não confirmado`: depende de validação profissional, jurídica ou ambiental;
- `fora-MVP`: não entra no primeiro corte.

## Requisitos normativos e operacionais

| ID | Fonte | Requisito verificável | Estado atual | Onda | Evidência de aceite | Dono do aceite |
|---|---|---|---|---|---|---|
| NR1-001 | pp. 13–15 | O fluxo deve sustentar PDCA: planejar, executar, verificar e agir. | parcial | 1–3 | E2E com eficácia parcial gerando correção e nova revisão. | Produto + SST |
| NR1-002 | pp. 22–24 | Trabalhadores e CIPA participam das fases relevantes. | implementado-local em AEP/AET; transversal pendente | 4 | Registro de consulta por etapa, sem identidade de respondente. | SST + CIPA |
| NR1-003 | pp. 22–24 | Riscos consolidados e medidas são comunicados ao público adequado. | documentado | 4–5 | Comunicação versionada, autorizada e reproduzível. | Produto + SST |
| NR1-004 | pp. 30–36 | Escopo, unidades, processos, responsabilidades e recursos são explícitos. | parcial | 0–1 | ADR, campos obrigatórios e bloqueio de origem/escopo ausente. | Produto + SST |
| NR1-005 | pp. 30–36 | Critérios de severidade, probabilidade, nível e decisão são versionados. | draft-bloqueado no Criteria Engine | 5; scoring fora do caminho crítico | Snapshot de critérios com fonte, versão e revisão independente. | SST + Metodologia |
| NR1-006 | pp. 74–81 | Controles são introduzidos, melhorados ou mantidos conforme prioridade. | catálogo + texto; parcial | 1–2 | Campo de tipo, prioridade, escopo e controle implantado distinto do catálogo. | SST + Produto |
| NR1-007 | pp. 74–81 | Implantação, manutenção e ajustes deixam registros. | parcial; notas textuais | 2 | `evidence_record`, eventos append-only e manutenção versionada. | Engenharia + SST |
| NR1-008 | pp. 74–81 | Monitoramento é proativo e reativo, com julgamento de eficácia. | documentado/rascunho | 3 | Medição, método, meta, revisão e resultado verificáveis. | SST + Produto |
| NR1-009 | pp. 74–81, 96–97 | Plano tem prazo, responsável, método de monitoramento e medida de resultado. | parcial | 1 | Não aprova sem campos completos; pgTAP e E2E. | Produto + Engenharia |
| NR1-010 | pp. 80–81 | Medida ineficaz exige correção e melhoria contínua. | inexistente como workflow server-side | 3 | Resultado `ineffective/partial` cria bloqueio e ação filha. | SST + Engenharia |
| NR1-011 | pp. 87–89 | Documentos têm responsável, data, versão, competência e acesso adequado. | parcial; documentos preliminares versionados | 5 | Snapshot com autor, data, hash, revisão e exportação por papel. | SST + Produto |
| NR1-012 | pp. 90, 94 | Critérios e inventário são ligados ao contexto, avaliação e classificação. | Criteria Engine draft; AEP/AET draft | 5 | Linhagem de origem até documento; nenhuma referência órfã. | SST + Metodologia |
| NR1-013 | pp. 94–97 | Inventário cobre processos, ambientes, atividades, perigos, fontes, grupos e controles. | parcial/draft | 5; cobertura integral fora do primeiro wedge | Fixture sintética psicossocial e matriz de cobertura. | SST |
| NR1-014 | p. 94 | Histórico do inventário deve suportar o período mínimo aplicável, indicado no guia como 20 anos. | política de retenção não aprovada | 5 condicional | Decisão de base, prazo, hold, descarte e restore aprovados. | DPO + Jurídico + SST |
| NR1-015 | pp. 109–116 | Risco psicossocial é tratado como risco do trabalho e da organização, não como traço individual. | guardrail documentado; execução parcial | 1–5 | Ação exige fonte/condição organizacional e proíbe diagnóstico individual. | SST/Ergonomia |
| NR1-016 | pp. 109–121 | Questionário não substitui AEP, AET, observação, participação ou avaliação técnica. | guardrail implementado em fluxos | 0–5 | Teste de bloqueio e texto de interface sem equivalência indevida. | SST + Produto |
| NR1-017 | pp. 109–121 | AEP e trabalho real fundamentam a avaliação; AET depende de indicação técnica. | AEP/AET draft implementados | 1/5; validação externa pendente | Ação psicossocial não nasce de score isolado; AET não é inferida automaticamente. | SST/Ergonomia |
| NR1-018 | pp. 120–121 | Efetividade de controles participa da avaliação da probabilidade, com justificativa. | mecanismo draft; cálculo não aprovado | 3; scoring fora do MVP | Revisão registra evidência de efetividade sem reduzir risco automaticamente. | SST + Metodologia |
| NR1-019 | todo o guia e constituição | Respostas individuais, convites e identidade permanecem protegidos; saídas coletivas respeitam `k ≥ 5`. | implementado-local | transversal | pgTAP cross-tenant, supressão abaixo de k e teste de não correlação. | Privacidade + Segurança |
| NR1-020 | constituição/G0 | Relatórios são preliminares até revisão competente; não há promessa de conformidade. | implementado em templates/documentos | transversal | Scanner de claims, marcador preliminar e revisão independente. | Produto + SST + Jurídico |
| NR1-021 | pp. 22–24, 80–81 | O fluxo deve ser utilizável por trabalhadores com baixa familiaridade digital e receio de retaliação. | acessibilidade parcial | 4/6 | Teste manual mobile/teclado, linguagem clara e separação de papéis. | UX + CIPA |

## Lacunas bloqueadoras antes do MVP Técnico Sintético

1. substituir regex de `description`/`notes` por contrato estruturado;
2. impor a máquina de estados no servidor;
3. separar controle declarado, controle implantado, evidência e eficácia;
4. criar correção/reavaliação como fluxo obrigatório;
5. registrar participação e comunicação de forma transversal;
6. fechar a linhagem documental sem afirmar validade normativa;
7. testar RLS, cross-tenant, `k`, concorrência, imutabilidade e rollback;
8. registrar pendências de SST, metodologia, privacidade e retenção.

## Decisões explicitamente fora da matriz de implementação imediata

- não aprova instrumento, licença, subescala, cutoff ou fórmula;
- não autoriza importação de respostas ou dados reais;
- não substitui AEP/AET, observação do trabalho real ou análise técnica;
- não define prazo legal de retenção por conta própria;
- não transforma documento gerado em laudo, PGR final ou certificado;
- não permite IA escolher ação, eficácia, correção ou assinatura.

## Critério de completude da matriz

A Onda 0 somente pode ser encerrada quando cada requisito obrigatório tiver: responsável, estado atual honesto, onda alvo, caso de aceite e dependência externa explícita. Um item sem evidência permanece `não confirmado` ou `draft-bloqueado`.
