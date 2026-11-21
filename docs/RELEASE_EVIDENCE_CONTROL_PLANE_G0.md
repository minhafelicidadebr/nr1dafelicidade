# Onda 0R — Release Evidence Control Plane

## Problema

Após o merge do PR 9, o produto ainda apresentava um pacote de evidência pré-merge: Draft PR aberto, SHA histórico e flags manuais de CI. O código funcional estava correto, mas a camada de prova havia ficado temporalmente inconsistente.

## Decisão Fable 5

Alternativas avaliadas:

- atualizar os flags manualmente: rejeitada, pois preservaria o drift;
- consultar GitHub/Lovable diretamente no browser: rejeitada por segurança, disponibilidade e acoplamento;
- declarar todo merge como release aprovado: proibida;
- comprar GRC agora: adiada por custo e estágio;
- criar manifesto versionado + avaliador puro + consumidores derivados: escolhida;
- abstrair um control plane genérico completo: adiada até a segunda aplicação comprovada.

## Fatia implementada

`manifesto JSON → validação fail-closed → pacote de prova → prontidão de sync → cockpit → testes de drift`

O manifesto relata um baseline comprovado. Ele não executa GitHub, Lovable, deploy, merge ou mudança de gate.

## Lentes aplicadas

- engenharia: uma fonte machine-readable e CI vinculada por SHA;
- segurança/operação: ausência de prova bloqueia em vez de inferir sucesso;
- produto/governança: G0 aprovado e G1-alvo são estados diferentes;
- jurídico/regulatório: merge técnico não equivale a autorização operacional;
- comercial: sandbox de cobrança não equivale a billing live.

## Invariantes

- dados reais continuam desabilitados;
- G1 continua não aprovado;
- publicação externa continua bloqueada;
- Mercado Pago continua somente sandbox;
- metodologia e aceite formal continuam bloqueados;
- Lovable só passa a verificado com artifact vinculando projeto e SHA.

## Evidência

- manifesto: `docs/release/G1_RELEASE_EVIDENCE_MANIFEST.json`;
- mecanismo: `src/lib/release/releaseEvidenceManifest.ts`;
- configuração: `src/data/g1ReleaseEvidenceManifest.ts`;
- pacote derivado: `src/data/g1ReleaseProofPacket.ts`;
- atestado derivado de baseline publicado: `src/data/releaseSyncReadiness.ts`;
- cockpit: `src/components/governance/ReleaseProofPacketCard.tsx`;
- testes: mecanismo, pacote, sync, maturidade, componente e drift documental.

## Risco residual

O manifesto é uma evidência versionada e ainda exige atualização deliberada quando um novo baseline for promovido. Automação de coleta via GitHub artifact fica para a próxima fatia da Onda 0, evitando introduzir credenciais ou chamadas externas no frontend.
