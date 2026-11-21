import type {
  ExternalAudiencePackContext,
  ExternalAudiencePackInput,
  ExternalAudiencePackPolicy,
} from "@/lib/governance/externalAudiencePack";

export const g1ExternalAudiencePackPolicy: ExternalAudiencePackPolicy = Object.freeze({
  policyId: "g1-external-audience-pack-2026-07-14",
  requiredSections: ["opening", "scope", "boundaries", "walkthrough", "difficult_questions", "stop_conditions", "closing"] as const,
  requiredBoundaries: [
    "synthetic_only",
    "no_diagnosis",
    "no_compliance_guarantee",
    "no_real_data",
    "no_delivery",
    "instrument_not_validated",
    "does_not_replace_aep_aet",
  ] as const,
  minimumQuestions: 6,
  minimumStopConditions: 6,
  requireFacilitator: true,
  requireAccountableOwner: true,
  requireLegalReview: true,
  requireSstReview: true,
  requireFormalDecision: true,
});

export const g1ExternalAudiencePackContext: ExternalAudiencePackContext = Object.freeze({
  syntheticMode: true,
  freeTextCollectionEnabled: false,
  remoteTransportEnabled: false,
  facilitatorAssigned: false,
  accountableOwnerAssigned: false,
  legalReviewed: false,
  sstReviewed: false,
  formalDecision: "pending",
  formalDecisionEvidenceRef: null,
});

