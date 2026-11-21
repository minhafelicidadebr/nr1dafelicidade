# ADR — Núcleo de execução e evidências do MVP NR-1

- Status: `proposed`
- Data: 07/08/2026
- Onda: 0 — contrato de produto, fonte e ameaça
- Classificação: `MASTER`

## Contexto

O guia MTE analisado exige que o GRO/PGR atravesse planejamento, implantação, monitoramento, avaliação de eficácia e melhoria contínua. No repositório, `action_items` e `org_controls` já oferecem uma base de interface, mas a completude é inferida por padrões de texto em `description` e `notes`. Isso não prova execução, manutenção ou eficácia e permanece sujeito a bypass pela interface ou por escrita direta.

O app também possui fatias draft de AEP, AET, Criteria Engine, Privacy Vault e documentos versionados. Elas são reutilizáveis como contexto e guardrails, mas não autorizam uso com dados reais nem transformam a ação em documento normativo.

## Decisão proposta

Construir, na Onda 1, um **núcleo server-side de execução de ações e evidências** com mecanismo genérico e configuração de domínio NR-1. A primeira vertical será:

`achado/contexto aprovado → ação → controle implantado → evidência → medição → revisão de eficácia → correção ou manutenção → pacote documental preliminar`.

O mecanismo deve ser independente do vocabulário de COPSOQ, SRQ-20, AEP, AET ou de qualquer fórmula. O domínio fornecerá origem, catálogo, textos, critérios e fontes versionados. Nenhum componente React será autoridade para aprovar, fechar, reduzir risco ou assinar.

## Alternativas consideradas

| Ramo | Decisão | Segurança | Tempo | Reuso | Resultado |
|---|---|---:|---:|---:|---|
| A — manter CRUD/texto | Rejeitado | baixa | alto | baixo | Parece completo, mas não gera prova confiável. |
| B — construir PGR completo | Adiado | média | baixo | alto | Excede o primeiro corte e multiplica validações externas. |
| C — vertical execução/evidência | Escolhido | alta | médio | alto | Fecha o ciclo operacional mais valioso. |
| D — apenas serviço/documentos | Parcial | média | alto | baixo | Aprende com operação, mas não escala o controle. |
| E — comprar/integrar GRC | Adiado | dependente | baixo | médio | Exige fornecedor, DPA, storage, integração e adequação. |
| F — motor genérico isolado | Direção | alta | baixo | muito alto | Bom fundamento, mas abstrato sem uma vertical demonstrável. |

A decisão é **C sustentado por F**, conforme a análise ToT registrada em `docs/NR1_MVP_EXECUTION_WAVES_TOT_2026.md`.

## Vocabulário mínimo

| Entidade | Significado operacional | Não significa |
|---|---|---|
| Ação | Compromisso aprovado para introduzir, melhorar ou manter uma medida. | Resultado garantido ou conformidade automática. |
| Implementação de controle | Registro de que uma medida foi aplicada em escopo definido. | Existência de um item no catálogo. |
| Evidência | Registro versionado de fonte, data, autoria, referência e conteúdo/resultado observado. | Verdade material incontestável. |
| Medição | Observação proativa ou reativa ligada ao método e ao período. | Diagnóstico individual ou causalidade automática. |
| Revisão de eficácia | Julgamento técnico sobre evidências e resultados esperados. | Redução automática de severidade/probabilidade. |
| Correção | Nova ação ou ajuste exigido por resultado parcial/ineficaz. | Reabertura silenciosa que apaga histórico. |
| Participação | Consulta, contribuição ou devolutiva de trabalhadores/CIPA por grupo e papel. | Vínculo entre pessoa, convite e resposta. |

## Máquina de estados proposta

Estados de uma ação:

`draft → planned → approved → in_progress → under_review → verified`

Fluxos alternativos:

- `planned → cancelled`, apenas com motivo e autoria autorizada;
- `under_review → corrective_required`, quando a eficácia for parcial ou ineficaz;
- `corrective_required` gera uma nova ação filha; a ação original permanece histórica;
- uma manutenção futura é uma nova ocorrência/versionamento, não uma edição silenciosa do passado.

Regras:

- nenhuma transição pode pular etapas;
- `approved`, `under_review` e `verified` exigem campos mínimos completos;
- ação de prioridade alta/crítica exige revisor diferente do executor;
- a revisão não pode ser concluída sem evidência e método de monitoramento;
- correção não pode ser encerrada sem nova revisão;
- o histórico de transições é append-only;
- concorrência usa versão esperada/idempotência para impedir dupla aprovação ou sobrescrita.

## Contratos de comando propostos

Estes nomes são contratos de intenção, não funções SQL aprovadas.

