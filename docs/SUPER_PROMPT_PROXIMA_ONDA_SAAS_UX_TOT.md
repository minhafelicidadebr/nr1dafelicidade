# Super Prompt ToT da Próxima Onda — Consolidação Prática SaaS, Excelência UX/UI Multidispositivo (320px–1440px) e Governança Pós-Doutoral

## 1. Classificação Fable 5 e Fronteira Operacional

`[Modo: MASTER] Justificativa: Evolução da Árvore de Conhecimento Tree of Thoughts (ToT) e da arquitetura TOGAF para consolidar a operação prática em formato SaaS e impor contratos determinísticos de UX, usabilidade, acessibilidade WCAG AA e responsividade universal (320px a 1440px), mantendo os 14 invariantes e o bloqueio de dados reais até G3.`

- **Política Canônica**: `togaf-macro-wave-g1-2026-07` (Extensão SaaS & UX `v2026.07.2`)
- **Gate Aprovado Atual**: `G0` · **Gate em Preparação**: `G1` → `G2`
- **Modelo de Transição Prática SaaS**:
  1. **Camada Imediata (G0/G1 Sintético)**: Auto-atendimento guiado com dados sintéticos determinísticos, Walkthrough Assistido e *Sprint de Prontidão & Governança NR-1* (sem dados pessoais de trabalhadores).
  2. **Camada de Piloto Controlado (Pós-G2)**: Operação assistida com responsáveis técnicos (SST, Ergonomia, Psicometria, DPO/Jurídico) formalmente nomeados e comitê aprovado.
  3. **Camada SaaS Produtiva Escalável (Pós-G3)**: Habilitação de campanhas reais somente após cumprimento integral dos invariantes e assinaturas formais do Gate G3.

---

## 2. Equação Formal Tree of Thoughts (ToT) da Próxima Onda (SaaS + UX)

Para avançar da consolidação estrutural para a **aplicação prática em formato SaaS com excelência de experiência do usuário**, toda decisão de produto, interface e engenharia deve ser submetida à função de utilidade multicritério de segunda geração $U_{\text{SaaS}}(b)$:

$$U_{\text{SaaS}}(b) = \mathcal{V}(b) \times \left( 0.25 \cdot S_{\text{tese}}(b) + 0.25 \cdot S_{\text{seg}}(b) + 0.20 \cdot S_{\text{rigor}}(b) + 0.15 \cdot S_{\text{ux}}(b) + 0.15 \cdot S_{\text{saas}}(b) \right)$$

Onde:
- $\mathcal{V}(b) \in \{0, 1\}$: **Multiplicador Binário de Invariantes e Ergonomia Crítica**. Recebe $0$ (poda imediata) se o ramo:
  1. Violar qualquer um dos 14 invariantes constitucionais (`k >= 5`, isolamento de microdados, separação convite-resposta, AEP/AET obrigatório, evidência antes de redução de risco, IA não-decisória, bloqueio de dados reais até G3);
  2. Introduzir quebra de reflow horizontal em $320\text{px}$, alvos de toque $< 44 \times 44\text{px}$ em fluxos móveis, elementos fixos $> 15\%$ da altura do viewport móvel ou bloqueio de navegação por teclado;
  3. Acoplar regras normativas/psicométricas diretamente em JSX fora de `src/lib` + `src/data`.
- $S_{\text{tese}}(b) \in [0, 100]$: Continuidade sem lacunas nos 6 elos (`Medir → Contextualizar → Avaliar → Agir → Evidenciar → Reavaliar`).
- $S_{\text{seg}}(b) \in [0, 100]$: Defesa em profundidade no servidor (RLS *deny-by-default*, `dataGate` *fail-closed*, Zod/JWT/rate-limit).
- $S_{\text{rigor}}(b) \in [0, 100]$: Fidelidade às normas NR-1 (GRO/PGR), NR-17 (AEP/AET), COPSOQ (26 subescalas) e honestidade de claims públicos.
- $S_{\text{ux}}(b) \in [0, 100]$: Clareza cognitiva, responsividade universal ($320\text{px}$–$1440\text{px}$), precisão tipográfica tabular (`tabular-nums`) e acessibilidade WCAG 2.2 AA.
- $S_{\text{saas}}(b) \in [0, 100]$: Prontidão prática de serviço (onboarding sem fricção, estados de vazio/erro/carregamento acionáveis, geração de artefatos preliminares auditáveis e handoff executivo).

