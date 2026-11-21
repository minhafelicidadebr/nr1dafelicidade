# Plano Fable 5 — Copiloto Supervisionado por Evidências

Data da avaliação: 29/06/2026  
Documento avaliado: `v2.0 - Copiloto supervisionado - de NR-1, SST, bem-estar científico e transformação organizacional.md`  
Estado: proposta arquitetural; **não aprovada para runtime**  
Gate vigente: G1 em execução, não aprovado; dados reais e IA remota continuam em No-Go.

## 1. Veredito executivo

O anexo contém uma direção estratégica valiosa: unificar Aurora, EstratÉGIA e experiências dos Drivers em um copiloto supervisionado, com núcleo determinístico, recuperação de fontes, citações verificáveis, avaliação contínua e revisão humana.

Ele não deve ser incorporado literalmente porque mistura três camadas diferentes:

1. achados históricos já corrigidos no repositório atual;
2. riscos ainda reais, principalmente Edge Functions abertas, histórico local e ausência de RAG governado;
3. arquitetura futura que depende de fontes, licenças, validação técnica, DPO/Jurídico, segurança e gates posteriores.

A decisão recomendada é criar um épico transversal chamado **Copiloto Supervisionado por Evidências**, subordinado aos gates existentes. A experiência deve operar o ciclo:

`perguntar → recuperar evidência permitida → compor afirmações verificáveis → apresentar incerteza → propor ação preliminar → obter revisão humana → registrar decisão → reavaliar`

O diferencial defensável não é “uma IA que sabe tudo”. É uma interface que deixa claro **o que sabe, de onde veio, o que não pode concluir, quem precisa revisar e qual evidência será produzida pela próxima ação**.

## 2. Auditoria das premissas do anexo

| Afirmação do anexo | Estado em 23/06/2026 | Decisão de integração |
|---|---|---|
| `npm ci` falha e lockfile é inconsistente | Superada | Não criar G(-1); `npm ci` e CI local estão verdes |
| 102 erros e 12 avisos de lint | Superada | ESLint está com zero erros e zero avisos |
| Um teste trivial | Superada | 126 testes Vitest e 206 asserções pgTAP estão verdes localmente |
| Bundle acima de 2 MB e avatar com 1,43 MB | Superada | Lazy loading, orçamento de 500 kB e avatar de 9,95 kB já aplicados |
| `risk_scores` expõe valores abaixo de `k` | Superada no schema local atual | A Privacy Vault revoga SELECT organizacional direto e libera apenas RPCs seguras; manter testes adversariais |
| Aurora busca `risk_scores` diretamente e filtra no navegador | Superada | `contextBuilder` usa `fetchSafeRiskScores` e a RPC `list_safe_risk_scores` |
| “RAG CANON” é texto estático | Corrigida localmente | Rótulo removido em `driver-dynamic`; conteúdo permanece legado e não aprovado até ingestão governada |
| Edge Functions de IA estão sem autenticação/CORS restrito | Superada localmente | Boundary compartilhado com autenticação, CORS restrito, schema, payload limit e quota; aprovação formal ainda pendente |
| Histórico de conversas fica em `localStorage` | Superada localmente | Retenção versionada com TTL, limite de interações, descarte e limpeza manual; política jurídica ainda pendente |
| Source Registry, catálogo de citações e evals de IA não existem | Confirmada | Construir por fatias, somente após contrato e fontes aprovados |
| Aurora é um núcleo seguro pronto | Parcial | O mecanismo determinístico é reutilizável; várias fontes, fórmulas e afirmações do catálogo ainda exigem revisão |

O nível honesto do copiloto permanece entre M0 e M1: há mecanismo determinístico e um rewrite limitado, mas não há recuperação governada, verificação sistemática de citações, suíte de evals de IA nem autorização uniforme nas funções generativas.

## 3. Decisão Fable 5

### Problema e resultado

Usuários de SST, ergonomia, gestão, CIPA e auditoria precisam transformar dados agregados e fontes aprovadas em entendimento, decisões e evidências sem receber diagnóstico, falsa certeza ou texto impossível de auditar.

O resultado operacional esperado é uma resposta estruturada que possa ser conferida, corrigida, aprovada e convertida em ação rastreável. A evidência produzida será um registro versionado de afirmações, citações, limitações, revisão e decisão.

### Lentes aplicadas

