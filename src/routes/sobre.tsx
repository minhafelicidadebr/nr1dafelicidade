import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/pages/AboutPage";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre | Playbook NR-1" },
      { name: "description", content: "Sobre o Instituto Felicidade para Todos e o Playbook NR-1." },
      { property: "og:title", content: "Sobre | Playbook NR-1" },
      { property: "og:description", content: "Sobre o Instituto Felicidade para Todos e o Playbook NR-1." },
    ],
  }),
  component: AboutPage,
});
