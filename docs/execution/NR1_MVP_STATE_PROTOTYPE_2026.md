# Protótipo textual — estados do MVP de execução NR-1

- Status: `draft`
- Data: 07/08/2026
- Onda: 0 — protótipo sem wiring e sem dados reais.

## Objetivo do protótipo

Testar jornada, vocabulário, permissões e bloqueios antes de desenhar schema ou implementar componentes. O protótipo representa uma ação coletiva ligada ao trabalho real; não representa questionário, diagnóstico, laudo ou decisão automática de conformidade.

## Papéis

| Papel | Pode fazer | Não pode fazer |
|---|---|---|
| Executor/gestor | propor, executar, anexar registro estruturado e responder a pendências | aprovar sozinho ação crítica ou apagar histórico |
| SST/Ergonomia | revisar origem, método, controle, eficácia e correção | transformar score isolado em decisão automática |
| Revisor técnico | revisar evidência e eficácia conforme competência | aprovar o próprio trabalho em caso crítico |
| CIPA/trabalhador representante | consultar, contribuir, receber devolutiva consolidada | acessar resposta individual ou microgrupo protegido |
| Administrador organizacional | administrar escopo, membros e exportações autorizadas | ler respostas ou ultrapassar `k` |
| DPO/Jurídico/Security | revisar finalidade, retenção, acesso, incidentes e anexos | validar tecnicamente eficácia de SST sem competência |

## Jornada vertical

```text
Inbox de ações
  → Contexto e origem
  → Plano da medida
  → Implantação do controle
  → Evidências e medições
  → Revisão de eficácia
  → Manter ou corrigir
  → Participação/devolutiva
  → Pacote documental preliminar
```

## Tela 1 — Inbox de ações

```text
┌──────────────────────────────────────────────────────────────┐
│ Ações de prevenção                            [Nova ação]    │
│ Filtros: [unidade] [responsável] [estado] [prazo]           │
├──────────────────────────────────────────────────────────────┤
│ 03 ações exigem revisão   01 vencida   02 aguardam evidência │
├──────────────┬───────────────┬─────────────┬─────────────────┤
│ Fonte        │ Medida        │ Estado      │ Próximo passo   │
│ Trabalho real│ Melhorar      │ Em execução │ Registrar prova │
│ Grupo/escopo │ Prazo         │ Prioridade  │ [Abrir]         │
└──────────────┴───────────────┴─────────────┴─────────────────┘
```

Regras:

- a ação nunca aparece como “concluída” antes da revisão de eficácia;
- cada card mostra origem, responsável, prazo, estado e próximo passo;
- contagem coletiva abaixo de `k` não aparece;
- estado vazio explica como criar uma ação a partir de achado aprovado;
- estado bloqueado explica qual papel ou evidência falta;
- nenhum card usa “conforme”, “certificado”, “anônimo” ou “risco reduzido” como claim automático.

## Tela 2 — Criar/planejar ação

```text
Origem da ação
  [AEP aprovada / AET encerrada / requisito / outro registro técnico]
  Achado: [selecionar origem válida]
  Condição da organização do trabalho: [obrigatório no psicossocial]

Medida
  Tipo: ( ) introduzir  ( ) melhorar  ( ) manter
  O que será alterado? [texto estruturado e curto]
  Controle relacionado: [instância, não apenas catálogo]

Execução
  Responsável: [papel/usuário autorizado]
  Prazo: [data]
  População potencialmente afetada: [campo restrito/banda pública]
  Prioridade e justificativa: [obrigatório]

Monitoramento
  Método: [inspeção / registro operacional / consulta / outro]
  Indicador: [obrigatório]
  Resultado esperado: [obrigatório]
  Periodicidade: [obrigatório]

                       [Salvar rascunho] [Enviar para aprovação]
```

Bloqueios:

- risco psicossocial sem AEP/trabalho real não avança;
- score isolado, cor de dashboard ou recomendação de IA não pode ser origem;
- ação sem condição organizacional, responsável, prazo ou método não aprova;
- texto individual sensível é rejeitado ou encaminhado para fluxo de cuidado separado;
- população exposta informa prioridade, mas não determina sozinha severidade ou decisão.

## Tela 3 — Detalhe e timeline

```text
Melhorar previsibilidade de jornada
Estado: EM EXECUÇÃO       Prioridade: alta       Versão: 3
Origem: AEP-2026-001 / achado aprovado
Responsável: Gestão de Operações        Prazo: 30/09/2026

[Plano] [Controle] [Evidências] [Medições] [Participação] [Histórico]

Histórico append-only
  07/08  Planejada → Aprovada     revisão técnica #1
  12/08  Aprovada → Em execução   responsável confirmou início
  20/08  Evidência registrada      manutenção de escala v3

Próximo passo: registrar evidência de implantação
```

Permissões:

- executor pode completar tarefas de execução;
- revisor vê o snapshot, as fontes e as versões;
- somente serviço/RPC muda estado;
- histórico não possui editar/excluir;
- a aba de participação mostra síntese por grupo/papel, nunca identidade ligada a resposta.

## Tela 4 — Evidências e medições

