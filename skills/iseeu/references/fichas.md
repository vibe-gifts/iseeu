# Modo 1. Captura (fichas)

Qualquer IA pode capturar. Capturar é ler uma conversa ou um texto e anotar o que o dono disse, numa **ficha** em `01 Inbox/`. Quem decide o que aquilo vira é o curador, no ingest.

## O que pode e o que não pode

- **Pode** criar arquivos novos em `01 Inbox/` e ler qualquer arquivo do cofre (principalmente `_sistema/dono.md` e `_sistema/glossario.md`).
- **Não pode** escrever, mover ou apagar nada fora de `01 Inbox/`, nem editar arquivo que já existe.
- Se não conseguir gravar arquivos, entregue todas as fichas numa resposta só, separadas pela linha `===== FICHA =====`. O dono cola num arquivo `01 Inbox/lote <origem> AAAA-MM-DD.md`.

## Pedidos comuns

| Pedido | O que fazer |
|---|---|
| "audita meu histórico para o cérebro" | Percorra o histórico de conversas e a memória sobre o dono, das mais recentes para trás. Uma ficha por conversa ou assunto. **Prefira 50 fichas detalhadas a 5 resumidas.** Peça para continuar até acabar e, no fim, diga que períodos ou assuntos não conseguiu ver. Ficha que vem da memória, sem frase exata: `confianca: baixa`. |
| "faz as fichas de ontem" | Uma ficha para cada conversa de ontem em que o dono disse algo além de comandos curtos. Se não houve, não crie nada. |
| "manda isso pro meu cérebro" | Uma ficha para a conversa atual ou o texto enviado. Texto de outra pessoa (artigo, curso, post) não vira ficha: avise que é material de biblioteca. |
| Extrato do Claude Code ou do WhatsApp (curador, rotina) | Uma ficha por conversa do extrato (cada bloco `## hora · conversa`). Pule as que só têm comandos curtos ("pode", "sim", "abre aqui"). |

## Como ler

1. **Só a voz do dono.** Conta o que ele escreveu ou falou, o que ele aceitou de forma clara e, principalmente, o que ele **corrigiu ou recusou**: a correção mostra o critério dele melhor que qualquer coisa.
2. **Texto de terceiros colado não entra**, mesmo sem marca de colagem (dados de CNPJ, trecho de site, transcrição de vídeo de outra pessoa).
3. **Brief escrito por outra IA não é voz dele.** Às vezes a primeira mensagem de uma conversa é um pedido que uma IA escreveu para outra: fala do dono em terceira pessoa, lista passos para um agente. Pule.
4. **Botão de sugestão clicado conta como "aceitou".** Frase curta, redonda, com cara de texto de IA ("Sim, refaz a comparação e me diz se...") quase sempre é botão. Marque `[decisão · aceitou]`.
5. **Frase literal entre aspas**, com a hora. Nomes deformados pela transcrição de voz ficam como foram escritos no trecho; nos campos `projetos` e `temas`, use o nome certo do glossário.
6. **Não decida nada.** Não diga se algo é crença. Não crie links `[[ ]]` nem tags. Projetos e temas em texto simples. O curador conhece o cofre inteiro e é ele quem conecta; se o capturador criar links, nascem links quebrados e notas duplicadas com nomes diferentes.
7. **Nomes e pronome vêm de `_sistema/dono.md`.** Ele traz apelidos, projetos, pessoas e o pronome do dono. Sem pronome no arquivo, use o nome, nunca um pronome adivinhado.
8. **Não suavize.** Contradições, irritações, palavrões e mudanças de ideia entram.
9. Antes de terminar, confira que todo trecho entre aspas existe no texto de origem (busca simples no arquivo, quando houver).

## Formato

Nome: `ficha AAAA-MM-DD HHMM <assunto curto>.md` (sem hora: `0000`).

```markdown
---
tipo: ficha-conversa
origem: claude-code          # claude-code | chatgpt | codex | claude-site | whatsapp | aula | audio | escrito
autor-da-ficha: sonnet       # qual IA escreveu a ficha
data-da-conversa: AAAA-MM-DD
titulo-da-conversa: "assunto"
fonte: "[[nome do bruto]]"   # quando o texto original está no cofre
projetos: [nomes em texto simples]
temas: [assuntos em texto simples]
status: novo
confianca: alta              # alta: tem frase literal | baixa: veio da memória
---
## Resumo para a IA
Duas ou três linhas: do que se tratou e quantos itens a ficha tem.

## O que foi dito
- [tipo · tom] Uma frase com a ideia. "trecho literal" (hora)
```

Data desconhecida: primeiro dia do mês provável e `data-incerta: true`.

## Tipos de item

| Tipo | Quando |
|---|---|
| `ideia` | Algo que ele afirmou |
| `crença` | Algo que ele trata como verdade |
| `decisão` | Escolheu X em vez de Y, e por quê |
| `princípio` | Regra do tipo "quando X, eu faço Y" |
| `correção` | O que ele corrigiu ou recusou na IA ou em alguém |
| `história` | Um caso que ele contou |
| `voz` | Expressão, palavra ou jeito de falar marcante |
| `revolta` | O que o irritou |
| `pendência` | Algo que ele disse que ia fazer |
| `autoimagem` | O que ele disse sobre si mesmo |
| `pessoa` | O que ele disse sobre alguém, ou como agiu com alguém (diga o nome) |
| `combinado` | Acordo com alguém: quem prometeu o quê |

**Tom** (em ideia, crença, decisão e princípio): `firme` (falou com certeza), `explorando` (pensando alto), `pergunta` (perguntou), `aceitou` (aprovou algo que outro propôs). "Não sei se..." no começo da frase pode ser só o jeito de propor; olhe a frase inteira.

## Exemplo

```markdown
---
tipo: ficha-conversa
origem: claude-code
autor-da-ficha: sonnet
data-da-conversa: 2026-10-21
titulo-da-conversa: "Painel financeiro: visualização e cores"
fonte: "[[claude-code 2026-10-21]]"
projetos: [Painel Financeiro]
temas: [design de interface, cores de status]
status: novo
confianca: alta
---
## Resumo para a IA
Revisão de um painel financeiro: pediu opção de visualização, estranhou cores invertidas e gráfico com itens demais. 3 itens.

## O que foi dito
- [ideia · firme] Botão para a pessoa alternar entre quadro e cascata. "E a pessoa vê do jeito que fizer mais sentido para ela." (16:20)
- [correção] Cores invertidas: positivo em vermelho. "quando tá positivo ele tá vermelho, como se fosse ruim." (16:23)
- [correção] Gráfico com itens demais: mostrar os 5 primeiros e um botão de mais. "Então você só coloca tipo as 5 primeiras e um botão de mais ali" (16:23)
```
