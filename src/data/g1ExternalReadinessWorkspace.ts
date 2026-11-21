import { g1DemoRehearsalContext, g1DemoRehearsalItems, g1DemoRehearsalPolicy } from "@/data/g1DemoRehearsal";
import {
  g1ExternalAudiencePack,
  g1ExternalAudiencePackContext,
  g1ExternalAudiencePackPolicy,
} from "@/data/g1ExternalAudiencePack";
import {
  buildG1ExternalSessionEvidence,
  g1ExternalSessionDecisionContext,
  g1ExternalSessionDecisionPolicy,
} from "@/data/g1ExternalSessionDecision";
import { g1FormalAcceptancePolicy, g1FormalDecisions, g1FormalRoles } from "@/data/g1FormalAcceptance";
import {
  g1PublicDemoReadinessContext,
  g1PublicDemoReadinessItems,
  g1PublicDemoReadinessPolicy,
} from "@/data/g1PublicDemoReadiness";
import { g1ResidualRiskContext, g1ResidualRiskPolicy, g1ResidualRisks } from "@/data/g1ResidualRiskRegister";
import {
  officialPublishedBaselineEvidence,
  publishedBaselinePolicy,
} from "@/data/releaseSyncReadiness";
import {
  buildG1ExternalReadinessClosureItems,
  g1ExternalReadinessClosureContext,
  g1ExternalReadinessClosurePolicy,
} from "@/data/g1ExternalReadinessClosure";
import { evaluateDemoRehearsal } from "@/lib/governance/demoRehearsal";
import { evaluateExternalAudiencePack } from "@/lib/governance/externalAudiencePack";
import { evaluateExternalSessionDecision } from "@/lib/governance/externalSessionDecision";
import { evaluateExternalReadinessClosure } from "@/lib/governance/externalReadinessClosure";
import { evaluateFormalAcceptance } from "@/lib/governance/formalAcceptance";
import { evaluatePublicDemoReadiness } from "@/lib/governance/publicDemoReadiness";
import { evaluateResidualRiskRegister } from "@/lib/governance/residualRiskRegister";
import { evaluatePublishedBaselineReadiness } from "@/lib/release/syncReadiness";

const publishedBaselineReadiness = evaluatePublishedBaselineReadiness(
  officialPublishedBaselineEvidence,
  publishedBaselinePolicy,
);
const formalAcceptance = evaluateFormalAcceptance(
  g1FormalRoles,
  g1FormalDecisions,
  g1FormalAcceptancePolicy,
);
const demoRehearsal = evaluateDemoRehearsal(
  g1DemoRehearsalItems,
  g1DemoRehearsalContext,
  g1DemoRehearsalPolicy,
);
const publicDemoReadiness = evaluatePublicDemoReadiness(
  g1PublicDemoReadinessItems,
  g1PublicDemoReadinessContext,
  g1PublicDemoReadinessPolicy,
);
const residualRiskRegister = evaluateResidualRiskRegister(
  g1ResidualRisks,
  g1ResidualRiskContext,
  g1ResidualRiskPolicy,
);
const externalAudiencePack = evaluateExternalAudiencePack(
  g1ExternalAudiencePack,
  g1ExternalAudiencePackContext,
  g1ExternalAudiencePackPolicy,
);
const externalSessionDecision = evaluateExternalSessionDecision(
  buildG1ExternalSessionEvidence({
    demoRehearsal,
    publicDemo: publicDemoReadiness,
    publishedBaseline: publishedBaselineReadiness,
    formalAcceptance,
    residualRisk: residualRiskRegister,
  }),
  g1ExternalSessionDecisionContext,
  g1ExternalSessionDecisionPolicy,
);
const externalReadinessClosure = evaluateExternalReadinessClosure(
  buildG1ExternalReadinessClosureItems({
    audiencePack: externalAudiencePack,
    publishedBaseline: publishedBaselineReadiness,
    formalAcceptance,
    residualRisk: residualRiskRegister,
  }),
  g1ExternalReadinessClosureContext,
  g1ExternalReadinessClosurePolicy,
);

export const g1ExternalReadinessWorkspace = Object.freeze({
  publishedBaselineReadiness,
  formalAcceptance,
  demoRehearsal,
  publicDemoReadiness,
  residualRiskRegister,
  externalAudiencePack,
  externalSessionDecision,
  externalReadinessClosure,
});
