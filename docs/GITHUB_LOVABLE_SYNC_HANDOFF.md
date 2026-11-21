# Handoff GitHub / Lovable — G1

## Objetivo

Registrar uma atestação pontual e verificável entre repositório oficial, merge aprovado, CI pós-merge, projeto Lovable e demonstração pública sintética, sem alegar sincronização contínua e sem converter release técnico em aprovação de gate.

## Atualizacao tecnica observada em 19/07/2026

- `main` atual: merge commit `4a21c1c7eb9f756a216553fd5237809e588f90d9`;
- PRs `#20` e `#21` foram integrados depois da validacao dos gates tecnicos;
- CI pos-merge atual: run `29688590447`, com `verify`, `database-security` e `browser-quality` verdes;
- essa evidencia confirma o estado tecnico atual do repositorio, nao uma nova publicacao no Lovable;
- o receipt do Lovable agora aponta para o baseline publicado `4a21c1c7eb9f756a216553fd5237809e588f90d9` e deployment `1189b130-3df2-4f61-a7c3-7e0e7baca7c9`.

Consequencia operacional: para apresentar as correcoes atuais de contraste como demonstracao publica, ainda e necessario publicar novamente no Lovable, executar o smoke e emitir um novo receipt. O drift entre GitHub e Lovable permanece explicitamente registrado.

## Atualizacao pos-publicacao observada em 20/07/2026

- URL publica respondeu `200`;
- novo deployment observado no header `x-deployment-id`: `1189b130-3df2-4f61-a7c3-7e0e7baca7c9`;
- smoke desktop e mobile passou nas rotas `/`, `/planos` e `/nr1-copsoq`, sem erro de runtime ou overflow horizontal;
- intake comercial salvou e excluiu o rascunho local, sem requisicoes `fetch`/`xhr` externas;
- demo NR-1/COPSOQ concluiu 28 respostas, gerou comprovante local e descartou o resultado apos reload, sem requisicoes `fetch`/`xhr` externas;
- o receipt canonico foi atualizado para este deployment e o baseline anterior permanece recuperavel pelo historico Git.

Esta observacao confirma a disponibilidade publica da demonstracao sintética, mas nao altera `G1_APPROVED`, nao habilita dados reais e nao representa aprovacao de gate.

## Estado observado em 18/07/2026

- repositório oficial: `minhafelicidadebr/playbook-nr1-chagpt-sol`;
- branch padrão e branch conectada no Lovable: `main`;
- projeto Lovable: `79e57053-adad-43fa-bb52-3e25ce21dbff`;
- baseline comprovado: `9cad61357ca8d380f5a50be40e2abfcacdec709b`;
- integração: PR 17, merge commit `9cad613...`;
- GitHub Actions: run `29662898726`, com `verify`, `database-security` e `browser-quality` verdes;
- deployment Lovable: `4501eeed-066a-40f5-9386-aefd498b12e4`, observado no header `x-deployment-id`;
- URL pública: `https://playbook-nr1-chagpt-sol.lovable.app/`;
- smoke público: desktop e mobile aprovados, sem erro de runtime, asset quebrado, overflow ou requisição externa de dados;
- receipt: `docs/release/G1_LOVABLE_DEPLOYMENT_RECEIPT.json`.

## Decisão Fable 5

Alternativas consideradas:

- confiar apenas em captura de tela: rejeitado como prova canônica;
- marcar Lovable como continuamente sincronizado ou inferir o `HEAD` atual: rejeitado;
- registrar receipt versionado com projeto, repositório, branch, deployment, assets, marcador e smoke: escolhido;
- tratar o release como aprovação G1: proibido;
- habilitar dados reais ou billing live: proibido.

## Implementação

- `src/lib/release/lovableDeploymentReceipt.ts`
  - valida identidade, vínculo, SHA, deployment, assets, smoke e boundaries;
  - falha fechado para divergência ou escalonamento de gate/dados.
- `src/data/g1LovableDeploymentReceipt.ts`
  - configura a política do projeto e baseline observados.
- `docs/release/G1_LOVABLE_DEPLOYMENT_RECEIPT.json`
  - registra a evidência machine-readable.
- `docs/release/G1_RELEASE_EVIDENCE_MANIFEST.json`
  - deriva as provas GitHub/Lovable do mesmo baseline publicado, sem representar o `HEAD` remoto atual.

## Estado de prontidão

Verificado:

- repositório e remoto oficiais;
- working tree e escopo do PR;
- CI local proporcional;
- CI oficial de aplicação, banco e browser;
- merge em `main`;
- projeto Lovable vinculado;
- baseline publicado e smoke público.

Bloqueado:

- branch protection nativa, indisponível para comprovação pela limitação de plano/API;
- aprovação G1;
- metodologia e licença;
- aceite formal e accountabilities;
- dados reais, campanhas reais e operação autônoma;
- Mercado Pago live.

## Critérios de aceite

- todas as provas vinculadas ao baseline apontam para o mesmo SHA;
- novo baseline exige novo CI, novo deployment e novo receipt;
- branch protection não é inferida a partir de merge manual;
- publicação sintética não é descrita como operação SaaS real;
- G0, billing sandbox e No-Go de dados reais permanecem explícitos;
- drift entre manifesto, receipt e documentação quebra os testes.

## Limites

- O receipt comprova a observação técnica do deployment e do fluxo público, não a configuração interna completa da infraestrutura Lovable.
- O receipt não é um monitor de sincronização e não comprova que commits posteriores em `main` estejam publicados.
- O marcador específico do release reforça o vínculo operacional, mas não substitui assinatura criptográfica do fornecedor.
- O handoff não substitui revisão independente, aprovação formal, branch protection ou decisão de gate.
- O handoff não autoriza dados reais, campanha real, trabalhador real, billing live ou runtime produtivo.

## Próximo controle

Resolver branch protection por recurso suportado ou controle equivalente verificável. Em paralelo, manter as decisões externas de metodologia, jurídico, privacidade e accountabilities separadas do release técnico.
