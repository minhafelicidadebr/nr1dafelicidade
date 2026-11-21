/**
 * Aurora NR-1 — Base de conhecimento controlada e determinística.
 * Cada intent retorna uma `AuroraAnswer` estruturada. Nenhuma chamada a LLM.
 * Quando não há dados suficientes, a resposta orienta o próximo passo.
 */
import { getDimensionInsight } from "@/lib/nr1/riskTranslationMatrix";
import { getDimensionLabel, getDriverLabel, RISK_BAND_LABEL, riskBand } from "@/lib/nr1/labels";
import { dimensionToDriver } from "@/data/copsoqData";
import { topDriverForDimension } from "@/lib/nr1/topDriver";
import type { AuroraContext, AuroraScore } from "./contextBuilder";

export const AURORA_DISCLAIMER =
  "A Sra. EstratégIA - IA oferece apoio interpretativo preliminar com base em dados agregados e catálogos cadastrados. Não substitui análise do responsável técnico, laudo clínico ou validação formal do GRO/PGR.";

export const AURORA_NO_DATA =
  "Não há informação cadastrada suficiente para responder com segurança. Recomendo revisar o catálogo institucional ou consultar o responsável técnico.";

export type AuroraCTA = { label: string; to: string };

export interface AuroraAnswer {
  summary: string[];          // Resumo em até 3 pontos
  whatDataShows: string[];    // O que os dados mostram
  whyMatters: string;         // Por que isso importa
  nextAction: string;         // Próxima ação recomendada
  sources: string[];          // Fonte/catálogo usado
  limitations: string[];      // Limitações técnicas
  ctas?: AuroraCTA[];
  highlights?: Array<{ label: string; value: string; tone?: "neutral" | "warn" | "good" | "danger" }>;
}

function noCycleAnswer(ctx: AuroraContext): AuroraAnswer {
  return {
    summary: ["Nenhum ciclo com respostas suficientes foi identificado."],
    whatDataShows: [
      `Ciclos cadastrados: ${ctx.cyclesCount}.`,
      `Unidades cadastradas: ${ctx.unitsCount}.`,
    ],
    whyMatters: `Sem amostra ≥ ${ctx.k_min}, nenhum recorte pode ser exibido por respeito ao k-anonimato.`,
    nextAction: "Crie ou ative um ciclo, gere convites e colete respostas até atingir o mínimo de privacidade.",
    sources: ["Catálogo institucional preliminar", "Instrument Registry — fonte aprovada obrigatória"],
    limitations: ["Aurora não opera sobre amostras insuficientes."],
    ctas: [
      { label: "Ir para Ciclos", to: "/app/cycles" },
      { label: "Ver Unidades", to: "/app/units" },
    ],
  };
}

function explainTop3(ctx: AuroraContext): AuroraAnswer {
  if (!ctx.cycle || !ctx.cycle.has_sample || ctx.visibleScores.length === 0) return noCycleAnswer(ctx);
  const top = ctx.visibleScores.slice(0, 3);
  const lines = top.map((s, i) => {
    const drv = topDriverForDimension(dimensionToDriver, s.dimension);
    const band = riskBand(s.risk_level);
    return `${i + 1}. ${getDimensionLabel(s.dimension, "pt-BR")} — ${RISK_BAND_LABEL[band]} (R${s.risk_level}, S${s.severity}×P${s.probability}, n=${s.n_responses})${drv ? ` · driver: ${getDriverLabel(drv, "pt-BR")}` : ""}`;
  });
  return {
    summary: [
      `Ciclo "${ctx.cycle.name}" · ${ctx.cycle.n_responses} respostas.`,
      `${top.length} dimensão(ões) prioritária(s) identificada(s).`,
      `${ctx.suppressedCount} dimensão(ões) ocultada(s) por k<${ctx.k_min}.`,
    ],
    whatDataShows: lines,
    whyMatters:
      "Riscos críticos/altos exigem ação preferencialmente organizacional (NR-1, hierarquia de controles), pois afetam um agregado de trabalhadores e podem se cronificar.",
    nextAction:
      "Crie um plano de ação a partir da dimensão #1 e revise os controles cadastrados associados ao driver dominante.",
    sources: [
      "Catálogo institucional de riscos psicossociais",
      "Instrument Registry — fonte aprovada obrigatória",
      "Work Wellbeing Playbook 2.0 — Oxford",
      "Guia Oficial MTE 2026 (Comentado)",
    ],
    limitations: [
      "Recomendação preliminar — requer revisão do responsável técnico (SST/PGR).",
      "Severidade pode ser ajustada caso o catálogo institucional difira do padrão.",
    ],
    ctas: [
      { label: "Criar plano de ação", to: "/app/actions" },
      { label: "Ver controles sugeridos", to: "/app/controls" },
    ],
    highlights: top.map((s) => ({
      label: getDimensionLabel(s.dimension, "pt-BR"),
      value: `R${s.risk_level}`,
      tone: riskBand(s.risk_level) === "critico" ? "danger" : riskBand(s.risk_level) === "alto" ? "warn" : "neutral",
    })),
  };
}

function firstDimension(ctx: AuroraContext): AuroraAnswer {
  if (!ctx.cycle?.has_sample || ctx.visibleScores.length === 0) return noCycleAnswer(ctx);
  const s = ctx.visibleScores[0];
  const ins = getDimensionInsight(s.dimension);
  const drv = topDriverForDimension(dimensionToDriver, s.dimension);
  return {
    summary: [
      `Prioridade #1: ${getDimensionLabel(s.dimension, "pt-BR")} — R${s.risk_level} (${RISK_BAND_LABEL[riskBand(s.risk_level)]}).`,
      drv ? `Driver dominante (Playbook): ${getDriverLabel(drv, "pt-BR")}.` : "Driver dominante não cadastrado.",
      ins.mteFactors.length > 0 ? `Fator MTE: ${ins.mteFactors.map((f) => f.code).join(", ")}.` : "Fator MTE não cadastrado.",
    ],
    whatDataShows: [
      `S${s.severity} × P${s.probability} · n=${s.n_responses}.`,
      s.unfavorable_percentage != null ? `% respostas desfavoráveis: ${Number(s.unfavorable_percentage).toFixed(0)}%.` : "% desfavoráveis não calculado.",
    ],
    whyMatters: ins.interventionLogic || "Dimensão sinaliza necessidade de intervenção organizacional preferencial.",
    nextAction: "Abra a dimensão no cockpit de Riscos, registre uma ação no módulo Ações e selecione um controle do catálogo.",
    sources: ["riskTranslationMatrix institucional", ...ins.sourceRefs],
    limitations: ins.limitations,
    ctas: [
      { label: "Abrir Riscos", to: "/app/risk" },
      { label: "Criar ação", to: "/app/actions" },
    ],
  };
}

