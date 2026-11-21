# Registro de migração React 19 / React Router 8

**Data:** 2026-07-28
**Branch:** `chore/react-router-8-migration`
**Objetivo:** remover o bloqueio de segurança do `npm audit` sem alterar produção, cobrança, dados reais ou secrets.

## Decisão

Foi criada uma correção separada para atualizar a base de runtime e eliminar a dependência auditada `react-router-dom@7`:

- React e React DOM: `19.2.8`;
- React Router: `8.3.0`, com remoção de `react-router-dom`;
- tipos React/React DOM compatíveis com React 19;
- `react-day-picker` atualizado para a API v9;
- `next-themes` e `vaul` atualizados para compatibilidade com React 19;
- ESLint e toolchain atualizados para a linha compatível com o novo runtime.

O React Router v8 remove o pacote `react-router-dom`; os imports declarativos passam a vir de `react-router`, conforme o changelog e o guia oficial de upgrade:

- https://reactrouter.com/changelog
- https://reactrouter.com/upgrading/v7

## Escopo técnico

Foram migrados os imports de roteamento em páginas, componentes e testes. O calendário foi adaptado à API de ícones do `react-day-picker` v9, e o tipo JSX legado de `CyclesPage` foi substituído por `ReactElement` para os tipos React 19.

As regras novas `react-hooks/set-state-in-effect` e `react-hooks/purity` permanecem desativadas temporariamente para preservar o baseline de lint existente. A correção estrutural desses avisos é dívida técnica separada e não faz parte deste gate de segurança.

## Evidência local

Executados na branch de migração:

| Verificação | Resultado |
| --- | --- |
| `npm ci` | aprovado; instalação limpa |
| `npm audit` | aprovado; 0 vulnerabilidades |
| `npm run lint` | aprovado |
| `npm run typecheck` | aprovado |
| testes direcionados de roteamento | 2 arquivos / 2 testes aprovados |
| `npm run test:repro` | 96 arquivos / 485 testes aprovados |
| `npm run build` | aprovado |
| `npm run check:bundle` | aprovado |
| Playwright Chromium | 13/13 aprovados |
| `npm run ci` | aprovado |

O CI do GitHub ainda é o gate final, especialmente para a matriz de browsers. A execução local não reivindica validação completa de Firefox e WebKit.

## Segurança e rollback

- Nenhum secret, `.env`, service role, migration remota ou dado real foi usado.
- Nenhum deploy ou cobrança live foi habilitado.
- O rollback é não mesclar esta branch/PR; se já integrada, reverter o commit da migração em branch de correção.
- O PR #32 só deve ser mesclado depois que esta correção estiver integrada e todos os checks obrigatórios estiverem verdes.
