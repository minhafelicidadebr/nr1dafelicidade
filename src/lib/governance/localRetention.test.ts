import { describe, expect, it } from "vitest";
import {
  loadRetainedItems,
  pruneRetainedItems,
  saveRetainedItems,
  type RetainedStorage,
  type RetentionPolicy,
} from "./localRetention";

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

const policy: RetentionPolicy = {
  policyId: "test-policy",
  schemaVersion: 1,
  ttlDays: 7,
  maxItems: 2,
};

const isString = (value: unknown): value is string => typeof value === "string";

describe("local retention", () => {
  it("saves bounded items with an expiry envelope", () => {
    const storage = new MemoryStorage();
    const now = new Date("2026-06-29T12:00:00.000Z");

    const envelope = saveRetainedItems(storage, "history", ["a", "b", "c"], policy, { now });
    const loaded = loadRetainedItems(storage, "history", policy, { now, isItem: isString });

    expect(envelope?.items).toEqual(["b", "c"]);
    expect(envelope?.expiresAt).toBe("2026-07-06T12:00:00.000Z");
    expect(loaded.items).toEqual(["b", "c"]);
    expect(loaded.migratedLegacy).toBe(false);
  });

  it("removes expired envelopes instead of returning stale data", () => {
    const storage = new MemoryStorage();

    saveRetainedItems(storage, "history", ["a"], policy, {
      now: new Date("2026-06-01T00:00:00.000Z"),
    });
    const loaded = loadRetainedItems(storage, "history", policy, {
      now: new Date("2026-06-09T00:00:00.000Z"),
      isItem: isString,
    });

    expect(loaded.items).toEqual([]);
    expect(loaded.discardReason).toBe("expired");
    expect(storage.getItem("history")).toBeNull();
  });

  it("loads legacy arrays once so callers can rewrite them with a policy envelope", () => {
    const storage = new MemoryStorage();
    storage.setItem("history", JSON.stringify(["a", "b", "c"]));

    const loaded = loadRetainedItems(storage, "history", policy, {
      now: new Date("2026-06-29T00:00:00.000Z"),
      isItem: isString,
    });

    expect(loaded.items).toEqual(["b", "c"]);
    expect(loaded.migratedLegacy).toBe(true);
  });

  it("prunes expired, invalid and legacy keys by prefix", () => {
    const storage = new MemoryStorage();
    const now = new Date("2026-06-29T00:00:00.000Z");

    saveRetainedItems(storage, "prefix:active", ["ok"], policy, { now });
    saveRetainedItems(storage, "prefix:expired", ["old"], policy, {
      now: new Date("2026-06-01T00:00:00.000Z"),
    });
    storage.setItem("prefix:legacy", JSON.stringify(["legacy"]));
    storage.setItem("prefix:invalid", "{");
    storage.setItem("other:expired", "{");

    const result = pruneRetainedItems(storage, "prefix:", policy, { now });

    expect(result).toEqual({ checked: 4, removed: 3 });
    expect(storage.getItem("prefix:active")).not.toBeNull();
    expect(storage.getItem("prefix:expired")).toBeNull();
    expect(storage.getItem("prefix:legacy")).toBeNull();
    expect(storage.getItem("prefix:invalid")).toBeNull();
    expect(storage.getItem("other:expired")).toBe("{");
  });
});
