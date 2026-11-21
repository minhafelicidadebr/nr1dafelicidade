# Prontidao de submissao G2 ao comite - Action 24

Data: 30/06/2026

## Objetivo

Transformar o bloqueio da Action 24 em contrato auditavel: o app deve mostrar por que a submissao G2 ao comite ainda nao pode ocorrer, sem avancar G1, sem declarar G2 e sem habilitar dados reais.

## Estado

- Gate atual: G0/G1 local e sintetico.
- G1: nao aprovado.
- G2: nao submetido.
- Dados reais: No-Go.
- Action 24: bloqueada por dependencias formais.

## Decisao Fable 5

Opcoes avaliadas:

- Submeter G2 com evidencias locais: rejeitado, porque faltam G1 formal, responsaveis, fontes, revisoes e CI oficial.
- Manter apenas texto "bloqueado": insuficiente para governanca operacional.
- Criar contrato puro de prontidao e exibir bloqueios na Governanca: escolhido.
- Esperar todas as aprovacoes externas: necessario para submissao, mas nao para preparar o controle.
- Comprar/integrar ferramenta de GRC: fora do escopo G1 local.
- Abstrair como mecanismo generico de comite/gate: adotado em `src/lib/governance/committeeSubmission.ts`.

## Implementacao

- `src/lib/governance/committeeSubmission.ts`
  - avalia criterios, evidencias, categorias e bloqueios de submissao;
  - falha fechado se dados reais deixarem de estar No-Go ou se houver alegacao de avanco de gate.
- `src/data/g2CommitteeSubmission.ts`
  - define politica `g2-committee-submission-g1-2026-06-30`;
  - registra evidencia honesta do snapshot local.
- `src/lib/governance/committeeSubmission.test.ts`
  - comprova Action 24 bloqueada no estado atual;
  - comprova caminho positivo apenas com todos os criterios evidenciados;
  - bloqueia dados reais ou avanco de gate.
- `src/pages/app/GovernancePage.tsx`
  - exibe "Submissao G2 ao comite" como Action 24 bloqueada.

## Criterios bloqueantes modelados

- Acoes 18-23 com evidencia local.
- G1 formalmente aprovado.
- Responsaveis obrigatorios nomeados.
- Fontes, licenca e instrumento aprovados.
- Fixtures psicometricas independentes aprovadas.
- Revisoes independentes completas.
- baseline GitHub/Lovable publicado e atestado pontualmente.
- Validacao de trabalhadores/CIPA.
- Decisoes LGPD/juridico aprovadas.
- Incidente e recuperacao exercitados.
- Pauta e pacote de comite preparados por responsavel formal.
- Dados reais continuam No-Go.
- Nenhum avanco de gate declarado.

## Resultado local

O unico criterio materialmente completo no snapshot e a evidencia local das acoes 18-23. Os demais itens permanecem pendentes por decisao formal, fonte externa, GitHub oficial, revisao independente ou accountable nao nomeado.

## Limites

- Este contrato nao submete G2.
- Este contrato nao aprova G1.
- Este contrato nao substitui reuniao, ata, revisao tecnica, parecer juridico ou validacao metodologica.
- Este contrato nao libera dados reais, trabalhadores reais, campanha real ou producao.

## Validacao local

- ESLint: aprovado.
- TypeScript: aprovado.
- Vitest: 24 arquivos e 174 testes aprovados.
- Auditoria npm: zero vulnerabilidades em `npm audit --audit-level=low`.
- Build de producao: aprovado em Vite 8.1.0.
- Orcamento de bundle: aprovado, 64 chunks, maior chunk `vendor-pdf-Cxd_NDhN.js` com 400,68 kB.
- Release oficial: `minhafelicidadebr/playbook-nr1-chagpt-sol`, CI de aplicação/banco/browser e deployment Lovable atestam pontualmente o baseline `4a21c1c...`, sem afirmar sincronização do `HEAD` documental atual; branch protection permanece bloqueada por limitação de plano/API.

## Rollback

Remover `src/lib/governance/committeeSubmission.ts`, `src/data/g2CommitteeSubmission.ts`, `src/lib/governance/committeeSubmission.test.ts` e o card de submissao G2 em `src/pages/app/GovernancePage.tsx`.