function interventionsAnswer(ctx: AuroraContext): AuroraAnswer {
  if (!ctx.cycle?.has_sample || ctx.visibleScores.length === 0) return noCycleAnswer(ctx);
  const s = ctx.visibleScores[0];
  const ins = getDimensionInsight(s.dimension);
  const items = ins.interventions.slice(0, 5);
  return {
    summary: [
      `Dimensão prioritária: ${getDimensionLabel(s.dimension, "pt-BR")}.`,
      items.length > 0 ? `${items.length} intervenções cadastradas no catálogo.` : "Nenhuma intervenção cadastrada para esta dimensão.",
    ],
    whatDataShows: items.length > 0
      ? items.map((iv) => `• ${iv.title} — controle ${iv.controlHierarchy}, evidência ${iv.evidenceLevel}.`)
      : ["Catálogo institucional sem intervenções cadastradas para a dimensão."],
    whyMatters:
      "A hierarquia de controles (NR-1) prioriza controles organizacionais antes de medidas administrativas ou individuais.",
    nextAction: items.length > 0
      ? "Selecione a intervenção mais alta na hierarquia disponível e registre uma ação."
      : "Revisar catálogo institucional para incluir intervenções desta dimensão.",
    sources: ins.sourceRefs.length > 0 ? ins.sourceRefs : ["Catálogo institucional"],
    limitations: ["Intervenções são recomendações preliminares — exigem adequação ao contexto e revisão técnica."],
    ctas: [{ label: "Abrir Ações", to: "/app/actions" }, { label: "Ver Controles", to: "/app/controls" }],
  };
}

function k5Gap(ctx: AuroraContext): AuroraAnswer {
  if (!ctx.cycle) return noCycleAnswer(ctx);
  const gap = Math.max(0, ctx.k_min - ctx.cycle.n_responses);
  return {
    summary: [
      `Ciclo "${ctx.cycle.name}" tem ${ctx.cycle.n_responses} resposta(s).`,
      gap > 0 ? `Faltam ${gap} resposta(s) para atingir k≥${ctx.k_min}.` : `Amostra já atende k≥${ctx.k_min}.`,
    ],
    whatDataShows: [
      `Mínimo de k-anonimato: ${ctx.k_min}.`,
      gap > 0 ? "Recortes seguem ocultos até atingir o mínimo." : "Recortes liberados para análise agregada.",
    ],
    whyMatters: "k-anonimato impede que um agregado se torne identificável quando o n é pequeno.",
    nextAction: gap > 0
      ? "Gere mais convites ou reenvie links não utilizados para alcançar o mínimo."
      : "Compute o risco no cockpit e priorize ações.",
    sources: ["Política institucional de privacidade versionada"],
    limitations: ["Aurora não opera sobre dados individuais."],
    ctas: gap > 0
      ? [{ label: "Ir para Ciclos", to: "/app/cycles" }]
      : [{ label: "Computar risco", to: "/app/risk" }],
    highlights: [
      { label: "Respostas", value: String(ctx.cycle.n_responses), tone: ctx.cycle.has_sample ? "good" : "warn" },
      { label: "k-mínimo", value: String(ctx.k_min) },
    ],
  };
}

