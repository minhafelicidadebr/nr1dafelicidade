import { createFileRoute } from "@tanstack/react-router";
import NR1CopsoqPage from "@/pages/NR1CopsoqPage";

export const Route = createFileRoute("/nr1-copsoq")({
  head: () => ({
    meta: [
      { title: "NR-1 e COPSOQ | Playbook NR-1" },
      { name: "description", content: "Como o COPSOQ apoia a gestão de riscos psicossociais exigida pela NR-1." },
      { property: "og:title", content: "NR-1 e COPSOQ | Playbook NR-1" },
      { property: "og:description", content: "Como o COPSOQ apoia a gestão de riscos psicossociais exigida pela NR-1." },
    ],
  }),
  component: NR1CopsoqPage,
});
