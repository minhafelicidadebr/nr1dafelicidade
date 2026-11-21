import type { Playbook2PillarCode } from "@/lib/governance/playbook2RagEngine";

import heroManagement from "@/assets/images/hero_driver_management_1795006703734.jpg";
import heroTrust from "@/assets/images/hero_driver_trust_1795006703919.jpg";
import heroStress from "@/assets/images/hero_driver_stress_1795006706569.jpg";
import heroSupport from "@/assets/images/hero_driver_support_1795006708805.jpg";
import heroEnergy from "@/assets/images/hero_driver_energy_1795006710616.jpg";
import heroInclusion from "@/assets/images/hero_driver_inclusion_1795006710550.jpg";
import heroCompensation from "@/assets/images/hero_driver_compensation_1795006713322.jpg";
import heroFlexibility from "@/assets/images/hero_driver_flexibility_1795006714580.jpg";
import heroLearning from "@/assets/images/hero_driver_learning_1795006716754.jpg";
import heroPurpose from "@/assets/images/hero_driver_purpose_1795006718672.jpg";
import heroAppreciation from "@/assets/images/hero_driver_appreciation_1795006720887.jpg";
import heroAchievement from "@/assets/images/hero_driver_achievement_1795006721909.jpg";
import heroSecurity from "@/assets/images/hero_driver_security_1795006721967.jpg";
import heroVoice from "@/assets/images/hero_driver_voice_1795006725820.jpg";
import heroAutonomy from "@/assets/images/hero_driver_autonomy_1795006727744.jpg";
import heroWorkload from "@/assets/images/hero_driver_workload_1795006727977.jpg";
import heroLeadership from "@/assets/images/hero_driver_leadership_1795006731105.jpg";

export interface HollywoodThreePointLightingSpec {
  readonly keyLight: string;
  readonly fillLight: string;
  readonly rimLight: string;
  readonly colorTemperatureKelvin: string;
}

export interface HollywoodCameraOpticsSpec {
  readonly cameraBody: string;
  readonly lensFocalLength: string;
  readonly aperture: string;
  readonly aspectRatio: "16:9";
  readonly dynamicRange: string;
}

export interface Argo4HeroTotHarmonyScores {
  readonly invariantValid: boolean;
  readonly thematicCorrelationScore: number;
  readonly hollywoodLightingScore: number;
  readonly typographicHarmonyScore: number;
  readonly uxExErgonomicsScore: number;
  readonly wcagContrastScore: number;
}

export interface Argo4DriverHeroSpec {
  readonly specId: string;
  readonly order: number;
  readonly driverSlug: string;
  readonly driverNamePt: string;
  readonly driverNameEn: string;
  readonly pillarCode: Playbook2PillarCode;
  readonly pillarLabelPt: string;
  readonly isNewInPlaybook2: boolean;
  readonly isRoadmap2026: boolean;
  readonly releaseWindow?: string;
  readonly heroImageUrl: string;
  readonly visualHeadlineCaptionPt: string;
  readonly thematicCorrelationPt: string;
  readonly uxHarmonyArchitecturePt: string;
  readonly hollywoodLightingSetup: HollywoodThreePointLightingSpec;
  readonly cameraOpticsSpec: HollywoodCameraOpticsSpec;
  readonly developmentPromptEn: string;
  readonly developmentPromptPt: string;
  readonly totHarmonyScores: Argo4HeroTotHarmonyScores;
}

export interface EvaluatedArgo4DriverHeroSpec extends Argo4DriverHeroSpec {
  readonly utilityScore: number;
}

export interface Argo4HeroPromptCatalogSummary {
  readonly catalogId: string;
  readonly version: string;
  readonly totalSpecs: number;
  readonly activeDriversCount: number;
  readonly roadmap2026Count: number;
  readonly averageHarmonyUtilityScore: number;
  readonly allInvariantsValid: boolean;
  readonly evaluatedSpecs: readonly EvaluatedArgo4DriverHeroSpec[];
}

