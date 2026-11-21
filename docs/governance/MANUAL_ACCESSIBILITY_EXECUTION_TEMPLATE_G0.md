# Registro de execução manual de acessibilidade pública — template G0

> **ESTADO: `NOT RUN` — TEMPLATE NÃO EXECUTADO.**
>
> Este arquivo não é evidência de teste. Antes da execução, copie-o para `MANUAL_ACCESSIBILITY_EXECUTION_YYYY-MM-DD_<ID>.md`. Não substitua campos vazios por suposições e não converta `NOT RUN` em `PASS` sem observação humana e evidência.

Protocolo aplicável: `a11y-public-manual-g0-v1`, em `MANUAL_ACCESSIBILITY_PROTOCOL_G0.md`.

## Identificação

| Campo | Valor |
|---|---|
| ID da execução | `PREENCHER` |
| Início/fim com fuso | `PREENCHER` |
| Repositório | `playbook-nr1-chagpt-sol` |
| Branch | `PREENCHER` |
| Commit completo | `PREENCHER` |
| Árvore limpa | `PREENCHER: SIM/NÃO + justificativa` |
| Build executado | `PREENCHER` |
| URL local | `PREENCHER` |
| Gate e política de runtime | `PREENCHER` |
| Modo de dados | `PREENCHER — deve ser sintético` |
| Executor | `PREENCHER` |
| Revisor independente | `PREENCHER` |
| Responsável pelo aceite | `PREENCHER` |

## Declarações prévias

- [ ] Li integralmente o protocolo aplicável.
- [ ] Confirmei o commit e a árvore Git antes do ensaio.
- [ ] Confirmei runtime local e exclusivamente sintético.
- [ ] Não usei dados pessoais ou de trabalhadores.
- [ ] Não tratei emulação como dispositivo físico.
- [ ] Registrei extensões, customizações e desvios de ambiente.

Qualquer item não marcado deve ser explicado em “Desvios e bloqueios”.

## Ambientes

| ID | Hardware | SO/versão | Browser/versão | Tecnologia assistiva/versão | Configuração relevante | Resultado |
|---|---|---|---|---|---|---|
| `ENV-WIN` | `PREENCHER` | `PREENCHER` | Chrome `PREENCHER` | NVDA `PREENCHER` | `PREENCHER` | `NOT RUN` |
| `ENV-MAC` | `PREENCHER` | `PREENCHER` | Safari `PREENCHER` | VoiceOver `PREENCHER` | Full Keyboard Access e preferência do Safari `PREENCHER` | `NOT RUN` |
| `ENV-MOB` | `PREENCHER` | `PREENCHER` | `PREENCHER` | TalkBack/VoiceOver `PREENCHER` | fonte, zoom e orientação `PREENCHER` | `NOT RUN` |
| `ENV-MOB-2` | `PREENCHER ou NÃO EXECUTADO` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `NOT RUN` |

## Resultados por caso

Valores aceitos: `PASS`, `FAIL`, `BLOCKED`, `N/A` com justificativa ou `NOT RUN`.

| Caso | Ambiente | Resultado | Observação objetiva | Evidência | Defeito |
|---|---|---|---|---|---|
| `KB-01` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `KB-02` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `KB-03` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `KB-04` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `KB-05` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `KB-06` | MAC | `NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `SR-01` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `SR-02` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `SR-03` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `SR-04` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `SR-05` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `SR-06` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `ZM-01` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `ZM-02` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `ZM-03` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `ZM-04` | WIN + MAC | `WIN: NOT RUN; MAC: NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `MO-01` | MOB | `NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `MO-02` | MOB | `NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `MO-03` | MOB | `NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `MO-04` | MOB | `NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| `MO-05` | MOB | `NOT RUN` | `PREENCHER` | `PREENCHER` | `PREENCHER` |

Preencher separadamente os estados WIN e MAC. Se houver observações ou evidências diferentes, duplicar a linha do caso; não resumir ambientes diferentes como um único `PASS`.

## Defeitos

| ID | Caso/rota | Ambiente | Severidade/prioridade | Impacto no usuário | Observado/esperado | Recomendação | Evidência | Status/reteste |
|---|---|---|---|---|---|---|---|---|
| `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` |

## Manifesto de evidências

Não adicionar binários ao Git sem política de retenção aprovada.

| ID | Caso | URI/caminho controlado | SHA-256 | Data/hora | Autor | Descrição |
|---|---|---|---|---|---|---|
| `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` |

## Desvios, bloqueios e limitações

- Desvios do protocolo: `PREENCHER`.
- Casos `BLOCKED`, `N/A` ou `NOT RUN`: `PREENCHER`.
- Segunda plataforma móvel: `PREENCHER`.
- Extensões/customizações: `PREENCHER`.
- Limitações adicionais: `PREENCHER`.

## Decisão

Resultado permitido — selecionar exatamente um:

- [ ] `APROVADO NO ESCOPO`
- [ ] `REPROVADO`
- [ ] `BLOQUEADO`
- [ ] `INCOMPLETO`

Justificativa verificável: `PREENCHER`.

Defeitos bloqueantes/maiores abertos: `PREENCHER`.

Próximo passo e responsável: `PREENCHER`.

Independentemente da opção, esta execução não declara conformidade WCAG, não aprova G1, não libera demo pública, produção ou dados reais e não substitui teste com pessoas com deficiência.

## Assinaturas

Assinaturas digitadas neste Markdown identificam responsáveis, mas não são assinatura eletrônica qualificada. Se o gate exigir valor formal, anexar recibo do mecanismo de assinatura aprovado e seu hash.

| Papel | Nome | Organização/função | Data/hora com fuso | Assinatura/recibo |
|---|---|---|---|---|
| Executor | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| Revisor independente | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
| Responsável pelo aceite | `PREENCHER` | `PREENCHER` | `PREENCHER` | `PREENCHER` |
