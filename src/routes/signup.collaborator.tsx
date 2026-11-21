import { createFileRoute } from "@tanstack/react-router";
import SignupCollaboratorPage from "@/pages/signup/SignupCollaboratorPage";

export const Route = createFileRoute("/signup/collaborator")({
  head: () => ({
    meta: [
      { title: "Cadastro de colaborador | Playbook NR-1" },
      { name: "description", content: "Cadastro para colaboradores convidados." },
      { property: "og:title", content: "Cadastro de colaborador | Playbook NR-1" },
      { property: "og:description", content: "Cadastro para colaboradores convidados." },
    ],
  }),
  component: SignupCollaboratorPage,
});
