import { createFileRoute } from "@tanstack/react-router";
import SignupSstPage from "@/pages/signup/SignupSstPage";

export const Route = createFileRoute("/signup/sst")({
  head: () => ({
    meta: [
      { title: "Cadastro SST | Playbook NR-1" },
      { name: "description", content: "Cadastro para profissionais de Saúde e Segurança do Trabalho." },
      { property: "og:title", content: "Cadastro SST | Playbook NR-1" },
      { property: "og:description", content: "Cadastro para profissionais de Saúde e Segurança do Trabalho." },
    ],
  }),
  component: SignupSstPage,
});
