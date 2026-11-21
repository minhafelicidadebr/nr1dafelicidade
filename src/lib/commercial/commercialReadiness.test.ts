import { describe, expect, it } from "vitest";
import { g1DesignPartnerOfferSummary } from "@/data/g1DesignPartnerOffer";
import { g1LeadIntakeSummary } from "@/data/g1LeadIntakeGovernance";
import { g1VendorDeliveryReadiness } from "@/data/g1VendorDeliveryReadiness";
import { evaluateCommercialReadiness } from "./commercialReadiness";

describe("commercial readiness", () => {
  it("exposes controlled discovery while keeping remote delivery and paid pilot blocked", () => {
    const result = evaluateCommercialReadiness(
      g1DesignPartnerOfferSummary,
      g1LeadIntakeSummary,
      g1VendorDeliveryReadiness,
    );

    expect(result.status).toBe("controlled_discovery_ready");
    expect(result.availableCount).toBe(2);
    expect(result.reviewReadyCount).toBe(1);
    expect(result.capabilities.filter((item) => item.status === "blocked")).toHaveLength(2);
    expect(result.capabilities.find((item) => item.key === "paid_advisory")?.status).toBe("review_ready");
    expect(result.capabilities.find((item) => item.key === "remote_delivery")?.status).toBe("blocked");
    expect(result.capabilities.find((item) => item.key === "paid_pilot")?.status).toBe("blocked");
    expect(result.nextStep).toContain("revisão Comercial/Jurídica");
  });
});
