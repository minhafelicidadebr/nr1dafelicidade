# Árvore de Conhecimento Sistêmica TOGAF & Macro-Onda de Consolidação NR-1 (G1 → G2)

## 1. Classificação Fable 5 e Fronteira de Gate

`[Modo: MASTER] Justificativa: Estruturação arquitetural corporativa fim a fim (TOGAF ADM + Enterprise Continuum) cobrindo a cadeia operacional NR-1, invariantes de privacidade k >= 5, governança de IA supervisionada e contratos de consolidação entre G1 e G2.`

- **Política de Arquitetura**: `togaf-macro-wave-g1-2026-07`
- **Gate Aprovado Atual**: `G0` (Desenvolvimento local e dados exclusivamente sintéticos)
- **Gate Alvo da Consolidação**: `G1` (Campanha sintética segura) → preparação estrutural para `G2` (Submissão ao comitê)
- **Dados Reais / Trabalhadores Reais / Produção**: **Proibidos (No-Go)** até aprovação formal de `G3` e assinaturas dos responsáveis (SST, Ergonomia, Psicometria, DPO/Jurídico, Segurança e Produto).

---

## 2. Raiz Constitucional e Invariantes (Fase Preliminar TOGAF)

Na adaptação do **TOGAF Standard (10th Edition)** para a engenharia regulatória Fable 5, a **Fase Preliminar** estabelece os princípios imutáveis que governam todas as camadas da arquitetura corporativa:

1. **Isolamento de Microdados (Invariantes 1 e 2)**: Respostas individuais (`responses`) nunca são acessíveis a usuários organizacionais; convites, identidade e respostas são desacoplados criptográfica e arquiteturalmente no Privacy Vault.
2. **Anonimato Estatístico Server-Side (Invariante 3)**: `k >= 5` é imposto no banco de dados (RPCs e views protegidas) e em todas as superfícies derivadas (dashboards, exportações, documentos e contexto de IA).
3. **Versionamento Metodológico e Preservação de Escore (Invariantes 4 e 5)**: Instrumentos, licenças, subescalas, polaridades e fórmulas são versionados no `Instrument Registry`; o escore bruto original é preservado separadamente de traduções operacionais.
4. **Proibição de Determinismo Psicométrico Isolado (Invariante 6)**: Nenhum sinal de questionário determina sozinho probabilidade ou severidade oficial sem contextualização no trabalho real (AEP/AET).
5. **Redução de Risco Baseada em Eficácia Comprovada (Invariante 7)**: Controles propostos ou em implantação não reduzem risco residual; apenas controles implementados com evidência verificada de eficácia alteram a avaliação pós-controle.
6. **IA Supervisionada e Não-Decisória (Invariante 8)**: Os motores Aurora e NEXO operam exclusivamente sobre agregados `k >= 5` sanitizados, sem diagnosticar, classificar indivíduos, assinar laudos ou prometer conformidade.
7. **Rastreabilidade Criptográfica e Revisão Humana (Invariantes 9 a 14)**: Todo documento é preliminar até revisão competente, carrega linhagem versionada e hash SHA-256, mantendo bloqueio total de dados reais em G0/G1.

---

## 3. Árvore de Conhecimento TOGAF: Os 4 Domínios Arquiteturais

```text
                        [RAIZ CONSTITUCIONAL FABLE 5 · 14 INVARIANTES · GATE G0/G1]
                                                     │
       ┌─────────────────────────┬───────────────────┴───────────────────┬─────────────────────────┐
       ▼                         ▼                                       ▼                         ▼
┌──────────────┐         ┌──────────────┐                        ┌──────────────┐         ┌──────────────┐
│ 1. NEGÓCIO   │         │ 2. DADOS &   │                        │ 3. APLICAÇÃO │         │ 4. TECNOLOGIA│
│ & REGULAÇÃO  │         │ INFORMAÇÃO   │                        │ & MECANISMOS │         │ & SEGURANÇA  │
├──────────────┤         ├──────────────┤                        ├──────────────┤         ├──────────────┤
│ • NR-1 / GRO │         │ • Privacy    │                        │ • Motores    │         │ • Zero-Trust │
│ • NR-17 AEP  │         │   Vault k>=5 │                        │   Puros      │         │   RLS/pgTAP  │
│   & AET      │         │ • Instrument │                        │   (src/lib)  │         │ • Runtime    │
│ • Metodologia│         │   Registry   │                        │ • Catálogos  │         │   Data Gate  │
│   COPSOQ     │         │ • Matrizes   │                        │   Versionados│         │ • Edge Auth  │
│ • Trilha de  │         │   AEP/AET/   │                        │   (src/data) │         │   & Rate     │
│   Controles  │         │   Critérios  │                        │ • Command    │         │   Limiting   │
│   & PDCA     │         │ • Ledger SHA │                        │   Core Ações │         │ • CI Budget  │
│ • Governança │         │ • Ciclo Vida │                        │ • Copiloto   │         │   & Type     │
│   de Aceite  │         │   LGPD       │                        │   Aurora/NEXO│         │   Strictness │
└──────────────┘         └──────────────┘                        └──────────────┘         └──────────────┘
```

