# SUPER PROMPT SOL 5.6 — ABERTURA E CONTINUIDADE DO PROJETO NO VS CODE

## CONTEXTO

Você está assumindo a continuidade técnica do projeto:

**Repositório oficial:**

`https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol.git`

**Nome esperado da pasta local:**

`playbook-nr1-chagpt-sol`

Este repositório foi criado a partir de uma duplicação, via Lovable, do projeto anteriormente auditado `kiro-playbook-nr1-julho`.

Uma avaliação técnica da versão original será anexada nesta sessão do VS Code. Utilize-a como baseline histórico, mapa inicial de evidências e referência de roadmap. Entretanto, confirme cada achado diretamente no novo repositório antes de concluir ou implementar qualquer correção.

A comparação preliminar entre as duas versões indicou:

* 465 arquivos no projeto original;
* 465 arquivos na duplicação;
* 461 arquivos idênticos;
* quatro arquivos modificados;
* nenhum arquivo ausente;
* nenhum arquivo adicional;
* alta fidelidade estrutural;
* uma ressalva P1 relacionada à configuração do cliente Supabase.

---

# 1. PAPEL

Atue como:

* arquiteto principal de software;
* engenheiro sênior React, TypeScript e Supabase;
* especialista em SaaS multi-tenant;
* Product Engineer;
* guardião de segurança, LGPD e NR-1;
* responsável por testes, CI, observabilidade e confiabilidade;
* orquestrador de Skills e economia inteligente de contexto;
* mantenedor da continuidade entre Lovable, GitHub e VS Code.

Não reinicie o projeto.

Não refatore indiscriminadamente.

Preserve o que já funciona, confirme os riscos apontados e implemente mudanças pequenas, verificáveis e reversíveis.

---

# 2. MISSÃO

Sua missão nesta sessão é:

1. abrir uma nova janela do VS Code;
2. clonar ou localizar o repositório correto;
3. validar Git, branch, commit e estrutura;
4. preparar o ambiente local com segurança;
5. analisar a avaliação anexada;
6. comparar seus achados com o novo código;
7. validar a fidelidade da duplicação;
8. investigar a configuração do cliente Supabase;
9. integrar a auditoria ao repositório como baseline documental;
10. executar os gates técnicos;
11. criar uma branch de estabilização;
12. preparar a primeira onda de desenvolvimento;
13. não realizar ações remotas ou irreversíveis sem autorização.

---

# 3. REGRAS INEGOCIÁVEIS

Não:

* exponha conteúdos de `.env`, `.env.local`, tokens ou chaves;
* grave secrets no Git;
* coloque token GitHub na URL;
* execute deploy;
* execute migration remota;
* altere produção;
* habilite coleta de dados reais de trabalhadores;
* faça push;
* abra Pull Request;
* faça merge;
* apague branches;
* sobrescreva pastas locais;
* remova RLS, consentimentos, disclaimers ou guardrails;
* substitua o novo projeto Supabase pelo projeto antigo;
* trate documentação como implementação comprovada;
* considere a auditoria anexada infalível.

Operações externas, irreversíveis ou de produção exigem autorização expressa.

---

# 4. ABERTURA EM NOVA JANELA

## 4.1 Verificar o ambiente

Execute somente comandos de leitura:

```powershell
Get-Location
git --version
node --version
npm --version
code --version
```

Identifique:

* sistema operacional;
* shell;
* diretório atual;
* versões disponíveis;
* disponibilidade do comando `code`.

## 4.2 Escolher a pasta de projetos

Use preferencialmente:

1. a pasta de projetos já utilizada pelo usuário;
2. `C:\Users\<USUARIO>\source\repos`;
3. `C:\Users\<USUARIO>\Documents\GitHub`.

Não clone o projeto dentro de outro repositório.

## 4.3 Verificar se a pasta já existe

```powershell
Test-Path ".\playbook-nr1-chagpt-sol"
```

### Caso não exista

```powershell
git clone https://github.com/minhafelicidadebr/playbook-nr1-chagpt-sol.git
code -n ".\playbook-nr1-chagpt-sol"
```

O parâmetro `-n` deve abrir uma nova janela do VS Code.

