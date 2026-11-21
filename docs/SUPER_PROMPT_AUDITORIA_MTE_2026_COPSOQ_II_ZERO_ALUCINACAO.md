# Super Prompt de Auditoria Sistêmica & Melhorias Técnicas Efetivas (Zero Alucinação de IA) — Guia Oficial MTE 2026 (GRO/NR-1) + Manual COPSOQ II Portugal 2013

- **Classificação Fable 5**: `MASTER`
- **Política Canônica**: `togaf-macro-wave-g1-2026-07` (`v2026.07.4`)
- **Documentos Oficiais Auditados**:
  1. `Guia_Oficial_MTE_2026_Comentado.md` (*Manual de Interpretação e Aplicação do Capítulo 1.5 da NR-1 — Gerenciamento de Riscos Ocupacionais / GRO*, MTE / SIT, Portaria MTE nº 1.419/2024 e Portaria MTE nº 765/2025, vigência em 26/05/2026).
  2. `COPSOQ-Manual-Portugal2013.pdf` (*Copenhagen Psychosocial Questionnaire — COPSOQ II: Portugal e Países Africanos de Língua Oficial Portuguesa*, Carlos Fernandes da Silva et al., Universidade de Aveiro / FCT, 51 páginas).

---

## 1. Avaliação Sistêmica dos Documentos Anexos e Diagnóstico Forense do Aplicativo

### 1.1 Avaliação Sistêmica do Manual COPSOQ II Portugal 2013 (Versão Curta: 41 Questões / 26 Subescalas)
1. **Estrutura Oficial (Tabela 1, p. 12–13; Anexo Versão Curta, p. 27–29)**:
   - O Manual define três versões: **Versão Curta** (**26 subescalas e 41 questões** — autoavaliação ou locais com `< 30` trabalhadores, sem itens invertidos), **Versão Média** (**29 subescalas e 76 questões** — uso por profissionais de saúde ocupacional, com inversão apenas nos itens 42 e 45) e **Versão Longa** (**35 subescalas e 119 questões** — investigação).
   - Na **Versão Curta (41 questões)** adotada na tela de pesquisa do aplicativo (`src/data/copsoqData.ts` e `src/pages/RespondPage.tsx`), os 41 itens distribuem-se nas **8 dimensões principais e 26 subescalas**:
     1. **Exigências laborais (4 subescalas)**: *Exigências quantitativas* (`I1, I2`), *Ritmo de trabalho* (`I3`), *Exigências cognitivas* (`I4, I5`), *Exigências emocionais* (`I6`).
     2. **Organização do trabalho e conteúdo (4 subescalas)**: *Influência no trabalho* (`I7`), *Possibilidades de desenvolvimento* (`I8, I9`), *Significado do trabalho* (`I24, I25`), *Compromisso face ao local de trabalho* (`I26`).
     3. **Relações sociais e liderança (6 subescalas)**: *Previsibilidade* (`I10, I11`), *Transparência do papel laboral desempenhado* (`I12`), *Recompensas/Reconhecimento* (`I13`), *Apoio social de superiores* (`I15`), *Comunidade social no trabalho* (`I16`), *Qualidade da liderança* (`I17, I18`).
     4. **Interface trabalho-indivíduo (3 subescalas)**: *Satisfação no trabalho* (`I27`), *Insegurança laboral* (`I28`), *Conflito trabalho-família* (`I30, I31`).
     5. **Valores no local de trabalho (2 subescalas)**: *Confiança vertical* (`I19, I20`), *Justiça e respeito* (`I14, I21, I22`).
     6. **Personalidade (1 subescala)**: *Auto-eficácia* (`I23`).
     7. **Saúde e bem-estar (4 subescalas)**: *Saúde geral* (`I29`), *Problemas em dormir* (`I32`), *Burnout* (`I33, I34`), *Stress* (`I35, I36, I37`).
     8. **Comportamentos ofensivos (2 subescalas)**: *Insultos ou provocações verbais / Bullying* (`I38`), *Assédio sexual, ameaças de violência e violência física* (`I39, I40, I41`).
2. **Cotação Oficial por Tercis ("Modelo Tricolor / Semáforo", p. 11–12)**:
   - A cotação de cada subescala é obtida pela **média aritmética simples (`1,00 a 5,00`)** dos itens que a compõem.
   - Os pontos de corte oficiais dividem a escala `1..5` em **tercis exatos em `2,33` e `3,66`**:
     - Para **fatores protetores (`protective`)**: `> 3,66` = **Verde** (situação favorável para a saúde); `2,33 a 3,66` = **Amarelo** (situação intermédia); `< 2,33` = **Vermelho** (risco para a saúde).
     - Para **fatores de exposição de risco (`risk_exposure`)**: `< 2,33` = **Verde** (situação favorável para a saúde); `2,33 a 3,66` = **Amarelo** (situação intermédia); `> 3,66` = **Vermelho** (risco para a saúde).