export const g1ExternalAudiencePack: ExternalAudiencePackInput = {
  packId: "external-audience-g1-synthetic",
  version: "2026-07-14.1-draft",
  sections: [
    {
      key: "opening",
      label: "Abertura obrigatória",
      status: "ready",
      lines: [
        "Esta é uma demonstração sintética e educativa em validação, sem dados de trabalhadores ou operação produtiva.",
        "O objetivo é avaliar clareza da jornada, governança e capacidade de transformar sinais coletivos em hipóteses de ação.",
      ],
    },
    {
      key: "scope",
      label: "Escopo permitido",
      status: "ready",
      lines: [
        "Usaremos somente cenários fictícios determinísticos e estado local da página.",
        "A sessão demonstra preflight, leitura exploratória, comprovante local, feedback controlado e descarte por reload.",
      ],
    },
    {
      key: "boundaries",
      label: "Limites metodológicos e regulatórios",
      status: "ready",
      lines: [
        "A visualização não produz diagnóstico, laudo, conformidade, decisão técnica ou instrumento validado.",
        "Questionário e interface não substituem AEP, AET, trabalho real, participação dos trabalhadores ou responsável competente.",
      ],
    },
    {
      key: "walkthrough",
      label: "Sequência da demonstração",
      status: "ready",
      lines: [
        "Concluir o preflight, selecionar um cenário sintético e revisar o preenchimento fictício.",
        "Gerar a leitura, conferir comprovante e limites, testar feedback estruturado e concluir o handoff local.",
      ],
    },
    {
      key: "difficult_questions",
      label: "Perguntas difíceis",
      status: "ready",
      lines: [
        "Responder somente com o catálogo seguro e encaminhar decisões técnicas, jurídicas ou metodológicas ao accountable competente.",
      ],
    },
    {
      key: "stop_conditions",
      label: "Condições de interrupção",
      status: "ready",
      lines: [
        "Interromper diante de dado real, interpretação diagnóstica, promessa comercial indevida, crise individual ou falha do ambiente seguro.",
      ],
    },
    {
      key: "closing",
      label: "Encerramento obrigatório",
      status: "ready",
      lines: [
        "Reafirmar que nenhum resultado foi entregue, persistido ou autorizado para uso real.",
        "Registrar apenas feedback estruturado local, concluir o handoff e recarregar para descartar o estado.",
      ],
    },
  ],
  boundaries: [
    { key: "synthetic_only", label: "Somente cenários e dados fictícios", declared: true },
    { key: "no_diagnosis", label: "Não produz diagnóstico individual ou organizacional", declared: true },
    { key: "no_compliance_guarantee", label: "Não garante conformidade regulatória", declared: true },
    { key: "no_real_data", label: "Não aceita dados reais ou de trabalhadores", declared: true },
    { key: "no_delivery", label: "Não gera entrega, laudo ou relatório formal", declared: true },
    { key: "instrument_not_validated", label: "Não apresenta instrumento ou scoring como validado", declared: true },
    { key: "does_not_replace_aep_aet", label: "Não substitui AEP, AET, trabalho real ou participação", declared: true },
  ],
  questions: [
    {
      key: "compliance",
      question: "Isso garante conformidade com a NR-1?",
      safeAnswer: "Não. A demonstração organiza uma jornada possível, mas conformidade depende de análise do trabalho, governança e responsáveis competentes.",
      escalation: "Encaminhar interpretação normativa ao Jurídico e responsável SST.",
    },
    {
      key: "validated_instrument",
      question: "O questionário e o scoring já estão validados?",
      safeAnswer: "Não. O pacote metodológico canônico, licença, scoring e fixtures permanecem bloqueados para aprovação independente.",
      escalation: "Encaminhar ao responsável metodológico/psicométrico.",
    },
    {
      key: "real_workers",
      question: "Podemos testar com trabalhadores reais agora?",
      safeAnswer: "Não. Dados e participantes reais permanecem proibidos; esta versão aceita somente cenários fictícios locais.",
      escalation: "Interromper a sessão se houver tentativa de inserir ou compartilhar dado real.",
    },
    {
      key: "diagnosis",
      question: "O resultado identifica risco ou diagnóstico da empresa?",
      safeAnswer: "Não. A saída é uma leitura visual exploratória de respostas fictícias e não constitui avaliação ou diagnóstico técnico.",
      escalation: "Encaminhar qualquer interpretação real ao responsável SST/Ergonomia.",
    },
    {
      key: "storage",
      question: "Onde as respostas e o feedback ficam armazenados?",
      safeAnswer: "Nesta demo, ficam apenas na memória da página e desaparecem ao recarregar; não há persistência ou envio remoto.",
      escalation: "Interromper se a rede, console ou serviço externo indicar comportamento diferente.",
    },
    {
      key: "delivery",
      question: "Podemos exportar ou receber um relatório formal?",
      safeAnswer: "Não. A demonstração não realiza entrega, exportação, agendamento ou documento técnico.",
      escalation: "Encaminhar interesse comercial sem prometer prazo, escopo ou capacidade ainda não aprovada.",
    },
  ],
  stopConditions: [
    {
      key: "real_data",
      trigger: "Alguém tenta inserir nome, empresa, relato, resposta ou situação real.",
      recovery: "Parar, recarregar a página e não registrar ou compartilhar captura.",
    },
    {
      key: "diagnostic_interpretation",
      trigger: "A audiência interpreta a leitura como diagnóstico, laudo ou decisão técnica.",
      recovery: "Corrigir a interpretação, retornar aos limites e suspender se a ambiguidade persistir.",
    },
    {
      key: "overclaim",
      trigger: "Surge promessa de conformidade, validação, resultado, entrega ou maturidade produtiva.",
      recovery: "Interromper a narrativa e usar somente a resposta segura versionada.",
    },
    {
      key: "individual_crisis",
      trigger: "É relatada crise, sofrimento ou risco individual que demande cuidado.",
      recovery: "Encerrar a demo e acionar fluxo humano de cuidado separado, sem coletar resposta ou quebrar anonimato.",
    },
    {
      key: "unsafe_runtime",
      trigger: "Aparece persistência, transporte remoto, erro de runtime ou comportamento não ensaiado.",
      recovery: "Encerrar, preservar apenas log técnico não sensível e encaminhar à engenharia.",
    },
    {
      key: "approval_claim",
      trigger: "A sessão é apresentada como G1 aprovado, piloto autorizado ou SaaS real.",
      recovery: "Corrigir imediatamente para draft sintético e suspender se a alegação não puder ser removida.",
    },
  ],
};
