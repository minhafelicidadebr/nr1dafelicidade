import { describe, expect, it } from "vitest";
import { g1DesignPartnerOfferSummary } from "@/data/g1DesignPartnerOffer";
import { g1ReadinessGovernanceSprintDefinition } from "@/data/g1ReadinessGovernanceSprint";
import {
  evaluateReadinessGovernanceSprint,
  type ReadinessGovernanceSprintDefinition,
} from "./readinessGovernanceSprint";

describe("evaluateReadinessGovernanceSprint", () => {
  it("keeps the current G1 offer ready for formal review but not authorized for sale", () => {
    const result = evaluateReadinessGovernanceSprint(
      g1ReadinessGovernanceSprintDefinition,
      g1DesignPartnerOfferSummary,
    );

    expect(result.status).toBe("formal_review_required");
    expect(result.canPublishScope).toBe(true);
    expect(result.canPrepareFormalReview).toBe(true);
    expect(result.canPresentAsAuthorizedPaidOffer).toBe(false);
    expect(result.blockers).toContain("formal_paid_advisory_authorization_pending");
  });

  it("fails closed when a mandatory exclusion is removed from the offer definition", () => {
    const definition: ReadinessGovernanceSprintDefinition = {
      ...g1ReadinessGovernanceSprintDefinition,
      exclusions: g1ReadinessGovernanceSprintDefinition.exclusions.filter(
        (item) => item.key !== "personal_data_processing",
      ),
    };

    const result = evaluateReadinessGovernanceSprint(definition, {
      canPublishOfferBrief: true,
      canRequestPaidAdvisoryReview: true,
      canSellPaidAdvisory: true,
    });

    expect(result.status).toBe("blocked");
    expect(result.definitionIssues).toContain("missing_exclusion_control");
    expect(result.canPublishScope).toBe(false);
    expect(result.canPresentAsAuthorizedPaidOffer).toBe(false);
  });

  it("does not present an authorized paid offer unless the upstream offer authorizes it", () => {
    const result = evaluateReadinessGovernanceSprint(g1ReadinessGovernanceSprintDefinition, {
      canPublishOfferBrief: true,
      canRequestPaidAdvisoryReview: true,
      canSellPaidAdvisory: false,
    });

    expect(result.status).toBe("formal_review_required");
    expect(result.canPresentAsAuthorizedPaidOffer).toBe(false);
    expect(result.nextStep).toContain("Submeter preço, termos, responsáveis");
  });
});