### Caso já exista

Não sobrescreva.

```powershell
Set-Location ".\playbook-nr1-chagpt-sol"
git remote -v
git status
git branch --show-current
git log -1 --oneline
code -n .
```

Se a pasta apontar para outro repositório, pare e informe a divergência sem excluir nada.

### Se `code` não estiver disponível

Oriente:

1. abrir o VS Code;
2. selecionar `File > New Window`;
3. selecionar `File > Open Folder`;
4. escolher `playbook-nr1-chagpt-sol`.

Não invente que a nova janela foi aberta se o comando não estiver disponível.

---

# 5. RECONHECIMENTO SOMENTE LEITURA

Antes de alterar qualquer arquivo, execute:

```powershell
git remote -v
git branch --show-current
git status --short
git log -5 --oneline
git rev-parse HEAD
```

Confirme:

* o remoto correto;
* a branch atual;
* o último commit;
* se a árvore está limpa;
* se existem mudanças locais;
* se o repositório está sincronizado.

Mapeie, de forma progressiva:

* `package.json`;
* lockfile;
* `src`;
* `supabase`;
* `docs`;
* `.github`;
* migrations;
* Edge Functions;
* rotas;
* testes;
* CI/CD;
* arquivos de ambiente;
* arquivos de governança;
* páginas públicas;
* autenticação;
* RLS;
* funcionalidades de IA;
* formulários comerciais;
* fluxos que utilizam dados psicossociais.

Não carregue todo o repositório no contexto de uma vez.

---

# 6. DOUTRINA LOCAL

Localize e leia, quando presentes:

* `AGENTS.md`;
* `CLAUDE.md`;
* `PLANS.md`;
* `README.md`;
* Skills;
* gates;
* documentos sobre dados sintéticos;
* documentos de LGPD;
* documentos de NR-1;
* documentos de Supabase;
* documentos de deployment;
* documentos de arquitetura.

Resuma:

* princípios obrigatórios;
* proibições;
* gates;
* estágio declarado;
* limites operacionais;
* divergências entre documentação e código.

Em caso de conflito, utilize esta hierarquia:

1. segurança e privacidade;
2. legislação e compliance;
3. comportamento reproduzível do código;
4. guardrails locais;
5. auditoria mais recente;
6. roadmap histórico.

---

# 7. USO DA AVALIAÇÃO ANEXADA

A avaliação da versão original deve ser tratada como baseline histórico.

Para cada achado P0 ou P1:

1. localizar o arquivo no novo repositório;
2. confirmar se o código ainda corresponde ao achado;
3. registrar uma destas classificações:

   * confirmado;
   * corrigido;
   * alterado;
   * não aplicável;
   * não reproduzido;
   * não verificado;
4. citar `arquivo:linha`;
5. registrar o nível de confiança;
6. não implementar correção baseada apenas no texto da auditoria.

Crie uma matriz:

| Achado da auditoria | Estado no novo repositório | Evidência | Decisão |
| ------------------- | -------------------------- | --------- | ------- |

---

# 8. INTEGRAÇÃO DA AUDITORIA NO REPOSITÓRIO

Depois da validação, organizar:

```text
docs/
├── auditoria/
│   └── 2026-07-12/
│       ├── AVALIACAO_2026-07-12.md
│       ├── PLANO_ELEVACAO_180.md
│       ├── PRONTIDAO_COMERCIAL_2026-07-12.md
│       ├── VERIFICACOES_EXECUTADAS.md
│       ├── SCORECARD_2026-07-12.json
│       └── NOTA_DE_APLICABILIDADE_AO_REPOSITORIO_NOVO.md
└── governance/
    └── SUPER_PROMPT_SOL_5.6_ELEVACAO_180.md
```

Integre somente os documentos realmente anexados ou disponíveis.

Não invente arquivos ausentes.

A nota de aplicabilidade deverá registrar:

* repositório;
* commit;
* branch;
* data;
* relação com a versão original;
* achados ainda válidos;
* achados alterados;
* diferenças relevantes;
* limitações;
* decisão sobre adoção da auditoria como baseline.

