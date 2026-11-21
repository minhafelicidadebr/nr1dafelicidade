# Manifesto canonico do pacote - G1

Data: 30/06/2026

## Objetivo

Adicionar uma camada entre o intake canonico e a prontidao metodologica: um manifesto verificavel do pacote recebido. O manifesto registra identificador, versao, artefatos, hashes SHA-256, owners, status, evidencias e dependencias antes de qualquer modelagem de subescala, scoring ou fixture.

## Decisao Fable 5

Opcoes avaliadas:

- Receber arquivos soltos e revisar manualmente: rejeitado por baixa rastreabilidade e risco de troca silenciosa de artefatos.
- Selar automaticamente qualquer pacote submetido: rejeitado porque G1 ainda exige fonte, licenca, revisao e aprovacao formal.
- Criar contrato puro de manifesto: escolhido por transformar completude, integridade e dependencia em criterio testavel sem interpretar conteudo psicometrico.
- Persistir manifesto no banco agora: adiado por exigir schema, RLS, assinaturas, accountables e trilha server-side.
- Integrar ferramenta documental externa: fora do escopo desta fatia local.

## Implementacao

- `src/lib/instruments/canonicalPackageManifest.ts`
  - avalia manifesto, versao semantica, instrumento alvo e lista de artefatos;
  - exige todos os artefatos obrigatorios listados, submetidos, com owner e SHA-256 valido para revisao;
  - exige todos os artefatos obrigatorios aprovados para selagem;
  - bloqueia chaves duplicadas, dependencias inexistentes e dependencia direta em si mesmo;
  - falha fechado se runtime, dados reais ou gate advance forem acionados.
- `src/data/g1CanonicalPackageManifest.ts`
  - define a politica `canonical-package-manifest-g1-2026-06-30`;
  - registra o estado atual do pacote G1 como bloqueado, com apenas limitacoes de uso submetidas.
- `src/lib/instruments/canonicalPackageManifest.test.ts`
  - comprova bloqueio atual;
  - abre revisao apenas com artefatos obrigatorios submetidos, hash e owner;
  - sela o manifesto apenas com todos os artefatos aprovados;
  - bloqueia dependencias invalidas, duplicidade, runtime, dados reais e gate inseguro.
- `src/pages/NR1CopsoqPage.tsx`
  - exibe o card "Manifesto do pacote canonico" entre intake e prontidao metodologica.

## Estado atual

Bloqueado:

- manual/fonte primaria canonica;
- licenca e permissao de uso;
- banco canonico de itens;
- escala de resposta e ausentes;
- mapa de 26 subescalas;
- scoring original;
- fixtures psicometricas independentes;
- pacote para revisao independente.

Preservado:

- nenhuma subescala, item, cutoff, formula ou fixture foi inventada;
- runtime do instrumento permanece bloqueado;
- dados reais e campanhas reais continuam No-Go;
- G1 nao foi aprovado nem promovido.

## Limites

- O manifesto valida integridade documental, nao validade psicometrica.
- Nao substitui fonte primaria, licenca, parecer metodologico, revisao SST, DPO, juridico ou seguranca.
- Nao cria scoring server-side nem autoriza campanha.
- Nao avanca G1.

## Rollback

Remover `src/lib/instruments/canonicalPackageManifest.ts`, `src/data/g1CanonicalPackageManifest.ts`, `src/lib/instruments/canonicalPackageManifest.test.ts`, este documento e o card `CanonicalPackageManifestCard` em `src/pages/NR1CopsoqPage.tsx`.
