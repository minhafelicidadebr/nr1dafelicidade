import { createFileRoute } from "@tanstack/react-router";
import DocumentsPage from "@/pages/app/DocumentsPage";

export const Route = createFileRoute("/app/documents")({
  head: () => ({
    meta: [
      { title: "Documentos | Playbook NR-1" },
      { name: "description", content: "Área Documentos do painel NR-1 do Playbook." },
      { property: "og:title", content: "Documentos | Playbook NR-1" },
      { property: "og:description", content: "Área Documentos do painel NR-1 do Playbook." },
    ],
  }),
  component: DocumentsPage,
});
