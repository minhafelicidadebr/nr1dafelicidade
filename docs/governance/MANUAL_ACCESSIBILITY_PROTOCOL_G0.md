# Protocolo manual de acessibilidade pública — G0

## Controle do documento

- Identificador: `a11y-public-manual-g0-v1`
- Versão: `1.0`
- Data de emissão: 12/07/2026
- Proprietário: Produto/UX e Acessibilidade
- Gate: G0/G1 local e sintético; nenhum avanço de gate
- Estado: protocolo disponível; execução humana pendente

Este documento define como produzir evidência manual reproduzível. Ele não registra teste executado, não constitui certificação WCAG e não aprova G1, demo pública, produção ou dados reais.

## Decisão Fable 5

Problema: a matriz Playwright/axe comprova contratos automatizáveis, mas não reproduz o uso humano com tecnologia assistiva, zoom real, Safari configurado para teclado completo ou dispositivo móvel físico.

Lentes consideradas:

- acessibilidade e UX: barreira real, esforço, compreensão e recuperação;
- engenharia: commit, ambiente e passos reproduzíveis;
- governança: separação entre protocolo, execução, achado e aceite.

| Alternativa | Decisão | Motivo |
|---|---|---|
| manter somente automação | rejeitada | axe e Playwright não substituem avaliação humana |
| checklist única já marcada como pronta | rejeitada | confundiria procedimento com evidência executada |
| protocolo controlado + registro por execução | escolhida | preserva rastreabilidade e honestidade do gate |
| contratar auditoria externa imediatamente | adiada | útil para aceite independente, mas não impede preparação local |
| integrar plataforma externa de acessibilidade | adiada | adicionaria custo e tratamento de artefatos sem necessidade atual |
| criar motor genérico de evidências | adiada | abstração desproporcional para esta fatia documental |

## Escopo controlado

Rotas públicas:

| Jornada | Rota | Resultado essencial |
|---|---|---|
| Home | `/` | compreender a proposta e alcançar os destinos públicos |
| Planos | `/planos` | compreender a oferta permitida e operar seus controles |
| Demo NR1/COPSOQ | `/nr1-copsoq` | iniciar, responder e concluir a demonstração sintética |

O protocolo cobre teclado, foco, leitor de tela, nome/papel/estado, zoom real, reflow perceptível, orientação, redução de movimento e uso em dispositivo físico. Fluxos autenticados, dados reais, formulários comerciais remotos e conformidade integral do produto estão fora do escopo.

## Fontes de referência