### 3.1. Arquitetura de Negócio e Regulação (Business Architecture — Fase B)
- **Capacidade Central**: Orquestrar a jornada regulatória `Medir → Contextualizar → Avaliar → Agir → Evidenciar → Reavaliar` para gestão de riscos psicossociais relacionados ao trabalho no escopo da NR-1 (GRO/PGR) e NR-17 (Ergonomia).
- **Atores e Papéis**: Trabalhador respondente (protegido por anonimato e celular simples), Responsável Técnico SST/SESMT, Ergonomista (AEP/AET), Gestor de Plano de Ação, Representação/CIPA e Auditor/DPO.
- **Guardrails de Negócio**: Zero promessa de conformidade automática; distinção explícita entre artefato orientativo preliminar e inventário/plano assinado por responsável competente.

### 3.2. Arquitetura de Dados e Informação (Data Architecture — Fase C1)
- **Segregação em Cofre (Privacy Vault)**: Separação física e lógica entre tabelas de campanha/convite, microdados de resposta (acesso negado a usuários da organização via RLS `deny-by-default`) e views/RPCs de agregação com filtro `count >= 5`.
- **Linhagem de Contexto e Risco**: Entidades formais para contexto do trabalho real (`work_context_assessments`, fatores de exposição, grupos homogêneos/unidades), gatilhos de aprofundamento ergonômico (`aet_cases`), avaliações de risco (`risk_assessments` com severidade, probabilidade e justificativa) e plano de ação (`action_plans`, `evidence_records`, `effectiveness_reviews`).
- **Governança de Ciclo de Vida**: Regras explícitas de retenção, descarte e bloqueio de exportação por classe de dado (`response_microdata`, `safe_aggregate`, `operational_evidence`).

### 3.3. Arquitetura de Aplicação e Mecanismos Puros (Application Architecture — Fase C2)
- **Separação Estrita Mecanismo vs. Domínio**:
  - `src/lib/**`: Motores puros determinísticos, livres de side-effects e testados unitariamente (ex.: `criteriaEngine`, `aetAssessment`, `actionExecutionCore`, `controlDivergence`, `contextBuilder`, `togafMacroWaveEngine`).
  - `src/data/**`: Políticas versionadas, matrizes normativas, catálogos de instrumentos, cenários sintéticos e contratos de prontidão.
  - `src/pages/**` e `src/components/**`: Superfícies de apresentação e orquestração de estado que consomem os motores puros sem hardcodar limiares regulatórios ou psicométricos.

### 3.4. Arquitetura Tecnológica, Segurança e Controle de Qualidade (Technology Architecture — Fase D, G, H)
- **Defesa em Profundidade (Runtime + Banco)**:
  - **Camada Cliente**: `dataGate.ts` opera em modo *fail-closed* no Gate G0/G1, bloqueando qualquer tráfego para endpoints remotos não autorizados.
  - **Camada Banco/Servidor**: RLS *deny-by-default*, funções `SECURITY DEFINER` com `search_path` fixo, mutações de estado críticas via RPCs transacionais (*Command-Only*) e validação por suíte pgTAP (206+ asserções).
  - **Camada Edge/IA**: Validação estrita de JWT, verificação de vínculo organizacional, sanitização contra *prompt injection*, *rate limiting* por usuário/organização e proibição de envio de texto livre individual.
  - **Camada CI/Release**: Ratchet de `explicit-any` zero regressão, orçamento de bundle, reprodutibilidade determinística Vitest e auditoria de escopo de release.

---

## 4. Ciclo ADM TOGAF Aplicado ao Playbook NR-1

