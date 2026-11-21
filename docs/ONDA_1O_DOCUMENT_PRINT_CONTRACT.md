# Onda 1O — Contrato seguro de impressão documental

## Objetivo

Fechar a fronteira entre o JSONB persistido em `documents.content` e a visualização de impressão, eliminando os dois `any` explícitos de `printView.ts` sem modificar schema, RLS, geração, hash, versionamento ou assinatura técnica.

## Decisão

Foi adotado um normalizador central que aceita conteúdo desconhecido e entrega somente `markdown` e os metadados necessários à capa do documento.

- Mínimo viável — substituir `any` por `unknown` e usar casts no consumidor: rejeitado, pois manteria a suposição cega sobre JSONB.
- Robusto — validar e converter os campos permitidos na fronteira de impressão: adotado.
- Simular — manter a tipagem somente em teste: rejeitado, pois não protege chamadas futuras em runtime.
- Adiar — deixar o adaptador como dívida conhecida: rejeitado, pois ele já fica no caminho de um documento auditável.
- Comprar/integrar — trocar o renderer Markdown: adiado; ampliaria comportamento e superfície de revisão sem necessidade desta fatia.
- Abstrair — criar um mecanismo genérico de serialização documental: adiado até existir outro consumidor real.

## Implementado

- `DocumentPrintView`, `DocumentPrintPayload` e `DocumentPrintMetadata` definem o contrato público do adaptador.
- `normalizeDocumentPrintPayload` aceita JSONB desconhecido e preserva somente markdown e os campos de capa esperados: versão, k-anonimato, organização, setor, porte, ciclo, horizonte, data de geração e versão de critérios.
- Estruturas inválidas, arrays, números em texto e inteiros inválidos falham para valores neutros; nada é convertido por coerção implícita.
- O campo auxiliar `data` continua persistido quando existir, mas não é transportado para a saída de impressão porque ela não o utiliza.
- O renderer escapa aspas simples e duplas e aceita links apenas com `https`, `http`, `mailto`, caminho relativo ou âncora. Protocolos não permitidos recebem `href="#"`.
- `DocumentsPage` delega a normalização ao módulo de impressão, eliminando duplicação de tipos locais.

## Guardrails preservados

- A visualização permanece um documento preliminar e não substitui revisão/assinatura por responsável competente.
- Nenhuma migration, policy, RLS, RPC, Edge Function, hash, storage, configuração de ambiente ou dado real foi alterado.
- A leitura e escrita continuam submetidas às policies e ao trigger de imutabilidade existentes no banco; esta onda não as reconfigura nem as certifica remotamente.
- Não foram encontrados secrets, service role ou cabeçalhos de autorização no escopo alterado. `.env` e `.env.*` permanecem ignorados e `.env.example` existe.

## Evidência e aceite

- `printView.ts` e `DocumentsPage.tsx` sem `any` explícito.
- Testes verificam payload válido, JSONB malformado e links inseguros.
- Typecheck, lint, testes documentais, baseline de strictness e auditoria de escopo devem permanecer verdes.

## Risco residual e rollback

- O renderer continua propositalmente limitado ao subconjunto Markdown já emitido pelo gerador existente; troca de biblioteca ou ampliação de Markdown exige onda própria.
- As regras remotas de RLS permanecem fora do escopo e requerem auditoria de banco separada.
- Rollback é reversível por commit: o conteúdo persistido e o contrato de geração não foram modificados.
