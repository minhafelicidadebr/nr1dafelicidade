export interface GoLiveChapterMeta {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  audience: string;
}

export interface ConfirmedDecision {
  id: string;
  code: string;
  title: string;
  choice: string;
  rationale: string;
  rejectedAlternative: string;
}

export interface TotBranch {
  id: "branch-a" | "branch-b" | "branch-c";
  code: string;
  title: string;
  subtitle: string;
  verdict: "REJEITADO" | "INEFICIENTE" | "RECOMENDADO";
  riskLevel: "Crítico" | "Alto" | "Controlado";
  timeToValue: string;
  regulatorySafety: string;
  summary: string;
  points: string[];
}

export interface BenchmarkEntry {
  id: string;
  category: string;
  referencePlayers: string;
  marketStrength: string;
  marketGap: string;
  ourDifferentiation: string;
}

export interface CheckoutFirstStep {
  step: number;
  code: string;
  title: string;
  actor: string;
  summary: string;
  frontendAction: string;
  serverAction: string;
  databaseRlsEffect: string;
  securitySafeguard: string;
}

export interface PlanEntitlementTier {
  id: "essencial" | "profissional" | "enterprise";
  name: string;
  targetProfile: string;
  billingModel: string;
  maxAdminSeats: string;
  maxActiveEmployees: string;
  maxUnits: string;
  cyclesPerYear: string;
  aepAetModule: string;
  pgrDossierExport: string;
  copilotQuota: string;
  auditRetention: string;
  highlights: string[];
}

export type PermissionAccessLevel = "full" | "review" | "read" | "limited" | "blocked" | "none";

export interface RbacCell {
  label: string;
  level: PermissionAccessLevel;
}

export interface RbacRoleRow {
  id: string;
  role: string;
  scope: string;
  isOrganizationalActor: boolean;
  permissions: {
    companyBilling: RbacCell;
    invitesRbac: RbacCell;
    campaignsUnits: RbacCell;
    aepAetCriteria: RbacCell;
    risksActions: RbacCell;
    pgrDocuments: RbacCell;
    driversLibrary: RbacCell;
    individualResponses: RbacCell;
  };
}

export interface ProductionSecretSpec {
  variable: string;
  tier: "server-secret" | "client-public";
  layer: string;
  activationGate: "G0/G1" | "G2 (Staging)" | "G3 (Produção)";
  purpose: string;
  rule: string;
}

export interface SubscriptionLifecycleState {
  state: "authorized" | "past_due" | "suspended" | "cancelled";
  label: string;
  duration: string;
  accessRule: string;
  nr1Protection: string;
}

export interface MteNr1ChainStep {
  order: number;
  stage: string;
  normativeRef: string;
  platformModule: string;
  roleOwner: string;
  auditArtifact: string;
}

export interface GoLiveWave {
  wave: string;
  gate: string;
  title: string;
  status: "Em Execução (Onda Atual)" | "Próxima Onda" | "Bloqueada até Gate Anterior";
  owners: string;
  scope: string;
  deliverables: string[];
  acceptanceCriteria: string;
}

export const PLAN_DOCUMENT_META = {
  version: "v1.0-G0-G1",
  dateLabel: "Ciclo 2026 · Governança Fable 5",
  title: "Plano Mestre de Maturidade e Go-Live SaaS Oficial",
  subtitle:
    "Auditoria por Árvore de Conhecimento (ToT), Benchmark Competitivo, Arquitetura Checkout-First (Mercado Pago + Supabase RLS), Matriz de Planos & RBAC e Roadmap de Consolidação NR-1.",
  governanceNotice:
    "Documento de planejamento executivo e alinhamento de comitê sob disciplina de gates (G0 → G4). Nenhuma chave de produção, cobrança live ou coleta de dados reais de trabalhadores é habilitada antes do encerramento formal de G1, G2 e G3.",
} as const;

export const GOLIVE_CHAPTERS: GoLiveChapterMeta[] = [
  {
    id: "maturidade",
    number: "01",
    shortTitle: "Auditoria ToT",
    title: "Onde Estamos Hoje: Auditoria de Maturidade & Árvore de Conhecimento",
    subtitle:
      "Leitura transparente dos indicadores reais do repositório e comparação estruturada dos 3 caminhos estratégicos de lançamento.",
    audience: "Diretoria · Produto · Engenharia · Jurídico",
  },
  {
    id: "benchmark",
    number: "02",
    shortTitle: "Benchmarks",
    title: "Benchmark Competitivo (Brasil & Global 2025–2026)",
    subtitle:
      "Como os principais players de SST, Clima, Saúde Mental e NR-1 operam — e onde construímos um fosso defensável.",
    audience: "Diretoria · Comercial · Produto · SST",
  },
  {
    id: "checkout-first",
    number: "03",
    shortTitle: "Checkout-First",
    title: "Jornada Pós-Contratação: Pagamento → Token → Empresa → Convites",
    subtitle:
      "Trava comercial ponta a ponta garantindo que o cadastro da organização ocorra exclusivamente após contratação validada no servidor.",
    audience: "Produto · Engenharia · Financeiro · Segurança",
  },
  {
    id: "planos-rbac",
    number: "04",
    shortTitle: "Planos & RBAC",
    title: "Arquitetura de Planos (Entitlements) & Matriz de Permissões por Área",
    subtitle:
      "Separação rigorosa entre o que o contrato libera (plano) e o que cada perfil convidado pode executar — preservando k >= 5.",
    audience: "Comercial · RH · SST · CIPA · Jurídico",
  },
  {
    id: "chaves-nr1",
    number: "05",
    shortTitle: "Chaves & NR-1",
    title: "Cofre de Chaves (Supabase + Mercado Pago) & Ciclo Oficial MTE NR-1",
    subtitle:
      "Segregação estrita de segredos de produção, política de inadimplência auditável e rastreabilidade completa das 8 etapas da NR-1.",
    audience: "Engenharia · Segurança · DPO · SST",
  },
  {
    id: "roadmap-prompt",
    number: "06",
    shortTitle: "Roadmap & Prompt",
    title: "Roadmap Oficial por Gates (G1 → G4) & Super Prompt de Desenvolvimento",
    subtitle:
      "Sequência executável em 5 ondas com critérios objetivos de Go/No-Go e especificação técnica pronta para validação do comitê.",
    audience: "Comitê Multidisciplinar · Engenharia · Diretoria",
  },
];

