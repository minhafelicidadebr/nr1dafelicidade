import type {
  DesignPartnerSessionPolicy,
  SessionAcknowledgementKey,
  SessionHandoffConfirmationKey,
} from "@/lib/governance/designPartnerSession";

export const g1DesignPartnerSessionPolicy: DesignPartnerSessionPolicy = Object.freeze({
  policyId: "g1-design-partner-session-2026-07-14",
  minimumScenarioCount: 1,
  acknowledgementKeys: ["synthetic_only", "no_technical_decision", "memory_only"] as const,
  handoffConfirmationKeys: ["limits_explained", "receipt_viewed", "feedback_tested", "discard_explained"] as const,
});

export const g1SessionAcknowledgements: readonly {
  key: SessionAcknowledgementKey;
  label: string;
  detail: string;
}[] = [
  {
    key: "synthetic_only",
    label: "Usarei somente dados fictícios",
    detail: "Não informarei nomes, empresas, relatos, respostas ou situações reais de trabalhadores.",
  },
  {
    key: "no_technical_decision",
    label: "Entendo que esta demo não produz diagnóstico ou decisão técnica",
    detail: "A leitura visual não valida instrumento, scoring, AEP/AET, GRO/PGR ou conformidade.",
  },
  {
    key: "memory_only",
    label: "Entendo que nada será salvo ou enviado",
    detail: "Respostas, comprovante, feedback e encerramento existem somente na memória desta página.",
  },
];

export const g1SessionCapacityConstraints = [
  { key: "single_session", label: "Uma sessão local por aba", detail: "Sem sincronização entre dispositivos ou navegadores." },
  { key: "loaded_assets", label: "Rede não é fallback de dados", detail: "Sem garantia offline; prossiga sem rede somente se os assets já estiverem carregados." },
  { key: "no_export", label: "Sem entrega ou exportação", detail: "Não gera relatório formal, campanha, documento técnico ou evidência externa." },
  { key: "no_real_data", label: "Capacidade real bloqueada", detail: "Instrumento, scoring canônico, persistência e transporte remoto permanecem desabilitados." },
] as const;

export const g1SessionHandoffConfirmations: readonly {
  key: SessionHandoffConfirmationKey;
  label: string;
}[] = [
  { key: "limits_explained", label: "Expliquei os limites metodológicos e operacionais" },
  { key: "receipt_viewed", label: "Conferi o comprovante local da demonstração" },
  { key: "feedback_tested", label: "Testei o feedback estruturado sem campo livre" },
  { key: "discard_explained", label: "Expliquei o descarte por reload e confirmei ausência de dados reais" },
];
