# Simulador de ensaio do facilitador — G1 sintético

Data: 14/07/2026

## Resultado

Foi implementado um ensaio interativo, local e sintético para preparar a condução do pacote de audiência. O simulador não nomeia facilitador, não certifica competência, não aprova uso externo e não registra desempenho individual.

Política: `g1-facilitator-rehearsal-2026-07-14`.

O simulador é acessado no workspace protegido `/app/governance/external-readiness`, separado do cockpit geral de Governança e carregado somente quando necessário.

## Problema e evidência produzida

Um roteiro completo não comprova que a pessoa saberá reagir a overclaim, dado real, diagnóstico, crise individual ou runtime inseguro. O simulador produz evidência local de que seis condutas esperadas foram ensaiadas, sem coletar texto livre ou identidade.

## Lentes aplicadas

- **SST/Ergonomia e cuidado:** crise individual interrompe a demo e segue para cuidado humano separado.
- **Jurídico/metodologia:** claims e validação recebem resposta controlada, sem improviso técnico.
- **Privacidade/segurança:** dado real, gravação, persistência, transporte e audiência externa são proibidos.
- **Produto/UX/acessibilidade:** preflight explícito, radios nativos, feedback imediato, recuperação e reset local.

## Alternativas comparadas

Escala 0–10; em custo, risco e complexidade, maior significa condição mais favorável.

| Ramo | Alternativa | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Total |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | Checklist estático de treinamento | 6 | 8 | 9 | 8 | 7 | 5 | 9 | 5 | 9 | 66 |
| B | Simulador interativo com comprovante local | 9 | 9 | 7 | 8 | 9 | 8 | 7 | 8 | 7 | 72 |
| C | Vídeo ou mock do ensaio | 5 | 6 | 8 | 6 | 5 | 4 | 8 | 5 | 6 | 53 |
| D | Adiar preparação até nomeação formal | 2 | 9 | 10 | 10 | 3 | 2 | 10 | 2 | 2 | 50 |
| E | LMS/ferramenta externa de certificação | 7 | 8 | 3 | 5 | 7 | 8 | 3 | 9 | 3 | 53 |
| F | Engine genérica de simulações | 7 | 8 | 4 | 6 | 8 | 10 | 4 | 9 | 4 | 60 |

Decisão: **ramo B**, mantendo o escopo estritamente local e sem alegação de certificação.

## Preflight obrigatório

1. somente situações e informações fictícias;
2. ausência de audiência externa;
3. ausência de gravação, captura ou coleta;
4. reconhecimento de que o comprovante não nomeia facilitador nem aprova uso externo.

O exercício também verifica que o pacote de audiência está apto a ensaio, o runtime é sintético e não existem dados reais, persistência ou transporte remoto.

## Cenários avaliados

| Situação | Conduta esperada |
|---|---|
| Pressão por garantia regulatória | Responder com catálogo seguro |
| Validação do instrumento | Responder com catálogo seguro |
| Tentativa de dado real | Interromper e escalar |
| Interpretação diagnóstica | Responder com catálogo seguro |
| Relato de crise individual | Interromper e escalar |
| Runtime inesperado | Interromper e escalar |

Uma escolha inadequada permanece visível como ponto de revisão e impede o comprovante até correção.

## Comprovante local

O comprovante contém somente ID efêmero, data, versão do pacote, política e quantidade de cenários concluídos. Não contém respostas, nome, score individual ou conteúdo de audiência.

Invariantes do comprovante:

- `storageMode=memory_only`;
- `canSupportExternalApproval=false`;
- `canNameFacilitator=false`;
- desaparece ao recarregar ou reiniciar;
- falha fechado se houver persistência, transporte ou ensaio incompleto.

## Critérios de aceite

- preflight bloqueia os cenários até quatro confirmações;
- seis cenários exigem a conduta correta;
- chaves duplicadas ou cenário sem rótulo, prompt e coaching bloqueiam o catálogo;
- feedback ajuda a recuperar sem expor raciocínio privado;
- conclusão gera somente comprovante local não aprovativo;
- reset revoga preflight, escolhas e comprovante;
- testes cobrem runtime inseguro, catálogo incompleto, resposta incorreta e receipt adversarial;
- typecheck, lint, build e orçamento de bundle verdes.

## Rollback

Remover `facilitatorRehearsal`, seu catálogo, card, testes e este documento. Não há migration, persistência ou integração remota.