export const CONFIRMED_DECISIONS: ConfirmedDecision[] = [
  {
    id: "gateway",
    code: "DEC-01",
    title: "Gateway de Pagamento",
    choice: "Evoluir base Mercado Pago (Cartão recorrente + Pix / Preapproval)",
    rationale:
      "Aproveita tabelas, migrations e Edge Functions com assinatura HMAC-SHA256 já construídas em sandbox, levando-as ao padrão live governado.",
    rejectedAlternative: "Reconstruir billing do zero em outro provedor sem suporte nativo a Pix recorrente no Brasil.",
  },
  {
    id: "database",
    code: "DEC-02",
    title: "Banco de Dados & Autenticação",
    choice: "Manter Supabase PostgreSQL + RLS + Edge Functions atuais",
    rationale:
      "Preserva as 36 migrações versionadas, o Privacy Vault (k >= 5, anti-differencing) e as 206 asserções pgTAP já validadas.",
    rejectedAlternative: "Migrar de engine ou abrir acesso direto do cliente a tabelas financeiras/sensíveis.",
  },
  {
    id: "commercial-lock",
    code: "DEC-03",
    title: "Trava Comercial de Onboarding",
    choice: "Checkout Primeiro → Webhook Verificado → Token de Ativação → Cadastro da Empresa",
    rationale:
      "Impede criação gratuita de organizações órfãs e elimina fraude por manipulação de URL de retorno no navegador.",
    rejectedAlternative: "Permitir cadastro livre de empresa antes do pagamento e cobrar posteriormente.",
  },
  {
    id: "team-alignment",
    code: "DEC-04",
    title: "Formato de Alinhamento & Comitê",
    choice: "Central Executiva Interativa no App (/plano-saas) + Exportação PDF A4",
    rationale:
      "Permite apresentar o plano passo a passo em reuniões com diretoria, SST, RH, jurídico e engenharia, com dossiê distribuível em 1 clique.",
    rejectedAlternative: "Manter decisões técnicas fragmentadas em documentos internos difíceis de apresentar.",
  },
];

export const TOT_BRANCHES: TotBranch[] = [
  {
    id: "branch-a",
    code: "RAMO A",
    title: "Ativação Imediata de Produção",
    subtitle: "Ligar chaves live do Supabase e Mercado Pago agora sem fechar G1/G2.",
    verdict: "REJEITADO",
    riskLevel: "Crítico",
    timeToValue: "1–2 semanas (falso atalho)",
    regulatorySafety: "Inaceitável — expõe dados reais sem DPA, instrumento licenciado ou revisão SST",
    summary:
      "Viola diretamente a Constituição Operacional do projeto e cria passivo jurídico e regulatório imediato em LGPD e NR-1.",
    points: [
      "Coleta de dados reais sem pacote metodológico formalmente licenciado no Instrument Registry.",
      "Ausência de DPA, política de retenção/descarte aprovada e assinaturas de DPO/SST/Segurança.",
      "Fluxo de cadastro ainda desacoplado de pagamento verificado (permite bypass ou inconsistência).",
    ],
  },
  {
    id: "branch-b",
    code: "RAMO B",
    title: "Big-Bang Enterprise Fechado",
    subtitle: "Construir integrações SSO, HRIS, ERP e escala completa antes de alinhar equipe ou pilotos.",
    verdict: "INEFICIENTE",
    riskLevel: "Alto",
    timeToValue: "6–9 meses sem retorno",
    regulatorySafety: "Alta no papel, mas sem validação real de operação e precificação",
    summary:
      "Imobiliza capital e engenharia por meses sem validar a jornada comercial com clientes pioneiros nem aproveitar a fundação pronta.",
    points: [
      "Desperdiça a base já estruturada de Mercado Pago sandbox, RLS multi-tenant e 36 migrações.",
      "Atrasa o alinhamento interno entre diretoria, comercial, SST e jurídico.",
      "Superdimensiona integrações enterprise antes de validar conversão do núcleo NR-1 + Bem-Estar.",
    ],
  },
  {
    id: "branch-c",
    code: "RAMO C",
    title: "Go-Live Escalonado por Gates (G1 → G4)",
    subtitle: "Entregar alinhamento executivo agora (Onda 1) e destravar produção por ondas auditáveis.",
    verdict: "RECOMENDADO",
    riskLevel: "Controlado",
    timeToValue: "Valor imediato (Onda 1) + Piloto pago em ciclos curtos",
    regulatorySafety: "Máxima — 100% aderente à NR-1, LGPD e Privacy Vault (k >= 5)",
    summary:
      "Combina velocidade comercial disciplinada com blindagem técnica e jurídica: cada gate libera exatamente o que foi comprovado.",
    points: [
      "Onda 1 (Imediata): Central Executiva + PDF A4 para alinhar toda a equipe sem risco produtivo.",
      "Onda 2 (G1→G2): Fecha instrumento licenciado, pareceres SST/Ergonomia/DPO e DR produtivo.",
      "Ondas 3–4 (G3): Checkout-First Mercado Pago Live + Token de Ativação + Convites RBAC por plano.",
      "Onda 5 (G4): Abertura comercial oficial com piloto pago assistido, SLO > 99,5% e NFS-e.",
    ],
  },
];

