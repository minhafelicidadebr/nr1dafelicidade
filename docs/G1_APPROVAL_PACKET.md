# Pacote de decisão e aceite — G1

## Estado

- gate solicitado: `G1 — campanha sintética segura`;
- decisão vigente: **No-Go**;
- dados permitidos: exclusivamente sintéticos e locais;
- dados reais, piloto com trabalhadores e serviços remotos: proibidos;
- este documento organiza a revisão, mas não constitui aprovação, laudo ou parecer.

## Evidência técnica disponível

| Área | Evidência | Estado |
|---|---|---|
| Runtime fail-closed | `docs/G0_EXECUTION_RECORD.md` | Implementado e testado localmente |
| Banco, lint e pgTAP | `docs/DATABASE_SECURITY_EXECUTION_G0.md` | 206/206 localmente |
| Privacy Vault | `docs/PRIVACY_VAULT_G1.md` | Implementado; revisão independente pendente |
| Instrument Registry | `docs/INSTRUMENT_REGISTRY_G1.md` | Estrutura pronta; pacote metodológico pendente |
| Prontidão metodológica do instrumento | `docs/INSTRUMENT_METHODOLOGY_READINESS_G1.md` | Gate operacional criado; fonte, licença, subescalas, scoring e fixtures pendentes |
| Governança de dados | `docs/DATA_GOVERNANCE_G1.md` | Draft técnico; decisões legais pendentes |
| AEP | `docs/AEP_WORK_CONTEXT_G2.md` | Draft técnico; validação SST/Ergonomia pendente |
| AET | `docs/AET_FLOW_G2.md` | Draft técnico; validação SST/Ergonomia pendente |
| Criteria Engine | `docs/CRITERIA_ENGINE_G2.md` | Draft bloqueado; fórmula não aprovada |
| CI de aplicação | `docs/G1_RELEASE_PROOF_PACKET.md` | 415 testes, typecheck, lint, build e orçamento de bundle verdes localmente em 15/07/2026; matriz browser verde com 52 cenários e 3 skips intencionais; checks `verify`, `database-security` e `browser-quality` verdes no Draft PR |
| Primeira oferta assistida | `docs/DESIGN_PARTNER_OFFER_G1.md` | Brief disponível; pacote sintético 7/10 pronto para revisão Comercial/Jurídica; venda e piloto bloqueados |
| Autorização da oferta assistida | `docs/PAID_ADVISORY_AUTHORIZATION_G1.md` | 4/4 cartas e 4/4 templates prontos; 0/4 papéis e 0/4 decisões aprovados; venda bloqueada |
| Sala de decisão da primeira venda | `docs/PAID_ADVISORY_AUTHORIZATION_MEETING_G1.md` | Pauta 7/7, pré-leituras 5/5 e saídas 4/4; quórum e alçadas 0/4; convocação e venda bloqueadas |
| Ensaio de lançamento da proposta | `docs/PAID_ADVISORY_LAUNCH_REHEARSAL_G1.md` | Template versionado e 6/6 situações prontas; resultado atual é recibo local No-Go; envio, assinatura, cobrança e entrega indisponíveis |
| Copiloto supervisionado | `docs/SUPERVISED_COPILOT_FABLE5_PLAN.md` | Estratégia proposta; runtime, RAG e IA remota não aprovados |
| Segurança do copiloto | `docs/AI_COPILOT_SECURITY_G1.md` | Hardening e retenção local implementados; aprovações formais pendentes |
| Ledger de aceite formal | `docs/G1_FORMAL_ACCEPTANCE_LEDGER.md` | Controle operacional criado; accountables e decisões permanecem pendentes |
| Cockpit da sessão Design Partner | `docs/DESIGN_PARTNER_SESSION_COCKPIT_G1.md` | Preflight, capacidade, handoff e descarte implementados; uso externo autônomo bloqueado |
| Decision room da sessão externa | `docs/G1_EXTERNAL_SESSION_DECISION_ROOM.md` | Composição 2/6; decisão vigente No-Go externo |
| Workspace de prontidão externa | `docs/G1_EXTERNAL_READINESS_WORKSPACE.md` | Rota protegida e lazy; reúne pacote e ensaio sem aprovar uso externo |
| Quadro de fechamento externo | `docs/G1_EXTERNAL_READINESS_CLOSURE_BOARD.md` | 0/4 trilhas prontas; accountability é a próxima ação humana verificável |
| Pacote de nomeação dos accountables | `docs/G1_ACCOUNTABLE_NOMINATION_PACK.md` | 9 cartas e agenda prontas; zero nomes; não convoca, nomeia ou aprova |
| Carta do candidato de release | `docs/G1_RELEASE_CANDIDATE_CHARTER.md` | 6/6 frentes revisáveis; repositório, SHA e autorizações de promoção pendentes |
| Sequência de revisão do candidato | `docs/G1_RELEASE_REVIEW_SEQUENCE.md` | DAG válido; 11.734 linhas anticirculares medidas; governança externa e comercial exigem subpacotes antes da revisão |
| Auditoria mecânica do escopo | `docs/G1_PR_SCOPE_AUDIT.md` | 182/182 caminhos atribuídos e 180 conteúdos agregados; zero duplicados, obsoletos, não classificados ou sensíveis |
| Pacote de comprovação do release | `docs/G1_RELEASE_PROOF_PACKET.md` | 10/11 provas verificadas; CI e deployment Lovable atestam pontualmente o baseline `4a21c1c...`, sem afirmar o `HEAD` documental atual; somente branch protection permanece bloqueada |
| Pacote de audiência externa | `docs/G1_EXTERNAL_AUDIENCE_PACK.md` | Draft completo para ensaio interno; facilitador, accountable, Jurídico/SST e decisão formal pendentes |
| Ensaio do facilitador | `docs/G1_FACILITATOR_REHEARSAL.md` | Simulador e comprovante local implementados; não nomeia, certifica ou aprova facilitador |

