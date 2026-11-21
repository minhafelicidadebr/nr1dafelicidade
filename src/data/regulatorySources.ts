import type { RegulatorySourceRecord } from "@/lib/regulatory/regulatorySources";

/**
 * Registro de fontes primarias regulatorias (jurisdicao BR).
 * Data do registro: 04/07/2026.
 *
 * Honestidade (SKILL_MESTRA §5/§11):
 * - Os textos legais (NR-1/NR-17) sao VINCULANTES e prevalecem.
 * - Os guias do MTE sao ORIENTATIVOS; o proprio guia do GRO afirma que
 *   "nao substitui o texto legal da NR-1".
 * - `sha256: null` significa que o PDF ainda NAO foi versionado no repo;
 *   nenhum hash foi inventado. Ao anexar o arquivo, calcular e registrar.
 * - URLs marcadas como null exigem confirmacao da referencia oficial.
 */
export const regulatorySourcesPolicyId = "regulatory-sources-br-2026-07-12";

export const regulatorySources: RegulatorySourceRecord[] = [
    {
        id: "NR1-GRO-2024",
        title: "NR-1 - Disposicoes Gerais e Gerenciamento de Riscos Ocupacionais (cap. 1.5 - GRO)",
        publisher: "Ministerio do Trabalho e Emprego (MTE)",
        docType: "norma",
        authority: "vinculante",
        legalReference: "Portaria MTE nº 1.419, de 27/08/2024 (altera o cap. 1.5 da NR-1)",
        url: "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1",
        version: "Texto oficial 2024, com alteracoes posteriores",
        effectiveDate: "Vigencia em 26/05/2026 (Portaria MTE nº 765, de 15/05/2025)",
        sha256: null,
        licenseStatus: "dominio_publico_oficial",
        consultTogetherWith: ["MTE-GUIA-GRO-2026", "MTE-GUIA-PSICOSSOCIAL-2025", "NR17-ERGONOMIA"],
        notes:
            "GRO passa a contemplar todos os riscos, incluindo fatores de risco psicossociais relacionados ao trabalho (subitem 1.5.3.1.4). GRO nao se aplica a insalubridade/periculosidade (NR-15/16). Introducao original do GRO: Portaria SEPRT nº 6.730, de 09/03/2020.",
    },
    {
        id: "NR17-ERGONOMIA",
        title: "NR-17 - Ergonomia (condicoes de trabalho, AEP e AET)",
        publisher: "Ministerio do Trabalho e Emprego (MTE)",
        docType: "norma",
        authority: "vinculante",
        legalReference: "NR-17 vigente (item 17.1.1.1 - cinco areas; 17.3 - avaliacao das situacoes de trabalho)",
        url: null,
        version: "Texto oficial vigente",
        effectiveDate: null,
        sha256: null,
        licenseStatus: "dominio_publico_oficial",
        consultTogetherWith: ["NR1-GRO-2024"],
        notes:
            "Cinco areas das condicoes de trabalho, incluindo organizacao do trabalho e fatores psicossociais. Metodos: Avaliacao Ergonomica Preliminar (AEP, alinhada ao GRO) e Analise Ergonomica do Trabalho (AET, situacoes do item 17.3.2, relatorio do 17.3.7).",
    },
    {
        id: "MTE-GUIA-GRO-2026",
        title: "Manual de interpretacao e aplicacao do capitulo 1.5 da NR-1 - GRO (Guia Oficial MTE 2026)",
        publisher: "MTE - Coordenacao Geral de Normatizacao e Registros / SIT",
        docType: "guia_mte",
        authority: "orientativo",
        legalReference: "Referente a Portaria MTE nº 1.419/2024",
        url: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/manuais-e-publicacoes/2026/manual_gro_pgr_da_nr_1.pdf",
        version: "Edicao 2026 (comentada)",
        effectiveDate: null,
        sha256: null,
        licenseStatus: "reproducao_autorizada_com_citacao",
        consultTogetherWith: ["NR1-GRO-2024", "MTE-GUIA-PSICOSSOCIAL-2025"],
        notes:
            "Carater orientativo: NAO substitui o texto legal da NR-1; em divergencia, prevalece o DOU. Expediente autoriza reproducao desde que citada a fonte. Base do mapa de rastreabilidade NR-1 do projeto.",
    },
    {
        id: "MTE-GUIA-PSICOSSOCIAL-2025",
        title: "Guia de informacoes sobre os Fatores de Riscos Psicossociais relacionados ao Trabalho",
        publisher: "Ministerio do Trabalho e Emprego (MTE)",
        docType: "guia_mte",
        authority: "orientativo",
        legalReference: "Complementa a NR-1 (cap. 1.5) e a NR-17",
        url: "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/guia-nr-01-revisado.pdf",
        version: "Publicado em 24/04/2025",
        effectiveDate: "24/04/2025",
        sha256: null,
        licenseStatus: "reproducao_autorizada_com_citacao",
        consultTogetherWith: ["NR1-GRO-2024", "MTE-GUIA-GRO-2026"],
        notes:
            "Deve ser consultado em conjunto com o guia do GRO. Exemplos de fatores psicossociais: sobrecarga, assedio, falta de suporte/apoio no trabalho, baixa clareza de papel, baixas recompensas, baixo controle/autonomia, eventos violentos/traumaticos, alta demanda cognitiva.",
    },
];