export const SAAS_BENCHMARKS: BenchmarkEntry[] = [
  {
    id: "sst-tradicional",
    category: "SST Tradicional",
    referencePlayers: "SOC e suítes ocupacionais legadas",
    marketStrength: "Forte cobertura de PGR clássico, medicina ocupacional (NR-7) e mensageria eSocial (S-2240).",
    marketGap: "Pouca profundidade em Ciência do Bem-Estar, UX fria para trabalhadores e baixa adesão cultural contínua.",
    ourDifferentiation: "Une rigor auditável GRO/PGR + AEP/AET com 12 Drivers estruturados de bem-estar e experiência móvel acolhedora.",
  },
  {
    id: "clima-rh",
    category: "Clima & Engajamento RH",
    referencePlayers: "Gupy / Pulses, TeamCulture",
    marketStrength: "Alta adesão de RH, pesquisas de pulso rápidas e dashboards visuais executivos.",
    marketGap: "Tratam NR-1 como pesquisa de clima; fraca rastreabilidade ergonômica (AEP/AET) e sem controle de risco residual.",
    ourDifferentiation: "Separa sinal psicométrico coletivo de avaliação técnica (Criteria Engine) e exige evidência antes de reduzir risco.",
  },
  {
    id: "saude-mental-b2b",
    category: "Saúde Mental Corporativa",
    referencePlayers: "Vittude, Moodar",
    marketStrength: "Rede clínica assistencial, programas terapêuticos e índices de bem-estar emocional.",
    marketGap: "Alto custo consultivo por vida; menor autonomia self-serve multi-perfil para RH, SST, Ergonomia e CIPA.",
    ourDifferentiation: "Mantém canal de acolhimento separado da coleta anônima e entrega um sistema operacional completo de evidências.",
  },
  {
    id: "nicho-copsoq",
    category: "Nicho NR-1 / COPSOQ",
    referencePlayers: "QWork, EMC Psic, NR1 Flow",
    marketStrength: "Implantação rápida focada em questionário psicossocial e matriz 5×5 pronta.",
    marketGap: "Governança LGPD rasa: k-anonimato frequentemente apenas visual e risco de correlação entre convite e resposta.",
    ourDifferentiation: "Privacy Vault no banco de dados: k >= 5 server-side, tokens show-once sem correlação, anti-differencing e 206 testes pgTAP.",
  },
  {
    id: "padrao-saas-b2b",
    category: "Padrão Ouro B2B SaaS Brasil",
    referencePlayers: "Checkout-First + Mercado Pago Preapproval + PostgreSQL RLS",
    marketStrength: "Contratação online com Cartão/Pix, webhook assinado, entitlements desacoplados de RBAC e Grace Period.",
    marketGap: "Muitas plataformas liberam acesso no redirecionamento do navegador (vulnerável a fraude e estados órfãos).",
    ourDifferentiation: "Derivação 100% server-side via webhook HMAC-SHA256 + consulta autoritativa na API do Mercado Pago antes de emitir token de ativação.",
  },
];

export const CHECKOUT_FIRST_FLOW_STEPS: CheckoutFirstStep[] = [
  {
    step: 1,
    code: "PASSO 01",
    title: "Escolha do Plano & Intenção de Contratação",
    actor: "Comprador Corporativo (RH / Diretoria / SST)",
    summary:
      "Seleciona o plano compatível com o porte da organização, informa e-mail corporativo e confirma os termos comerciais — ainda sem criar tenant no banco.",
    frontendAction:
      "Exibe catálogo claro com limites objetivos (assentos, colaboradores, unidades, módulos), coleta e-mail corporativo e envia pedido para criação de checkout.",
    serverAction:
      "Edge Function billing-create-checkout valida o plano via Zod, lê MP_ACCESS_TOKEN_LIVE de Supabase Secrets e cria checkout_intent com external_reference UUID.",
    databaseRlsEffect:
      "Registra apenas checkout_intents (status = pending, buyer_email_hash). Nenhuma linha é inserida em organizations.",
    securitySafeguard:
      "Bloqueia criação gratuita de tenants órfãos e impede adulteração de preço pelo cliente (preço resolvido exclusivamente por price_id no servidor).",
  },
  {
    step: 2,
    code: "PASSO 02",
    title: "Pagamento Seguro no Mercado Pago",
    actor: "Comprador Corporativo + Mercado Pago",
    summary:
      "Comprador conclui a assinatura recorrente em Cartão de Crédito ou Pix no ambiente hospedado do Mercado Pago.",
    frontendAction:
      "Redireciona o navegador para o init_point retornado pelo backend e, no retorno, exibe tela de aguardo de confirmação autoritativa (nunca libera acesso só pelo query param).",
    serverAction:
      "Envia header X-Idempotency-Key por tentativa para evitar cobranças duplicadas em cliques repetidos ou quedas de rede.",
    databaseRlsEffect:
      "Mantém checkout_intent em pending até confirmação assíncrona verificada pelo webhook.",
    securitySafeguard:
      "Zero manipulação de dados de cartão no nosso servidor (escopo PCI-DSS delegado integralmente ao Mercado Pago).",
  },
  {
    step: 3,
    code: "PASSO 03",
    title: "Webhook Assinado & Consulta Autoritativa",
    actor: "Mercado Pago → Edge Function billing-webhook",
    summary:
      "O backend recebe a notificação do Mercado Pago, valida a assinatura criptográfica e consulta o estado oficial da assinatura diretamente na API.",
    frontendAction:
      "Interface de status faz polling leve por checkout_intent_id aguardando transição para confirmed sem expor segredos.",
    serverAction:
      "Verifica HMAC-SHA256 (x-signature + x-request-id + janela <= 600s), deduplica mp_event_id e executa GET oficial na API do Mercado Pago.",
    databaseRlsEffect:
      "Persiste evento em mp_events, atualiza mp_subscriptions (status = authorized) e deriva o entitlement em mp_entitlements.",
    securitySafeguard:
      "Nunca confia no corpo do webhook isoladamente nem em parâmetros de URL; proteção contra replay e falsificação de eventos.",
  },
  {
    step: 4,
    code: "PASSO 04",
    title: "Emissão do Token Criptográfico de Ativação",
    actor: "Backend Server-Side + E-mail Transacional",
    summary:
      "Após confirmação autoritativa de pagamento, o sistema gera um token único de ativação (TTL 72h) e envia o link de abertura da empresa.",
    frontendAction:
      "Recebe o link /ativar-empresa?token=... via e-mail corporativo ou confirmação segura na tela pós-checkout.",
    serverAction:
      "Gera token de alta entropia (256 bits), armazena apenas o hash SHA-256 em org_activation_tokens e dispara e-mail transacional sem logar o segredo.",
    databaseRlsEffect:
      "Tabela org_activation_tokens acessível somente via service_role/RPC; zero permissão de leitura direta via cliente.",
    securitySafeguard:
      "Uso estritamente único (single-use), expiração automática em 72h e vínculo criptográfico com a assinatura paga.",
  },
  {
    step: 5,
    code: "PASSO 05",
    title: "Cadastro Atômico da Empresa & Gestor Master (Owner)",
    actor: "Contratante → Owner da Organização",
    summary:
      "Com o token válido, o contratante cadastra Razão Social, CNPJ, CNAE, unidades iniciais e cria sua conta de Gestor Master (Owner).",
    frontendAction:
      "Wizard de ativação em 3 etapas: (1) Validação do token e conta Owner, (2) Dados da Empresa/CNPJ/Unidades, (3) Confirmação e acesso ao /app.",
    serverAction:
      "Executa RPC atômica SECURITY DEFINER consume_activation_token_and_create_org, bloqueando concorrência via SELECT ... FOR UPDATE.",
    databaseRlsEffect:
      "Cria organizations, vincula usuário como owner em organization_members, anexa mp_entitlements ao organization_id e marca consumed_at no token.",
    securitySafeguard:
      "Transação tudo-ou-nada: impossível reutilizar o mesmo token para criar duas empresas ou pular a etapa de pagamento.",
  },
  {
    step: 6,
    code: "PASSO 06",
    title: "Convites RBAC por Área & Governança de Assentos",
    actor: "Owner / SST / RH → Equipe Corporativa",
    summary:
      "O gestor convida profissionais de SST, RH, Ergonomia, CIPA, Diretoria e Auditoria; cada pessoa entra apenas na sua área com permissões exatas.",
    frontendAction:
      "Portal /app/team exibe assentos usados vs. limite do plano, envia convites por papel/unidade e permite revogação imediata.",
    serverAction:
      "RPC issue_org_member_invite valida permissão do remetente + limite max_admin_seats do entitlement ativo; Edge Function envia link /aceitar-convite.",
    databaseRlsEffect:
      "Insere em organization_role_invitations (expiração 7 dias, hash SHA-256). Ao aceitar, aplica RLS por organization_id + papel sem escalada de privilégio.",
    securitySafeguard:
      "Mesmo com convite válido, nenhum papel organizacional (nem Owner) recebe acesso a respostas individuais dos trabalhadores (k >= 5 imutável).",
  },
];

