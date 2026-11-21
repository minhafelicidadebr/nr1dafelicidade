import type { OrientativeDocumentTemplate, OrientativeTemplateId } from "@/lib/documents/orientativeTemplate";

export const ORIENTATIVE_DOCUMENT_TEMPLATES: OrientativeDocumentTemplate[] = [
  {
    id: "consent",
    title: "Aviso de participacao e privacidade - avaliacao psicossocial",
    version: "orientative-g1-2026-07-03",
    fileStem: "aviso_participacao_privacidade",
    sections: [
      [
        "## Finalidade",
        "",
        "A organizacao {{orgName}} planeja realizar uma avaliacao coletiva de fatores psicossociais relacionados ao trabalho no ciclo {{cycleName}}.",
        "O objetivo e apoiar a identificacao de sinais agregados, orientar medidas preventivas e produzir evidencias preliminares para revisao tecnica.",
        "O questionario nao substitui AEP, AET, observacao do trabalho real, participacao de trabalhadores/CIPA ou avaliacao profissional competente.",
      ].join("\n"),
      [
        "## Participacao e privacidade",
        "",
        "- A participacao deve ser voluntaria.",
        "- A organizacao nao deve acessar respostas individuais.",
        "- Resultados coletivos so devem ser exibidos quando atingirem o k minimo {{kMin}}.",
        "- Identidade, convite e resposta nao devem ser correlacionados por gestores ou liderancas.",
        "- Canais de acolhimento, denuncia ou urgencia devem funcionar separados da pesquisa.",
      ].join("\n"),
      [
        "## Direitos e contato",
        "",
        "Para duvidas sobre tratamento de dados, finalidade, retencao ou direitos LGPD, procure o DPO/encarregado ou canal aprovado pela organizacao: [PREENCHER].",
      ].join("\n"),
    ],
  },
  {
    id: "communique",
    title: "Comunicado aos trabalhadores - devolutiva de riscos psicossociais",
    version: "orientative-g1-2026-07-03",
    fileStem: "comunicado_trabalhadores",
    sections: [
      [
        "## Mensagem orientativa",
        "",
        "Prezadas e prezados trabalhadores,",
        "",
        "A organizacao {{orgName}} realizou uma avaliacao coletiva de fatores psicossociais relacionados ao trabalho no ciclo {{cycleName}}.",
        "Os resultados foram tratados de forma agregada e protegida por k-anonimato. Status da amostra neste rascunho: {{responseStatus}}.",
      ].join("\n"),
      [
        "## O que sera feito com os resultados",
        "",
        "Os sinais coletivos devem apoiar a revisao das condicoes de trabalho, a priorizacao de acoes preventivas e o registro de evidencias no processo de GRO/PGR.",
        "Neste momento ha {{riskCount}} risco(s) agregado(s) computado(s), {{activeActions}} acao(oes) ativa(s) e {{readyActions}} acao(oes) com sinais minimos de evidencia, KPI e revisao.",
        "Toda conclusao permanece preliminar ate revisao do responsavel tecnico competente.",
      ].join("\n"),
      [
        "## Canais separados da pesquisa",
        "",
        "Se voce quiser relatar assedio, violencia, discriminacao, sofrimento intenso ou outra situacao sensivel, utilize os canais institucionais de acolhimento, denuncia, CIPA, SST/SESMT ou urgencia definidos pela organizacao.",
        "Esses canais devem ser separados da pesquisa coletiva e nao devem quebrar a protecao das respostas.",
      ].join("\n"),
    ],
  },
  {
    id: "pgr_text",
    title: "Texto-modelo para PGR - metodologia psicossocial e representatividade",
    version: "orientative-g1-2026-07-03",
    fileStem: "texto_pgr_metodologia_psicossocial",
    sections: [
      [
        "## Como usar",
        "",
        "Este texto e um rascunho orientativo para o capitulo de avaliacao de fatores psicossociais do PGR consolidado.",
        "Ele deve ser revisado, ajustado ao modelo da organizacao e aprovado pelo responsavel tecnico competente antes de uso formal.",
      ].join("\n"),
      [
        "## Metodologia e limites",
        "",
        "A avaliacao psicossocial do ciclo {{cycleName}} deve ser tratada como insumo coletivo para o GRO/PGR da organizacao {{orgName}}.",
        "Instrumento, fonte, licenca, versao, itens, subescalas, scoring, premissas e limitacoes devem constar em registro aprovado antes de qualquer uso real.",
        "Os resultados quantitativos nao substituem AEP, AET, observacao do trabalho real, participacao de trabalhadores/CIPA ou julgamento tecnico.",
      ].join("\n"),
      [
        "## Representatividade",
        "",
        "Amostra e adesao devem ser descritas como criterio metodologico, nao como requisito normativo automatico.",
        "Status da amostra neste rascunho: {{responseStatus}}.",
        "Qualquer alvo percentual de adesao deve ser definido pelo responsavel tecnico, justificado no documento e apresentado como criterio de qualidade da leitura.",
      ].join("\n"),
      [
        "## Plano de acao e controles",
        "",
        "Foram identificadas {{activeActions}} acao(oes) ativa(s), das quais {{readyActions}} apresentam sinais minimos de responsavel, prazo, evidencia esperada, KPI/reavaliacao e revisao.",
        "Foram declarados {{activeControls}} controle(s), dos quais {{readyControls}} apresentam sinais minimos para informar revisao tecnica futura.",
        "Controle declarado nao reduz risco automaticamente; sua eficacia depende de evidencia de implementacao, manutencao, indicador e revisao.",
      ].join("\n"),
    ],
  },
  {
    id: "controls_implanted",
    title: "Controles implantados - registro orientativo",
    version: "orientative-g1-2026-07-03",
    fileStem: "controles_implantados",
    sections: [
      [
        "## Como interpretar",
        "",
        "Este rascunho registra controles declarados pela organizacao {{orgName}} para apoiar revisao tecnica, evitar duplicidade de acoes e orientar proximos passos.",
        "A declaracao de um controle nao altera escore do instrumento, nao comprova eficacia e nao calcula risco residual.",
      ].join("\n"),
      [
        "## Resumo operacional",
        "",
        "- Controles declarados: {{activeControls}}",
        "- Controles com sinais minimos para revisao: {{readyControls}}",
        "- Politica de amostra do ciclo relacionado: k minimo {{kMin}}",
        "",
        "{{controlsTable}}",
      ].join("\n"),
      [
        "## Pendencias recomendadas",
        "",
        "- Registrar evidencia objetiva de implementacao.",
        "- Registrar rotina, manutencao ou responsavel pelo controle.",
        "- Definir KPI, baseline, indicador ou criterio de reavaliacao.",
        "- Registrar revisao tecnica antes de usar o controle em qualquer analise residual.",
      ].join("\n"),
    ],
  },
  {
    id: "worker_presentation",
    title: "Apresentacao de devolutiva para trabalhadores e liderancas - roteiro de slides",
    version: "orientative-q1-2026-11-18",
    fileStem: "apresentacao_devolutiva_trabalhadores",
    sections: [
      [
        "## Slide 1 - O que foi o ciclo de escuta e protecao de privacidade",
        "",
        "- A organizacao {{orgName}} realizou o ciclo {{cycleName}} para ouvir as equipes sobre condicoes e organizacao do trabalho.",
        "- Nenhuma resposta individual e identificada ou acessada pela gestao.",
        "- Resultados coletivos respeitam o limiar de k minimo {{kMin}} ({{responseStatus}}).",
      ].join("\n"),
      [
        "## Slide 2 - Pontos fortes (fatores de protecao) e frentes de melhoria",
        "",
        "- Fatores de protecao ativos sao preservados e monitorados em ciclo continuo (PDCA).",
        "- Foram mapeados {{riskCount}} sinal(is) coletivo(s) elegivel(is) para priorizacao preventiva.",
        "- O questionario apoia a analise do trabalho real (AEP) e nao avalia desempenho individual.",
      ].join("\n"),
      [
        "## Slide 3 - Plano de acao na organizacao do trabalho e proximos passos",
        "",
        "- Acoes em planejamento ou execucao: {{activeActions}} acao(oes) ativa(s) ({{readyActions}} com evidencia e KPI definidos).",
        "- Controles organizacionais declarados: {{activeControls}} ({{readyControls}} prontos para revisao tecnica).",
        "- Canais de acolhimento, ouvidoria e CIPA permanecem abertos e independentes da pesquisa.",
      ].join("\n"),
    ],
  },
  {
    id: "management_manifesto",
    title: "Manifesto de compromisso da alta administracao e CIPA - gestao psicossocial e bem-estar",
    version: "orientative-q1-2026-11-18",
    fileStem: "manifesto_compromisso_alta_administracao",
    sections: [
      [
        "## Declaracao institucional",
        "",
        "A alta direcao da organizacao {{orgName}}, em conjunto com as liderancas operacionais, RH, SST/SESMT e representacao da CIPA, registra o compromisso com a promocao do trabalho saudavel e o gerenciamento de fatores psicossociais no ciclo {{cycleName}}.",
      ].join("\n"),
      [
        "## Compromissos de governanca (NR-01 / NR-17 / ISO 45003)",
        "",
        "- Priorizar medidas causais sobre a organizacao do trabalho (carga, ritmo, previsibilidade e clareza de papeis) antes de medidas exclusivamente individuais.",
        "- Proteger a privacidade dos trabalhadores com limiar coletivo k minimo {{kMin}} e separacao estrita entre pesquisa e canais de denuncia.",
        "- Garantir a participacao dos trabalhadores e da CIPA na revisao da AEP e no acompanhamento das {{activeActions}} acao(oes) do plano.",
        "- Integrar os achados coletivos ao GRO/PGR e comunicar o medico coordenador do PCMSO (NR-07) quando aplicavel.",
      ].join("\n"),
    ],
  },
  {
    id: "harassment_policy",
    title: "Politica orientativa de prevencao ao assedio, respeito e canal seguro (Lei 14.457/2022)",
    version: "orientative-q1-2026-11-18",
    fileStem: "politica_prevencao_assedio_respeito",
    sections: [
      [
        "## Objetivo e escopo",
        "",
        "Estabelecer diretrizes preliminares para prevencao de assedio moral, sexual, discriminacao e comportamentos ofensivos na organizacao {{orgName}}, em alinhamento com a Lei 14.457/2022, NR-01 e NR-05 (CIPA).",
      ].join("\n"),
      [
        "## Diretrizes e fluxo independente de acolhimento",
        "",
        "- Qualquer relato individual de assedio ou violencia deve ser recebido por canal de ouvidoria/denuncia dedicado, sigiloso e separado da pesquisa coletiva do ciclo {{cycleName}}.",
        "- Proibicao expressa de retaliacao (assedio de 2a ordem) contra denunciantes ou testemunhas.",
        "- Capacitacao periodica de liderancas e equipes sobre respeito, prevencao e canais de apoio.",
      ].join("\n"),
    ],
  },
  {
    id: "disconnection_policy",
    title: "Politica orientativa de desconexao digital, pausas e equilibracao de carga",
    version: "orientative-q1-2026-11-18",
    fileStem: "politica_desconexao_digital_pausas",
    sections: [
      [
        "## Finalidade",
        "",
        "Apoiar a organizacao {{orgName}} na estruturacao de fronteiras saudaveis de jornada, pausas de recuperacao e comunicacao assincrona para regime presencial, hibrido ou remoto no ciclo {{cycleName}}.",
      ].join("\n"),
      [
        "## Praticas organizacionais recomendadas",
        "",
        "- Respeito aos intervalos interjornada e intrajornada, evitando acionamentos fora do expediente salvo plantao formalizado.",
        "- Janelas protegidas de foco e pausas programadas de recuperacao cognitiva em turnos de atendimento ou alta demanda.",
        "- Revisao periodica das demandas pela lideranca junto ao plano de acao ({{activeActions}} acao(oes) monitorada(s)).",
      ].join("\n"),
    ],
  },
];

export const ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID = ORIENTATIVE_DOCUMENT_TEMPLATES.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<OrientativeTemplateId, OrientativeDocumentTemplate>,
);

export function hasOrientativeDocumentTemplate(id: string): id is OrientativeTemplateId {
  return id in ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID;
}
