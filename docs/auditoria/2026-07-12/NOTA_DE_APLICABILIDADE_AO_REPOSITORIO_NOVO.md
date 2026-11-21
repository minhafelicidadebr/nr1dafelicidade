# Nota de aplicabilidade ao repositório novo

## Identificação

- Repositório: `https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol.git`
- Commit de referência antes das alterações locais: `82836479eb01da93ebf48bebb2faf483934d1b13`
- Branch de validação: `codex/onda-0-baseline-fidelity-runtime`
- Data da validação: 12/07/2026
- Origem do baseline: auditoria do projeto `kiro-playbook-nr1-julho-main`, datada de 12/07/2026

## Decisão de adoção

A auditoria é adotada como **baseline histórico e mapa inicial de riscos**, não como prova automática do estado deste repositório. Cada correção depende de reprodução ou evidência direta no código atual. O gate permanece G0/G1 local e sintético; dados reais, campanha real e piloto operacional continuam bloqueados.

## Fidelidade e diferenças conhecidas

A comparação histórica anexada informa 465 arquivos em cada versão, 461 idênticos e quatro modificados. Essa contagem não foi reproduzida nesta validação porque o snapshot integral do projeto original não foi disponibilizado junto ao repositório atual. Os quatro pontos indicados foram inspecionados:

| Arquivo | Estado atual | Evidência | Decisão |
|---|---|---|---|
| `supabase/config.toml` | alterado de forma esperada | `project_id = "gbvsmtnqhsefburjdkdv"` na linha 1 | preservar o identificador novo |
| `index.html` | alterado e com dívida de posicionamento | título e metadados nas linhas 6-7 e 55-58 apresentam a solução como plataforma consolidada | corrigir na Onda 0 de claims |
| `src/hooks/AuthProvider.tsx` | guard parcial confirmado | linhas 7-10 resolvem configuração; linhas 38-43 bloqueiam auth quando ausente | preservar, mas não considerar suficiente isoladamente |
| `src/integrations/supabase/client.ts` | regressão P1 confirmada no commit de referência | as linhas 5-6 consumiam env diretamente e `createClient` era executado no import | restauração local do resolver guardado e teste de regressão |

## Matriz de achados P0/P1

| Achado da auditoria | Estado no novo repositório | Evidência atual | Confiança | Decisão |
|---|---|---|---|---|
| Dados reais bloqueados até G3 | confirmado | `docs/PROJECT_CONSTITUTION.md`; `src/data/runtimePolicy.ts` | alta | manter No-Go |
| Runtime sem env pode falhar antes do guard | confirmado no baseline; corrigido na branch | `src/integrations/supabase/client.ts`; `src/lib/runtime/supabaseConfig.ts` | alta | validar em testes e build |
| Claims “Ciência de Oxford” e “3.000+” | confirmado | `src/pages/HomePage.tsx:108`, `:205`, `:576` | alta | Onda 0; remover associação/chancela não comprovada |
| Claim geral de multa de R$ 100 mil | confirmado | `src/pages/HomePage.tsx:335` | alta | Onda 0; remover ou vincular a cenário jurídico aprovado |
| Marco público “a partir de 2025” | confirmado | `src/pages/HomePage.tsx:374` | alta | Onda 0; alinhar ao registro regulatório vigente |
| Linguagem pública de diagnóstico | confirmado em múltiplas superfícies | `src/pages/HomePage.tsx:159`; `src/components/nr1/FrameworkCanon.tsx:40` | alta | revisar contexto e evitar claim clínico/automático |
| Guardrail de claims não cobre toda superfície pública | confirmado por ocorrência fora do escopo histórico | `index.html:6-7`; ocorrências em HomePage e componentes | média-alta | ampliar teste de claims na Onda 0 |
| Suíte Vitest agregada não determinística | não reproduzido | `npm test` encerrou em 18,8 s; 45/45 arquivos e 291/291 testes passaram | alta | manter o gate agregado no CI |
| Browser E2E e axe ausentes | não verificado nesta etapa | pacote histórico declara ausência | média | inventariar e planejar gate E2E/acessibilidade |
| Tipagem permissiva | confirmado | `tsconfig.app.json`; `eslint.config.js` | alta | dívida P1; endurecimento incremental por fatia |
| Intake comercial somente local | não verificado nesta etapa | achado histórico em `src/components/sales/LeadCaptureForm.tsx` | média | validar antes da Onda 2 |
| Billing/onboarding/analytics inexistentes | não verificado | não faz parte da estabilização inicial | baixa-média | manter como aspiracional até evidência |
| Pacote metodológico canônico pendente | confirmado documentalmente | `docs/PROJECT_CONSTITUTION.md`; `src/data/instrumentMethodologyReadiness.ts` | alta | P0 para qualquer uso real |
| LGPD/DPA, responsáveis e autoridade pendentes | confirmado documentalmente | `src/data/g1DesignPartnerOffer.ts`; registros de gate | média-alta | P0 comercial para piloto real |
| RLS/pgTAP/cross-tenant | evidência histórica local, não reexecutada nesta etapa | `docs/G0_EXECUTION_RECORD.md`; migrations e testes presentes | média | não inferir aprovação atual sem reexecução |
| Observabilidade, incidente e DR | não verificado | pendência declarada no baseline | média | requisito antes de produção |
| Runtime externo de IA, RAG e evals | bloqueado/aspiracional | `src/data/saasMaturityAssessment.ts`; política G0 | alta | manter No-Go |
| Bundle de charts acima de 500 kB | confirmado | build gerou `vendor-charts` com 526,00 kB; orçamento configurado passou | alta | dívida P1 de performance; tratar em fatia separada |
| Testes de teclado, leitor de tela e mobile real | não verificado | ausência declarada no baseline | média | requisito de evidência antes de elevar prontidão |

## Separação de estado

- **Implementado:** guardrails locais, política sintética, resolver de configuração, migrations e testes versionados.
- **Documentado:** resultados históricos de pgTAP, race/recovery, scorecard e decisões de prontidão.
- **Mockado/sintético:** demonstrações e dados permitidos no gate atual.
- **Hardcoded:** claims públicos e alguns metadados ainda exigem correção e governança.
- **Aspiracional:** SaaS self-service, billing, operação repetível, IA/RAG de produção e plataforma premium.
- **Não confirmado:** resultados históricos que não foram reexecutados nesta branch.
- **Contraditório:** prudência interna versus claims públicos de chancela, volume científico, diagnóstico, multa e estágio consolidado.

## Limitações

- O snapshot completo original não estava presente para recomputar hashes e a comparação 465/461.
- Nenhum Supabase remoto foi acessado.
- Nenhuma migration, seed, deploy, push ou coleta de dados foi executada.
- A aprovação metodológica, jurídica, psicométrica e do responsável técnico permanece externa ao código.

## Próxima decisão

Concluir o recibo local de gates desta branch. Depois, executar uma Onda 0 separada para corrigir claims públicos e ampliar seu guardrail automatizado. Não iniciar Onda 2, G3 ou qualquer fluxo com dados reais sem aprovações formais.
