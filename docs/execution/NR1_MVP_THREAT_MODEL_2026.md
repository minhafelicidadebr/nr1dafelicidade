# Threat model — núcleo de execução e evidências NR-1

- Status: `draft`
- Data: 07/08/2026
- Escopo: Onda 0, antes de schema/migration/storage
- Não contém secrets, tokens ou dados reais.

## Objetivo de segurança

Permitir que uma organização autorizada execute e revise ações coletivas sem revelar respostas individuais, permitir bypass de estado, misturar tenants, transformar declaração em prova ou manter evidência sem política de retenção.

## Ativos protegidos

| Ativo | Sensibilidade | Impacto |
|---|---|---|
| Respostas e convite-resposta | muito alta | Identificação, retaliação, dano humano e LGPD. |
| Risco coletivo e contagens | alta | Inferência de grupos pequenos e exposição organizacional. |
| Ações, controles e evidências | alta | Decisões erradas, auditoria frágil e falsa sensação de proteção. |
| Participação/CIPA | alta | Retaliação, exposição de opinião e perda de confiança. |
| Documentos e exportações | alta | Replicação fora do controle e claims indevidos. |
| Ledger, hashes e versões | média/alta | Impossibilidade de provar histórico ou adulteração. |
| Membership/RBAC | alta | Escalada de privilégio e cross-tenant. |
| Secrets de servidor | crítica | Leitura/escrita indevida em todo o ambiente. |
| Metadados de retenção e legal hold | alta | Descarte indevido ou retenção sem base. |

## Fronteiras de confiança

```text
Browser público / browser autenticado
        │ chave publicável, sem service role
        ▼
Supabase Auth + RPCs autorizadas
        │ valida tenant, papel, estado e versão
        ▼
PostgreSQL com RLS + tabelas service-only + ledgers
        │
        ├── Privacy Vault: respostas/convites, nunca expostos à organização
        ├── Execution Core: ações, controles, evidências e revisões
        ├── Document Compiler: snapshots preliminares e exportações
        └── Edge Functions/serviço: operações sensíveis; secrets somente servidor
```

Storage binário, malware scanning, e-mail, calendário, CRM e IA são fronteiras futuras e não devem entrar no MVP sem contrato próprio.

## Baseline de segurança observado

- `.gitignore` exclui `.env` e `.env.*`, mantendo `.env.example` permitido;
- referências a service role aparecem em migrations/funções de servidor, não como alteração desta Onda 0;
- o repositório possui Privacy Vault, RLS e contratos locais para `k`/cross-tenant;
- documentos e AEP/AET já usam mecanismos de revisão/hash em estado draft;
- o ponto frágil do núcleo de ações é a confiança em texto livre e bloqueio client-side;
- a ausência de política aprovada de retenção mantém dados reais bloqueados.

## Ameaças e controles

