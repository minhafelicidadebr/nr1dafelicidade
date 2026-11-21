import claraCutoutAvatarImg from "@/assets/images/lider_clara_cutout_avatar_1795101615153.jpg";
import { getDriverAvatar } from "@/lib/driverAvatars";

export interface AcademyHostChapter {
  readonly id: string;
  readonly chapterNumber: string;
  readonly title: string;
  readonly subtitle: string;
  readonly durationLabel: string;
  readonly targetDynamicId: string;
  readonly targetStationNumber: 1 | 2 | 3 | 4;
  readonly pedagogicalObjective: string;
  readonly transcript: string;
}

export interface AcademyLearningStation {
  readonly stationNumber: 1 | 2 | 3 | 4;
  readonly dynamicId: string;
  readonly badge: string;
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
}

export interface DriverAcademyHostScript {
  readonly driverSlug: string;
  readonly driverNamePt: string;
  readonly hostName: string;
  readonly hostRole: string;
  readonly studioTitle: string;
  readonly studioTagline: string;
  readonly heroStudioImageUrl: string;
  readonly avatarImageUrl: string;
  readonly chapters: readonly AcademyHostChapter[];
  readonly stations: readonly AcademyLearningStation[];
}

export interface PhoneticVisemeFrame {
  readonly mouthOpenness: number; // 0.12 .. 1.0
  readonly mouthWidth: number; // 0.45 .. 0.95
  readonly acousticEnergy: number; // 0.15 .. 1.0
  readonly visemeType: "open_vowel" | "round_vowel" | "smile_vowel" | "bilabial" | "consonant" | "rest";
}

/**
 * Calcula em tempo real o envelope fonético e labial (Viseme) a partir da palavra em pronúncia
 * e da fase intra-silábica (0..1), gerando movimento labial e espectro acústico sincronizado.
 */
