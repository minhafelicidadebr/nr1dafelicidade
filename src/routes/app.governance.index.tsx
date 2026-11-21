import { createFileRoute } from "@tanstack/react-router";
import GovernancePage from "@/pages/app/GovernancePage";

export const Route = createFileRoute("/app/governance/")({
  head: () => ({
    meta: [
      { title: "Governança | Playbook NR-1" },
      { name: "description", content: "Área Governança do painel NR-1 do Playbook." },
      { property: "og:title", content: "Governança | Playbook NR-1" },
      { property: "og:description", content: "Área Governança do painel NR-1 do Playbook." },
    ],
  }),
  component: GovernancePage,
});
