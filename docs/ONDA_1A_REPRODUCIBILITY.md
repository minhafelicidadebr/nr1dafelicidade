# Onda 1A — Reproducibility Lab

Data: 16/07/2026

## Decisão

Após o merge do Evidence Control Plane no PR #10, a primeira fatia da Onda 1 fixa o runner Vitest em CI e produz um recibo machine-readable por execução.

O comando canônico é:

```bash
npm run test:repro
```

## Contrato do runner

- pool: `forks`;
- workers: no máximo 2;
- paralelismo entre arquivos: habilitado sob limite fixo;
- timeout por teste: 30 s;
- timeout de hook: 30 s;
- timeout de teardown: 10 s;
- orçamento total padrão: 360 s, sobrescrevível por `VITEST_REPRO_BUDGET_MS`;
- resultado JSON: `artifacts/vitest-repro-results.json`;
- recibo: `artifacts/vitest-repro-receipt.json`;
- artefatos locais são ignorados pelo Git e não contêm dados de trabalhadores.

O script falha se o processo exceder o orçamento, terminar com código diferente de zero ou não puder ser iniciado. O recibo registra SHA, duração, orçamento, timeout, sinal e código de saída.

## Integração

`npm run ci` usa `npm run test:repro`. O comando local `npm test` permanece disponível para iteração rápida e não substitui o recibo canônico; sob contenção Windows, seu timeout padrão de 5 s pode falhar em testes de UI lentos, sem representar falha do contrato CI.

## Limites

Esta fatia não altera banco, migrations, RLS, autenticação, billing, gate, instrumentos ou dados. Ela comprova reprodutibilidade do runner; não comprova ainda strictness global, SBOM/provenance ou estabilidade do banco efêmero.

## Evidência local desta fatia

No commit `cf3e8e8f90a422923a678b9d2bc21dd575b31e64`, duas execuções isoladas passaram com 151,947 ms e 135,647 ms. Uma execução sob maior contenção local exigiu o orçamento de 360 s e passou com 256,570 ms. Duas execuções completas consecutivas de `npm run ci` também passaram, em aproximadamente 280 s e 170 s, incluindo audit, lint, typecheck, build e bundle budget. O ambiente Windows também mantinha processos Vite de dois workspaces ativos; essa variabilidade não deve ser projetada como benchmark do runner Linux no GitHub Actions.

## Critério de aceite desta fatia

Uma execução limpa deve produzir status `passed`, incluir o SHA do commit e terminar dentro do orçamento. A Onda 1 continua em preparação até haver duas execuções consecutivas, evidência de browser/banco agregada e avanço do ratchet de strictness.
