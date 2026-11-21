import { g1FormalRoles } from "@/data/g1FormalAcceptance";
import type {
  AccountableNominationPackContext,
  AccountableNominationPackInput,
  AccountableNominationPackPolicy,
  AccountableNominationRoleInput,
} from "@/lib/governance/accountableNominationPack";
import { evaluateAccountableNominationPack } from "@/lib/governance/accountableNominationPack";
import type { FormalAcceptanceRoleKey } from "@/lib/governance/formalAcceptance";

type RoleCharterTemplate = Pick<
  AccountableNominationRoleInput,
  "purpose" | "minimumAuthority" | "responsibilities" | "requiredEvidence"
>;

const roleCharters = {
  product_sponsor: {
    purpose: "Responder pelo escopo, recursos, risco residual e autoridade final de suspensão.",
    minimumAuthority: ["Autoridade executiva sobre o escopo G1", "Poder explícito para suspender sessão ou campanha"],
    responsibilities: ["Confirmar limites e recursos", "Resolver conflitos entre disciplinas", "Preservar o No-Go diante de evidência insuficiente"],
    requiredEvidence: ["Mandato ou designação verificável", "Registro da autoridade de suspensão"],
  },
  sst_owner: {
    purpose: "Revisar limites de SST, GRO/PGR, documentos preliminares e encaminhamentos técnicos.",
    minimumAuthority: ["Habilitação ou mandato técnico aplicável", "Autoridade para interromper interpretação insegura"],
    responsibilities: ["Revisar escopo de SST", "Impedir diagnóstico ou substituição de avaliação técnica", "Registrar ressalvas técnicas"],
    requiredEvidence: ["Registro profissional ou mandato", "Parecer SST versionado"],
  },
  ergonomics_owner: {
    purpose: "Proteger a análise do trabalho real e os limites entre questionário, AEP e AET.",
    minimumAuthority: ["Competência formal em ergonomia", "Autoridade para exigir observação e participação"],
    responsibilities: ["Revisar protocolo de trabalho real", "Validar limites de AEP/AET", "Registrar necessidade de observação"],
    requiredEvidence: ["Registro ou designação técnica", "Parecer de ergonomia versionado"],
  },
  methodology_owner: {
    purpose: "Responder por fonte, licença, instrumento, subescalas, scoring e fixtures.",
    minimumAuthority: ["Competência metodológica ou psicométrica documentada", "Autoridade para bloquear claims de validação"],
    responsibilities: ["Revisar pacote canônico", "Validar scoring e fixtures", "Registrar limitações metodológicas"],
    requiredEvidence: ["Designação metodológica", "Parecer sobre fonte, licença e scoring"],
  },
  dpo_owner: {
    purpose: "Revisar finalidade, base legal, transparência, retenção, descarte e incidentes LGPD.",
    minimumAuthority: ["Mandato de encarregado ou função equivalente", "Canal independente de escalonamento"],
    responsibilities: ["Revisar governança de dados", "Manter respostas individuais inacessíveis", "Validar resposta a incidente"],
    requiredEvidence: ["Designação do encarregado", "Parecer de privacidade e retenção"],
  },
  legal_owner: {
    purpose: "Revisar claims, responsabilidades, linguagem regulatória e limites contratuais.",
    minimumAuthority: ["Mandato jurídico/regulatório", "Autoridade para vetar claims ou condições inseguras"],
    responsibilities: ["Revisar narrativa externa", "Validar limites de responsabilidade", "Registrar condições jurídicas"],
    requiredEvidence: ["Designação jurídica", "Parecer ou ata com escopo e ressalvas"],
  },
  security_owner: {
    purpose: "Responder por arquitetura segura, CI oficial, branch protection e evidência de release.",
    minimumAuthority: ["Mandato de segurança/arquitetura", "Autoridade de bloqueio de release"],
    responsibilities: ["Revisar threat model e CI", "Comprovar controles de release", "Coordenar correção técnica"],
    requiredEvidence: ["Designação de segurança", "Relatório de CI, proteção e sincronização"],
  },
  worker_representation: {
    purpose: "Garantir participação, linguagem não coerciva e proteção contra retaliação.",
    minimumAuthority: ["Mandato legítimo de representação", "Canal seguro para objeção e suspensão"],
    responsibilities: ["Revisar comunicação ao trabalhador", "Registrar participação real", "Escalar coerção ou risco de retaliação"],
    requiredEvidence: ["Registro do mandato representativo", "Ata de participação e objeções"],
  },
  operations_owner: {
    purpose: "Responder por operação, suporte, descarte, incidente e continuidade.",
    minimumAuthority: ["Mandato operacional", "Autoridade para suspender sessão e acionar incidente"],
    responsibilities: ["Confirmar runbooks e suporte", "Coordenar interrupção e descarte", "Registrar exercício operacional"],
    requiredEvidence: ["Designação operacional", "Ata de treinamento, incidente ou tabletop"],
  },
} satisfies Record<FormalAcceptanceRoleKey, RoleCharterTemplate>;

