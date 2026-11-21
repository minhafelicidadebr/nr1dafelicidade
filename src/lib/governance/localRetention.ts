export interface RetainedStorage {
  readonly length?: number;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key?(index: number): string | null;
}

export interface RetentionPolicy {
  policyId: string;
  schemaVersion: number;
  ttlDays: number;
  maxItems: number;
}

export interface RetentionEnvelope<T> {
  schemaVersion: number;
  policyId: string;
  savedAt: string;
  expiresAt: string;
  items: T[];
}

export type RetentionDiscardReason = "expired" | "invalid" | "legacy_without_expiry";

export interface LoadRetainedItemsResult<T> {
  items: T[];
  migratedLegacy: boolean;
  envelope?: RetentionEnvelope<T>;
  discardReason?: RetentionDiscardReason;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDateMs(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function safeParse(raw: string): unknown {
  return JSON.parse(raw) as unknown;
}

export function retentionExpiry(now: Date, ttlDays: number): Date {
  return new Date(now.getTime() + ttlDays * MS_PER_DAY);
}

export function loadRetainedItems<T>(
  storage: RetainedStorage,
  key: string,
  policy: RetentionPolicy,
  options: {
    now?: Date;
    isItem: (value: unknown) => value is T;
  },
): LoadRetainedItemsResult<T> {
  const raw = storage.getItem(key);
  if (!raw) return { items: [], migratedLegacy: false };

  let parsed: unknown;
  try {
    parsed = safeParse(raw);
  } catch {
    storage.removeItem(key);
    return { items: [], migratedLegacy: false, discardReason: "invalid" };
  }

  if (Array.isArray(parsed)) {
    return {
      items: parsed.filter(options.isItem).slice(-policy.maxItems),
      migratedLegacy: true,
    };
  }

  if (!isRecord(parsed)) {
    storage.removeItem(key);
    return { items: [], migratedLegacy: false, discardReason: "invalid" };
  }

  const expiresAtMs = parseDateMs(parsed.expiresAt);
  const savedAtMs = parseDateMs(parsed.savedAt);
  const now = options.now ?? new Date();
  if (
    parsed.schemaVersion !== policy.schemaVersion ||
    typeof parsed.policyId !== "string" ||
    !Array.isArray(parsed.items) ||
    expiresAtMs === null ||
    savedAtMs === null
  ) {
    storage.removeItem(key);
    return { items: [], migratedLegacy: false, discardReason: "invalid" };
  }

  if (expiresAtMs <= now.getTime()) {
    storage.removeItem(key);
    return { items: [], migratedLegacy: false, discardReason: "expired" };
  }

  const items = parsed.items.filter(options.isItem).slice(-policy.maxItems);
  return {
    items,
    migratedLegacy: false,
    envelope: {
      schemaVersion: parsed.schemaVersion,
      policyId: parsed.policyId,
      savedAt: new Date(savedAtMs).toISOString(),
      expiresAt: new Date(expiresAtMs).toISOString(),
      items,
    },
  };
}

export function saveRetainedItems<TInput, TOutput = TInput>(
  storage: RetainedStorage,
  key: string,
  items: TInput[],
  policy: RetentionPolicy,
  options?: {
    now?: Date;
    mapItem?: (item: TInput) => TOutput | null;
  },
): RetentionEnvelope<TOutput> | null {
  const now = options?.now ?? new Date();
  const retained = items
    .map((item) => options?.mapItem ? options.mapItem(item) : (item as unknown as TOutput))
    .filter((item): item is TOutput => item !== null)
    .slice(-policy.maxItems);

  if (retained.length === 0) {
    storage.removeItem(key);
    return null;
  }

  const envelope: RetentionEnvelope<TOutput> = {
    schemaVersion: policy.schemaVersion,
    policyId: policy.policyId,
    savedAt: now.toISOString(),
    expiresAt: retentionExpiry(now, policy.ttlDays).toISOString(),
    items: retained,
  };
  storage.setItem(key, JSON.stringify(envelope));
  return envelope;
}

export function clearRetainedItems(storage: RetainedStorage, key: string): void {
  storage.removeItem(key);
}

export function pruneRetainedItems(
  storage: RetainedStorage,
  keyPrefix: string,
  policy: RetentionPolicy,
  options?: { now?: Date },
): { checked: number; removed: number } {
  if (typeof storage.length !== "number" || typeof storage.key !== "function") {
    return { checked: 0, removed: 0 };
  }

  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(keyPrefix)) keys.push(key);
  }

  let removed = 0;
  const nowMs = (options?.now ?? new Date()).getTime();

  keys.forEach((key) => {
    const raw = storage.getItem(key);
    if (!raw) return;
    let parsed: unknown;
    try {
      parsed = safeParse(raw);
    } catch {
      storage.removeItem(key);
      removed += 1;
      return;
    }

    if (Array.isArray(parsed)) {
      storage.removeItem(key);
      removed += 1;
      return;
    }

    if (!isRecord(parsed)) {
      storage.removeItem(key);
      removed += 1;
      return;
    }

    const expiresAtMs = parseDateMs(parsed.expiresAt);
    if (
      parsed.schemaVersion !== policy.schemaVersion ||
      typeof parsed.policyId !== "string" ||
      !Array.isArray(parsed.items) ||
      expiresAtMs === null ||
      expiresAtMs <= nowMs
    ) {
      storage.removeItem(key);
      removed += 1;
    }
  });

  return { checked: keys.length, removed };
}
