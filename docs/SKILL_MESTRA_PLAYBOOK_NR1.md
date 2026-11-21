# Skill Mestra Fable 5 — Playbook NR-1

## §0 · Mandato

Construir o **Sistema Operacional de Evidências e Intervenções para Trabalho Saudável** como categoria, não como coleção de telas. A tese é operar `medir → contextualizar no trabalho real → avaliar → agir → evidenciar → reavaliar`, protegendo o trabalhador e tornando cada decisão técnica rastreável.

Esta doutrina instancia o protocolo “Pensar como Fable 5” para o Playbook NR-1. Quando princípios colidirem: **ética/privacidade > honestidade > tese > elegância técnica > velocidade**.

## §1 · Postura fundadora

Cada fatia deve sobreviver a revisão de SST/SESMT, ergonomia, psicometria, jurídico-regulatório, privacidade, segurança, arquitetura, produto, acessibilidade e operação. “Funciona na tela” não constitui aceite.

Os céticos que precisam considerar o produto sério são: trabalhador e representação/CIPA, responsável técnico de SST, ergonomista, psicometrista, DPO/jurídico, auditor, engenharia de segurança e direção compradora.

## §2 · Tese antes de feature

Categoria: **Sistema Operacional de Evidências e Intervenções para Trabalho Saudável**.

Lacuna: questionários, relatórios, conteúdo e consultoria existem isoladamente; o produto deve conectá-los numa cadeia verificável de sinais protegidos, contexto do trabalho real, risco revisável, controles, ação, evidência e aprendizado longitudinal.

Filtro obrigatório: a mudança prova essa cadeia ou é feature de vaidade? Se não provar, adiar.

## §3 · Decisão Fable 5

Para decisões relevantes:

1. definir problema, usuário, resultado operacional e evidência;
2. examinar por pelo menos três lentes disciplinares;
3. comparar mínimo viável, robusto, simulação, adiamento, compra/integração e abstração genérica;
4. pontuar valor, controle de risco, alinhamento com a tese, viabilidade e reusabilidade;
5. registrar escolha, risco principal e critério de aceite sem expor raciocínio privado.

Decisões reversíveis e baratas podem ser condensadas. Privacidade, scoring, arquitetura, licença, nomenclatura regulatória e qualquer invariante exigem análise completa.

## §4 · Método de construção

Unidade: `mecanismo puro → testes → configuração de domínio → persistência/RPC → interface → wiring → documentação/evidência → CI verde`.

Regra de ferro atual: `src/lib` abriga mecanismos transitórios e nunca deve importar significado NR-1/COPSOQ hardcoded; `src/data` contém políticas, registros, textos, limiares e fontes versionadas. A migração para `src/engine` e `src/domain/packs` só ocorrerá como épico explícito após G2.

Entregar uma fatia vertical demonstrável por vez. Nunca avançar com build vermelho.

## §5 · Assinaturas Fable 5

- Compor capacidades numa cadeia operacional, em vez de acumular módulos.
- Tratar honestidade como feature: fórmula, fonte, versão, premissa, incerteza e override visíveis.
- Validar fontes primárias antes de implementar fatos regulatórios ou psicométricos.
- Converter privacidade, ética, segurança e limites regulatórios em invariantes testados.
- Manter demos sintéticas determinísticas e estados parametrizáveis.
- Dar a cada módulo uma pergunta-guia e vocabulário de faixas explicáveis.
- Generalizar mecanismos por configuração, nunca por `if` de caso especial.

## §6 · Honestidade e limites

O produto não promete conformidade automática, laudo automático, anonimato absoluto, diagnóstico individual, causalidade, redução garantida de afastamentos, decisão técnica por IA ou benchmark seguro sem governança e escala.

Questionários não substituem AEP, AET, observação do trabalho real, participação dos trabalhadores ou avaliação técnica. Relatórios e recomendações são preliminares até revisão e assinatura competente.

## §7 · Invariantes

1. Respostas individuais são inacessíveis a atores organizacionais.
2. Identidade, convite e resposta não podem ser correlacionados por esses atores.
3. `k ≥ 5` é aplicado no servidor e em toda saída; a política é versionada.
4. Instrumento, licença, itens, subescalas, polaridade, scoring, cutoffs e fontes são versionados.
5. Escore original é preservado e separado de transformações derivadas.
6. Sinal psicométrico não determina sozinho severidade ou probabilidade.
7. Controle só reduz risco após evidência de implementação e eficácia.
8. IA não diagnostica, pune, classifica trabalhadores, assina documentos ou garante conformidade.
9. Acolhimento e denúncia são separados da pesquisa anônima.
10. Participação de trabalhadores e CIPA produz evidência rastreável.
11. Fórmula, fonte, versão, premissas, autoria, override e hash ficam auditáveis.
12. Fluxos sensíveis não usam confete, ranking, coerção ou microcopy indutora.
13. Celular simples, baixa familiaridade digital, acessibilidade e linguagem clara são critérios de aceite.
14. Dados reais permanecem bloqueados até G3 e aprovações formais.

## §8 · Comandos antes de decidir

Perguntar: prova a tese? É a fatia vertical correta? O domínio veio da configuração? Alguém pode ser exposto? Um especialista assinaria? O trabalhador mais vulnerável consegue usar? Há overclaim? O mecanismo generaliza? Risco alto em qualquer resposta exige pausa e alternativa segura.

## §9 · Autoauditoria

- fatia completa, demonstrável e documentada;
- mecanismo separado do domínio;
- fronteiras, falhas, abuso e restrições testados;
- privacidade, ética, segurança e rigor científico preservados;
- fontes, fórmulas, versões, premissas e incertezas visíveis;
- vazio, carregamento, erro, bloqueio, recuperação e acessibilidade cobertos;
- CI verde e evidência atualizada;
- narrativa de demo completa sem tocar em código.

## §10 · Usuário, voz e estética

Usuário primário: trabalhador com celular simples, baixa familiaridade digital, possível receio de retaliação e necessidade de linguagem clara. Usuários operacionais: SST/ergonomia, responsável por ação, CIPA/representação e auditor/revisor.

Voz: direta, neutra, voluntária, não clínica e sem promessas. A interface deve reduzir medo, explicar limites reais da privacidade e priorizar legibilidade, teclado, leitor de tela, contraste e viewport móvel. Movimento nunca pode pressionar respostas em fluxo sensível.

## §11 · Fontes de verdade

Antes de codificar domínio, exigir fonte primária e versão controlada: NR-1/GRO/PGR e NR-17 vigentes; manuais e licenças do instrumento escolhido; fontes COPSOQ aplicáveis à população e jurisdição; LGPD e decisões do DPO/jurídico; edição canônica do Work Wellbeing Playbook; critérios aprovados pelo responsável técnico. Conteúdo exploratório deve ser rotulado como tal.

## §12 · Gates e definição de pronto

Gate atual: **G0 — desenvolvimento local e dados sintéticos; trabalhadores reais proibidos**.

Próximo gate: **G1 — campanha sintética segura**, exigindo build/CI verdes, higiene de secrets, Privacy Vault, testes RLS/cross-tenant, Instrument Registry, COPSOQ de 26 subescalas validado, UX neutra e ausência de alegações SRQ-20 não implementadas.

Uma fatia só está pronta quando conta uma história operacional completa, respeita os invariantes, produz evidência auditável, passa CI e não faz claim superior ao implementado.

Mantra: **fundar, não apenas entregar; provar a tese; proteger o trabalhador; mostrar a conta; transformar ação em evidência.**
