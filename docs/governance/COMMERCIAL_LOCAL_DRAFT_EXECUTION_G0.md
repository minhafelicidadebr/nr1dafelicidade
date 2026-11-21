# Execução G0 — rascunho comercial local controlado

## Estado

- Data: 12/07/2026
- Branch: `codex/onda-0-baseline-fidelity-runtime`
- Onda: `Onda 2 — Fast Lane comercial sem dados de trabalhadores`
- Fatia: rascunho local, recibo, expiração individual e exclusão
- Gate: G0/G1 local e sintético; nenhum avanço de gate
- Decisão: CRM remoto, entrega à equipe e agendamento continuam bloqueados

## Problema e resultado operacional

O formulário público armazenava contato B2B em `localStorage`, mas CTAs como “Agendar reunião” podiam sugerir entrega ou agendamento inexistentes. A retenção era aplicada ao envelope: salvar um novo item renovava o envelope e podia prolongar registros antigos além da expiração individual. A jornada também carregava Google Fonts remotamente.

Resultado desta fatia: o usuário prepara um rascunho local minimizado, recebe um comprovante exclusivamente local, vê a data de expiração e pode apagar o item imediatamente. A interface informa antes e depois do salvamento que nada foi enviado à equipe. Itens individualmente expirados são eliminados ao abrir ou salvar; nenhum `fetch`/XHR remoto ocorre na jornada testada.

## Lentes consideradas

- Produto/comercial: preservar aprendizado de ICP e preparação da conversa sem prometer entrega.
- Privacidade/segurança: minimizar campos, limitar retenção, excluir sob controle do usuário e impedir rede remota.
- UX/acessibilidade: tornar próximo passo, foco, nomes acessíveis, sucesso, exclusão e contraste compreensíveis.
- Engenharia/operação: manter política pura em `src/lib`, catálogo versionado em `src/data` e prova cross-browser.

## Alternativas e pontuação

Pontuação de 0 a 10 sob as restrições atuais; valores maiores são melhores. “Risco” representa capacidade de controlar o risco.

| Rota | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Média | Decisão |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| A — rascunho local honesto, recibo e exclusão | 7 | 9 | 9 | 9 | 8 | 7 | 8 | 4 | 9 | 7,8 | escolhida como primeira fatia |
| B — CRM remoto completo agora | 9 | 4 | 3 | 3 | 8 | 8 | 3 | 9 | 3 | 5,6 | bloqueada por DPA, operador e aprovações |
| C — intake totalmente sintético | 4 | 10 | 9 | 10 | 6 | 5 | 9 | 3 | 9 | 7,2 | útil para demo, insuficiente para preparação B2B |
| D — remover/adiar formulário | 1 | 10 | 10 | 10 | 3 | 2 | 10 | 1 | 2 | 5,4 | seguro, mas elimina aprendizado comercial |
| E — comprar/integrar CRM/calendário | 9 | 4 | 4 | 3 | 8 | 7 | 4 | 9 | 4 | 5,8 | futuro após seleção e DPA |
| F — abstração multi-CRM genérica | 4 | 7 | 3 | 6 | 5 | 10 | 2 | 10 | 2 | 5,4 | overengineering neste gate |

## Achados e tratamento

| Prioridade | Problema | Impacto no usuário | Tratamento | Critério de aceite |
|---|---|---|---|---|
| P1 | CTAs sugeriam agendamento enquanto o dado permanecia local | expectativa falsa de entrega e atendimento | trocar por “preparar/salvar rascunho” e avisar limite antes/depois | nenhuma superfície comercial usa “agendar”; estado confirma “não enviado” |
| P1 | envelope podia prolongar item individual expirado | retenção superior ao declarado | validar `expiresAt` por registro e regravar somente ativos | item expirado é removido mesmo com envelope ainda válido |
| P1 | Google Fonts era carregado no shell público | requisição remota e metadados de navegação | remover `@import` remoto e usar fallbacks locais de sistema | teste E2E registra zero `fetch`/XHR remoto |
| P1 | texto auxiliar mobile tinha contraste de 2,66:1 após interação | leitura prejudicada em fonte pequena | remover opacidade adicional do token | axe A/AA sem violações no recibo em mobile |
| P1 | contêineres textuais da Home/NR1 animavam opacidade | contraste variava durante a entrada e movimento persistia no primeiro frame | remover fade de texto/CTA e respeitar `useReducedMotion` para transformações | axe estável nos motores com `prefers-reduced-motion: reduce` |
| P2 | WhatsApp e opt-ins não tinham efeito sem CRM | coleta desnecessária e expectativa de contato | remover campos da UI; novos registros gravam `null`/`false` | payload público não coleta WhatsApp nem preferências de marketing |

