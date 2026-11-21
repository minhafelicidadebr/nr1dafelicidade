import { createFileRoute } from "@tanstack/react-router";
import SalesPage from "@/pages/SalesPage";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos | Playbook NR-1" },
      { name: "description", content: "Conheça os planos do Playbook NR-1 para gestão de riscos psicossociais e bem-estar organizacional." },
      { property: "og:title", content: "Planos | Playbook NR-1" },
      { property: "og:description", content: "Conheça os planos do Playbook NR-1 para gestão de riscos psicossociais e bem-estar organizacional." },
    ],
  }),
  component: SalesPage,
});
