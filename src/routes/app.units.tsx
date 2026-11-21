import { createFileRoute } from "@tanstack/react-router";
import UnitsPage from "@/pages/app/UnitsPage";

export const Route = createFileRoute("/app/units")({
  head: () => ({
    meta: [
      { title: "Unidades | Playbook NR-1" },
      { name: "description", content: "Área Unidades do painel NR-1 do Playbook." },
      { property: "og:title", content: "Unidades | Playbook NR-1" },
      { property: "og:description", content: "Área Unidades do painel NR-1 do Playbook." },
    ],
  }),
  component: UnitsPage,
});
