# AVALIAÇÃO SISTÊMICA SOL 5.6 — KIRO PLAYBOOK NR-1 JULHO

**Data da auditoria:** 12/07/2026  
**Alvo:** `kiro-playbook-nr1-julho-main`  
**Vertical:** NR-1 / GRO-PGR / fatores de risco psicossociais relacionados ao trabalho / LGPD  
**Método:** due diligence em 13 lentes, evidência `arquivo:linha`, verificações locais, síntese sistêmica e gate de prontidão comercial  
**Score global ponderado:** **7.28/10**  
**Confiança global:** **média-alta**  
**Classificação:** **fundação tecnológica avançada, demonstrável com dados sintéticos; ainda não liberada para operação com trabalhadores reais ou piloto pago**

---

## 1. Veredito executivo

O aplicativo apresenta uma maturidade rara para um produto ainda em gate de fundação. O maior ativo não é apenas o volume de funcionalidades, mas a existência de uma **doutrina local coerente e convertida em guardrails testáveis**: bloqueio fail-closed para dados reais, Privacy Vault, k-anonimato, separação entre sinais psicométricos e decisão de risco, instrument registry, rastreabilidade e limites explícitos para IA.

A avaliação não encontrou um P0 técnico descontrolado no estado permitido pelo próprio produto, porque o sistema bloqueia conscientemente os usos que ainda não consegue sustentar. O risco principal é de **desalinhamento entre essa prudência interna e algumas mensagens públicas**, que ainda usam formulações como “Ciência de Oxford”, “3.000+ artigos científicos”, “criar ciclo de diagnóstico”, referência temporal desatualizada e uma alegação fixa de multa sem trilha jurídica visível.

### Decisão de mercado

- **GO** para reuniões de descoberta, apresentação executiva e demonstração privada exclusivamente sintética.
- **GO CONDICIONAL** para promoção pública de uma oferta de prontidão e design partner, após correção dos claims e criação de um canal comercial remoto governado.
- **NO-GO** para pesquisa com trabalhadores reais, campanhas reais, relatórios formais, piloto pago operacional, assinatura SaaS ou promessa de conformidade.

### Estágio aferido

**Protótipo demonstrável avançado / fundação de MVP sintético.**  
O próprio repositório declara que pode demonstrar dados sintéticos, mas ainda não considera o MVP sintético ou SaaS real liberados (`src/lib/governance/saasMaturity.test.ts:13-24`; `src/data/saasMaturityAssessment.ts:7-18`).

---

## 2. Escopo e limitações

### Verificações executadas

| Verificação | Resultado |
|---|---|
| Instalação determinística (`npm ci --ignore-scripts`) | PASS |
| Auditoria de dependências | PASS — 0 vulnerabilidades reportadas |
| ESLint | PASS |
| TypeScript typecheck | PASS |
| Build de produção | PASS — 3,07 s |
| Orçamento de bundle | PASS — 66 chunks; maior 526 kB |
| 44 arquivos de teste executados individualmente | PASS — 44/44 |
| `npm test` agregado | **não encerrou no ambiente da auditoria** |
| Testes de banco com Supabase local/pgTAP | não executados nesta auditoria |
| Browser E2E / Playwright | inexistente ou não executado |
| Teste visual com leitor de tela/dispositivos reais | não executado |
| Deploy, migrations e push | não executados |

A suíte agregada que não encerra é tratada como **P1 de confiabilidade do gate de CI**, não como reprovação dos testes, porque os 44 arquivos passaram isoladamente.

---

## 3. Doutrina local e aderência

A doutrina do repositório é explícita:

- tarefas de arquitetura, RLS, privacidade, scoring, IA e dados reais são classificadas como `MASTER` (`AGENTS.md:3-9`);
- não se avança gate sem evidência e dados reais ficam bloqueados até G3 (`AGENTS.md:11`);
- o gate declarado é G0, com No-Go para dados reais e uso exclusivamente sintético local (`docs/G0_EXECUTION_RECORD.md:5-9`);
- o produto não promete conformidade automática, laudo automático, diagnóstico individual ou decisão técnica por IA (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:53-57`);
- respostas individuais não ficam acessíveis à organização, `k ≥ 5` deve ser aplicado no servidor e o instrumento precisa ser versionado (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:59-74`).