- **SST/ergonomia:** a IA não substitui trabalho real, AEP, AET, participação ou responsável técnico.
- **Privacidade/segurança:** somente agregados autorizados; `k ≥ 5`; nenhuma instrução recuperada pode acionar ferramentas.
- **Arquitetura/IA:** recuperação, geração, verificação e apresentação são camadas separadas e avaliáveis.
- **Produto/UX/acessibilidade:** progressão por camadas, linguagem clara, navegação por teclado, tabela equivalente e estados de supressão compreensíveis.
- **Metodologia/educação:** exemplos resolvidos, prática de recuperação, autoexplicação e revisão espaçada sem gamificação coercitiva.
- **Jurídico/regulatório:** fontes com jurisdição, vigência, licença e aprovação explícitas; toda saída crítica permanece preliminar.

### Alternativas

| Ramo | Valor | Risco | Custo | Decisão |
|---|---:|---:|---:|---|
| A — adicionar um chat com prompt maior | Baixo | Muito alto | Baixo | Rejeitar |
| B — construir RAG completo antes de endurecer IA | Alto | Muito alto | Alto | Rejeitar |
| C — protótipo visual sem persistência | Médio | Baixo | Baixo | Usar para testes de UX sintéticos |
| D — adiar toda IA até G3 | Baixo no curto prazo | Baixo | Baixo | Manter somente para capacidades remotas |
| E — comprar plataforma RAG pronta | Médio | Médio/alto | Alto | Avaliar depois de requisitos e DPIA |
| F — abstrair um motor de evidência e decisão | Muito alto | Controlável | Médio | **Escolhido** |

Decisão: construir primeiro um **motor genérico de evidência e decisão**, com uma fatia sintética de ponta a ponta. RAG vetorial, modelos externos e automação de ações ficam atrás de gates próprios.

Risco principal: uma interface sofisticada aumentar a confiança do usuário além da força real da evidência. Controle: estados explícitos de evidência, ausência de “percentual mágico de confiança”, revisão obrigatória e recusa quando a cobertura for insuficiente.

## 4. Arquitetura-alvo

```text
Interface de investigação
  → autenticação + tenant + papel + finalidade
  → roteador determinístico de intenção e risco
  → política de dados e ferramentas
  → contexto organizacional seguro (somente RPCs k-safe)
  → recuperação híbrida em fontes aprovadas
  → reranking e cobertura mínima de evidência
  → composição em contrato JSON tipado
  → verificador afirmação ↔ citação
  → política de recusa/limitação
  → camada opcional de voz
  → renderizador de narrativa e evidências
  → revisão humana + ledger + evals
```

### 4.1 Núcleo determinístico + voz opcional

O mecanismo determinístico decide:

- dados e fontes permitidos;
- limiar de anonimato e supressão;
- tipo de resposta e blocos obrigatórios;
- necessidade de revisão;
- proibições, recusa e escalonamento;
- ferramentas disponíveis e transições de estado.

O modelo generativo pode sintetizar ou reescrever somente dentro de um contrato estruturado. Ele não calcula scoring oficial, não cria fontes, não escolhe sozinho a base legal, não aprova documento e não executa ações externas.

### 4.2 Grafo de Evidência e Decisão

O “Tree of Thoughts runtime” do anexo deve ser substituído por um artefato auditável que não armazena nem revela raciocínio interno do modelo.

Cada execução registra apenas campos verificáveis:

- pergunta e finalidade;
- dados autorizados utilizados;
- afirmações finais;
- trechos-fonte e versões;
- alternativas operacionais consideradas;
- critérios objetivos de comparação;
- incertezas e lacunas;
- decisão recomendada;
- revisão, autoria e override;
- hash do snapshot final.

O modo de transparência mostra esse grafo, não cadeia de pensamento, prompts secretos ou rascunhos internos.

### 4.3 Modelo de dados proposto

Os nomes são indicativos e exigem ADR antes da migração:

| Capacidade | Entidades mínimas |
|---|---|
| Registro de fontes | `source_records`, `source_versions`, `source_approvals` |
| Conteúdo recuperável | `source_chunks`, `source_embeddings`, `source_links` |
| Execução | `assistant_runs`, `assistant_retrieval_events`, `assistant_claims` |
| Evidência | `claim_citations`, `citation_verifications` |
| Supervisão | `assistant_reviews`, `assistant_overrides` |
| Qualidade | `evaluation_sets`, `evaluation_cases`, `evaluation_results` |

