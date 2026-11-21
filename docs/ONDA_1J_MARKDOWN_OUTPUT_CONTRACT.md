# Onda 1J - contrato de saida Markdown Aurora

## Decisao

O renderer `AIRichMarkdown` passa a tratar a apresentacao GFM como um contrato tipado:

- checkboxes sao reconhecidos somente como elementos React `input` com `type="checkbox"`;
- o estado `checked` e lido como booleano estrito;
- o tipo da lista e propagado por contexto React, sem depender de `node.parent` fora do tipo oficial HAST;
- nenhum `any` explicito permanece no renderer.

## Guardrails

- o conteudo continua vindo somente do parser `react-markdown` com `remark-gfm`;
- nao foi habilitado `rehypeRaw` nem foi criada uma superficie para HTML arbitrario;
- links externos continuam com `target="_blank"` e `rel="noopener noreferrer"`;
- o indicador visual do checklist permanece nao interativo e `aria-hidden`;
- o estado concluido/pendente tambem recebe texto `sr-only`, preservando informacao para tecnologias assistivas;
- listas ordenadas conservam numeracao nativa e listas nao ordenadas conservam o bullet visual customizado.

## Evidencia

O teste de componente cobre checklist concluido e pendente, texto acessivel, quantidade de indicadores e separacao entre lista ordenada e bullet customizado. Typecheck e lint passam sem regressao.

## Limites

Esta onda nao altera prompts, fontes, scoring, persistencia, RLS, autorizacao, sanitizacao de dados de negocio ou gate de release. O renderer continua sendo uma camada de apresentacao para conteudo Aurora local/deterministico e nao transforma markdown em evidencia normativa.
