import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/pages/app/DashboardPage";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Painel | Playbook NR-1" },
      { name: "description", content: "Área Painel do painel NR-1 do Playbook." },
      { property: "og:title", content: "Painel | Playbook NR-1" },
      { property: "og:description", content: "Área Painel do painel NR-1 do Playbook." },
    ],
  }),
  component: DashboardPage,
});
