import { describe, expect, it } from "vitest";
import {
  g1CommercialAuthorizationInput,
  g1CommercialAuthorizationPresentation,
  g1CommercialAuthorizationSummary,
} from "@/data/commercialAuthorization";
import {
  evaluateCommercialAuthorization,
  type CommercialAuthorizationInput,
} from "./commercialAuthorization";

function completeInput(): CommercialAuthorizationInput {
  return {
    ...g1CommercialAuthorizationInput,
    scopeAvailable: true,
    upstreamPaidAdvisoryAuthorized: true,
    price: { amount: 12000, currency: "BRL", approved: true },
    commercialOwner: { named: true, authorityRecorded: true, evidenceRef: "docs/approval.md" },
    deliveryOwner: { named: true, authorityRecorded: true, evidenceRef: "docs/delivery.md" },
    terms: { approved: true, reference: "terms-v1" },
    capacity: { confirmed: true, evidenceRef: "docs/capacity.md" },
  };
}

describe("commercial authorization", () => {
  it("keeps the current scope available but sale and paid CTA blocked", () => {
    expect(g1CommercialAuthorizationSummary.status).toBe("sale_blocked");
    expect(g1CommercialAuthorizationSummary.scopeAvailable).toBe(true);
    expect(g1CommercialAuthorizationSummary.saleBlocked).toBe(true);
    expect(g1CommercialAuthorizationSummary.saleAuthorized).toBe(false);
    expect(g1CommercialAuthorizationSummary.paidCtaEnabled).toBe(false);
    expect(g1CommercialAuthorizationPresentation.paidCtaLabel).toBeNull();
    expect(g1CommercialAuthorizationInput.commercialOwner.named).toBe(true);
    expect(g1CommercialAuthorizationInput.deliveryOwner.named).toBe(true);
    expect(g1CommercialAuthorizationInput.price.currency).toBe("BRL");
    expect(g1CommercialAuthorizationInput.price.amount).toBeNull();
    expect(g1CommercialAuthorizationInput.price.approved).toBe(false);
    expect(g1CommercialAuthorizationSummary.blockers).toEqual(
      expect.arrayContaining([
        "price_amount_missing",
        "price_not_approved",
        "commercial_owner_authority_missing",
        "delivery_owner_authority_missing",
      ]),
    );
  });

  it("authorizes sale only after upstream approval and every commercial requirement", () => {
    const result = evaluateCommercialAuthorization(completeInput());

    expect(result.status).toBe("sale_authorized");
    expect(result.saleAuthorized).toBe(true);
    expect(result.saleBlocked).toBe(false);
    expect(result.paidCtaEnabled).toBe(true);
    expect(result.blockers).toEqual([]);
  });

  it("blocks a paid CTA when price is absent even if upstream authorization is complete", () => {
    const input = completeInput();
    input.price = { amount: null, currency: "BRL", approved: true };

    const result = evaluateCommercialAuthorization(input);

    expect(result.paidCtaEnabled).toBe(false);
    expect(result.blockers).toContain("price_amount_missing");
  });

  it("preserves hard blocks for real data, remote delivery and paid pilot claims", () => {
    const result = evaluateCommercialAuthorization({
      ...completeInput(),
      realDataEnabled: true,
      remoteDeliveryEnabled: true,
      paidPilotClaimed: true,
    });

    expect(result.saleAuthorized).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining(["real_data_enabled", "remote_delivery_enabled", "paid_pilot_claimed"]),
    );
  });
});
