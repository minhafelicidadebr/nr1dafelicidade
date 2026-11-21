import { describe, expect, it } from "vitest";
import {
  g1DesignPartnerOfferContext,
  g1DesignPartnerOfferItems,
  g1DesignPartnerOfferPolicy,
} from "@/data/g1DesignPartnerOffer";
import {
  evaluateDesignPartnerOffer,
  type DesignPartnerOfferItemInput,
} from "./designPartnerOffer";

describe("G1 design partner offer", () => {
  it("prepares paid advisory review while sale and paid pilot remain blocked", () => {
    const result = evaluateDesignPartnerOffer(
      g1DesignPartnerOfferItems,
      g1DesignPartnerOfferContext,
      g1DesignPartnerOfferPolicy,
    );

    expect(result.status).toBe("paid_advisory_review_ready");
    expect(result.canPublishOfferBrief).toBe(true);
    expect(result.canRequestPaidAdvisoryReview).toBe(true);
    expect(result.canSellPaidAdvisory).toBe(false);
    expect(result.canAcceptPaidPilot).toBe(false);
    expect(result.offerBriefPct).toBe(100);
    expect(result.paidAdvisoryPct).toBe(70);
    expect(result.paidPilotPct).toBeLessThan(100);
    expect(result.nextStep?.key).toBe("paid_terms");
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        "paid_advisory_item_needs_review",
        "paid_advisory_needs_formal_approval",
        "paid_pilot_item_not_ready",
        "paid_pilot_needs_formal_approval",
      ]),
    );
  });

  it("blocks the offer brief when a required brief item is not ready", () => {
    const items: DesignPartnerOfferItemInput[] = g1DesignPartnerOfferItems.map((item) =>
      item.key === "synthetic_only_boundary" ? { ...item, status: "blocked" } : item,
    );

    const result = evaluateDesignPartnerOffer(items, g1DesignPartnerOfferContext, g1DesignPartnerOfferPolicy);

    expect(result.status).toBe("blocked");
    expect(result.canPublishOfferBrief).toBe(false);
    expect(result.nextStep?.key).toBe("synthetic_only_boundary");
    expect(result.blockers).toContain("offer_brief_item_not_ready");
  });

  it("fails closed on unsafe claims, CI, data or gate context", () => {
    const result = evaluateDesignPartnerOffer(
      g1DesignPartnerOfferItems,
      {
        realDataEnabled: true,
        gateAdvanceClaimed: true,
        publicClaimsGuardrailGreen: false,
        localCiGreen: false,
        formalPaidAdvisoryApproval: false,
        formalPaidPilotApproval: false,
        productionSaasClaimed: true,
      },
      g1DesignPartnerOfferPolicy,
    );

    expect(result.canPublishOfferBrief).toBe(false);
    expect(result.canRequestPaidAdvisoryReview).toBe(false);
    expect(result.canSellPaidAdvisory).toBe(false);
    expect(result.canAcceptPaidPilot).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        "public_claims_guardrail_not_green",
        "local_ci_not_green",
        "real_data_enabled",
        "gate_advance_claimed",
        "production_saas_claimed",
      ]),
    );
  });

  it("fails closed when a paid advisory prerequisite becomes blocked", () => {
    const items: DesignPartnerOfferItemInput[] = g1DesignPartnerOfferItems.map((item) =>
      item.key === "paid_terms" ? { ...item, status: "blocked" } : item,
    );

    const result = evaluateDesignPartnerOffer(items, g1DesignPartnerOfferContext, g1DesignPartnerOfferPolicy);

    expect(result.canPublishOfferBrief).toBe(true);
    expect(result.canRequestPaidAdvisoryReview).toBe(false);
    expect(result.canSellPaidAdvisory).toBe(false);
    expect(result.blockers).toContain("paid_advisory_item_blocked");
  });

  it("authorizes paid advisory without implicitly authorizing the paid pilot", () => {
    const items: DesignPartnerOfferItemInput[] = g1DesignPartnerOfferItems.map((item) =>
      item.requiredForPaidAdvisory ? { ...item, status: "ready" } : item,
    );

    const result = evaluateDesignPartnerOffer(
      items,
      {
        ...g1DesignPartnerOfferContext,
        formalPaidAdvisoryApproval: true,
      },
      g1DesignPartnerOfferPolicy,
    );

    expect(result.status).toBe("paid_advisory_ready");
    expect(result.canSellPaidAdvisory).toBe(true);
    expect(result.canAcceptPaidPilot).toBe(false);
    expect(result.paidAdvisoryPct).toBe(100);
  });

  it("accepts paid pilot only after all paid items and formal approval are ready", () => {
    const items: DesignPartnerOfferItemInput[] = g1DesignPartnerOfferItems.map((item) => ({
      ...item,
      status: "ready",
    }));

    const result = evaluateDesignPartnerOffer(
      items,
      {
        ...g1DesignPartnerOfferContext,
        formalPaidAdvisoryApproval: true,
        formalPaidPilotApproval: true,
      },
      g1DesignPartnerOfferPolicy,
    );

    expect(result.status).toBe("paid_pilot_ready");
    expect(result.canPublishOfferBrief).toBe(true);
    expect(result.canSellPaidAdvisory).toBe(true);
    expect(result.canAcceptPaidPilot).toBe(true);
    expect(result.paidPilotPct).toBe(100);
    expect(result.nextStep).toBeNull();
    expect(result.blockers).toEqual([]);
  });
});