**Aderência observada:** alta no núcleo de segurança e governança; média na camada pública de marketing.

---

# 4. Avaliação pelas 13 lentes

## Lente 1 — Técnica / Engenharia de software — 8,0/10 (peso 1,5)

**Cético:** arquiteto principal.  
**O que o faria levar a sério:** build reproduzível, tipagem estrita, testes rápidos, isolamento arquitetural e CI confiável.

### Forças

1. Rotas extensas são carregadas por lazy loading, reduzindo custo inicial (`src/App.tsx:12-47`).
2. O pipeline local contempla audit, lint, typecheck, testes, build e orçamento de bundle (`package.json:6-17`).
3. Foram localizados e executados 44 arquivos de teste; todos passaram individualmente.

### Fraturas

1. **P1 — tipagem deliberadamente permissiva:** `strict`, `noImplicitAny` e regras de unused estão desativadas (`tsconfig.app.json:15-25`; `eslint.config.js:23-26`).
2. **P1 — gate agregado não reprodutível:** `npm test` não encerrou no ambiente, embora os testes isolados tenham passado.
3. **P1 — ausência de browser E2E oficial:** o próprio mapa de maturidade marca esse item como bloqueado (`src/data/saasMaturityAssessment.ts:143-151`).

**Veredicto:** engenharia forte e consciente, mas ainda precisa transformar a boa cobertura contratual em um gate rápido, estrito e verificável ponta a ponta.

---

## Lente 2 — Maturidade SaaS & plataforma — 6,4/10 (peso 1,5)

**Cético:** ex-CTO de SaaS em escala.  
**O que o faria levar a sério:** isolamento tenant testado, operações de produção, observabilidade, incident response, billing e onboarding repetível.

### Forças

1. Privacy Vault e políticas de supressão são tratadas como invariantes, não como documentação (`src/test/privacyVaultMigration.test.ts:20-68`).
2. O data gate classifica ambientes e falha fechado para acessos proibidos (`src/lib/runtime/dataGate.ts:40-124`).
3. A arquitetura contempla empresas, unidades, ciclos, AEP/AET, riscos, controles, documentos, governança e IA (`src/App.tsx:59-88`).

### Fraturas

1. **P0 comercial — dados reais bloqueados até G3** (`src/data/saasMaturityAssessment.ts:154-163`).
2. **P1 — decisões LGPD, incidente/DR e observabilidade/SLO permanecem bloqueadas** (`src/data/saasMaturityAssessment.ts:165-195`).
3. **P1 — billing, onboarding self-service e integrações enterprise não existem** (`src/data/saasMaturityAssessment.ts:198-217`).

**Veredicto:** boa fundação de plataforma, mas ainda não é uma operação SaaS comercial repetível.

---

## Lente 3 — Modelo de negócio — 6,4/10 (peso 1,5)

**Cético:** investidor e operador de receita.  
**O que o faria levar a sério:** ICP validado, oferta comprável, canal de captação real, contrato, pricing e prova de disposição a pagar.

### Forças

1. ICP de design partner está delimitado a empresas de 250 a 2.000 colaboradores (`src/data/g1DesignPartnerOffer.ts:39-48`).
2. O escopo inicial é honestamente limitado a prontidão, governança, jornada sintética e roadmap (`src/data/g1DesignPartnerOffer.ts:59-67`).
3. A SalesPage diferencia descoberta, design partner e operação real, mantendo os gates visíveis (`src/pages/SalesPage.tsx:86-119`).

### Fraturas

1. **P0 comercial — termos pagos, DPA, responsáveis e pacote metodológico continuam bloqueados** (`src/data/g1DesignPartnerOffer.ts:100-147`).
2. **P1 — o formulário salva o lead somente no navegador/localStorage**, portanto não constitui captação remota operacional (`src/components/sales/LeadCaptureForm.tsx:70-135`).
3. **P1 — não há billing, pricing validado ou instrumentação de aquisição** no runtime.

**Veredicto:** a tese comercial está bem desenhada, mas a operação de receita ainda é um modelo de governança, não um funil funcionando.