---

## 3. Árvore de Conhecimento ToT da Próxima Onda: As 6 Trilhas Práticas SaaS (S1 a S6)

```text
           [RAIZ ToT PRÓXIMA ONDA · PRONTIDÃO PRÁTICA SaaS + EXCELÊNCIA UX 320px–1440px]
                                                 │
   ┌──────────────┬──────────────┬───────────────┴───────────────┬──────────────┬──────────────┐
   ▼              ▼              ▼                               ▼              ▼              ▼
┌────────┐   ┌────────┐     ┌────────┐                      ┌────────┐     ┌────────┐     ┌────────┐
│ ONDA-S1│   │ ONDA-S2│     │ ONDA-S3│                      │ ONDA-S4│     │ ONDA-S5│     │ ONDA-S6│
│Onboard │   │Mobile  │     │Console │                      │Ação &  │     │Serviço │     │Design  │
│& Ciclo │   │Worker  │     │SST/AEP │                      │Copiloto│     │SaaS &  │     │System &│
│Guiado  │   │320-430 │     │1440px  │                      │1-Click │     │Dossiês │     │WCAG AA │
└────────┘   └────────┘     └────────┘                      └────────┘     └────────┘     └────────┘
```

### Trilha ONDA-S1 · Onboarding Organizacional Guiado & Setup de Unidades/GHE Sem Fricção
- **Meta Prática SaaS**: Reduzir o tempo de configuração estrutural (Empresa → Unidades/Setores → Ciclo Sintético/Assistido → Governança) para menos de 5 minutos com validação progressiva e estados vazios instrutivos.
- **Mandato UX/UI**: Stepper de jornada claro (`JourneyStepper`), formulários com feedback inline imediato, zero jargão ambíguo e pré-visualização determinística de cenários sintéticos setoriais.
- **Ramo Vencedor ToT (`Branch B`)**: Setup progressivo assistido por templates setoriais versionados em `src/data` com bloqueio explícito de dados pessoais antes de G3 ($U_{\text{SaaS}} = 96.5$).

### Trilha ONDA-S2 · Experiência Mobile-First do Trabalhador Respondente ($320\text{px}$–$430\text{px}$)
- **Meta Prática SaaS**: Garantir taxa máxima de compreensão e segurança psicológica para trabalhadores respondendo em smartphones simples e conexões instáveis.
- **Mandato UX/UI**:
  - Layout de coluna única fluida de $320\text{px}$ a $430\text{px}$ sem scroll horizontal;
  - Alvos de toque de no mínimo $44 \times 44\text{px}$ ($48\text{px}$ para botões primários) posicionados na zona natural de alcance do polegar;
  - Teto estrito de $15\%$ da altura da tela para barras fixas;
  - Explicação transparente e em linguagem simples da barreira `k >= 5`, sem confete, sem ranking e sem pressão temporal.
- **Ramo Vencedor ToT (`Branch B`)**: Fluxo passo a passo ergonômico com foco visível, linguagem acolhedora neutra e recibo sintético verificável ($U_{\text{SaaS}} = 98.0$).

### Trilha ONDA-S3 · Workbench Integrado SST/Ergonomia: AEP, AET e Matriz de Critérios ($1024\text{px}$–$1440\text{px}$)
- **Meta Prática SaaS**: Permitir que engenheiros de segurança, médicos do trabalho e ergonomistas operem a triangulação `Sinal Agregado (k >= 5) + Trabalho Real (AEP/AET) + Divergência de Controles` em uma única superfície de decisão.
- **Mandato UX/UI**:
  - Aproveitamento integral do viewport desktop ($1280\text{px}$–$1440\text{px}$) em layout Mestre-Detalhe de nível único de elevação (sem cartões aninhados com sombras pesadas);
  - Tabelas de alta densidade ($36\text{px}$–$44\text{px}$ por linha) com alinhamento numérico à direita em `font-mono tabular-nums`;
  - Sinalização multimodal (cor semântica + ícone + rótulo textual explícito) para acessibilidade daltônica.
