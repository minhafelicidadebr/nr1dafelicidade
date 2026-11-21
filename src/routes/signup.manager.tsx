import { createFileRoute } from "@tanstack/react-router";
import SignupManagerPage from "@/pages/signup/SignupManagerPage";

export const Route = createFileRoute("/signup/manager")({
  head: () => ({
    meta: [
      { title: "Cadastro de gestor | Playbook NR-1" },
      { name: "description", content: "Cadastro para gestores e lideranças." },
      { property: "og:title", content: "Cadastro de gestor | Playbook NR-1" },
      { property: "og:description", content: "Cadastro para gestores e lideranças." },
    ],
  }),
  component: SignupManagerPage,
});