---

## Lente 4 — Narrativa & marca — 7,5/10 (peso 1,0)

**Cético:** estrategista de categoria.  
**O que o faria levar a sério:** categoria própria, linguagem defensável e perfeita correspondência entre a promessa e o gate atual.

### Forças

1. A categoria “Sistema Operacional de Evidências e Intervenções para Trabalho Saudável” é clara e diferenciadora (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:15-21`).
2. A narrativa conecta medir, contextualizar, agir, evidenciar e reavaliar (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:5-7`).
3. A SalesPage comunica explicitamente “demo sintética” e “dados reais só após aprovações” (`src/pages/SalesPage.tsx:249-253`).

### Fraturas

1. **P1 — possível associação institucional indevida:** “Ciência de Oxford” (`src/pages/HomePage.tsx:108`) e “University of Oxford” ao lado de “3.000+ artigos” (`src/pages/HomePage.tsx:190-210`) exigem fonte, licença e redação não afiliativa.
2. **P1 — “Criar ciclo de diagnóstico”** pode contradizer o limite de não realizar diagnóstico individual (`src/pages/HomePage.tsx:154-160`).
3. **P2 — metadados apresentam a solução como plataforma consolidada**, sem refletir o estágio sintético (`index.html:6-7,47-50`).

**Veredicto:** marca forte e memorável, mas precisa de uma camada de precisão editorial regulatória.

---

## Lente 5 — UX — 7,8/10 (peso 1,0)

**Cético:** designer sênior de produto.  
**O que o faria levar a sério:** jornadas observadas com usuários, tempo até valor, fluxos de recuperação e clareza entre papéis.

### Forças

1. Há arquitetura de informação ampla e orientada por tarefas reais (`src/App.tsx:59-88`).
2. O produto oferece jornada pública, autenticação, dashboards por papel e fluxo regulatório.
3. A doutrina prioriza trabalhador com celular simples, baixa familiaridade digital e receio de retaliação (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:91-95`).

### Fraturas

1. **P1 — a complexidade funcional pode superar a compreensão do usuário**, sem teste de usabilidade registrado.
2. **P1 — não há browser E2E ou evidência de jornada completa em dispositivo real.**
3. **P2 — a home mistura produto educacional, plataforma NR-1, IA e categoria operacional**, elevando carga cognitiva antes da proposta comercial.

**Veredicto:** UX conceitualmente madura e bem arquitetada, ainda sem evidência empírica suficiente de uso real.

---

## Lente 6 — IX / Design de interação — 7,5/10 (peso 1,0)

**Cético:** especialista em interação.  
**O que o faria levar a sério:** feedback consistente, motion acessível, prevenção de erro e validação em fluxos sensíveis.

### Forças

1. Uso extensivo de feedback visual, transições e estados via Framer Motion.
2. Fallback de rota é apresentado com semântica acessível (`src/App.tsx:43-47`).
3. A doutrina proíbe motion coercitivo em fluxos sensíveis (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:72-73,95`).

### Fraturas

1. **P1 — falta evidência de auditoria `prefers-reduced-motion`.**
2. **P1 — microinterações não foram testadas em browser E2E.**
3. **P2 — alguns CTAs usam pulsação/escala**, adequados para marketing, mas precisam de revisão de motion e foco.

**Veredicto:** interação refinada no código, com lacuna de validação acessível e comportamental.

---

## Lente 7 — Design visual / sistema — 8,2/10 (peso 1,0)

**Cético:** diretor de design.  
**O que o faria levar a sério:** tokens consistentes, visualização legível, performance, responsividade e regressão visual.

### Forças

1. Sistema de tokens, dark mode, tipografia e componentes está documentado em CSS/Tailwind (`src/index.css`; `tailwind.config.ts:5-136`).
2. A identidade visual é distintiva e coerente com a categoria premium.
3. O orçamento de bundle passou: 66 chunks, maior chunk 526 kB e maior imagem 346,7 kB.

### Fraturas

1. **P1 — `vendor-charts` supera 500 kB**, gerando warning de build.
2. **P1 — não há visual regression testing.**
3. **P2 — densidade e volume de imagens podem pressionar celulares simples.**

