import { createFileRoute } from "@tanstack/react-router";
import RiskPage from "@/pages/app/RiskPage";

export const Route = createFileRoute("/app/risk")({
  head: () => ({
    meta: [
      { title: "Riscos | Playbook NR-1" },
      { name: "description", content: "Área Riscos do painel NR-1 do Playbook." },
      { property: "og:title", content: "Riscos | Playbook NR-1" },
      { property: "og:description", content: "Área Riscos do painel NR-1 do Playbook." },
    ],
  }),
  component: RiskPage,
});