export const g1AccountableNominationPackPolicy: AccountableNominationPackPolicy = Object.freeze({
  policyId: "g1-accountable-nomination-pack-2026-07-14",
  requiredRoleKeys: g1FormalRoles.filter((role) => role.required).map((role) => role.key),
  requiredAgendaKeys: [
    "scope_boundaries",
    "role_nomination",
    "authority_continuity",
    "evidence_review",
    "stop_conditions",
    "decisions_and_receipts",
  ] as const,
  minimumAuthorityItems: 2,
  minimumResponsibilities: 2,
  minimumEvidenceItems: 2,
  minimumBoundaries: 6,
  requireBlankIdentityFields: true,
  prohibitPersistence: true,
  prohibitRemoteTransport: true,
  prohibitFormalReviewClaim: true,
  prohibitGateAdvance: true,
  prohibitRealData: true,
});

export const g1AccountableNominationPackContext: AccountableNominationPackContext = Object.freeze({
  persistenceEnabled: false,
  remoteTransportEnabled: false,
  formalReviewConvened: false,
  gateAdvanceClaimed: false,
  realDataEnabled: false,
});

export const g1AccountableNominationPack: AccountableNominationPackInput = {
  packId: "g1-accountable-nomination-preparation",
  version: "2026-07-14.1-blank",
  targetGate: "G1",
  scope: "internal_preparation_template_only",
  roles: g1FormalRoles.map((role) => ({
    key: role.key,
    label: role.label,
    ...roleCharters[role.key],
    nomineeName: null,
    backupName: null,
    authorityEvidenceRef: null,
  })),
  agenda: [
    {
      key: "scope_boundaries",
      label: "Abertura, escopo e limites",
      objective: "Confirmar G1 sintético, No-Go para dados reais e ausência de aprovação automática.",
      requiredRoleKeys: ["product_sponsor", "sst_owner", "dpo_owner", "legal_owner"],
    },
    {
      key: "role_nomination",
      label: "Nomeação dos papéis obrigatórios",
      objective: "Confirmar titular proposto, competência, independência e conflitos de interesse.",
      requiredRoleKeys: ["product_sponsor", "worker_representation", "operations_owner"],
    },
    {
      key: "authority_continuity",
      label: "Autoridade, suspensão e continuidade",
      objective: "Registrar mandato, poder de veto, substituto e cadeia de escalonamento.",
      requiredRoleKeys: ["product_sponsor", "security_owner", "operations_owner"],
    },
    {
      key: "evidence_review",
      label: "Matriz de evidências e pareceres",
      objective: "Distribuir evidências por disciplina sem antecipar decisão ou assinatura.",
      requiredRoleKeys: ["sst_owner", "ergonomics_owner", "methodology_owner", "dpo_owner", "legal_owner", "security_owner"],
    },
    {
      key: "stop_conditions",
      label: "Stop conditions e cuidado",
      objective: "Confirmar interrupção diante de dado real, crise, overclaim, coerção ou runtime inseguro.",
      requiredRoleKeys: ["sst_owner", "worker_representation", "operations_owner", "security_owner"],
    },
    {
      key: "decisions_and_receipts",
      label: "Próximos passos, decisões e recibos",
      objective: "Definir responsáveis por pareceres futuros sem registrar decisão nesta preparação.",
      requiredRoleKeys: ["product_sponsor", "legal_owner", "operations_owner"],
    },
  ],
  boundaries: [
    "Template sem nomes, contatos, assinatura ou dado pessoal.",
    "Não envia convite nem agenda reunião.",
    "Não registra autoridade, mandato ou substituição.",
    "Não cria parecer, ata ou decisão disciplinar.",
    "Não aprova G1, sessão externa ou uso com trabalhadores.",
    "Não habilita persistência, transporte remoto ou dados reais.",
    "Preenchimento futuro exige processo formal fora deste runtime local.",
  ],
};

export const g1AccountableNominationPackSummary = evaluateAccountableNominationPack(
  g1AccountableNominationPack,
  g1AccountableNominationPackContext,
  g1AccountableNominationPackPolicy,
);