**Veredicto:** design system premium e autoral, com necessidade de validar performance percebida e consistência em múltiplas telas.

---

## Lente 8 — Usabilidade & acessibilidade — 7,1/10 (peso 1,0)

**Cético:** pesquisador de acessibilidade e usuário vulnerável.  
**O que o faria levar a sério:** WCAG testada, teclado, leitor de tela, contraste e viewport móvel verificados.

### Forças

1. Critérios de acessibilidade e linguagem clara são invariantes formais (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:72-74,93-95`).
2. Há `focus-visible`, atributos ARIA e fallback semântico em componentes.
3. Existem testes de contraste e sanitização em configurações de branding.

### Fraturas

1. **P1 — ausência de axe/Lighthouse CI ou browser E2E acessível.**
2. **P1 — nenhum relatório de leitor de tela, teclado e mobile real foi localizado.**
3. **P2 — motion, gráficos e dashboards densos precisam de equivalentes textuais e redução de movimento comprovada.**

**Veredicto:** acessibilidade está na doutrina e em partes da implementação, mas ainda não foi demonstrada como qualidade sistêmica.

---

## Lente 9 — Marketing digital de alta conversão — 6,2/10 (peso 1,5)

**Cético:** líder de Growth/CRO.  
**O que o faria levar a sério:** aquisição mensurável, lead remoto, claims auditáveis, experimentação e conversão ética.

### Forças

1. Hero, CTAs, segmentação e SalesPage estruturam uma narrativa comercial clara.
2. A oferta de design partner possui limites, ICP e entregáveis controlados (`src/data/g1DesignPartnerOffer.ts:28-78`).
3. Existe teste automatizado contra uma série de overclaims (`src/test/publicClaimsGuardrail.test.ts:7-99`).

### Fraturas

1. **P0 comercial — lead intake local não entrega o lead à equipe**, tornando o CTA inoperante fora do dispositivo (`src/components/sales/LeadCaptureForm.tsx:70-135`).
2. **P1 — não foram encontrados analytics, pixel, funil ou experimentação.**
3. **P1 — o guardrail não cobre `index.html`, data files, alegação de multas, datas desatualizadas nem associação “Oxford”** (`src/test/publicClaimsGuardrail.test.ts:7-39`).

**Veredicto:** ótima superfície de conversão, mas sem infraestrutura de aquisição e com dívida crítica de precisão pública.

---

## Lente 10 — Inovação tecnológica & IA — 7,3/10 (peso 1,0)

**Cético:** CTO de inovação e AI Safety.  
**O que o faria levar a sério:** IA com fontes aprovadas, evals, custo, fallback, supervisão e rastreabilidade.

### Forças

1. Seis Edge Functions de IA usam preflight, schemas limitados, autenticação/quota e proibição de CORS wildcard (`src/test/aiEdgeSecurity.test.ts:17-61`).
2. Payloads são limitados por papel, quantidade de mensagens e tamanho (`supabase/functions/_shared/schemas.ts:3-49`).
3. O motor NEXO e mecanismos de recomendação possuem testes e limites de servidor.

### Fraturas

1. **P1 — RAG governado, evals, fontes aprovadas e runtime externo continuam bloqueados** (`src/data/saasMaturityAssessment.ts:220-228`).
2. **P1 — não há demonstração de custo, latência, fallback e observabilidade dos modelos.**
3. **P1 — “12 mentores de IA” é uma promessa de superfície maior do que a evidência de runtime aprovado.**

**Veredicto:** segurança e arquitetura de IA estão acima da média, mas a inteligência de produção ainda é parcialmente simulada e não validada.

---

## Lente 11 — Inovação educacional — 7,6/10 (peso 1,0)

**Cético:** designer instrucional.  
**O que o faria levar a sério:** objetivos, prática, feedback, retenção, transferência e resultado medido.

### Forças

1. O sistema conecta drivers, dinâmicas, conteúdo e ações numa jornada coerente.
2. A tese privilegia transformação no trabalho real, não consumo passivo de conteúdo.
3. Há mecanismos de progressão e recomendação orientada por evidências.

### Fraturas

1. **P1 — ausência de métricas de aprendizagem e transferência.**
2. **P1 — pacote metodológico do instrumento ainda não aprovado** (`src/data/g1DesignPartnerOffer.ts:120-127`).
3. **P2 — risco de excesso de conteúdo e gamificação antes de comprovar o mecanismo de mudança.**

**Veredicto:** arquitetura educacional promissora e original, ainda sem validação de resultado.

---

## Lente 12 — Criatividade — 8,6/10 (peso 1,0)

**Cético:** diretor criativo.  
**O que o faria levar a sério:** assinatura própria com utilidade, e não apenas estética.

### Forças

1. Categoria autoral e conexão entre evidências, intervenção, governança e aprendizagem.
2. Uso da governança como parte visível da experiência do produto.
3. Identidade visual, IA e storytelling formam uma assinatura reconhecível.

### Fraturas

1. **P1 — complexidade criativa pode obscurecer a oferta inicial.**
2. **P2 — nomenclaturas próprias exigem tradução operacional para compradores de SST/RH.**
3. **P2 — a criatividade precisa ser subordinada ao gate atual e à evidência científica.**

**Veredicto:** uma das dimensões mais fortes; o desafio é converter originalidade em compra simples e defensável.

---

## Lente 13 — Vertical regulatória NR-1/LGPD — 7,2/10 (peso 1,5)

**Cético:** auditor de SST, DPO e responsável técnico.  
**O que o faria levar a sério:** norma vigente, método aprovado, participação dos trabalhadores, AEP/AET, governança e revisão competente.

### Forças

1. O produto declara que questionários não substituem AEP/AET, observação e participação (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:55-57`).
2. Privacidade, k-anonimato, scoring, fonte e revisão são invariantes (`docs/SKILL_MESTRA_PLAYBOOK_NR1.md:61-74`).
3. O instrumento não aprovado é deliberadamente bloqueado para uso operacional.

