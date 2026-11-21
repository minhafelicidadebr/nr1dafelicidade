import { createFileRoute } from "@tanstack/react-router";
import TogafMacroWaveWorkspacePage from "@/pages/app/TogafMacroWaveWorkspacePage";

export const Route = createFileRoute("/app/governance/togaf-macro-wave")({
  head: () => ({
    meta: [
      { title: "TOGAF Macro Wave | Playbook NR-1" },
      { name: "description", content: "Área TOGAF Macro Wave do painel NR-1 do Playbook." },
      { property: "og:title", content: "TOGAF Macro Wave | Playbook NR-1" },
      { property: "og:description", content: "Área TOGAF Macro Wave do painel NR-1 do Playbook." },
    ],
  }),
  component: TogafMacroWaveWorkspacePage,
});
