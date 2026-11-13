# Desenho do segundo cérebro

Referência completa da arquitetura. Formato da ficha em detalhe: `fichas.md`. Passo a passo do ingest: `ingest.md`. Rotinas: `rotinas.md`.

## Índice

- 1. Para que serve
- 2. A diferença para a biblioteca
- 3. As camadas (o que entra, o que cresce, o que é reescrito)
- 4. A caixa de entrada (`01 Inbox/`)
- 5. Do dito à crença (quem decide é o ingest)
- 6. Tags e links: quem coloca e para quê
- 7. Como a IA vai te achar em 2 anos, com 2.000 notas
- 8. As pastas
- 8b. O Goal (para onde ele quer ir)
- 9. A rotina das 9h
- 10. O fechamento do mês (o espelho)
- 11. Agir no lugar dele
- 12. Modelos
- 13. As regras
- 14. Ordem de construção de um cofre novo

## 1. Para que serve

1. **Ler o dono por inteiro**: o que ele pensa, acredita, fala e como decide.
2. **Agir no lugar dele** quando ele não estiver: responder um funcionário, dar uma direção, sabendo onde parar.
3. **Ele se entender**: ver como a cabeça dele muda com o tempo.
4. **Lembrar**: decisões, histórias, projetos.

## 2. A diferença para a biblioteca

A biblioteca é a biblioteca: o que **outros** pensaram. O cofre é o dono: só entra o que ele disse, escreveu, escolheu ou recusou. Ideia aprendida com alguém entra como dele, com `influencia:` dizendo de quem.

## 3. As camadas (o que entra, o que cresce, o que é reescrito)

Cada camada tem **uma regra de mudança diferente**. É isso que impede o cérebro de virar uma pilha de arquivos com cinco "identidades".

| Camada | Pasta | Regra | Exemplo |
|---|---|---|---|
| 0. Entrada | `01 Inbox/` | **Só passagem.** Tudo chega aqui; o ingest esvazia. | Transcrição colada, ficha do ChatGPT |
| 1. Bruto | `20 Fontes/` | **Só acumula. Nunca muda.** | Transcrição da aula de quinta, fichas processadas |
| 2. Diário | `30 Diário/` | **Só acumula. Fechado no fim do dia.** | Relatório de um dia |
| 3. Notas vivas | `40 Ideias/`, `50 Memória/`, `12 Pessoas/`, `15 Projetos/`, `10 Áreas/` | **Crescem. Nunca perdem.** Ganham prova nova e posição nova com data; o antigo fica. | Ideia "teste prático vence opinião" |
| Direção | `02 Goal/` | **Um arquivo por mês, escrito pelo dono.** Objetivos fixos no mês; o acompanhamento só acumula. | `goal 2026-11.md` |
| 4. Retrato | `00 Núcleo/` | **Reescrito por inteiro uma vez por mês.** A versão anterior vai para `00 Núcleo/_versoes/AAAA-MM/`. | `identidade.md` |

Por que funciona:

- **O Retrato nunca se multiplica.** São sempre os mesmos 11 arquivos (seção 8). Nenhum agente cria arquivo novo no Núcleo.
- **Nada se perde.** O Retrato vem das camadas 2 e 3, que só crescem. Se um Retrato sair errado, dá para refazer a partir delas.
- **A mudança fica visível.** Comparar `identidade.md` de hoje com a de 6 meses atrás mostra como ele mudou.

Nas notas vivas, mudar de opinião não apaga nada. A nota ganha uma linha na **linha do tempo**:

```
## Linha do tempo
- 2026-03-12: "desconto mata a marca" ([[aula 2026-03-12]])
- 2026-07-02: aceitou desconto para cliente âncora, "exceção estratégica" ([[diário 2026-07-02]])
- 2026-10-23: voltou à posição original, mais duro ([[aula 2026-10-23]])
```

## 4. A caixa de entrada (`01 Inbox/`)

É a **única porta** do cérebro. Chegam dois tipos de coisa:

| O que chega | Quem põe | Como o ingest reconhece |
|---|---|---|
| **Material bruto**: transcrição de aula, áudio transcrito, texto que o dono escreveu, PDF | O dono, colando ou arrastando | Arquivo **sem cabeçalho** |
| **Ficha de conversa**: o que foi dito numa conversa, já separado | ChatGPT, Claude do site, Claude Code, subagentes | Cabeçalho com `tipo: ficha-conversa` |

