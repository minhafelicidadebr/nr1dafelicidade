# Dossie de evidencias G1

Data: 30/06/2026

## Objetivo

Consolidar em uma visao auditavel o que esta tecnicamente pronto, o que esta em draft e o que permanece bloqueado para G1. A melhoria aumenta a clareza para revisores, sem aprovar gate, sem liberar dados reais e sem substituir parecer competente.

## Decisao Fable 5

Opcoes avaliadas:

- Manter evidencias apenas nos documentos: rejeitado por exigir leitura manual extensa.
- Usar somente o cockpit G1 do dashboard: insuficiente para revisao formal, pois mistura operacao de organizacao com pacote tecnico.
- Criar dossie versionado + avaliador puro + card na Governanca: escolhido.
- Criar workflow persistido de aprovacao: adiado por exigir schema, RLS, assinaturas e accountables.
- Integrar GRC externo: fora do escopo G1 local.

## Implementacao

- `src/lib/governance/evidenceDossier.ts`
  - avalia prontidao tecnica, prontidao formal, bloqueios e proximo passo;
  - separa categorias runtime, banco, metodologia, trabalho real, intervencao, publicacao e formal.
- `src/data/g1EvidenceDossier.ts`
  - define politica `g1-evidence-dossier-2026-06-30`;
  - registra evidencias e lacunas do estado atual.
- `src/lib/governance/evidenceDossier.test.ts`
  - comprova que G1 segue bloqueado;
  - comprova caminho positivo apenas com criterios tecnicos e formais completos;
  - falha fechado se qualquer item bloqueado permanece.
- `src/pages/app/GovernancePage.tsx`
  - exibe "Pacote de evidencias G1" como primeiro card de Governanca.
- `src/pages/app/ExternalReadinessWorkspacePage.tsx`
  - concentra decision room, pacote de audiencia e ensaio do facilitador em rota protegida e carregada sob demanda.
- `docs/G1_EXTERNAL_READINESS_WORKSPACE.md`
  - registra arquitetura, limites, alternativas e rollback do workspace focado.
- `docs/G1_EXTERNAL_READINESS_CLOSURE_BOARD.md`
  - registra critical path, dependencias, owners esperados e casos fail-closed das quatro trilhas externas.
- `docs/G1_ACCOUNTABLE_NOMINATION_PACK.md`
  - registra nove cartas de papel, agenda preparatoria e limites do template sem nomes.
- `docs/G1_RELEASE_PROOF_PACKET.md`
  - separa provas locais, historicas e atuais de GitHub, CI, branch protection e Lovable.
- `docs/G1_FORMAL_ACCEPTANCE_LEDGER.md`
  - detalha o controle de responsaveis, autoridade, substitutos, decisoes e ressalvas.
- `docs/INSTRUMENT_METHODOLOGY_READINESS_G1.md`
  - detalha o gate de fonte, licenca, subescalas, scoring, fixtures e revisao metodologica.
- `docs/SAAS_MATURITY_ASSESSMENT.md`
  - detalha o estagio atual como fundacao governada e bloqueia claims de SaaS real antes de G3.
- `docs/G1_SYNTHETIC_DEMO_REHEARSAL.md`
  - detalha roteiro de ensaio interno sintetico e bloqueios para demo externa.

## Estado atual

Pronto localmente:

- runtime G0 fail-closed;
- Privacy Vault e k-anonimato em contratos locais;
- acoes, controles e evidencias em avaliadores locais;
- jornada regulatoria sintetica.
- ensaio interno de demo G1 sintetica.
- cockpit de sessao, Playwright cross-browser e decision room externo fail-closed.
- pacote de audiencia com narrativa, perguntas dificeis e stop conditions pronto para ensaio interno.
- simulador de facilitador com seis cenarios adversariais e receipt somente em memoria.
- workspace de prontidao externa protegido, fail-closed e sem CTA de aprovacao.
- quadro de fechamento somente leitura com 0/4 trilhas prontas e accountability prioritaria.
- pacote nao nominativo pronto para preparar a convocacao fora do sistema.
- carta do candidato com seis frentes revisaveis e promocao fail-closed.
- sequencia de revisao aciclica com papeis, criterios de saida e validacoes.
- pacote do serviço pago assistido com 7/10 critérios, 4/4 cartas e 4/4 templates prontos para revisão, mas zero autorização de venda ou piloto.
- ensaio comercial com proposta interna versionada, seis situações adversariais e recibo local No-Go; nenhum envio, assinatura, cobrança ou entrega.
- sala de decisao da primeira venda com pauta 7/7, pre-leituras 5/5 e quatro saidas; quorum, alcadas, convocacao e venda permanecem pendentes.
- auditoria mecanica com atribuicao exata de 126 caminhos e hashes do snapshot.
- recibo agregado de conteudo para 124 arquivos, sem exposicao de conteudo ou hash individual.
- orcamento anticircular de 11.734 linhas em 120 arquivos; revisao monolitica rejeitada por concentracao de risco.
- pacote de release com proveniencia observada e commit binding fail-closed.

Pendente ou bloqueado:

- revisao independente do Privacy Vault e CI de banco oficial;
- fonte, licenca, hash, subescalas, fixtures e aprovacao do instrumento;
- scoring server-side e fixtures psicometricas independentes do instrumento;
- validacao SST/Ergonomia/AEP/AET/CIPA;
- formula oficial e aprovacao metodologica do Criteria Engine;
- fonte canonica Playbook 2.0 e claims derivados;
- GitHub Actions, branch protection e baseline Lovable publicado com atestado pontual;
- accountables, autoridade, substitutos, atas e decisoes formais.
- maturidade SaaS real dependente de G3, operacao, observabilidade, suporte, billing e integracoes.
- preview Lovable, roteiro aprovado, accountables, risco residual e pacote formal de audiencia externa.

## Limites

- Nao aprova G1.
- Nao cria workflow de assinatura.
- Nao libera dados reais, trabalhadores reais, campanha real ou producao.
- Nao substitui revisao SST, ergonomia, psicometria, DPO/juridico, seguranca ou direcao.

## Rollback

Remover `src/lib/governance/evidenceDossier.ts`, `src/data/g1EvidenceDossier.ts`, `src/lib/governance/evidenceDossier.test.ts` e o card `EvidenceDossierCard` em `src/pages/app/GovernancePage.tsx`.
