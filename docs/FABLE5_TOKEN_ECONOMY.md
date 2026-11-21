# Fable 5 Token Economy — ToT Compacto

## Objetivo

Economizar tokens sem reduzir a inteligência premium da Fable 5. A regra é usar Tree of Thoughts como roteador de rigor, não como ritual completo em toda tarefa.

## Árvore de Decisão

Antes de agir, avalie três ramos e escolha o menor modo seguro:

| Modo | Use quando | Não use quando |
|---|---|---|
| `LITE` | ajuste local, reversível, UI/copy/teste/refactor pequeno, padrão existente | aparecer qualquer gatilho sensível |
| `SPRINT` | fatia vertical delimitada, mais de um arquivo/fluxo, arquitetura existente | alterar contrato crítico ou decisão duradoura |
| `MASTER` | arquitetura, banco, RLS, autenticação, LGPD, k-anonimato, scoring, IA/RAG, fonte, documento auditável, norma, algoritmo ou gate | tarefa local e reversível |

Saída obrigatória antes de implementar:

`[Modo: LITE|SPRINT|MASTER] Justificativa: uma frase.`

## Gatilhos Master

Escalar para `MASTER` se a tarefa tocar em:

- dados reais, trabalhadores reais, campanha real ou gate;
- respostas, convites, identidade, anonimato ou `k < 5`;
- schema, migration, RLS, RPC, Edge Function, auth, secrets ou storage;
- LGPD, retenção, descarte, consentimento, incidente, acesso emergencial;
- instrumento, fonte, licença, subescala, scoring, cutoff, fórmula;
- AEP, AET, GRO/PGR, documento auditável, revisão técnica;
- risco residual, controles, eficácia, probabilidade ou severidade oficial;
- IA, RAG, modelo externo, prompts, evals, claims científicos/regulatórios;
- promessa de conformidade, diagnóstico, causalidade, resultado ou anonimato absoluto.

## Protocolo por Modo

### LITE

- Ler apenas arquivos diretamente necessários.
- Fazer a menor alteração integral.
- Não criar ADR, documentação ampla ou abstração nova.
- Validar com teste específico, typecheck ou lint conforme impacto.
- Se surgir gatilho sensível, parar e reclassificar.

### SPRINT

- Ler contexto do fluxo e padrões próximos.
- Comparar até três alternativas se houver decisão real.
- Entregar fatia vertical: mecanismo/serviço → tipos/configuração → UI/wiring → estados → testes.
- Preservar separação mecanismo/domínio.
- Documentar evidência curta se afetar operação, gate ou governança.

### MASTER

- Ler `docs/SKILL_MESTRA_PLAYBOOK_NR1.md`, registros de gate e fontes de verdade necessárias.
- Comparar ramos: mínimo viável, robusto, simular, adiar, comprar/integrar, abstrair.
- Registrar decisão verificável, riscos, mitigação, rollback e critérios de aceite.
- Implementar uma única fatia vertical.
- Converter invariantes em testes, permissões, contratos ou documentação auditável.

## Orçamento de Contexto

- `LITE`: arquivos-alvo e teste relacionado.
- `SPRINT`: arquivos-alvo, padrão similar, API/serviço usado e doc curta relevante.
- `MASTER`: constituição, skill mestra, registros de gate, contratos, migrations, fontes e docs específicos.

Evitar varredura ampla do repositório sem necessidade demonstrável.

## Qualidade Mínima

Mesmo em `LITE`, preservar:

- privacidade, ética e honestidade;
- ausência de overclaim;
- padrões existentes;
- validação proporcional;
- registro claro de risco residual.

## Integração com Skill Global

A skill global `fable5-token-router` replica este roteador para uso fora deste repositório. Este documento é a fonte local do projeto.