Regras:

- ChatGPT e Claude do site **só escrevem aqui**. Nunca no Retrato, nas ideias ou nos projetos.
- O dono não precisa organizar nada. Pode colar a transcrição com qualquer nome.
- No ingest, **material bruto** ganha cabeçalho de fonte, vai para `20 Fontes/<formato>/` e gera a ficha dele. **Ficha** é processada e vai para `20 Fontes/fichas/AAAA-MM/`. A caixa termina vazia.
- Material de terceiros (artigo, post, curso) que cair aqui não é dele: vai para a biblioteca, com aviso.

### A ficha de conversa

Uma ficha por conversa. Não é resumo em texto corrido: é uma **lista do que foi dito**, cada linha com tipo, tom e frase literal. Assim nada é espremido.

```markdown
---
tipo: ficha-conversa
origem: claude-code          # chatgpt | claude-site | claude-code | aula | audio | escrito
autor-da-ficha: sonnet       # qual IA escreveu a ficha
data-da-conversa: 2026-10-27
titulo-da-conversa: ""
fonte: "[[claude-code 2026-10-27]]"   # o bruto, quando existir no cofre
projetos: [Loja Nova]        # texto simples, sem link
temas: [estrutura da agência]  # texto simples, sem tag
status: novo                 # novo | processado | descartado
confianca: alta              # alta: tem frase literal | baixa: veio da memória da IA
---
## Resumo para a IA
Duas ou três linhas: o que aconteceu e quantos itens a ficha tem.

## O que foi dito
- [decisão · firme] Loja nova vira prioridade. "Fico com a loja nova como prioridade..." (15:47)
- [ideia · firme] Teste vence opinião. "não é só o que você acha..." (15:03)
- [ideia · explorando] Organização "cemitério" no GitHub. "Eu tô pensando até criar..." (16:12)
- [correção] Desconfiou do viés da IA. "você não está falando isso porque..." (15:03)
- [história] Como saiu do primeiro emprego. (14:57)
```

**Tipos de item:** `ideia`, `crença`, `decisão`, `princípio`, `correção` (o que ele corrigiu ou recusou), `história`, `voz` (expressão marcante), `revolta`, `pendência`, `autoimagem` (o que ele diz de si), `pessoa` (o que ele disse sobre alguém ou como agiu com alguém; diga o nome) e `combinado` (acordo com alguém: quem prometeu o quê).

**Tom:** `firme` (falou com certeza), `explorando` (pensando alto), `pergunta`. "Não sei se..." no começo da frase **não** é dúvida automática: em muita gente é o jeito de propor. Se for o caso do dono, isso fica anotado em `_sistema/dono.md`. Quem faz a ficha olha a frase inteira.

**Quem faz a ficha não decide nada.** Não diz se é crença, não cria link, não cria tag. Só anota o que viu.

## 5. Do dito à crença (quem decide é o ingest)

O ingest olha o **acúmulo** das fichas ao longo do tempo:

| Degrau | Regra | Onde fica |
|---|---|---|
| Palpite | Disse uma vez, explorando | Só na ficha |
| Ideia | Disse com firmeza | Nota em `40 Ideias/`, `status: hipotese` |
| Crença proposta | Repetiu em 3 conversas de dias diferentes, **ou** agiu de acordo numa decisão | Proposta em `_sistema/propostas.md` para o Retrato |
| Crença confirmada | O dono aprovou no fechamento do mês | `status: confirmado` e no Retrato |

**O que ele faz pesa mais do que o que ele diz.** Uma decisão coerente com a ideia vale mais que três frases.

`forca` na nota de ideia = número de **dias diferentes** em que a ideia apareceu (dito ou feito).

## 6. Tags e links: quem coloca e para quê

| Marca | Para que serve | Quem coloca |
|---|---|---|
| **Tag** no cabeçalho (`tags: [area/trabalho]`) | Etiqueta de assunto: junta muitas notas pelo tema | Só o ingest, do vocabulário de `_sistema/tags.md` |
| **Link** `[[nota]]` | Fio entre duas notas específicas (ideia ↔ prova, decisão ↔ projeto) | Só o ingest |
| **Link com sentido** (`apoia:`, `contradiz:`, `evoluiu-de:`) | Fio que diz *como* as notas se ligam | Só o ingest |
| **#hashtag** no texto | Não usamos | Ninguém |