| Comando | Pré-condição | Efeito | Bloqueio principal |
|---|---|---|---|
| `create_action` | usuário autorizado e origem válida | cria `draft` | tenant/origem inválidos |
| `advance_action` | transição permitida e campos completos | muda estado e grava evento | salto, dono ausente ou versão antiga |
| `register_control_implementation` | ação aprovada/iniciada | registra controle por escopo | catálogo sem implantação |
| `register_evidence` | ação/controle pertencentes ao tenant | cria evidência versionada | referência vazia ou conteúdo individual |
| `record_measurement` | método e período definidos | adiciona medição | indicador sem fonte/método |
| `submit_effectiveness_review` | evidência e medição suficientes | grava resultado da revisão | revisor inválido ou ausência de critério |
| `create_corrective_followup` | resultado parcial/ineficaz | cria ação filha | correção sem motivo/origem |
| `record_participation` | evento e grupo autorizados | grava participação coletiva | identidade de respondente ou microgrupo |
| `publish_communication` | conteúdo consolidado revisado | registra devolutiva | microdados ou claim indevido |
| `compile_document_snapshot` | versões e bloqueadores resolvidos | gera pacote preliminar | fonte ausente ou policy não aprovada |

## Modelo de dados candidato

Antes de migration, a Onda 1 deve decidir entre evoluir `action_items`/`org_controls` e criar entidades separadas. A proposta mínima é:

- `action_items`: origem, tipo de intervenção, prioridade, população exposta restrita, responsável, prazo, monitoramento, efeito esperado e estado;
- `action_events`: transições, comentários decisórios, ator, data, versão e hash canônico;
- `control_implementations`: controle aplicado, escopo, status, manutenção e ligação com ação;
- `evidence_records`: tipo, fonte, autor, data, referência, conteúdo estruturado, versão e hash;
- `action_measurements`: indicador, baseline, meta, medição, método, período e fonte;
- `effectiveness_reviews`: resultado, justificativa, evidências consideradas, revisor e próxima revisão;
- `participation_records`: grupo/papel, etapa, contribuição consolidada, resposta organizacional e data;
- `communication_records`: público, versão do conteúdo, canal, data e confirmação compatível com o papel.

Decisões ainda abertas:

1. contagem exata de trabalhadores no PGR restrito versus bandas nas superfícies coletivas;
2. política de revisão independente por classe de prioridade;
3. uso de `aep_finding_id`/`aet_finding_id` versus uma referência de origem polimórfica controlada;
4. formato de evidência estruturada antes de anexos binários;
5. storage, malware scanning e retenção de arquivos;
6. retenção do histórico de inventário por 20 anos, dependente de base e política aprovadas.

## Fronteiras de segurança e privacidade

- respostas individuais, convites e identidades permanecem fora da superfície de organização;
- `k ≥ 5` é imposto no servidor para agregações e saídas coletivas;
- participação usa grupo/papel por padrão, não a identidade do respondente;
- documentos e exportações são autorizados por papel e finalidade;
- comandos passam por RPC/serviço delimitado; não há update direto de estado sensível;
- service role, quando necessário, permanece exclusivamente no servidor/Edge Function;
- o browser usa somente chave publicável e não recebe secrets;
- hashes registram integridade e versão; revisão técnica registra suficiência, sem garantia de autenticidade material;
- anexos binários ficam fora do MVP até storage, scanning, RBAC, retenção e incident response serem aprovados.

## Estratégia de migração e rollback

1. congelar o comportamento atual e registrar o texto existente como legado;
2. introduzir mecanismo puro e contratos de estado antes da persistência;
3. criar migration reversível somente após aceite da ADR e autorização explícita;
4. mapear registros antigos para `legacy_unverified`, preservando o conteúdo original;
5. impedir que o backfill promova texto a evidência ou eficácia automaticamente;
6. habilitar leitura nova em cenário sintético isolado;
7. comparar resultados antigos/novos sem alterar score ou documento oficial;
8. em rollback, desabilitar o novo comando e manter o histórico já criado; nunca apagar ledger.

## Critérios de aceite da ADR

- [ ] Produto, engenharia, SST/Ergonomia e privacidade aprovam o vocabulário e o fluxo.
- [ ] O vínculo psicossocial com AEP/trabalho real está explícito.
- [ ] A máquina de estados tem casos válidos, inválidos e concorrentes testáveis.
- [ ] RLS, RPC, `k ≥ 5`, separação convite-resposta e permissões de exportação têm cenários definidos.
- [ ] Migração e rollback não sobrescrevem texto legado nem histórico.
- [ ] O primeiro slice não depende de IA, instrumento não aprovado ou storage remoto.
- [ ] O protótipo cobre vazio, carregamento, erro, bloqueio, revisão e acessibilidade.
- [ ] O documento recebe aprovação formal antes de qualquer migration da Onda 1.

## Não decidido por esta ADR

Esta proposta não aprova schema, migration, scoring, instrumento, retenção legal, uso com dados reais, fornecedor, storage, assinatura digital, conformidade ou avanço de gate.
