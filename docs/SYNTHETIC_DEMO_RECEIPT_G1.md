# Comprovante local da demonstração sintética — G1

## Resultado

A jornada pública NR-1 gera um comprovante local somente depois que todos os itens demonstrativos são respondidos. O comprovante registra referência efêmera, horário, política de runtime, versão exploratória, contagens processadas e limites de uso.

Quando um preset é usado, o comprovante registra também identificador e rótulo do cenário sintético determinístico, sem transformar o preset em benchmark ou caso real.

Ele não contém respostas, não usa `localStorage`, não chama serviço remoto e desaparece ao recarregar a página.

## Decisão Fable 5

- Recibo textual simples: insuficiente para impor invariantes.
- Contrato puro, componente e E2E: escolhido por produzir evidência verificável e recuperável.
- Persistência local ou remota: rejeitada nesta onda por ampliar retenção e expectativa de entrega.
- Exportação assinada: adiada até fonte, metodologia, assinatura e governança documental aprovadas.
- Ferramenta externa de analytics/demo: bloqueada até fornecedor e privacidade aprovados.
- Motor genérico de recibos: adiado; esta capacidade permanece específica à demonstração sintética.

## Invariantes

- modo obrigatoriamente sintético;
- instrumento com runtime bloqueado;
- conclusão de todos os itens;
- transporte remoto desabilitado;
- persistência proibida;
- `canSupportRealUse=false`;
- ausência de respostas brutas no comprovante.

## Evidência e limites

O teste unitário cobre geração e falha fechada. O E2E cobre teclado, jornada completa, comprovante visível, ausência de requisições remotas e descarte no reload.

Após o comprovante, a jornada oferece feedback estruturado sobre clareza, valor percebido e próximo interesse. O mecanismo não possui campo livre, persistência ou transporte; o feedback existe somente no estado React da página e também desaparece no reload.

Esta evidência não valida COPSOQ-BR, scoring, resultado, diagnóstico, GRO/PGR, conformidade ou prontidão para dados reais.