export const ARGO4_DRIVER_HERO_SPECS: readonly Argo4DriverHeroSpec[] = [
  {
    specId: "ARGO4-HERO-01",
    order: 1,
    driverSlug: "management",
    driverNamePt: "Gestão & Liderança",
    driverNameEn: "Management",
    pillarCode: "R",
    pillarLabelPt: "R · Relações e Liderança",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroManagement,
    visualHeadlineCaptionPt:
      "Liderança com Inteligência Emocional (EI), escuta ao nível dos olhos e planejamento equilibrado sem contágio de estresse gerencial.",
    thematicCorrelationPt:
      "Traduz visualmente as 3 intervenções centrais de Management no Playbook 2.0 (Daniels et al., 2017; Hodzic et al., 2018): a líder conduz o diálogo ao nível dos olhos (inteligência emocional e empatia), sobre uma linha do tempo realista e estruturada (redução do estresse gerencial e clareza de papéis).",
    uxHarmonyArchitecturePt:
      "Ponto focal humano posicionado no terço central-direito com espaço negativo arquitetônico suave nas bordas, permitindo leitura cristalina do título à esquerda e legenda sobre scrim graduado inferior.",
    hollywoodLightingSetup: {
      keyLight: "Warm Tungsten Softbox (3200K) em ângulo de 45° iluminando expressões faciais",
      fillLight: "Rebatedor difuso prateado (-1.5 EV) preservando textura natural da pele",
      rimLight: "Recorte arquitetônico Ciano/Teal suave nas bordas dos ombros e vidros",
      colorTemperatureKelvin: "3200K Key / 4800K Ambient Daylight",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65 Large Format Cinema",
      lensFocalLength: "Leica Summilux-C 35mm",
      aperture: "f/1.4 (Bokeh orgânico de fundo urbano)",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops HDR Editorial",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of an empathetic team leader in an eye-level conversation with two colleagues in a modern glass-walled architectural office with natural indoor plants, balanced project planning board on a solid oak table, Hollywood three-point studio lighting with warm 3200K tungsten key light, soft silver fill light, and subtle teal architectural rim light, shot on ARRI Alexa 65 with Leica Summilux 35mm f/1.4 lens, shallow depth of field, cinematic editorial color grading, no text or watermarks.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de uma líder empática em diálogo ao nível dos olhos com dois colegas em sala arquitetônica envidraçada com plantas naturais, cronograma equilibrado sobre mesa de carvalho maciço, iluminação de estúdio Hollywood de 3 pontos (Key Light tungstênio 3200K, Fill Light difusa prateada e Rim Light ciano sutil), câmera ARRI Alexa 65 com lente Leica Summilux 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 99,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 98,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-02",
    order: 2,
    driverSlug: "trust",
    driverNamePt: "Confiança",
    driverNameEn: "Trust",
    pillarCode: "R",
    pillarLabelPt: "R · Relações e Liderança",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroTrust,
    visualHeadlineCaptionPt:
      "Clima de Segurança Psicológica (Edmondson, 1999; Castro et al., 2022) em reunião 1:1 focada em aprendizado mútuo e transparência.",
    thematicCorrelationPt:
      "Materializa o Spotlight de Psychological Safety do Playbook 2.0: dois profissionais em mesa redonda (ausência de barreira hierárquica) analisam juntos um diagrama de fluxo de trabalho com postura aberta, simbolizando segurança para levantar problemas sem medo de culpa.",
    uxHarmonyArchitecturePt:
      "Geometria circular da mesa guia o olhar do título H1 na coluna esquerda diretamente para a interação humana na coluna direita, com tons dourados quentes que reforçam acolhimento e segurança.",
    hollywoodLightingSetup: {
      keyLight: "Golden Hour Studio Diffuser através de cortinas translúcidas laterais",
      fillLight: "Luz de preenchimento âmbar suave refletida na superfície de carvalho claro",
      rimLight: "Backlight dourado quente recortando cabelos e ombros",
      colorTemperatureKelvin: "3600K Warm Golden Studio",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "50mm Prime Cinema Lens",
      aperture: "f/1.4",
      aspectRatio: "16:9",
      dynamicRange: "14 Stops Natural Skin Tone LUT",
    },
    developmentPromptEn:
      "Hyper-realistic 8K studio photograph of a warm one-on-one psychological safety meeting at a round light-wood table in a sunlit modern studio office, a professional calmly pointing to a workflow diagram while a colleague listens with genuine respect and open posture, Hollywood three-point lighting with golden hour diffused key light and warm shoulder rim light, shot on ARRI Alexa 65 with 50mm f/1.4 prime lens, rich natural skin tones, cinematic depth of field, no text.",
    developmentPromptPt:
      "Fotografia de estúdio 8K hiper-realista de reunião 1:1 de segurança psicológica em mesa redonda de madeira clara banhada por luz solar difusa, profissional apontando serenamente para diagrama de processo enquanto a colega escuta com respeito genuíno, iluminação Hollywood de 3 pontos em Golden Hour, lente 50mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 100,
      hollywoodLightingScore: 98,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 98,
    },
  },
  {
    specId: "ARGO4-HERO-03",
    order: 3,
    driverSlug: "stress",
    driverNamePt: "Estresse & Carga",
    driverNameEn: "Stress",
    pillarCode: "R_RISK",
    pillarLabelPt: "R · Risco, Saúde e Segurança",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroStress,
    visualHeadlineCaptionPt:
      "Prevenção primária e redesenho organizacional do fluxo de trabalho eliminando gargalos na origem (LaMontagne et al., 2007; Awa et al., 2010).",
    thematicCorrelationPt:
      "Em vez de retratar sofrimento ou pânico (clichê visual contraproducente em SST), apresenta a solução científica do Playbook 2.0: o ambiente ergonomicamente saneado onde o redesenho do fluxo gera clareza, alívio coletivo e controle sobre as demandas.",
    uxHarmonyArchitecturePt:
      "Quadro branco central funciona como âncora luminosa equilibrada pelo verde biofílico à esquerda e luminária âmbar à direita, criando simetria visual com o painel de telemetria NR-1.",
    hollywoodLightingSetup: {
      keyLight: "Biophilic Daylight Softbox (4800K) vinda da esquadria arquitetônica lateral",
      fillLight: "Difusão zenital uniforme eliminando sombras duras de tensão",
      rimLight: "Abajur arquitetônico âmbar quente (2700K) ao fundo criando profundidade espacial",
      colorTemperatureKelvin: "4800K Balanced Daylight + 2700K Practical Accent",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm f/1.4 Wide Cinema",
      aperture: "f/2.0",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Soothing Editorial Grade",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of a calm, ergonomically redesigned architectural workspace where a small team reviews a clean, uncluttered workflow board with serene confidence and relief, Hollywood studio lighting with balanced 4800K biophilic daylight key light, soft amber accent lamp, and gentle rim separation eliminating harsh shadows, shot on ARRI Alexa 65 with 35mm f/1.4 lens, high dynamic range, soothing editorial palette, no text.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de espaço de trabalho arquitetônico redesenhado onde uma equipe revisa um quadro de fluxo descongestionado com serenidade e alívio, iluminação de estúdio Hollywood 4800K combinada com luminária âmbar suave sem sombras duras, lente 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 98,
      hollywoodLightingScore: 98,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 97,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-04",
    order: 4,
    driverSlug: "support",
    driverNamePt: "Suporte & Recursos",
    driverNameEn: "Support",
    pillarCode: "R",
    pillarLabelPt: "R · Relações e Liderança",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroSupport,
    visualHeadlineCaptionPt:
      "Liderança pró-social (Alan et al., 2023), mentoria técnica entre pares e suporte instrumental direto na atividade real.",
    thematicCorrelationPt:
      "Retrata o suporte instrumental e relacional no trabalho real (NR-17 + Playbook 2.0): dois colegas experientes apoiam ativamente uma profissional na bancada de engenharia, fornecendo recursos técnicos e segurança psicológica.",
    uxHarmonyArchitecturePt:
      "Triangulação clássica de cinema convergente para a peça mecânica no centro da bancada, harmonizando a densidade técnica da imagem com a tipografia limpa da coluna esquerda.",
    hollywoodLightingSetup: {
      keyLight: "Three-Point Hollywood Octabox lateral de alta difusão",
      fillLight: "Luz rebatida sobre a bancada de madeira aquecendo os rostos",
      rimLight: "Halo dourado de contraluz destacando os gestos colaborativos das mãos",
      colorTemperatureKelvin: "4200K Warm Studio Neutral",
    },
    cameraOpticsSpec: {
      cameraBody: "Leica SL2-S / Cinema Rig",
      lensFocalLength: "Leica Summilux 35mm",
      aperture: "f/1.4",
      aspectRatio: "16:9",
      dynamicRange: "14 Stops Crisp Micro-Contrast",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of prosocial leadership and peer support at a modern engineering and design workbench, two senior colleagues collaboratively guiding and assisting a teammate with warm camaraderie and shared focus, Hollywood three-point softbox key light with a warm golden rim halo highlighting collaborative hand gestures, shot on Leica Summilux 35mm f/1.4 lens, rich organic textures, cinema grade, no text.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de liderança pró-social e suporte entre pares em bancada moderna de engenharia, dois colegas seniores apoiando colaborativamente uma integrante da equipe com camaradagem e foco compartilhado, iluminação Hollywood de 3 pontos com halo dourado de recorte, lente Leica Summilux 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 99,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 98,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 98,
    },
  },
  {
    specId: "ARGO4-HERO-05",
    order: 5,
    driverSlug: "energy",
    driverNamePt: "Energia & Recuperação",
    driverNameEn: "Energy",
    pillarCode: "V",
    pillarLabelPt: "V · Variedade e Realização",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroEnergy,
    visualHeadlineCaptionPt:
      "Infraestrutura estrutural de recuperação biopsicossocial e pausas protegidas antes de intervenções individuais isoladas (Fleming, 2024).",
    thematicCorrelationPt:
      "Ilustra a descoberta central de Fleming (2024) destacada no Playbook 2.0: a vitalidade nasce de condições estruturais de trabalho (pausas reais protegidas, ambiente biofílico restaurador e desconexão de telas), não de aplicativos isolados em ambientes exaustivos.",
    uxHarmonyArchitecturePt:
      "Linhas verticais das brises de madeira à esquerda criam transição rítmica perfeita a partir da coluna tipográfica do Hero, enquanto a folhagem esmeralda ancora a paleta do Pilar V (Vitalidade).",
    hollywoodLightingSetup: {
      keyLight: "Luz solar matinal de estúdio atravessando brises arquitetônicos de madeira",
      fillLight: "Reflexão difusa em pedra travertino natural",
      rimLight: "Brilho de recorte esmeralda e dourado nas folhagens e silhuetas",
      colorTemperatureKelvin: "5000K Crisp Morning Sun",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm Prime",
      aperture: "f/2.0",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Biophilic Architectural LUT",
    },
    developmentPromptEn:
      "Hyper-realistic 8K architectural and human photograph of a biophilic workplace recovery lounge filled with lush indoor foliage, natural travertine stone, and warm timber, two professionals taking a restorative break with herbal tea away from digital screens, Hollywood studio lighting simulating crisp morning sunlight streaming through floor-to-ceiling louvers with emerald and warm gold rim highlights, 35mm f/1.4 cinema lens, no text.",
    developmentPromptPt:
      "Fotografia arquitetônica e humana hiper-realista 8K de lounge biofílico de recuperação no trabalho com vegetação exuberante, pedra travertino e madeira natural, dois profissionais em pausa restauradora longe de telas digitais, iluminação de estúdio Hollywood simulando sol matinal através de brises, lente 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 100,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-06",
    order: 6,
    driverSlug: "inclusion_belonging",
    driverNamePt: "Inclusão & Pertencimento",
    driverNameEn: "Inclusion & Belonging",
    pillarCode: "R",
    pillarLabelPt: "R · Relações e Liderança",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroInclusion,
    visualHeadlineCaptionPt:
      "Tríade Diversidade, Inclusão Decisória e Pertencimento Autêntico com voz ativa na governança (Shore et al., 2011).",
    thematicCorrelationPt:
      "Conecta a distinção conceitual do Playbook 2.0 entre Diversidade (quem está na mesa), Inclusão (quem tem voz ativa e poder decisório) e Pertencimento (sentir-se valorizado em sua autenticidade).",
    uxHarmonyArchitecturePt:
      "Perspectiva simétrica de ponto de fuga central na cabeceira da mesa, proporcionando equilíbrio clássico de estúdio com o bloco tipográfico da esquerda.",
    hollywoodLightingSetup: {
      keyLight: "Wrap-Around Hollywood Soft Key garantindo fidelidade cromática a todos os tons de pele",
      fillLight: "Luz ambiente crepuscular azul-safira através da fachada curva de vidro",
      rimLight: "Sanca arquitetônica quente (3000K) recortando o topo da cena",
      colorTemperatureKelvin: "4000K True-Skin Studio Key / 6500K Twilight Window",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm Anamorphic-Style Spherical",
      aperture: "f/1.8",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Colorimetric Skin Fidelity",
    },
    developmentPromptEn:
      "Hyper-realistic 8K studio photograph of a diverse executive and operational team across generations, genders, and backgrounds seated at a modern architectural conference table, a woman in the center actively presenting an idea while every colleague listens with authentic engagement and belonging, Hollywood wrap-around soft key lighting with true-to-life skin tone fidelity and warm rim separation, ARRI Alexa 65 35mm f/1.4, no text.",
    developmentPromptPt:
      "Fotografia de estúdio 8K hiper-realista de equipe diversa entre gerações, gêneros e origens reunida em mesa de conferência arquitetônica, uma profissional ao centro apresentando uma ideia enquanto todos ouvem com engajamento autêntico e pertencimento, iluminação Hollywood wrap-around de alta fidelidade cromática, ARRI Alexa 65 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 99,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-07",
    order: 7,
    driverSlug: "compensation",
    driverNamePt: "Remuneração & Justiça",
    driverNameEn: "Compensation",
    pillarCode: "E",
    pillarLabelPt: "E · Remuneração e Benefícios",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroCompensation,
    visualHeadlineCaptionPt:
      "Salário digno (Living Wage), transparência de faixas de progressão e justiça processual (Burmaster et al., 2015; Obloj & Zenger, 2022).",
    thematicCorrelationPt:
      "Traduz visualmente a transparência remuneratória e a clareza de critérios de progressão salarial por meio do painel de vidro translúcido inspecionado em conjunto com confiança e equidade.",
    uxHarmonyArchitecturePt:
      "A diagonal do painel de vidro cria profundidade tridimensional e conversa diretamente com a estética de precisão Linear/Stripe do sistema de design.",
    hollywoodLightingSetup: {
      keyLight: "Precision Architectural Key Light (5200K) lateral",
      fillLight: "Reflexão quente dos painéis de carvalho e bronze escovado",
      rimLight: "Refração luminosa nas bordas do cristal translúcido",
      colorTemperatureKelvin: "5200K Crisp Neutral + 3200K Bronze Warmth",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm f/1.4",
      aperture: "f/1.8",
      aspectRatio: "16:9",
      dynamicRange: "14 Stops Architectural Precision",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of a transparent modern governance room where two professionals review a sleek glass display showing clear equitable career progression bands and living wage benchmarks with expressions of fairness and institutional trust, precision Hollywood architectural studio lighting with 5200K neutral key light and warm brushed bronze metallic rim reflections, 35mm f/1.4 lens, no text.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de sala moderna de governança transparente onde dois profissionais analisam um painel de vidro exibindo faixas equitativas de progressão de carreira e referências de salário digno com expressões de confiança institucional, iluminação de estúdio Hollywood 5200K com reflexos em bronze escovado, lente 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 98,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 98,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-08",
    order: 8,
    driverSlug: "flexibility",
    driverNamePt: "Flexibilidade",
    driverNameEn: "Flexibility",
    pillarCode: "I",
    pillarLabelPt: "I · Independência e Flexibilidade",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroFlexibility,
    visualHeadlineCaptionPt:
      "Trabalho híbrido equilibrado (Choudhury et al., 2024) aliado às 3 salvaguardas do Playbook 2.0: ergonomia, colaboração e desconexão digital.",
    thematicCorrelationPt:
      "Captura simultaneamente a estação ergonômica (monitor elevado em braço articulado, cadeira postural, iluminação dedicada) e o ato simbólico de fechar o notebook no fim da jornada (direito à desconexão digital).",
    uxHarmonyArchitecturePt:
      "O gesto da mão fechando o notebook ao centro conecta a narrativa de proteção contra a jornada infinita ao título principal da página.",
    hollywoodLightingSetup: {
      keyLight: "Soft Natural Window Key Light em fim de tarde urbano",
      fillLight: "Luminária de mesa arquitetônica + Task Light de monitor (3500K)",
      rimLight: "Contraluz dourada vespertina recortando o perfil da profissional",
      colorTemperatureKelvin: "4500K Window Key / 3400K Task Lamp",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa Mini LF",
      lensFocalLength: "35mm Cinema Prime",
      aperture: "f/1.4",
      aspectRatio: "16:9",
      dynamicRange: "14 Stops Dual-Zone Lighting",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of a state-of-the-art ergonomic hybrid workstation with an eye-level monitor, sculptural ergonomic chair, natural daylight window, and a professional calmly closing a laptop at the end of the workday to honor digital disconnection, Hollywood dual-zone studio lighting combining soft natural window key light with a warm architectural desk lamp rim glow, 35mm f/1.4 cinema lens, no text.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de estação de trabalho híbrida ergonômica com monitor na altura dos olhos, cadeira ergonômica escultural, luz natural de janela e profissional fechando serenamente o notebook ao final do expediente em respeito à desconexão digital, iluminação Hollywood dual-zone, lente 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 100,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 98,
      uxExErgonomicsScore: 99,
      wcagContrastScore: 98,
    },
  },
  {
    specId: "ARGO4-HERO-09",
    order: 9,
    driverSlug: "learning",
    driverNamePt: "Aprendizagem",
    driverNameEn: "Learning",
    pillarCode: "D",
    pillarLabelPt: "D · Desenvolvimento e Segurança",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroLearning,
    visualHeadlineCaptionPt:
      "Aprendizagem integrada à rotina real com análise prévia de necessidades, mentoria prática e autonomia para transferir conhecimento.",
    thematicCorrelationPt:
      "Representa a aprendizagem situada na atividade real (e não treinamentos genéricos desconectados): mentor e especialista analisam juntos maquete e planta técnica sob foco luminoso de estúdio.",
    uxHarmonyArchitecturePt:
      "Fundo escuro de estúdio (*low-key chiaroscuro*) faz a maquete iluminada e as mãos em cooperação saltarem com contraste dramático de cinema.",
    hollywoodLightingSetup: {
      keyLight: "Focused Overhead Studio Pendant (3800K) sobre a maquete e plantas",
      fillLight: "Reflexão quente do papel técnico e madeira sobre os rostos",
      rimLight: "Recorte azul-cobalto dramático no plano de fundo escuro",
      colorTemperatureKelvin: "3800K Focused Key / 6000K Cobalt Rim",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "50mm f/1.4",
      aperture: "f/1.4",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Chiaroscuro Studio",
    },
    developmentPromptEn:
      "Hyper-realistic 8K studio photograph of hands-on workplace learning and skill mastery, an experienced mentor and a young specialist examining a precision three-dimensional architectural model and technical blueprints together at an illuminated studio table, Hollywood focused overhead key light with dramatic cobalt and warm amber rim lighting on hands and faces, ARRI Alexa 65 50mm f/1.4, shallow depth of field, no text.",
    developmentPromptPt:
      "Fotografia de estúdio 8K hiper-realista de aprendizagem prática no trabalho e maestria técnica, mentor experiente e jovem especialista examinando juntos uma maquete arquitetônica de precisão e plantas técnicas em mesa iluminada, iluminação Hollywood zenital focada com recorte azul-cobalto e âmbar, ARRI Alexa 65 50mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 99,
      hollywoodLightingScore: 100,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 100,
    },
  },
  {
    specId: "ARGO4-HERO-10",
    order: 10,
    driverSlug: "purpose",
    driverNamePt: "Propósito & Sentido",
    driverNameEn: "Purpose",
    pillarCode: "V",
    pillarLabelPt: "V · Variedade e Realização",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroPurpose,
    visualHeadlineCaptionPt:
      "Tradução da missão abstrata em marcos concretos (Carton, 2018) e conexão tangível com os beneficiários reais do trabalho (Allan et al., 2018).",
    thematicCorrelationPt:
      "Reúne profissionais de diferentes áreas (incluindo saúde e engenharia) ao redor da maquete física de um complexo comunitário/hospitalar, materializando o impacto humano concreto do trabalho cotidiano.",
    uxHarmonyArchitecturePt:
      "Base iluminada da maquete atua como linha de horizonte dourada que equilibra o peso tipográfico da coluna esquerda na faixa Hero.",
    hollywoodLightingSetup: {
      keyLight: "Atmospheric Golden Key Light atravessando o átrio de vidro",
      fillLight: "Iluminação ascendente quente embutida no plinto da maquete",
      rimLight: "Contraluz volumétrica dourada contornando toda a equipe",
      colorTemperatureKelvin: "3500K Golden Volumetric Studio",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm f/1.4",
      aperture: "f/1.8",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Epic Editorial",
    },
    developmentPromptEn:
      "Hyper-realistic 8K cinematic photograph of a multidisciplinary team standing in a modern glass atrium looking at a tangible physical model of a community hospital and sustainable housing project their daily work builds, expressions of deep meaning and collective pride, Hollywood studio lighting with atmospheric golden key light and volumetric rim illumination, 35mm f/1.4 lens, editorial film look, no text.",
    developmentPromptPt:
      "Fotografia cinematográfica 8K hiper-realista de equipe multidisciplinar em átrio moderno de vidro contemplando a maquete física de um hospital comunitário e projeto sustentável construído pelo seu trabalho diário, expressões de significado e orgulho coletivo, iluminação Hollywood dourada volumétrica, lente 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 100,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 98,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-11",
    order: 11,
    driverSlug: "appreciation",
    driverNamePt: "Reconhecimento",
    driverNameEn: "Appreciation",
    pillarCode: "R",
    pillarLabelPt: "R · Relações e Liderança",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroAppreciation,
    visualHeadlineCaptionPt:
      "Protocolo SAGE (Específico, Apropriado, Genuíno e Equitativo) aliado ao Quociente de Decência (DQ) nas relações diárias.",
    thematicCorrelationPt:
      "Ilustra o Spotlight SAGE e os casos práticos do Playbook 2.0 (White, 2016; Grant & Gino, 2010): o reconhecimento mais potente é específico, oportuno, genuíno e humano (nota escrita dedicada), respeitando o Invariante 12 (zero confete ou gamificação artificial).",
    uxHarmonyArchitecturePt:
      "Composição de retrato editorial em plano médio onde o cartão manuscrito ao centro conecta os olhares da equipe e ancora a leitura emocional do Hero.",
    hollywoodLightingSetup: {
      keyLight: "Hollywood Warm Portrait Key Light lateral através de janelas industriais",
      fillLight: "Soft Fill difuso preservando microexpressões autênticas",
      rimLight: "Backlight dourado quente recortando cabelos e ombros",
      colorTemperatureKelvin: "3700K Warm Portrait Studio",
    },
    cameraOpticsSpec: {
      cameraBody: "Leica SL2-S Cinema",
      lensFocalLength: "Leica APO-Summicron 50mm",
      aperture: "f/1.4",
      aspectRatio: "16:9",
      dynamicRange: "14 Stops Portrait Film Stock",
    },
    developmentPromptEn:
      "Hyper-realistic 8K studio portrait photograph of genuine, dignified peer recognition in a refined workplace studio, a colleague handing a thoughtful handwritten appreciation card to a teammate during a small team huddle with sincere smiles and mutual decency, Hollywood warm portrait key light with soft fill and subtle golden backlight, Leica 50mm f/1.4 lens, authentic human micro-expressions, no confetti, no text.",
    developmentPromptPt:
      "Retrato de estúdio 8K hiper-realista de reconhecimento genuíno e digno entre pares no ambiente de trabalho, colega entregando cartão manuscrito de agradecimento específico durante reunião de equipe com sorrisos sinceros e decência mútua, iluminação Hollywood de retrato quente com contraluz dourada, lente Leica 50mm f/1.4, sem confete.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 100,
      hollywoodLightingScore: 98,
      typographicHarmonyScore: 98,
      uxExErgonomicsScore: 99,
      wcagContrastScore: 98,
    },
  },
  {
    specId: "ARGO4-HERO-12",
    order: 12,
    driverSlug: "achievement",
    driverNamePt: "Realização",
    driverNameEn: "Achievement",
    pillarCode: "D",
    pillarLabelPt: "D · Desenvolvimento e Segurança",
    isNewInPlaybook2: false,
    isRoadmap2026: false,
    heroImageUrl: heroAchievement,
    visualHeadlineCaptionPt:
      "Metas específicas e cooperativas (Locke & Latham, 2019), visibilidade do progresso diário e co-design das avaliações.",
    thematicCorrelationPt:
      "Mostra a realização através de metas cooperativas (e não competição predatória entre colegas, conforme alerta do Playbook 2.0): quatro especialistas celebram o encaixe da peça final de um protótipo robótico construído em conjunto.",
    uxHarmonyArchitecturePt:
      "Contraste dramático de oficina de alta tecnologia com luz quente de celebração no canto superior esquerdo apontando para o centro da conquista coletiva.",
    hollywoodLightingSetup: {
      keyLight: "High-Contrast Studio Key Light direcional sobre o protótipo metálico",
      fillLight: "Luz quente rebatida na bancada iluminando os sorrisos da equipe",
      rimLight: "Spot âmbar cinematográfico no canto superior esquerdo criando halo de conquista",
      colorTemperatureKelvin: "3400K Celebratory Tungsten + 5000K Specular Metal",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm f/1.4",
      aperture: "f/1.8",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops High-Contrast Studio",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of a collaborative engineering and design team placing the final precision component onto a completed prototype on a studio workbench, expressions of shared mastery and goal accomplishment, Hollywood high-contrast studio key light with warm celebratory rim lighting and crisp metallic reflections, shot on ARRI Alexa 65 with 35mm f/1.4 lens, no text.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de equipe colaborativa de engenharia e design encaixando o componente final de precisão em um protótipo concluído na bancada do estúdio, expressões de maestria compartilhada e realização de metas cooperativas, iluminação Hollywood de alto contraste com recorte quente, ARRI Alexa 65 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 99,
      hollywoodLightingScore: 100,
      typographicHarmonyScore: 98,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-13",
    order: 13,
    driverSlug: "job_security",
    driverNamePt: "Segurança no Trabalho",
    driverNameEn: "Job Security",
    pillarCode: "D",
    pillarLabelPt: "D · Desenvolvimento e Segurança",
    isNewInPlaybook2: true,
    isRoadmap2026: false,
    heroImageUrl: heroSecurity,
    visualHeadlineCaptionPt:
      "Novo Driver Playbook 2.0 (60 referências): Segurança real vs. percebida (Sverke et al., 2002), mercados internos de trabalho e requalificação protegida.",
    thematicCorrelationPt:
      "Traduz visualmente o novo capítulo completo de Job Security do Playbook 2.0 (Bidwell, 2011; Cascio, 2010; De Witte, 1999): uma trilha física iluminada de mobilidade interna e requalificação dentro de uma estrutura arquitetônica robusta de madeira e aço, comunicando previsibilidade e proteção do trabalhador frente à automação.",
    uxHarmonyArchitecturePt:
      "As curvas luminosas da trilha de mobilidade interna conduzem o olhar da base esquerda para os dois protagonistas, criando harmonia visual imediata com o badge 'Novo no Playbook 2.0'.",
    hollywoodLightingSetup: {
      keyLight: "Grounding Studio Key Light (4500K) zenital-lateral",
      fillLight: "Iluminação linear quente embutida nas trilhas de mobilidade da maquete",
      rimLight: "Contraluz azul-petróleo industrial pelas janelas de estúdio ao fundo",
      colorTemperatureKelvin: "4500K Key / 3000K Pathway Glow / 6000K Industrial Rim",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm Cinema Prime",
      aperture: "f/1.6",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Architectural Depth",
    },
    developmentPromptEn:
      "Hyper-realistic 8K studio photograph representing job security and internal career mobility during technological transition, a mid-career specialist and a career advisor reviewing an illuminated architectural pathway of internal reskilling and long-term career stability in a solid timber-and-steel studio hall, Hollywood grounding 4500K key light with warm amber structural rim light, 35mm f/1.4 cinema lens, no text.",
    developmentPromptPt:
      "Fotografia de estúdio 8K hiper-realista representando segurança no trabalho e mobilidade interna de carreira durante transição tecnológica, especialista e consultor revisando uma trilha arquitetônica iluminada de requalificação interna e estabilidade em pavilhão sólido de madeira e aço, iluminação Hollywood 4500K com recorte âmbar, lente 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 100,
      hollywoodLightingScore: 100,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 99,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-14",
    order: 14,
    driverSlug: "employee_voice",
    driverNamePt: "Voz do Trabalhador",
    driverNameEn: "Employee Voice",
    pillarCode: "I",
    pillarLabelPt: "I · Independência e Flexibilidade",
    isNewInPlaybook2: true,
    isRoadmap2026: false,
    heroImageUrl: heroVoice,
    visualHeadlineCaptionPt:
      "Novo Driver Playbook 2.0: Comitês de Saúde e Bem-Estar (HaWCs), democracia no trabalho (Battilana et al., 2022) e diálogo CIPA nos 4 momentos da NR-1.",
    thematicCorrelationPt:
      "Retrata com fidelidade sociotécnica um Comitê de Saúde e Bem-Estar (HaWC) e reunião da CIPA: trabalhadores operacionais (com EPI/colete de segurança) e gestores sentados lado a lado em mesa redonda, onde uma trabalhadora operacional tem a palavra central.",
    uxHarmonyArchitecturePt:
      "O grande difusor circular de estúdio no topo e a mesa redonda na base criam um enquadramento perfeitamente centrado, reforçado pelo contraste cinema Teal & Orange nas laterais.",
    hollywoodLightingSetup: {
      keyLight: "Circular Overhead Hollywood Softbox sobre o centro do fórum participativo",
      fillLight: "Reflexão quente da mesa circular de madeira maciça",
      rimLight: "Tubos de luz cinematográficos Ciano (esquerda) e Âmbar (direita) separando planos",
      colorTemperatureKelvin: "4600K Overhead Key + Teal/Amber Cinema Rim",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm f/1.4",
      aperture: "f/1.8",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Hollywood Teal-and-Amber",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of a participatory Health and Wellbeing Committee (HaWC) and CIPA dialogue seated around a circular wooden forum table, frontline workers in safety gear and organizational managers co-designing workplace improvements with equal voice and mutual respect, Hollywood circular overhead softbox key light with crisp cyan and warm rim separation, ARRI Alexa 65 35mm f/1.4, no text.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de diálogo participativo do Comitê de Saúde e Bem-Estar (HaWC) e CIPA ao redor de mesa circular de madeira, trabalhadores operacionais e gestores co-desenhando melhorias no ambiente de trabalho com paridade de voz e respeito mútuo, iluminação Hollywood circular zenital com recorte ciano e âmbar, ARRI Alexa 65 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 100,
      hollywoodLightingScore: 100,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 99,
      wcagContrastScore: 100,
    },
  },
  {
    specId: "ARGO4-HERO-15",
    order: 15,
    driverSlug: "autonomy",
    driverNamePt: "Autonomia",
    driverNameEn: "Autonomy",
    pillarCode: "I",
    pillarLabelPt: "I · Independência e Flexibilidade",
    isNewInPlaybook2: true,
    isRoadmap2026: false,
    heroImageUrl: heroAutonomy,
    visualHeadlineCaptionPt:
      "Novo Driver Playbook 2.0: Redesenho participativo de tarefas (Kobayashi et al., 2008), controle sobre métodos/ritmo e liderança suportiva (Hardré & Reeve, 2009).",
    thematicCorrelationPt:
      "Visualiza a essência científica da autonomia sem abandono gerencial: a especialista está em foco nítido no primeiro plano manipulando blocos modulares do seu processo, enquanto o líder permanece em segundo plano (bokeh suave) com postura de confiança e suporte não-intrusivo.",
    uxHarmonyArchitecturePt:
      "Profundidade de campo seletiva (f/1.4) separa nitidamente o protagonismo da trabalhadora (agência e controle do método) do suporte contextual ao fundo.",
    hollywoodLightingSetup: {
      keyLight: "Sculptural Side Key Light vinda do painel luminoso e difusor lateral",
      fillLight: "Luz ambiente neutra suave no estúdio de concreto arquitetônico",
      rimLight: "Contraluz limpa contornando o perfil e os blocos hexagonais de vidro",
      colorTemperatureKelvin: "5000K Clean Architectural Studio",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "50mm f/1.4 Prime",
      aperture: "f/1.4 (Separação óptica de planos)",
      aspectRatio: "16:9",
      dynamicRange: "14 Stops Precision Glass Contrast",
    },
    developmentPromptEn:
      "Hyper-realistic 8K studio photograph of a skilled specialist autonomously arranging modular process blocks on a tactile glass workflow board to customize work methods and pace, while a supportive leader observes respectfully in the softly blurred background, Hollywood sculptural side key light with clean architectural rim lighting emphasizing human agency, 50mm f/1.4 lens, no text.",
    developmentPromptPt:
      "Fotografia de estúdio 8K hiper-realista de especialista organizando com autonomia blocos modulares de processo em quadro tátil de vidro para calibrar métodos e ritmo de trabalho, enquanto uma liderança suportiva observa respeitosamente em segundo plano desfocado, iluminação escultural lateral Hollywood, lente 50mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 100,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-16",
    order: 16,
    driverSlug: "workload_pressures",
    driverNamePt: "Pressões de Carga",
    driverNameEn: "Workload Pressures",
    pillarCode: "R_RISK",
    pillarLabelPt: "R · Risco, Saúde e Segurança",
    isNewInPlaybook2: true,
    isRoadmap2026: false,
    heroImageUrl: heroWorkload,
    visualHeadlineCaptionPt:
      "Novo Driver Playbook 2.0: Dimensionamento realista de capacidade, reuniões curtas e intencionais (Bennett et al., 2021) e proteção de foco profundo (Schor et al., 2024).",
    thematicCorrelationPt:
      "Representa a higiene de reuniões e o dimensionamento sustentável de carga: alinhamento em pé (stand-up curto), ampulheta de tempo protegido e quadro visual de capacidade com blocos livres de sobrecarga.",
    uxHarmonyArchitecturePt:
      "Estética minimalista escandinava/arquitetônica de baixa entropia visual, reduzindo imediatamente a carga cognitiva do usuário ao abrir a página.",
    hollywoodLightingSetup: {
      keyLight: "Balanced 5000K Studio Daylight através de amplas janelas laterais",
      fillLight: "Rebatimento suave em paredes de concreto claro e piso de carvalho",
      rimLight: "Contorno luminoso natural suave sem pontos de estresse visual",
      colorTemperatureKelvin: "5000K Calm Daylight Studio",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm f/1.4",
      aperture: "f/2.2",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Soft Roll-Off",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of a calm, intentional 15-minute standing team alignment in a minimalist studio room with a subtle analog hourglass and a clean capacity planning board showing protected deep-work blocks, relaxed and focused professionals, Hollywood balanced 5000K studio daylight with soft shadow roll-off and zero visual clutter, 35mm f/1.4 cinema lens, no text.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de alinhamento curto e intencional em pé de 15 minutos em sala minimalista com ampulheta de tempo protegido e quadro limpo de planejamento de capacidade, profissionais serenos e focados, iluminação Hollywood 5000K com transição suave de sombras e zero poluição visual, lente 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 99,
      hollywoodLightingScore: 98,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 99,
      wcagContrastScore: 99,
    },
  },
  {
    specId: "ARGO4-HERO-17",
    order: 17,
    driverSlug: "leadership",
    driverNamePt: "Liderança Institucional",
    driverNameEn: "Leadership",
    pillarCode: "R",
    pillarLabelPt: "R · Relações e Liderança (Roadmap 2026)",
    isNewInPlaybook2: true,
    isRoadmap2026: true,
    releaseWindow: "Previsto no Playbook 2.0: Março/2026",
    heroImageUrl: heroLeadership,
    visualHeadlineCaptionPt:
      "Roadmap Oficial Playbook 2.0 (Março/2026): Governança executiva, alinhamento estratégico de cultura e liderança sistêmica.",
    thematicCorrelationPt:
      "Representa a governança institucional de topo integrando plantas de saúde e segurança ocupacional ao planejamento estratégico da organização (sem extrapolar intervenções ainda não publicadas pelo World Wellbeing Movement).",
    uxHarmonyArchitecturePt:
      "Contraste cinematográfico clássico entre o azul-safira profundo do crepúsculo urbano e os pendentes de tungstênio dourado sobre a mesa do conselho.",
    hollywoodLightingSetup: {
      keyLight: "Warm Tungsten Overhead Pendants (3000K) sobre as plantas estratégicas",
      fillLight: "Ambiência crepuscular azul-safira (7500K) envolvendo a sala envidraçada",
      rimLight: "Recorte dourado nos ombros e cabelos da liderança executiva",
      colorTemperatureKelvin: "3000K Tungsten Key / 7500K Sapphire Twilight",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm f/1.4",
      aperture: "f/1.6",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Twilight Cinema Grade",
    },
    developmentPromptEn:
      "Hyper-realistic 8K architectural and editorial photograph of institutional leadership in a modern glass boardroom at twilight, senior executives reviewing holistic human wellbeing and occupational safety blueprints alongside organizational strategy, dramatic Hollywood studio key light with deep sapphire twilight ambiance and warm tungsten rim light, ARRI Alexa 65 35mm f/1.4, no text.",
    developmentPromptPt:
      "Fotografia arquitetônica e editorial hiper-realista 8K de liderança institucional em sala de conselho envidraçada ao crepúsculo, executivos revisando plantas de saúde e segurança ocupacional integradas à estratégia organizacional, iluminação dramática de estúdio Hollywood com ambiência azul-safira e recorte tungstênio quente, ARRI Alexa 65 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 99,
      hollywoodLightingScore: 100,
      typographicHarmonyScore: 99,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 100,
    },
  },
  {
    specId: "ARGO4-HERO-18",
    order: 18,
    driverSlug: "operational_design",
    driverNamePt: "Design Operacional",
    driverNameEn: "Operational Design",
    pillarCode: "R_RISK",
    pillarLabelPt: "R · Risco, Saúde e Segurança (Roadmap 2026)",
    isNewInPlaybook2: true,
    isRoadmap2026: true,
    releaseWindow: "Previsto no Playbook 2.0: Abril/2026",
    heroImageUrl: heroFlexibility,
    visualHeadlineCaptionPt:
      "Roadmap Oficial Playbook 2.0 (Abril/2026): Arquitetura de turnos, ergonomia de sistemas sociotécnicos (NR-17) e desenho físico/digital de operações.",
    thematicCorrelationPt:
      "Conecta o futuro capítulo de Operational Design às 5 áreas de condições de trabalho da NR-17 (mobiliário, equipamentos, conforto acústico/térmico/iluminação e organização de turnos), preservando a trava Zero-Alucinação.",
    uxHarmonyArchitecturePt:
      "Enquadramento ergonômico de precisão com iluminação híbrida técnica e humana, mantendo 100% de resiliência visual (Zero-Broken-Image Policy).",
    hollywoodLightingSetup: {
      keyLight: "Hybrid Technical-Human Studio Key Light (4800K) sobre o posto operacional",
      fillLight: "Task Light linear direcionada sem reflexo de tela (anti-glare)",
      rimLight: "Recorte âmbar humano equilibrando a precisão técnica do equipamento",
      colorTemperatureKelvin: "4800K Technical Key / 3400K Human Rim",
    },
    cameraOpticsSpec: {
      cameraBody: "ARRI Alexa 65",
      lensFocalLength: "35mm f/1.4 Cinema Lens",
      aperture: "f/1.8",
      aspectRatio: "16:9",
      dynamicRange: "14.5 Stops Sociotechnical Studio",
    },
    developmentPromptEn:
      "Hyper-realistic 8K photograph of sociotechnical operational design, ergonomic specialists and operations engineers calibrating a state-of-the-art acoustic and ergonomic control workstation with balanced shift schedules and human-centered lighting, Hollywood hybrid studio lighting combining cool technical cyan key light with warm human focal rim lighting, 35mm f/1.4 cinema lens, no text.",
    developmentPromptPt:
      "Fotografia hiper-realista 8K de design operacional sociotécnico, especialistas em ergonomia e engenheiros de operações calibrando uma estação de controle acústica e ergonômica de estado da arte com escalas equilibradas e iluminação centrada no ser humano, iluminação híbrida de estúdio Hollywood combinando Key Light técnica e Rim Light quente, lente 35mm f/1.4.",
    totHarmonyScores: {
      invariantValid: true,
      thematicCorrelationScore: 98,
      hollywoodLightingScore: 99,
      typographicHarmonyScore: 98,
      uxExErgonomicsScore: 98,
      wcagContrastScore: 99,
    },
  },
];

