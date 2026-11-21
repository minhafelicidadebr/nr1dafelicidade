# Pacote de comprovação do release — baseline GitHub/Lovable

Registro histórico anterior: 18/07/2026

Manifesto: `g1-release-evidence`

Versão histórica anterior: `2026-07-18.3-published-baseline-attestation`

## Resultado atual do baseline publicado

Data da observacao: 20/07/2026

Versao: `2026-07-20.4-current-published-baseline`

O baseline comprovado do repositorio oficial e o merge commit `4a21c1c7eb9f756a216553fd5237809e588f90d9`, produzido pelo PR 21 e integrado em `main` em 19/07/2026.

O GitHub Actions run `29688590447` passou no mesmo SHA para `verify`, `database-security` e `browser-quality`.

O deployment Lovable `1189b130-3df2-4f61-a7c3-7e0e7baca7c9`, identificado pelo header publico `x-deployment-id`, respondeu `200`, carregou `/assets/index-Bbv8MfGR.js` e `/assets/SalesPage-paPN8gWn.js`, apresentou o marcador `DEMONSTRACAO SINTETICA EM VALIDACAO` e passou smoke desktop/mobile sem erros de runtime, overflow ou requisicoes externas de dados. O receipt canonico esta em `docs/release/G1_LOVABLE_DEPLOYMENT_RECEIPT.json`.

Esse resultado atesta pontualmente o baseline tecnico exibido pela demonstracao publica sintetica. Ele nao aprova G1, nao autoriza sessao externa autonoma, nao libera dados reais e nao promove Mercado Pago para producao.

## Resultado historico de 18/07/2026

O baseline comprovado do repositório oficial é o merge commit `9cad61357ca8d380f5a50be40e2abfcacdec709b`, produzido pelo PR 17 e integrado em `main` em 18/07/2026.

O GitHub Actions run `29662898726` passou no mesmo SHA para:

- `verify`;
- `database-security`;
- `browser-quality`.

O deployment histórico Lovable `4501eeed-066a-40f5-9386-aefd498b12e4`, identificado pelo header público `x-deployment-id`, respondeu `200` e passou o smoke anterior. O receipt atual foi atualizado para o deployment posterior; o registro histórico permanece recuperável no histórico Git.

Esse resultado atesta pontualmente o baseline técnico exibido pela demonstração pública sintética no momento observado. Ele não comprova que o `HEAD` atual do GitHub está publicado, não aprova G1, não autoriza sessão externa autônoma, não libera dados reais e não promove Mercado Pago para produção.

## Fonte de verdade machine-readable

`docs/release/G1_RELEASE_EVIDENCE_MANIFEST.json` reúne:

- repositório e branch padrão;
- SHA do baseline publicado e head de origem que o produziu;
- PR, merge commit e data;
- run e jobs de CI vinculados ao mesmo SHA;
- receipt do projeto e deployment Lovable;
- gate aprovado `G0` e gate-alvo `G1`;
- estados de publicação operacional, billing, metodologia e aceite formal;
- provas locais, GitHub e Lovable.

O mecanismo `src/lib/release/releaseEvidenceManifest.ts` valida o manifesto antes de expô-lo à aplicação. O mecanismo `src/lib/release/lovableDeploymentReceipt.ts` falha fechado para divergência de projeto, repositório, branch, SHA, deployment, assets, smoke, gate, dados reais ou billing.

## Estado atual

- 10/11 provas verificadas;
- aplicação, banco e browsers comprovados no merge commit;
- projeto, branch, deployment e marcador específico do release comprovados no Lovable;
- branch protection continua bloqueada para comprovação pela limitação de plano/API do repositório privado;
- gate aprovado: `G0`;
- gate em preparação: `G1`, não aprovado;
- billing: Mercado Pago `sandbox_only`;
- metodologia e aceite formal: bloqueados;
- dados reais: desabilitados;
- publicação operacional externa e sessão autônoma: bloqueadas;
- demonstração pública sintética: publicada e verificada.

## Regras fail-closed

O manifesto ou o receipt são bloqueados se:

- repositório, projeto ou branch divergirem da política;
- merge commit, baseline, CI e receipt apontarem para SHAs diferentes;
- um dos três jobs obrigatórios estiver ausente ou não verde;
- deployment, asset, marcador ou smoke público não puderem ser comprovados;
- G1 for apresentado como aprovado;
- houver tentativa de avanço de gate ou dados reais;
- billing deixar de ser somente sandbox;
- metodologia ou aceite formal forem promovidos sem evidência;
- prova obrigatória estiver ausente ou duplicada.

## Limite temporal

O SHA `9cad613...` é um baseline GitHub/Lovable publicado e atestado em um instante específico, não uma declaração de sincronização contínua ou do `HEAD` atual. Um novo candidato deve produzir novo CI, novo deployment e novo receipt antes de receber sua própria atestação.

## Critérios de aceite desta fatia

- receipt Lovable machine-readable e versionado;
- parser e política separados da configuração de domínio;
- projeto, repositório, branch, deployment e release vinculados;
- app, banco e browsers vinculados ao mesmo SHA;
- manifesto, pacote e atestado de baseline derivados de artefatos versionados;
- UI distingue G0 aprovado de G1 em preparação;
- testes bloqueiam drift, overclaim, dados reais e billing live.

## Rollback

Remover o receipt, seu avaliador, a configuração derivada e restaurar o manifesto e documentos anteriores. O rollback não altera migrations, dados, autenticação, billing, deployment ou gates.
