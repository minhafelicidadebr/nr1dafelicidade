# Execução G0 — teclado, reflow e demo sintética

## Estado

- Data: 12/07/2026
- Branch: `codex/onda-0-baseline-fidelity-runtime`
- Escopo: Home, Sales e NR1/COPSOQ públicas
- Gate: G0/G1 local e sintético; nenhum avanço de gate

## Resultado operacional

As três jornadas públicas agora possuem contrato automatizado de entrada por teclado e skip link. A demonstração NR1/COPSOQ pode ser preenchida e concluída por teclado em desktop e mobile, produz resultado explicitamente sintético, não envia `fetch` ou XHR remoto e descarta as respostas após reload.

## Decisão de teste

- Skip link: primeiro foco da página, visível ao receber foco e capaz de mover foco ao `main`.
- Reflow: viewport de 320 CSS px sem rolagem horizontal do documento. Esse método preserva media queries e representa o contrato WCAG de reflow, evitando o falso resultado produzido por CSS `zoom`.
- Demo: início por Enter, seleção por Space, estado `aria-pressed`, submit por Enter, resultado sintético e reset por reload.
- Rede: qualquer `fetch`/XHR fora de `127.0.0.1` reprova o fluxo.

## Alterações de interface

- `main#main-content` recebeu `tabIndex=-1` para ser destino real do skip link.
- Cada pergunta da demo recebeu grupo acessível nomeado pelo enunciado.
- Cada opção expõe nome completo e estado selecionado com `aria-pressed`.

## Evidência

| Verificação | Resultado |
|---|---|
| matriz Playwright desktop/mobile | PASS — 21 aprovados; 1 skip intencional |
| repetição do reflow a 320 CSS px | PASS — 3/3 |
| demo sintética por teclado | PASS em desktop e mobile |
| requisição remota de dados na demo | nenhuma |
| descarte após reload | confirmado |
| `npm run audit:dependencies` | PASS — 0 vulnerabilidades |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 45/45 arquivos; 292/292 testes |
| `npm run build` | PASS |
| `npm run check:bundle` | PASS |

## Limitações

- O teste usa foco programático nas opções para validar ativação por teclado sem executar centenas de Tabs; uma auditoria manual deve avaliar esforço e ordem completa de tabulação.
- Automação semântica não substitui NVDA, JAWS, VoiceOver ou TalkBack com usuário humano.
- Não houve teste em dispositivo físico, alto contraste do sistema, ampliação de texto isolada ou controle por voz.
- A demo continua exploratória: não valida instrumento, licença, scoring, cutoffs ou uso em GRO/PGR real.
- Warnings futuros do React Router e de posicionamento do Framer Motion permanecem não bloqueantes e registrados.

## Rollback

Reverter o commit remove os contratos e a semântica adicionada. Nenhum dado, migration ou serviço externo é afetado.

## Próximo passo

O protocolo controlado e o formulário ainda não executado estão disponíveis em `MANUAL_ACCESSIBILITY_PROTOCOL_G0.md` e `MANUAL_ACCESSIBILITY_EXECUTION_TEMPLATE_G0.md`. Executá-los com pessoas e hardware reais; depois, priorizar os requisitos metodológicos e jurídicos ainda bloqueantes, sem iniciar dados reais.
