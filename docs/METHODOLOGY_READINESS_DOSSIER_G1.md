# Dossiê de prontidão metodológica — G1

## Resultado operacional

O dossiê consolida o estado do instrumento exploratório em uma cadeia auditável:

1. intake canônico de artefatos;
2. manifesto, versão, hash e owner;
3. revisão metodológica independente;
4. runtime do instrumento mantido bloqueado.

Ele não cria ou altera itens, subescalas, scoring, cutoffs, licença ou fonte. Também não aprova COPSOQ-BR, G1, campanha ou dados reais.

## Lentes e decisão

- Psicometria: não inferir equivalência entre referência estrutural pt-PT e pacote canônico brasileiro.
- SST/ergonomia: o questionário permanece complementar e não substitui AEP, AET, observação ou participação dos trabalhadores.
- Privacidade e operação: runtime e campanha continuam bloqueados até evidência, revisão competente e gate formal.

Foi escolhida uma camada agregadora sobre os contratos existentes. Ela torna a dependência rastreável sem inventar evidência externa ou antecipar uma integração de banco.

## Critérios de aceite

- A UI deriva os estados exclusivamente das políticas versionadas em `src/data`.
- `canEnableInstrumentRuntime` permanece sempre `false` nesta onda.
- O primeiro artefato pendente é exposto como próximo passo.
- A superfície pública entra no guardrail anti-overclaim e passa testes, typecheck, lint, build e E2E.

## Risco e rollback

O risco residual continua externo: fonte primária brasileira, licença, banco de itens, scoring, fixtures e revisão independente ainda precisam de responsáveis competentes. O rollback consiste em remover o dossiê, seus exports de resumo e a seção da página, sem afetar dados ou runtime.
