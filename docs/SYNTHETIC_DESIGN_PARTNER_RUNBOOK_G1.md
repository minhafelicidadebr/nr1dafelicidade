# Runbook — jornada sintética Design Partner G1

## Objetivo e fronteira

Permitir que uma pessoa convidada experimente a jornada pública em uma sessão local guiada, sem assistência de engenharia e sem fornecer dados reais. O runbook não aprova uso externo autônomo, demo externa, G1, instrumento, scoring ou operação produtiva.

## Preflight

1. Confirmar banner `Demo educativa e sintética`.
2. No cockpit, reconhecer uso somente de dados fictícios.
3. Reconhecer que a demo não produz diagnóstico ou decisão técnica.
4. Reconhecer que nada será salvo ou enviado.
5. Confirmar o estado `Sessão local liberada` e os limites de capacidade.
6. Confirmar dossiê metodológico com runtime bloqueado.
7. Não usar nomes, relatos, empresas ou situações reais.
8. Não abrir console, Supabase, CRM ou serviço externo.

## Caminho assistido

1. Escolher um dos três cenários fictícios e determinísticos.
2. Revisar as respostas já preenchidas; alterar somente para explorar estados visuais.
3. Usar `Limpar respostas` se houver dúvida ou escolha incorreta.
4. Gerar a leitura demonstrativa somente quando `28 de 28` estiver visível.
5. Conferir o comprovante local, incluindo cenário, versão e política.
6. Registrar feedback estruturado; não há campo livre ou envio.
7. Completar o handoff local do facilitador.
8. Confirmar `Sessão sintética encerrada localmente`.
9. Recarregar a página para comprovar descarte de preflight, respostas, comprovante, feedback e handoff.

## Recuperação

| Situação | Ação segura | Resultado esperado |
|---|---|---|
| Cenário incorreto | Limpar respostas, voltar e aplicar outro preset | Nenhum estado anterior permanece |
| Item alterado por engano | Selecionar outra opção ou limpar tudo | Progresso recalculado localmente |
| Botão de resultado bloqueado | Completar todos os itens fictícios | CTA habilita somente em 28/28 |
| Resultado não aparece | Voltar ao início e repetir sem dados reais | Jornada reinicia em memória |
| Suspeita de dado real | Parar, recarregar a página e não compartilhar captura | Estado local descartado |
| Falha de rede | Continuar somente se os assets já carregaram; não inserir dados | Nenhum fallback remoto de dados |
| Preflight incompleto | Ler e confirmar as três fronteiras, sem contornar o bloqueio | CTAs permanecem desabilitados até a conclusão |
| Handoff incompleto | Conferir comprovante, feedback, limites e descarte | Encerramento local aparece somente com quatro confirmações |

## Stop conditions

Interromper a sessão se alguém tentar usar dados de trabalhador, interpretar o resultado como diagnóstico, solicitar exportação formal, pedir acesso ao CRM ou apresentar o produto como G1/SaaS aprovado.

## Evidência mínima da sessão

- navegador e viewport usados;
- cenário sintético selecionado;
- comprovante local visualizado;
- feedback estruturado testado;
- reload confirmado;
- limitações explicadas.
- preflight e handoff concluídos na interface.

Não capturar respostas item a item, nomes, e-mails, imagens com dados pessoais ou qualquer conteúdo de trabalhador.
