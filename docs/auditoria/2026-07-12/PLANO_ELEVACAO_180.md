# PLANO DE ELEVAÇÃO 180 — KIRO PLAYBOOK NR-1 JULHO

**Baseline:** 7.28/10  
**Natureza da Elevação 180:** ambição de avanço sistêmico; não é promessa matemática de +180%.  
**Meta operacional premium:** nenhuma fratura P0 aberta; lentes críticas ≥ 8/10; evidência E2/E3 para fluxos centrais; produto comercial repetível e governado.

---

## 1. Decisão Tree of Thoughts — síntese

Foram comparadas quatro rotas:

| Rota | Vantagem | Risco | Decisão |
|---|---|---|---|
| A. Vender o SaaS imediatamente | receita mais rápida | dados reais, claims e operação não aprovados | rejeitada |
| B. Esperar a plataforma premium completa | risco mínimo | atraso de mercado e aprendizado | rejeitada |
| C. Promover descoberta + demo sintética + design partner governado | valida mercado sem dados reais | exige copy e intake corretos | **escolhida agora** |
| D. Piloto pago controlado após gates | receita e prova real | depende de método, LGPD e operação | **segunda etapa** |

A estratégia escolhida é um **duplo trilho**:

- **Trilho comercial responsável:** descoberta, demonstração sintética, diagnóstico de prontidão e preparação de design partners.
- **Trilho premium:** método aprovado, real data gate, operações, observabilidade, billing, integrações e IA supervisionada.

---

# ONDA 0 — CORREÇÃO DE CONFIANÇA PÚBLICA

**Pergunta-guia:** a página pública diz exatamente o que o produto pode provar hoje?

### Objetivo

Eliminar claims desatualizados, ambíguos ou sem fonte e ampliar o guardrail automatizado.

### Escopo

- substituir “Ciência de Oxford” por formulação de referência bibliográfica não afiliativa;
- retirar ou comprovar “3.000+ artigos” em registry versionado;
- trocar “ciclo de diagnóstico” por “ciclo de avaliação” ou “levantamento de fatores”;
- atualizar a data da NR-1 para 26/05/2026;
- retirar “multas de até R$ 100 mil” até existir parecer jurídico e contexto;
- qualificar “plataforma” como “plataforma em maturação / demonstração sintética” onde necessário;
- incluir `index.html`, metadados e data files no teste de claims.

### Alternativas consideradas

1. remover todos os claims científicos;
2. manter claims com notas de rodapé;
3. criar registry central de claims com fonte, validade, responsável e superfície.

**Escolha:** alternativa 3, com remoção temporária dos claims sem evidência.

### Critérios de aceite

- teste falha para multa fixa, data desatualizada, afiliação Oxford e “diagnóstico” indevido;
- nenhuma superfície pública fica fora da varredura;
- cada claim sensível possui fonte, data e responsável;
- revisão jurídica/regulatória registrada.

### Prova de demo day

Abrir home, SalesPage e metadados; exibir o ledger de claims e o teste verde.

### Efeito estimado

Narrativa +0,4 a +0,7; Marketing +0,5 a +0,9; Regulação +0,4 a +0,8.

---

# ONDA 1 — CI DETERMINÍSTICO E RECIBO DE RELEASE

**Pergunta-guia:** uma terceira pessoa consegue reproduzir a qualidade com um comando e receber um recibo completo?

### Objetivo

Corrigir o hang da suíte agregada e transformar a validação em evidência portátil.

### Escopo

- identificar handles/processos que impedem o encerramento do Vitest;
- configurar teardown e timeouts;
- dividir testes em shards;
- gerar JUnit/JSON e sumário;
- adicionar smoke E2E em browser para home, login, demo sintética, lead intake e bloqueio de dados reais;
- executar axe em rotas prioritárias;
- registrar commit, Node/npm, ambiente e artefatos.

### Critérios de aceite

- `npm run ci` encerra em faixa previsível;
- 44/44 testes passam agregados;
- smoke E2E e axe passam;
- artefato de release vinculado ao commit;
- nenhum deploy ou migration é realizado sem gate.

### Prova de demo day

Rodar o pipeline e exibir relatório único com build, testes, bundle e smoke.

### Efeito estimado

Engenharia +0,5 a +0,8; SaaS +0,3 a +0,6; UX/Acessibilidade +0,3 a +0,6.

---

# ONDA 2 — FAST LANE COMERCIAL SEM DADOS DE TRABALHADORES

**Pergunta-guia:** como captar compradores agora sem vender algo que o produto ainda não pode executar?

### Objetivo

Criar uma oferta comercial legítima para descoberta e demonstração sintética.

