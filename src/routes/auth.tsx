import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/pages/AuthPage";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar | Playbook NR-1" },
      { name: "description", content: "Acesse sua conta no Playbook NR-1." },
      { property: "og:title", content: "Entrar | Playbook NR-1" },
      { property: "og:description", content: "Acesse sua conta no Playbook NR-1." },
    ],
  }),
  component: AuthPage,
});