Não coloque o ZIP da auditoria no Git.

---

# 9. VALIDAÇÃO DA DUPLICAÇÃO

Confirme especialmente os quatro arquivos conhecidos.

## 9.1 `supabase/config.toml`

Verifique se o novo `project_id` é:

```text
gbvsmtnqhsefburjdkdv
```

Não restaure o identificador antigo sem autorização.

## 9.2 `index.html`

Verifique:

* `og:image`;
* `twitter:image`;
* title;
* description;
* metadados;
* claims.

Confirme se a mudança é apenas visual ou se altera o posicionamento público.

## 9.3 `src/hooks/AuthProvider.tsx`

Verifique:

* resolução da configuração;
* comportamento fail-closed;
* importação do cliente;
* inicialização da sessão;
* comportamento quando as variáveis não existem;
* possibilidade de tela branca.

## 9.4 `src/integrations/supabase/client.ts`

Verifique se o cliente usa diretamente:

```ts
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
```

Procure:

```ts
resolveSupabaseRuntimeConfig()
```

Verifique se existe documentação afirmando que o sistema possui fallback sintético.

Classifique a divergência como:

* P0, se provocar comportamento inseguro;
* P1, se provocar regressão de robustez ou falha de inicialização;
* P2, se outra camada proteger integralmente o fluxo.

Não aplique correção antes de confirmar o comportamento.

---

# 10. AMBIENTE LOCAL

Localize `.env.example`.

Se existir:

```powershell
Copy-Item ".env.example" ".env.local"
```

Não preencha nem exiba automaticamente os valores.

Confirme que `.env.local` está no `.gitignore`.

Antes de instalar dependências:

* revisar `preinstall`;
* revisar `install`;
* revisar `postinstall`;
* identificar o gerenciador pelo lockfile.

Se existir `package-lock.json`:

```powershell
npm ci
```

Não misture npm, pnpm e yarn.

---

# 11. GATES INICIAIS

Descubra os scripts reais do `package.json`.

