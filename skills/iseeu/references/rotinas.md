# Rotinas: diário, fechamento, goal, entrevista e consulta

## Modo 3. Diário de um dia

A partir das fichas daquele dia (processadas ou não), escreva `30 Diário/diário AAAA-MM-DD.md`. Tudo com trecho literal. Diário fechado não se edita; se já existir, não reescreva.

Cabeçalho: `tipo: diario`, `data`, `fontes`, `conversas`, `mensagens`, `termometro` (uma linha: calmo, tenso ou no limite, com o detalhe; o painel lê essa palavra), `tags` (só `area/` e `projeto/` que já existem).

```
# Diário AAAA-MM-DD
## Onde a cabeça esteve           tabela: frente, horário, peso no dia
## Decisões                       formato curto de 3 linhas
## Ideias e opiniões              frases dele, literais
## O que ele corrigiu ou recusou  e o motivo
## Revoltas e irritações
## Pessoas e combinados
## Palavras do dia                expressões, bordões, palavrões, com contagem quando der
## Termômetro                     leitura e os sinais usados
## Histórias contadas
## Pendências que ele assumiu
## Goal: sinais a favor e contra  só se houver goal ativo
## O que o dia sugere             hipóteses para o Retrato
```

O termômetro é leitura de sinais (palavrão, caixa alta, frase curta, correção repetida, "de novo"), não diagnóstico. Diga os sinais.

## Modo 4. Fechamento do mês

1. Copie `00 Núcleo/` inteiro para `00 Núcleo/_versoes/AAAA-MM/`.
2. Leia os diários do mês, as notas vivas que mudaram, `12 Pessoas/` e `_sistema/propostas.md`.
3. Reescreva cada um dos 11 arquivos do Núcleo. Não crie arquivo novo. Cada linha: `**Afirmação.** Força: N · Status: hipotese/confirmado · Prova: [[fonte]] "trecho"`. Crença só sobe para `confirmado` com o OK do dono. Linha sobre saúde, dinheiro, política ou família leva `(privado)` no fim, se o dono aceitou que esses temas entrem no Retrato (veja `dono.md`); se não aceitou, ficam só nas notas.
4. Veredito do goal do mês em `02 Goal/goal AAAA-MM.md` ("Veredito do mês") e `status: encerrado`. Para cada objetivo e comportamento: cumpriu, avançou ou não andou, com os números do acompanhamento.
5. Escreva `30 Diário/espelho AAAA-MM.md`, para o dono se ler: o que mais ocupou a cabeça, onde mudou de opinião, ideias que estão virando crença, ideias que sumiram, curva do termômetro, contradições novas, distância entre o goal e o comportamento.
6. Mudanças em `valores`, `como-decide`, `lideranca` e `relacoes` ficam marcadas **aguardando OK do dono**.
7. **Agente pessoal:** reescreva a seção "Essência" de `~/.claude/agents/<slug-do-dono>.md` com o Retrato novo (até 900 palavras: quem é, como decide, como fala, o que nunca faz, limites de liderança) e troque a data. Se o arquivo não existir, crie a partir de `assets/agente.md`, só com o OK do dono.
8. **Análise de perfil e consultor:** refaça os testes que vencem neste mês (Modo 8, `references/analise.md`, seção "Refazer todo mês"). Use arquivos novos, com a data de hoje, e o painel compara com o anterior. Depois reescreva os arquivos do consultor:
   - `_sistema/consultor/perfis.md`: seção "Evolução";
   - `_sistema/consultor/padroes.md`: o goal novo e os padrões do Retrato que o consultor vigia, cada um com prova e sinal. Sem linha `(privado)`.

   Instalações antigas guardam esses arquivos em `~/.claude/skills/consultor/references/`. Use o lugar que existir. Se houver o bloco automático (`~/.claude/rules/consultor.md`), atualize o resumo "O que ele vigia".
   Peça também que a pessoa refaça as exportações do mês (ChatGPT, Claude do site, WhatsApp do celular) e deixe em `01 Inbox/`.
9. Marque a entrevista do goal do mês seguinte.
10. Se existir `03 Pendências/`, reveja com o dono: o que morreu, o que fica e o que era besteira. Só apague com o OK dele.

## Modo 5. Goal do mês

A entrevista pergunta **só sobre objetivos**. Identidade, valores, voz e jeito de decidir nunca vêm de entrevista: vêm do que o dono disse e fez. O que alguém diz de si pode não bater com o que faz, e essa diferença é informação (vai para `autoimagem.md`).

1. Leia o Retrato, o espelho do mês anterior e o goal anterior.
   **Comece pelo que não foi cumprido.** Mostre o veredito e pergunte, objetivo por objetivo: continua (entra no goal novo, com o histórico do mês anterior), muda o alvo, ou sai. Nada passa sozinho para o mês seguinte: nem objetivo, nem item de checklist. Quem decide é o dono.
2. Pergunte, uma por vez: o que ele quer nos próximos 30 dias; o que isso significa na prática; como saberia que chegou lá; o que quer parar de fazer.
3. Escreva `02 Goal/goal AAAA-MM.md` com o modelo `goal`. Objetivos nas palavras dele.
4. "O que eu vejo hoje": comportamentos atuais ligados a cada objetivo, com frase literal, data e link.
5. Proponha de 2 a 4 comportamentos medíveis nas conversas e combine com ele. O indicador mede o que importa: contar uma palavra não torna ninguém mais seguro; decidir sem pedir confirmação talvez torne.
6. Checklist com ações concretas e prazo, **agrupado por objetivo** (um subtítulo `### <objetivo>` para cada um). O painel mostra objetivos e checklist lado a lado, e o dono marca as ações clicando.
7. Salve a entrevista em `20 Fontes/escritos/entrevista goal AAAA-MM.md`.

## Modo 6. Entrevista sobre um tema

Para tirar opinião e exemplo, não para o dono se descrever.

1. Leia o que já existe sobre o tema.
2. Cinco perguntas, uma por vez, que forcem opinião e exemplo ("o que você discorda no mercado sobre X?", "conta um caso real", "o que faria diferente hoje?"). Não sugira respostas.
3. Salve em `01 Inbox/entrevista AAAA-MM-DD <tema>.md` como material bruto e rode o ingest.

## Modo 7. Consulta

"O que eu penso sobre X", "responde como eu", escrever conteúdo ou decidir em nome do dono. Só lê.

1. Leia o Núcleo inteiro.
2. Leia o mapa da área ou do projeto.
3. Busque notas vivas por tag, projeto e data. Prefira `confirmado` e `forca` alta. Desça a diário, fichas e bruto só para prova.
4. Responda na voz dele (`voz.md`) e diga em quais notas se baseou.
5. Falando com terceiros ou agindo no lugar dele: nunca use notas `privado: true` nem linhas do Retrato marcadas `(privado)`, e pare nos limites de `lideranca.md` ("isso só o dono decide").
6. Sem registro: diga que não sabe e ofereça a entrevista. Nunca invente.
