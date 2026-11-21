# Onda 1G — boundary tipado do cockpit de riscos

## Decisão

O `RiskPage` passa a usar tipos do contrato gerado do Supabase para organização e ciclos, e `SafeRiskScore` para scores agregados autorizados. A priorização de drivers reutiliza o mecanismo puro `topDriverForDimension` da Onda 1F.

## Invariantes preservados

- nenhuma migration, RPC, RLS, autenticação, billing ou secret foi alterado;
- scores continuam chegando pela API `fetchSafeRiskScores`, sem exposição de respostas individuais;
- a criação de ação continua bloqueada quando `canDisplayAggregate` rejeita a amostra;
- a fórmula e a matriz de drivers permanecem inalteradas;
- nenhuma dimensão desconhecida gera driver artificial: o mecanismo retorna `null`.

## Evidência e aceite

O ratchet de `any` remove seis ocorrências do `RiskPage`. O teste unitário da Onda 1F cobre o mecanismo de drivers; typecheck, lint, build e CI devem comprovar que a integração conserva o contrato tipado.

## Limites

Tipagem não constitui aprovação metodológica do instrumento, do catálogo de severidade ou do Criteria Engine. G1 permanece em preparação, dados reais continuam bloqueados e recomendações permanecem preliminares até revisão competente.