### Oferta permitida

**“Diagnóstico Executivo de Prontidão NR-1 + Demonstração Sintética + Roadmap de Implantação”**

Não inclui:

- questionário com trabalhadores;
- tratamento de dados psicossociais reais;
- laudo;
- conformidade;
- inventário de riscos final;
- recomendação técnica assinada pelo software.

### Escopo técnico e operacional

- substituir fila local por canal remoto aprovado;
- consentimento, finalidade, retenção e descarte do lead;
- calendário/reunião;
- CRM com DPA e perfis de acesso;
- roteiro de demonstração de 12–15 minutos;
- proposta, escopo, não escopo e termo de aceite;
- ledger de leads e conversão;
- capacidade semanal explícita.

### Critérios de aceite

- lead chega à equipe e recebe recibo;
- exclusão/retention testada;
- zero dado de trabalhador no intake;
- oferta e contrato distinguem consultoria de prontidão, demo e produto operacional;
- analytics do funil sem dados sensíveis;
- responsável comercial e DPO/jurídico aprovam.

### Decisão comercial após a onda

**GO CONDICIONAL** para comercializar o serviço de prontidão e preparação de design partner.  
O produto continua **NO-GO** para operação com trabalhadores.

### Prova de demo day

Lead real de teste → consentimento → CRM → agendamento → demo sintética → proposta gerada.

### Efeito estimado

Modelo de negócio +0,7 a +1,2; Marketing +0,9 a +1,4; SaaS +0,2 a +0,4.

---

# ONDA 3 — PACOTE METODOLÓGICO CANÔNICO

**Pergunta-guia:** cada item, escore e interpretação resiste à revisão de psicometria, SST e jurídico?

### Objetivo

Converter o instrumento exploratório em pacote aprovado e versionado.

### Escopo

- fonte primária;
- licença e limites de uso;
- itens e subescalas;
- polaridade;
- scoring;
- missing data;
- cutoffs/faixas;
- fixtures golden;
- hash de conteúdo;
- versionamento;
- revisão psicométrica;
- revisão SST/ergonomia;
- revisão jurídica;
- política de mudança e retirada.

### Critérios de aceite

- manifesto completo e assinado;
- fixtures reproduzem os escores esperados;
- versão draft não pode criar campanha;
- versão aprovada só opera dentro da jurisdição e população definidas;
- documentação explica que questionário não substitui AEP/AET.

### Prova de demo day

Selecionar um caso sintético, recalcular escore e mostrar fonte, versão, hash e revisão.

### Efeito estimado

Regulação +0,8 a +1,3; Educação +0,4 a +0,8; IA +0,2 a +0,4; SaaS +0,3 a +0,6.

---

# ONDA 4 — MVP SINTÉTICO PILOTÁVEL

**Pergunta-guia:** um design partner consegue experimentar a jornada completa sem dados reais e sem assistência de engenharia?

### Objetivo

Sair de protótipo demonstrável para MVP sintético pilotável.

### Escopo

- tenant sintético provisionável;
- personas e cenários determinísticos;
- jornada completa mensurar → contextualizar → avaliar → agir → evidenciar;
- browser E2E;
- exportações marcadas como sintéticas;
- painel de readiness;
- feedback estruturado;
- suporte e runbook;
- limites de capacidade.

### Critérios de aceite

- design partner conclui a jornada sem intervenção técnica;
- nenhum endpoint externo recebe dados de trabalhador;
- todo artefato carrega marca sintética;
- erros possuem recuperação;
- métricas de ativação e entendimento são coletadas.

### Decisão comercial após a onda

**GO** para design partners sintéticos, gratuitos ou contratados como serviço de descoberta conforme termos aprovados.  
**NO-GO** para dados reais.

### Efeito estimado

UX +0,5 a +0,9; Produto/Negócio +0,4 a +0,8; SaaS +0,4 a +0,7.

---

# ONDA 5 — GATE G3 E PILOTO REAL CONTROLADO

**Pergunta-guia:** é possível tratar dados reais de maneira legal, segura, reversível e tecnicamente responsável?

### Dependências obrigatórias

- pacote metodológico aprovado;
- DPO/jurídico;
- accountables;
- base legal e transparência;
- retenção e descarte;
- incidente e DR exercitados;
- RLS/pgTAP e concorrência validados;
- browser E2E;
- responsável técnico;
- participação de trabalhadores/CIPA;
- contrato e DPA;
- observabilidade.

### Escopo

- piloto de organização única ou coorte restrita;
- limites de usuários e ciclos;
- canais de suporte;
- consentimento;
- k-anonimato;
- revisão técnica obrigatória;
- rollback;
- auditoria e logs;
- plano de incidente.

