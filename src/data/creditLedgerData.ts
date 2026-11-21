import type { CreditLedger } from "@/lib/governance/creditLedger";

// Instancia o ledger do roadmap conforme .kiro/specs/saas-premium-launch-roadmap
// (secao Data Models). Orcamento total 130 creditos Kiro (Opus 4.8), buffer de
// contingencia ~20% (26), alocacoes por sprint no ponto medio da faixa do design.
//
// Verificacao de teto (Req 1.5): 93 (sprints) + 26 (buffer) = 119 <= 130.
//
// creditsConsumed inicia em 0: o consumo real e registrado conforme o trabalho
// avanca. Itens marcados como "external_decision" nunca consomem creditos
// (Req 1.4) e servem para tornar a classificacao explicita no ledger.
export const roadmapCreditLedger: CreditLedger = {
    totalBudget: 130,
    bufferCredits: 26,
    sprints: [
        {
            id: "S0",
            name: "Fundacao e higiene (RLS/Privacy Vault, cadastro, CI, ledger)",
            allocatedCredits: 25,
            workItems: [
                { id: "S0-1", description: "Remover politicas de public.responses", classification: "code_work", creditsConsumed: 0 },
                { id: "S0-2", description: "Restaurar EXECUTE dos helpers de autorizacao (PR #9)", classification: "code_work", creditsConsumed: 0 },
                { id: "S0-3", description: "Corrigir tela 'Criar conta e ativar'", classification: "code_work", creditsConsumed: 0 },
                { id: "S0-4", description: "Ledger minimo de orcamento/gate/go-no-go", classification: "code_work", creditsConsumed: 0 },
                { id: "S0-5", description: "Aceite formal de G1 no Ledger", classification: "external_decision", creditsConsumed: 0 },
            ],
        },
        {
            id: "S1",
            name: "Motor de Risco sai de draft",
            allocatedCredits: 17,
            workItems: [
                { id: "S1-1", description: "Consolidar e testar regras NR-1 + determinismo", classification: "code_work", creditsConsumed: 0 },
                { id: "S1-2", description: "Revisao independente e aceite do motor", classification: "external_decision", creditsConsumed: 0 },
            ],
        },
        {
            id: "S2",
            name: "Intake do Instrumento Canonico COPSOQ-BR",
            allocatedCredits: 15,
            workItems: [
                { id: "S2-1", description: "Mecanismo de intake/versionamento + fixtures", classification: "code_work", creditsConsumed: 0 },
                { id: "S2-2", description: "Licenca COPSOQ-BR e revisao do psicometrista", classification: "external_decision", creditsConsumed: 0 },
            ],
        },
        {
            id: "S3",
            name: "Geracao de PGR e documentos auditaveis",
            allocatedCredits: 16,
            workItems: [
                { id: "S3-1", description: "Geracao auditavel com rastreabilidade + k-anonimato", classification: "code_work", creditsConsumed: 0 },
            ],
        },
        {
            id: "S4",
            name: "Participacao de trabalhadores e CIPA (sintetica)",
            allocatedCredits: 10,
            workItems: [
                { id: "S4-1", description: "UI/registro de participacao com dados sinteticos", classification: "code_work", creditsConsumed: 0 },
            ],
        },
        {
            id: "S5",
            name: "Governanca comercial e LGPD (mecanismos)",
            allocatedCredits: 10,
            workItems: [
                { id: "S5-1", description: "Transicoes Design Partner->Piloto->SaaS Real + registros", classification: "code_work", creditsConsumed: 0 },
                { id: "S5-2", description: "Decisoes LGPD e nomeacoes de accountables/revisores", classification: "external_decision", creditsConsumed: 0 },
            ],
        },
    ],
    // Req 1.7: itens fora do orcamento que dependem de terceiros e bloqueiam gates.
    externalBlockers: [
        { id: "EXT-COPSOQ-LICENSE", description: "Licenca COPSOQ-BR (conteudo do instrumento)", blocksGate: "G2", resolved: false },
        { id: "EXT-REVIEWERS", description: "Nomeacao de revisores independentes (psicometrista + SST)", blocksGate: "G2", resolved: false },
        { id: "EXT-ACCOUNTABLES", description: "Nomeacao de accountables e Responsavel Tecnico Interno", blocksGate: "G3", resolved: false },
        { id: "EXT-LGPD", description: "Decisoes LGPD (controlador, operador, DPA, base legal)", blocksGate: "G3", resolved: false },
        { id: "EXT-SST-LEGAL", description: "Parecer SST/juridico NR-1/NR-17", blocksGate: "G3", resolved: false },
        { id: "EXT-ENV-AUDIT", description: "Auditoria do historico Git de .env e rotacao de credenciais", blocksGate: "G1", resolved: false },
    ],
};

export const creditLedgerLimitations = [
    "As alocacoes por sprint sao estimativas (ponto medio da faixa), nao garantias de consumo.",
    "Os 130 creditos provavelmente nao cobrem a jornada ate dados reais: G3 depende de decisoes externas.",
    "Itens 'external_decision' nao consomem creditos, mas bloqueiam a conclusao de gates.",
    "O consumo real deve ser atualizado em cada ponto go/no-go antes de liberar a proxima sprint.",
];
