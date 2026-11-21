import { createFileRoute } from "@tanstack/react-router";
import EstrategiaPage from "@/pages/app/EstrategiaPage";

export const Route = createFileRoute("/app/estrategia")({
  head: () => ({
    meta: [
      { title: "Estratégia | Playbook NR-1" },
      { name: "description", content: "Área Estratégia do painel NR-1 do Playbook." },
      { property: "og:title", content: "Estratégia | Playbook NR-1" },
      { property: "og:description", content: "Área Estratégia do painel NR-1 do Playbook." },
    ],
  }),
  component: EstrategiaPage,
});
