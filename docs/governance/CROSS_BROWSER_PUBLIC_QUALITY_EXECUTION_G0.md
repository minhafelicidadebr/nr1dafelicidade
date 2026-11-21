# Execução G0 — qualidade pública cross-browser

## Estado

- Data: 12/07/2026
- Branch: `codex/onda-0-baseline-fidelity-runtime`
- Gate: G0/G1 local e sintético; nenhum avanço de gate
- Motores: Chromium desktop, Chromium mobile, Firefox desktop e WebKit desktop

## Escopo

A mesma matriz pública de runtime, axe, teclado e demonstração sintética foi executada nos motores Chromium, Firefox e WebKit. O job `browser-quality` do GitHub Actions instala os três motores e roda `npm run test:e2e`.

## Resultado

| Projeto | Resultado |
|---|---|
| desktop-chromium | 11 aprovados |
| mobile-chromium | 10 aprovados; 1 skip de reflow |
| desktop-firefox | 10 aprovados; 1 skip de reflow |
| desktop-webkit | 10 aprovados; 1 skip de reflow |
| matriz conjunta | 41 aprovados; 3 skips intencionais |

O contrato de reflow a 320 CSS px é executado uma única vez em Chromium desktop; repeti-lo por motor não agrega evidência proporcional ao custo. Os demais contratos — runtime, axe, skip link e demo sintética — são executados em todos os projetos.

## Particularidade WebKit

Safari/WebKit não inclui links na sequência de Tab por padrão quando a preferência de navegação completa por teclado está desativada. Inserir `tabIndex` positivo nos links alteraria indevidamente a ordem nativa.

Decisão:

- Chromium e Firefox comprovam que o skip link é o primeiro foco por Tab;
- WebKit recebe foco programático no skip link e comprova visibilidade, ativação e transferência ao conteúdo principal;
- a preferência “Press Tab to highlight each item”/Full Keyboard Access deve integrar o roteiro manual em Safari real.

## Infraestrutura alterada

- projetos `desktop-firefox` e `desktop-webkit` em `playwright.config.ts`;
- script local instala Chromium, Firefox e WebKit;
- CI instala os três motores com dependências de sistema;
- nenhuma alteração de UI foi necessária para compatibilidade cross-browser.

## Gates

| Verificação | Resultado |
|---|---|
| `npm run test:e2e` | PASS — 41 aprovados; 3 skips |
| `npm run audit:dependencies` | PASS — 0 vulnerabilidades |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 45/45 arquivos; 292/292 testes |
| `npm run build` | PASS |
| `npm run check:bundle` | PASS |

## Limitações

- WebKit Playwright não substitui Safari em macOS/iOS físico.
- Firefox Playwright não substitui combinações reais com NVDA.
- Axe continua limitado a regras automatizáveis.
- A matriz aumenta o tempo de CI; duração local conjunta foi 3,7 minutos com dois workers.
- Warnings futuros do React Router e de posicionamento Framer Motion permanecem não bloqueantes.

## Próximo passo

Executar o protocolo `MANUAL_ACCESSIBILITY_PROTOCOL_G0.md` e preencher uma cópia datada de `MANUAL_ACCESSIBILITY_EXECUTION_TEMPLATE_G0.md` em NVDA/Chrome, Safari com Full Keyboard Access, zoom real e dispositivo móvel físico. Em paralelo, revisar o próximo bloqueador metodológico sem alterar dados reais.
