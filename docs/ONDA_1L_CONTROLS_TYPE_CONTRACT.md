# Onda 1L - contrato tipado de controles e evidencia

## Decisao

`ControlsPage` passa a usar os tipos gerados pelo schema Supabase para:

- itens do catalogo institucional de controles;
- controles adotados pela organizacao;
- organizacao atualmente carregada;
- mapa de controles adotados por `catalog_id`.

## Guardrails

- nenhuma regra de evidencia, eficacia, divergencia ou status foi alterada;
- o consumo de riscos permanece agregado, fechado e protegido pelo filtro operacional `k>=5` da RPC;
- controles declarados continuam sem reduzir automaticamente o escore de risco;
- a interface continua tratando divergencias como sinal consultivo para revisao tecnica;
- nenhuma migration, policy, RPC, RLS, autenticacao, billing ou dado real foi alterado.

## Evidencia e limites

O typecheck valida a compatibilidade dos estados e consultas com o schema gerado. Os testes existentes de evidencia e divergencia cobrem 12 casos. Esta onda elimina quatro `any` de estado/mapa sem criar uma nova camada de dominio e nao prova permissao remota fora do CI de banco/RLS.
