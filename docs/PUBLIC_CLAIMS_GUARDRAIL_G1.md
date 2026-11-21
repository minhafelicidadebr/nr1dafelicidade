# Guardrail de claims publicos G1

Data: 30/06/2026

## Objetivo

Reduzir risco de overclaim em paginas publicas e comerciais enquanto G1 segue nao aprovado e dados reais permanecem No-Go. A fatia transforma limites Fable 5 em teste automatizado para impedir promessas indevidas de conformidade, validacao cientifica, causalidade, anonimato absoluto ou maturidade SaaS real.

## Decisao Fable 5

Opcoes avaliadas:

- Corrigir apenas a frase mais critica: rapido, mas sem protecao contra regressao.
- Reescrever todo marketing agora: alto custo e risco de desalinhar oferta antes dos gates formais.
- Criar guardrail estatico com ajustes pontuais de copy: escolhido por ser verificavel, reversivel e proporcional ao risco.
- Bloquear pagina publica inteira ate G3: seguro, mas excessivo para demonstracao sintetica.
- Integrar revisao juridica automatizada externa: adiado ate haver processo formal de aprovacao.

## Implementacao

- `src/test/publicClaimsGuardrail.test.ts`
  - varre Home, Sales e componentes publicos de venda;
  - bloqueia padroes como conformidade garantida/total/continua, survey validado, validado por Oxford, chancela institucional, fonte publica "verificada", relatorios automaticos de conformidade, porcentual causal em preview, anonimato absoluto, diagnostico individual, G1 aprovado e SaaS real pronto;
  - bloqueia tambem preco self-service, "Assinar Agora", API/HRIS/SSO/SLA vendidos como prontos, plataforma SaaS antes de gate, prontidao enterprise e promessas rigidas de resposta/resultado;
  - permite linhas de limite explicito como "nao garante", "nao substitui", "bloqueado", "futuro", "em maturacao", "somente apos" e "depende de".
- `src/pages/HomePage.tsx`
  - troca "Conformidade Total" por "Prontidao Regulatoria";
  - torna explicito que questionario isolado nao determina risco, nao garante conformidade e nao substitui responsavel tecnico.
- `src/pages/SalesPage.tsx`
  - troca claims de validacao, tempo real, conformidade continua, chancela/verificacao e percentuais causais por linguagem de evidencia, prontidao, catalogacao e revisao;
  - remove planos self-service e enterprise produtivo, reposicionando a oferta como entrevista, Design Partner e SaaS enterprise futuro bloqueado por gates.
- `src/components/sales/ReadinessCalculator.tsx` e `src/components/sales/SegmentSelector.tsx`
  - removem promessa de conformidade continua/garantida nos resultados comerciais.

## Limites

- Nao aprova G1.
- Nao valida fontes, instrumentos, Oxford, COPSOQ ou Playbook 2.0.
- Nao libera dados reais, trabalhadores reais, campanha real ou producao.
- Nao substitui revisao juridica, SST, ergonomia, psicometria, DPO ou seguranca.

## Criterios de aceite

- Teste de claims publicos verde.
- Lint, typecheck, Vitest, build e budget verdes.
- Nenhuma nova promessa publica acima do estado tecnico/formal do produto.

## Rollback

Reverter `src/test/publicClaimsGuardrail.test.ts`, este documento e as alteracoes de copy nas superficies publicas.
