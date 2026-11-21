import { createFileRoute } from "@tanstack/react-router";
import AuthGuard from "@/components/AuthGuard";
import AppShell from "@/components/app/AppShell";

export const Route = createFileRoute("/app")({
  component: () => (
    <AuthGuard>
      <AppShell />
    </AuthGuard>
  ),
});
