# Onda 1B — Evidência persistente de CI

Data: 17/07/2026

## Objetivo

Preservar os recibos produzidos pelo pipeline depois que o job termina, permitindo que um revisor confira a execução sem depender apenas do status verde do GitHub Actions.

## Evidências geradas

- `artifacts/vitest-repro-results.json`: resultado JSON do runner reprodutível;
- `artifacts/vitest-repro-receipt.json`: SHA, duração, orçamento, timeout, sinal, código de saída e presença do resultado;
- `artifacts/sbom.cdx.json`: SBOM CycloneDX gerado pelo npm;
- `artifacts/build-provenance.json`: provenance não sensível do commit, workflow, runner, versões e hash do lockfile;
- `dist/**`: saída do build verificado;
- `playwright-report/**` e `test-results/**`: relatório, trace, screenshot ou vídeo quando produzidos pelos testes browser.

Os conjuntos são publicados com `actions/upload-artifact` pinada por SHA e retenção de 14 dias. A permissão do workflow permanece `contents: read`; nenhum secret novo é usado.

## Limites

Artifact de CI é evidência de execução, não aprovação de gate, certificação regulatória, SBOM assinado ou attestation SLSA. O provenance registra contexto e integridade do lockfile, mas não afirma identidade criptográfica do runner.

## Critério de aceite

Cada execução do workflow deve manter os checks atuais verdes e, quando houver arquivos produzidos, disponibilizar os artifacts de verificação e browser sem expor secrets. Falhas continuam visíveis no job; o upload `if: always()` apenas preserva o diagnóstico.