### Fraturas

1. **P0 regulatório para uso real — fonte, licença, scoring, fixtures e revisão independente continuam pendentes** (`src/data/g1DesignPartnerOffer.ts:120-127`).
2. **P1 — texto público ainda menciona inclusão no PGR “a partir de 2025” e deve ser atualizado para o marco vigente de 26/05/2026.**
3. **P1 — “multas de até R$ 100 mil” não possui trilha jurídica visível e deve ser removido ou documentado como cenário específico, nunca como consequência automática.**

**Veredicto:** governança regulatória interna é muito forte; a prontidão externa depende de aprovações metodológicas, jurídicas e atualização integral da copy pública.

---

# 5. Scorecard consolidado

| # | Lente | Nota | Peso | Confiança | Evidência |
|---:|---|---:|---:|---|---|
| 1 | Técnica / Engenharia de software | 8.0 | 1.5 | Alta | E2 |
| 2 | Maturidade SaaS & plataforma | 6.4 | 1.5 | Alta | E2 |
| 3 | Modelo de negócio | 6.4 | 1.5 | Média-alta | E1/E2 |
| 4 | Narrativa & marca | 7.5 | 1.0 | Alta | E1 |
| 5 | UX | 7.8 | 1.0 | Média | E1/E2 |
| 6 | IX (design de interação) | 7.5 | 1.0 | Média | E1 |
| 7 | Design visual / sistema | 8.2 | 1.0 | Média-alta | E1/E2 |
| 8 | Usabilidade & acessibilidade | 7.1 | 1.0 | Média | E1/E2 |
| 9 | Marketing digital & CRO | 6.2 | 1.5 | Alta | E1/E2 |
| 10 | Inovação tecnológica & IA | 7.3 | 1.0 | Média-alta | E1/E2 |
| 11 | Inovação educacional | 7.6 | 1.0 | Média | E1 |
| 12 | Criatividade | 8.6 | 1.0 | Média-alta | E1 |
| 13 | Vertical regulatória — NR-1/LGPD | 7.2 | 1.5 | Alta | E1/E2 |

**Score ponderado:** **7.28/10**

### Leitura do score

O score não equivale a autorização comercial. A maturidade técnica e criativa eleva a média, mas os gates de dados reais, pacote metodológico, LGPD, operação e contratos prevalecem sobre o score.