export const PLAN_ARCHITECTURE_TIERS: PlanEntitlementTier[] = [
  {
    id: "essencial",
    name: "Essencial",
    targetProfile: "PMEs e estruturas com até 100 colaboradores",
    billingModel: "Assinatura Mensal ou Anual (Proposta sujeita a aprovação G3)",
    maxAdminSeats: "Até 3 assentos (Owner + SST + RH)",
    maxActiveEmployees: "Até 100 colaboradores ativos",
    maxUnits: "Até 3 unidades / GHE",
    cyclesPerYear: "2 ciclos NR-1 / ano",
    aepAetModule: "AEP estruturada + Inventário",
    pgrDossierExport: "Dossiê PGR preliminar em PDF",
    copilotQuota: "Cota básica supervisionada (G4)",
    auditRetention: "2 anos de trilha auditável",
    highlights: [
      "Checkout-First com ativação imediata pós-pagamento",
      "Coleta anônima com Privacy Vault (k >= 5) no servidor",
      "Plano de ação 5W2H e biblioteca de 12 Drivers",
    ],
  },
  {
    id: "profissional",
    name: "Profissional",
    targetProfile: "Médias empresas multi-unidade (101 a 1.000 colaboradores)",
    billingModel: "Assinatura Mensal ou Anual (Proposta sujeita a aprovação G3)",
    maxAdminSeats: "Até 12 assentos (Owner, SST, RH, Ergonomista, CIPA, Diretoria)",
    maxActiveEmployees: "Até 1.000 colaboradores ativos",
    maxUnits: "Até 20 unidades / GHE",
    cyclesPerYear: "4 ciclos NR-1 / ano + pulsos",
    aepAetModule: "AEP + AET completa + Criteria Engine",
    pgrDossierExport: "Dossiê PGR completo + trilha de revisão técnica + SHA-256",
    copilotQuota: "Cota ampliada por área (G4)",
    auditRetention: "5 anos de trilha auditável",
    highlights: [
      "Convites RBAC granulares com escopo por unidade/GHE",
      "Integração estruturada de evidências PGR + ponte PCMSO",
      "Cockpit executivo de risco residual e verificação de eficácia",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    targetProfile: "Grandes grupos, redes e operações complexas (+1.000 colaboradores)",
    billingModel: "Contrato Anual ou Recorrente Customizado (G3/G4)",
    maxAdminSeats: "Assentos ilimitados sob governança",
    maxActiveEmployees: "Acima de 1.000 colaboradores (faixas sob medida)",
    maxUnits: "Unidades e holdings ilimitadas",
    cyclesPerYear: "Ciclos contínuos + auditorias externas",
    aepAetModule: "AEP/AET avançada + comitê multi-unidade",
    pgrDossierExport: "Dossiê institucional customizado + acesso dedicado a Auditor",
    copilotQuota: "Cota corporativa dedicada (G4)",
    auditRetention: "20 anos (alinhado ao histórico ocupacional)",
    highlights: [
      "Papel dedicado de Auditor Externo (somente leitura + hashes)",
      "Política contratual de retenção, DPA e runbook de suporte",
      "Preparado para evolução de integrações corporativas em G4",
    ],
  },
];

export const RBAC_PERMISSION_COLUMNS = [
  { key: "companyBilling", label: "Empresa & Billing" },
  { key: "invitesRbac", label: "Convites & Perfis" },
  { key: "campaignsUnits", label: "Campanhas & Unidades" },
  { key: "aepAetCriteria", label: "AEP / AET & Critérios" },
  { key: "risksActions", label: "Riscos & Planos" },
  { key: "pgrDocuments", label: "Dossiê PGR & PDF" },
  { key: "driversLibrary", label: "Estudos & Drivers" },
  { key: "individualResponses", label: "Respostas Individuais" },
] as const;

export const RBAC_PERMISSION_MATRIX: RbacRoleRow[] = [
  {
    id: "owner",
    role: "Owner / Gestor Master",
    scope: "Contratante principal da organização",
    isOrganizationalActor: true,
    permissions: {
      companyBilling: { label: "Completo", level: "full" },
      invitesRbac: { label: "Completo", level: "full" },
      campaignsUnits: { label: "Completo", level: "full" },
      aepAetCriteria: { label: "Leitura + Governança", level: "read" },
      risksActions: { label: "Completo", level: "full" },
      pgrDocuments: { label: "Emissão preliminar", level: "limited" },
      driversLibrary: { label: "Completo", level: "full" },
      individualResponses: { label: "BLOQUEADO (k>=5)", level: "blocked" },
    },
  },
  {
    id: "sst",
    role: "Responsável SST / SESMT",
    scope: "Guardião técnico GRO/PGR e eficácia",
    isOrganizationalActor: true,
    permissions: {
      companyBilling: { label: "Leitura", level: "read" },
      invitesRbac: { label: "Convida SST / CIPA", level: "limited" },
      campaignsUnits: { label: "Completo", level: "full" },
      aepAetCriteria: { label: "Completo + Revisão", level: "review" },
      risksActions: { label: "Completo + Eficácia", level: "review" },
      pgrDocuments: { label: "Revisão + Aprovação", level: "review" },
      driversLibrary: { label: "Completo", level: "full" },
      individualResponses: { label: "BLOQUEADO (k>=5)", level: "blocked" },
    },
  },
  {
    id: "hr",
    role: "RH / Gestão de Pessoas",
    scope: "Operação de campanhas, unidades e ações",
    isOrganizationalActor: true,
    permissions: {
      companyBilling: { label: "Leitura", level: "read" },
      invitesRbac: { label: "Convida Gestores", level: "limited" },
      campaignsUnits: { label: "Configura + Monitora", level: "full" },
      aepAetCriteria: { label: "Colabora contexto", level: "limited" },
      risksActions: { label: "Cria e acompanha", level: "full" },
      pgrDocuments: { label: "Leitura", level: "read" },
      driversLibrary: { label: "Completo", level: "full" },
      individualResponses: { label: "BLOQUEADO (k>=5)", level: "blocked" },
    },
  },
  {
    id: "ergonomist",
    role: "Ergonomista",
    scope: "Avaliação do trabalho real (NR-17)",
    isOrganizationalActor: true,
    permissions: {
      companyBilling: { label: "Sem acesso", level: "none" },
      invitesRbac: { label: "Sem acesso", level: "none" },
      campaignsUnits: { label: "Leitura agregada", level: "read" },
      aepAetCriteria: { label: "Completo (AEP/AET)", level: "review" },
      risksActions: { label: "Parecer técnico", level: "limited" },
      pgrDocuments: { label: "Anexa evidências", level: "limited" },
      driversLibrary: { label: "Completo", level: "full" },
      individualResponses: { label: "BLOQUEADO (k>=5)", level: "blocked" },
    },
  },
  {
    id: "cipa",
    role: "CIPA / Representação",
    scope: "Participação formal dos trabalhadores",
    isOrganizationalActor: true,
    permissions: {
      companyBilling: { label: "Sem acesso", level: "none" },
      invitesRbac: { label: "Sem acesso", level: "none" },
      campaignsUnits: { label: "Agregado (k>=5)", level: "read" },
      aepAetCriteria: { label: "Registro consulta", level: "limited" },
      risksActions: { label: "Comenta e acompanha", level: "limited" },
      pgrDocuments: { label: "Leitura", level: "read" },
      driversLibrary: { label: "Completo", level: "full" },
      individualResponses: { label: "BLOQUEADO (k>=5)", level: "blocked" },
    },
  },
  {
    id: "executive",
    role: "Diretoria / Executivo",
    scope: "Decisão orçamentária e visão consolidada",
    isOrganizationalActor: true,
    permissions: {
      companyBilling: { label: "Faturamento (opcional)", level: "limited" },
      invitesRbac: { label: "Sem acesso", level: "none" },
      campaignsUnits: { label: "Resumo executivo", level: "read" },
      aepAetCriteria: { label: "Resumo executivo", level: "read" },
      risksActions: { label: "Visão agregada", level: "read" },
      pgrDocuments: { label: "Relatórios executivos", level: "read" },
      driversLibrary: { label: "Completo", level: "full" },
      individualResponses: { label: "BLOQUEADO (k>=5)", level: "blocked" },
    },
  },
  {
    id: "auditor",
    role: "Auditor / Revisor Externo",
    scope: "Inspeção independente e verificação de integridade",
    isOrganizationalActor: true,
    permissions: {
      companyBilling: { label: "Sem acesso", level: "none" },
      invitesRbac: { label: "Sem acesso", level: "none" },
      campaignsUnits: { label: "Somente leitura", level: "read" },
      aepAetCriteria: { label: "Somente leitura", level: "read" },
      risksActions: { label: "Leitura + Trilha", level: "read" },
      pgrDocuments: { label: "Verificação hashes", level: "read" },
      driversLibrary: { label: "Leitura", level: "read" },
      individualResponses: { label: "BLOQUEADO (k>=5)", level: "blocked" },
    },
  },
  {
    id: "collaborator",
    role: "Colaborador",
    scope: "Participação anônima e trilhas educativas",
    isOrganizationalActor: false,
    permissions: {
      companyBilling: { label: "Sem acesso", level: "none" },
      invitesRbac: { label: "Sem acesso", level: "none" },
      campaignsUnits: { label: "Link anônimo", level: "limited" },
      aepAetCriteria: { label: "Sem acesso", level: "none" },
      risksActions: { label: "Sem acesso", level: "none" },
      pgrDocuments: { label: "Sem acesso", level: "none" },
      driversLibrary: { label: "Trilhas Bem-Estar", level: "read" },
      individualResponses: { label: "Própria (show-once)", level: "limited" },
    },
  },
];

export const PRODUCTION_KEYS_CHECKLIST: ProductionSecretSpec[] = [
  {
    variable: "SUPABASE_SERVICE_ROLE_KEY",
    tier: "server-secret",
    layer: "Supabase Edge Secrets (Somente Servidor)",
    activationGate: "G2 (Staging)",
    purpose: "Execução privilegiada em webhooks de billing, ativação atômica de empresa e envio de convites assinados.",
    rule: "Jamais prefixar com VITE_, jamais logar em console e jamais versionar no repositório.",
  },
  {
    variable: "MP_ACCESS_TOKEN_TEST / MP_WEBHOOK_SECRET_TEST",
    tier: "server-secret",
    layer: "Supabase Edge Secrets (Homologação Sandbox)",
    activationGate: "G2 (Staging)",
    purpose: "Validar checkout, assinatura HMAC-SHA256, replay e emissão de token em ambiente isolado sem dinheiro real.",
    rule: "Usar credenciais exclusivas de homologação em projeto Supabase separado da produção.",
  },
  {
    variable: "MP_ACCESS_TOKEN_LIVE / MP_WEBHOOK_SECRET_LIVE",
    tier: "server-secret",
    layer: "Supabase Edge Secrets (Produção Live)",
    activationGate: "G3 (Produção)",
    purpose: "Processar assinaturas oficiais (Cartão/Pix) e validar assinaturas criptográficas dos webhooks de cobrança.",
    rule: "Habilitar somente após assinatura formal do Gate G3 e validação de compra teste end-to-end.",
  },
  {
    variable: "TRANSACTIONAL_EMAIL_API_KEY",
    tier: "server-secret",
    layer: "Supabase Edge Secrets (Provedor Transacional)",
    activationGate: "G2 (Staging)",
    purpose: "Disparar links de ativação pós-pagamento, convites RBAC com expiração de 7 dias e avisos de carência.",
    rule: "Configurar SPF, DKIM e DMARC no domínio oficial; nunca registrar URLs com token completo em logs.",
  },
  {
    variable: "APP_PUBLIC_BASE_URL",
    tier: "server-secret",
    layer: "Supabase Edge Secrets (Allowlist Canônica)",
    activationGate: "G2 (Staging)",
    purpose: "Definir origem canônica de callbacks, redirecionamentos pós-checkout e CORS estrito (sem curinga '*').",
    rule: "Previne ataques de open redirect e garante validação rígida de origem nas Edge Functions.",
  },
  {
    variable: "VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY",
    tier: "client-public",
    layer: "Frontend (Chaves Públicas com RLS Obrigatório)",
    activationGate: "G3 (Produção)",
    purpose: "Conectar a aplicação web ao projeto Supabase de produção sob políticas RLS deny-by-default.",
    rule: "Só aponta para produção quando VITE_DATA_MODE=real estiver formalmente liberado no Gate G3.",
  },
];

export const SUBSCRIPTION_LIFECYCLE_STATES: SubscriptionLifecycleState[] = [
  {
    state: "authorized",
    label: "Ativa (Authorized)",
    duration: "Ciclo vigente",
    accessRule: "Acesso pleno aos módulos e limites (assentos, unidades, ciclos) do plano contratado.",
    nr1Protection: "Execução completa de campanhas, AEP/AET, planos de ação e emissão de dossiês.",
  },
  {
    state: "past_due",
    label: "Carência (Past Due)",
    duration: "7 dias corridos",
    accessRule: "Operação mantida com aviso visível ao Owner e retentativas automáticas de cobrança no Mercado Pago.",
    nr1Protection: "Evita interrupção abrupta de campanhas em andamento durante falhas pontuais de cartão.",
  },
  {
    state: "suspended",
    label: "Suspensa (Read-Only)",
    duration: "30 dias de custódia",
    accessRule: "Novas campanhas, convites e edições bloqueados (HTTP 402); leitura e exportação de evidências históricas mantidas.",
    nr1Protection: "Protege a empresa cliente em eventual fiscalização do MTE sem permitir operação gratuita contínua.",
  },
  {
    state: "cancelled",
    label: "Encerrada (Cancelled)",
    duration: "Conforme política de retenção",
    accessRule: "Encerramento formal do tenant com janela documentada de exportação e descarte/guarda conforme DPA.",
    nr1Protection: "Preserva trilha de auditoria e observância de prazos legais definidos no contrato (LGPD/NR-1).",
  },
];

export const MTE_NR1_OPERATIONAL_CHAIN: MteNr1ChainStep[] = [
  {
    order: 1,
    stage: "Estruturação da Empresa, Unidades e GHE",
    normativeRef: "NR-1 §1.5.3 / §1.5.4",
    platformModule: "Empresa & Unidades (/app/company, /app/units)",
    roleOwner: "Owner / RH / SST",
    auditArtifact: "Cadastro de estabelecimentos, CNAE, graus de risco e grupos homogêneos.",
  },
  {
    order: 2,
    stage: "Definição de Critérios de Avaliação (S × P)",
    normativeRef: "NR-1 §1.5.4.4.2",
    platformModule: "Criteria Engine (/app/criteria)",
    roleOwner: "Responsável SST / Ergonomista",
    auditArtifact: "Matriz 5×5 versionada com justificativa contextual antes da coleta.",
  },
  {
    order: 3,
    stage: "Coleta Psicossocial Coletiva com Privacidade",
    normativeRef: "NR-1 §1.5.3.2.1 + LGPD",
    platformModule: "Ciclos & Privacy Vault (/app/cycles, /respond/:token)",
    roleOwner: "RH / SST (instrumento aprovado no Registry)",
    auditArtifact: "Agregados por unidade/GHE protegidos por k >= 5 e anti-differencing.",
  },
  {
    order: 4,
    stage: "Avaliação Ergonômica Preliminar e do Trabalho Real",
    normativeRef: "NR-17 + Guia MTE 2026",
    platformModule: "AEP & AET (/app/work-analysis, /app/aet)",
    roleOwner: "Ergonomista / SST + Participação CIPA",
    auditArtifact: "Registro de demandas, organização do trabalho, entrevistas e consulta aos trabalhadores.",
  },
  {
    order: 5,
    stage: "Classificação e Inventário de Riscos Psicossociais",
    normativeRef: "NR-1 §1.5.7.3.1",
    platformModule: "Inventário de Riscos (/app/risk)",
    roleOwner: "Responsável SST / SESMT",
    auditArtifact: "Inventário consolidado vinculando fatores psicossociais, severidade, probabilidade e controles existentes.",
  },
  {
    order: 6,
    stage: "Plano de Ação 5W2H & Hierarquia de Controles",
    normativeRef: "NR-1 §1.5.5.2",
    platformModule: "Planos de Ação & Controles (/app/actions, /app/controls)",
    roleOwner: "RH / Gestores / SST",
    auditArtifact: "Medidas na fonte, prazos, responsáveis, evidências anexas e vínculo com os 12 Drivers de Bem-Estar.",
  },
  {
    order: 7,
    stage: "Aferição de Eficácia & Risco Residual",
    normativeRef: "NR-1 §1.5.5.3 / §1.5.4.4.6",
    platformModule: "Controles & Governança (/app/controls, /app/governance)",
    roleOwner: "Responsável SST + CIPA",
    auditArtifact: "Reavaliação comprovada por evidência (redução de risco só após comprovação de eficácia).",
  },
  {
    order: 8,
    stage: "Dossiê Auditável PGR, Ponte PCMSO e Revisão Humana",
    normativeRef: "NR-1 §1.5.7 + NR-7",
    platformModule: "Documentos Auditáveis (/app/documents)",
    roleOwner: "Responsável Técnico SST (Revisão & Assinatura)",
    auditArtifact: "PDF institucional versionado com hash SHA-256 e bloqueio de emissão final sem revisão humana.",
  },
];

export const GOLIVE_WAVES_ROADMAP: GoLiveWave[] = [
  {
    wave: "Onda 1",
    gate: "G0 / G1",
    title: "Central Executiva de Apresentação & Exportação PDF A4",
    status: "Em Execução (Onda Atual)",
    owners: "Produto + Engenharia",
    scope:
      "Disponibilizar no app o dossiê interativo de Go-Live em 6 capítulos com Modo Apresentação e download imediato do PDF completo para alinhamento de diretoria e comitê.",
    deliverables: [
      "Página executiva /plano-saas conectada ao avaliador real de maturidade do projeto",
      "Modo Apresentação por slides com atalhos de teclado e inspetor interativo de fluxo/RBAC",
      "Gerador de PDF A4 multi-página com capa executiva, tabelas, checklist e Super Prompt integral",
    ],
    acceptanceCriteria:
      "Build, lint, testes automatizados do PDF/invariantes e inspeção visual em navegador real (Desktop Claro/Escuro + Mobile) 100% aprovados.",
  },
  {
    wave: "Onda 2",
    gate: "G1 → G2",
    title: "Fechamento Metodológico, Jurídico & DR Produtivo",
    status: "Próxima Onda",
    owners: "SST + Psicometria + DPO/Jurídico + Operações",
    scope:
      "Encerrar os bloqueios não-técnicos de G1 e G2 que hoje impedem a saída do estágio Fundação para Piloto Controlado.",
    deliverables: [
      "Instrumento licenciado no Registry com 26 subescalas, regras de scoring e fixtures revisadas",
      "Assinaturas nominais no Ledger G1/G2 (SST, Ergonomia, Psicometria, DPO/Jurídico, Segurança)",
      "DPA, Termos SaaS, política de retenção/descarte e ensaio real de backup/restore em staging",
    ],
    acceptanceCriteria:
      "100% dos 206+ testes pgTAP verdes em projeto staging, pareceres independentes registrados com hash e baseline GitHub/Lovable sincronizado.",
  },
  {
    wave: "Onda 3",
    gate: "G2 → G3",
    title: "Checkout-First Mercado Pago Live + Token de Ativação",
    status: "Bloqueada até Gate Anterior",
    owners: "Engenharia + Financeiro + Segurança",
    scope:
      "Inverter o onboarding para contratação prévia, evoluindo a base sandbox do Mercado Pago para produção governada com chaves segregadas.",
    deliverables: [
      "Migrações checkout_intents, org_activation_tokens e RPC atômica consume_activation_token_and_create_org",
      "Edge Functions billing-create-checkout e billing-webhook com HMAC-SHA256 + consulta autoritativa",
      "Tela /ativar-empresa?token=... bloqueando qualquer criação de empresa sem pagamento validado",
    ],
    acceptanceCriteria:
      "Compra real de teste ponta a ponta gera token único, cria empresa atomicamente, rejeita replay/reuso e valida carência (past_due) e suspensão read-only.",
  },
  {
    wave: "Onda 4",
    gate: "G3",
    title: "Motor de Convites RBAC + Entitlements por Plano",
    status: "Bloqueada até Gate Anterior",
    owners: "Engenharia + Produto + QA",
    scope:
      "Entregar gestão multi-perfil por área da empresa, limites objetivos de plano (assentos, unidades, ciclos) e portal de faturamento.",
    deliverables: [
      "Tabelas plan_entitlement_catalog e organization_role_invitations com expiração 7 dias e revogação",
      "Portais /app/team, /app/billing e fluxo /aceitar-convite com menus e ações ajustados por papel",
      "Enforcement duplo (PostgreSQL RLS/RPC + guards na interface) preservando k >= 5 para todos os papéis",
    ],
    acceptanceCriteria:
      "Testes pgTAP e E2E Playwright comprovando isolamento cross-tenant, bloqueio ao exceder assentos e bloqueio absoluto de respostas individuais pelo Owner.",
  },
  {
    wave: "Onda 5",
    gate: "G3 → G4",
    title: "Abertura Comercial Oficial, SLOs & Escala Assistida",
    status: "Bloqueada até Gate Anterior",
    owners: "Comercial + Marketing + Operações + Diretoria",
    scope:
      "Ativar ambiente produtivo com liberação controlada de clientes pioneiros, monitoramento de disponibilidade, emissão fiscal e divulgação oficial.",
    deliverables: [
      "Habilitação governada de VITE_DATA_MODE=real somente após assinatura formal do Gate G3",
      "Observabilidade de produção, alertas de webhook/erro, SLO > 99,5% e emissão automatizada de NFS-e",
      "Onboarding assistido das primeiras 5 empresas pagantes com validação completa de ciclo NR-1",
    ],
    acceptanceCriteria:
      "5 organizações operando sem incidentes críticos de privacidade ou cobrança, guarda de claims públicos 100% verde e aprovação formal G4.",
  },
];

export const DEVELOPMENT_SUPER_PROMPT = `# SUPER PROMPT DE DESENVOLVIMENTO — TRANSFORMAÇÃO SAAS OFICIAL NR-1
# (CHECKOUT-FIRST + MERCADO PAGO + SUPABASE RLS + RBAC + ENTITLEMENTS)

## 1. MANDATO E RESTRIÇÕES CONSTITUCIONAIS (INVIOLÁVEIS)
Atue como Arquiteto Principal, Engenheiro de Segurança Aplicacional, Especialista em SaaS B2B Multi-tenant e Guardião Regulatório NR-1/LGPD.
Antes de propor ou alterar qualquer linha de código, respeite os 4 invariantes constitucionais:
1. PRIVACIDADE IMUTÁVEL: respostas individuais de trabalhadores JAMAIS são legíveis por qualquer ator organizacional (incluindo Owner/Admin); k >= 5 e anti-differencing obrigatórios no servidor.
2. HONESTIDADE REGULATÓRIA: a plataforma apoia o GRO/PGR, AEP/AET, planos de ação e evidências auditáveis, mas NUNCA promete conformidade automática, laudo automático ou dispensa de responsável técnico habilitado.
3. DISCIPLINA DE GATES: não habilitar VITE_DATA_MODE=real ou chaves live em produção antes do encerramento formal de G1, G2 e G3 e assinaturas nominais dos accountables.
4. SEGURANÇA DE SEGREDOS: NUNCA expor SUPABASE_SERVICE_ROLE_KEY, MP_ACCESS_TOKEN_*, MP_WEBHOOK_SECRET_* ou chaves de e-mail transacional no frontend (VITE_*) ou no Git.

## 2. ARQUITETURA ALVO (SUPABASE POSTGRESQL + RLS + EDGE FUNCTIONS + MERCADO PAGO)
Evolua a base existente sem quebrar as 36 migrações atuais nem as 206 asserções pgTAP:

### 2.1 Banco de Dados & Migrações Incrementais (PostgreSQL + RLS)
Crie migrações idempotentes e testes pgTAP cobrindo:
- plan_entitlement_catalog: limites objetivos por plano (essencial, profissional, enterprise): max_admin_seats, max_employees, max_units, max_cycles_per_year, features_jsonb (AEP/AET, Criteria Engine, PDF PGR, Copiloto, Auditoria).
- checkout_intents: inicia assinatura no Mercado Pago ANTES da existência de organization_id (id, buyer_email_hash, price_id, external_reference, mp_preapproval_id, status, environment, expires_at).
- org_activation_tokens: emitido exclusivamente pelo webhook após consulta autoritativa na API do Mercado Pago (token_hash SHA-256, checkout_intent_id, subscription_id, plan_code, expires_at 72h, consumed_at, consumed_by_user_id, organization_id).
- organization_role_invitations: convites nominais com papel corporativo (sst_technical, hr_manager, ergonomist, cipa_rep, executive_viewer, auditor), escopo de unidade opcional, token_hash single-use, expiração 7 dias e revogação auditada.
- Evolução de mp_environment (sandbox, live) protegida por gate explícito e mp_subscriptions com suporte a past_due (grace period 7 dias) e suspended (somente leitura por 30 dias).
- RPCs atômicas SECURITY DEFINER:
  * consume_activation_token_and_create_org(...): trava token via FOR UPDATE, cria organizations, vincula criador como owner, anexa mp_entitlements e marca token consumido na mesma transação.
  * issue_org_member_invite(...): verifica papel do chamador + limite max_admin_seats do entitlement ativo antes de emitir convite.
  * accept_org_member_invite(...): valida token assinado e vincula usuário ao papel exato sem escalada de privilégio.
  * assert_org_entitlement(org_id, capability): função de enforcement invocada por políticas RLS e RPCs de domínio.

### 2.2 Edge Functions (Deno / Supabase)
1. billing-create-checkout: valida plano/preço via Zod, cria checkout_intent com X-Idempotency-Key, chama Mercado Pago (/preapproval Cartão/Pix recorrente) usando secret server-side e retorna apenas init_point.
2. billing-webhook: valida HMAC-SHA256 (x-signature + x-request-id, janela <= 600s), deduplica em mp_events, consulta estado autoritativo na API do Mercado Pago, atualiza assinatura/entitlement, gera org_activation_token na primeira ativação e dispara e-mail transacional com link /ativar-empresa.
3. send-member-invite: envia convite corporativo assinado com papel, organização e validade sem vazar tokens ou PII em logs.

### 2.3 Frontend & UX de Produção
1. /planos: catálogo transparente por porte com limites reais (sem overclaims), seleção de periodicidade e CTA seguro redirecionando ao checkout Mercado Pago.
2. /ativar-empresa?token=...: bloqueia criação de empresa sem token válido; ao validar, conduz onboarding em 3 etapas (Conta Owner -> Dados Empresa/CNPJ/Unidades -> Confirmação) e entra no /app.
3. /aceitar-convite?token=...: experiência dedicada para o profissional convidado (SST, RH, Ergonomista, CIPA, Diretoria, Auditor) acessar somente a sua área.
4. /app/team e /app/billing: gestão de convites, assentos usados vs. limite do plano, histórico de cobranças, aviso em past_due e custódia read-only em suspended.
5. Guards useOrgEntitlements + useRolePermissions: adaptam a interface ao contrato e papel, sempre respaldados por enforcement real no PostgreSQL/RLS.

## 3. CRITÉRIOS DE ACEITE E BATERIA DE TESTES OBRIGATÓRIA
- 100% dos testes pgTAP verdes (incluindo tentativas de: criar empresa sem token pago, reutilizar token consumido, exceder assentos do plano, escalar papel via cliente, acessar outro tenant e ler respostas individuais como Owner).
- Testes Vitest cobrindo máquina de estados de assinatura (pending -> authorized -> past_due -> suspended -> cancelled), entitlements e matriz RBAC.
- Testes E2E Playwright cobrindo: Checkout simulado -> Webhook -> Ativação da empresa -> Convite SST/CIPA -> Acesso restrito por área -> Bloqueio por limite do plano.
- Auditoria de segurança (zero secrets em bundle, CORS restrito, HMAC verificado, publicClaimsGuardrail verde) + ESLint + TypeScript + Build dentro do orçamento de chunks.`;
