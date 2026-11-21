// @ts-nocheck -- pre-existing type errors carried over from the original project
import { runtimeDataPolicy, type DataMode } from "@/data/runtimePolicy";
import { handleSyntheticLocalSupabaseFetch } from "@/lib/runtime/syntheticPilotSession";

type RuntimeEnvironment = {
  VITE_DATA_MODE?: string;
  VITE_SUPABASE_URL?: string;
};

type DataPolicy = {
  version: string;
  gate: string;
  maximumAllowedDataMode: DataMode;
  realDataApprovalReference: string | null;
  reason: string;
};

export type DataGateStatus = {
  allowed: boolean;
  gate: string;
  policyVersion: string;
  requestedMode: DataMode;
  targetKind: "local" | "remote" | "invalid";
  reason: string;
};

export class DataGateBlockedError extends Error {
  readonly code = "REAL_DATA_GATE_BLOCKED";
  readonly status: DataGateStatus;

  constructor(status: DataGateStatus) {
    super(status.reason);
    this.name = "DataGateBlockedError";
    this.status = status;
  }
}

function requestedModeFrom(environment: RuntimeEnvironment): DataMode {
  return environment.VITE_DATA_MODE === "real" ? "real" : "synthetic";
}

export function classifyDataTarget(target: string): DataGateStatus["targetKind"] {
  try {
    const url = new URL(target);
    const hostname = url.hostname.toLowerCase();
    const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

    return localHosts.has(hostname) || hostname.endsWith(".localhost") ? "local" : "remote";
  } catch {
    return "invalid";
  }
}

export function evaluateDataGate(
  target: string,
  environment: RuntimeEnvironment,
  policy: DataPolicy = runtimeDataPolicy,
): DataGateStatus {
  const requestedMode = requestedModeFrom(environment);
  const targetKind = classifyDataTarget(target);

  if (targetKind === "invalid") {
    return {
      allowed: false,
      gate: policy.gate,
      policyVersion: policy.version,
      requestedMode,
      targetKind,
      reason: "Configuração de serviço ausente ou inválida; acesso a dados bloqueado por segurança.",
    };
  }

  if (targetKind === "local" && requestedMode === "synthetic") {
    return {
      allowed: true,
      gate: policy.gate,
      policyVersion: policy.version,
      requestedMode,
      targetKind,
      reason: "Ambiente local autorizado para dados sintéticos.",
    };
  }

  const realModeApproved =
    requestedMode === "real" &&
    policy.maximumAllowedDataMode === "real" &&
    Boolean(policy.realDataApprovalReference);

  if (targetKind === "remote" && realModeApproved) {
    return {
      allowed: true,
      gate: policy.gate,
      policyVersion: policy.version,
      requestedMode,
      targetKind,
      reason: `Dados reais autorizados por ${policy.realDataApprovalReference}.`,
    };
  }

  return {
    allowed: false,
    gate: policy.gate,
    policyVersion: policy.version,
    requestedMode,
    targetKind,
    reason: policy.reason,
  };
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

export function createDataFetch(
  fetchImplementation: typeof fetch,
  environment: RuntimeEnvironment,
  policy: DataPolicy = runtimeDataPolicy,
): typeof fetch {
  const isBrowserDefaultFetch =
    typeof globalThis.fetch === "function" &&
    fetchImplementation === globalThis.fetch;

  return async (input, init) => {
    const url = requestUrl(input);
    const status = evaluateDataGate(url, environment, policy);
    if (!status.allowed) throw new DataGateBlockedError(status);

    // Em modo sintético local no navegador, roteamos diretamente para o motor
    // determinístico sintético, evitando erros ERR_CONNECTION_REFUSED em 127.0.0.1:54321.
    if (
      isBrowserDefaultFetch &&
      status.targetKind === "local" &&
      status.requestedMode === "synthetic"
    ) {
      return handleSyntheticLocalSupabaseFetch(url, init);
    }

    try {
      return await fetchImplementation(input, init);
    } catch (error) {
      if (status.targetKind === "local" && status.requestedMode === "synthetic") {
        return handleSyntheticLocalSupabaseFetch(url, init);
      }
      throw error;
    }
  };
}

export const dataFetch = createDataFetch(globalThis.fetch, import.meta.env);

export const currentDataGateStatus = evaluateDataGate(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env,
);