const STATIC: Record<string, AuroraAnswer> = {
  // ===== Overview =====
  "overview.dashboard": {
    summary: [
      "A jornada vai de Empresa → Unidades → Ciclos → Convites → Respostas → Riscos → Ações → Controles → Documentos.",
      "Cada etapa alimenta a próxima; nada é calculado fora do ciclo correspondente.",
    ],
    whatDataShows: [
      "O dashboard mostra status do ciclo, respostas, k-anonimato e priorização.",
    ],
    whyMatters: "A NR-1 exige rastreabilidade: dado coletado → risco calculado → ação registrada → controle aplicado.",
    nextAction: "Verifique se Empresa, Setores e Unidades estão cadastrados antes de iniciar um ciclo.",
    sources: ["Fonte normativa vigente — revisão jurídica/técnica obrigatória", "Instrument Registry"],
    limitations: ["A plataforma apoia o processo; o responsável técnico valida os resultados."],
    ctas: [{ label: "Configurar Empresa", to: "/app/company" }, { label: "Gerenciar Unidades", to: "/app/units" }],
  },
  "overview.kpis": {
    summary: [
      "Indicadores: respostas registradas, dimensões avaliadas, riscos críticos/altos, dimensões ocultadas por k.",
      "Top driver Playbook resume onde concentrar intervenções organizacionais.",
    ],
    whatDataShows: ["Todos os números visíveis derivam apenas de agregados com n ≥ k-mínimo."],
    whyMatters: "Métricas servem para tomada de decisão coletiva, não para julgar pessoas.",
    nextAction: "Use o cockpit de Riscos para priorizar; abra Ações para registrar planos.",
    sources: ["Cockpit institucional de riscos", "Work Wellbeing Playbook 2.0 — Oxford"],
    limitations: ["KPIs são preliminares; revisão técnica é obrigatória."],
    ctas: [{ label: "Abrir Riscos", to: "/app/risk" }],
  },
  "overview.next": {
    summary: ["Próximo passo depende do que ainda não foi cumprido na jornada."],
    whatDataShows: ["Aurora identifica gaps no cockpit (ciclos, respostas, k-anonimato)."],
    whyMatters: "Pular etapas compromete a validade do diagnóstico psicossocial.",
    nextAction: "Se há ciclo com k≥5, vá para Riscos. Se não, gere mais convites em Ciclos.",
    sources: ["Guia Oficial MTE 2026 (Comentado)"],
    limitations: ["Sem dados não há diagnóstico."],
    ctas: [{ label: "Ciclos", to: "/app/cycles" }, { label: "Riscos", to: "/app/risk" }],
  },

  // ===== Company =====
  "company.structure": {
    summary: ["Setores agrupam unidades funcionalmente.", "Recomenda-se espelhar o organograma real."],
    whatDataShows: ["Cada setor pode conter múltiplas unidades; cada unidade gera recortes próprios."],
    whyMatters: "Estruturas claras permitem comparar exposições por área sem quebrar anonimato.",
    nextAction: "Cadastre setores antes de criar unidades.",
    sources: ["Guia Oficial MTE 2026 — estruturação organizacional"],
    limitations: ["Setores e unidades muito pequenos podem ficar ocultos por k-anonimato."],
    ctas: [{ label: "Cadastrar Setores", to: "/app/company" }],
  },
  "company.gro": {
    summary: ["O GRO/PGR exige caracterização da organização e dos riscos por exposição."],
    whatDataShows: ["Empresa, setores e unidades formam a base para a inclusão de riscos psicossociais no PGR."],
    whyMatters: "Sem cadastro consistente, o DRPS preliminar não rastreia o recorte correto.",
    nextAction: "Mantenha CNPJ, razão social e estrutura atualizados.",
    sources: ["Guia Oficial MTE 2026 (Comentado)"],
    limitations: ["A plataforma apoia o GRO/PGR, não substitui a redação técnica do responsável."],
  },
  "company.invite_code": {
    summary: ["O código de convite vincula novos gestores/RH à organização."],
    whatDataShows: ["Quem entra pelo código herda o papel definido pelo administrador."],
    whyMatters: "Evita exposição indevida de dados a usuários fora da organização.",
    nextAction: "Compartilhe o código apenas com pessoas autorizadas.",
    sources: ["Política institucional de acesso"],
    limitations: ["Códigos podem ser revogados; o acesso histórico permanece auditável."],
  },

  // ===== Units =====
  "units.organize": {
    summary: ["Unidades = recortes mínimos de análise (filial, turno, função)."],
    whatDataShows: ["Cada resposta é vinculada a uma unidade para permitir drilldown agregado."],
    whyMatters: "Recortes adequados aumentam a capacidade de ação sem violar anonimato.",
    nextAction: "Evite unidades com previsão de menos de 5 respondentes.",
    sources: ["Instrument Registry — fonte aprovada obrigatória"],
    limitations: ["Unidades pequenas podem permanecer ocultas."],
    ctas: [{ label: "Gerenciar Unidades", to: "/app/units" }],
  },
  "units.cut": {
    summary: ["O melhor recorte equilibra homogeneidade de exposição e tamanho amostral."],
    whatDataShows: ["Drilldown só exibe unidades com n ≥ k-mínimo."],
    whyMatters: "Recortes muito finos quebram anonimato; muito amplos diluem o sinal.",
    nextAction: "Combine setor + turno quando a unidade isolada for pequena.",
    sources: ["Pack de scoring aprovado no Instrument Registry"],
    limitations: ["Aurora não recalcula recortes; apenas orienta."],
  },
  "units.anonymity": {
    summary: ["Em unidades pequenas, agregue até atingir k-mínimo."],
    whatDataShows: ["O sistema oculta automaticamente recortes com n<5."],
    whyMatters: "Garante que nenhum trabalhador seja identificável a partir do agregado.",
    nextAction: "Considere agrupar unidades vizinhas ou prorrogar a coleta.",
    sources: ["Política institucional de privacidade"],
    limitations: ["A ocultação é automática e não admite exceções via UI."],
  },

  // ===== Cycles =====
  "cycles.share_safely": {
    summary: [
      "Cada token é único e anônimo. Compartilhe apenas por canais controlados.",
      "Use links individuais ou QR — nunca planilhas públicas.",
    ],
    whatDataShows: ["O sistema marca tokens como usados após o envio."],
    whyMatters: "Reuso de token compromete validade e anonimato.",
    nextAction: "Use a aba 'Disponíveis' em Ciclos para reenviar tokens não usados.",
    sources: ["Política institucional de convites"],
    limitations: ["Tokens expirados precisam ser regenerados."],
    ctas: [{ label: "Abrir Ciclos", to: "/app/cycles" }],
  },
  "cycles.unique_token": {
    summary: ["Token único = 1 resposta = 0 rastreio individual."],
    whatDataShows: ["Tokens não armazenam identidade; apenas validam unicidade."],
    whyMatters: "Garante coleta anônima e impede duplicatas.",
    nextAction: "Distribua tokens por canais privados (e-mail nominal, QR pessoal).",
    sources: ["Política institucional de privacidade e convites"],
    limitations: ["Se o token vazar, qualquer pessoa pode responder uma vez por ele."],
  },
  "cycles.adesao": {
    summary: ["Adesão = tokens usados / tokens gerados."],
    whatDataShows: ["O painel de Convites mostra Disponíveis/Usados/Expirados."],
    whyMatters: "Baixa adesão compromete representatividade do diagnóstico.",
    nextAction: "Se a adesão estiver abaixo de 60%, reenvie convites e comunique a importância.",
    sources: ["Instrument Registry e aviso de participação aprovados"],
    limitations: ["A adesão ideal varia por contexto organizacional."],
    ctas: [{ label: "Ver Ciclos", to: "/app/cycles" }],
  },

  // ===== Risk =====
  "risk.k_anonymity": {
    summary: [
      "k-anonimato = nenhum recorte é exibido com n < k (aqui, k = 5).",
      "Protege o respondente e atende à LGPD/política institucional.",
    ],
    whatDataShows: ["Recortes com n<5 são marcados como 'oculto' e não entram em ações nem documentos."],
    whyMatters: "Permite análise coletiva sem expor indivíduos.",
    nextAction: "Para liberar um recorte, aumente a amostra ou agregue unidades.",
    sources: ["LGPD — revisão jurídica necessária", "Política institucional de privacidade"],
    limitations: ["Aurora não burla k-anonimato sob nenhuma hipótese."],
  },
  "risk.severity_x_probability": {
    summary: [
      "Risco = Severidade × Probabilidade (AIHA 5×5).",
      "Severidade vem do catálogo; Probabilidade vem do % de respostas desfavoráveis (≥60/100).",
    ],
    whatDataShows: ["Bandas: Trivial (<5), Baixo (5–9), Moderado (10–14), Alto (15–19), Crítico (≥20)."],
    whyMatters: "Permite priorizar dimensões com maior potencial de agravo coletivo.",
    nextAction: "Use a matriz visual no cockpit de Riscos para posicionar cada dimensão.",
    sources: ["AIHA Risk Assessment 5×5", "Catálogo institucional de severidade"],
    limitations: ["Severidade pode ser ajustada pelo responsável técnico conforme realidade local."],
  },

  // ===== Actions =====
  "actions.create_from_risk": {
    summary: [
      "Cada ação deve nascer de um risco priorizado (R alto/crítico) e referenciar a dimensão correspondente.",
      "Prefira controles organizacionais (eliminação/substituição/engenharia) antes de administrativos.",
    ],
    whatDataShows: ["Riscos visíveis no cockpit já passam pelo filtro k≥5 e podem ser convertidos em ação."],
    whyMatters: "Plano de ação rastreável é exigência da NR-1 (1.5.5.2) e sustenta a revisão técnica.",
    nextAction: "Em /app/actions, escolha o risco prioritário, defina responsável, prazo e evidência.",
    sources: ["NR-1 — itens 1.5.5 e 1.5.7", "Hierarquia de controles (NR-1 / ISO 45003)"],
    limitations: ["Ações são preliminares até validação por SST/SESMT."],
    ctas: [{ label: "Abrir Ações", to: "/app/actions" }, { label: "Ver Riscos", to: "/app/risk" }],
  },
  "actions.priority": {
    summary: ["Prioridade segue a banda de risco: Crítico → Alto → Moderado → Baixo."],
    whatDataShows: ["O cockpit ordena por R (Severidade × Probabilidade)."],
    whyMatters: "Concentra esforço onde o agravo coletivo é maior.",
    nextAction: "Resolva o R mais alto antes de abrir frentes paralelas.",
    sources: ["AIHA 5×5", "Catálogo institucional"],
    limitations: ["Contexto local pode justificar reordenação — registre a justificativa."],
  },
  "actions.evidence": {
    summary: ["Evidência = registro objetivo de que a ação foi executada (ata, política, treinamento, indicador)."],
    whatDataShows: ["O campo evidência fica anexado à ação e entra no plano preliminar."],
    whyMatters: "Sem evidência, a ação não sustenta auditoria nem o PGR.",
    nextAction: "Anexe link, ID de documento interno ou descreva o entregável objetivo.",
    sources: ["NR-1 — rastreabilidade"],
    limitations: ["A plataforma não valida o conteúdo da evidência."],
  },

  // ===== Controls =====
  "controls.organizational": {
    summary: ["Controles organizacionais mudam a estrutura (carga, autonomia, liderança, comunicação)."],
    whatDataShows: ["Catálogo institucional separa por nível: eliminação, substituição, engenharia, administrativo, EPI/suporte."],
    whyMatters: "São preferidos pela NR-1 e pelo Playbook 2.0 — impacto mais durável.",
    nextAction: "Em /app/controls, priorize categorias de governança, liderança e organização do trabalho.",
    sources: ["Hierarquia de controles", "Work Wellbeing Playbook 2.0"],
    limitations: ["Controles implantados não recalculam o risco — apoiam plano e relatório."],
    ctas: [{ label: "Abrir Controles", to: "/app/controls" }],
  },
  "controls.hierarchy": {
    summary: ["Ordem: Eliminação > Substituição > Engenharia/Organizacional > Administrativo > EPI/Suporte."],
    whatDataShows: ["O catálogo já vem ranqueado por nível de hierarquia."],
    whyMatters: "Maior nível = maior eficácia esperada e menor dependência do indivíduo.",
    nextAction: "Sempre tente o nível mais alto disponível antes de descer na hierarquia.",
    sources: ["NR-1 / ISO 45003"],
    limitations: ["Nem toda dimensão admite eliminação total — registre a justificativa."],
  },
  "controls.efficacy": {
    summary: ["Eficácia é avaliada por indicadores (clima, adesão, ciclos seguintes) — não pela presença do controle."],
    whatDataShows: ["A plataforma registra adoção; a eficácia requer comparação entre ciclos."],
    whyMatters: "Adotar controle sem medir resultado não atende à melhoria contínua.",
    nextAction: "Reavalie no próximo ciclo aprovado e compare resultados reproduzíveis por dimensão.",
    sources: ["ISO 45003 — melhoria contínua"],
    limitations: ["Sem ciclo subsequente, não há base para inferir eficácia."],
  },

  // ===== Documents =====
  "documents.drps": {
    summary: [
      "DRPS preliminar = Diagnóstico de Riscos Psicossociais com base em ciclo k≥5.",
      "Inclui metodologia, achados agregados, priorização e limitações.",
    ],
    whatDataShows: ["Capa, organização, ciclo, critérios AIHA e disclaimer técnico aparecem na versão imprimível."],
    whyMatters: "Subsidia o PGR/GRO e a comunicação com SST/SESMT.",
    nextAction: "Gere o DRPS preliminar e encaminhe ao responsável técnico para validação.",
    sources: ["NR-1 — GRO/PGR, versão vigente sujeita a revisão", "Instrument Registry"],
    limitations: ["Não é laudo final, não substitui o responsável técnico."],
    ctas: [{ label: "Abrir Documentos", to: "/app/documents" }],
  },
  "documents.review": {
    summary: ["Toda saída da plataforma é preliminar e exige revisão técnica antes de uso oficial."],
    whatDataShows: ["O disclaimer aparece em todos os documentos gerados."],
    whyMatters: "Responsabilidade técnica permanece com SST/SESMT da organização.",
    nextAction: "Compartilhe o documento preliminar com o responsável técnico e registre a versão revisada.",
    sources: ["NR-1 — atribuições do empregador e do SESMT"],
    limitations: ["A plataforma não emite laudo nem assina o documento."],
  },
  "documents.limits": {
    summary: ["Limites técnicos: k-anonimato pode ocultar recortes, severidade é catálogo, probabilidade vem do % desfavorável."],
    whatDataShows: ["O documento explicita a versão dos critérios AIHA e o k mínimo aplicado."],
    whyMatters: "Transparência metodológica é exigência de auditoria e revisão técnica.",
    nextAction: "Mantenha o disclaimer no PDF e cite a versão dos critérios.",
    sources: ["AIHA 5×5", "Política institucional de privacidade"],
    limitations: ["Mudanças no catálogo de severidade afetam a comparabilidade entre ciclos."],
  },
  "documents.templates": {
    summary: [
      "Modelos orientativos: Termo de Consentimento, Comunicado aos Trabalhadores, Texto-modelo PGR, Controles Implantados.",
      "São referências editáveis pela organização — não substituem decisão técnica.",
    ],
    whatDataShows: ["Os modelos cobrem coleta (LGPD), comunicação (NR-1 1.5.7.4), PGR (1.5.4) e registro de controles."],
    whyMatters: "Padronizam a comunicação e reduzem retrabalho do RH/SST.",
    nextAction: "Baixe o modelo, adapte campos entre colchetes e arquive a versão final como registro rastreável.",
    sources: ["NR-1, versão vigente sujeita a revisão", "Instrument Registry"],
    limitations: ["Modelos não criam vínculo jurídico — exigem revisão pelo jurídico/SESMT da organização."],
    ctas: [{ label: "Abrir Documentos", to: "/app/documents" }],
  },

  // ===== Strategy =====
  "strategy.read": {
    summary: ["Cada recomendação cita ciclo, dimensão, R e fonte do catálogo."],
    whatDataShows: ["Sem ciclo k≥5, a Sra. EstratégIA orienta para etapas de coleta."],
    whyMatters: "Interpretação rastreável evita decisões baseadas em viés.",
    nextAction: "Combine a leitura com a opinião do responsável técnico antes de comunicar à liderança.",
    sources: ["Catálogo institucional preliminar", "Instrument Registry"],
    limitations: ["Recomendações são preliminares."],
  },
  "strategy.basis": {
    summary: ["A base atual é determinística: catálogo institucional + dados agregados visíveis."],
    whatDataShows: ["Nenhuma resposta consulta dados individuais ou recortes com n<5."],
    whyMatters: "Garante anti-alucinação e respeito ao k-anonimato.",
    nextAction: "Para evoluir, cadastre mais intervenções e amplie o catálogo institucional.",
    sources: ["riskTranslationMatrix", "nr1Interventions"],
    limitations: ["Sem RAG vetorial nesta versão."],
  },
  "strategy.gaps": {
    summary: ["Gaps comuns: amostra abaixo de k, catálogo de severidade incompleto, ausência de controles declarados."],
    whatDataShows: ["O cockpit indica recortes ocultados e dimensões sem driver mapeado."],
    whyMatters: "Sem fechar gaps, o DRPS perde representatividade.",
    nextAction: "Priorize aumentar adesão e registrar controles antes de gerar documentos finais.",
    sources: ["Catálogo institucional"],
    limitations: ["Cobertura depende do que está cadastrado."],
  },

  // ===== Aliases & Public Route Contextual Intelligence =====
  "overview.summary": {
    summary: [
      "A Plataforma 4 Lentes estrutura o ciclo PDCA do GRO/PGR (NR-1 Cap. 1.5): Mensurar (COPSOQ II + AEP NR-17), Educar (16 Drivers Oxford), Transformar (Controles na Fonte + Plano de Ação) e Evoluir/Relatar (Trio Documental do PGR em PDF).",
      "Toda análise coletiva aplica trava estatística de k-anonimato (k≥5) e rastreabilidade criptográfica SHA-256.",
    ],
    whatDataShows: [
      "Conformidade estruturada com os 19 capítulos do Manual Oficial MTE 2026 e o Work Wellbeing Playbook 2.0 (University of Oxford).",
    ],
    whyMatters:
      "Conecta exigência fiscal e jurídica (NR-1 Cap. 1.5, NR-17 e NR-7) à redução real de adoecimento ocupacional, turnover e perda de produtividade.",
    nextAction:
      "Explore os 9 módulos do Dashboard NR-1 (/app) ou solicite um Diagnóstico Institucional Assistido na aba Contato.",
    sources: [
      "Manual de Interpretação do Cap. 1.5 da NR-1 (MTE, 2026)",
      "Work Wellbeing Playbook 2.0 — University of Oxford (2025)",
      "NR-1 Cap. 1.5 · NR-17 (AEP/AET) · NR-7 (PCMSO)",
    ],
    limitations: ["A plataforma apoia a governança e documentação; a validação final cabe ao responsável técnico (SST/SESMT)."],
    ctas: [
      { label: "Acessar Dashboard NR-1", to: "/app" },
      { label: "Explorar Biblioteca MTE & Oxford", to: "/library" },
    ],
  },
  "home.overview": {
    summary: [
      "Você está na Página Principal da Plataforma 4 Lentes (Instituto Felicidade para Todos), estruturada em um funil decisório B2B que une a urgência da NR-1 (GRO/PGR) à Ciência do Bem-Estar no Trabalho.",
      "O fluxo percorre: Painel da Crise e Benchmark NR-1 × NR-28 → Simulador de Custos Organizacionais → Comparativo Sem vs. Com → 4 Lentes e 9 módulos /app → Seletor por Porte → 12 Drivers & 12 Dinâmicas → Pulso Regulatório™ → Prontidão em 4 perguntas → Plano de 90 Dias.",
    ],
    whatDataShows: [
      "Área autenticada /app integra 9 módulos interativos: Dashboard, Empresa, Unidades, Ciclos, Riscos, Ações, Controles, Documentos (.pdf) e Sra. EstratégIA — todos sob trava estatística de k-anonimato (k≥5).",
      "Cada módulo na seção 'Onde estão as funcionalidades NR-1?' abre uma janela educacional com arquitetura normativa e fluxo PDCA antes mesmo do login.",
    ],
    whyMatters:
      "Tratar a NR-1 apenas como checklist burocrático gera retrabalho e vulnerabilidade. Integrar governança psicossocial à Ciência do Bem-Estar constrói trilha auditável e melhora retenção, clima e desempenho coletivo.",
    nextAction:
      "Faça a Mini-Avaliação de Prontidão em 4 perguntas na página, simule seu cenário de custos ou explore o Dashboard sintético em /app.",
    sources: [
      "NR-1 Cap. 1.5 (Portarias MTE nº 1.419/2024 e nº 765/2025)",
      "NR-28 Anexos I e II (Portaria MTE nº 1.758/2026)",
      "Work Wellbeing Playbook 2.0 (referência externa sem chancela institucional)",
    ],
    limitations: [
      "Demonstração sintética ativa — dados reais e operações formais continuam bloqueados até as aprovações exigidas.",
      "Não substitui o responsável técnico de SST nem garante conformidade automática.",
    ],
    ctas: [
      { label: "Abrir Dashboard NR-1 (/app)", to: "/app" },
      { label: "Ver Planos e Trilhas B2B", to: "/planos" },
    ],
    highlights: [
      { label: "NR-1 Vigente", value: "26/05/2026", tone: "danger" },
      { label: "Privacidade", value: "k ≥ 5", tone: "good" },
      { label: "Módulos /app", value: "9 integrados", tone: "neutral" },
    ],
  },
  "home.nr28_benchmark": {
    summary: [
      "A NR-1 não fixa valores isolados de multa: as penalidades seguem a gradação oficial da NR-28 (Anexos I e II, atualizada pela Portaria MTE nº 1.758/2026), convertida pela UFIR de R$ 1,0641.",
      "Para infrações estruturais de Segurança (Tipo S, Grau 4), os valores vão de R$ 2.396,35–R$ 2.852,85 (1 a 10 empregados) até o teto de 6.304 UFIR (R$ 6.708,09 por auto de infração acima de 1.000 empregados ou em reincidência); em Medicina (Tipo M / PCMSO), o teto é de 3.782 UFIR (R$ 4.024,43).",
    ],
    whatDataShows: [
      "01. Autuações Cumulativas: cada item descumprido (falta de inventário psicossocial, ausência de plano de ação, falta de participação/CIPA ou descompasso PGR-PCMSO) pode gerar autos independentes por estabelecimento.",
      "02. Majoração do FAP (0,50 a 2,00) e RAT/SAT: afastamentos ligados a estresse crônico e saúde mental podem dobrar a alíquota RAT sobre toda a folha salarial (Decreto nº 3.048/1999).",
      "03. Ações Regressivas do INSS (Art. 120 da Lei 8.213/1991), passivos trabalhistas, estabilidade de 12 meses e risco de embargos/interdições ou TAC junto ao MPT.",
    ],
    whyMatters:
      "O risco financeiro decisivo raramente está em uma multa isolada, mas no efeito cascata acumulado sobre a folha, no passivo trabalhista e na exposição reputacional.",
    nextAction:
      "Use o Simulador de Custos Organizacionais logo abaixo do quadro NR-28 para visualizar automaticamente a faixa NR-28 do porte da sua empresa ao lado do custo anual de turnover, absenteísmo e presenteísmo.",
    sources: [
      "NR-28 · Anexos I e II · Portaria MTE nº 1.758/2026 (UFIR R$ 1,0641)",
      "Art. 201 da CLT · Decreto nº 3.048/1999 (FAP/RAT)",
      "Lei nº 8.213/1991 (Art. 120 — Ações Regressivas INSS)",
    ],
    limitations: [
      "Os valores refletem conversão aritmética da tabela oficial da NR-28 e dependem do enquadramento da inspeção do trabalho; validação jurídica e técnica é obrigatória.",
    ],
    ctas: [
      { label: "Ver Pulso Regulatório Completo", to: "/planos#regulatorio" },
      { label: "Explorar Prontidão Documental", to: "/app/documents" },
    ],
    highlights: [
      { label: "Teto Tipo S (G4)", value: "R$ 6.708,09", tone: "danger" },
      { label: "Teto Tipo M (G4)", value: "R$ 4.024,43", tone: "warn" },
      { label: "Multiplicador FAP", value: "0,50 a 2,00", tone: "danger" },
    ],
  },
  "home.cost_simulator": {
    summary: [
      "O Simulador de Custos Organizacionais da Página Principal permite modelar um cenário ilustrativo com fórmulas 100% abertas a partir de 7 premissas: colaboradores, salário médio, turnover, absenteísmo, presenteísmo, custo por desligamento e perda de produtividade.",
      "Ele conta com presets rápidos de porte (PME · 80, Média · 500 e Enterprise · 2.000), gráfico proporcional interativo por componente, sensibilidade aritmética (10%, 20% ou 30%), comparação automática com a faixa NR-28 do seu porte e botão para copiar o resumo executivo para a diretoria.",
    ],
    whatDataShows: [
      "Turnover = colaboradores × taxa_turnover × custo_desligamento.",
      "Absenteísmo, Presenteísmo e Perda de Produtividade = massa_salarial_anual × respectiva taxa.",
      "O painel sincroniza automaticamente o número de colaboradores escolhido com a faixa correspondente da NR-28 (Grau 4, Tipo S) para demonstrar a proporção entre o passivo regulatório e o custo organizacional recorrente.",
    ],
    whyMatters:
      "Ajuda RH, SST e CFO a saírem de discussões subjetivas e levarem uma pauta clara, revisável e auditável ao comitê executivo antes de priorizar investimentos.",
    nextAction:
      "Ajuste os controles deslizantes no Simulador da Página Principal e clique em 'Copiar resumo executivo' para compartilhar com sua liderança ou avançar para a Mini-Avaliação de Prontidão.",
    sources: [
      "Fórmulas abertas do Simulador Organizacional (Página Principal)",
      "NR-28 Anexo I — Faixas por Porte (UFIR R$ 1,0641)",
    ],
    limitations: [
      "Cenário puramente ilustrativo: não constitui previsão financeira, garantia de economia, ROI garantido ou auditoria contábil.",
    ],
    ctas: [
      { label: "Ver Planos e Trilhas B2B", to: "/planos" },
      { label: "Acessar Dashboard Sintético", to: "/app" },
    ],
    highlights: [
      { label: "Presets de Porte", value: "80 · 500 · 2.000", tone: "neutral" },
      { label: "Sensibilidade", value: "10% · 20% · 30%", tone: "good" },
      { label: "Exportação", value: "Resumo Diretoria", tone: "neutral" },
    ],
  },
  "home.wellbeing_science": {
    summary: [
      "A plataforma combina a obrigação legal da NR-1 (GRO/PGR) com a Ciência do Bem-Estar no Trabalho — integrando os 12 Drivers do Work Wellbeing Playbook 2.0, 12 dinâmicas pedagógicas ativas e o modelo JD-R / ISO 45003.",
      "Em vez de ações isoladas de conscientização, cada fator de risco psicossocial mapeado aciona drivers organizacionais modificáveis (como Reconhecimento, Liderança, Autonomia, Apoio Social, Pertencimento e Propósito).",
    ],
    whatDataShows: [
      "Evidências globais de referência (OMS/OIT 2022 e Gallup 2023) apontam perdas de US$ 1 trilhão/ano e 12 bilhões de dias de trabalho por adoecimento mental, com apenas 23% de engajamento global.",
      "As 12 dinâmicas pedagógicas (prática guiada, estudos de caso, laboratórios de liderança e mentores de IA em modo demonstrativo) promovem retenção de aprendizagem e transferência para a rotina de gestão.",
    ],
    whyMatters:
      "Cumprir a NR-1 com base na Ciência do Bem-Estar transforma uma exigência fiscal em infraestrutura de retenção, engajamento e desempenho sustentável.",
    nextAction:
      "Explore os 12 Drivers na Página Principal ou acesse /drivers e /library para inspecionar as referências científicas e o preview da Matriz JD-R.",
    sources: [
      "Work Wellbeing Playbook 2.0 (fonte primária externa — sem chancela institucional)",
      "ISO 45003 · Modelo Demandas-Recursos (JD-R) · OMS / OIT (2022)",
    ],
    limitations: [
      "Referências científicas externas não implicam afiliação ou validação automática; os mentores de IA operam em modo educacional sem finalidade clínica.",
    ],
    ctas: [
      { label: "Explorar os 12 Drivers", to: "/drivers" },
      { label: "Abrir Biblioteca de Referências", to: "/library" },
    ],
    highlights: [
      { label: "Drivers Playbook", value: "12 mundos", tone: "good" },
      { label: "Dinâmicas Ativas", value: "12 formatos", tone: "neutral" },
      { label: "Base Técnica", value: "JD-R · ISO 45003", tone: "neutral" },
    ],
  },
  "home.regulatory_pulse": {
    summary: [
      "O Pulso Regulatório™ reúne no mesmo painel três marcos complementares: NR-1 (obrigação vigente em 26/05/2026), NR-28 (fiscalização e multas atualizadas pela Portaria MTE nº 1.758/2026) e Lei nº 14.831/2024 (Certificado Empresa Promotora da Saúde Mental).",
      "Assim, a empresa equilibra defesa jurídica (inventário psicossocial, controles organizacionais e trilha auditável) com fortalecimento reputacional da marca empregadora.",
    ],
    whatDataShows: [
      "NR-1 (GRO/PGR): exige identificar, avaliar e controlar fatores psicossociais ligados à organização do trabalho com participação dos trabalhadores/CIPA e integração ao PCMSO (NR-7).",
      "NR-28: estabelece a dosimetria de penalidades em UFIR e o risco de autos cumulativos por estabelecimento.",
      "Lei nº 14.831/2024: certificação voluntária concedida por comissão certificadora para empresas com políticas consistentes de promoção da saúde mental.",
    ],
    whyMatters:
      "Conecta risco regulatório imediato (mitigação de autuações e passivos) à oportunidade estratégica de atração e retenção de talentos.",
    nextAction:
      "Consulte a matriz normativa completa em /planos#regulatorio ou avalie em 1 minuto sua prontidão atual na seção de 4 perguntas da Página Principal.",
    sources: [
      "Portarias MTE nº 1.419/2024, nº 765/2025 e nº 1.758/2026",
      "Lei Federal nº 14.831/2024 (Planalto)",
    ],
    limitations: [
      "A plataforma organiza evidências e governança documental, mas não garante conformidade automática nem a concessão do certificado da Lei 14.831/2024.",
    ],
    ctas: [
      { label: "Abrir Matriz Normativa", to: "/planos#regulatorio" },
      { label: "Ver Documentos PGR (.pdf)", to: "/app/documents" },
    ],
  },
  "home.roadmap_90d": {
    summary: [
      "A jornada 'Da incerteza ao plano de 90 dias' organiza a evolução da empresa em 3 janelas progressivas: Dias 1–30 (Prontidão & Contexto), Dias 31–60 (Demonstração & Escuta Protegida) e Dias 61–90 (Roadmap Auditável & Ciclos).",
      "Antes de iniciar, o visitante pode responder à Mini-Avaliação de Prontidão em 4 perguntas (sem enviar dados pessoais) e comparar o cenário 'Sem vs. Com a plataforma' além do perfil específico de RH, SST ou Diretoria.",
    ],
    whatDataShows: [
      "Dias 1–30: mapeamento de escopo, unidades/GHE, papéis (RH, SST, CIPA, liderança) e lacunas de evidência.",
      "Dias 31–60: validação da jornada medir → educar → agir em demonstração sintética e alinhamento de governança (k≥5) antes de qualquer coleta real.",
      "Dias 61–90: priorização de controles organizacionais na fonte, trilhas dos 12 drivers, critérios de aceite e revisão técnica contínua.",
    ],
    whyMatters:
      "Elimina a paralisia diante da complexidade da NR-1, oferecendo um cronograma realista e revisável para apresentar ao comitê de compras e à diretoria.",
    nextAction:
      "Responda à Mini-Avaliação de Prontidão na Página Principal, escolha seu perfil em 'Para quem é' ou acesse a aba Contato aqui na Sra. EstratégIA para estruturar os próximos passos.",
    sources: [
      "Roteiro de 90 Dias & Governança Progressiva — Instituto Felicidade para Todos",
      "NR-1 Cap. 1.5 · Ciclo PDCA do GRO/PGR",
    ],
    limitations: [
      "Dados reais, campanhas produtivas e documentos formais dependem de aprovações técnicas, jurídicas e de governança.",
    ],
    ctas: [
      { label: "Ver Planos e Trilhas B2B", to: "/planos#pricing" },
      { label: "Explorar Dashboard Sintético", to: "/app" },
    ],
    highlights: [
      { label: "Dias 1–30", value: "Prontidão & GHE", tone: "neutral" },
      { label: "Dias 31–60", value: "Escuta & k≥5", tone: "warn" },
      { label: "Dias 61–90", value: "Roadmap PGR", tone: "good" },
    ],
  },
  "home.roi": {
    summary: [
      "O custo da inação em riscos psicossociais combina turnover, absenteísmo, presenteísmo, queda de produtividade e o efeito cascata regulatório (NR-28, majoração do FAP 0,50–2,00 e ações regressivas do INSS).",
      "Na literatura externa, a OMS (2019) reporta retorno médio de 4:1 em programas estruturados de saúde mental — referência útil para discussão executiva, sem promessa de retorno garantido.",
    ],
    whatDataShows: [
      "O Simulador de Custos Organizacionais na Página Principal calcula instantaneamente o custo anual, mensal e por colaborador com presets (PME, Média, Enterprise), gráfico de composição % e sensibilidade aritmética de 10% a 30%.",
      "Você pode copiar o resumo executivo completo em 1 clique para levar a pauta à Diretoria ou ao Conselho.",
    ],
    whyMatters:
      "Traduzir riscos psicossociais e bem-estar em linguagem financeira e de governança acelera o alinhamento entre RH, SST, Jurídico e CFO.",
    nextAction:
      "Teste suas premissas no Simulador de Custos, copie o resumo executivo ou abra a aba 'Contato' na Sra. EstratégIA para preparar a apresentação ao seu comitê.",
    sources: ["OMS / OIT (2019, 2022)", "NR-28 Anexos I e II", "Simulador Organizacional (fórmulas abertas)"],
    limitations: [
      "Estimativas são puramente ilustrativas e não constituem previsão financeira, economia garantida ou auditoria.",
    ],
    ctas: [
      { label: "Ver Planos Institucionais", to: "/planos" },
      { label: "Abrir Documentos Executivos", to: "/app/documents" },
    ],
  },
  "library.mte_oxford": {
    summary: [
      "Na Biblioteca de Evidências (/library), unimos as duas fontes canônicas primárias: o Manual Oficial MTE 2026 (19 capítulos comentados da NR-1 Cap. 1.5) e o Work Wellbeing Playbook 2.0 da Universidade de Oxford.",
    ],
    whatDataShows: [
      "O MTE define 'o que' auditar e documentar no GRO/PGR (perigos, matriz S×P, 4 momentos da CIPA, trio documental do PGR e ponte PCMSO NR-7).",
      "Oxford define 'como' intervir na fonte com eficácia comprovada através do ciclo Medir → Compreender → Agir e dos 16 Drivers DRIVER.",
    ],
    whyMatters:
      "Garante critério rigoroso anti-alucinação: toda recomendação técnica da plataforma tem lastro normativo brasileiro e revisão sistemática internacional.",
    nextAction:
      "Inspecione os dois documentos canônicos no topo da Biblioteca ou abra a Matriz de Riscos para ver a tradução aplicada.",
    sources: [
      "Manual de Interpretação do Cap. 1.5 da NR-1 (MTE, 2026 — 115 p.)",
      "Work Wellbeing Playbook 2.0 (Oxford / WWM, 2025)",
    ],
    limitations: ["Acervo científico atualizado continuamente sob governança curatorial."],
    ctas: [
      { label: "Ver Matriz de Riscos Aplicada", to: "/app/risk" },
      { label: "Explorar Drivers Oxford", to: "/drivers" },
    ],
  },
  "drivers.how_it_works": {
    summary: [
      "Cada Driver do Work Wellbeing Playbook 2.0 (Oxford) representa um fator organizacional modificável (ex.: Segurança Psicológica, Autonomia, Liderança, Flexibilidade, Reconhecimento).",
    ],
    whatDataShows: [
      "Quando uma dimensão do COPSOQ II apresenta risco moderado, alto ou crítico no ciclo (k≥5), o motor NEXO aciona automaticamente o Driver correspondente com trilhas de 90 dias e PDFs pedagógicos.",
    ],
    whyMatters:
      "Cumpre a exigência do Cap. 11 do Guia MTE 2026: priorizar medidas de prevenção coletivas e organizacionais na fonte, e não ações meramente individuais.",
    nextAction:
      "Selecione um Driver para explorar suas dinâmicas pedagógicas e gerar a Trilha de Implementação em PDF.",
    sources: ["Work Wellbeing Playbook 2.0 — University of Oxford", "Guia Oficial MTE 2026 — Cap. 11"],
    limitations: ["As trilhas apoiam o desenvolvimento organizacional e devem ser registradas no Plano de Ação do PGR."],
    ctas: [
      { label: "Vincular ao Plano de Ação", to: "/app/actions" },
      { label: "Ver Controles na Fonte", to: "/app/controls" },
    ],
  },
  "plans.advisory": {
    summary: [
      "O Instituto Felicidade para Todos oferece desde o diagnóstico assistido de prontidão NR-1 Cap. 1.5 até programas completos de intervenção organizacional e governança contínua para o PGR.",
    ],
    whatDataShows: [
      "Inclui setup de ciclos COPSOQ II com k≥5, integração AEP/AET (NR-17), formação de lideranças nos Drivers de Oxford e emissão do trio documental do PGR em PDF 5 estrelas.",
    ],
    whyMatters:
      "Acelera a maturidade institucional com segurança jurídica, rigor metodológico e alto engajamento dos trabalhadores e da CIPA.",
    nextAction:
      "Abra a aba 'Contato' aqui na janela da Sra. EstratégIA para registrar sua solicitação institucional com o contexto já preenchido.",
    sources: ["Instituto Felicidade para Todos — Governança Consultiva NR-1"],
    limitations: ["Escopo e cronograma são customizados conforme porte e número de unidades/GES."],
    ctas: [
      { label: "Testar Ciclo no Dashboard", to: "/app/cycles" },
      { label: "Ver Prontidão Documental", to: "/app/documents" },
    ],
  },
  "cycle.readiness": {
    summary: [
      "A prontidão do ciclo exige: unidades/GES estruturados, instrumento aprovado (COPSOQ II), distribuição segura de tokens anônimos e alcance de amostra k≥5 por recorte.",
    ],
    whatDataShows: [
      "A coleta anônima é combinada à Análise Ergonômica Preliminar (AEP — NR-17) e aos 4 momentos de participação dos trabalhadores e consulta à CIPA (Cap. 6 do Guia MTE 2026).",
    ],
    whyMatters:
      "O Manual MTE 2026 (Cap. 8.2 e Cap. 11) veda diagnósticos baseados apenas em percepção isolada sem conexão com a atividade real e sem garantia de anonimato.",
    nextAction: "Gerencie seus convites em /app/cycles e registre a observação da atividade em /app/work-analysis.",
    sources: ["Guia Oficial MTE 2026 — Cap. 6, 8.2 e 11", "Instrument Registry — COPSOQ II"],
    limitations: ["Recortes com n < 5 permanecem bloqueados automaticamente pelo Privacy Vault."],
    ctas: [
      { label: "Abrir Ciclos de Escuta", to: "/app/cycles" },
      { label: "Abrir Trabalho Real (AEP)", to: "/app/work-analysis" },
    ],
  },
  "documents.which": {
    summary: [
      "O Capítulo 4 e o Capítulo 13 do Manual Oficial MTE 2026 exigem 3 documentos mínimos no PGR: (1) Inventário de Riscos, (2) Plano de Ação e (3) Critérios de Avaliação e Tomada de Decisão do GRO (item 1.5.4.4.2.2), além da Ponte PGR ↔ PCMSO (NR-7).",
    ],
    whatDataShows: [
      "Todos os documentos em /app/documents são exportados em formato PDF (.pdf) com Design Instrucional Gráfico 5 Estrelas, identidade visual dupla (Instituto + Empresa) e hash SHA-256.",
    ],
    whyMatters:
      "Garante apresentação executiva impecável para o Conselho/Diretoria e rastreabilidade técnica para auditoria fiscal do trabalho.",
    nextAction:
      "Acesse /app/documents para baixar o 3º Documento Obrigatório do PGR (.pdf), a Ponte PCMSO (.pdf) e o DRPS preliminar (.pdf).",
    sources: ["Manual Oficial MTE 2026 — Cap. 4, 12.3 e 13", "NR-1 subitens 1.5.4.4.2.2, 1.5.5.1.1 'c' e 1.5.7.1"],
    limitations: ["Documentos preliminares exigem assinatura do responsável técnico (SST/SESMT)."],
    ctas: [
      { label: "Emitir Documentos em PDF", to: "/app/documents" },
      { label: "Revisar Critérios de Risco", to: "/app/criteria" },
    ],
  },
};

