# WS-01 — Privacy Vault

## Decisão

Fatia escolhida: **deny-by-default robusto**. Tabelas de respostas, convites, scores e histórico ficam acessíveis somente ao serviço; atores organizacionais consomem RPCs pequenas, auditadas e com supressão no servidor.

Lentes aplicadas: privacidade/segurança, arquitetura multi-tenant, SST/regulatório, produto/UX e operação de campanha.

Alternativas avaliadas:

- manter RLS atual e filtrar no React: rejeitada; microdados já cruzariam a fronteira;
- criar apenas views com `n≥5`: insuficiente; grants e tabelas continuariam expostos;
- RPCs seguras com tabelas service-only: escolhida por controle de escopo, auditoria e reuso;
- serviço/cofre separado: direção futura possível, mas custo prematuro para G1 sintético;
- adiar: rejeitada porque bloqueia todos os gates seguintes.

Principal risco residual: banco novo, lint, matriz adversarial e carga sintética máxima foram comprovados localmente, mas ainda faltam execução no GitHub e revisão independente do threat model. Os guardrails de tempo não constituem SLA de capacidade.

## Fluxo implementado

### Resposta

1. o trabalhador possui token secreto;
2. `validate_invitation` informa somente o contexto necessário ao portador;
3. `submit_response` valida token, ciclo e payload;
4. a resposta é gravada sem hash ou identificador derivado do convite;
5. o uso do token é atualizado dentro do cofre;
6. o recebimento gera auditoria service-only, sem token, unidade ou identidade;
7. nenhum ator organizacional pode selecionar `responses`.

### Convites

1. gestor autorizado chama `create_invitation_batch`;
2. o servidor valida tenant, unidade, estado do ciclo e quantidade;
3. tokens aleatórios são devolvidos uma única vez;
4. a UI permite salvar/copiar somente o lote recém-emitido;
5. tokens antigos, status individual e `used_at` não podem ser relistados;
6. a organização vê somente total emitido e estado agregado/suprimido.

### Agregados

1. campanhas abertas não liberam contagem exata;
2. abaixo de `k`, a resposta do servidor é suprimida;
3. scores e histórico só são liberados para campanhas fechadas e `n≥k`;
4. outcomes, unidade e sugestões omitem grupos abaixo de `k`;
5. cada consulta aprovada gera audit log;
6. ciclo fechado não pode ser reaberto, reduzindo differencing temporal.

## Política

- versão: `privacy-g1-2026.06`;
- `k_min`: 5, como piso do Plano Mestre;
- threat model: `tm-g1-2026.06`;
- aprovação para dados reais: ausente;
- modo permitido no produto: sintético/local por G0.

## Evidências no repositório

- migração: `supabase/migrations/20260623013000_privacy_vault_g1.sql`;
- contrato frontend: `src/lib/api/privacyVault.ts`;
- teste estático: `src/test/privacyVaultMigration.test.ts`;
- contrato SQL: `supabase/tests/privacy_vault_contract.sql`;
- carga e timing sintéticos: `supabase/tests/privacy_vault_load_contract.sql`;
- corrida concorrente de replay: `supabase/tests/privacy_vault_concurrency.sh`;
- tela de emissão segura: `src/pages/app/CyclesPage.tsx`;
- pipeline GitHub: pendente no repositório oficial; o push inicial não inclui `.github/workflows/ci.yml` porque o token local não possui escopo `workflow`. O job `database-security` deve ser criado/ativado com credencial adequada antes de G1.

## Matriz automatizada definida

Os contratos pgTAP contêm 56 asserções: 44 para privilégios anon/auth/service, dois tenants, supressão, isolamento, replay, monotonicidade e auditoria; mais 12 para lote máximo de 500 convites, rejeição de 501, unicidade, 500 submissões, uso único, timing e supressão sob carga.

O teste concorrente abre duas conexões sobre o mesmo token e exige exatamente um sucesso, uma rejeição `token_already_used`, uma resposta, um convite usado e um evento de auditoria. A execução local concluiu em 1 segundo.

## Critérios de aceite

- [x] nenhuma consulta direta a tabelas do cofre no frontend/Edge Functions;
- [x] filtro de pequenos grupos executado no SQL das RPCs;
- [x] correlação determinística removida da resposta;
- [x] token e status individual não são relistados;
- [x] ciclo fechado é monotônico;
- [x] contrato estático automatizado;
- [x] matriz pgTAP adversarial definida no repositório;
- [x] CI de banco novo, lint SQL e pgTAP definida;
- [x] migrações executadas do zero em PostgreSQL/Supabase local;
- [ ] job `database-security` comprovadamente verde no GitHub;
- [x] testes locais de timing e carga sintética adversarial no limite de 500;
- [x] corrida concorrente de replay integrada ao job `database-security`;
- [ ] retenção, descarte, incidente e acesso emergencial aprovados por DPO/Jurídico;
- [ ] revisão independente do threat model.

Enquanto os itens pendentes não forem comprovados, **G1 permanece aberto e dados reais permanecem proibidos**.
