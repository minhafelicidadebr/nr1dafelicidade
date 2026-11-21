import { createFileRoute } from "@tanstack/react-router";
import DriverWorldPage from "@/pages/DriverWorldPage";

export const Route = createFileRoute("/drivers/$slug")({
  head: () => ({
    meta: [
      { title: "Motor de bem-estar | Playbook NR-1" },
      { name: "description", content: "Explore um motor de bem-estar com mentoria de IA, dinâmicas e trilhas de aprendizagem." },
      { property: "og:title", content: "Motor de bem-estar | Playbook NR-1" },
      { property: "og:description", content: "Explore um motor de bem-estar com mentoria de IA, dinâmicas e trilhas de aprendizagem." },
    ],
  }),
  component: DriverWorldPage,
});
