# Onda 1M - contrato tipado de organizacao

## Decisao

`CompanyPage` passa a usar o tipo gerado de `organizations` para o estado da organizacao e trata falhas de criacao/atualizacao como `unknown` antes de exibir mensagens.

## Guardrails

- nenhuma regra de autenticacao, autorizacao, convite, RLS ou persistencia foi alterada;
- os payloads continuam sendo construidos por `createOrganization` e `updateOrganization`;
- CNPJ, codigo de convite e demais dados cadastrais continuam sendo apenas exibidos no fluxo existente;
- mensagens de erro nao assumem que qualquer objeto recebido possui `.message`;
- nenhum segredo, token, service role, dado real ou variavel de ambiente foi adicionado.

## Evidencia e limites

Typecheck e lint validam o contrato com o schema gerado e a eliminacao dos tres `any` da pagina. Esta onda nao altera nem prova as policies remotas de organizacao; a autorizacao efetiva continua pertencendo ao backend/RLS e ao CI de banco.