- [WCAG 2.2 — recomendação normativa do W3C](https://www.w3.org/TR/WCAG22/), com atenção a 1.3.1, 1.4.4, 1.4.10, 2.1.1, 2.1.2, 2.4.1, 2.4.3, 2.4.7, 2.4.11, 2.5.8, 4.1.2 e 4.1.3.
- [Guia oficial do NVDA](https://download.nvaccess.org/documentation/userGuide.html).
- [Full Keyboard Access no macOS](https://support.apple.com/en-gb/guide/mac-help/mchlc06d1059/mac).
- [Atalhos de teclado do Safari no macOS](https://support.apple.com/en-lamr/guide/safari/cpsh003/mac), incluindo a preferência para destacar cada item da página com `Tab`.

As referências orientam o ensaio; este protocolo não autoriza uma declaração de conformidade WCAG.

## Papéis e independência

- Executor: pessoa que opera teclado, leitor de tela, zoom e dispositivo e coleta evidências.
- Revisor: pessoa diferente do executor que confere completude, resultados, achados e hashes.
- Responsável pelo aceite: Produto/UX ou Acessibilidade; decide somente sobre este escopo.
- Engenharia: corrige defeitos em commit separado e solicita reexecução dos casos afetados.

Uma mesma pessoa pode preparar o ambiente e apoiar tecnicamente, mas não deve assinar simultaneamente como executor e revisor.

## Estados e severidade

Resultados permitidos por caso:

- `PASS`: critério observado integralmente e evidência vinculada;
- `FAIL`: critério não atendido, com defeito registrado;
- `BLOCKED`: ambiente ou pré-condição impediu o ensaio, com justificativa;
- `N/A`: inaplicável ao caso, com justificativa aceita pelo revisor;
- `NOT RUN`: ainda não executado; nunca conta como aprovação.

Severidade dos defeitos:

| Nível | Definição operacional | Efeito |
|---|---|---|
| bloqueante | impede completar a jornada, causa aprisionamento, perda de conteúdo/controle ou risco de uso indevido | resultado geral `FAIL` |
| maior | barreira relevante sem alternativa equivalente, incluindo nome/papel/estado incorreto ou foco imprevisível | impede aceite até correção e reteste |
| menor | degradação localizada com alternativa operável e compreensível | pode gerar aceite limitado, se explicitamente justificado |

## Matriz mínima de ambiente

| ID | Ambiente | Obrigatoriedade |
|---|---|---|
| `ENV-WIN` | Windows físico + Chrome estável + NVDA, com versões registradas | obrigatória |
| `ENV-MAC` | macOS físico + Safari + Full Keyboard Access + VoiceOver, com versões registradas | obrigatória |
| `ENV-MOB` | ao menos um smartphone físico: Android + TalkBack ou iPhone + VoiceOver | obrigatória |
| `ENV-MOB-2` | segunda plataforma móvel física | recomendada; ausência permanece limitação explícita |

Emulação, WebKit Playwright, acesso remoto a uma VM sem áudio confiável ou inspeção de DOM não substituem os ambientes físicos acima. Indisponibilidade de ambiente obrigatório produz `BLOCKED`, não `PASS`.

## Pré-condições

1. Usar branch de trabalho e árvore Git limpa.
2. Registrar `git rev-parse HEAD`, branch, data/hora e sistema operacional.
3. Instalar dependências pelo lockfile com `npm ci` e executar `npm run build`.
4. Para desktop, servir o build localmente com `npm run preview -- --host 127.0.0.1 --port 4173`.
5. Confirmar banner/política G0, dados exclusivamente sintéticos e ausência de login ou integração remota.
6. Desligar extensões de navegador não necessárias e registrar qualquer exceção.
7. Usar somente personagens e respostas fictícias; nenhum nome, contato ou dado de trabalhador real pode aparecer em artefatos.
8. Copiar `MANUAL_ACCESSIBILITY_EXECUTION_TEMPLATE_G0.md` para um registro datado; não marcar resultados neste protocolo.

### Acesso seguro pelo dispositivo físico

O loopback `127.0.0.1` do computador não é acessível diretamente pelo telefone. Para `ENV-MOB`:

1. preferir encaminhamento USB para o loopback do dispositivo, quando a plataforma oferecer esse mecanismo;
2. se isso não for possível, usar rede local privada/isolada e vincular o preview somente à interface privada necessária;
3. limitar o acesso pelo firewall ao dispositivo de teste e encerrar o preview ao final;
4. não usar túnel público, URL compartilhável, deploy, serviço remoto ou Wi-Fi público;
5. confirmar no aparelho o banner G0 e que o fluxo público não enviou dado por `fetch`/XHR remoto;
6. registrar método, endereço privado, controles de rede e qualquer desvio no formulário.

O bundle deve conservar `VITE_DATA_MODE=synthetic` e o alvo de dados local. A exposição temporária do frontend estático na rede privada não autoriza alterar `dataGate`, apontar Supabase remoto ou habilitar autenticação/dados reais.

## Casos obrigatórios

### Teclado e foco — `ENV-WIN` e `ENV-MAC`

| ID | Procedimento | Critério de aceite |
|---|---|---|
| `KB-01` | Em cada rota, recarregar e pressionar `Tab` | o primeiro foco da página é “Ir para o conteúdo principal” e está visível |
| `KB-02` | Acionar o skip link com `Enter` | o foco chega ao conteúdo principal e a leitura visual não se perde |
| `KB-03` | Percorrer toda a rota com `Tab` e `Shift+Tab`, sem mouse | ordem preserva significado; foco é visível, não fica totalmente oculto e não há armadilha |
| `KB-04` | Operar links, botões e controles com teclas nativas | todos os controles essenciais funcionam sem gesto de ponteiro |
| `KB-05` | Na demo, iniciar, responder todas as perguntas, gerar a leitura e recarregar | fluxo é concluído por teclado; seleção é perceptível; resultado é sintético; reload descarta o estado |
| `KB-06` | Repetir `KB-01` a `KB-05` no Safari com Full Keyboard Access e “Press Tab to highlight each item on a webpage” ativos | links e controles entram na ordem completa; configuração e versão ficam registradas |

### Leitor de tela — NVDA/Chrome e VoiceOver/Safari

Executar sem consultar o DOM durante a avaliação. O Speech Viewer do NVDA ou recurso equivalente pode ser usado apenas para registrar a saída observada.

| ID | Procedimento | Critério de aceite |
|---|---|---|
| `SR-01` | Abrir cada rota e navegar por landmarks e headings | título, idioma, regiões e hierarquia permitem compreender página e estrutura |
| `SR-02` | Listar/navegar por links, botões e controles | nomes distinguem propósito; papel e estado são anunciados corretamente |
| `SR-03` | Acionar o skip link e retornar à navegação sequencial | bypass funciona e a posição lógica permanece compreensível |
| `SR-04` | Executar a demo do início ao resultado | instrução sintética, enunciado de cada grupo, opções e estado selecionado são anunciados |
| `SR-05` | Gerar a leitura demonstrativa | mudança de contexto/resultado é detectável sem exploração aleatória; heading e rótulo sintético são anunciados |
| `SR-06` | Recarregar a demo após concluir | resultado anterior não permanece e o estado inicial é compreensível |

### Zoom, reflow e percepção — navegadores físicos de desktop

O zoom deve ser o zoom nativo do navegador, não CSS `zoom`, DevTools ou mera redução da viewport.

| ID | Procedimento | Critério de aceite |
|---|---|---|
| `ZM-01` | Em cada rota, testar zoom a 200% | conteúdo e controles essenciais permanecem legíveis e operáveis, sem sobreposição ou corte |
| `ZM-02` | Em viewport desktop de 1280 CSS px, testar zoom a 400% | leitura ocorre em uma coluna equivalente a 320 CSS px, sem rolagem horizontal da página para conteúdo comum |
| `ZM-03` | Percorrer controles com teclado a 200% e 400% | foco permanece visível e não fica totalmente encoberto por conteúdo fixo |
| `ZM-04` | Ativar redução de movimento no sistema e repetir a entrada/conclusão da demo | não há movimento essencial ou pressão visual; fluxo permanece compreensível |

### Dispositivo móvel físico — `ENV-MOB`

| ID | Procedimento | Critério de aceite |
|---|---|---|
| `MO-01` | Abrir cada rota em retrato e paisagem | conteúdo essencial permanece disponível; não há corte, sobreposição ou gesto obrigatório não explicado |
| `MO-02` | Operar a rota por toque e ampliar conteúdo | alvos essenciais são acionáveis, zoom não é bloqueado e não há ativação acidental recorrente |
| `MO-03` | Com TalkBack ou VoiceOver, navegar por headings, controles e links | ordem, nomes, papéis e estados são compreensíveis |
| `MO-04` | Concluir a demo com o leitor de tela móvel | perguntas, seleção, CTA e resultado sintético são operáveis e anunciados |
| `MO-05` | Recarregar após a conclusão e alternar orientação | estado é descartado e o fluxo se recupera sem perda de contexto essencial |

## Coleta e integridade da evidência

Para cada caso, registrar resultado, observação, ambiente, defeito e pelo menos uma evidência verificável quando o comportamento não for trivial. Evidências úteis incluem captura de foco/zoom, gravação curta, transcrição do Speech Viewer e foto do dispositivo sem dados pessoais.

Convenção sugerida: `<execucao>_<caso>_<ambiente>_<sequencia>.<ext>`.

Os binários não devem ser adicionados ao Git sem política de retenção aprovada. Armazenar em repositório de evidências autorizado e registrar no formulário:

- URI ou caminho controlado;
- SHA-256;
- data/hora;
- autor da coleta;
- descrição suficiente para relacionar artefato e caso.

No PowerShell, o hash pode ser obtido sem alterar o arquivo com `Get-FileHash -Algorithm SHA256 -LiteralPath <arquivo>`.

## Critério de decisão

O registro pode receber `APROVADO NO ESCOPO` somente quando:

- `ENV-WIN`, `ENV-MAC` e ao menos um `ENV-MOB` foram executados em hardware físico;
- nenhum caso obrigatório está `NOT RUN`, `BLOCKED` ou `FAIL`;
- não há defeito bloqueante ou maior aberto;
- limitações, plataforma móvel ausente e defeitos menores estão explícitos;
- executor e revisor diferentes assinaram o registro;
- commit, versões e manifesto de evidências permitem reprodução;
- o responsável pelo aceite confirmou apenas o escopo manual público G0.

Qualquer outro resultado é `REPROVADO`, `BLOQUEADO` ou `INCOMPLETO`. Mesmo `APROVADO NO ESCOPO` não declara conformidade WCAG, não aprova G1 e não libera demo pública, produção ou dados reais.

## Tratamento de falhas e reteste

1. Registrar defeito com rota, ambiente, passos, resultado observado, resultado esperado, impacto no usuário, recomendação, prioridade, severidade e evidência.
2. Não corrigir durante a mesma execução sem preservar o resultado original.
3. Implementar correção em commit separado e executar o menor gate automatizado relevante.
4. Criar uma nova execução ou uma seção de reteste vinculada ao commit corrigido.
5. Reexecutar o caso falho e casos adjacentes suscetíveis a regressão.
6. Manter histórico; não sobrescrever evidência reprovada.

## Limitações conhecidas

- A amostra de ambientes não representa todas as combinações de navegador e tecnologia assistiva.
- Avaliação técnica não substitui teste de usabilidade com pessoas com deficiência.
- Contraste perceptual e compreensão de linguagem exigem julgamento humano e podem gerar achados além de WCAG.
- O protocolo público não cobre jornadas autenticadas nem módulos internos.
- A segunda plataforma móvel continua recomendada mesmo após o aceite mínimo.

## Rollback

Como a fatia é documental, o rollback consiste em reverter o commit que adicionou o protocolo e suas referências. Registros de execução já assinados devem ser preservados conforme a política de evidências; não devem ser apagados para ocultar resultado desfavorável.