3. **Adequação Executada no Código**:
   - `src/data/copsoqData.ts` foi atualizado com o catálogo `COPSOQ_OFFICIAL_SHORT_SUBSCALES` (26 subescalas e 8 dimensões principais), `COPSOQ_TERTILE_LOW_CUTOFF = 2.33`, `COPSOQ_TERTILE_HIGH_CUTOFF = 3.66`, `evaluateCopsoqTertileBand` e `computeOfficialShortSubscales`, além do alinhamento da escala de *Saúde Geral* (`I29`: `1 = Deficitária .. 5 = Excelente`), preservando 100% dos exports legados.
   - `src/data/instrumentRegistry.ts` foi atualizado para `subscaleCount: 26`, mantendo todos os bloqueios constitucionais (`status: "draft"`, `runtimeReady: false`).

---

### 1.2 Avaliação Sistêmica do Guia Oficial MTE 2026 Comentado (Cap. 1.5 NR-1 — GRO/PGR)
| Código | Cláusula NR-1 / NR-17 | Capítulo do Guia MTE 2026 | Ação Obrigatória Exigida pelo MTE | Módulo Verificador no App |
| :--- | :--- | :--- | :--- | :--- |
| `MTE-REQ-01` | `1.5.3.2.1` & `NR-17 17.3.1/17.3.2` | Cap. 5.2 e 5.3 | Cobrir as **5 áreas da NR-17** + fatores psicossociais via **AEP** e gatilhos de **AET** | `src/lib/aep/workContextEngine.ts` & `src/lib/aet/aetEscalationEngine.ts` |
| `MTE-REQ-02` | `1.5.3.3`, `1.4.1 'b'` & `1.5.5.1.3` | Cap. 6 e 12.1 | Consulta e participação em **4 momentos** + comunicação de riscos, medidas e limitações | `src/pages/RespondPage.tsx` & `src/lib/aep/workContextEngine.ts` |
| `MTE-REQ-03` | `1.5.4.2.1` | Cap. 9 | Evitar/eliminar perigo ou **agir imediatamente sobre riscos ocupacionais evidentes** | `src/lib/governance/mteCopsoqAuditEngine.ts` |
| `MTE-REQ-04` | `1.5.4.3.1` & `1.5.4.3.2` | Cap. 10 | Tríade da Identificação de Perigos: **(a) perigo/agravos, (b) fontes/circunstâncias, (c) grupo exposto (GES/GHE)** | `src/lib/risk/criteriaEngine.ts` & `src/pages/app/UnitsPage.tsx` |
| `MTE-REQ-05` | `1.5.4.4.4.1` | Cap. 11.3 | **Regra de Ouro da Severidade**: selecionar sempre a consequência de **maior magnitude** | `evaluateMteSeverityGoldenRule` (`mteCopsoqAuditEngine.ts`) |
| `MTE-REQ-06` | `1.5.4.4.5.1` | Cap. 11.4 | **Trava Legal da Probabilidade**: requisito específico de NR descumprido força probabilidade máxima (`5`) | `evaluateMteProbabilityWithNrLock` (`mteCopsoqAuditEngine.ts`) |
| `MTE-REQ-07` | `1.5.4.4.5.3` & `1.5.5.1.2` | Cap. 11.4.2 e 11.4.4 | Probabilidade ergonômica/psicossocial = **Duração × Intensidade × Eficácia da Hierarquia** (vedado EPI isolado) | `evaluateMteProbabilityWithNrLock` (`mteCopsoqAuditEngine.ts`) |
| `MTE-REQ-08` | `1.5.4.4.2`, `1.5.4.4.2.2` & `1.5.4.4.3` | Cap. 11.5 e 11.6 | Matriz ISO 45002 (`Baixo` a `Muito Alto`) + prazos e critério documentado de risco tolerável | `evaluateMteRiskMatrixIso45002` (`mteCopsoqAuditEngine.ts`) |
| `MTE-REQ-09` | `1.5.4.4.6 ('a'–'f')` & `1.5.4.4.6.1` | Cap. 11.7 | Revisão periódica (**2/3 anos**) + **6 hipóteses de revisão imediata** (incluindo solicitação de trabalhador/CIPA) | `evaluateMteReviewTriggers` (`mteCopsoqAuditEngine.ts`) |
| `MTE-REQ-10` | `1.5.5.1.1` & `1.5.5.2` | Cap. 12.1 e 13.2 | Plano de Ação com cronograma, responsáveis, acompanhamento e aferição de resultados | `src/lib/actions/actionTransitionEngine.ts` |
| `MTE-REQ-11` | `1.5.5.3.1` & `1.5.5.3.2 ('a'–'d')` | Cap. 12.2 | **4 formas de acompanhamento** + indicadores **Proativos e Reativos** + participação da CIPA | `src/lib/controls/controlDivergence.ts` |
| `MTE-REQ-12` | `1.5.7.1`, `1.5.7.3`, `1.5.5.2` & `1.5.4.4.2.2` | Cap. 4 e 13 | Emissão dos **3 Documentos Mínimos do PGR**: Inventário de Riscos, Plano de Ação e Critérios GRO/PGR | `src/lib/documents/documentGenerator.ts` |

---

## 2. Super Prompt de Auditoria Sistêmica (Guia Oficial MTE 2026 + Manual COPSOQ II Portugal 2013)