## Fluxo implementado

1. A página declara armazenamento local por até 30 dias, ausência de envio e proibição de dados de trabalhadores.
2. O formulário coleta apenas nome, e-mail corporativo, empresa, cargo opcional, faixa de porte e objetivo controlado.
3. O consentimento explícito autoriza somente o rascunho local.
4. O runtime confirma que a política permite `local_queue` e mantém CRM remoto bloqueado.
5. O mecanismo valida catálogo, formato, tamanho, política, recibo e expiração.
6. Registros expirados ou de outra política não entram no novo envelope.
7. O estado de sucesso mostra comprovante e expiração, sem afirmar entrega.
8. A exclusão remove o rascunho pelo comprovante; fila vazia remove a chave local.

Falhas de política, consentimento, armazenamento, identificador seguro ou catálogo impedem o salvamento. O fluxo não possui fallback remoto.

## Arquivos e evidência

- `src/lib/commercial/leadIntakeGovernance.ts`: contrato, validação, status e expiração individual.
- `src/data/g1LeadIntakeGovernance.ts`: catálogo e minimização versionados.
- `src/components/sales/LeadCaptureForm.tsx`: aviso, formulário, recibo e exclusão.
- `src/pages/SalesPage.tsx` e `src/components/sales/*`: CTAs honestos e contraste.
- `src/pages/HomePage.tsx` e `src/pages/NR1CopsoqPage.tsx`: texto/CTAs sem opacidade transitória e transformações condicionadas à redução de movimento.
- `src/index.css`: remoção da fonte pública remota.
- `src/lib/commercial/leadIntakeGovernance.test.ts`: limites e casos adversos.
- `src/test/publicClaimsGuardrail.test.ts`: contrato antiagendamento e antifonte remota.
- `e2e/public-lead-intake.spec.ts`: jornada ponta a ponta nos quatro projetos Playwright.

## Verificações da fatia

| Comando | Resultado |
|---|---|
| `npm test -- src/lib/commercial/leadIntakeGovernance.test.ts src/test/publicClaimsGuardrail.test.ts` | PASS — 2 arquivos; 12 testes |
| `npx playwright test e2e/public-lead-intake.spec.ts` | PASS — 4/4: Chromium desktop/mobile, Firefox e WebKit |
| `npm run test:e2e` | PASS — 45 aprovados; 3 skips intencionais; 48 casos na matriz |
| axe no estado de recibo | PASS — A/AA automatizável, inclusive mobile |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run ci` | PASS — 0 vulnerabilidades; 45 arquivos; 295 testes; build e bundle verdes |

## Limitações e riscos residuais

- O rascunho não chega à equipe, não agenda reunião e não produz lead operacional.
- `localStorage` não é cofre, não sincroniza entre dispositivos e pode ser acessado por scripts da mesma origem; por isso o escopo permanece rascunho B2B temporário e minimizado.
- A importação de Google Fonts ainda existe no fluxo interno de impressão em `src/lib/documents/printView.ts`; não foi acionada pela jornada pública e requer fatia própria antes de uso offline/privado estrito.
- Acessibilidade manual com pessoas, leitores de tela e hardware físico continua pendente conforme `MANUAL_ACCESSIBILITY_PROTOCOL_G0.md`.
- Fornecedor de CRM/calendário, DPA, papéis, descarte remoto, recibo de entrega e capacidade operacional continuam sem aprovação.

## Rollback

Reverter o commit restaura formulário, CTAs, política, fontes e testes anteriores. Não há migration, serviço remoto ou dado de servidor. Rascunhos locais novos podem deixar de ser reconhecidos pela UI revertida; o rollback não deve ser usado para ocultar ou prolongar dados.

## Próximo passo

Formalizar o gate vendor-neutral de entrega comercial: finalidade, fornecedor/suboperadores, DPA, base legal validada, aviso de privacidade, RBAC, retenção/descarte, recibo, incidente, capacidade e aprovação DPO/jurídico/comercial. Somente depois selecionar e ativar CRM/calendário remoto; até lá, manter a interface como rascunho não entregue.
