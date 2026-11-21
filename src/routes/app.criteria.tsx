import { createFileRoute } from "@tanstack/react-router";
import CriteriaEnginePage from "@/pages/app/CriteriaEnginePage";

export const Route = createFileRoute("/app/criteria")({
  head: () => ({
    meta: [
      { title: "Critérios | Playbook NR-1" },
      { name: "description", content: "Área Critérios do painel NR-1 do Playbook." },
      { property: "og:title", content: "Critérios | Playbook NR-1" },
      { property: "og:description", content: "Área Critérios do painel NR-1 do Playbook." },
    ],
  }),
  component: CriteriaEnginePage,
});