## Responsáveis obrigatórios

Nomes, autoridade e substitutos precisam ser registrados antes da reunião de gate.

| Papel accountable | Nome | Autoridade/registro | Substituto | Estado |
|---|---|---|---|---|
| Sponsor/direção do produto | Pendente | Pendente | Pendente | Não nomeado |
| Responsável técnico SST | Pendente | Pendente | Pendente | Não nomeado |
| Ergonomista responsável | Pendente | Pendente | Pendente | Não nomeado |
| Responsável metodológico/psicométrico | Pendente | Pendente | Pendente | Não nomeado |
| DPO/encarregado LGPD | Pendente | Pendente | Pendente | Não nomeado |
| Jurídico/regulatório | Pendente | Pendente | Pendente | Não nomeado |
| Segurança/arquitetura | Pendente | Pendente | Pendente | Não nomeado |
| Representação de trabalhadores/CIPA | Pendente | Pendente | Pendente | Não nomeado |
| Operação/incident commander | Pendente | Pendente | Pendente | Não nomeado |

## Decisões bloqueantes

### 1. Instrumento e psicometria

- [ ] identificar edição, idioma, população e jurisdição aplicáveis;
- [ ] comprovar licença e permissões de reprodução/uso;
- [ ] fornecer fonte primária canônica e hash do material aprovado;
- [ ] aprovar os 26 componentes/subescalas, itens, polaridade e dados ausentes;
- [ ] aprovar fórmula, escore original, transformações e eventuais cutoffs;
- [ ] fornecer fixtures independentes com resultados esperados;
- [ ] registrar limitações, população de validação e usos proibidos;
- [ ] confirmar que questionário não substitui AEP/AET ou julgamento técnico.

Sem todos os itens, a versão `0.1.0-draft` permanece `runtime_ready=false`.

### 2. Privacidade, LGPD e segurança

- [ ] aprovar finalidade, base legal, papéis de tratamento e transparência;
- [ ] aprovar retenção por classe, descarte, legal hold e acesso emergencial;
- [ ] revisar separação entre identidade, convite e resposta;
- [ ] revisar `k_min=5`, risco de differencing e grupos vulneráveis;
- [ ] revisar threat model `tm-g1-2026.06` de forma independente;
- [ ] aprovar runbook de incidente, comunicação e autoridade de contenção;
- [ ] registrar operadores/suboperadores, localização e transferências;
- [ ] comprovar o job `database-security` verde no repositório oficial.

