import { describe, expect, it } from "vitest";
import type { RetainedStorage } from "@/lib/governance/localRetention";
import {
  AURORA_PAGE_HISTORY_KEY,
  auroraConversationRetentionPolicy,
  loadAuroraHistory,
  saveAuroraHistory,
  type AuroraChatItem,
} from "./chatHistory";

class MemoryStorage implements RetainedStorage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }
}

const answer = {
  summary: ["Resumo"],
  whatDataShows: ["Dado agregado"],
  whyMatters: "Importa para decisao coletiva.",
  nextAction: "Revisar com responsavel tecnico.",
  sources: ["Catalogo institucional"],
  limitations: ["Preliminar."],
};

function item(index: number): AuroraChatItem {
  return {
    id: `risk.top3-${index}`,
    question: `Pergunta ${index}`,
    answer,
    rewriting: true,
    rewriteFailed: true,
    rewrite: {
      summary: `Resumo natural ${index}`,
      whyMatters: `Por que ${index}`,
    },
  };
}

describe("Aurora chat history retention", () => {
  it("persists only bounded conversation fields under the G1 policy", () => {
    const storage = new MemoryStorage();
    const now = new Date("2026-06-29T08:00:00.000Z");
    const items = Array.from({ length: auroraConversationRetentionPolicy.maxItems + 2 }, (_, index) => item(index));

    const envelope = saveAuroraHistory(storage, AURORA_PAGE_HISTORY_KEY, items, now);
    const raw = storage.getItem(AURORA_PAGE_HISTORY_KEY);

    expect(envelope?.policyId).toBe("aurora-local-history-g1-2026-06-29");
    expect(envelope?.items).toHaveLength(auroraConversationRetentionPolicy.maxItems);
    expect(raw).not.toContain("rewriting");
    expect(raw).not.toContain("rewriteFailed");
    expect(raw).toContain("2026-07-06T08:00:00.000Z");
  });

  it("loads valid history and normalizes transient rewrite state", () => {
    const storage = new MemoryStorage();
    const now = new Date("2026-06-29T08:00:00.000Z");

    saveAuroraHistory(storage, AURORA_PAGE_HISTORY_KEY, [item(1)], now);
    const loaded = loadAuroraHistory(storage, AURORA_PAGE_HISTORY_KEY, now);

    expect(loaded).toHaveLength(1);
    expect(loaded[0].question).toBe("Pergunta 1");
    expect(loaded[0].rewrite?.summary).toBe("Resumo natural 1");
    expect(loaded[0].rewriting).toBe(false);
    expect(loaded[0].rewriteFailed).toBeUndefined();
  });

  it("discards expired Aurora history", () => {
    const storage = new MemoryStorage();

    saveAuroraHistory(storage, AURORA_PAGE_HISTORY_KEY, [item(1)], new Date("2026-06-01T00:00:00.000Z"));
    const loaded = loadAuroraHistory(storage, AURORA_PAGE_HISTORY_KEY, new Date("2026-06-09T00:00:00.000Z"));

    expect(loaded).toEqual([]);
    expect(storage.getItem(AURORA_PAGE_HISTORY_KEY)).toBeNull();
  });
});