| ID | Ameaça | Vetor | Severidade | Controle atual | Controle exigido na Onda 1+ | Gate |
|---|---|---|---|---|---|---|
| TM-01 | Leitura cross-tenant | query/RPC sem validação de organização | crítica | RLS existente em fatias anteriores | RLS por entidade, pgTAP e teste adversarial de dois tenants | G1 |
| TM-02 | Bypass de fechamento | update direto ou estado manipulado no cliente | crítica | evaluator na UI, insuficiente | RPC de comando, trigger/guard server-side, ledger e concorrência | Onda 1 |
| TM-03 | Declaração vira evidência | catálogo/notas interpretados como implantação | alta | padrões textuais | `control_implementation` e `evidence_record` separados | Onda 2 |
| TM-04 | Evidência adulterada | sobrescrita ou remoção de histórico | alta | documentos têm hash; ação ainda parcial | append-only, versões, hash canônico e autorização de revisão | Onda 2 |
| TM-05 | Hash vira prova de verdade | interpretação incorreta do hash | média | disclaimers dispersos | microcopy e metadado: integridade não equivale a veracidade | Onda 2 |
| TM-06 | Vazamento por grupo pequeno | contagem, filtro ou exportação abaixo de k | crítica | `k ≥ 5` em mecanismos existentes | aplicar no servidor em toda saída e testar composição/inferência | G1 |
| TM-07 | Correlação convite-resposta | join por identidade, evento ou log | crítica | Privacy Vault e separação existentes | manter tabelas/serviços isolados e proibir referência no Execution Core | G1 |
| TM-08 | Retaliação pela participação | nomes em ata, comentário ou metadata | crítica | guardrails AEP/AET | papel/grupo por padrão, minimização e fluxo separado para ata nominativa | Onda 4 |
| TM-09 | Falsa eficácia | resultado manual sem método, baseline ou fonte | alta | inexistente como núcleo | medição, critério, revisor e evidência obrigatórios | Onda 3 |
| TM-10 | Correção apagada | reabrir ação e substituir histórico | alta | não implementado | ação filha, estado monotônico e ledger imutável | Onda 3 |
| TM-11 | Race condition | dois revisores aprovam versões diferentes | alta | não confirmado para ações | `expected_version`, idempotência e constraint de transição | Onda 1 |
| TM-12 | Documento com microdados | exportação ampla ou snapshot indevido | alta | documentos preliminares e Privacy Vault separados | compilador com allowlist, redaction e política de exportação | Onda 5 |
| TM-13 | Anexo malicioso | upload sem scanning/storage/RBAC | alta | upload seguro pendente | adiar binário; depois scanning, quarantine, retenção e download controlado | G3 |
| TM-14 | Service role exposta | chave em cliente, log ou bundle | crítica | guardrails de runtime existentes | revisão de Edge Functions, CI de secrets e inspeção de bundle | G1/G3 |
| TM-15 | Retenção sem base | histórico guardado indefinidamente ou descartado cedo | alta | matriz fail-closed, política draft | DPO/Jurídico/SST aprovam prazo, base, hold, descarte e restore | G3 |
| TM-16 | Automação indevida | IA/score fecha ou prioriza sem julgamento | alta | scoring/IA bloqueados para uso real | nenhuma decisão crítica automática; fontes e revisão humana | G1/G3 |
| TM-17 | Claim regulatório excessivo | UI chama rascunho de conformidade/laudo | alta | templates anti-overclaim | scanner de claims, marcador preliminar e revisão competente | G1 |
| TM-18 | Ação individualizada | intervenção trata trabalhador em vez da fonte | alta | tese e docs orientam foco organizacional | origem organizacional obrigatória e revisão SST | Onda 1/3 |

## Casos de abuso obrigatórios

1. gestor de Tenant A tenta ler ação de Tenant B;
2. executor tenta mover `in_progress` diretamente para `verified`;
3. revisor tenta aprovar sua própria ação crítica;
4. usuário tenta registrar evidência em ação de outro tenant;
5. duas requisições avançam a mesma versão simultaneamente;
6. exportação combina filtros para inferir grupo abaixo de `k`;
7. participante inclui nome, doença ou relato individual em campo coletivo;
8. usuário altera conteúdo depois de revisão/hash;
9. revisão `ineffective` tenta fechar sem ação corretiva;
10. documento preliminar é baixado com texto de certificação;
11. segredo aparece em log, bundle, teste ou mensagem de erro;
12. migration/restore remove ou sobrescreve ledger.

## Critérios de saída do threat model

- [ ] cada ameaça crítica tem teste automatizado ou evidência de controle;
- [ ] nenhuma resposta individual é acessível pelo fluxo de ações;
- [ ] cross-tenant, `k`, estado e imutabilidade são exercitados em banco sintético;
- [ ] storage binário permanece fora até G3;
- [ ] retenção e descarte continuam bloqueados enquanto não aprovados;
- [ ] revisão de Edge Functions e CI de secrets não encontra secret no cliente;
- [ ] incident response, legal hold e restore são definidos antes do serviço real.

## Riscos residuais

O threat model não prova a segurança do runtime. Ele orienta testes e decisões. A maior exposição imediata é o contraste entre o enforcement textual/client-side atual e o workflow server-side necessário. A maior exposição para o serviço real é retenção, anexos, validação externa e operação de incidentes.