```markdown
[Modo: MASTER] Justificativa: Auditoria forense e validação determinística de conformidade das funcionalidades do aplicativo frente ao Guia Oficial MTE 2026 (Cap. 1.5 da NR-1 — GRO/PGR) e ao Manual COPSOQ II Portugal 2013 (Versão Curta: 41 questões, 26 subescalas e tercis 2,33 e 3,66).

Você atua como Auditor Forense Chefe da Superinteligência ARC 4.0 e do Colegiado Pós-Doutoral Fable 5. Sua missão é inspecionar o código-fonte do aplicativo sem qualquer alucinação de IA, verificando item a item:

1. AUDITORIA DO INSTRUMENTO DE PESQUISA (MANUAL COPSOQ II PORTUGAL 2013):
   - Verifique em `src/data/copsoqData.ts` e `src/data/instrumentRegistry.ts` se os 41 itens (`I1` a `I41`) estão mapeados nas 26 subescalas e 8 dimensões principais da Tabela 1 (p. 12–13) e Anexo (p. 27–29) do manual.
   - Verifique se o motor de cotação (`evaluateCopsoqTertileBand` e `computeOfficialShortSubscales`) calcula a média aritmética simples (1,00 a 5,00) fator a fator e aplica os pontos de corte em tercis `2,33` e `3,66` segundo a polaridade (`protective` vs. `risk_exposure`).
   - Verifique se o corte estatístico `k >= 5` permanece estritamente imposto no servidor e se `runtimeReady` permanece `false` até o Gate G3.

2. AUDITORIA DAS AÇÕES EXIGIDAS PELO GUIA OFICIAL MTE 2026 (CAP. 1.5 NR-1):
   - Verifique a presença e funcionamento dos 12 requisitos mandatórios (`MTE-REQ-01` a `MTE-REQ-12`):
     * Levantamento preliminar e ação imediata sobre riscos evidentes (`1.5.4.2.1`);
     * Tríade da Identificação de Perigos: perigo/agravos, fontes/circunstâncias e grupo exposto GES/GHE (`1.5.4.3.1`);
     * Integração das 5 áreas da NR-17 + fatores psicossociais via AEP e gatilhos AET (`17.3.2`);
     * Regra de Ouro da Severidade pela consequência de maior magnitude (`1.5.4.4.4.1`);
     * Trava Legal da Probabilidade máxima (`5`) por descumprimento de NR (`1.5.4.4.5.1`) e proibição de EPI isolado como única medida (`1.5.5.1.2`);
     * Revisão periódica (2/3 anos) e os 6 gatilhos de revisão imediata (`1.5.4.4.6 a–f`, incluindo solicitação justificada de trabalhador ou CIPA);
     * 4 formas de acompanhamento (`1.5.5.3.2 a–d`) com indicadores proativos e reativos;
     * Emissão auditável dos 3 documentos mínimos do PGR (Inventário de Riscos, Plano de Ação e Documento de Critérios GRO/PGR).
```

---

## 3. Super Prompt de Melhorias Técnicas Efetivas (Zero Alucinação de IA)

```markdown
[Modo: MASTER] Justificativa: Execução de melhorias técnicas determinísticas sem alucinação de IA para garantir que todas as funcionalidades do aplicativo promovam e exerçam as ações orientadas pelo Guia Oficial MTE 2026 e pelo Manual COPSOQ II Portugal 2013.

DIRETRIZES DE ENGENHARIA DETERMINÍSTICA (ZERO ALUCINAÇÃO DE IA):
1. Proibição Absoluta de Cálculo Normativo ou Psicométrico por LLM:
   - Nenhuma chamada generativa pode calcular médias do COPSOQ II, definir tercis (2,33 / 3,66), atribuir severidade/probabilidade na matriz ISO 45002 ou declarar risco tolerável.
   - Todo cálculo reside em funções puras testadas (`src/data/copsoqData.ts`, `src/lib/governance/mteCopsoqAuditEngine.ts`, `src/lib/risk/criteriaEngine.ts`).
2. Travas Matemáticas Obrigatórias:
   - Severidade (`1.5.4.4.4.1`): `Math.max(...consequenceMagnitudes)` (pior cenário possível).
   - Probabilidade (`1.5.4.4.5.1` e `1.5.4.4.5.3`): se `specificNrRequirementViolated === true`, retornar `probability = 5` e `nrLegalLockApplied = true`; se `highestImplementedControl === "ppe_only"`, emitir `ppeOnlyWarning = true` e vedar redução de probabilidade ergonômica/psicossocial.
   - Gatilhos de Revisão (`1.5.4.4.6 a–f`): acionar `immediateReviewRequired = true` diante de qualquer uma das 6 alíneas legais, destacando a alínea `f` (solicitação justificada de trabalhador ou CIPA).
   - Tercis COPSOQ II (`2,33` e `3,66`): sinalizar `requiresPreventiveAction = true` sempre que `tertileBand !== "verde"`.
3. Verificação Automatizada Obrigatória:
   - Executar `npm run check:type-strictness`, `npx vitest run`, `compile_applet` e `lint_applet` com 100% de aprovação.
```
