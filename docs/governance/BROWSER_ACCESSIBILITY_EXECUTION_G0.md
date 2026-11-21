# Execução G0 — browser smoke e acessibilidade pública

## Estado

- Data: 12/07/2026
- Branch: `codex/onda-0-baseline-fidelity-runtime`
- Escopo: Home, Sales e NR1/COPSOQ públicas
- Navegador: Chromium desktop e emulação Pixel 7
- Gate: G0/G1 local e sintético; nenhum avanço de gate

## Decisão

Adotar Playwright e axe como gate reproduzível das jornadas públicas. A matriz executa:

- carregamento da rota e visibilidade do título principal;
- presença de copy coerente com demonstração sintética/prontidão;
- ausência de erros de runtime enviados a `pageerror` ou `console.error`;
- ausência de overflow horizontal do documento;
- regras automatizáveis WCAG 2.0/2.1 A e AA via axe.

O teste usa `prefers-reduced-motion: reduce`, locale `pt-BR` e dois projetos Chromium. Relatórios, traces, vídeos e screenshots são gerados apenas como artefatos locais de falha e permanecem ignorados pelo Git.

## Problemas reproduzidos e corrigidos

| Problema | Impacto | Correção |
|---|---|---|
| `fetchPriority` inválido na imagem hero | erro React no console | atributo incompatível removido |
| `AnimatePresence mode="popLayout"` sobre componente sem `forwardRef` | erro React no fluxo NR1 | modo removido, mantendo animação padrão |
| ranges da calculadora sem associação de label | controle sem nome acessível | `id` e `htmlFor` determinísticos |
| selects comerciais sem nome | controle crítico sem nome acessível | `aria-label` explícito |
| contraste insuficiente em tema escuro | leitura prejudicada, WCAG 1.4.3 | tokens `destructive`, `primary-foreground` e textos deep ajustados |
| texto ativo com opacidade reduzida | contraste insuficiente | opacidade removida |
| tabela horizontal móvel não focável | teclado não alcançava região rolável | região nomeada com `role`, `aria-label` e `tabIndex=0` |

## Infraestrutura

- `@playwright/test` e `@axe-core/playwright` como dependências de desenvolvimento;
- `playwright.config.ts` com desktop/mobile, traces e artefatos de falha;
- `e2e/public-routes.spec.ts` como contrato das três rotas;
- scripts `test:e2e` e `test:e2e:install`;
- job `browser-quality` no GitHub Actions com Chromium e dependências de sistema.

## Verificações

| Comando | Resultado |
|---|---|
| `npm run test:e2e` | PASS — 12/12 |
| `npm run audit:dependencies` | PASS — 0 vulnerabilidades |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 45/45 arquivos; 292/292 testes |
| `npm run build` | PASS |
| `npm run check:bundle` | PASS — 66 chunks; maior 526,00 kB |

## Limitações

- Axe comprova apenas regras automatizáveis; não substitui leitor de tela, teclado manual, zoom, contraste perceptual ou teste com usuários.
- A emulação móvel não substitui dispositivo físico.
- Firefox e WebKit não fazem parte desta primeira fatia.
- Fluxos autenticados, formulários submetidos e jornada completa de demo não estão cobertos.
- O servidor Vite ainda emite warnings não bloqueantes sobre flags futuras do React Router e posicionamento de contêiner no Framer Motion.
- A alteração de tokens melhora os temas testados, mas telas autenticadas ainda exigem regressão visual própria.

## Rollback

Reverter o commit remove configuração, job de CI, testes e correções associadas. Artefatos locais podem ser apagados sem impacto porque estão ignorados.

## Próximo passo

Executar uma revisão manual de teclado, foco, leitor de tela e zoom nas três rotas; depois ampliar Playwright para a interação sintética NR1/COPSOQ sem enviar dados.
