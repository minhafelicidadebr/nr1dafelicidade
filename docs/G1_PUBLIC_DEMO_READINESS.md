# Prontidao de demo publica G1

Data: 30/06/2026

## Objetivo

Separar walkthrough privado sintetico de demonstracao publica externa. A melhoria cria um contrato auditavel para decidir quando a narrativa pode sair do uso interno, sem aprovar G1, sem liberar dados reais e sem prometer SaaS real.

## Decisao Fable 5

Opcoes avaliadas:

- Usar apenas o ensaio de demo sintetica: insuficiente, pois nao separa publico interno, externo, Lovable e revisoes.
- Bloquear qualquer demo ate G3: seguro, mas impede validacao comercial sintetica controlada.
- Criar um contrato especifico de prontidao publica: escolhido por consolidar claims, CI, browser, Lovable e aprovacoes.
- Criar agenda/ata persistida no banco: adiado por exigir schema, RLS, accountables e assinatura.
- Integrar ferramenta externa de demo: fora do escopo G1 local.

## Implementacao

- `src/lib/governance/publicDemoReadiness.ts`
  - avalia runtime, narrativa, evidencia, publicacao, aprovacao e acessibilidade;
  - permite walkthrough privado sintetico se itens internos, CI e claims estiverem seguros;
  - bloqueia demo publica enquanto faltarem Lovable, roteiro externo e revisoes;
  - falha fechado se dados reais ou gate advance forem acionados.
- `src/data/g1PublicDemoReadiness.ts`
  - define a politica `g1-public-demo-readiness-2026-06-30`;
  - registra evidencias atuais e bloqueios externos.
- `src/lib/governance/publicDemoReadiness.test.ts`
  - comprova walkthrough privado sintetico pronto;
  - bloqueia claims/CI/dados reais/gate inseguros;
  - libera demo publica apenas com todos os itens publicos prontos.
- `src/pages/app/GovernancePage.tsx`
  - exibe "Demo publica G1" como card separado do ensaio interno.

## Estado atual

Permitido:

- walkthrough privado sintetico em ambiente controlado;
- narrativa com claims publicos testados;
- fechamento obrigatorio nos bloqueios de Governanca.
- preflight, limites de capacidade e handoff local verificaveis.
- evidencia Playwright cross-browser, teclado, axe, reflow e ausencia de transporte remoto.

Bloqueado:

- demo publica externa;
- apresentacao como SaaS real, G1 aprovado ou conformidade garantida;
- uso de dados reais, trabalhadores reais, campanha real ou runtime produtivo;
- narrativa externa sem Lovable comprovado, roteiro aprovado e revisoes formais.

Concluido localmente, sem liberar demo externa:

- execucao browser em desktop Chromium, mobile Chromium, Firefox e WebKit;
- limites comunicados no cockpit da sessao;
- descarte de preflight, respostas, comprovante, feedback e handoff por reload;
- decision room consolidando seis dimensoes obrigatorias.
- pacote externo versionado com sete limites, perguntas dificeis e stop conditions, pronto apenas para ensaio interno.
- simulador interno de condutas do facilitador, sem efeito sobre aprovacao externa.

## Limites

- Nao aprova G1.
- Nao substitui aceite formal, juridico, SST, DPO, seguranca ou psicometria.
- Não comprova sozinho um baseline Lovable publicado nem o `HEAD` atual.
- Nao habilita dados reais.

## Rollback

Remover `src/lib/governance/publicDemoReadiness.ts`, `src/data/g1PublicDemoReadiness.ts`, `src/lib/governance/publicDemoReadiness.test.ts`, este documento e o card `PublicDemoReadinessCard` em `src/pages/app/GovernancePage.tsx`.
