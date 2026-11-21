import { createFileRoute } from "@tanstack/react-router";
import ExternalReadinessWorkspacePage from "@/pages/app/ExternalReadinessWorkspacePage";

export const Route = createFileRoute("/app/governance/external-readiness")({
  head: () => ({
    meta: [
      { title: "Prontidão externa | Playbook NR-1" },
      { name: "description", content: "Área Prontidão externa do painel NR-1 do Playbook." },
      { property: "og:title", content: "Prontidão externa | Playbook NR-1" },
      { property: "og:description", content: "Área Prontidão externa do painel NR-1 do Playbook." },
    ],
  }),
  component: ExternalReadinessWorkspacePage,
});