export function computeHeroTotHarmonyScore(spec: Argo4DriverHeroSpec): number {
  const s = spec.totHarmonyScores;
  if (!s.invariantValid) {
    return 0;
  }
  const weighted =
    0.30 * s.thematicCorrelationScore +
    0.25 * s.hollywoodLightingScore +
    0.20 * s.typographicHarmonyScore +
    0.15 * s.uxExErgonomicsScore +
    0.10 * s.wcagContrastScore;

  return Math.round(weighted * 10) / 10;
}

export function getArgo4DriverHeroSpec(driverSlug: string): EvaluatedArgo4DriverHeroSpec {
  const found =
    ARGO4_DRIVER_HERO_SPECS.find((item) => item.driverSlug === driverSlug) ??
    ARGO4_DRIVER_HERO_SPECS[0];

  return {
    ...found,
    utilityScore: computeHeroTotHarmonyScore(found),
  };
}

export function evaluateArgo4HeroPromptCatalog(
  specs: readonly Argo4DriverHeroSpec[] = ARGO4_DRIVER_HERO_SPECS,
): Argo4HeroPromptCatalogSummary {
  const evaluatedSpecs: EvaluatedArgo4DriverHeroSpec[] = specs.map((spec) => ({
    ...spec,
    utilityScore: computeHeroTotHarmonyScore(spec),
  }));

  const totalScore = evaluatedSpecs.reduce((acc, item) => acc + item.utilityScore, 0);
  const averageHarmonyUtilityScore =
    evaluatedSpecs.length > 0
      ? Math.round((totalScore / evaluatedSpecs.length) * 10) / 10
      : 0;

  return {
    catalogId: "argo4-hollywood-8k-hero-catalog-2026",
    version: "4.0.18",
    totalSpecs: evaluatedSpecs.length,
    activeDriversCount: evaluatedSpecs.filter((s) => !s.isRoadmap2026).length,
    roadmap2026Count: evaluatedSpecs.filter((s) => s.isRoadmap2026).length,
    averageHarmonyUtilityScore,
    allInvariantsValid: evaluatedSpecs.every((s) => s.totHarmonyScores.invariantValid),
    evaluatedSpecs,
  };
}
