# VERIFICAÇÕES EXECUTADAS

**Ambiente:** Node 22.16.0; npm 10.9.2.

| Comando/ação | Resultado |
|---|---|
| `npm ci --ignore-scripts` | PASS; 646 pacotes; 0 vulnerabilidades |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; 3,07 s |
| `npm run check:bundle` | PASS; 66 chunks; maior 526 kB |
| `npm audit --audit-level=low` | PASS; 0 vulnerabilidades |
| `npm run test` | não encerrou no tempo de auditoria |
| 44 testes executados individualmente | PASS 44/44 |
| Supabase local/pgTAP | não executado nesta auditoria |
| Browser E2E | não disponível/executado |
| Deploy/migration/push | não executados |

## Interpretação

O hang agregado reduz a confiança do gate de CI, mas não autoriza concluir que a suíte falha: todos os arquivos de teste passaram isoladamente. O próximo passo é identificar recursos abertos/concorrência do Vitest e produzir um recibo agregado determinístico.
