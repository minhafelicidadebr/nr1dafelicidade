import { AURORA_RETENTION_NOTICE, auroraConversationRetentionPolicy } from "@/data/auroraRetentionPolicy";
import {
  clearRetainedItems,
  loadRetainedItems,
  pruneRetainedItems,
  saveRetainedItems,
  type RetainedStorage,
} from "@/lib/governance/localRetention";
import type { AuroraAnswer } from "./knowledgeBase";

export interface AuroraChatRewrite {
  summary: string;
  whyMatters: string;
}

export interface AuroraChatItem {
  id: string;
  question: string;
  answer: AuroraAnswer;
  rewrite?: AuroraChatRewrite;
  rewriting?: boolean;
  rewriteFailed?: boolean;
}

export const AURORA_PAGE_HISTORY_KEY = "strategia:page:history";
export const AURORA_ROUTE_HISTORY_PREFIX = "strategia:history:";
export const auroraRouteHistoryKey = (path: string) => `${AURORA_ROUTE_HISTORY_PREFIX}${path}`;
export { AURORA_RETENTION_NOTICE, auroraConversationRetentionPolicy };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRewrite(value: unknown): value is AuroraChatRewrite {
  return isRecord(value)
    && typeof value.summary === "string"
    && typeof value.whyMatters === "string";
}

function isAuroraAnswer(value: unknown): value is AuroraAnswer {
  return isRecord(value)
    && isStringArray(value.summary)
    && isStringArray(value.whatDataShows)
    && typeof value.whyMatters === "string"
    && typeof value.nextAction === "string"
    && isStringArray(value.sources)
    && isStringArray(value.limitations);
}

export function isAuroraChatItem(value: unknown): value is AuroraChatItem {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.question === "string"
    && isAuroraAnswer(value.answer)
    && (value.rewrite === undefined || isRewrite(value.rewrite));
}

function trimText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

export function sanitizeAuroraChatItem(item: AuroraChatItem): AuroraChatItem | null {
  if (!isAuroraChatItem(item)) return null;
  const question = trimText(item.question, 1_000);
  if (!question) return null;
  return {
    id: trimText(item.id, 160),
    question,
    answer: item.answer,
    ...(item.rewrite ? {
      rewrite: {
        summary: trimText(item.rewrite.summary, 2_000),
        whyMatters: trimText(item.rewrite.whyMatters, 2_000),
      },
    } : {}),
  };
}

export function loadAuroraHistory(
  storage: RetainedStorage,
  key: string,
  now = new Date(),
): AuroraChatItem[] {
  return loadRetainedItems(storage, key, auroraConversationRetentionPolicy, {
    now,
    isItem: isAuroraChatItem,
  }).items.map((item) => ({ ...item, rewriting: false }));
}

export function saveAuroraHistory(
  storage: RetainedStorage,
  key: string,
  items: AuroraChatItem[],
  now = new Date(),
) {
  return saveRetainedItems(storage, key, items, auroraConversationRetentionPolicy, {
    now,
    mapItem: sanitizeAuroraChatItem,
  });
}

export function clearAuroraHistory(storage: RetainedStorage, key: string): void {
  clearRetainedItems(storage, key);
}

export function pruneAuroraRouteHistories(storage: RetainedStorage, now = new Date()) {
  return pruneRetainedItems(storage, AURORA_ROUTE_HISTORY_PREFIX, auroraConversationRetentionPolicy, { now });
}