Fichas trazem projetos e temas em **texto simples**. Só o ingest conhece o cofre inteiro, então só ele transforma "Loja Nova" em `[[loja-nova]]` e "estrutura da agência" na tag certa. Assim não nascem links quebrados nem notas duplicadas com nomes diferentes.

`tipo` e `status` são propriedades. Nas `tags`: `area/`, `projeto/` e `tema/`. Tag nova só como proposta.

## 7. Como a IA vai te achar em 2 anos, com 2.000 notas

A IA nunca lê tudo. Ela desce uma pirâmide e para quando tem o que precisa:

```
1. Retrato (00 Núcleo)        ~15 páginas. Lido INTEIRO, sempre. É a "alma".
2. Mapas (10 Áreas, 15 Projetos)   1 página cada. O estado atual de cada frente.
3. Notas vivas                Busca por tag, projeto e data. Só as que importam.
4. Diário                     Para saber o que aconteceu num dia ou período.
5. Fichas e bruto             Só quando precisa do trecho literal como prova.
```

Para "ele mudou de opinião?": a IA olha a linha do tempo da nota e compara as versões do Retrato.

## 8. As pastas

```
cofre/
  00 Núcleo/          O Retrato. Lista fechada de 11 arquivos.
    _versoes/AAAA-MM/ Cópia do Retrato antes de cada reescrita.
  01 Inbox/           A porta de entrada. Termina vazia depois do ingest.
  02 Goal/            Um goal por mês: para onde ele quer ir.
  10 Áreas/           Uma nota-mapa por área da vida.
  12 Pessoas/         Uma nota por pessoa (e pet), em subpastas por círculo.
    familia/ pets/ socios/ equipe/ clientes/ amigos/ alunos/
  15 Projetos/        Uma nota-mapa por projeto.
  20 Fontes/          Bruto: aulas, mentorias, reuniões, áudios, extratos, autoavaliações.
    fichas/AAAA-MM/   Fichas já processadas.
  30 Diário/          Um relatório por dia e um espelho por mês.
  40 Ideias/          Uma ideia por nota, com linha do tempo.
  50 Memória/
    decisoes/  historias/  aprendizados/
  60 Criações/        O que foi publicado, ligado às ideias usadas.
  _sistema/           Desenho, tags, propostas, registro, modelos, scripts.
```

### Os arquivos do Retrato (lista fechada)

| Arquivo | O que responde |
|---|---|
| `identidade.md` | Quem é o dono, papéis, momento de vida, história |
| `valores.md` | O que ele defende mesmo quando custa |
| `crencas.md` | O que ele trata como verdade (negócio, IA, gente, dinheiro, fé) |
| `como-decide.md` | Regras de decisão, como prioriza, o que nunca faz |
| `voz.md` | Palavras, expressões, palavrões, ritmo, o que soa falso nele |
| `temperamento.md` | O que irrita, o que anima, reação sob pressão, termômetro, mindset por área |
| `obsessoes.md` | Temas a que ele volta sempre |
| `tensoes.md` | Contradições e o que ainda não decidiu |
| `lideranca.md` | Como lidera, 5 pilares (nota dele × comportamento), mapa da equipe e **o que a IA nunca decide no lugar dele** |
| `autoimagem.md` | O que ele diz de si (testes, questionários) × o que o comportamento mostra |
| `relacoes.md` | Quem importa para ele e como ele se relaciona com família, sócios, equipe, clientes e amigos. Fala do jeito dele, não da vida dos outros. |

## 8b. O Goal (para onde ele quer ir)

O Retrato mostra **quem ele é**, escrito pela IA a partir do que vê. O Goal mostra **para onde ele quer ir**, escrito por ele. O cérebro mede a distância entre os dois.