export function answerByIntent(intent: string, ctx: AuroraContext): AuroraAnswer {
  switch (intent) {
    case "risk.top3":
    case "risk.explain_top3":
      return explainTop3(ctx);
    case "risk.first_dimension":
      return firstDimension(ctx);
    case "risk.interventions":
    case "actions.suggest_first":
      return interventionsAnswer(ctx);
    case "cycles.k5_gap":
    case "risk.suppressed":
      return k5Gap(ctx);
  }
  const stat = STATIC[intent];
  if (stat) return stat;

  // Fallback genérico por seção (sem inventar)
  return {
    summary: ["Esta pergunta não tem resposta cadastrada na base institucional."],
    whatDataShows: [],
    whyMatters: AURORA_NO_DATA,
    nextAction: "Consulte o catálogo institucional ou o responsável técnico (SST/PGR).",
    sources: [],
    limitations: ["Aurora opera apenas com conteúdo cadastrado."],
  };
}

// Filtros simples para uso na UI
export function summarizeScoresForHighlights(scores: AuroraScore[]) {
  return scores.slice(0, 3).map((s) => ({
    label: getDimensionLabel(s.dimension, "pt-BR"),
    value: `R${s.risk_level}`,
    tone: (riskBand(s.risk_level) === "critico"
      ? "danger"
      : riskBand(s.risk_level) === "alto"
      ? "warn"
      : "neutral") as "danger" | "warn" | "neutral",
  }));
}
