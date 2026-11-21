// Mecanismo puro para o registro de fontes primarias regulatorias (NR-1/NR-17
// e guias oficiais do MTE). Nao importa significado NR-1 hardcoded: apenas
// avalia integridade/prontidao dos registros declarados em src/data.
//
// "authority" separa o texto legal vinculante dos guias orientativos do MTE.
// O proprio guia do GRO afirma que nao substitui o texto legal da NR-1.

export type RegulatoryAuthority =
    | "vinculante" // texto legal (NR/Portaria) - prevalece
    | "orientativo" // guia/manual do MTE - interpretacao, nao substitui a norma
    | "instrumento_referencia"; // manual de instrumento de avaliacao

export type RegulatoryDocType = "norma" | "guia_mte" | "manual_instrumento";

export type RegulatoryLicenseStatus =
    | "dominio_publico_oficial" // publicacao oficial
    | "reproducao_autorizada_com_citacao"
    | "restrito"
    | "desconhecido";

export type RegulatorySourceRecord = {
    id: string;
    title: string;
    publisher: string;
    docType: RegulatoryDocType;
    authority: RegulatoryAuthority;
    legalReference: string | null;
    url: string | null;
    version: string | null;
    effectiveDate: string | null; // ISO ou descricao de vigencia
    sha256: string | null; // null = arquivo ainda nao versionado no repo
    licenseStatus: RegulatoryLicenseStatus;
    consultTogetherWith: string[];
    notes: string;
};

export type RegulatorySourceFlag =
    | "missing_hash"
    | "missing_url"
    | "missing_version"
    | "missing_legal_reference"
    | "license_undetermined";

export type RegulatorySourceEvaluated = RegulatorySourceRecord & {
    flags: RegulatorySourceFlag[];
    integrityArchived: boolean; // hash valido presente
    citable: boolean; // referencia legal + versao presentes
};

export type RegulatorySourceSummary = {
    total: number;
    binding: number;
    guidance: number;
    instruments: number;
    withHash: number;
    pendingHash: number;
    fullyCitable: number;
    items: RegulatorySourceEvaluated[];
    flags: RegulatorySourceFlag[];
};

const SHA256 = /^[a-f0-9]{64}$/i;

const FLAG_LABELS: Record<RegulatorySourceFlag, string> = {
    missing_hash: "Versionar o arquivo no repositorio e registrar hash SHA-256.",
    missing_url: "Registrar URL oficial ou referencia controlada.",
    missing_version: "Registrar versao, edicao ou vigencia.",
    missing_legal_reference: "Registrar a referencia legal (NR/Portaria).",
    license_undetermined: "Definir situacao de licenca/permissao de uso.",
};

export function regulatorySourceFlagLabel(flag: RegulatorySourceFlag): string {
    return FLAG_LABELS[flag];
}

export function evaluateRegulatorySources(
    records: RegulatorySourceRecord[],
): RegulatorySourceSummary {
    const items = records.map(evaluateRecord);

    return {
        total: items.length,
        binding: items.filter((item) => item.authority === "vinculante").length,
        guidance: items.filter((item) => item.authority === "orientativo").length,
        instruments: items.filter((item) => item.authority === "instrumento_referencia").length,
        withHash: items.filter((item) => item.integrityArchived).length,
        pendingHash: items.filter((item) => !item.integrityArchived).length,
        fullyCitable: items.filter((item) => item.citable).length,
        items,
        flags: unique(items.flatMap((item) => item.flags)),
    };
}

function evaluateRecord(record: RegulatorySourceRecord): RegulatorySourceEvaluated {
    const flags: RegulatorySourceFlag[] = [];
    const hasHash = Boolean(record.sha256 && SHA256.test(record.sha256));

    if (!hasHash) flags.push("missing_hash");
    if (!record.url?.trim()) flags.push("missing_url");
    if (!record.version?.trim()) flags.push("missing_version");
    if (!record.legalReference?.trim() && record.docType === "norma") {
        flags.push("missing_legal_reference");
    }
    if (record.licenseStatus === "desconhecido") flags.push("license_undetermined");

    return {
        ...record,
        flags,
        integrityArchived: hasHash,
        citable: Boolean(record.version?.trim()) && Boolean(record.legalReference?.trim() || record.url?.trim()),
    };
}

function unique<T>(values: T[]): T[] {
    return Array.from(new Set(values));
}
