import { createFileRoute } from "@tanstack/react-router";
import RespondPage from "@/pages/RespondPage";

export const Route = createFileRoute("/respond/$token")({
  head: () => ({
    meta: [
      { title: "Responder questionário | Playbook NR-1" },
      { name: "description", content: "Responda ao questionário de forma anônima e segura." },
      { property: "og:title", content: "Responder questionário | Playbook NR-1" },
      { property: "og:description", content: "Responda ao questionário de forma anônima e segura." },
    ],
  }),
  component: RespondPage,
});
