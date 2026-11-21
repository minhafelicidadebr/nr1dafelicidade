# Onda 1N — Contrato tipado de documentos

## Objetivo

Reduzir a superfície de `any` explícito em `DocumentsPage.tsx` sem alterar schema, migrations, RLS, RPCs, storage ou o fluxo de assinatura técnica.

## Implementado

- `Organization`, `DocumentRecord`, `DocumentUpdate`, `CycleSummary`, `ActionItem`, `OrgControl` e `ControlCatalogSummary` passaram a derivar de `Database` gerado pelo Supabase.
- O agrupamento de documentos usa `DocumentRecord[]`, preservando ciclo, tipo, versão, hash e metadados de assinatura como campos conhecidos.
- O JSONB de `documents.content` é normalizado antes de download e preview. Conteúdo não-objeto ou sem `markdown` resulta em markdown vazio, evitando acesso cego a propriedades.
- A atualização de assinatura usa exclusivamente `documents.Update` e limita o payload aos campos `revisao_por`, `assinado_em` e `signature_note`.
- Os registros de ações e controles usados no cálculo de prontidão são transportados com os tipos gerados do banco.

## Guardrails preservados

- Nenhuma migration, policy, RPC, trigger ou configuração de ambiente foi alterada nesta onda.
- A tela continua consumindo o banco pelo cliente Supabase existente; não foram introduzidos secrets, dados reais, bypass de RLS ou escrita fora do fluxo já existente.
- A assinatura visual continua sendo uma revisão técnica do documento; tipar o payload não transforma o rascunho em documento normativo nem substitui aprovação formal.

## Evidência de fronteira de dados

As migrations existentes mantêm leitura de documentos restrita a membros da organização e criação/atualização restritas a gestores, além do trigger de imutabilidade para campos documentais. Esta onda não revalida essas regras remotamente nem as modifica; o risco residual permanece como item de auditoria de banco para uma onda própria.

## Fora do escopo

- Os dois `any` remanescentes em `src/lib/documents/printView.ts` continuam no baseline e não foram alterados, para evitar misturar o adaptador de impressão com esta fatia.
- Não houve alteração de formato persistido, cálculo de hash, versionamento, assinatura, políticas RLS ou publicação produtiva.

## Critério de aceite

- `DocumentsPage.tsx` sem `any` explícito.
- Typecheck e lint verdes.
- Testes documentais existentes verdes.
- Baseline e manifesto de escopo atualizados sem ampliar o escopo da Draft PR.
