import { describe, expect, it } from "vitest";
import {
  g1AccountableNominationPack,
  g1AccountableNominationPackContext,
  g1AccountableNominationPackPolicy,
} from "@/data/g1AccountableNominationPack";
import { evaluateAccountableNominationPack } from "./accountableNominationPack";

describe("evaluateAccountableNominationPack", () => {
  it("prepares only a blank internal template", () => {
    const result = evaluateAccountableNominationPack(
      g1AccountableNominationPack,
      g1AccountableNominationPackContext,
      g1AccountableNominationPackPolicy,
    );

    expect(result.status).toBe("blank_template_ready");
    expect(result.readyRoleCharters).toBe(9);
    expect(result.readyAgendaItems).toBe(6);
    expect(result.identityFieldsPopulated).toBe(0);
    expect(result.canPrepareInternalConvocationTemplate).toBe(true);
    expect(result.canIssueConvocation).toBe(false);
    expect(result.canNominateAccountable).toBe(false);
    expect(result.canConveneFormalReview).toBe(false);
    expect(result.canApproveGate).toBe(false);
    expect(result.canUseRealData).toBe(false);
  });

  it("rejects missing, duplicate and unknown role structures", () => {
    const roles = g1AccountableNominationPack.roles.slice(1);
    const result = evaluateAccountableNominationPack({
      ...g1AccountableNominationPack,
      roles: [roles[0], roles[0], ...roles.slice(1)],
      agenda: g1AccountableNominationPack.agenda.map((item, index) => index === 0
        ? { ...item, requiredRoleKeys: ["unknown_role"] }
        : item),
    }, g1AccountableNominationPackContext, g1AccountableNominationPackPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "required_role_missing",
      "duplicate_role",
      "agenda_role_unknown",
    ]));
    expect(result.canPrepareInternalConvocationTemplate).toBe(false);
  });

  it("rejects incomplete charters, agenda and boundaries", () => {
    const result = evaluateAccountableNominationPack({
      ...g1AccountableNominationPack,
      roles: g1AccountableNominationPack.roles.map((role, index) => index === 0
        ? { ...role, minimumAuthority: [] }
        : role),
      agenda: g1AccountableNominationPack.agenda.slice(1),
      boundaries: [],
    }, g1AccountableNominationPackContext, g1AccountableNominationPackPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "role_charter_incomplete",
      "required_agenda_item_missing",
      "boundaries_incomplete",
    ]));
  });

  it("rejects identity fields, persistence and transport in the local template", () => {
    const result = evaluateAccountableNominationPack({
      ...g1AccountableNominationPack,
      roles: g1AccountableNominationPack.roles.map((role, index) => index === 0
        ? { ...role, nomineeName: "Pessoa real" }
        : role),
    }, {
      ...g1AccountableNominationPackContext,
      persistenceEnabled: true,
      remoteTransportEnabled: true,
    }, g1AccountableNominationPackPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "identity_field_present",
      "persistence_enabled",
      "remote_transport_enabled",
    ]));
  });

  it("blocks review, gate and real-data claims", () => {
    const result = evaluateAccountableNominationPack(g1AccountableNominationPack, {
      ...g1AccountableNominationPackContext,
      formalReviewConvened: true,
      gateAdvanceClaimed: true,
      realDataEnabled: true,
    }, g1AccountableNominationPackPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "formal_review_claimed",
      "gate_advance_claimed",
      "real_data_enabled",
    ]));
    expect(result.canPrepareInternalConvocationTemplate).toBe(false);
  });
});
