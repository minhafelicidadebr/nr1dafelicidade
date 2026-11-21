# Modelos orientativos parametrizados - G1

Data: 03/07/2026

## Escopo

Primeira fatia da integracao de virtudes do NCOPSII ao planejamento atual: transformar modelos orientativos em downloads parametrizados na pagina de Documentos, sem schema novo, sem Edge Function, sem IA remota, sem dados reais e sem avancar gate.

Modelos cobertos:

- aviso de participacao e privacidade;
- comunicado aos trabalhadores;
- texto-modelo para PGR;
- controles implantados.

## Decisao Fable 5

Problema: os modelos externos tinham valor operacional, mas alguns textos poderiam ser lidos como laudo pronto, conformidade automatica, anonimato absoluto ou reducao automatica de risco por controle declarado.

Alternativas consideradas:

- copiar os documentos externos como anexos estaticos: rejeitado por carregar overclaims e nao usar contexto do app;
- gerar documentos oficiais persistidos no banco: adiado por exigir revisao de contrato documental, assinatura e possivel schema;
- criar downloads locais, parametrizados e preliminares: escolhido por ser reversivel e demonstravel em G1;
- usar IA para adaptar textos: rejeitado neste gate por risco de fonte inventada e runtime nao aprovado;
- comprar/integrar gestor documental: fora de escopo local.

## Implementado

- `src/lib/documents/orientativeTemplate.ts`: mecanismo puro para renderizar templates com placeholders seguros, supressao de contagem abaixo de k e guardrails anti-overclaim.
- `src/data/orientativeDocumentTemplates.ts`: configuracao versionada dos quatro modelos orientativos.
- `src/pages/app/DocumentsPage.tsx`: cards de modelos orientativos agora oferecem download Markdown parametrizado quando ha template local.
- `src/lib/documents/orientativeTemplate.test.ts`: contrato cobre k abaixo do minimo, texto PGR preliminar, controles declarados e bloqueio de termos perigosos.

## Guardrails

- O modelo sempre declara que e preliminar e orientativo.
- O modelo nao constitui laudo, parecer juridico, aprovacao de gate ou autorizacao de uso com dados reais.
- O modelo exige revisao tecnica, privacidade/LGPD e governanca antes de uso formal.
- Contagem abaixo de `k_min` e descrita como protegida, sem expor o numero.
- Termos como anonimato absoluto, conformidade automatica, diagnostico individual, causalidade automatica e reducao automatica de risco sao bloqueados pelo avaliador.

## Limites

- O download e Markdown local; nao ha persistencia, assinatura, hash formal ou ledger.
- O conteudo continua sendo rascunho orientativo e nao substitui documento revisado.
- A fatia nao aprova instrumento, fonte, licenca, scoring, SRQ-20, importacao real, consolidado multiavaliacao ou dados reais.
- G1 permanece No-Go ate aprovacoes formais.

## Criterios de aceite

- Mecanismo puro separado da configuracao de dominio.
- Templates com linguagem conservadora e placeholders seguros.
- UI diferencia modelos orientativos de documentos oficiais gerados.
- Testes cobrem privacidade abaixo de k e overclaim.
- Typecheck, lint, testes, build e bundle devem permanecer verdes antes de declarar a fatia concluida.

## Validacao local

- `npm run ci` aprovado em 03/07/2026.
- Vitest: 24 arquivos e 174 testes aprovados.
- Auditoria npm: zero vulnerabilidades.
- ESLint e TypeScript: aprovados.
- Build Vite 8.1.0 e orcamento de bundle: aprovados.