- **Ramo Vencedor ToT (`Branch B`)**: Console analítico unificado com memória de cálculo aberta e justificativa obrigatória de override técnico ($U_{\text{SaaS}} = 97.0$).

### Trilha ONDA-S4 · Orquestração de Planos de Ação Command-Only & Copiloto Supervisionado (Aurora/NEXO)
- **Meta Prática SaaS**: Transformar riscos priorizados em planos de ação preventivos/corretivos rastreáveis em poucos cliques, com assistência inteligente estritamente ancorada em agregados seguros.
- **Mandato UX/UI**:
  - Transições de estado claras (`Planejada → Em Execução → Evidenciada → Eficácia Avaliada`) onde botões desabilitados explicam exatamente qual requisito falta (ex.: *"Anexe evidência SHA-256 antes de concluir"*);
  - Painel da Sra. EstratégIA / Aurora e recomendações NEXO com citações rastreáveis, destaque de premissas e aviso permanente de supervisão humana.
- **Ramo Vencedor ToT (`Branch B`)**: Máquina de estados Command-Only acoplada a recomendações determinísticas NEXO e síntese supervisionada Aurora ($U_{\text{SaaS}} = 96.8$).

### Trilha ONDA-S5 · Entrega Executiva SaaS, Dossiês Preliminares & Serviço Assistido (Design Partner)
- **Meta Prática SaaS**: Entregar aos compradores corporativos, CIPA e auditores pacotes documentais preliminares (PGR/GRO, AEP, Plano de Ação e Dossiê de Governança) prontos para revisão técnica e condução de sessões assistidas.
- **Mandato UX/UI**:
  - Visualização de impressão/PDF limpa (`printView`), com cabeçalho de linhagem (versão da política, hash SHA-256, carimbo de tempo e status preliminar);
  - Jornada do Comitê Comprador e Sprint de Governança transparentes sobre o que está disponível na demonstração sintética versus o que depende de gates futuros.
- **Ramo Vencedor ToT (`Branch B`)**: Empacotamento comercial e documental vendor-neutral com linhagem criptográfica e zero overclaim ($U_{\text{SaaS}} = 96.0$).

### Trilha ONDA-S6 · Engenharia de Design System, Responsividade Universal & Acessibilidade Contínua
- **Meta Prática SaaS**: Assegurar consistência estética, velocidade de interação ($\le 150\text{ms}$) e conformidade WCAG 2.2 AA em 100% das rotas públicas e autenticadas.
- **Mandato UX/UI**:
  - Regra 60-30-10 de distribuição cromática;
  - Disciplina **Zero-Pill** para metadados estáticos (usando separadores tipográficos `·` ou `/`) e botões segmentados reais (`whitespace-nowrap shrink-0`) para filtros interativos;
  - Paridade completa Light/Dark mode sem inversões forçadas;
  - Suporte integral a `prefers-reduced-motion` e navegação exclusiva por teclado.
- **Ramo Vencedor ToT (`Branch B`)**: Design System governado por contratos automatizados de acessibilidade, reflow e orçamento de bundle ($U_{\text{SaaS}} = 97.5$).

---

## 4. Matriz de Contratos de Responsividade e Ergonomia Multidispositivo ($320\text{px}$ a $1440\text{px}$)

