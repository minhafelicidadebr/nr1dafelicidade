import { createFileRoute } from "@tanstack/react-router";
import LibraryPage from "@/pages/LibraryPage";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Biblioteca | Playbook NR-1" },
      { name: "description", content: "Biblioteca de referências: Guia MTE 2026, COPSOQ e Work Wellbeing Playbook." },
      { property: "og:title", content: "Biblioteca | Playbook NR-1" },
      { property: "og:description", content: "Biblioteca de referências: Guia MTE 2026, COPSOQ e Work Wellbeing Playbook." },
    ],
  }),
  component: LibraryPage,
});
