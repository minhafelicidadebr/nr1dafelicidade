import { createFileRoute } from "@tanstack/react-router";
import CyclesPage from "@/pages/app/CyclesPage";

export const Route = createFileRoute("/app/cycles")({
  head: () => ({
    meta: [
      { title: "Ciclos | Playbook NR-1" },
      { name: "description", content: "Área Ciclos do painel NR-1 do Playbook." },
      { property: "og:title", content: "Ciclos | Playbook NR-1" },
      { property: "og:description", content: "Área Ciclos do painel NR-1 do Playbook." },
    ],
  }),
  component: CyclesPage,
});
