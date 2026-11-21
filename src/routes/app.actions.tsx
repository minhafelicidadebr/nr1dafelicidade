import { createFileRoute } from "@tanstack/react-router";
import ActionsPage from "@/pages/app/ActionsPage";

export const Route = createFileRoute("/app/actions")({
  head: () => ({
    meta: [
      { title: "Plano de ação | Playbook NR-1" },
      { name: "description", content: "Área Plano de ação do painel NR-1 do Playbook." },
      { property: "og:title", content: "Plano de ação | Playbook NR-1" },
      { property: "og:description", content: "Área Plano de ação do painel NR-1 do Playbook." },
    ],
  }),
  component: ActionsPage,
});
