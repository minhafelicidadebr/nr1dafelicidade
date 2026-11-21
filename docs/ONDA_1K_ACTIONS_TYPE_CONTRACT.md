# Onda 1K - contrato tipado do plano de acoes

## Decisao

`ActionsPage` passa a consumir os tipos ja gerados pelo schema Supabase para as fronteiras de maior risco operacional:

- organizacao, ciclo e item de acao usam os tipos de tabela correspondentes;
- sugestoes de controle usam o retorno tipado da RPC `suggest_controls_for_cycle`;
- membros usam o retorno tipado da RPC `list_org_members`;
- insercoes e atualizacoes usam os contratos `Insert` e `Update` de `action_items`;
- catalogo e controles declarados usam os tipos de tabela correspondentes.

## Guardrails

- nenhuma migration, policy, RPC, RLS, autenticacao ou billing foi alterado;
- o filtro por organizacao e o consumo de riscos agregados permanecem iguais;
- a governanca de fechamento continua bloqueando conclusao sem responsavel, prazo, evidencia, KPI/reavaliacao e revisao tecnica;
- a pagina continua sem acesso a respostas individuais e preserva o requisito operacional de `k>=5` exibido na interface;
- o cast do nivel de controle permanece limitado ao retorno controlado da RPC e nao cria um novo valor de dominio;
- nenhum dado real, seed ou credencial foi introduzido.

## Alternativas avaliadas

- camada de repositorio generica: adiada por ampliar a superficie sem reduzir risco nesta fatia;
- regeneracao do schema: desnecessaria, pois os tipos existentes ja cobrem as tabelas e RPCs usadas;
- documentacao sem implementacao: rejeitada, pois manteria a fronteira sem contrato;
- tipos locais soltos: rejeitados em favor dos tipos derivados do schema para reduzir drift.

## Evidencia e limites

O typecheck comprova compatibilidade dos payloads com o schema gerado, o lint confirma a forma do codigo e a suite de governanca de acoes preserva os bloqueios existentes. Esta onda nao prova permissao em ambiente remoto nem substitui testes de banco/RLS do CI.
