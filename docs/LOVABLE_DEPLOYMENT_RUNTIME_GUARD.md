# Lovable Deployment Runtime Guard

Data: 01/07/2026

## Diagnostico

O deploy publico em `https://app-lente01-cop-nr1.lovable.app/` carregava o HTML do commit `d35bf1b`, mas o bundle compilado continha:

- `VITE_SUPABASE_URL` como `undefined`;
- `VITE_SUPABASE_PUBLISHABLE_KEY` como `undefined`.

Como `App.tsx` importa `AuthProvider` na inicializacao, e `AuthProvider` importa o cliente Supabase, o app tentava criar o cliente antes de renderizar qualquer rota publica. Sem essas variaveis, o runtime podia quebrar e deixar apenas o fundo branco.

## Correcao

- `src/lib/runtime/supabaseConfig.ts` resolve a configuracao Supabase de forma fail-closed.
- `src/integrations/supabase/client.ts` usa fallback local sintetico quando as variaveis estao ausentes, evitando crash de inicializacao.
- `src/hooks/AuthProvider.tsx` nao inicia auth/profile quando Supabase nao esta configurado no deploy.
- Operacoes reais continuam indisponiveis sem configurar Supabase; isso preserva o No-Go de G0/G1.

## Configuracao Recomendada no Lovable durante G0

O preview publico deve permanecer demonstrativo e sem autenticação/backend remoto. Não configurar um
Supabase remoto apenas para fazer o cadastro parecer funcional: `VITE_DATA_MODE=synthetic` não autoriza
destinos remotos no `dataGate` atual.

- desenvolvimento local sintético usa `VITE_SUPABASE_URL=http://127.0.0.1:54321` e chave anon local;
- preview Lovable sem backend mostra cadastro e acesso como indisponíveis, sem tentar rede;
- `VITE_SUPABASE_PUBLISHABLE_KEY` aceita somente chave publicável/anon; prefixo `sb_secret_` é rejeitado;
- nenhum formulário de cadastro deve armazenar rascunho ou prometer ativação quando o runtime estiver bloqueado.

Um Supabase remoto sintético exige política própria, isolamento do ambiente, identidades exclusivamente
sintéticas, revisão de privacidade/segurança e evidência de gate. Um ambiente com pessoas ou dados reais
continua proibido antes de G3 e das aprovações formais.
