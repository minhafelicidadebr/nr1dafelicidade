# SKILL: Sra. EstratégIA — Arquitetura Agêntica 4-Abas, Ciência de Aprendizagem & Neuromarketing Ético de Alta Conversão

**Classificação de Governança:** `MASTER` (Arquitetura Agêntica, UX Conversacional Estruturada, Ciência de Aprendizagem, Neuromarketing Consultivo Ético e Integração com Telemetria Verificada $k \ge 5$).

---

## 1. Propósito da Skill

Esta skill define o padrão de engenharia, design instrucional, organização da informação e conversão consultiva para a **Sra. EstratégIA** (`AuroraFloatingAssistant.tsx` e `EstrategiaPage.tsx`), unificando:

1. **Funil Consultivo de 4 Abas (`Conversa` | `Diagnóstico` | `Plano` | `Contato`)**: inspirado na melhor ergonomia de atendimento institucional, mas conectado em tempo real à telemetria verificada do ecossistema (`AuroraContext`, $k \ge 5$, matriz AIHA $S \times P$, 16 Drivers do *Work Wellbeing Playbook 2.0* e 19 capítulos do *Manual Oficial MTE 2026*).
2. **Tags de Filtro Semântico Interativas**: `NR-1 Cap. 1.5`, `Diagnóstico executivo`, `Governança & LGPD`, `COPSOQ II`, `Playbook 2.0 (Oxford)` e `Conselho & ROI`.
3. **Tabelas e Cards Estruturados In-Chat e In-Tab**: toda resposta quantitativa ou diagnóstica é apresentada com tabela comparativa ($R = S \times P$, Nível de Risco, Driver Oxford associado e Rota Direta) + barras semafóricas.
4. **Neuromarketing Ético de Alta Conversão B2B**: ancoragem cognitiva de risco regulatório vs. proteção institucional, redução de atrito decisório (Lei de Hick), prova científica (Oxford + MTE 2026) e pré-preenchimento inteligente da **Solicitação Institucional** com exportação imediata de Dossiê Executivo em **PDF 5 Estrelas**.

---

## 2. Arquitetura das 4 Abas do Workspace Agêntico

| Aba | Código | Função Cognitiva & Técnica | Integração Real com o Ecossistema |
|---|---|---|---|
| **1. Conversa** | `conversa` | Escuta estruturada, 4 cards de atalho executivo (*Prontidão NR-1*, *COPSOQ II*, *Conselho e ROI*, *Próximo passo*), filtro por tags, stream com tabelas determinísticas e alternância tom natural/técnico. | `answerByIntent`, `routeFreeQuestion`, `strategia-rewrite`, `AuroraScore` ($k \ge 5$). |
| **2. Diagnóstico** | `diagnostico` | **Leitura do Contexto — Diagnóstico orientado**: sintetiza os sinais da conversa + telemetria ativa em 3 cards numerados (`01 Contexto`, `02 Prioridades`, `03 Encaminhamento`), chips de `Sinais Reconhecidos` e **Tabela Executiva de Riscos e Drivers ($S \times P$)**. | `ctx.visibleScores`, `dimensionToDriver`, `evaluateMte2026DeterministicCompliance`, exportação direta em PDF. |
| **3. Plano** | `plano` | **Rota Recomendada — Da dúvida à ação auditável**: 4 etapas acionáveis com status vivo (`Concluída`, `Em foco`, `Próxima`) e deep-links diretos para `/app/cycles`, `/app/work-analysis`, `/app/risk`, `/app/actions`, `/app/controls`, `/app/documents` e `/drivers`. | Navegação agêntica direta sem perda de contexto. |
| **4. Contato** | `contato` | **Solicitação Institucional & Contratação Consultiva**: formulário pré-preenchido com os sinais reconhecidos na conversa e no ciclo, consentimento LGPD explícito, geração de protocolo auditável, download de PDF executivo da proposta/diagnóstico e canal direto com especialistas do Instituto. | Persistência local/institucional + gerador PDF `downloadInstitutionalInstructionalPdf`. |

---

## 3. Regras Inegociáveis (Guardrails Constitucionais)

- **Zero Diagnóstico Clínico ou Individual**: toda leitura é estritamente organizacional e coletiva ($k \ge 5$).
- **Zero Promessa de Conformidade Automática**: todas as recomendações são preliminares e exigem validação de responsável técnico (SST/SESMT/Ergonomia).
- **Determinismo antes de LLM**: nenhum número, escore $S \times P$ ou citação normativa é inventado; a IA opera exclusivamente sobre o pacote determinístico verificado.
