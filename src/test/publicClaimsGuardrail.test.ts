import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../..");

const publicSurfaceFiles = [
  "src/routes/__root.tsx",
  "src/data/publicClaimsPolicy.ts",
  "src/data/nr1Crosswalk.ts",
  "src/pages/HomePage.tsx",
  "src/pages/AboutPage.tsx",
  "src/pages/DriversPage.tsx",
  "src/pages/DriverWorldPage.tsx",
  "src/pages/LibraryPage.tsx",
  "src/pages/NR1CopsoqPage.tsx",
  "src/pages/SalesPage.tsx",
  "src/pages/signup/SignupIndexPage.tsx",
  "src/pages/signup/SignupSstPage.tsx",
  "src/pages/signup/SignupManagerPage.tsx",
  "src/pages/signup/SignupCollaboratorPage.tsx",
  "src/components/AppLayout.tsx",
  "src/components/DriverCard.tsx",
  "src/components/DriverChatbot.tsx",
  "src/components/LearningDynamicCard.tsx",
  "src/components/PDFGenerator.tsx",
  "src/components/AIDynamic.tsx",
  "src/components/home/ImpactCalculator.tsx",
  "src/components/signup/SignupShell.tsx",
  "src/components/sales/FAQAccordion.tsx",
  "src/components/sales/LeadCaptureForm.tsx",
  "src/components/sales/ReadinessCalculator.tsx",
  "src/components/sales/SegmentSelector.tsx",
  "src/components/sales/BuyerCommitteeJourney.tsx",
  "src/components/sales/VendorDeliveryReadinessCard.tsx",
  "src/components/sales/ReadinessGovernanceSprintCard.tsx",
  "src/data/g1ReadinessGovernanceSprint.ts",
  "src/data/commercialAuthorization.ts",
  "src/lib/commercial/commercialAuthorization.ts",
  "src/data/g1BuyerCommitteeJourney.ts",
  "src/components/nr1/MethodologyReadinessDossier.tsx",
  "src/components/nr1/FrameworkCanon.tsx",
  "src/components/nr1/CrosswalkMatrix.tsx",
  "src/components/nr1/InterventionsLibrary.tsx",
  "src/components/nr1/LearningPathways.tsx",
  "src/components/nr1/SyntheticDemoReceiptCard.tsx",
  "src/components/nr1/SyntheticDemoFeedbackCard.tsx",
  "src/components/nr1/SyntheticScenarioSelector.tsx",
  "src/components/nr1/DesignPartnerSessionPreflight.tsx",
  "src/components/nr1/FacilitatorHandoffCard.tsx",
] as const;