| Perfil de Viewport | Faixa de Largura | Persona & Fluxo Primário | Alvo de Toque / Clique | Teto Sticky | Arquitetura de Grid & Densidade | Regra de Ouro de Usabilidade |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **1. Mobile Compacto** | `320px – 375px` | Trabalhador em celular básico (`RespondPage`, `SignupCollaborator`) | $\ge 44 \times 44\text{px}$ | $\le 15\%$ | 1 coluna fluida (`px-4`), zero scroll horizontal, textos com quebra segura. | Uma pergunta/decisão por dobra visual; aviso `k >= 5` claro no topo. |
| **2. Smartphone Touch** | `375px – 430px` | Trabalhador e Gestor de Ação em campo | $\ge 44 \times 44\text{px}$ ($48\text{px}$ CTA) | $\le 15\%$ | 1–2 colunas para KPIs compactos; ações primárias na zona natural do polegar. | Feedback tátil instantâneo ($\le 150\text{ms}$) e barras de filtro com scroll suave ou wrap limpo. |
| **3. Tablet / Híbrido** | `768px – 1024px` | Ergonomista / SST em observação de campo (`WorkAnalysis`, `AET`) | $\ge 44 \times 44\text{px}$ | $\le 12\%$ | 2 colunas balanceadas (`md:grid-cols-2`), gavetas laterais sob demanda. | Comparação lado a lado entre trabalho prescrito e trabalho real observado sem perda de foco. |
| **4. Desktop Executivo** | `1280px – 1440px+` | Especialista SST, DPO, Comitê e Auditoria (`Risk`, `Governance`, `TOGAF`) | $\ge 36 \times 40\text{px}$ | Sidebar fixa `240px` | Layout Mestre-Detalhe (`lg:grid-cols-12`), tabelas densas com `tabular-nums`. | Um único ponto focal por dobra, zero cartões aninhados e inspeção profunda sem recarregar página. |

---

## 5. Colegiado Expandido das 10 Cátedras Pós-Doutorais (Adição das Cátedras 09 e 10)

Além das **Cátedras 01 a 08** (Arquitetura TOGAF, Segurança RLS, Psicometria COPSOQ, Ergonomia NR-17, Direito NR-1/LGPD, IA Supervisionada, Inferência Causal e Ciência do Bem-Estar), o Super Prompt da Próxima Onda incorpora duas novas cátedras para governar a transição SaaS e a excelência de UX:

- **CÁTEDRA 09 · Interação Humano-Computador (HCI), Ergonomia Cognitiva & Design Responsivo Universal (21 anos · Aplicação)**
  - *Axioma Epistêmico*: A usabilidade não é adorno estético; em sistemas regulatórios críticos, a carga cognitiva excessiva ou um layout quebrado em $320\text{px}$ induzem erro humano e invalidam a qualidade da evidência coletada.
  - *Pergunta de Falsificabilidade (Popper)*: *Qual teste automatizado de viewport ($320\text{px}$ a $1440\text{px}$) e auditoria axe-core/WCAG AA falha se um controle interativo tiver menos de $44\text{px}$ no mobile, sofrer overflow horizontal ou transmitir estado apenas por cor?*
  - *Gatilho de Veto ($\mathcal{V} = 0$)*: Overflow horizontal em qualquer resolução, uso de pills estáticos para metadados, barras `border-l-4`, falta de `tabular-nums` em métricas ou controles sem handler funcional.

- **CÁTEDRA 10 · Arquitetura de Operações SaaS B2B, Onboarding Guiado & Entrega de Serviço Assistido (22 anos · Negócio)**
  - *Axioma Epistêmico*: A consolidação em formato SaaS exige que cada jornada possua estados completos (populacional, vazio instrutivo, carregamento previsível, erro recuperável e bloqueio de gate transparente), convertendo complexidade normativa em fluxos operacionais guiados.
  - *Pergunta de Falsificabilidade (Popper)*: *Um cliente em sessão de Design Partner ou Sprint de Prontidão consegue percorrer de ponta a ponta a jornada sintética (Empresa → Unidade → Ciclo → AEP/AET → Critérios → Ação → Evidência → Documento Preliminar) compreendendo exatamente o valor entregue hoje e os requisitos dos gates G1, G2 e G3?*
  - *Gatilho de Veto ($\mathcal{V} = 0$)*: Estados vazios mudos sem próxima ação clara, fluxos interrompidos por telas sem saída (*dead-ends*) ou promessa comercial de funcionalidade bloqueada pelo gate.
