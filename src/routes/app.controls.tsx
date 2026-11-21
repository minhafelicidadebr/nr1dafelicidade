import { createFileRoute } from "@tanstack/react-router";
import ControlsPage from "@/pages/app/ControlsPage";

export const Route = createFileRoute("/app/controls")({
  head: () => ({
    meta: [
      { title: "Controles | Playbook NR-1" },
      { name: "description", content: "Área Controles do painel NR-1 do Playbook." },
      { property: "og:title", content: "Controles | Playbook NR-1" },
      { property: "og:description", content: "Área Controles do painel NR-1 do Playbook." },
    ],
  }),
  component: ControlsPage,
});