const blockedClaimPatterns = [
  { label: "guaranteed compliance", pattern: /\b(garante|garantir|garantia|garantida|assegura|assegurar|assegurada)\b.{0,80}\bconformidade\b/ },
  { label: "total compliance", pattern: /\bconformidade\s+total\b/ },
  { label: "continuous compliance", pattern: /\bconformidade\s+continua\b/ },
  { label: "real-time compliance", pattern: /\bconformidade\b.{0,60}\bem\s+tempo\s+real\b|\bem\s+tempo\s+real\b.{0,60}\bconformidade\b/ },
  { label: "validated survey or instrument", pattern: /\b(survey|instrumento|questionario)\b.{0,60}\bvalidad[oa]\b|\bvalidad[oa]\b.{0,60}\b(survey|instrumento|questionario)\b/ },
  { label: "validated by Oxford", pattern: /\bvalidad[oa]\s+por\s+oxford\b/ },
  { label: "Oxford used as a product science badge", pattern: /\bciencia\s+de\s+oxford\b|\bevidencias?\s+(cientificas?\s+)?de\s+oxford\b/ },
  { label: "institutional endorsement by Oxford", pattern: /\bchancela\b.{0,80}\boxford\b|\boxford\b.{0,80}\bchancela\b/ },
  { label: "unsupported local three-thousand claim", pattern: /\b3[.,]000\+?\b.{0,80}\b(artigos|estudos)\b/ },
  { label: "generic fixed fine claim", pattern: /\bmultas?\s+de\s+ate\s+r\$\s*\d+/ },
  { label: "outdated NR-1 effective-year claim", pattern: /\briscos?\s+psicossociais\b.{0,100}\ba\s+partir\s+de\s+2025\b/ },
  { label: "diagnosis as a product action", pattern: /\b(criar|comecar|executar|usar)\b.{0,50}\bdiagnostico\b/ },
  { label: "Oxford and WWM presented as joint publisher", pattern: /\buniversidade\s+de\s+oxford\s*\+\s*world\s+wellbeing\s+movement\b/ },
  { label: "production metadata before gate", pattern: /\bplataforma\s+educacional\s+gamificada\b|\bplataforma\s+de\s+bem-estar\s+organizacional\b/ },
  { label: "verified public source claim", pattern: /\b(artigos|estudos)\s+verificad[oa]s?\b|\bverificado\s+em\b/ },
  { label: "unreviewed scientific evidence claim", pattern: /\bevidencias?\s+(cientificas?\s+)?verificad[oa]s?\b/ },
  { label: "scientific drivers presented as an approved product basis", pattern: /\bdrivers?\s+cientificos?\b/ },
  { label: "scientific literature presented as product training basis", pattern: /\bliteratura\s+cientifica\s+revisada\b/ },
  { label: "diagnosis as a public marketing imperative", pattern: /\bdiagnostique\b/ },
  { label: "unsupported psychosocial ROI claim", pattern: /\broi\s+psicossocial\b/ },
  { label: "validated public instrument", pattern: /\binstrumentos?\s+validad[oa]s?\b/ },
  { label: "unsupported ROI forecast", pattern: /\broi\s+potencial\b|\bganho\s+liquido\s+anual\s+projetado\b|\brecuperacao\s+estimada\b/ },
  { label: "burnout misclassified as occupational disease", pattern: /\bburnout\b.{0,100}\bdoenca\s+ocupacional\b|\bdoenca\s+ocupacional\b.{0,100}\bburnout\b/ },
  { label: "automated compliance report", pattern: /\brelatorios?\s+de\s+conformidade\s+automatizad[oa]s?\b/ },
  { label: "automatic report as compliance", pattern: /\brelatorios?\s+automatizad[oa]s?\b.{0,80}\b(conformidade|gro|pgr)\b/ },
  { label: "causal percentage in public preview", pattern: /\breduzir\b.{0,80}\bate\s+\d+%/ },
  { label: "absolute anonymity", pattern: /\banonimato\s+absoluto\b/ },
  { label: "individual diagnosis", pattern: /\bdiagnostico\s+individual\b/ },
  { label: "real data enabled", pattern: /\bdados\s+reais\s+(liberados|habilitados|permitidos)\b/ },
  { label: "G1 approved", pattern: /\bg1\s+aprovado\b/ },
  { label: "real SaaS ready", pattern: /\bsaas\s+real\s+pronto\b/ },
  { label: "replaces technical owner", pattern: /\bsubstitui\s+(o\s+)?responsavel\s+tecnico\b/ },
  { label: "self-service paid plan before gate", pattern: /\br\$\s*49\b|\bassinar\s+agora\b/ },
  { label: "freemium availability before gate", pattern: /\bversao\s+gratuita\s+disponivel\b|\bsetup\s+em\s+\d+\s+minutos\b|\bsem\s+cartao\s+de\s+credito\b|\bplano\s+gratuito\b/ },
  { label: "subscription upsell before gate", pattern: /\bconteudo\s+premium\b|\bplano\s+professional\b|\batualize\s+para\s+desbloquear\b/ },
  { label: "enterprise integrations sold before gate", pattern: /\b(api|hris|sso|webhooks?|sla\s*99)\b/ },
  { label: "production SaaS positioning before gate", pattern: /\bplataforma\s+saas\b/ },
  { label: "public enterprise ready claim", pattern: /\bpronto\s+para\s+empresas\b/ },
  { label: "immediate commercial result", pattern: /\bresultados\s+imediatos\b/ },
  { label: "hard response time promise", pattern: /\bate\s+\d+\s+horas\s+uteis\b/ },
] as const;

const safeLimitMarkers = [
  "nao ",
  "nenhum ",
  "nunca ",
  "sem garantir",
  "sem substituir",
  "sujeito a aprovacao",
  "sujeita a aprovacao",
  "ainda nao",
  "bloquead",
  "futuro",
  "em maturacao",
  "sob aprovacao",
  "sujeitos a gates",
  "somente apos",
  "depende de",
];

