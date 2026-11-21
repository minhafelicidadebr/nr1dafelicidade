import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/pages/ProfilePage";
import AuthGuard from "@/components/AuthGuard";
export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil | Playbook NR-1" },
      { name: "description", content: "Seu perfil, progresso e conquistas no Playbook NR-1." },
      { property: "og:title", content: "Meu perfil | Playbook NR-1" },
      { property: "og:description", content: "Seu perfil, progresso e conquistas no Playbook NR-1." },
    ],
  }),
  component: () => <AuthGuard><ProfilePage /></AuthGuard>,
});