- Um arquivo por mês em `02 Goal/goal AAAA-MM.md`, com o modelo `_sistema/modelos/goal.md`.
- **Nasce de uma entrevista** (Modo 7 da skill): a IA pergunta o que ele quer, o que isso significa na prática e como ele saberia que chegou lá.
- **A IA acrescenta o ponto de partida:** o que ela vê hoje, com prova. Ex.: "nas últimas 4 semanas, pediu confirmação antes de 30 de 40 decisões".
- **Comportamentos a mudar, medidos nas conversas.** O indicador tem que medir o que importa: contar "eu acho" não torna ninguém mais seguro; decidir sem pedir confirmação talvez torne. Indicador combinado com ele.
- **Checklist** de ações concretas com prazo.
- **Acompanhamento diário:** o ingest acrescenta uma linha por dia com sinal a favor ou contra, com prova. Só acumula.
- **Veredito no fechamento do mês:** chegou, não chegou, o que mudou, o que fica para o próximo goal.
- Os objetivos do mês **não mudam no meio do mês** sem o OK dele. O que ele quer de novo vai para o goal seguinte.

### Autoavaliação × comportamento

Testes e questionários (Eneagrama, 5 pilares, Conhecendo 1 a 1) mostram como ele **se vê**. As fichas mostram como ele **age**. O cérebro guarda os dois e compara:

- Testes ficam em `20 Fontes/autoavaliacoes/`, com `formato: autoavaliacao`.
- Cada afirmação de um teste vira hipótese. As fichas confirmam ou derrubam com o tempo.
- Teste é lente, nunca carimbo.
- Em `temperamento.md`, **mindset por área**: diante de desafio, encara ou foge? Diante do erro, investiga ou esconde? Diante da crítica, se informa ou se ofende?
- Em `lideranca.md`, o **mapa da equipe** (Liderança Situacional): para cada pessoa e cada frente, quanta direção ela precisa. Só o jeito de liderar, nada da vida pessoal deles.
- Ritmo: 5 pilares a cada 3 meses, Eneagrama uma vez por ano.

### Pessoas (`12 Pessoas/`)

Uma nota por pessoa que importa (e pelos pets), em subpastas por círculo: `familia`, `pets`, `socios`, `equipe`, `clientes`, `amigos`, `alunos`. Modelo em `_sistema/modelos/pessoa.md`.

- **O que tem:** quem é, como ela é pelo que ele conta, como ele é com ela, combinados em aberto e a linha do tempo do que falaram, combinaram e decidiram.
- **Nasce pelo ingest:** quando uma ficha traz um item `pessoa` ou `combinado` sobre alguém que aparece de novo ou que tem papel claro na vida dele. Gente citada uma vez de passagem não ganha nota.
- **Nome certo:** apelidos e deformações da voz vão em `apelidos:` e no glossário.
- **Equipe e sócios:** a nota guarda a dose de direção de cada um (Liderança Situacional). `lideranca.md` só resume.
- **Só o que ele disse ou fez.** As palavras dos outros são deles: de uma conversa com outra pessoa (WhatsApp, reunião), entra só o que foi combinado e decidido, nunca a conversa inteira da outra pessoa.

**Privacidade:** família, pets e amigos têm `privado: true`. Notas privadas **nunca** são usadas para responder a terceiros nem para agir no lugar dele com a equipe. Só entram quando é o próprio dono quem pergunta.

### Projetos

Uma nota curta por projeto em `15 Projetos/`: o que é e em que pé está, linha do tempo de decisões, ideias que nasceram ali, o que ele amou e odiou.

### Decisões

Decisão curta mora no diário e na linha do tempo do projeto, em 3 linhas:

```
**Decidiu:** X em vez de Y. **Porque:** motivo nas palavras dele. [[diário 2026-10-27]]
```

Só decisão grande (dinheiro, pessoas, rumo da empresa) ganha nota em `50 Memória/decisoes/`, com **5W2H** para descrever e **PDCA** para voltar depois e registrar se deu certo.

## 9. A rotina das 9h

Todo dia, às 9h:

1. **Extrai** a fala dele nas conversas do Claude Code do dia anterior com `scripts/extrair_claude_code.py` (da skill). Vai para `20 Fontes/conversas-ia/claude-code/claude-code AAAA-MM-DD.md`.
2. **Faz uma ficha por conversa** desse extrato e põe em `01 Inbox/`.
3. **Ingest** de tudo que está em `01 Inbox/`: as fichas do Claude Code, as do ChatGPT e o material bruto que o dono colou.
4. **Escreve o diário** do dia anterior a partir das fichas daquele dia.