function read(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function isAllowedLimitLine(line: string) {
  return safeLimitMarkers.some((marker) => line.includes(marker)) ||
    (line.includes("question:") && line.includes("?"));
}

describe("public claims guardrail", () => {
  it("keeps public marketing surfaces free from prohibited regulatory and scientific overclaims", () => {
    const violations = publicSurfaceFiles.flatMap((file) => {
      const lines = normalize(read(file)).split(/\r?\n/);

      return lines.flatMap((line, index) => {
        if (isAllowedLimitLine(line)) return [];

        return blockedClaimPatterns
          .filter(({ pattern }) => pattern.test(line))
          .map(({ label }) => `${file}:${index + 1} ${label}`);
      });
    });

    expect(violations).toEqual([]);
  });

  it("keeps explicit public disclaimers about technical review and no guaranteed compliance", () => {
    const publicCopy = normalize(publicSurfaceFiles.map((file) => read(file)).join("\n"));

    expect(publicCopy).toContain("nao garante conformidade");
    expect(publicCopy).toContain("nao substitui o responsavel tecnico");
    expect(publicCopy).toContain("validacao juridica e tecnica");
  });

  it("keeps critical public claims tied to versioned primary-source references", () => {
    const policy = normalize(read("src/data/publicClaimsPolicy.ts"));
    const regulatoryRegistry = normalize(read("src/data/regulatorySources.ts"));

    expect(policy).toContain("public-claims-g0-2026-07-12");
    expect(policy).toContain("nao implica validacao, afiliacao ou chancela");
    expect(policy).toContain("wellbeing.hmc.ox.ac.uk/publications/work-wellbeing-playbook");
    expect(regulatoryRegistry).toContain("normas-regulamentadoras-vigentes/nr-1");
    expect(regulatoryRegistry).toContain("vigencia em 26/05/2026");
  });

  it("does not present the local commercial draft as delivered or scheduled", () => {
    const salesSurface = normalize([
      read("src/pages/SalesPage.tsx"),
      read("src/components/sales/LeadCaptureForm.tsx"),
      read("src/components/sales/ReadinessCalculator.tsx"),
      read("src/components/sales/SegmentSelector.tsx"),
    ].join("\n"));
    const form = normalize(read("src/components/sales/LeadCaptureForm.tsx"));

    expect(salesSurface).not.toMatch(/\bagendar\b/);
    expect(form).toContain("nao envia dados a equipe");
    expect(form).toContain("nenhuma reuniao foi agendada");
    expect(form).toContain("excluir rascunho local");
    expect(form).not.toContain("aceito receber contato");
    expect(salesSurface).toContain("proximo passo escolhido");
    expect(salesSurface).not.toContain("mais popular");
  });

  it("keeps the buyer trust center explicit about available, reviewed and blocked states", () => {
    const trustCenter = normalize(read("src/components/sales/VendorDeliveryReadinessCard.tsx"));

    expect(trustCenter).toContain("disponivel nesta demonstracao");
    expect(trustCenter).toContain("em revisao responsavel");
    expect(trustCenter).toContain("bloqueado neste gate");
    expect(trustCenter).toContain("sem dados de trabalhadores, crm, calendario, cobranca ou operacao produtiva");
    expect(trustCenter).not.toContain("depoimentos");
    expect(trustCenter).not.toContain("logos de clientes");
  });

  it("keeps buyer committee alignment separate from formal approval and real-data authorization", () => {
    const committeeJourney = normalize([
      read("src/components/sales/BuyerCommitteeJourney.tsx"),
      read("src/data/g1BuyerCommitteeJourney.ts"),
    ].join("\n"));

    expect(committeeJourney).toContain("nao constitui parecer, aprovacao formal, proposta");
    expect(committeeJourney).toContain("nenhum dado real, crm, integracao ou entrega remota");
    expect(committeeJourney).toContain("questionario nao substitui aep, aet");
    expect(committeeJourney).not.toContain("comite aprovou");
    expect(committeeJourney).not.toContain("pronto para contratar");
  });

  it("keeps the Readiness & Governance Sprint bounded, reviewable and without a purchase path", () => {
    const sprint = normalize([
      read("src/components/sales/ReadinessGovernanceSprintCard.tsx"),
      read("src/data/g1ReadinessGovernanceSprint.ts"),
      read("src/lib/commercial/readinessGovernanceSprint.ts"),
    ].join("\n"));

    expect(sprint).toContain("venda ainda nao autorizada");
    expect(sprint).toContain("sem dados pessoais");
    expect(sprint).toContain("pesquisa, campanha ou coleta com trabalhadores");
    expect(sprint).toContain("nao e laudo, pgr, diagnostico ou declaracao de conformidade");
    expect(sprint).toContain("nao ha checkout, crm, calendario, cobranca, operacao remota ou avanco de gate habilitados");
    expect(sprint).not.toContain("assinar agora");
  });

  it("keeps public sale surfaces on the canonical commercial authorization state", () => {
    const publicSales = normalize([
      read("src/components/sales/ReadinessGovernanceSprintCard.tsx"),
      read("src/pages/SalesPage.tsx"),
    ].join("\n"));
    const launchContext = normalize(read("src/data/g1PaidAdvisoryLaunchRehearsal.ts"));

    expect(publicSales).toContain("g1commercialauthorizationsummary");
    expect(publicSales).not.toContain("canauthorizesale");
    expect(launchContext).toContain("g1commercialauthorizationsummary.saleauthorized");
  });

  it("keeps the public shell free from remote font imports", () => {
    const publicStyles = normalize(read("src/styles.css"));

    expect(publicStyles).not.toMatch(/@import\s+url\([^)]*https?:\/\//);
    expect(publicStyles).not.toContain("fonts.googleapis.com");
    expect(publicStyles).not.toContain("fonts.gstatic.com");
  });

  it("keeps public authentication honest while the production runtime is blocked", () => {
    const signupShell = normalize(read("src/components/signup/SignupShell.tsx"));
    const signupSst = normalize(read("src/pages/signup/SignupSstPage.tsx"));
    const signupManager = normalize(read("src/pages/signup/SignupManagerPage.tsx"));
    const auth = normalize(read("src/pages/AuthPage.tsx"));

    expect(signupShell).toContain("cadastro indisponivel nesta demonstracao sintetica");
    expect(signupShell).toMatch(/nenhuma conta ou\s+organizacao sera criada/);
    expect(signupSst).toContain("signupruntimeavailability");
    expect(signupManager).toContain("signupruntimeavailability");
    expect(auth).toContain("supabaseruntimeavailability");
    expect(auth).not.toContain("criar conta gratuita");
  });

  it("keeps public learning, AI and financial-copy surfaces factual and reviewable", () => {
    const chatbot = normalize(read("src/components/DriverChatbot.tsx"));
    const calculator = normalize(read("src/components/home/ImpactCalculator.tsx"));
    const crosswalk = normalize(read("src/data/nr1Crosswalk.ts"));
    const framework = normalize(read("src/components/nr1/FrameworkCanon.tsx"));
    const library = normalize(read("src/pages/LibraryPage.tsx"));
    const driverWorld = normalize(read("src/pages/DriverWorldPage.tsx"));
    const home = normalize(read("src/pages/HomePage.tsx"));
    const learningDynamicCard = normalize(read("src/components/LearningDynamicCard.tsx"));

    expect(chatbot).toContain("nao inclua dados pessoais ou relatos identificaveis");
    expect(chatbot).toContain("respostas podem conter imprecisoes");
    expect(chatbot).not.toContain("powered by gemini");
    expect(chatbot).not.toMatch(/\b(74%|50%|41%|46\.000|20%)\b/);
    expect(calculator).toContain("nao e previsao financeira, roi ou auditoria");
    expect(calculator).toContain("nao preve retorno financeiro, economia garantida, eficacia de intervencao ou conformidade");
    expect(calculator).not.toContain("benchmark oms 4:1");
    expect(crosswalk).toContain("fenomeno ocupacional, nao como condicao medica");
    expect(crosswalk).not.toContain("doenca ocupacional");
    expect(framework).toContain("nao constitui laudo, interpretacao oficial da nr-1");
    expect(library).toContain("referencias catalogadas em revisao");
    expect(library).toContain("o resumo do catalogo nao e exibido nesta demonstracao");
    expect(library).not.toContain("biblioteca de evidencias");
    expect(library).not.toContain("curadoria cientifica");
    expect(library).not.toContain("articlepopout.summary");
    expect(driverWorld).toContain("catalogo em revisao");
    expect(driverWorld).toContain("sem conclusao tecnica");
    expect(driverWorld).toContain("o resumo do catalogo nao e exibido enquanto a revisao tecnica e metodologica estiver pendente");
    expect(driverWorld).not.toContain("peer-reviewed mapeado");
    expect(driverWorld).not.toContain("protocolo g2 · apenas fontes com url verificado");
    expect(driverWorld).not.toContain("art.summary");
    expect(driverWorld).toContain("dinamica em revisao de disponibilidade");
    expect(driverWorld).toContain("nao ha assinatura ou contratacao habilitada nesta etapa");
    expect(home).toContain("demonstracao sintetica disponivel");
    expect(home).toContain("dados reais e operacoes formais continuam bloqueados");
    expect(home).not.toContain("versao gratuita disponivel");
    expect(home).not.toContain("sem cartao de credito");
    expect(learningDynamicCard).toContain("em revisao de disponibilidade");
  });
});