export function computePhoneticViseme(
  word: string | undefined,
  intraWordPhase: number,
  isSpeaking: boolean,
): PhoneticVisemeFrame {
  if (!isSpeaking || !word) {
    return {
      mouthOpenness: 0.14,
      mouthWidth: 0.62,
      acousticEnergy: 0.12,
      visemeType: "rest",
    };
  }

  const clean = word
    .toLowerCase()
    .replace(/[.,!?;:()"""'']/g, "")
    .trim();

  if (!clean) {
    return {
      mouthOpenness: 0.16,
      mouthWidth: 0.62,
      acousticEnergy: 0.15,
      visemeType: "rest",
    };
  }

  // Determina a letra/fonema ativo dentro da palavra conforme a fase (0..1)
  const charIndex = Math.min(
    clean.length - 1,
    Math.max(0, Math.floor(intraWordPhase * clean.length)),
  );
  const currentChar = clean[charIndex] ?? "a";
  const syllablePulse =
    0.72 + 0.28 * Math.abs(Math.sin(intraWordPhase * Math.PI * Math.max(1, Math.ceil(clean.length / 2.2))));

  if (/[aáàâãéó]/.test(currentChar)) {
    return {
      mouthOpenness: Math.min(1, 0.82 * syllablePulse),
      mouthWidth: 0.78,
      acousticEnergy: Math.min(1, 0.92 * syllablePulse),
      visemeType: "open_vowel",
    };
  }

  if (/[oôuú]/.test(currentChar)) {
    return {
      mouthOpenness: Math.min(0.85, 0.64 * syllablePulse),
      mouthWidth: 0.48,
      acousticEnergy: Math.min(0.95, 0.8 * syllablePulse),
      visemeType: "round_vowel",
    };
  }

  if (/[eêiíy]/.test(currentChar)) {
    return {
      mouthOpenness: Math.min(0.75, 0.52 * syllablePulse),
      mouthWidth: 0.9,
      acousticEnergy: Math.min(0.9, 0.76 * syllablePulse),
      visemeType: "smile_vowel",
    };
  }

  if (/[pbm]/.test(currentChar)) {
    return {
      mouthOpenness: 0.16,
      mouthWidth: 0.64,
      acousticEnergy: 0.45 * syllablePulse,
      visemeType: "bilabial",
    };
  }

  return {
    mouthOpenness: Math.min(0.65, 0.42 * syllablePulse),
    mouthWidth: 0.68,
    acousticEnergy: Math.min(0.85, 0.62 * syllablePulse),
    visemeType: "consonant",
  };
}

export const MANAGEMENT_ACADEMY_HOST_SCRIPT: DriverAcademyHostScript = {
  driverSlug: "management",
  driverNamePt: "Gestão & Liderança",
  hostName: "Líder Clara",
  hostRole: "Assistente de Aprendizagem · Gestão & Liderança (Playbook 2.0)",
  studioTitle: "Boas-Vindas à Academia de Gestão & Liderança",
  studioTagline:
    "Consciência de aprendizagem guiada: entenda como cada ferramenta desta página apoia o desenvolvimento de líderes humanos, preparados e protegidos contra a sobrecarga.",
  heroStudioImageUrl: claraCutoutAvatarImg,
  avatarImageUrl: getDriverAvatar("management"),
  chapters: [
    {
      id: "cap-1-boas-vindas",
      chapterNumber: "01",
      title: "Boas-Vindas & Consciência",
      subtitle: "Cuidar de quem lidera",
      durationLabel: "22s",
      targetDynamicId: "PB2-RAG",
      targetStationNumber: 1,
      pedagogicalObjective: "Criar segurança psicológica e apresentar o núcleo do driver Gestão & Liderança no Work Wellbeing Playbook 2.0.",
      transcript:
        "Olá! Que alegria receber você na Academia de Gestão e Liderança. Eu sou a Líder Clara, sua assistente de aprendizagem. Antes de começar, respire fundo: desenvolver uma liderança saudável começa cuidando também de quem lidera. Aqui você vai descobrir como a inteligência emocional, a clareza de prioridades e a redução da sobrecarga gerencial fortalecem toda a sua equipe.",
    },
    {
      id: "cap-2-evidencias-dialogo",
      chapterNumber: "02",
      title: "Estudo & Diálogo Vivo",
      subtitle: "Evidências + Mentoria IA",
      durationLabel: "24s",
      targetDynamicId: "CHAT",
      targetStationNumber: 2,
      pedagogicalObjective: "Orientar como combinar a leitura das práticas catalogadas com o diálogo contextualizado no Assistente de Aprendizagem.",
      transcript:
        "Como funciona o seu processo de aprendizagem nesta página? Nós desenhamos quatro estações integradas. Na Estação um, em Práticas Recomendadas e no Evidence Explorer, você explora ações concretas e estudos do Playbook dois ponto zero. Na Estação dois, você conversa diretamente comigo no chat para traduzir essas referências para os desafios do seu dia a dia.",
    },
    {
      id: "cap-3-memoria-simulacao",
      chapterNumber: "03",
      title: "Memória & Laboratório",
      subtitle: "Quiz, VideoLab e Simulação",
      durationLabel: "25s",
      targetDynamicId: "D1-QUIZ",
      targetStationNumber: 3,
      pedagogicalObjective: "Explicar o papel da recordação ativa (Quiz, Flashcards, Microlearning) e das simulações práticas (VideoLab, Roleplay, PDF).",
      transcript:
        "Na Estação três, você consolida a memória de longo prazo de forma leve com o Quiz Adaptativo, os Flashcards e o Microlearning de sessenta segundos. Já na Estação quatro, você passa para a prática: assista a palestras selecionadas no VideoLab, experimente o Simulador de Decisões, pratique conversas no Roleplay e gere seu roteiro prático em PDF.",
    },
    {
      id: "cap-4-etica-acao",
      chapterNumber: "04",
      title: "Ética NR-1 & Início",
      subtitle: "Aprendizagem segura em 1 clique",
      durationLabel: "19s",
      targetDynamicId: "D3-VIDEOLAB",
      targetStationNumber: 4,
      pedagogicalObjective: "Reforçar as fronteiras éticas e regulatórias (apoio educativo sem substituir avaliação técnica) e convidar à ação.",
      transcript:
        "Lembre-se sempre: este é um espaço educativo e sintético, que protege a privacidade e apoia o ciclo preventivo da NR-1 sem substituir o responsável técnico. Escolha qualquer uma das quatro estações abaixo para abrir a atividade agora mesmo, ou clique em Conversar com a Líder Clara para começarmos juntos!",
    },
  ],
  stations: [
    {
      stationNumber: 1,
      dynamicId: "PB2-RAG",
      badge: "Estação 1 · Compreender",
      title: "Práticas Recomendadas & Estudos",
      description: "Explore intervenções de capacitação de gestores, proteção contra estresse gerencial e inteligência emocional.",
      actionLabel: "Abrir Práticas Recomendadas",
    },
    {
      stationNumber: 2,
      dynamicId: "CHAT",
      badge: "Estação 2 · Dialogar",
      title: "Conversar com a Líder Clara",
      description: "Tire dúvidas práticas e construa perguntas observáveis para a rotina de gestão da sua equipe.",
      actionLabel: "Iniciar Diálogo com a Mentora",
    },
    {
      stationNumber: 3,
      dynamicId: "D1-QUIZ",
      badge: "Estação 3 · Fixar",
      title: "Quiz Adaptativo & Flashcards",
      description: "Ative a retenção de memória com perguntas formativas e cartões de repetição espaçada.",
      actionLabel: "Testar Conhecimentos no Quiz",
    },
    {
      stationNumber: 4,
      dynamicId: "D3-VIDEOLAB",
      badge: "Estação 4 · Praticar",
      title: "VideoLab, Simuladores & PDF",
      description: "Assista a palestras comentadas, simule tomadas de decisão e gere sua trilha prática em PDF.",
      actionLabel: "Explorar VideoLab & Prática",
    },
  ],
};

interface DriverHostCatalogProfile {
  readonly driverNamePt: string;
  readonly hostName: string;
  readonly hostRole: string;
  readonly studioTitle: string;
  readonly studioTagline: string;
  readonly coreConceptSummaryPt: string;
  readonly practicalFocusPt: string;
  readonly nr1ConnectionPt: string;
}

const DRIVER_HOST_PROFILES: Readonly<Record<string, DriverHostCatalogProfile>> = {
  trust: {
    driverNamePt: "Confiança",
    hostName: "Líder Clara · Mentoria de Confiança",
    hostRole: "Assistente de Aprendizagem · Confiança & Segurança Psicológica (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Confiança & Segurança Psicológica",
    studioTagline:
      "Consciência de aprendizagem guiada: descubra como construir segurança psicológica, transparência multicanal e diálogo confiável na sua equipe.",
    coreConceptSummaryPt:
      "o clima de segurança psicológica estudado por Amy Edmondson, as reuniões individuais de melhoria e a comunicação transparente em múltiplos canais",
    practicalFocusPt:
      "Práticas de escuta segura, alinhamento transparente de expectativas e responsabilidade social participativa",
    nr1ConnectionPt:
      "fortalecendo a confiança mútua para que os trabalhadores participem como especialistas do saber-fazer nos quatro momentos da NR-1",
  },
  stress: {
    driverNamePt: "Estresse & Carga",
    hostName: "Líder Clara · Mentoria de Equilíbrio",
    hostRole: "Assistente de Aprendizagem · Prevenção do Estresse Ocupacional (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Prevenção do Estresse & Carga",
    studioTagline:
      "Consciência de aprendizagem guiada: compreenda a prevenção multinível que atua nas causas-raiz da organização do trabalho antes do esgotamento.",
    coreConceptSummaryPt:
      "a prevenção multinível que combina o redesenho das exigências do trabalho na fonte, a capacitação da liderança e os recursos coletivos de enfrentamento",
    practicalFocusPt:
      "Intervenções primárias sobre ritmo, prazos, clareza de prioridades e recuperação cognitiva",
    nr1ConnectionPt:
      "atendendo diretamente à hierarquia legal de controles da NR-1 e à avaliação ergonômica da organização do trabalho da NR-17",
  },
  support: {
    driverNamePt: "Suporte & Recursos",
    hostName: "Líder Clara · Mentoria de Suporte",
    hostRole: "Assistente de Aprendizagem · Suporte & Redes de Apoio (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Suporte & Recursos",
    studioTagline:
      "Consciência de aprendizagem guiada: explore como a liderança pró-social, o apoio entre colegas e o suporte familiar amortecem pressões diárias.",
    coreConceptSummaryPt:
      "a liderança pró-social, as redes estruturadas de apoio entre pares e os comportamentos familiares suportivos da supervisão",
    practicalFocusPt:
      "Protocolos de ajuda mútua, mentoria acolhedora e proteção do equilíbrio entre vida pessoal e trabalho",
    nr1ConnectionPt:
      "atuando sobre o fator crítico de suporte social destacado no Quadro dois do Manual Oficial MTE dois mil e vinte e seis",
  },
  energy: {
    driverNamePt: "Energia & Recuperação",
    hostName: "Líder Clara · Mentoria de Vitalidade",
    hostRole: "Assistente de Aprendizagem · Energia & Recuperação Biopsicossocial (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Energia & Recuperação",
    studioTagline:
      "Consciência de aprendizagem guiada: entenda por que condições reais de trabalho e pausas de recuperação vêm antes de programas individuais isolados.",
    coreConceptSummaryPt:
      "a criação de ciclos reais de recuperação biopsicossocial, micro-pausas intencionais e o redesenho de condições estruturais de trabalho",
    practicalFocusPt:
      "Práticas de job crafting, pausas restauradoras e proteção da vitalidade ao longo da jornada",
    nr1ConnectionPt:
      "prevenindo a fadiga acumulada e respeitando a regra da NR-1 de priorizar medidas coletivas e organizacionais",
  },
  inclusion_belonging: {
    driverNamePt: "Inclusão & Pertencimento",
    hostName: "Líder Clara · Mentoria de Inclusão",
    hostRole: "Assistente de Aprendizagem · Inclusão, Equidade & Pertencimento (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Inclusão & Pertencimento",
    studioTagline:
      "Consciência de aprendizagem guiada: aprenda a unir diversidade representativa, inclusão nas decisões e pertencimento autêntico.",
    coreConceptSummaryPt:
      "a mitigação de vieses em processos de seleção e promoção, programas de mentoria e patrocínio e a voz ativa nas decisões",
    practicalFocusPt:
      "Ferramentas de inclusão decisória, respeito às diferenças e prevenção de qualquer forma de exclusão ou assédio",
    nr1ConnectionPt:
      "promovendo ambientes psicologicamente seguros e alinhados às atribuições da CIPA na prevenção de assédio e violência",
  },
  compensation: {
    driverNamePt: "Remuneração & Justiça",
    hostName: "Líder Clara · Mentoria de Equidade",
    hostRole: "Assistente de Aprendizagem · Remuneração Dignidade & Justiça (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Remuneração & Justiça Organizacional",
    studioTagline:
      "Consciência de aprendizagem guiada: examine o impacto do salário digno, da transparência remuneratória e da justiça processual no bem-estar.",
    coreConceptSummaryPt:
      "o compromisso com o salário digno, a transparência nos critérios de progressão e a justiça distributiva e processual nas recompensas",
    practicalFocusPt:
      "Governança transparente de benefícios, equidade salarial e clareza nos critérios de avaliação",
    nr1ConnectionPt:
      "mitigando o fator de risco psicossocial de baixas recompensas e percepção de injustiça apontado pelo MTE",
  },
  flexibility: {
    driverNamePt: "Flexibilidade",
    hostName: "Líder Clara · Mentoria de Flexibilidade",
    hostRole: "Assistente de Aprendizagem · Flexibilidade & Desconexão (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Flexibilidade & Organização do Tempo",
    studioTagline:
      "Consciência de aprendizagem guiada: equilibre autonomia de tempo e lugar com ergonomia, colaboração intencional e direito à desconexão.",
    coreConceptSummaryPt:
      "o desenho equilibrado de modelos híbridos e presenciais, a ergonomia nos postos de trabalho, a colaboração intencional e a desconexão digital",
    practicalFocusPt:
      "Acordos coletivos de disponibilidade, previsibilidade de escalas e respeito aos períodos de descanso",
    nr1ConnectionPt:
      "integrando as cinco áreas das condições de trabalho da NR-17 ao gerenciamento de riscos ocupacionais da NR-1",
  },
  learning: {
    driverNamePt: "Aprendizagem",
    hostName: "Líder Clara · Mentoria de Aprendizagem",
    hostRole: "Assistente de Aprendizagem · Desenvolvimento Contínuo (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Aprendizagem & Desenvolvimento",
    studioTagline:
      "Consciência de aprendizagem guiada: transforme o trabalho diário em espaço seguro de evolução técnica, autonomia e transferência prática.",
    coreConceptSummaryPt:
      "a análise cuidadosa de necessidades formativas, o tempo protegido para aprender na rotina e a autonomia para aplicar novos saberes",
    practicalFocusPt:
      "Trilhas de desenvolvimento integradas ao trabalho real, aprendizagem entre pares e feedback construtivo",
    nr1ConnectionPt:
      "cumprindo a orientação do Capítulo seis do Manual MTE de qualificar continuamente os trabalhadores para o gerenciamento de riscos",
  },
  purpose: {
    driverNamePt: "Propósito & Sentido",
    hostName: "Líder Clara · Mentoria de Propósito",
    hostRole: "Assistente de Aprendizagem · Propósito & Significado do Trabalho (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Propósito & Sentido no Trabalho",
    studioTagline:
      "Consciência de aprendizagem guiada: conecte as atividades cotidianas ao impacto humano real e a marcos concretos de contribuição.",
    coreConceptSummaryPt:
      "a tradução da missão institucional em marcos tangíveis e a aproximação entre quem realiza o trabalho e quem é beneficiado por ele",
    practicalFocusPt:
      "Clareza de contribuição social, coerência entre valores declarados e práticas reais de gestão",
    nr1ConnectionPt:
      "fortalecendo a dimensão protetiva de significado do trabalho no COPSOQ dois sem jamais usar propósito para justificar sobrecarga",
  },
  appreciation: {
    driverNamePt: "Reconhecimento",
    hostName: "Líder Clara · Mentoria de Reconhecimento",
    hostRole: "Assistente de Aprendizagem · Reconhecimento & Protocolo SAGE (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Reconhecimento & Valorização",
    studioTagline:
      "Consciência de aprendizagem guiada: pratique o protocolo SAGE — reconhecimento específico, apropriado, genuíno e equitativo.",
    coreConceptSummaryPt:
      "o protocolo SAGE de reconhecimento específico, apropriado, genuíno e equitativo aliado ao Quociente de Decência nas relações",
    practicalFocusPt:
      "Rituais cotidianos de valorização entre pares e lideranças sem gerar competição predatória",
    nr1ConnectionPt:
      "atuando diretamente contra o fator de risco de baixas recompensas e falta de reconhecimento listado no Quadro dois do MTE",
  },
  achievement: {
    driverNamePt: "Realização",
    hostName: "Líder Clara · Mentoria de Realização",
    hostRole: "Assistente de Aprendizagem · Metas Cooperativas & Progresso (Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Realização & Progresso Sustentável",
    studioTagline:
      "Consciência de aprendizagem guiada: desenhe metas claras, cooperativas e participativas que celebrem o progresso diário sem pressão abusiva.",
    coreConceptSummaryPt:
      "a definição participativa de metas específicas e cooperativas, o princípio do progresso cotidiano e o co-desenho de avaliações justas",
    practicalFocusPt:
      "Remoção de bloqueios operacionais, clareza de critérios de sucesso e celebração de avanços coletivos",
    nr1ConnectionPt:
      "alinhando as normas de produção e exigências de resultado da NR-17 à capacidade real e saudável das equipes",
  },
  job_security: {
    driverNamePt: "Segurança no Trabalho",
    hostName: "Líder Clara · Mentoria de Estabilidade",
    hostRole: "Assistente de Aprendizagem · Segurança Real & Percebida (Novo no Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Segurança & Estabilidade no Trabalho",
    studioTagline:
      "Consciência de aprendizagem guiada: explore o novo capítulo do Playbook 2.0 sobre segurança real e percebida, mobilidade interna e requalificação.",
    coreConceptSummaryPt:
      "a proteção da segurança real e percebida, os mercados internos de mobilidade, o suporte no retorno ao trabalho e a requalificação justa diante da automação",
    practicalFocusPt:
      "Comunicação previsível em mudanças organizacionais, integração digna de terceirizados e prevenção de demissões",
    nr1ConnectionPt:
      "gerenciando de forma preventiva as mudanças organizacionais e tecnológicas previstas no gatilho de revisão imediata da NR-1",
  },
  employee_voice: {
    driverNamePt: "Voz do Trabalhador",
    hostName: "Líder Clara · Mentoria de Participação",
    hostRole: "Assistente de Aprendizagem · Voz do Trabalhador & CIPA (Novo no Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Voz do Trabalhador & Diálogo Participativo",
    studioTagline:
      "Consciência de aprendizagem guiada: estruture Comitês de Bem-Estar, canais de mão dupla e a escuta nos 4 momentos obrigatórios da NR-1.",
    coreConceptSummaryPt:
      "os Comitês de Saúde e Bem-Estar, os canais seguros de escuta não silenciada e a devolutiva transparente que transforma percepção em plano de ação",
    practicalFocusPt:
      "Articulação viva com a CIPA, rodas de contextualização por grupo de exposição e retorno das decisões aos trabalhadores",
    nr1ConnectionPt:
      "cumprindo integralmente o Capítulo seis do Manual MTE dois mil e vinte e seis sobre participação e comunicação em via de mão dupla",
  },
  autonomy: {
    driverNamePt: "Autonomia",
    hostName: "Líder Clara · Mentoria de Autonomia",
    hostRole: "Assistente de Aprendizagem · Autonomia & Redesenho Participativo (Novo no Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Autonomia & Margem de Decisão",
    studioTagline:
      "Consciência de aprendizagem guiada: amplie o controle sobre métodos e ordem das tarefas com suporte estruturado e redesenho participativo.",
    coreConceptSummaryPt:
      "o redesenho participativo de processos, a margem de decisão sobre o modo operatório e a liderança que apoia a autonomia sem abandonar a equipe",
    practicalFocusPt:
      "Oficinas de melhoria de fluxo, redução de microgerenciamento e clareza de fronteiras decisórias",
    nr1ConnectionPt:
      "combatendo o fator de risco de baixo controle no trabalho e falta de autonomia destacado no Quadro dois do Manual MTE",
  },
  workload_pressures: {
    driverNamePt: "Pressões de Carga",
    hostName: "Líder Clara · Mentoria de Carga & Ritmo",
    hostRole: "Assistente de Aprendizagem · Pressões de Carga & Ritmo Sustentável (Novo no Playbook 2.0)",
    studioTitle: "Boas-Vindas à Academia de Pressões de Carga & Ritmo Sustentável",
    studioTagline:
      "Consciência de aprendizagem guiada: dimensione demandas com realismo, aplique higiene de reuniões e proteja blocos de foco cognitivo.",
    coreConceptSummaryPt:
      "o dimensionamento realista de demandas, a higiene de reuniões com pautas curtas e blocos de foco e a calibração sustentável do ritmo de trabalho",
    practicalFocusPt:
      "Revisão de prazos conflitantes, eliminação de retrabalho burocrático e proteção contra exigências cognitivas excessivas",
    nr1ConnectionPt:
      "atendendo diretamente ao controle de exigência de tempo, ritmo e múltiplas tarefas com alta demanda cognitiva da NR-1 e NR-17",
  },
};

function buildDriverAcademyHostScriptFromProfile(
  slug: string,
  profile: DriverHostCatalogProfile,
): DriverAcademyHostScript {
  return {
    driverSlug: slug,
    driverNamePt: profile.driverNamePt,
    hostName: "Líder Clara",
    hostRole: profile.hostRole,
    studioTitle: profile.studioTitle,
    studioTagline: profile.studioTagline,
    heroStudioImageUrl: claraCutoutAvatarImg,
    avatarImageUrl: claraCutoutAvatarImg,
    chapters: [
      {
        id: `cap-1-${slug}`,
        chapterNumber: "01",
        title: "Boas-Vindas & Consciência",
        subtitle: `O núcleo de ${profile.driverNamePt}`,
        durationLabel: "22s",
        targetDynamicId: "PB2-RAG",
        targetStationNumber: 1,
        pedagogicalObjective: `Apresentar o fundamento científico do driver ${profile.driverNamePt} no Work Wellbeing Playbook 2.0 e sua conexão com a prevenção primária.`,
        transcript: `Olá! Seja muito bem-vindo à Academia de ${profile.driverNamePt}. Eu sou a Líder Clara, sua assistente de aprendizagem. Nesta jornada guiada, vamos explorar com calma e profundidade ${profile.coreConceptSummaryPt}, sempre priorizando mudanças reais na organização do trabalho.`,
      },
      {
        id: `cap-2-${slug}`,
        chapterNumber: "02",
        title: "Estudo & Diálogo Vivo",
        subtitle: "Evidências + Mentoria IA",
        durationLabel: "24s",
        targetDynamicId: "CHAT",
        targetStationNumber: 2,
        pedagogicalObjective: `Orientar como articular as práticas recomendadas de ${profile.driverNamePt} com o diálogo estruturado no chat da academia.`,
        transcript: `Como aproveitar ao máximo esta academia? Na Estação um, você consulta intervenções práticas e estudos científicos catalogados no Playbook dois ponto zero. Na Estação dois, você conversa comigo no chat com tabelas organizadas e voz feminina para traduzir essas práticas para o contexto da sua equipe.`,
      },
      {
        id: `cap-3-${slug}`,
        chapterNumber: "03",
        title: "Memória & Laboratório",
        subtitle: "Quiz, VideoLab e Simulação",
        durationLabel: "23s",
        targetDynamicId: "D1-QUIZ",
        targetStationNumber: 3,
        pedagogicalObjective: "Demonstrar como fixar conceitos com Quiz Adaptativo, Flashcards, VideoLab e geração de trilha prática em PDF.",
        transcript: `Na Estação três, você fortalece a retenção do conhecimento com o Quiz Adaptativo, os Flashcards e o Microlearning de sessenta segundos. Já na Estação quatro, você pratica no VideoLab, no Simulador de Decisões, no Roleplay e exporta seu plano pedagógico em PDF.`,
      },
      {
        id: `cap-4-${slug}`,
        chapterNumber: "04",
        title: "Promoção NR-1 & Ação",
        subtitle: "Aprendizagem ética em 1 clique",
        durationLabel: "20s",
        targetDynamicId: "D3-VIDEOLAB",
        targetStationNumber: 4,
        pedagogicalObjective: `Conectar ${profile.driverNamePt} ao ciclo preventivo do GRO/PGR e do Manual Oficial MTE 2026 com segurança ética.`,
        transcript: `Este espaço educativo apoia o ciclo preventivo da NR-1, ${profile.nr1ConnectionPt}, sem substituir a avaliação técnica formal. Clique em qualquer uma das quatro estações abaixo para abrir a atividade agora mesmo!`,
      },
    ],
    stations: [
      {
        stationNumber: 1,
        dynamicId: "PB2-RAG",
        badge: "Estação 1 · Compreender",
        title: "Práticas Recomendadas & Estudos",
        description: profile.practicalFocusPt,
        actionLabel: "Abrir Práticas Recomendadas",
      },
      {
        stationNumber: 2,
        dynamicId: "CHAT",
        badge: "Estação 2 · Dialogar",
        title: `Conversar sobre ${profile.driverNamePt}`,
        description: "Explore matrizes de decisão, referências científicas e roteiros práticos no chat guiado.",
        actionLabel: "Iniciar Diálogo com a Mentora",
      },
      {
        stationNumber: 3,
        dynamicId: "D1-QUIZ",
        badge: "Estação 3 · Fixar",
        title: "Quiz Adaptativo & Flashcards",
        description: "Consolide os conceitos-chave com perguntas formativas e repetição espaçada.",
        actionLabel: "Testar Conhecimentos no Quiz",
      },
      {
        stationNumber: 4,
        dynamicId: "D3-VIDEOLAB",
        badge: "Estação 4 · Praticar",
        title: "VideoLab, Simuladores & PDF",
        description: "Assista a palestras comentadas, simule decisões organizacionais e baixe o guia em PDF.",
        actionLabel: "Explorar VideoLab & Prática",
      },
    ],
  };
}

export function getDriverAcademyHostScript(slug: string): DriverAcademyHostScript | null {
  if (slug === "management") {
    return MANAGEMENT_ACADEMY_HOST_SCRIPT;
  }
  const profile = DRIVER_HOST_PROFILES[slug];
  if (profile) {
    return buildDriverAcademyHostScriptFromProfile(slug, profile);
  }
  return null;
}

