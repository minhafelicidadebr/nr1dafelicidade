# Jornada regulatoria E2E sintetica - G1

Data: 30/06/2026

## Objetivo

Criar um contrato auditavel para demonstrar a jornada regulatoria local e sintetica sem habilitar dados reais, sem avancar G1 e sem prometer conformidade automatica.

A jornada cobre: empresa -> unidades -> ciclo -> AEP/trabalho real -> AET -> criterios -> riscos -> acoes -> controles -> documentos -> governanca.

## Lentes aplicadas

- SST/ergonomia: questionario nao substitui AEP, AET, observacao do trabalho real ou revisao tecnica.
- Privacidade/LGPD: respostas individuais, identidade, convite e microdados permanecem fora do fluxo organizacional.
- Juridico-regulatorio: documentos e recomendacoes continuam preliminares ate revisao e aceite competente.
- Arquitetura: mecanismo puro em `src/lib`, configuracao de dominio em `src/data`, UI apenas consome o resumo.
- Produto/operacao: a pagina de Governanca mostra a jornada mesmo quando a politica server-side ainda bloqueia processamento real.

## Decisao Tree of Thoughts

Opcoes avaliadas:

- Minimo viavel: checklist manual em documento. Rejeitado por nao criar contrato testavel.
- Robusto: Playwright E2E completo. Adiado porque o snapshot ainda nao tem `.git`/CI oficial e a prioridade atual e travar o contrato.
- Simular/prototipar: avaliador puro + dados versionados + UI de governanca. Escolhido.
- Adiar: manter Action 23 parcial. Rejeitado porque a lacuna ja estava registrada no plano.
- Comprar/integrar: ferramenta externa de E2E. Fora de escopo local G1.
- Abstrair: contrato generico de jornada. Parcialmente adotado com tipos reutilizaveis.

Decisao adotada: implementar contrato sintetico deterministico, testado por unidade e exibido na Governanca.

## Implementacao

- `src/lib/governance/regulatoryJourney.ts`
  - avalia passos, rotas, ordem, duplicidade, evidencias, cobertura de invariantes e tentativa indevida de avanco de gate;
  - bloqueia passos que nao sejam explicitamente sinteticos;
  - exige rota terminal de governanca como ultimo passo.
- `src/data/regulatoryJourney.ts`
  - define politica `regulatory-journey-g1-2026-06-30`;
  - versiona a ordem da jornada e os invariantes obrigatorios.
- `src/lib/governance/regulatoryJourney.test.ts`
  - comprova contrato pronto para demonstracao sintetica;
  - bloqueia perda de invariante critico;
  - bloqueia rota duplicada, dependencia nao sintetica e alegacao de avanco de gate;
  - verifica alinhamento estatico com as rotas declaradas em `src/App.tsx`.
- `src/pages/app/GovernancePage.tsx`
  - exibe o resumo da jornada antes do status server-side;
  - mantem texto explicito de No-Go para dados reais e G1.

## Invariantes cobertos

- G0/G1 local e sintetico.
- Dados reais bloqueados.
- Sem acesso organizacional a resposta individual.
- Sem correlacao identidade-convite-resposta.
- `k >= 5`.
- Instrumento versionado.
- Trabalho real/AEP/AET nao substituidos por questionario.
- Participacao de trabalhadores rastreavel como evidencia.
- Formula e premissas de risco auditaveis.
- Acoes com evidencia, KPI e revisao.
- Controles com evidencia antes de qualquer revisao residual.
- Documentos preliminares ate revisao competente.
- Gate de fontes obrigatorio.
- Sem avanco de gate sem aceite formal.

## Limites

- Nao executa browser E2E real.
- Não comprova sozinho GitHub Actions, branch protection, histórico Git ou um baseline Lovable publicado.
- Nao libera campanha real, trabalhador real, IA remota, dados reais ou producao.
- Nao substitui revisoes independentes de SST, ergonomia, metodologia, DPO/juridico ou seguranca.

## Criterios de aceite

- Contrato sintetico avalia como pronto apenas com todos os invariantes cobertos.
- Qualquer rota duplicada, ordem quebrada, invariante ausente, dependencia nao sintetica ou alegacao de gate bloqueia a jornada.
- A Governanca mostra o contrato sem esconder os bloqueios server-side.
- Teste especifico e typecheck passam.

## Validacao local

- ESLint: aprovado.
- TypeScript: aprovado.
- Vitest: 20 arquivos e 161 testes aprovados.
- Auditoria npm: zero vulnerabilidades em `npm audit --audit-level=low`.
- Build de producao: aprovado.
- Orcamento de bundle: aprovado, 64 chunks, maior chunk `vendor-pdf-Cxd_NDhN.js` com 400,68 kB.

## Rollback

Remover `src/data/regulatoryJourney.ts`, `src/lib/governance/regulatoryJourney.ts`, `src/lib/governance/regulatoryJourney.test.ts` e o cartao de jornada em `src/pages/app/GovernancePage.tsx`.