### Critérios de aceite

- gate formal G3 assinado;
- nenhuma resposta individual acessível;
- teste cross-tenant e race condition passa;
- incidente simulado;
- relatório é preliminar e requer revisão competente;
- suspensão do piloto é exercitada.

### Decisão comercial após a onda

**GO CONDICIONAL** para piloto pago controlado, dentro do contrato, capacidade e população aprovados.

### Efeito estimado

SaaS +0,8 a +1,3; Regulação +0,7 a +1,1; Modelo de negócio +0,6 a +1,0.

---

# ONDA 6 — PRODUTO COMERCIAL REPETÍVEL

**Pergunta-guia:** o segundo, terceiro e décimo cliente recebem o mesmo valor com controle de custo e risco?

### Escopo

- onboarding;
- provisioning;
- billing;
- planos e limites;
- suporte;
- SLO/SLA;
- observabilidade;
- health dashboard;
- trilha de auditoria;
- gestão de capacidade;
- exportações;
- documentação;
- customer success;
- métricas de retenção e expansão.

### Critérios de aceite

- onboarding sem engenharia;
- custos por tenant medidos;
- faturamento e cancelamento testados;
- SLO e alertas ativos;
- runbook de suporte;
- capacidade máxima conhecida;
- três ciclos de operação sem P0.

### Decisão comercial após a onda

**GO** para aquisição repetível no ICP aprovado.

---

# ONDA 7 — PLATAFORMA PREMIUM ESTADO DA ARTE

**Pergunta-guia:** qual capacidade é defensável, mensurável e difícil de copiar?

### Escopo

- Evidence Graph longitudinal;
- IA supervisionada com RAG de fontes aprovadas;
- evals e red teaming;
- explicabilidade e citations;
- interoperabilidade;
- APIs e integrações;
- benchmarking governado;
- experimentos de eficácia;
- acessibilidade WCAG comprovada;
- performance mobile;
- governance cockpit;
- marketplace/rede validada somente após governança própria.

### Critérios de aceite

- IA possui evals, limites de custo e fallback;
- nenhuma recomendação sensível sem revisão humana;
- dados e fontes são versionados;
- acessibilidade e performance auditadas;
- outcomes são medidos sem promessas causais;
- score global ≥ 8,8 e lentes críticas ≥ 8,0.

---

# 2. Backlog prioritário

| Prioridade | Item | Tipo | Gate |
|---:|---|---|---|
| 1 | corrigir claims NR-1, Oxford, multas, diagnóstico e metadados | P1 confiança | Onda 0 |
| 2 | ampliar teste de claims para toda superfície pública | P1 governança | Onda 0 |
| 3 | corrigir encerramento da suíte Vitest | P1 release | Onda 1 |
| 4 | adicionar browser smoke E2E + axe | P1 UX/release | Onda 1 |
| 5 | implantar intake remoto com DPA/retention | P0 comercial | Onda 2 |
| 6 | formalizar oferta e termos de descoberta | P0 comercial | Onda 2 |
| 7 | aprovar pacote metodológico canônico | P0 regulatório | Onda 3 |
| 8 | executar Supabase local, pgTAP, race e recovery | P0 segurança futura | Onda 3/5 |
| 9 | formalizar accountables e autoridade | P0 governança | Onda 3/5 |
| 10 | implementar observabilidade, incidente e DR | P0 produção | Onda 5 |
| 11 | liberar dados reais somente por gate assinado | invariante | Onda 5 |
| 12 | billing/onboarding/ops repetíveis | P1 escala | Onda 6 |

---

# 3. Métricas de elevação

Acompanhar:

- P0/P1 abertos;
- gates superados;
- cobertura E2/E3;
- duração do CI;
- taxa de conclusão da demo;
- leads válidos;
- reuniões agendadas;
- conversão para design partner;
- tempo até primeiro valor;
- incidentes;
- custo por tenant;
- taxa de supressão por k;
- erros de claim;
- accessibility violations;
- satisfação e compreensão;
- progresso do scorecard.

---

# 4. Regra final

Não transformar a urgência comercial em liberação de dados reais. A rota mais rápida e segura para receita é **vender prontidão, implantação e descoberta com demonstração sintética**, enquanto os gates metodológicos e operacionais avançam.

O MVP deste projeto não é “um formulário que roda”. É a menor cadeia capaz de:

> medir com método aprovado → proteger identidades → contextualizar o trabalho → apoiar decisão humana → registrar ação e evidência → reavaliar.

Até essa cadeia estar aprovada para dados reais, o produto deve continuar fail-closed.