| Fase ADM | Nome no Framework | Tradução Executável no Playbook NR-1 | Artefato / Contrato Verificável |
| :--- | :--- | :--- | :--- |
| **Preliminar** | Framework and Principles | Constituição Operacional, 14 Invariantes, Token Economy ToT e Gate G0/G1 | `docs/PROJECT_CONSTITUTION.md`, `src/data/runtimePolicy.ts` |
| **Fase A** | Architecture Vision | Tese do Sistema Operacional de Evidências e Cadeia de 6 Elos | `docs/SKILL_MESTRA_PLAYBOOK_NR1.md`, `src/data/regulatoryJourney.ts` |
| **Fase B** | Business Architecture | Fluxos de AEP, AET, GRO/PGR, participação CIPA e limites de claims públicos | `src/lib/work/assessment.ts`, `src/test/publicClaimsGuardrail.test.ts` |
| **Fase C (Dados)** | Data Architecture | Privacy Vault `k >= 5`, Instrument Registry, Matriz de Ciclo de Vida e Ledger SHA-256 | `supabase/migrations/*_privacy_vault_g1.sql`, `src/lib/privacy.ts` |
| **Fase C (App)** | Application Architecture | Motores Puros (`src/lib`) desacoplados de Políticas (`src/data`) e UI (`src/pages`) | `src/lib/risk/criteriaEngine.ts`, `src/lib/actions/actionExecutionCore.ts` |
| **Fase D** | Technology Architecture | Zero-Trust RLS, Edge Security, Data Gate Fail-Closed e Contratos pgTAP | `src/lib/runtime/dataGate.ts`, `supabase/tests/privacy_vault_contract.sql` |
| **Fase E** | Opportunities & Solutions | Seleção de Fatias Verticais via Tree of Thoughts (ToT) com poda por invariante | `docs/FABLE5_TOKEN_ECONOMY.md`, `src/lib/governance/togafMacroWaveEngine.ts` |
| **Fase F** | Migration Planning | Macro-Onda de Consolidação Funcional em 6 Sub-Ondas E2E (G1 → G2) | `docs/TOGAF_SYSTEMIC_KNOWLEDGE_TREE_G1_G2.md` |
| **Fase G** | Implementation Governance | Contratos de CI, Ratchet de Tipagem, Guardrails de Claims e Dossiê G1 | `scripts/check-explicit-any.mjs`, `src/data/g1EvidenceDossier.ts` |
| **Fase H** | Architecture Change Mgmt | Monitoramento de Drift de Evidências, Recibos de Release e Gatilhos de Revisão | `src/test/releaseEvidenceManifestDrift.test.ts`, `src/lib/risk/reviewTriggers.ts` |

---

## 5. Macro-Onda de Consolidação Funcional (Os 6 Épicos E2E)

A Macro-Onda unifica os mecanismos construídos no repositório em uma linha de montagem contínua e verificável:

1. **Sub-Onda M1 · Medir com Proteção Criptográfica (`measure`)**
   - *Fases TOGAF*: Preliminar, C (Dados), D (Tecnologia).
   - *Escopo*: Consolidar o fluxo entre `Instrument Registry` (COPSOQ 26 subescalas versionadas), coleta neutra mobile-first e agregação no `Privacy Vault` com corte `k >= 5` intransponível.
2. **Sub-Onda M2 · Contextualizar no Trabalho Real — AEP & AET (`contextualize`)**
   - *Fases TOGAF*: B (Negócio), C (Dados/App).
   - *Escopo*: Vincular cada agregado protegido de unidade/GHE à Avaliação Ergonômica Preliminar (AEP), registro de observação da atividade real, escuta de trabalhadores/CIPA e abertura estruturada de AET quando houver gatilhos de sobrecarga ou exigência cognitiva/organizacional.
3. **Sub-Onda M3 · Avaliar Risco com Critérios Explicáveis e Divergência de Controles (`evaluate`)**
   - *Fases TOGAF*: B (Negócio), C (App), G (Governança).
   - *Escopo*: Operar o `Criteria Engine` combinando exposição observada, percepção agregada (`k >= 5`), vulnerabilidade contextual e maturidade de controles (`controlDivergence`), exigindo justificativa assinável em qualquer override humano.
4. **Sub-Onda M4 · Agir via Núcleo Command-Only e Inteligência Supervisionada (`act`)**
   - *Fases TOGAF*: C (App), D (Tecnologia), E (Soluções).
   - *Escopo*: Orquestrar planos de ação (`actionExecutionCore` e `actionCommandContract`) alimentados por recomendações determinísticas do NEXO e sínteses supervisionadas da Aurora, garantindo transições de estado válidas apenas por comandos auditados.
5. **Sub-Onda M5 · Evidenciar com Imutabilidade e Linhagem Documental (`evidence`)**
   - *Fases TOGAF*: C (Dados), D (Tecnologia), G (Governança).
   - *Escopo*: Exigir artefatos probatórios com hash SHA-256 (`controlEvidence`, `evidence_records`) para comprovar execução de ações e gerar documentos preliminares versionados com controle de concorrência otimista e marca d'água de limites regulatórios.
6. **Sub-Onda M6 · Reavaliar Eficácia e Fechar o Ciclo PDCA Longitudinal (`reevaluate`)**
   - *Fases TOGAF*: B (Negócio), F (Migração), H (Mudança).
   - *Escopo*: Avaliar a eficácia real pós-implementação (`effectiveness_reviews`), recalcular o risco residual apenas quando a eficácia for comprovada e acionar gatilhos automáticos de revisão (`reviewTriggers`) diante de mudanças organizacionais, incidentes ou novos ciclos.