Toda versão de fonte deve conter `source_type`, `authority_tier`, `jurisdiction`, `effective_from`, `effective_until`, `license_status`, `review_status`, `sha256`, `superseded_by`, `created_by` e `approved_by`.

## 5. RAG anti-alucinação

### 5.1 Ingestão governada

1. receber somente arquivo ou URL permitido;
2. registrar origem, autoria, licença, jurisdição e vigência;
3. tratar conteúdo como dado não confiável, nunca como instrução;
4. extrair e segmentar preservando página, seção, tabela e contexto;
5. gerar hash antes e depois da extração;
6. classificar autoridade e uso permitido;
7. revisar amostra e metadados;
8. publicar versão somente após aprovação competente;
9. invalidar embeddings quando a versão for substituída.

### 5.2 Recuperação

- filtros obrigatórios antes da busca: tenant, papel, finalidade, idioma, jurisdição, vigência e aprovação;
- busca híbrida lexical + vetorial;
- diversificação para evitar cinco trechos equivalentes;
- reranking separado;
- limite de contexto por fonte;
- cobertura mínima por tipo de afirmação;
- nenhum conteúdo individual ou abaixo de `k` entra no índice;
- fontes de organização e fontes públicas permanecem em espaços lógicos separados.

### 5.3 Geração verificável

Contrato de saída mínimo:

```json
{
  "answer_status": "supported | partial | insufficient | blocked",
  "summary": [],
  "claims": [
    {
      "text": "...",
      "claim_type": "fact | interpretation | recommendation",
      "citation_ids": [],
      "limitations": []
    }
  ],
  "recommended_next_step": "...",
  "requires_human_review": true
}
```

Cada afirmação crítica precisa de citação recuperada. O verificador confirma existência, versão, permissão, suporte textual e vigência. Se falhar, a afirmação é removida ou a resposta muda para `partial/insufficient`; nunca se “corrige” inventando outra fonte.

### 5.4 Defesa contra prompt injection

- documentos recuperados nunca alteram system policy;
- remover ou marcar instruções encontradas no corpus;
- separar contexto, instruções e dados no protocolo do modelo;
- bloquear URLs, comandos, credenciais e chamadas de ferramenta originadas no corpus;
- allowlist de ferramentas e parâmetros tipados;
- confirmação humana para mutações;
- testes com instrução maliciosa em PDF, metadados, HTML, tabela e texto invisível.

## 6. UX, IX e narrativa de dados

### 6.1 Três modos de leitura

1. **Decidir:** síntese executiva, decisão preliminar, risco, próximo passo e responsável.
2. **Entender:** explicação em camadas, exemplo aplicado, mecanismo e perguntas de autoexplicação.
3. **Auditar:** afirmações, fontes, versões, trechos, lacunas, overrides e histórico.

O mesmo conteúdo estruturado alimenta os três modos; não são três respostas independentes.

### 6.2 Anatomia premium de resposta

Ordem padrão:

1. resposta direta em até três linhas;
2. “o que os dados autorizados mostram”;
3. “o que não é possível concluir”;
4. visual principal com título declarativo;
5. evidências e fontes em cartões expansíveis;
6. ação recomendada com dono, prazo e evidência esperada;
7. revisão obrigatória e status;
8. trilha “como chegamos aqui” com o Grafo de Evidência e Decisão.

Funcionalidades de organização:

- sumário lateral e âncoras;
- recolher/expandir por nível de detalhe;
- alternar texto, gráfico e tabela acessível;
- fixar evidências e comparar versões;
- copiar bloco com metadados e citações;
- transformar recomendação aprovada em rascunho de ação;
- salvar pergunta, não resposta mutável, para reexecução versionada;
- exportar somente snapshots revisados.

### 6.3 Gramática de visualização

Cada visual responde uma pergunta específica:

- **estado atual:** barras ordenadas ou dot plot;
- **evolução:** linha com períodos comparáveis e quebra explícita quando metodologia muda;
- **priorização:** matriz contextual somente após critérios aprovados;
- **cadeia causal proposta:** diagrama hipótese → controle → indicador → evidência, rotulado como hipótese;
- **cobertura de fonte:** mapa de afirmações suportadas, parciais e bloqueadas;
- **supressão:** estado neutro “dados insuficientes para exibição”, sem sugerir zero risco.

