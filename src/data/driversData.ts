import {
  Users,
  Shield,
  Zap,
  HeartHandshake,
  Battery,
  UserCheck,
  Coins,
  Clock,
  BookOpen,
  Compass,
  Star,
  Target,
  ShieldCheck,
  MessageSquare,
  Sliders,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import type { Playbook2PillarCode } from "@/lib/governance/playbook2RagEngine";

export interface Driver {
  slug: string;
  name: string;
  namePt: string;
  tagline: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  pillarCode?: Playbook2PillarCode;
  pillarLetter?: "D" | "R" | "I" | "V" | "E";
  pillarLabelPt?: string;
  isNewInPlaybook2?: boolean;
  playbook2SpotlightPt?: string;
}

export interface RoadmapDriver2026 {
  readonly slug: string;
  readonly name: string;
  readonly namePt: string;
  readonly pillarCode: Playbook2PillarCode;
  readonly pillarLabelPt: string;
  readonly releaseWindowPt: string;
  readonly descriptionPt: string;
}

export const drivers: Driver[] = [
  {
    slug: "management",
    name: "Management",
    namePt: "Gestão & Liderança",
    tagline: "Gestão capacitada com inteligência emocional e redução do estresse gerencial.",
    icon: Users,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    pillarCode: "R",
    pillarLetter: "R",
    pillarLabelPt: "R · Relações e Liderança",
    playbook2SpotlightPt: "Capacitação de gestores em SST/saúde mental, proteção contra sobrecarga gerencial e Inteligência Emocional (EI).",
  },
  {
    slug: "trust",
    name: "Trust",
    namePt: "Confiança",
    tagline: "Segurança psicológica, comunicação transparente e responsabilidade social participativa.",
    icon: Shield,
    colorClass: "text-ift-lavender",
    bgClass: "bg-ift-lavender/10",
    borderClass: "border-ift-lavender/30",
    pillarCode: "R",
    pillarLetter: "R",
    pillarLabelPt: "R · Relações e Liderança",
    playbook2SpotlightPt: "Clima de Segurança Psicológica (Edmondson), reuniões 1:1 de melhoria e múltiplos canais de comunicação.",
  },
  {
    slug: "stress",
    name: "Stress",
    namePt: "Estresse & Carga",
    tagline: "Reduzir causas-raiz organizacionais do estresse e prevenir esgotamento ocupacional.",
    icon: Zap,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/30",
    pillarCode: "R_RISK",
    pillarLetter: "R",
    pillarLabelPt: "R · Risco, Saúde e Segurança",
    playbook2SpotlightPt: "Prevenção multinível combinando redesenho do trabalho, treinamento de liderança e recursos de enfrentamento.",
  },
  {
    slug: "support",
    name: "Support",
    namePt: "Suporte & Recursos",
    tagline: "Liderança pró-social, apoio entre pares e comportamentos familiares suportivos.",
    icon: HeartHandshake,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    pillarCode: "R",
    pillarLetter: "R",
    pillarLabelPt: "R · Relações e Liderança",
    playbook2SpotlightPt: "Treinamento em liderança pró-social (Alan et al., 2023), redes de pares e suporte ao equilíbrio vida-trabalho (FSSB).",
  },
  {
    slug: "energy",
    name: "Energy",
    namePt: "Energia & Recuperação",
    tagline: "Recuperação biopsicossocial e condições reais de trabalho antes de ações isoladas.",
    icon: Battery,
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/30",
    pillarCode: "V",
    pillarLetter: "V",
    pillarLabelPt: "V · Variedade e Realização",
    playbook2SpotlightPt: "Job crafting e melhoria das condições estruturais de trabalho (Fleming, 2024) aliados a ciclos reais de recuperação.",
  },
  {
    slug: "inclusion_belonging",
    name: "Inclusion & Belonging",
    namePt: "Inclusão & Pertencimento",
    tagline: "Diversidade com voz ativa nas decisões, mentoria e pertencimento autêntico.",
    icon: UserCheck,
    colorClass: "text-ift-coral",
    bgClass: "bg-ift-coral/10",
    borderClass: "border-ift-coral/30",
    pillarCode: "R",
    pillarLetter: "R",
    pillarLabelPt: "R · Relações e Liderança",
    playbook2SpotlightPt: "Combinação de Diversidade, Inclusão decisória e Pertencimento com mitigação de vieses e patrocínio (sponsorship).",
  },
  {
    slug: "compensation",
    name: "Compensation",
    namePt: "Remuneração & Justiça",
    tagline: "Salário digno, transparência remuneratória e justiça processual nas recompensas.",
    icon: Coins,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    borderClass: "border-secondary/30",
    pillarCode: "E",
    pillarLetter: "E",
    pillarLabelPt: "E · Remuneração e Benefícios",
    playbook2SpotlightPt: "Living wage, transparência salarial para redução de disparidades e governança justa de benefícios.",
  },
  {
    slug: "flexibility",
    name: "Flexibility",
    namePt: "Flexibilidade",
    tagline: "Controle de tempo e lugar com ergonomia, colaboração intencional e desconexão.",
    icon: Clock,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    pillarCode: "I",
    pillarLetter: "I",
    pillarLabelPt: "I · Independência e Flexibilidade",
    playbook2SpotlightPt: "Opções híbridas/WFH com ergonomia doméstica, agendamento presencial colaborativo e política de desconexão digital.",
  },
  {
    slug: "learning",
    name: "Learning",
    namePt: "Aprendizagem",
    tagline: "Aprender na rotina real com análise de necessidades e autonomia para transferir.",
    icon: BookOpen,
    colorClass: "text-info",
    bgClass: "bg-info/10",
    borderClass: "border-info/30",
    pillarCode: "D",
    pillarLetter: "D",
    pillarLabelPt: "D · Desenvolvimento e Segurança",
    playbook2SpotlightPt: "Aprendizagem integrada ao trabalho diário com tempo protegido e suporte à autonomia.",
  },
  {
    slug: "purpose",
    name: "Purpose",
    namePt: "Propósito & Sentido",
    tagline: "Conexão tangível entre tarefas diárias, beneficiários reais e significado.",
    icon: Compass,
    colorClass: "text-ift-lavender",
    bgClass: "bg-ift-lavender/10",
    borderClass: "border-ift-lavender/30",
    pillarCode: "V",
    pillarLetter: "V",
    pillarLabelPt: "V · Variedade e Realização",
    playbook2SpotlightPt: "Tradução da missão em marcos concretos (Carton, 2018) e contato com os beneficiários do trabalho.",
  },
  {
    slug: "appreciation",
    name: "Appreciation",
    namePt: "Reconhecimento",
    tagline: "Reconhecimento no protocolo SAGE e cultura pautada pelo Quociente de Decência.",
    icon: Star,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    borderClass: "border-secondary/30",
    pillarCode: "R",
    pillarLetter: "R",
    pillarLabelPt: "R · Relações e Liderança",
    playbook2SpotlightPt: "Protocolo SAGE (Específico, Apropriado, Genuíno e Equitativo) aliado ao Quociente de Decência (DQ).",
  },
  {
    slug: "achievement",
    name: "Achievement",
    namePt: "Realização",
    tagline: "Metas específicas e cooperativas, progresso diário e co-design de avaliações.",
    icon: Target,
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/30",
    pillarCode: "D",
    pillarLetter: "D",
    pillarLabelPt: "D · Desenvolvimento e Segurança",
    playbook2SpotlightPt: "Metas que incentivam cooperação grupal e participação dos trabalhadores no desenho da avaliação.",
  },
  {
    slug: "job_security",
    name: "Job Security",
    namePt: "Segurança no Trabalho",
    tagline: "Segurança real e percebida, mobilidade interna, gestão de mudanças e proteção em IA.",
    icon: ShieldCheck,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    pillarCode: "D",
    pillarLetter: "D",
    pillarLabelPt: "D · Desenvolvimento e Segurança",
    isNewInPlaybook2: true,
    playbook2SpotlightPt: "Novo no Playbook 2.0 (60 referências): Segurança real vs. percebida, mercados internos, retorno ao trabalho e prevenção de demissões.",
  },
  {
    slug: "employee_voice",
    name: "Employee Voice",
    namePt: "Voz do Trabalhador",
    tagline: "Participação democrática nas decisões, Comitês de Bem-Estar (HaWCs) e diálogo CIPA.",
    icon: MessageSquare,
    colorClass: "text-info",
    bgClass: "bg-info/10",
    borderClass: "border-info/30",
    pillarCode: "I",
    pillarLetter: "I",
    pillarLabelPt: "I · Independência e Flexibilidade",
    isNewInPlaybook2: true,
    playbook2SpotlightPt: "Comitês de Saúde e Bem-Estar (HaWCs), escuta ativa não-silenciada e participação nos 4 momentos da NR-1.",
  },
  {
    slug: "autonomy",
    name: "Autonomy",
    namePt: "Autonomia",
    tagline: "Margem de decisão sobre métodos, ordem das tarefas e redesenho participativo.",
    icon: Sliders,
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/30",
    pillarCode: "I",
    pillarLetter: "I",
    pillarLabelPt: "I · Independência e Flexibilidade",
    isNewInPlaybook2: true,
    playbook2SpotlightPt: "Redesenho participativo de processos (Kobayashi et al., 2008) e liderança suportiva à autonomia.",
  },
  {
    slug: "workload_pressures",
    name: "Workload Pressures",
    namePt: "Pressões de Carga",
    tagline: "Dimensionamento realista de demandas, higiene de reuniões e ritmo sustentável.",
    icon: Gauge,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/30",
    pillarCode: "R_RISK",
    pillarLetter: "R",
    pillarLabelPt: "R · Risco, Saúde e Segurança",
    isNewInPlaybook2: true,
    playbook2SpotlightPt: "Reuniões curtas e intencionais (Bennett et al., 2021), blocos de foco e calibração de carga e ritmo.",
  },
];

export const roadmapDrivers2026: readonly RoadmapDriver2026[] = [
  {
    slug: "leadership",
    name: "Leadership",
    namePt: "Liderança Institucional",
    pillarCode: "R",
    pillarLabelPt: "R · Relações e Liderança",
    releaseWindowPt: "Previsto no Playbook 2.0: Março/2026",
    descriptionPt:
      "Driver em elaboração pelo World Wellbeing Movement focado em governança executiva, alinhamento estratégico de cultura e liderança sistêmica.",
  },
  {
    slug: "operational_design",
    name: "Operational Design",
    namePt: "Design Operacional",
    pillarCode: "R_RISK",
    pillarLabelPt: "R · Risco, Saúde e Segurança",
    releaseWindowPt: "Previsto no Playbook 2.0: Abril/2026",
    descriptionPt:
      "Driver em elaboração pelo World Wellbeing Movement focado em arquitetura de turnos, ergonomia de sistemas sociotécnicos e desenho físico/digital de operações.",
  },
];

export const earningRules = [
  { id: "EARN-VIDEO", action: "Completar vídeo lab", reward: 10, cap: 100 },
  { id: "EARN-QUIZ", action: "Passar quiz", reward: 8, cap: 80 },
  { id: "EARN-FLASH", action: "Completar flashcards", reward: 6, cap: 60 },
  { id: "EARN-SCENARIO", action: "Completar cenário lab", reward: 12, cap: 60 },
  { id: "EARN-BUILDER", action: "Enviar intervention builder", reward: 15, cap: 45 },
  { id: "EARN-DEBATE", action: "Completar debate map", reward: 12, cap: 45 },
  { id: "EARN-ACTIONLOG", action: "Registrar ação real", reward: 10, cap: 50 },
  { id: "EARN-PDF", action: "Gerar PDF", reward: 10, cap: 30 },
];

export const badges = [
  { id: "BDG-FOUNDATION", name: "Fundação", criteria: "Complete 3 dinâmicas em 3 drivers diferentes", rarity: "common" as const, emoji: "🏗️" },
  { id: "BDG-SYSTEMTHINKER", name: "Pensamento Sistêmico", criteria: "Usar Explain-Why + grafo 10 vezes", rarity: "rare" as const, emoji: "🧠" },
  { id: "BDG-IMPLEMENTER", name: "Implementador(a)", criteria: "Gerar 3 PDFs + registrar 3 ações", rarity: "rare" as const, emoji: "🚀" },
  { id: "BDG-CULTURE", name: "Cultura Viva", criteria: "Gerar 2 PDFs poéticos + registrar 2 reflexões", rarity: "epic" as const, emoji: "🎭" },
  { id: "BDG-KNOWLEDGE_CURATOR", name: "Curador(a) de Evidências", criteria: "Verificar 10 links (admin)", rarity: "epic" as const, emoji: "📚" },
];

export const motivationToasts = [
  "IFT +10! Você transformou conteúdo em ação. 🎯",
  "Nível acima! O sistema aprende com você. 🚀",
  "Consistência é poder: continue a trilha. 💪",
  "Pequenos passos, grandes sistemas. 🌱",
  "Bem-estar é infraestrutura de impacto. ✨",
];

export const learningDynamics = [
  { id: "PB2-RAG", name: "Práticas Recomendadas", description: "Ações práticas e orientações para melhorar o dia a dia de trabalho", icon: "🧭" },
  { id: "D1-QUIZ", name: "Quiz Adaptativo", description: "Teste seus conhecimentos em três níveis", icon: "🎯", modes: ["básico", "aplicado", "avançado"] },
  { id: "D2-FLASH", name: "Flashcards", description: "Repetição espaçada para retenção", icon: "🃏" },
  { id: "D3-VIDEOLAB", name: "VideoLab", description: "Vídeos TED + quiz + prática + ação", icon: "🎬" },
  { id: "D4-EVIDENCE", name: "Evidence Explorer", description: "Biblioteca científica por driver", icon: "📊" },
  { id: "D5-PDF-PLAN", name: "Trilha de Implementação", description: "Gere seu PDF técnico (3+ páginas)", icon: "📋" },
  { id: "D6-PDF-POEM", name: "Poesia Pedagógica", description: "Poema + prática reflexiva", icon: "🎭" },
  { id: "X1-SCENARIO", name: "Simulador de Decisões", description: "Cenários com escolhas e consequências", icon: "🎮" },
  { id: "X2-BUILDER", name: "Estúdio de Co-design", description: "Monte seu plano de intervenção", icon: "🏗️" },
  { id: "X3-DEBATE", name: "Arena de Debate", description: "Debate socrático com mapeamento", icon: "⚔️" },
  { id: "D7-MINDMAP", name: "Mapa Mental IA", description: "Cartografia cognitiva expansível e neuropedagógica", icon: "🧭" },
  { id: "D8-ROLEPLAY", name: "Roleplay Multi-Persona", description: "Diálogo com CEO, RH e Colaborador num dilema real", icon: "🎭" },
  { id: "D9-MICRO", name: "Microlearning Espaçado", description: "Pílulas de 60s com curva de Ebbinghaus + active recall", icon: "⚡" },
  { id: "D10-TWIN", name: "Gêmeo Digital Organizacional", description: "Agent-based simulation: projete sua org em 6/12/24 meses com tipping points", icon: "🧬" },
];

export const PLAYBOOK_URL = "https://worldwellbeingmovement.org/wp-content/uploads/2024/11/Work-Wellbeing-Playbook.pdf";
export const PLAYBOOK_2_LOCAL_DECK_URL = "/assets/aistudio/Work-Wellbeing-Playbook-2.0-Full-Deck_compressed_de86ab6d.md";
