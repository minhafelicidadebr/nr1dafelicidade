import { createFileRoute } from "@tanstack/react-router";
import AetAnalysisPage from "@/pages/app/AetAnalysisPage";

export const Route = createFileRoute("/app/aet")({
  head: () => ({
    meta: [
      { title: "AET | Playbook NR-1" },
      { name: "description", content: "Área AET do painel NR-1 do Playbook." },
      { property: "og:title", content: "AET | Playbook NR-1" },
      { property: "og:description", content: "Área AET do painel NR-1 do Playbook." },
    ],
  }),
  component: AetAnalysisPage,
});
