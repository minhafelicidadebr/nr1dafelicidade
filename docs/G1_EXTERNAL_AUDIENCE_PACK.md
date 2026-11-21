# Pacote de audiência externa — G1 sintético

Data: 14/07/2026

## Resultado

O pacote `external-audience-g1-synthetic`, versão `2026-07-14.1-draft`, está **pronto somente para ensaio interno**. Uso com audiência externa permanece bloqueado.

Ele não agenda sessão, não coleta dados da audiência, não aprova G1 e não substitui revisão Jurídica, SST, Ergonomia, metodologia, privacidade ou segurança.

O simulador `g1-facilitator-rehearsal-2026-07-14` permite ensaiar as condutas localmente, sem nomear facilitador ou alterar o bloqueio externo.

O pacote é operado no workspace protegido `/app/governance/external-readiness`; Governança mantém apenas o resumo decisório e o acesso contextual.

## Problema e evidência produzida

O cockpit da demo protege a execução, mas não define sozinho o que um facilitador pode dizer diante de perguntas comerciais, regulatórias ou técnicas. O pacote produz uma narrativa versionada com:

- abertura e escopo permitido;
- sete limites obrigatórios;
- sequência do walkthrough;
- seis perguntas difíceis com resposta segura e escalonamento;
- seis condições de interrupção com recuperação;
- fechamento e descarte obrigatório.

## Lentes aplicadas

- **SST/Ergonomia:** proíbe converter interface e questionário em diagnóstico, AEP/AET ou julgamento técnico.
- **Jurídico/regulatório:** bloqueia garantia de conformidade, validação indevida, G1 aprovado e promessa de entrega.
- **Privacidade/segurança:** proíbe dados reais, texto livre, transporte remoto e captura sensível.
- **Produto/UX/operação:** oferece respostas curtas, escalonamento claro e recuperação diante de ambiguidade ou incidente.

## Alternativas comparadas

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Documento de roteiro sem validação | 5 | 8 | 10 | 8 | 6 | 3 | 10 | 4 | 10 | 64 |
| B | Pacote versionado, avaliador e cockpit | 9 | 9 | 7 | 8 | 9 | 8 | 7 | 8 | 7 | 72 |
| C | Slides/mock para ensaio | 4 | 7 | 9 | 7 | 5 | 3 | 9 | 3 | 9 | 56 |
| D | Adiar narrativa até aprovação G1 | 2 | 9 | 10 | 10 | 3 | 2 | 10 | 2 | 2 | 50 |
| E | Ferramenta externa de enablement/GRC | 7 | 8 | 3 | 5 | 7 | 8 | 3 | 9 | 3 | 53 |
| F | Engine genérica de narrativas | 7 | 8 | 4 | 6 | 8 | 10 | 4 | 9 | 4 | 60 |

Decisão: **ramo B**. Entrega uma fatia verificável e reversível sem criar persistência, assinatura ou integração prematura.

## Estados e permissões

| Estado | Ensaio interno | Audiência externa | Coleta de dados |
|---|---|---|---|
| `incomplete` | Bloqueado | Bloqueado | Proibida |
| `draft_ready_for_internal_rehearsal` | Permitido com dados fictícios | Bloqueado | Proibida |
| `approved_for_external_use` | Permitido | Somente sessão sintética aprovada | Proibida |
| `rejected` | Suspenso para revisão | Bloqueado | Proibida |

Uso externo exige simultaneamente:

1. facilitador nomeado;
2. accountable com autoridade de suspensão;
3. revisão Jurídica/regulatória;
4. revisão SST/Ergonomia;
5. decisão formal `approved`;
6. ata ou parecer verificável.

## Sete limites obrigatórios

1. somente cenários e dados fictícios;
2. ausência de diagnóstico individual ou organizacional;
3. ausência de garantia de conformidade;
4. proibição de dados reais ou de trabalhadores;
5. ausência de entrega, laudo ou relatório formal;
6. instrumento e scoring não apresentados como validados;
7. questionário não substitui AEP, AET, trabalho real ou participação.

## Stop conditions

Interromper diante de dado real, interpretação diagnóstica, overclaim, relato de crise individual, runtime inseguro ou alegação de gate/produto aprovado. A recuperação sempre prioriza descarte, correção explícita, cuidado humano separado e escalonamento competente.

## Critérios de aceite

- sete seções completas e versionadas;
- sete limites declarados;
- pelo menos seis perguntas com resposta e escalonamento;
- pelo menos seis stop conditions com recuperação;
- identidades de seção, limite, pergunta e stop condition sem duplicidade;
- linhas em branco, perguntas incompletas e duplicação de conteúdo não contam para os mínimos;
- modo sintético, sem texto livre e sem transporte remoto;
- uso externo impossível sem papéis, revisões, decisão e recibo;
- componente diferencia visualmente draft de aprovação;
- testes adversariais, typecheck, lint e build verdes.

## Rollback

Remover `externalAudiencePack`, sua configuração G1, o card do workspace de prontidão e este documento. Não há migration, armazenamento, integração ou dado remoto a reverter.
