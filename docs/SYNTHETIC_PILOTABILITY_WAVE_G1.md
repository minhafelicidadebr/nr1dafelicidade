# Onda de pilotabilidade sintética — G1

## Decisão estratégica

Pontuação de 0 a 10; em risco e complexidade, valor maior representa melhor controle e menor dificuldade.

| Rota | Valor | Segurança | Custo | Risco | Tese | Reuso | Complexidade | Escala | Tempo | Decisão |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| A — manter preenchimento manual | 5 | 8 | 9 | 8 | 6 | 4 | 9 | 4 | 7 | insuficiente para experiência autônoma |
| B — presets determinísticos, recuperação e runbook | 9 | 9 | 8 | 9 | 9 | 8 | 8 | 8 | 9 | escolhida |
| C — vídeo/mock da jornada | 5 | 9 | 7 | 8 | 5 | 5 | 8 | 6 | 7 | complementar, sem interação real |
| D — adiar pilotabilidade | 2 | 10 | 10 | 9 | 3 | 2 | 10 | 2 | 2 | não captura aprendizagem |
| E — plataforma externa de demo/analytics | 7 | 4 | 4 | 4 | 6 | 7 | 5 | 8 | 4 | bloqueada por fornecedor e privacidade |
| F — motor genérico multi-instrumento | 6 | 7 | 3 | 6 | 7 | 10 | 3 | 10 | 3 | abstração prematura |

## Resultado

A rota escolhida fornece três cenários fictícios reproduzíveis, revisão antes do resultado, limpeza integral, comprovante ligado ao cenário, feedback somente em memória e runbook de suporte. O mecanismo recebe grupos e faixas genéricas; a configuração NR-1 permanece em `src/data`.

## Critérios de aceite

- aplicar o mesmo cenário produz as mesmas respostas;
- todos os itens ficam completos sem rede ou persistência;
- o usuário consegue alterar e limpar respostas;
- o comprovante registra o preset usado;
- reload remove jornada, recibo e feedback;
- teclado, axe e E2E passam nos quatro projetos Playwright;
- nenhuma copy apresenta preset como benchmark, caso real ou scoring aprovado.

## Risco residual e rollback

Os presets ainda passam pela transformação exploratória legada e não têm valor psicométrico. O rollback remove selector, configuração e mecanismo de presets sem alterar instrumento, banco ou runtime. Uso real e exportação formal permanecem bloqueados.
