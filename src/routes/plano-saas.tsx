import { createFileRoute } from "@tanstack/react-router";
import SaasGoLivePlanPage from "@/pages/SaasGoLivePlanPage";

export const Route = createFileRoute("/plano-saas")({
  head: () => ({
    meta: [
      { title: "Plano SaaS Go-Live | Playbook NR-1" },
      { name: "description", content: "Plano de lançamento SaaS do Playbook NR-1, com etapas, gates e critérios de prontidão." },
      { property: "og:title", content: "Plano SaaS Go-Live | Playbook NR-1" },
      { property: "og:description", content: "Plano de lançamento SaaS do Playbook NR-1, com etapas, gates e critérios de prontidão." },
    ],
  }),
  component: SaasGoLivePlanPage,
});