### O que separa

Só o que **ele digitou ou falou**. Fica de fora: texto da IA, avisos do sistema e texto **de terceiros** colado numa conversa (transcrição de vídeo de outra pessoa, artigo). Transcrição da **aula dele** é voz dele, mesmo colada. O critério é **quem falou**, não se foi colado.

Botão de sugestão clicado conta como "aceitou", não como voz dele. O script não distingue um do outro: quem faz a ficha reconhece pela cara de texto de IA.

### De onde vem

| Fonte | Como chega |
|---|---|
| Claude Code neste Mac | Automático (o Mac precisa estar ligado às 9h) |
| Aula, áudio, reunião, texto dele | O dono cola ou arrasta em `01 Inbox/` |
| ChatGPT | Fichas em `01 Inbox/`, se ele conseguir escrever no cofre; senão, exportação mensal |
| Claude do site | Exportação mensal |

### O diário

```
# Diário 2026-10-27
## Onde a cabeça esteve      temas e projetos, com horário
## Decisões                  formato curto de 3 linhas
## Ideias e opiniões         frases dele, literais
## O que ele corrigiu ou recusou   e o motivo (mostra o critério dele)
## Revoltas e irritações
## Palavras do dia           expressões, bordões, palavrões
## Termômetro                calmo / tenso / no limite, com os sinais usados
## Histórias contadas
## Pendências que ele assumiu
## Goal: sinais a favor e contra   com prova
## O que o dia sugere        hipóteses para o Retrato
```

O termômetro é leitura de sinais (palavrão, caixa alta, frase curta, correção repetida), não diagnóstico. O diário **fica fechado**: não é editado depois. O Retrato **não** é tocado no dia a dia.

## 10. O fechamento do mês (o espelho)

No dia 1 de cada mês:

1. Guarda o Retrato atual em `00 Núcleo/_versoes/AAAA-MM/`.
2. Reescreve o Retrato com base nos diários, nas notas vivas e em `_sistema/propostas.md`.
3. Dá o **veredito do goal** do mês e encerra o arquivo (`status: encerrado`).
4. Escreve `30 Diário/espelho AAAA-MM.md`: o que mais ocupou a cabeça, onde mudou de opinião, ideias que estão virando crença, ideias que sumiram, curva do termômetro, contradições novas.
5. Lista o que precisa do OK dele, sobretudo em `valores`, `como-decide` e `lideranca`.
6. Marca a entrevista do goal do mês seguinte.

## 11. Agir no lugar dele

1. Lê o Retrato inteiro, o mapa do projeto e decisões parecidas do passado.
2. Responde como ele responderia, **dizendo em que se baseou**.
3. Nunca usa notas com `privado: true` (família, pets, amigos).
4. Para no limite escrito em `lideranca.md` (a definir com ele: dinheiro acima de um valor, contratar ou demitir, cliente grande, situação nunca vista). Nesses casos: "isso só o dono decide".

## 12. Modelos

Em `_sistema/modelos/`: `ficha-conversa`, `goal`, `pessoa`, `ideia`, `projeto`, `decisao-grande`, `historia`, `fonte`.

Fonte (`20 Fontes/`): aula, mentoria e áudio com texto inteiro. Conversa com IA só como **extrato** das mensagens dele, com o caminho do arquivo original.

## 13. As regras

1. **Só a voz do dono.** Texto da IA e texto de terceiros não são dele.
2. **Toda afirmação tem prova.** Link e trecho literal.
3. **Cada camada tem sua regra de mudança** (seção 3).
4. **Quem lê anota; o ingest decide e conecta** (seções 4 a 6).
5. **O que ele faz pesa mais do que o que ele diz.**
6. **O Retrato não ganha arquivo novo** sem o OK do dono.
7. **Tudo tem data.**
8. **Nunca inventar a opinião dele.** Sem registro, dizer "não sei" e perguntar.

## 14. Ordem de construção de um cofre novo

A ordem oficial, com os 10 passos e o que perguntar em cada um, está em `references/preparacao.md`, seção "Cofre novo". Em resumo: estrutura e `dono.md`, fontes e entregas, plugins, primeira carga e ingest, Retrato inicial e agente pessoal, análise de perfil e consultor, rotinas e goal.
