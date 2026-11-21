import { createFileRoute } from "@tanstack/react-router";
import SignupIndexPage from "@/pages/signup/SignupIndexPage";

export const Route = createFileRoute("/signup/")({
  head: () => ({
    meta: [
      { title: "Criar conta | Playbook NR-1" },
      { name: "description", content: "Escolha seu perfil para criar uma conta no Playbook NR-1." },
      { property: "og:title", content: "Criar conta | Playbook NR-1" },
      { property: "og:description", content: "Escolha seu perfil para criar uma conta no Playbook NR-1." },
    ],
  }),
  component: SignupIndexPage,
});