### 3. SST, ergonomia e operação

- [ ] validar vocabulário, estados e critérios do protocolo AEP;
- [ ] validar gatilhos, escopo, evidências e encerramento AET;
- [ ] validar participação efetiva de trabalhadores e CIPA;
- [ ] validar que severidade e probabilidade dependem do trabalho real;
- [ ] validar que controle só reduz risco com eficácia evidenciada;
- [ ] aprovar limites de atuação da IA e revisão humana obrigatória;
- [ ] executar teste de usabilidade representativo em ambiente sintético;
- [ ] aprovar plano de treinamento, suporte e suspensão de campanha.

### 4. Engenharia e operação técnica

- [ ] auditar o histórico Git de origem e rotacionar credenciais potencialmente expostas;
- [ ] executar CI no GitHub com branch protection e revisão obrigatória;
- [x] regenerar tipos Supabase a partir de todas as migrações no banco local;
- [ ] repetir a geração e conferir o diff no commit oficialmente aprovado;
- [x] executar teste adversarial concorrente local sobre replay do mesmo token;
- [ ] definir SLOs sem converter guardrails locais em SLA;
- [x] testar backup lógico, descarte, restore e integridade em cadeia sintética;
- [ ] exercitar recuperação de incidente e disaster recovery conforme runbook aprovado;
- [ ] demonstrar a jornada sintética integral sem alteração de código;
- [x] confirmar localmente que configuração remota e `VITE_DATA_MODE=real` permanecem bloqueadas antes de G3.

### 5. Copiloto supervisionado e IA

- [ ] aprovar ADR, threat model e contrato estruturado de resposta;
- [x] autenticar, autorizar, validar e limitar todas as Edge Functions de IA ou desabilitá-las explicitamente;
- [ ] aprovar allowlist de CORS, rate limits, timeouts, limites de payload e kill switch;
- [x] substituir retenção indefinida de conversas em `localStorage` por política e descarte verificáveis;
- [ ] inventariar fontes e afirmações do catálogo Aurora, removendo claims sem versão/fonte aprovada;
- [ ] aprovar a separação entre núcleo determinístico, recuperação, verificação, voz e renderização;
- [ ] validar que o modo de transparência expõe evidências e decisões, nunca raciocínio interno do modelo;
- [ ] aprovar evals de privacidade, segurança, citação, recusa, acessibilidade e aprendizagem;
- [ ] manter RAG, fornecedor externo, dados reais e ferramentas mutáveis bloqueados até o gate aplicável.

## Registro de decisão

Cada disciplina decide de forma independente. “Aprovado com ressalvas” exige prazo, responsável e condição verificável; não libera dados reais.

| Disciplina | Decisão | Ressalvas/condições | Evidência/ata | Responsável | Data |
|---|---|---|---|---|---|
| Direção/produto | Pendente | — | — | — | — |
| SST | Pendente | — | — | — | — |
| Ergonomia | Pendente | — | — | — | — |
| Metodologia/psicometria | Pendente | — | — | — | — |
| DPO/LGPD | Pendente | — | — | — | — |
| Jurídico/regulatório | Pendente | — | — | — | — |
| Segurança/arquitetura | Pendente | — | — | — | — |
| Trabalhadores/CIPA | Pendente | — | — | — | — |
| Operação | Pendente | — | — | — | — |

## Regra de aceite

G1 só pode ser marcado como aprovado quando:

1. todos os responsáveis obrigatórios estiverem nomeados;
2. todas as decisões bloqueantes tiverem evidência verificável;
3. nenhuma disciplina obrigatória registrar `rejeitado` ou `pendente`;
4. o commit/artefato revisado estiver identificado por hash;
5. CI de aplicação e banco estiver verde no repositório oficial;
6. a ata declarar explicitamente o escopo permitido: campanha sintética, sem trabalhadores reais;
7. riscos residuais, rollback e autoridade de suspensão estiverem aceitos.

Mesmo após G1, dados reais continuam proibidos até G3 e as aprovações formais específicas.
