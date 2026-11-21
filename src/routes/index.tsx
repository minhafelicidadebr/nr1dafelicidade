import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Playbook NR-1 | Demonstração sintética de evidências e ações" },
      { name: "description", content: "Demonstração sintética para organizar evidências, contexto do trabalho e planos de ação de riscos psicossociais (NR-1)." },
      { property: "og:title", content: "Playbook NR-1 | Demonstração sintética de evidências e ações" },
      { property: "og:description", content: "Demonstração sintética para organizar evidências, contexto do trabalho e planos de ação de riscos psicossociais (NR-1)." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8fc4c1d8-8931-435e-bcd6-c327921950f2" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8fc4c1d8-8931-435e-bcd6-c327921950f2" },
    ],
  }),
  component: HomePage,
});