Regras:

- título declara o achado, não o nome da métrica;
- número sempre inclui definição, período, população e versão;
- cor nunca é o único canal;
- tabela equivalente e descrição textual são obrigatórias;
- nenhuma animação celebra resultado psicossocial;
- vermelho representa prioridade de revisão, não diagnóstico de pessoas.

### 6.4 Ciência da aprendizagem

O modo “Entender” usa:

- segmentação e revelação progressiva;
- exemplo resolvido antes de tarefa complexa;
- pergunta de recuperação após a explicação;
- autoexplicação: “qual evidência sustenta esta decisão?”;
- contraste entre alternativa adequada e inadequada;
- feedback imediato baseado no contrato, não em elogio genérico;
- revisão espaçada de decisões e controles, vinculada ao ciclo operacional;
- transferência: aplicar o conceito a uma situação real e registrar evidência.

Não usar pontos, streaks, ranking, urgência artificial ou recompensa em fluxos sensíveis.

## 7. Jornada ponta a ponta

Estados:

`draft → classified → policy_checked → retrieving → evidence_checked → composed → blocked|ready_for_review → reviewed → approved|rejected → superseded`

Fluxo seguro:

1. usuário faz uma pergunta e escolhe finalidade;
2. sistema identifica papel, organização e escopo;
3. policy engine define fontes, dados, ferramentas e revisão;
4. contexto organizacional chega apenas por RPC autorizada;
5. recuperação retorna trechos aprovados;
6. cobertura insuficiente gera recusa útil;
7. compositor cria resposta tipada;
8. verificador valida afirmações e citações;
9. renderizador apresenta decisão, limites e evidências;
10. responsável técnico aprova, corrige ou rejeita;
11. somente a versão aprovada pode originar ação/documento;
12. execução e override entram no ledger e nos evals.

Falhas obrigatórias:

- sem autenticação: `401`;
- tenant incompatível: `403`;
- abaixo de `k`: nenhum valor atravessa a fronteira;
- fonte vencida/não aprovada: excluída antes da recuperação;
- citação sem suporte: resposta parcial ou recusada;
- serviço de modelo indisponível: fallback determinístico ou indisponibilidade explícita;
- risco de crise/denúncia: interromper copiloto e direcionar ao fluxo de cuidado separado;
- tentativa de mutação sem revisão: bloquear e registrar.

## 8. Estratégia por gates

### G1 — fundação de confiança, sem novo runtime de IA

- aprovar ADR do Copiloto e threat model;
- autenticar e autorizar todas as Edge Functions;
- CORS por allowlist de ambiente;
- validação tipada, limites de payload, timeout e rate limit;
- desligar funções generativas não conformes;
- eliminar histórico indefinido em `localStorage`;
- remover rótulos de RAG governado de conteúdo estático legado;
- inventariar e reclassificar todas as afirmações do catálogo Aurora;
- definir contrato JSON e estados de recusa;
- prototipar os três modos apenas com fixtures sintéticas.

### G2 — fatia local e sintética

- Source Registry mínimo e versionado;
- corpus pequeno de fontes públicas aprovadas para o experimento;
- recuperação lexical determinística antes de embeddings;
- Grafo de Evidência e Decisão;
- renderizador Decidir/Entender/Auditar;
- evals offline e ataques de prompt injection;
- nenhuma chamada externa ou dado de trabalhador.

### G3 — inferência remota controlada, condicionada a aprovações

- DPO/Jurídico/SST/Segurança/Metodologia aprovam finalidade e fornecedor;
- DPIA, retenção, localização, subprocessadores e contrato definidos;
- minimização/redação antes do envio ao modelo;
- zero treinamento do fornecedor com dados do cliente;
- rollout restrito, kill switch, observabilidade e rollback;
- corpus e consultas reais somente no escopo formalmente autorizado.

Gates posteriores devem ampliar corpus, perfis e ferramentas apenas quando metas de segurança, qualidade e usabilidade forem sustentadas por evidência. O anexo não autoriza avanço automático de gate.

## 9. Primeira fatia vertical recomendada

**Pergunta:** “Quais são os próximos passos seguros quando um ciclo sintético não atinge `k=5`?”

Por que esta fatia:

- usa política já implementada e testada;
- não exige scoring ou fonte psicométrica pendente;
- demonstra recuperação, recusa, explicação, ação e auditoria;
- testa linguagem para usuário vulnerável;
- permite fixture totalmente sintética.

Saída demonstrável:

- resumo direto;
- estado “dados insuficientes”, sem revelar contagem proibida;
- duas fontes aprovadas e versionadas;
- explicação curta de privacidade;
- opções operacionais sem coerção;
- ação preliminar com evidência esperada;
- grafo auditável e revisão humana.

## 10. Critérios de aceite e evals

### Segurança e privacidade

- 100% das funções retornam `401` sem JWT e `403` cross-tenant;
- 0 valores abaixo de `k` em payload, log, prompt, cache ou exportação;
- 0 instruções de corpus executadas como política ou ferramenta;
- 100% das mutações exigem permissão e confirmação humana;
- retenção e descarte testados.

### Assertividade e metodologia

- 100% das afirmações críticas têm citação válida ou são removidas;
- 100% das citações apontam para versão, trecho e hash recuperáveis;
- scoring e recomendações regulatórias sem fonte aprovada são bloqueados;
- benchmark de perguntas inclui resposta suportada, parcial, insuficiente e proibida;
- revisão independente de SST, ergonomia, metodologia e jurídico.

### UX, IX e aprendizagem

- tarefa crítica concluída por teclado e leitor de tela;
- nenhum usuário confunde “suprimido” com “sem risco” em teste representativo;
- usuário identifica fonte, limitação e responsável pela decisão;
- teste de compreensão e transferência supera baseline textual definido antes do piloto;
- responsividade validada em celular simples e rede lenta.

### Operação

- trace id de ponta a ponta;
- custo, latência e taxa de recusa observáveis;
- replay de eval reproduzível com versão de modelo, prompt, fonte e política;
- kill switch testado;
- CI e banco verdes no repositório oficial.

## 11. Backlog priorizado

| Ordem | Fatia | Gate | Estado |
|---:|---|---|---|
| 1 | ADR + threat model + contrato de resposta | G1 | Proposto |
| 2 | Hardening uniforme das seis Edge Functions | G1 | Implementado localmente; aprovação formal pendente |
| 3 | Retenção de conversa e descarte verificável | G1 | Implementado localmente; política jurídica pendente |
| 4 | Inventário e aprovação do catálogo Aurora | G1 | Pendente externo |
| 5 | Protótipo sintético dos três modos de leitura | G1 | Proposto |
| 6 | Source Registry mínimo | G2 | Bloqueado por G1 |
| 7 | Primeira resposta com evidência versionada | G2 | Bloqueado por G1 |
| 8 | Verificador de afirmação/citação e evals | G2 | Bloqueado por G1 |
| 9 | Retrieval híbrido e reranking | G2/G3 | Adiado até baseline lexical |
| 10 | Modelo externo e camada de voz | G3 | Bloqueado por aprovações |
| 11 | Perfis especializados e ferramentas | Pós-G3 | Adiado |

## 12. Referências de desenho a validar na aprovação

- NIST, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, NIST AI 600-1: <https://doi.org/10.6028/NIST.AI.600-1>
- OWASP GenAI Security Project, riscos de aplicações com LLM: <https://genai.owasp.org/>
- W3C, *Web Content Accessibility Guidelines 2.2*: <https://www.w3.org/TR/WCAG22/>
- Lewis et al., *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*: <https://arxiv.org/abs/2005.11401>
- Roediger III e Karpicke, *Test-Enhanced Learning*: <https://doi.org/10.1111/j.1467-9280.2006.01693.x>
- Fontes NR-1/NR-17, LGPD, instrumento e Work Wellbeing Playbook: somente versões canônicas registradas e aprovadas no Source/Instrument Registry.

Estas referências orientam arquitetura e avaliação; não substituem validação regulatória, jurídica, psicométrica ou técnica no gate correspondente.

## 13. Regra de decisão

Esta proposta pode entrar no Plano Mestre agora como **épico planejado e bloqueado por gates**. Não constitui aprovação de fonte, arquitetura final, fornecedor, modelo, uso de dados reais ou ativação de IA remota.

Próxima decisão formal: aprovar ou rejeitar a primeira fatia vertical, nomear responsáveis por SST, metodologia, privacidade, segurança, UX/acessibilidade e operação, e registrar o ADR antes de qualquer migração de schema.
