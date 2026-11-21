# Onda 1P — Contrato tipado de saída PDF

## Objetivo

Eliminar os casts `any` do gerador local de PDF e preservar a saída pedagógica como material preliminar, sem alterar a rota de IA, prompts, dados, permissões, billing ou publicação.

## Decisão

O jsPDF instalado expõe `GState` como classe pública. A onda usa essa API diretamente para a transparência da capa.

- Mínimo viável — manter casts locais: rejeitado, pois a API pública já existe.
- Robusto — usar `GState` tipado e restringir o tipo de PDF a `technical | poetic`: adotado.
- Simular — validar apenas o typecheck: rejeitado; a geração efetiva também é coberta por teste.
- Adiar — manter os casts como dívida: rejeitado por estar no caminho de uma saída documental.
- Comprar/integrar — trocar a biblioteca de PDF: adiado; não há falha funcional que justifique ampliar o risco.
- Abstrair — criar um motor genérico de documentos: adiado até haver mais de um consumidor real.

## Implementado

- `PDFType` unifica o contrato dos formatos técnico e poético.
- `buildPDF` usa `new GState({ opacity })`, sem casts de instância.
- `buildPDF` é exportado para teste do mecanismo local.
- O teste verifica os dois formatos, capa e página de conteúdo, cabeçalho `%PDF-` e saída não vazia.

## Guardrails preservados

- O PDF técnico continua sendo uma trilha sintética, preliminar e sujeita a revisão técnica; não é laudo, diagnóstico ou certificação.
- A rota `generate-pdf` permanece protegida por autenticação, quota e validação de payload existentes; prompts, modelo, fallback local e logs não foram alterados.
- Nenhum dado real, resposta individual, RLS, migration, secret, service role ou configuração de ambiente foi modificado.
- A auditoria do escopo confirmou `.env`/`.env.*` ignorados, `.env.example` existente e nenhuma referência a service role no componente.

## Critério de aceite

- `PDFGenerator.tsx` sem `any` explícito.
- Teste dos formatos técnico e poético verde.
- Typecheck, lint, build, baseline de strictness e auditoria da nova PR verdes.

## Risco residual e rollback

- A tipagem interna de `setGState` na dependência ainda é ampla, mas o aplicativo não usa mais casts nem APIs privadas.
- A qualidade factual de conteúdo gerado remotamente continua sendo risco de governança da rota de IA e não foi alterada nesta onda.
- Rollback é um único commit; nenhum formato persistido ou serviço externo foi modificado.
