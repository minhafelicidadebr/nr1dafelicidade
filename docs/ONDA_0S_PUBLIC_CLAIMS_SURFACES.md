# Onda 0S — Superfícies públicas, claims e limites verificáveis

## Decisão

Expandir o guardrail de claims para páginas e componentes públicos de aprendizagem, onboarding, IA, documentos e matriz exploratória; remover promessas de validação, ROI, eficácia, diagnóstico e precisão científica que não estavam amarradas a uma fonte/versionamento revisável.

Esta é uma onda `MASTER`: altera comunicação científica, regulatória, financeira e de IA visível ao público. Não altera banco, RLS, autenticação, prompts, modelo, Edge Functions, logs, fontes de dados, dados reais, pagamentos ou gate.

## Problema e resultado operacional

Uma pessoa compradora podia encontrar, na mesma demonstração sintética:

- uma promessa de ROI calculado a partir de premissas não versionadas;
- menções a instrumentos “validados” antes da aprovação metodológica;
- estatísticas e atribuições de IA sem o contexto de fonte e limite;
- uma classificação incorreta de burnout como doença ocupacional;
- páginas públicas que não estavam cobertas pelo guardrail existente.

O resultado agora é uma narrativa de alta conversão baseada em transparência: `contexto → ação → evidência → reavaliação`, sempre com revisão humana explícita.

## Lentes consideradas

- **Produto e UX:** confiança é mais valiosa que um número chamativo que o comprador não consegue auditar.
- **SST, ergonomia e regulação:** nenhuma tela pode substituir AEP, AET, análise das condições de trabalho ou responsável competente.
- **Ciência e fontes:** uma referência externa pode orientar estudo, mas não valida, afilia ou chancela este produto.
- **IA e privacidade:** o assistente deve expor que pode errar, não diagnostica e não deve receber dados pessoais ou relatos identificáveis.
- **Operação:** a mudança é somente de interface e teste; não aumenta acesso, coleta ou processamento.

## Alternativas e escolha

| Alternativa | Valor | Risco | Decisão |
| --- | --- | --- | --- |
| Corrigir apenas o texto de Drivers | baixo | alto risco de regressão em outras rotas | rejeitada |
| Cobrir superfícies públicas de maior risco e reescrever claims | alto | baixo, por ser reversível | **adotada** |
| Manter números com rodapé genérico | médio | mantém inferências impróprias | rejeitada |
| Ocultar toda a experiência pública | baixo | perde valor de descoberta | rejeitada |
| Comprar uma ferramenta externa de gestão de fontes | baixo agora | amplia custo e integração | adiada |
| Construir um analisador genérico de rotas/AST | médio | complexidade desnecessária nesta fatia | adiada |

## Implementado

- `publicClaimsGuardrail` agora cobre páginas públicas de Drivers, Biblioteca, onboarding e os componentes públicos diretos de IA, PDF, calculadora e NR-1.
- A home troca cartões de resultados financeiros por uma jornada verificável de contexto, ação, evidência e reavaliação.
- A calculadora conserva apenas aritmética baseada nas premissas fornecidas; não prevê ROI, economia, eficácia ou conformidade.
- O onboarding deixa explícito que a IA não valida instrumentos nem substitui responsável técnico.
- O assistente público passa a ser pedagógico, não diagnóstico e consciente de privacidade; estatísticas publicitárias e a atribuição de modelo foram removidas da interface.
- A matriz e o framework NR-1 passam a se declarar exploratórios e sujeitos a revisão técnica.
- O crosswalk corrige burnout para o enquadramento da CID-11: fenômeno ocupacional, não condição médica.
- O PDF público usa “referências em revisão”, sem o selo implícito “Evidências Oxford”.

## Fontes primárias verificadas nesta onda

- A [OMS sobre burnout na CID-11](https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon) o descreve como fenômeno ocupacional e informa que não é classificado como condição médica.
- A página original do [Work Wellbeing Playbook](https://wellbeing.hmc.ox.ac.uk/publications/work-wellbeing-playbook/) o apresenta como revisão de intervenções e como trabalho curado pela World Wellbeing Movement em colaboração com o Wellbeing Research Centre da University of Oxford. Isso não valida ou chancela este produto.
- A página vigente da [NR-1 no MTE](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1) continua sendo a fonte regulatória primária registrada; a onda não amplia sua interpretação.

## Critérios de aceite

- Nenhuma superfície pública coberta afirma evidência “verificada”, instrumento validado, ROI potencial, burnout como doença ocupacional, diagnóstico individual ou substituição do responsável técnico.
- O assistente expõe limites de privacidade, imprecisão possível e não substituição de avaliação técnica.
- O cenário financeiro permanece aritmético e transparente, sem retorno prometido.
- Testes focados, typecheck, lint, build e auditoria de escopo passam.
- G0/G1 sintético e o No-Go de dados reais permanecem inalterados.

## Risco residual e rollback

- A biblioteca de fontes e itens históricos não foi revalidada artigo a artigo nesta onda; ela continua sujeita ao seu estado de revisão e não deve fundamentar decisões técnicas autônomas.
- O conteúdo gerado em tempo de execução pelo assistente de IA não foi alterado; seus prompts, modelo, fallback, quota e logs permanecem fora deste escopo.
- Rollback: um único commit, sem migração, configuração remota ou dado persistido.