---

# 6. Mapa de coerência

| Promessa ou ativo | Implementação observada | Vão de coerência |
|---|---|---|
| “Sistema operacional de evidências” | arquitetura extensa, governança e módulos reais | coerência alta |
| “Dados reais só após aprovação” | data gate fail-closed e testes | coerência alta |
| “12 mentores de IA” | funções protegidas e conteúdo, mas runtime supervisionado parcial | promessa maior que maturidade |
| “Ciência de Oxford / 3.000+ artigos” | link externo, sem registry público completo visível | risco de afiliação e prova |
| “Agendar reunião” | formulário grava apenas localmente | CTA não cumpre a função comercial |
| “Plataforma NR-1” | fundação sintética e G1 não aprovado | precisa qualificador de estágio |
| “Guardrail de claims” | teste cobre seis arquivos | cobertura insuficiente da superfície pública |
| CI verde | 44 testes isolados passam | comando agregado não encerra no ambiente |

---

# 7. Fraturas transversais

1. **A evidência é forte no código, mas incompleta na operação:** falta browser E2E, observabilidade, incident response e release receipt.
2. **A prudência interna é maior que a prudência da home:** claims públicos escapam do guardrail automatizado.
3. **A superfície comercial existe sem o backend comercial:** CTAs e oferta estão prontos, mas lead remoto, DPA, termos e pricing não.
4. **A arquitetura premium antecede a validação de mercado:** risco de continuar expandindo módulos antes de provar a oferta mínima.
5. **A qualidade estática excede a confiabilidade do gate agregado:** testes existem, mas a suíte completa precisa encerrar de modo previsível.

---

# 8. Alavancas assimétricas

## 8.1 Guardrail público de fonte única

Cobrir `index.html`, páginas, arrays de copy, metadados e conteúdo remoto; versionar claims, fonte, validade e responsável.

**Eleva:** narrativa, marketing, regulação, confiança e modelo de negócio.

## 8.2 Fast lane comercial governada

Substituir o formulário local por intake remoto aprovado, criar DPA/retention, calendário comercial e oferta de descoberta sem dados de trabalhadores.

**Eleva:** modelo de negócio, CRO, SaaS e prontidão de mercado.

## 8.3 Gate CI determinístico

Corrigir o hang de Vitest, adicionar timeout e sharding, gerar JUnit/JSON e browser smoke E2E.

**Eleva:** engenharia, SaaS, UX, acessibilidade e release.

## 8.4 Pacote metodológico canônico

Aprovar fonte, licença, itens, scoring, fixtures, manifesto e revisão independente antes de qualquer piloto real.

**Eleva:** regulação, dados, produto, educação e confiança.

## 8.5 Observabilidade e operação mínima

Definir SLO, logs, alertas, runbook, incidente, recuperação e capacidade por cliente.

**Eleva:** SaaS, segurança, comercialização e escala.

---

# 9. Checagem regulatória externa

A documentação oficial do MTE de 2026 reforça três decisões já presentes na doutrina do produto:

1. questionários não são obrigatórios nem existe uma única ferramenta oficial;
2. questionários não bastam isoladamente e devem integrar a avaliação do trabalho real/AEP;
3. a responsabilidade pelo PGR continua com a organização e os responsáveis competentes.

O marco atualizado dos fatores psicossociais passou a produzir efeitos em **26/05/2026**. Portanto, a referência pública “a partir de 2025” deve ser corrigida.

---

# 10. Conclusão magistral

O Kiro Playbook NR-1 não é um protótipo comum. Ele já possui uma base de engenharia, governança e criatividade compatível com um produto premium em formação. Sua maior virtude é saber dizer “não” aos usos que ainda não consegue sustentar.

O próximo avanço não deve ser adicionar mais funcionalidades. Deve ser fechar a distância entre:

- governança interna e comunicação pública;
- demo sintética e aquisição comercial;
- testes unitários/contratuais e jornada em browser;
- arquitetura avançada e validação de disposição a pagar;
- instrumento exploratório e pacote metodológico aprovado.

**Veredito final:** **APROVADO para demonstração sintética e preparação comercial; NÃO APROVADO para operação real ou piloto pago.**