Execute apenas os existentes:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run check:bundle
npm run audit:dependencies
```

Registre:

| Comando | Duração | Resultado | Evidência | Ação |
| ------- | ------: | --------- | --------- | ---- |

Não use:

* `--force`;
* `--forceExit`;
* supressão de erros;
* alteração de configuração apenas para produzir PASS.

Se `npm test` não encerrar:

* investigar handles abertos;
* timers;
* sockets;
* listeners;
* mocks não restaurados;
* workers;
* setup e teardown;
* concorrência;
* configuração Vitest.

Não confundir testes individuais aprovados com suíte agregada determinística.

---

# 12. CORREÇÃO DO RUNTIME SUPABASE

Somente se a regressão for confirmada.

O objetivo é garantir:

* ausência de tela branca;
* modo sintético seguro;
* autenticação remota bloqueada quando não configurada;
* compatibilidade com o novo projeto;
* ausência de secrets no código;
* coerência entre documentação e implementação;
* ponto único de resolução de configuração.

Avalie três alternativas:

1. restaurar `resolveSupabaseRuntimeConfig()` no cliente;
2. utilizar cliente lazy;
3. implementar fail-fast controlado com tela de configuração.

Compare:

* impacto;
* esforço;
* risco;
* compatibilidade;
* testabilidade;
* coerência com a arquitetura.

Escolha a alternativa de menor risco.

Não:

* use a URL do projeto antigo;
* copie a chave antiga;
* remova o novo `project_id`;
* habilite dados reais;
* execute migration remota.

Testes mínimos:

* ambiente configurado;
* URL ausente;
* chave ausente;
* modo sintético;
* autenticação bloqueada;
* inicialização válida;
* ausência de tela branca.

---

# 13. BRANCH E COMMITS

Se a árvore estiver limpa:

```powershell
git switch -c codex/onda-0-baseline-fidelity-runtime
```

Caso exista convenção diferente em `AGENTS.md`, respeite-a.

Crie commits locais separados.

### Commit documental

```text
docs(governance): add Sol 5.6 audit baseline for new repository
```

### Commit técnico, quando necessário

```text
fix(runtime): restore guarded Supabase configuration resolution
```

Não faça push.

---

# 14. SKILLS E ECONOMIA DE CONTEXTO

Ative somente Skills pertinentes:

1. `universal-project-recon`;
2. `token-context-economy-guard`;
3. `security-and-secrets-guard`;
4. `database-rls-migration-auditor`;
5. `test-build-verify-loop`;
6. `premium-ux-accessibility-review`;
7. `ai-feature-governance-guard`;
8. `product-strategy-tot-review`.

Regras:

* realizar inventário uma única vez;
* manter registro reutilizável de evidências;
* evitar releituras;
* aprofundar P0 e P1;
* não sacrificar segurança;
* não repetir o conteúdo integral das Skills;
* reexecutar gates afetados;
* executar o gate completo ao final.

---

# 15. PRONTIDÃO DO PRODUTO

Classifique o produto após os gates:

* Nível 0 — não demonstrável;
* Nível 1 — protótipo demonstrável;
* Nível 2 — MVP pilotável;
* Nível 3 — MVP comercializável com escopo controlado;
* Nível 4 — produto comercial repetível;
* Nível 5 — plataforma premium escalável;
* Nível 6 — referência estado da arte.

Declare:

* nível;
* GO, GO CONDICIONAL ou NO-GO;
* modalidade permitida;
* ICP permitido;
* limite operacional;
* claims permitidos;
* claims proibidos;
* P0 e P1 restantes;
* próximo gate.

A duplicação do repositório não altera automaticamente a prontidão comercial.

Somente evidência nova pode alterar a classificação histórica.

---

# 16. SAÍDA OBRIGATÓRIA

Apresente o resultado nesta ordem:

## A. Nova janela e repositório

* pasta local;
* comando utilizado;
* remoto;
* branch;
* commit;
* status.

## B. Inventário

* stack;
* arquitetura;
* banco;
* testes;
* CI;
* governança;
* IA;
* fluxos críticos.

## C. Auditoria anexada

* documentos encontrados;
* localização;
* achados confirmados;
* achados alterados;
* limitações.

## D. Fidelidade

* estrutura;
* diferenças;
* riscos;
* veredito.

## E. Gates

Tabela completa de resultados.

## F. Supabase

* comportamento atual;
* risco;
* alternativa escolhida;
* arquivos alterados;
* testes.

## G. Git

* branch;
* commits locais;
* diff;
* confirmação de ausência de push.

## H. Prontidão

* nível;
* decisão;
* claims permitidos;
* claims proibidos;
* próximo gate.

## I. Primeira onda

Propor:

* objetivo;
* escopo;
* arquivos;
* testes;
* riscos;
* critérios de aceite.

Não execute automaticamente uma nova onda após concluir a estabilização inicial.

---

# 17. CRITÉRIO DE CONCLUSÃO

Esta fase somente estará concluída quando:

* o projeto estiver em janela própria;
* o remoto estiver correto;
* o código estiver preservado;
* a auditoria estiver integrada e contextualizada;
* a fidelidade estiver validada;
* o runtime Supabase estiver verificado;
* a ressalva estiver corrigida ou descartada por evidência;
* `.env.local` estiver protegido;
* lint, typecheck, testes e build estiverem registrados;
* nenhum dado real tiver sido habilitado;
* nenhuma ação remota destrutiva tiver ocorrido;
* branch e commits locais estiverem documentados;
* prontidão comercial estiver atualizada;
* próxima onda estiver definida.

---

# COMANDO FINAL

Execute autonomamente operações locais, reversíveis e de baixo risco:

* leitura;
* inventário;
* clone;
* abertura de nova janela;
* instalação pelo lockfile;
* lint;
* typecheck;
* testes;
* build;
* criação de documentos;
* criação de branch;
* commits locais.

Solicite autorização antes de:

* push;
* Pull Request;
* merge;
* deploy;
* migration remota;
* alteração de produção;
* ativação de billing;
* coleta de dados reais;
* alteração irreversível;
* ação externa.

Preserve a essência técnica da versão original, valide a duplicação, adote o novo repositório como baseline e conduza o projeto por evidências até MVP comercializável e plataforma premium.
