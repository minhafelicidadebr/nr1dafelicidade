import { createFileRoute } from "@tanstack/react-router";
import WorkAnalysisPage from "@/pages/app/WorkAnalysisPage";

export const Route = createFileRoute("/app/work-analysis")({
  head: () => ({
    meta: [
      { title: "Análise do trabalho | Playbook NR-1" },
      { name: "description", content: "Área Análise do trabalho do painel NR-1 do Playbook." },
      { property: "og:title", content: "Análise do trabalho | Playbook NR-1" },
      { property: "og:description", content: "Área Análise do trabalho do painel NR-1 do Playbook." },
    ],
  }),
  component: WorkAnalysisPage,
});
