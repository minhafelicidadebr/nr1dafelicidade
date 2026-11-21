// Driver-specific quiz questions and flashcards

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FlashcardData {
  front: string;
  back: string;
}

interface DriverLearningContent {
  quiz: QuizQuestion[];
  flashcards: FlashcardData[];
}

export const driverLearningContent: Record<string, DriverLearningContent> = {
  management: {
    quiz: [
      { question: "Segundo o Playbook, qual é o papel mais importante do gestor para o bem-estar?", options: ["Cobrar metas agressivas", "Criar condições para autonomia, feedback e crescimento", "Centralizar todas as decisões", "Avaliar desempenho com rankings"], correctIndex: 1, explanation: "O Playbook destaca que gestores eficazes criam condições sistêmicas — autonomia, feedback contínuo e oportunidades de crescimento — em vez de controle rígido." },
      { question: "O que a pesquisa de Gallup demonstra sobre o impacto do gestor?", options: ["Gestores influenciam até 70% do engajamento da equipe", "Gestores não afetam o bem-estar", "Apenas o salário importa", "A cultura é irrelevante"], correctIndex: 0, explanation: "Gallup demonstra que o gestor direto é o fator que mais influencia o engajamento — até 70% da variação é explicada pela qualidade da gestão." },
      { question: "Qual prática de gestão está mais associada ao bem-estar sustentável?", options: ["Microgerenciamento", "One-on-ones regulares com escuta ativa", "Reuniões apenas quando há problemas", "Feedback anual formal"], correctIndex: 1, explanation: "Conversas frequentes e genuínas (one-on-ones) com escuta ativa são a prática com maior evidência de impacto no bem-estar e engajamento." },
    ],
    flashcards: [
      { front: "O que é 'liderança servidora'?", back: "Modelo onde o líder prioriza o crescimento e bem-estar da equipe, removendo obstáculos e criando condições para autonomia." },
      { front: "Qual a relação entre autonomia e bem-estar no trabalho?", back: "Autonomia é um dos 3 pilares da Teoria da Autodeterminação (Deci & Ryan). Aumenta motivação intrínseca, engajamento e satisfação." },
      { front: "O que são 'job demands' e 'job resources'?", back: "Modelo JD-R: demandas são exigências do trabalho que drenam energia; recursos são elementos que promovem crescimento e reduzem o impacto das demandas." },
      { front: "Por que feedback contínuo é melhor que avaliação anual?", back: "Feedback frequente permite correção de rota, aprendizagem contínua e fortalece a relação gestor-liderado. Avaliações anuais geram ansiedade e são pouco eficazes." },
    ],
  },
  trust: {
    quiz: [
      { question: "O que é segurança psicológica segundo Amy Edmondson?", options: ["Não ter conflitos no time", "Poder correr riscos interpessoais sem medo de punição", "Ter um ambiente fisicamente seguro", "Concordar com todas as decisões do líder"], correctIndex: 1, explanation: "Edmondson define segurança psicológica como a crença compartilhada de que o time é seguro para riscos interpessoais — errar, perguntar, discordar." },
      { question: "Segundo o Playbook, qual fator mais constrói confiança organizacional?", options: ["Bônus financeiros", "Transparência + consistência entre discurso e prática", "Regras rígidas", "Vigilância constante"], correctIndex: 1, explanation: "Confiança é construída quando há coerência entre o que se diz e o que se faz (walk the talk), combinada com transparência nas decisões." },
      { question: "O que a pesquisa de Paul Zak revela sobre confiança?", options: ["Confiança reduz produtividade", "Ocitocina media a relação entre confiança e cooperação", "Confiança só funciona em equipes pequenas", "Desconfiança motiva mais"], correctIndex: 1, explanation: "Zak demonstrou que a ocitocina — liberada em interações de confiança — facilita cooperação, empatia e desempenho em equipes." },
    ],
    flashcards: [
      { front: "O que é 'psychological safety'?", back: "Conceito de Amy Edmondson: ambiente onde pessoas podem falar, errar e discordar sem medo de humilhação ou punição." },
      { front: "Quais são os 3 pilares da confiança organizacional?", back: "Competência (capacidade), Benevolência (intenção genuína) e Integridade (coerência ética) — modelo Mayer, Davis & Schoorman." },
      { front: "Como a vulnerabilidade se conecta à confiança?", back: "Brené Brown demonstra que liderar com vulnerabilidade — admitir erros e incertezas — cria conexões autênticas e fortalece a confiança." },
      { front: "O que é 'swift trust'?", back: "Confiança rápida que surge em equipes temporárias, baseada em papéis claros e expectativas compartilhadas, não em histórico relacional." },
    ],
  },
  stress: {
    quiz: [
      { question: "Segundo o Playbook, qual a abordagem mais eficaz para reduzir estresse?", options: ["Apps de meditação individual", "Redesenhar processos e eliminar causas-raiz organizacionais", "Ignorar reclamações", "Aumentar a carga para 'fortalecer' a equipe"], correctIndex: 1, explanation: "O Playbook enfatiza que intervenções no sistema (redesign de processos, carga de trabalho, clareza de papéis) são mais eficazes que soluções individuais isoladas." },
      { question: "O que Susan David chama de 'positividade tóxica'?", options: ["Ser otimista demais", "Forçar emoções positivas e negar emoções difíceis", "Celebrar conquistas", "Praticar gratidão"], correctIndex: 1, explanation: "David alerta que negar emoções difíceis ('fique bem!') é rigidez emocional. Agilidade emocional exige processar todas as emoções como dados." },
      { question: "O que a OMS classificou como fenômeno ocupacional em 2019?", options: ["Depressão", "Burnout", "Ansiedade", "Estresse pós-traumático"], correctIndex: 1, explanation: "A OMS incluiu o burnout na CID-11 como síndrome resultante de estresse crônico no trabalho não gerenciado adequadamente." },
    ],
    flashcards: [
      { front: "Qual a diferença entre eustresse e distresse?", back: "Eustresse é estresse positivo (desafio, motivação). Distresse é estresse negativo crônico que esgota recursos e prejudica saúde e desempenho." },
      { front: "O que é o modelo 'Demand-Control' de Karasek?", back: "Modelo que prevê que alta demanda + baixo controle = alto risco de estresse. A solução é aumentar autonomia e recursos, não apenas reduzir demanda." },
      { front: "O que é 'agilidade emocional'?", back: "Conceito de Susan David: capacidade de processar emoções difíceis sem ser dominado por elas, usando-as como dados para decisões conscientes." },
      { front: "O que é 'recovery' no contexto de estresse?", back: "Processos de recuperação (descanso, desconexão, atividades prazerosas) que restauram recursos psicológicos depletados pelo trabalho." },
    ],
  },
  support: {
    quiz: [
      { question: "Segundo o estudo de Harvard (Waldinger), qual o fator mais importante para uma vida boa?", options: ["Riqueza financeira", "Relações de qualidade", "Sucesso profissional", "Saúde física perfeita"], correctIndex: 1, explanation: "O Harvard Study of Adult Development (75+ anos) demonstra que relações de qualidade são o preditor mais forte de saúde e felicidade ao longo da vida." },
      { question: "O que o Playbook recomenda como suporte organizacional eficaz?", options: ["Apenas plano de saúde", "Suporte emocional + instrumental + informacional integrados", "Nenhum suporte especial", "Suporte apenas para alta liderança"], correctIndex: 1, explanation: "O suporte eficaz é multidimensional: emocional (escuta), instrumental (recursos), informacional (acesso a conhecimento) — integrados ao design do trabalho." },
      { question: "O que Elizabeth Dunn demonstra sobre generosidade e bem-estar?", options: ["Generosidade reduz bem-estar", "Gastar com outros gera mais felicidade que gastar consigo", "Generosidade não tem efeito", "Só funciona com valores altos"], correctIndex: 1, explanation: "Dunn prova que gasto pró-social (com outros) gera mais felicidade que gasto pessoal, especialmente quando há conexão, escolha e impacto visível." },
    ],
    flashcards: [
      { front: "Quais são os 3 tipos de suporte social?", back: "Emocional (empatia e escuta), Instrumental (recursos tangíveis e ajuda prática), Informacional (orientação e compartilhamento de conhecimento)." },
      { front: "O que é 'buffer effect' do suporte social?", back: "Efeito protetor: o suporte social amortece o impacto negativo do estresse sobre a saúde, funcionando como um 'colchão' emocional e prático." },
      { front: "O que Guy Winch chama de 'higiene emocional'?", back: "Prática de cuidar de feridas psicológicas (solidão, fracasso, ruminação) com a mesma atenção que damos a feridas físicas." },
      { front: "Qual a relação entre suporte social e desempenho?", back: "Suporte adequado aumenta engajamento, reduz absenteísmo e fortalece a capacidade de enfrentar desafios — é infraestrutura de performance." },
    ],
  },
  energy: {
    quiz: [
      { question: "Segundo o Playbook, o que é 'energia' no contexto do trabalho?", options: ["Apenas sono adequado", "Capacidade renovável que depende de recuperação física, emocional e cognitiva", "Consumo de cafeína", "Trabalhar sem parar"], correctIndex: 1, explanation: "Energia no trabalho é multidimensional — física, emocional, cognitiva — e precisa de ciclos de recuperação para ser sustentável." },
      { question: "O que Wendy Suzuki demonstra sobre exercício e cérebro?", options: ["Exercício só melhora o corpo", "Exercício promove neurogênese e melhora humor, foco e memória", "Exercício não afeta cognição", "Só funciona com exercício intenso"], correctIndex: 1, explanation: "Suzuki prova que exercício regular promove neurogênese no hipocampo, melhora humor, atenção e protege contra neurodegeneração." },
      { question: "O que Matthieu Ricard argumenta sobre felicidade e treino mental?", options: ["Felicidade é genética", "Felicidade é treinável como um músculo via meditação", "Felicidade depende das circunstâncias", "Não há base científica"], correctIndex: 1, explanation: "Ricard, com base em pesquisas com meditadores, demonstra que a felicidade é uma habilidade que pode ser desenvolvida com treino mental sistemático." },
    ],
    flashcards: [
      { front: "O que é o 'ritmo ultradiano'?", back: "Ciclos naturais de 90-120 minutos de energia seguidos de 20 minutos de recuperação. Ignorar esses ciclos leva ao esgotamento." },
      { front: "Quais são as 4 dimensões de energia segundo Loehr & Schwartz?", back: "Física (sono, exercício, nutrição), Emocional (positividade, conexão), Mental (foco, criatividade) e Espiritual (propósito, valores)." },
      { front: "O que é 'detachment psicológico'?", back: "Capacidade de se desconectar mentalmente do trabalho durante o descanso — essencial para a recuperação de recursos cognitivos e emocionais." },
      { front: "Por que pausas estratégicas aumentam produtividade?", back: "O cérebro consolida aprendizados e restaura atenção durante pausas. Trabalho contínuo sem pausa degrada progressivamente o desempenho." },
    ],
  },
  inclusion_belonging: {
    quiz: [
      { question: "O que Jamil Zaki demonstra sobre empatia?", options: ["Empatia é fixa", "Empatia é treinável como um músculo", "Empatia é irrelevante no trabalho", "Empatia enfraquece líderes"], correctIndex: 1, explanation: "Zaki prova que empatia não é um traço fixo — é uma habilidade que pode ser fortalecida com prática intencional, como um músculo." },
      { question: "Segundo o Playbook, inclusão eficaz vai além de:", options: ["Diversidade demográfica apenas — precisa incluir pertencimento e equidade", "Políticas formais", "Treinamentos anuais", "Todas acima"], correctIndex: 0, explanation: "Inclusão real requer que pessoas diversas sintam pertencimento genuíno e tenham acesso equitativo a oportunidades — não basta representação." },
      { question: "O que Andrew Solomon demonstra sobre adversidade e identidade?", options: ["Adversidade sempre é negativa", "Forjar sentido a partir da adversidade constrói identidade e resiliência", "Devemos evitar falar sobre adversidade", "Identidade é irrelevante"], correctIndex: 1, explanation: "Solomon mostra que o processo de criar significado a partir de experiências difíceis fortalece a identidade e a capacidade de pertencer." },
    ],
    flashcards: [
      { front: "Qual a diferença entre diversidade e inclusão?", back: "Diversidade é ter pessoas diferentes na organização. Inclusão é garantir que todas se sintam valorizadas, ouvidas e com oportunidades equitativas." },
      { front: "O que é 'belonging' (pertencimento)?", back: "Sensação de ser aceito, valorizado e seguro para ser autêntico em um grupo. É o resultado emocional de uma cultura verdadeiramente inclusiva." },
      { front: "O que Karen Armstrong propõe sobre compaixão?", back: "Compaixão como determinação prática de se colocar no lugar do outro — não é sentimento passivo, mas ação deliberada que cria pertencimento." },
      { front: "O que é 'interseccionalidade'?", back: "Reconhecimento de que identidades (gênero, raça, classe etc.) se sobrepõem, criando experiências únicas de privilégio ou marginalização que precisam ser consideradas." },
    ],
  },
  compensation: {
    quiz: [
      { question: "Segundo o Playbook, o que importa mais que o valor absoluto da remuneração?", options: ["Benefícios extras", "Percepção de justiça e equidade no processo", "Bônus de fim de ano", "Comparação com o mercado apenas"], correctIndex: 1, explanation: "O Playbook enfatiza que a percepção de justiça processual (como as decisões são tomadas) importa tanto ou mais que o valor absoluto." },
      { question: "O que Daniel Kahneman demonstra sobre dinheiro e felicidade?", options: ["Mais dinheiro sempre traz mais felicidade", "Acima de certo ponto, o bem-estar emocional estabiliza", "Dinheiro é irrelevante", "Felicidade é só genética"], correctIndex: 1, explanation: "Kahneman mostrou que o bem-estar emocional diário estabiliza acima de certo nível de renda — a satisfação com a vida pode continuar subindo, mas o impacto emocional diminui." },
      { question: "O que Michael Norton revela sobre gastos e felicidade?", options: ["Gastar consigo é mais satisfatório", "Gastar com outros (pró-social) gera mais felicidade", "O tipo de gasto é irrelevante", "Poupar é o único caminho"], correctIndex: 1, explanation: "Norton demonstra que gasto pró-social (com outros) produz mais felicidade que gasto pessoal, independentemente do valor." },
    ],
    flashcards: [
      { front: "O que é 'justiça distributiva'?", back: "Percepção de que os resultados (salários, promoções) são distribuídos de forma justa e proporcional à contribuição de cada pessoa." },
      { front: "O que é 'justiça processual'?", back: "Percepção de que os processos de decisão (promoções, aumentos) são transparentes, consistentes e baseados em critérios claros." },
      { front: "Qual a 'falácia do incentivo' segundo Dan Ariely?", back: "Incentivos financeiros podem reduzir motivação intrínseca e criatividade quando aplicados a tarefas cognitivas complexas — efeito 'crowding out'." },
      { front: "O que é 'pay equity' vs 'pay equality'?", back: "Equality é pagar igual para todos. Equity é pagar de forma justa considerando função, experiência e contribuição — ajustando desigualdades sistêmicas." },
    ],
  },
  flexibility: {
    quiz: [
      { question: "Segundo o Playbook, flexibilidade eficaz requer:", options: ["Trabalho remoto 100%", "Controle do colaborador sobre quando, onde e como trabalhar, com equidade", "Horários rígidos para todos", "Apenas home office sexta-feira"], correctIndex: 1, explanation: "Flexibilidade real é dar controle ao colaborador sobre tempo, local e método de trabalho — mantendo equidade entre diferentes funções e perfis." },
      { question: "O que Barry Schwartz demonstra sobre excesso de opções?", options: ["Mais opções sempre são melhores", "Excesso de opções causa paralisia e insatisfação", "Opções não afetam decisões", "Quantidade importa mais que qualidade"], correctIndex: 1, explanation: "O 'Paradoxo da Escolha' mostra que opções demais geram paralisia decisória, arrependimento e menor satisfação com a escolha feita." },
      { question: "O que Graham Hill propõe sobre minimalismo e bem-estar?", options: ["Acumular mais recursos", "Menos coisas liberam recursos para mais experiências significativas", "Minimalismo é privação", "Consumo gera felicidade"], correctIndex: 1, explanation: "Hill demonstra que simplificar (menos posses, mais espaço) libera tempo, dinheiro e energia para experiências que realmente importam." },
    ],
    flashcards: [
      { front: "O que é 'autonomia temporal'?", back: "Capacidade de controlar quando trabalhar — escolher horários que respeitem ritmos pessoais, responsabilidades e picos de energia." },
      { front: "O que é o 'paradoxo da flexibilidade'?", back: "Flexibilidade sem limites pode aumentar horas trabalhadas e dificultar desconexão. Precisa de normas claras para não virar 'always on'." },
      { front: "O que é 'boundary management'?", back: "Estratégias para gerenciar limites entre trabalho e vida pessoal — essenciais em arranjos flexíveis para evitar invasão do trabalho no descanso." },
      { front: "Por que equidade importa mais que igualdade na flexibilidade?", back: "Nem todos podem trabalhar remoto (ex: operações). Equidade significa oferecer formas diferentes de flexibilidade que valorizem todas as funções." },
    ],
  },
  learning: {
    quiz: [
      { question: "Segundo o Playbook, qual a condição essencial para aprendizagem no trabalho?", options: ["Treinamentos obrigatórios", "Transferência para o trabalho real + tempo dedicado + segurança para errar", "Apenas cursos online", "Certificações formais"], correctIndex: 1, explanation: "Aprendizagem eficaz requer transferência prática, tempo protegido para aprender e um ambiente seguro para experimentar e errar." },
      { question: "O que Csikszentmihalyi demonstra sobre 'flow' e aprendizagem?", options: ["Flow é irrelevante", "Flow ocorre quando desafio e habilidade estão equilibrados — gerando aprendizagem profunda", "Flow é apenas relaxamento", "Flow só acontece em lazer"], correctIndex: 1, explanation: "O estado de flow — equilíbrio entre desafio e habilidade — produz aprendizagem profunda, engajamento máximo e satisfação intrínseca." },
      { question: "O que a 'Teoria da Carga Cognitiva' implica para o design instrucional?", options: ["Mais informação é melhor", "Informação deve ser dosada para não sobrecarregar a memória de trabalho", "Carga cognitiva é irrelevante", "Repetição é desnecessária"], correctIndex: 1, explanation: "A memória de trabalho tem capacidade limitada. Design instrucional eficaz dosifica informação, usa multimodalidade e elimina carga extrínseca." },
    ],
    flashcards: [
      { front: "O que é 'spaced repetition'?", back: "Técnica de revisão espaçada: revisar conteúdo em intervalos crescentes para maximizar retenção na memória de longo prazo (curva de Ebbinghaus)." },
      { front: "O que é 'deliberate practice'?", back: "Prática intencional com foco em pontos fracos, feedback imediato e repetição estruturada — o caminho para expertise segundo Ericsson." },
      { front: "O que é 'transfer of learning'?", back: "Aplicação do que foi aprendido em treinamento no contexto real de trabalho. É o maior desafio de L&D — apenas 10-15% do treinamento é transferido." },
      { front: "O que é 'growth mindset' (mentalidade de crescimento)?", back: "Crença de que habilidades podem ser desenvolvidas com esforço e aprendizagem — oposto de 'fixed mindset' (talento é inato e fixo)." },
    ],
  },
  purpose: {
    quiz: [
      { question: "Segundo o Playbook, como propósito se conecta ao bem-estar?", options: ["Propósito é um luxo", "Trabalho com significado é um dos preditores mais fortes de engajamento e saúde", "Propósito só importa para líderes", "Propósito é irrelevante se o salário for bom"], correctIndex: 1, explanation: "Múltiplas pesquisas demonstram que perceber significado no trabalho está entre os preditores mais fortes de engajamento, saúde e permanência." },
      { question: "O que Martin Seligman propõe sobre os caminhos para a felicidade?", options: ["Apenas prazer", "Três caminhos: vida prazerosa, vida engajada e vida com significado", "Apenas sucesso financeiro", "Felicidade é impossível"], correctIndex: 1, explanation: "Seligman distingue 3 vidas: prazerosa (hedônica), engajada (flow) e com significado (contribuição) — a última sendo a mais sustentável." },
      { question: "O que Nic Marks questiona sobre métricas de sucesso?", options: ["PIB é a melhor métrica", "Devemos medir sucesso pelo bem-estar, não apenas pelo PIB", "Métricas são irrelevantes", "Apenas lucro importa"], correctIndex: 1, explanation: "Marks criou o Happy Planet Index questionando por que medimos progresso pelo PIB e não pelo bem-estar e sustentabilidade." },
    ],
    flashcards: [
      { front: "O que é 'eudaimonia'?", back: "Conceito aristotélico de 'florescimento' — viver de acordo com virtudes e valores, realizando o potencial humano. Vai além do prazer (hedonia)." },
      { front: "O que é 'job crafting'?", back: "Processo pelo qual o colaborador redesenha proativamente seu trabalho — tarefas, relações, percepção — para aumentar o significado." },
      { front: "Qual a diferença entre propósito pessoal e organizacional?", back: "Pessoal: 'por que eu faço o que faço'. Organizacional: 'por que a empresa existe além do lucro'. O alinhamento entre ambos potencializa o engajamento." },
      { front: "O que é 'meaningful work'?", back: "Trabalho percebido como significativo — contribui para algo maior, alinhado com valores pessoais e com impacto positivo reconhecível." },
    ],
  },
  appreciation: {
    quiz: [
      { question: "Segundo o Playbook, qual tipo de reconhecimento tem maior impacto?", options: ["Bônus financeiro trimestral", "Reconhecimento específico, oportuno e genuíno — vinculado a comportamentos", "Premiação anual genérica", "Ranking público de desempenho"], correctIndex: 1, explanation: "Reconhecimento eficaz é específico (o que a pessoa fez), oportuno (próximo ao comportamento) e genuíno (não genérico ou forçado)." },
      { question: "O que David Steindl-Rast propõe sobre gratidão?", options: ["Gratidão é resultado da felicidade", "Gratidão é causa da felicidade — ser grato nos torna felizes", "Gratidão é irrelevante no trabalho", "Gratidão é fraqueza"], correctIndex: 1, explanation: "Steindl-Rast inverte a lógica: não é a felicidade que nos torna gratos, mas a prática da gratidão que gera felicidade sustentável." },
      { question: "O que Adam Grant demonstra sobre 'doadores' nas organizações?", options: ["Doadores sempre perdem", "Doadores estratégicos criam culturas de alta performance", "Tomadores são mais eficazes", "Reciprocidade é irrelevante"], correctIndex: 1, explanation: "Grant mostra que doadores estratégicos (que ajudam sem se esgotar) criam culturas de confiança e reciprocidade que elevam o desempenho coletivo." },
    ],
    flashcards: [
      { front: "O que é 'recognition vs reward'?", back: "Reconhecimento é feedback simbólico (elogio, visibilidade). Recompensa é tangível (bônus, promoção). Ambos são necessários, mas reconhecimento genuíno tem impacto emocional maior." },
      { front: "O que é a 'espiral ascendente' de positividade?", back: "Conceito de Fredrickson: emoções positivas (gratidão, reconhecimento) ampliam o repertório cognitivo e constroem recursos duradouros — gerando mais positividade." },
      { front: "Por que reconhecimento entre pares é poderoso?", back: "Reconhecimento peer-to-peer é percebido como mais autêntico, fortalece laços horizontais e distribui a cultura de valorização além da hierarquia." },
      { front: "O que é o 'efeito Hawthorne' no reconhecimento?", back: "Pessoas melhoram desempenho quando se sentem observadas e valorizadas. O ato de prestar atenção já é uma forma de reconhecimento." },
    ],
  },
  achievement: {
    quiz: [
      { question: "Segundo o Playbook, o que define 'realização' no trabalho?", options: ["Atingir metas numéricas apenas", "Senso de progresso, domínio e contribuição para resultados significativos", "Competir e vencer colegas", "Trabalhar mais horas"], correctIndex: 1, explanation: "Realização vai além de metas: inclui senso de progresso (teoria de Amabile), domínio crescente e percepção de contribuição significativa." },
      { question: "O que Tim Ferriss propõe com o 'Fear-Setting'?", options: ["Definir apenas metas positivas", "Visualizar piores cenários para dissolver a paralisia do medo", "Evitar riscos", "Ignorar medos"], correctIndex: 1, explanation: "Ferriss adapta o estoicismo: ao detalhar o pior cenário, sua probabilidade e como preveni-lo, a paralisia do medo é substituída por ação informada." },
      { question: "O que Teresa Amabile demonstra sobre progresso e motivação?", options: ["Grandes marcos são o que motiva", "Pequenos progressos diários são o maior motivador no trabalho", "Progresso é irrelevante", "Apenas recompensas externas motivam"], correctIndex: 1, explanation: "O 'Princípio do Progresso' de Amabile mostra que pequenos avanços significativos no dia a dia são o fator mais poderoso de motivação no trabalho." },
    ],
    flashcards: [
      { front: "O que é 'self-efficacy' (autoeficácia)?", back: "Crença na própria capacidade de realizar tarefas e alcançar resultados. Conceito de Bandura: influencia esforço, persistência e resiliência." },
      { front: "O que é o 'Princípio do Progresso'?", back: "Teresa Amabile: o maior motivador no trabalho é fazer progresso significativo em algo que importa — mesmo que seja pequeno." },
      { front: "Qual a diferença entre metas de desempenho e metas de aprendizagem?", back: "Desempenho: provar competência (ex: vender X). Aprendizagem: desenvolver competência (ex: dominar nova técnica). Metas de aprendizagem são mais resilientes." },
      { front: "O que é 'collective efficacy'?", back: "Crença compartilhada de que o grupo pode alcançar resultados juntos. Prediz desempenho coletivo melhor que a soma das autoeficácias individuais." },
    ],
  },
  job_security: {
    quiz: [
      { question: "Segundo o Spotlight do Work Wellbeing Playbook 2.0, qual a diferença entre segurança real e segurança percebida no trabalho?", options: ["São exatamente a mesma coisa", "A segurança real vem de leis/contratos; a percebida é a avaliação subjetiva sobre o risco de perder o emprego e impacta fortemente a saúde mental", "Apenas a segurança contratual afeta o estresse", "A segurança percebida não sofre influência da comunicação da liderança"], correctIndex: 1, explanation: "O Playbook 2.0 (De Witte, 1999; Sverke et al., 2002) demonstra que a insegurança percebida atua como estressor crônico severo mesmo quando o contrato formal permanece ativo." },
      { question: "O que o Playbook 2.0 orienta sobre programas de bem-estar financeiro (EFWPs)?", options: ["Podem substituir aumentos salariais", "Devem ser oferecidos apenas como complemento e jamais como substituto de salários justos e dignos", "São suficientes para eliminar a insegurança no emprego", "Devem ser restritos à alta liderança"], correctIndex: 1, explanation: "O Playbook 2.0 enfatiza que educação financeira e EFWPs complementam, mas nunca substituem, uma remuneração digna e justa." },
      { question: "Como o Playbook 2.0 recomenda agir diante de ganhos de produtividade gerados por IA e automação?", options: ["Demitir imediatamente para cortar custos", "Evitar demissões priorizando mercados internos de trabalho, requalificação (upskilling/reskilling) e realocação", "Ocultar planos de automação das equipes", "Substituir efetivos por temporários sem suporte"], correctIndex: 1, explanation: "O Playbook 2.0 recomenda evitar demissões, reinvestindo ganhos tecnológicos na requalificação e em mercados internos de trabalho para preservar resiliência e confiança." },
    ],
    flashcards: [
      { front: "O que é 'Survivor Syndrome' (Síndrome do Sobrevivente) no Playbook 2.0?", back: "Queda de saúde mental, confiança e engajamento — somada à sobrecarga — vivenciada pelos trabalhadores que permanecem após demissões mal conduzidas (Kivimäki et al., 2000; Van Dierendonck & Jacobs, 2012)." },
      { front: "Como mercados internos de trabalho protegem a segurança no emprego?", back: "Ao priorizar mobilidade interna, rotação planejada de tarefas e requalificação (Bidwell, 2011), a organização reduz a incerteza de carreira e retém conhecimento tácito." },
      { front: "Qual o papel dos planos de retorno ao trabalho (Return-to-Work)?", back: "Apoiar trabalhadores que retornam de afastamento por doença, lesão ou licença parental com adaptações graduais de carga e horário (Cancelliere et al., 2016)." },
      { front: "Como integrar trabalhadores terceirizados ou temporários segundo o Playbook 2.0?", back: "Reduzir a precarização incluindo-os nos rituais e comunicações da equipe e abrindo caminhos transparentes para efetivação permanente." },
    ],
  },
  employee_voice: {
    quiz: [
      { question: "Segundo o Playbook 2.0, o que são os HaWCs (Health and Wellbeing Committees)?", options: ["Comitês exclusivos de diretores", "Pequenos grupos representativos de trabalhadores que se reúnem regularmente com a gestão para melhorar condições de trabalho", "Auditorias externas anuais", "Canais unilaterais de avisos"], correctIndex: 1, explanation: "Avaliações por RCT mostram que Comitês de Saúde e Bem-Estar (HaWCs) fortalecem a voz coletiva, melhoram condições reais e reduzem a rotatividade." },
      { question: "Qual o risco de abrir pesquisas ou canais de voz sem agir sobre os pontos levantados?", options: ["Nenhum risco", "Gera silenciamento percebido, frustração e erosão da confiança organizacional", "Aumenta automaticamente a satisfação", "Dispensa a participação da CIPA"], correctIndex: 1, explanation: "Mowbray et al. (2022) e o Playbook 2.0 alertam que mecanismos de voz puramente cosméticos ou sem devolutiva geram cinismo e desengajamento." },
      { question: "Como o driver Employee Voice se conecta ao Guia Oficial MTE 2026 (NR-1)?", options: ["Não possui relação com a NR-1", "Materializa a consulta e participação dos trabalhadores e da CIPA nos 4 momentos do GRO/PGR", "Substitui o inventário de riscos", "Aplica-se apenas a empresas de tecnologia"], correctIndex: 1, explanation: "O Guia MTE 2026 exige participação ativa dos trabalhadores na identificação de perigos, avaliação de riscos, adoção de medidas e acompanhamento." },
    ],
    flashcards: [
      { front: "O que significa 'democratizar o trabalho' segundo Battilana et al. (2022)?", back: "Compartilhar poder decisório e garantir que os trabalhadores tenham voz efetiva nas decisões que afetam sua rotina, saúde e futuro." },
      { front: "Por que o retorno ('vocês disseram, nós agimos') é indispensável na escuta?", back: "Sem devolutiva transparente sobre o que foi priorizado e por quê, a coleta de feedback perde credibilidade e reduz a participação futura." },
    ],
  },
  autonomy: {
    quiz: [
      { question: "Segundo o Playbook 2.0 e Kobayashi et al. (2008), qual abordagem de redesenho do trabalho gera melhores resultados?", options: ["Mudanças impostas de cima para baixo sem consulta", "Intervenções participativas onde os próprios trabalhadores identificam gargalos e co-desenvolvem soluções", "Aumentar scripts rígidos de controle", "Deixar a equipe sem recursos ou orientação"], correctIndex: 1, explanation: "Intervenções participativas ampliam o controle sobre o trabalho (job control), a motivação e a redução sustentada de estressores." },
      { question: "Qual a diferença entre suporte à autonomia e abandono gerencial?", options: ["Não há diferença", "Suporte à autonomia combina margem de escolha e iniciativa com clareza de objetivos, recursos e apoio do gestor", "Autonomia significa trabalhar sem metas", "Suporte à autonomia exige vigilância por câmeras"], correctIndex: 1, explanation: "Hardré & Reeve (2009) e Gillet et al. (2013) demonstram que a autonomia floresce quando o trabalhador se sente apoiado pelo gestor e pela organização." },
    ],
    flashcards: [
      { front: "Como a autonomia interage com as exigências do trabalho (Modelo Karasek / COPSOQ II)?", back: "A margem de decisão (influência no trabalho — SUB-05) atua como recurso protetor essencial frente a altas exigências quantitativas e cognitivas." },
      { front: "O que caracteriza um estilo gerencial suportivo à autonomia?", back: "Considerar a perspectiva da equipe, oferecer escolhas reais sobre métodos de execução e explicar o sentido das solicitações em vez de usar coerção." },
    ],
  },
  workload_pressures: {
    quiz: [
      { question: "Segundo o Playbook 2.0 (Bennett et al., 2021), quais práticas de reuniões reduzem a fadiga e a sobrecarga cognitiva?", options: ["Reuniões de 2 horas sem pauta", "Reuniões mais curtas (ex.: 25 min), pautas compartilhadas com antecedência e blocos protegidos sem reuniões", "Marcar reuniões no horário de almoço", "Manter câmeras e microfones abertos o dia todo"], correctIndex: 1, explanation: "Reuniões curtas e intencionais, somadas a janelas livres de interrupção, evitam a expansão artificial do trabalho (Lei de Parkinson) e preservam energia cognitiva." },
      { question: "Qual alerta o Playbook 2.0 faz sobre intervenções de redução de jornada ou prazos?", options: ["Basta cortar horas sem rever metas", "Reduzir tempo disponível sem ajustar o volume de demandas ou processos pode comprimir o ritmo e aumentar a pressão", "A carga de trabalho depende apenas da velocidade individual", "Pausas reduzem a qualidade da entrega"], correctIndex: 1, explanation: "O dimensionamento saudável exige equilibrar volume de tarefas, efetivo disponível e eliminação de burocracias desnecessárias." },
    ],
    flashcards: [
      { front: "Quais subescalas da Versão Curta do COPSOQ II monitoram diretamente as pressões de carga?", back: "SUB-01 (Exigências quantitativas) e SUB-02 (Ritmo de trabalho), cruzadas com SUB-18 (Conflito trabalho-família) e SUB-23 (Burnout)." },
      { front: "Como a Lei de Parkinson afeta a carga de trabalho em escritórios e operações?", back: "Reuniões e processos mal desenhados expandem-se para ocupar todo o tempo disponível, roubando horas da atividade-fim e forçando horas extras." },
    ],
  },
};