```text
Evidência de implantação
  Tipo: [registro operacional]
  Fonte: [procedimento/ata/inspeção]
  Data observada: [data]
  Responsável pelo registro: [papel]
  O que foi observado: [síntese organizacional]
  Referência: [identificador controlado]
  Integridade: SHA-256 [gerado pelo serviço]

Medição
  Método: [como foi observado]
  Baseline: [se aplicável]
  Meta/critério: [resultado esperado]
  Resultado: [valor ou síntese]
  Período: [início/fim]

                         [Salvar versão] [Enviar para revisão]
```

Microcopy obrigatória: “O hash registra a integridade da versão. A revisão técnica avalia a suficiência da evidência; o hash, sozinho, não comprova que o evento ocorreu.”

## Tela 5 — Revisão de eficácia

```text
Revisão técnica #1
  Evidências consideradas: 2
  Medições consideradas: 1
  Participação registrada: sim
  Resultado:
    ( ) eficaz
    ( ) parcialmente eficaz
    ( ) ineficaz
  Fundamentação: [obrigatório]
  Próxima revisão/manutenção: [obrigatório]
  Revisor: [não pode ser executor em prioridade crítica]

 [Salvar rascunho] [Registrar decisão]
```

Comportamento:

- `eficaz` cria manutenção ou próxima revisão;
- `parcialmente eficaz` exige ajuste ou nova ação corretiva;
- `ineficaz` bloqueia encerramento e exige ação filha;
- nenhum resultado altera automaticamente score, severidade ou probabilidade;
- falta de evidência, método ou participação aparece como bloqueador explícito.

## Tela 6 — Correção

```text
Medida insuficiente
Origem: Revisão técnica #1
Problema observado: [síntese organizacional]
Correção proposta: [ação filha]
Novo responsável: [selecionar]
Novo prazo: [data]
Como será verificada: [método + resultado esperado]

                 [Criar ação corretiva]
```

A ação original permanece `corrective_required`. A ação filha recebe sua própria origem, estado, evidência e revisão.

## Tela 7 — Participação e comunicação

```text
Participação do processo
Etapa: [planejamento / implantação / monitoramento]
Público: [trabalhadores / CIPA / representação]
Contribuição consolidada: [sem relato identificável]
Resposta da organização: [obrigatório]
Data e canal: [registro]

Comunicação de devolutiva
  Riscos consolidados: [versão aprovada]
  Medidas do plano: [versão aprovada]
  Público autorizado: [papel/finalidade]
                         [Registrar]
```

A tela deve avisar que não é canal para diagnóstico ou emergência individual. Situações sensíveis devem seguir protocolo de cuidado separado e não quebrar a proteção das respostas.

## Tela 8 — Pacote documental preliminar

```text
Pacote: Plano de ação — versão 4
Estado: PRELIMINAR — requer revisão competente
Fontes: critérios v2 · inventário v3 · 5 ações · 9 evidências
Bloqueadores: [0]        Integridade: SHA-256 [ver]

[Ver linhagem] [Baixar exportação autorizada] [Enviar para revisão]
```

O compilador deve bloquear microdados, itens abaixo de `k`, fontes órfãs, política de retenção ausente quando aplicável e claims de certificação/conformidade.

## Estados de interface obrigatórios

| Estado | Comportamento |
|---|---|
| Vazio | Explica a próxima ação e a origem necessária. |
| Carregando | Mantém contexto e não oferece ação destrutiva. |
| Erro | Mostra código legível, não expõe SQL, token ou microdados. |
| Bloqueado | Explica pré-condição, papel e evidência faltantes. |
| Conflito | Informa que outra versão foi registrada e pede recarga segura. |
| Sucesso | Mostra estado, versão, próximo passo e auditoria. |
| Sem permissão | Não revela existência de registros de outro tenant. |
| Mobile/teclado | Ordem lógica, foco visível, alvos grandes e sem dependência de cor. |

## Cenário sintético de aceite

Uma AEP sintética aprovada identifica baixa previsibilidade de jornada como condição organizacional. A organização registra uma ação para melhorar o planejamento, associa um controle implantado, registra evidência de procedimento atualizado e participação da CIPA, mede a execução e classifica a primeira revisão como parcialmente eficaz. O app deve exigir uma correção, preservar o histórico, registrar nova medição e permitir uma segunda revisão eficaz. O pacote documental deve apontar cada versão sem expor respostas individuais.

## Critérios de aceite do protótipo

- [ ] cinco usuários de papéis diferentes conseguem explicar o próximo passo de cada tela;
- [ ] nenhum caminho visual oferece “concluir” antes da revisão de eficácia;
- [ ] bloqueios de AEP, evidência, revisor, `k` e retenção são compreensíveis;
- [ ] ações psicossociais sempre exibem a condição da organização do trabalho;
- [ ] participação e devolutiva não pedem identidade de respondente;
- [ ] erro de permissão não vaza tenant, existência ou conteúdo;
- [ ] fluxo é navegável por teclado e utilizável em celular simples;
- [ ] copy foi revisada por SST/Ergonomia, Produto, Privacidade e representante dos trabalhadores.
