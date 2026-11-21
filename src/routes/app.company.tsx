import { createFileRoute } from "@tanstack/react-router";
import CompanyPage from "@/pages/app/CompanyPage";

export const Route = createFileRoute("/app/company")({
  head: () => ({
    meta: [
      { title: "Empresa | Playbook NR-1" },
      { name: "description", content: "Área Empresa do painel NR-1 do Playbook." },
      { property: "og:title", content: "Empresa | Playbook NR-1" },
      { property: "og:description", content: "Área Empresa do painel NR-1 do Playbook." },
    ],
  }),
  component: CompanyPage,
});
