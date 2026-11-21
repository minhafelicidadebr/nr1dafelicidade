# Onda 0T — Biblioteca pública: referências em revisão

## Decisão

Esta é uma onda `MASTER`: a Biblioteca e o Explorador de referências expõem conteúdo de ciência, aprendizagem e bem-estar a público externo. A mudança alinha a apresentação desse conteúdo ao bloqueio de governança já existente, sem reclassificar fontes ou emitir conclusões técnicas.

## Problema

O registro local de prontidão de fontes informa que a sincronização permanece bloqueada enquanto faltarem fonte canônica, hash, licença, revisão técnica e aprovação de claims. Ainda assim, duas superfícies públicas chamavam o catálogo de “Biblioteca de Evidências” ou “Biblioteca Científica”, tratavam referências como verificadas e exibiam sínteses que ainda não passaram por essa revisão.

Isso criava uma contradição de confiança: o produto informava o limite de governança, mas a experiência visual poderia sugerir que ele já havia sido superado.

## Implementado

- A Biblioteca passa a se apresentar como referências catalogadas em revisão, não como evidências ou curadoria científica.
- O estado de acesso agora é explicitamente “informado pelo catálogo”; ele não representa qualidade, validação ou revisão da fonte.
- Resumos de referências ficam ocultos enquanto não houver revisão técnica e metodológica registrada. Título, autoria, veículo e link externo permanecem disponíveis para estudo exploratório.
- O VideoLab e o Explorador de referências na jornada de cada driver recebem o mesmo contrato de linguagem: referência externa, navegação pedagógica e ausência de conclusão técnica.
- O quiz/flashcard de fallback deixa de atribuir uma definição não revisada ao Playbook.
- O guardrail automatizado impede a volta de “Biblioteca de Evidências”, “curadoria científica”, resumos não revisados e os selos de URL/fonte verificada nas duas superfícies.

## Fora de escopo

- Não houve revalidação artigo a artigo, alteração em `scientificArticles`, coleta de novas fontes, classificação metodológica ou aprovação de claims.
- Não houve alteração de banco, RLS, autenticação, IA, Edge Functions, logs, pagamentos, dados reais ou gates.
- Nenhuma referência passa a ser recomendação técnica, fundamento de diagnóstico, prova de eficácia ou declaração de conformidade.

## Critérios de aceite

- A pessoa usuária entende, antes de abrir uma referência, que o catálogo está em revisão.
- Resumos catalogados não são renderizados em rotas públicas enquanto a revisão estiver pendente.
- Links externos continuam disponíveis com `noopener noreferrer`.
- O teste de claims protege as duas rotas públicas que renderizavam o catálogo.
- Typecheck, lint, testes, build, orçamento de bundle e auditoria de escopo continuam aprovados.

## Risco residual e rollback

- Metadados bibliográficos ainda são históricos e não foram auditados nesta onda; a presença de título, DOI ou URL não é atestado de autoria, método, qualidade ou aplicabilidade.
- Ao ocultar resumos, a descoberta fica mais conservadora até a revisão; o link externo preserva o caminho de estudo.
- Rollback: um único commit de interface, testes e documentação, sem migração, dado persistido, configuração remota ou impacto em dados reais.
