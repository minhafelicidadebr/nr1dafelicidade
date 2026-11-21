import { createFileRoute } from "@tanstack/react-router";
import DriversPage from "@/pages/DriversPage";

export const Route = createFileRoute("/drivers/")({
  head: () => ({
    meta: [
      { title: "Motores de bem-estar | Playbook NR-1" },
      { name: "description", content: "Os 12 motores de bem-estar organizacional baseados em evidências de Oxford." },
      { property: "og:title", content: "Motores de bem-estar | Playbook NR-1" },
      { property: "og:description", content: "Os 12 motores de bem-estar organizacional baseados em evidências de Oxford." },
    ],
  }),
  component: DriversPage,
});
