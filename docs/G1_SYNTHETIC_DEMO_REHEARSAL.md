# Ensaio de demonstracao sintetica G1

Data: 30/06/2026

## Objetivo

Criar um roteiro operacional verificavel para demonstrar o app em modo sintetico sem habilitar dados reais, sem aprovar G1 e sem prometer SaaS real. A demo deve mostrar a tese medir -> contextualizar -> avaliar -> agir -> evidenciar -> reavaliar, terminando nos bloqueios de governanca.

## Decisao Fable 5

Opcoes avaliadas:

- Fazer demo livre sem roteiro: rejeitado por risco de overclaim.
- Gravar Playwright/browser E2E agora: adiado ate CI oficial e ambiente Lovable estarem comprovados.
- Criar contrato de ensaio interno + evidencias pendentes para demo externa: escolhido.
- Persistir agenda/ata de demo no banco: adiado por exigir schema e accountables.
- Integrar ferramenta externa de demo: fora do escopo G1.

## Implementacao

- `src/lib/governance/demoRehearsal.ts`
  - avalia preflight, narrativa, navegacao, evidencias, limites e handoff;
  - permite ensaio interno sintetico quando os itens obrigatorios internos estao prontos;
  - bloqueia demo externa enquanto faltarem Lovable preview e pacote de audiencia externa;
  - falha fechado se dados reais forem habilitados ou se houver alegacao de avanco de gate.
- `src/data/g1DemoRehearsal.ts`
  - define a politica `g1-demo-rehearsal-2026-06-30`;
  - registra itens atuais de ensaio interno e bloqueios de demo externa.
- `src/lib/governance/demoRehearsal.test.ts`
  - comprova ensaio interno pronto;
  - bloqueia preflight ausente;
  - bloqueia dados reais e gate advance;
  - comprova demo externa somente com todas as evidencias.
- `src/pages/app/GovernancePage.tsx`
  - exibe "Ensaio demo G1" na Governanca.

## Roteiro permitido

1. Abrir com runtime G0/G1 sintetico e No-Go de dados reais.
2. Explicar que o app esta em fundacao/MVP sintetico, nao SaaS real.
3. Navegar empresa -> unidades -> ciclos -> trabalho real/AEP -> AET -> criterios -> risco -> acoes -> controles -> documentos -> governanca.
4. Mostrar bloqueio metodologico do instrumento.
5. Encerrar em Governanca com maturidade, dossie G1, aceite formal, GitHub/Lovable e submissao G2.
6. Registrar pendencias antes de qualquer demo externa.

## Estado atual

Pronto para ensaio interno sintetico:

- runtime sintetico;
- narrativa sem overclaim;
- contrato de rotas;
- bloqueio metodologico explicado;
- fechamento em Governanca.
- cenarios sinteticos deterministicos e runbook de recuperacao.
- cockpit de preflight, capacidade e handoff local fail-closed.
- pacote de audiencia externa estruturado para ensaio interno, ainda sem aprovacao de uso externo.
- simulador do facilitador concluivel em memoria, sem nomeacao ou certificacao.

Evidencia browser local concluida:

- Playwright executa a jornada sintetica em Chromium, Firefox e WebKit;
- o resultado gera comprovante somente em memoria, sem respostas brutas;
- o reload elimina preflight, resultado, comprovante, feedback e handoff;
- nenhum `fetch`/XHR remoto recebe dados da jornada testada.

Ainda bloqueado para demo externa:

- preview Lovable comprovado;
- pacote de audiencia externa aprovado por responsaveis.

## Limites

- Nao aprova G1.
- Nao libera dados reais.
- Não substitui browser E2E, atestado pontual do baseline Lovable, CI oficial ou aceite formal.
- Nao autoriza apresentacao externa como SaaS real.

## Rollback

Remover `src/lib/governance/demoRehearsal.ts`, `src/data/g1DemoRehearsal.ts`, `src/lib/governance/demoRehearsal.test.ts` e o card `DemoRehearsalCard` em `src/pages/app/GovernancePage.tsx`.
