# Modo 8. Análise de perfil: quem você é, pelos fatos

Seis testes de comportamento preenchidos pelo que o dono **fez e falou**, registrado no cofre. Não pelo que ele responderia. Num questionário, a pessoa marca quem ela gostaria de ser. Aqui, cada nota precisa de uma frase dele ou de um fato do cofre. A diferença entre as duas leituras é informação: vai para `autoimagem.md`.

O resultado tem três destinos:
1. o dono, que lê e se encara;
2. o painel do Obsidian, que desenha um gráfico por teste;
3. o consultor, que passa a saber como coordenar essa pessoa.

## Quando rodar

- **Primeira vez:** logo depois do primeiro ingest grande. É preciso ter pelo menos 30 dias de fala do dono no cofre, de duas fontes ou mais. Com menos, rode só se ele pedir. Nesse caso, marque `confianca: baixa` e diga quantas provas cada teste teve.
- **Todo mês, no fechamento do mês (Modo 4):** refaça para ver se melhorou. Veja "Refazer todo mês", no fim deste arquivo.
- **Quando ele pedir:** "faz meu DISC", "me analisa", "quem eu sou pelos fatos".

## Como executar

1. **Junte o material.** Leia o Núcleo, o goal, os espelhos, os diários, `12 Pessoas/` (equipe, clientes, sócios), `50 Memória/decisoes/` e as fichas. Material grande: um ajudante por teste, todos em paralelo, cada um com este arquivo e a lista de pastas. Use o modelo mais barato que escreve bem (Sonnet, por exemplo).
2. **Preencha cada teste** com as regras da seção dele, abaixo. Cada nota vem com 1 a 3 provas no formato `[[nota]] "trecho literal"`. Prefira o que ele **fez** (decisão, combinado, correção) ao que ele disse de si. Sem prova, a nota fica em branco e vai para "Lacunas". Nunca chute.
3. **Grave um arquivo por teste** em `20 Fontes/autoavaliacoes/autoavaliacao AAAA-MM-DD <teste>.md`. O cabeçalho é este:
   ```yaml
   tipo: autoavaliacao
   teste: DISC
   preenchido-por: claude, pelo comportamento registrado no cofre
   data: AAAA-MM-DD
   status: hipotese
   confianca: media        # baixa se houve pouco material
   painel: { ... }         # os números do gráfico; formato em fontes.md, seção "Gráficos dos perfis no painel"
   ```
   O 5 pilares e a liderança situacional podem dividir um arquivo. O `painel:` daquele arquivo tem as duas chaves.
4. **Confira as provas:**
   ```bash
   python3 -I <skill>/scripts/conferir_provas.py "<cofre>" "<cofre>/20 Fontes/autoavaliacoes/autoavaliacao AAAA-MM-DD "*.md
   ```
   Toda linha `NÃO ACHEI` é frase que não existe no cofre. Tire a frase ou troque por uma que exista. Só siga com `0 sem fonte no cofre`.
5. **Mostre ao dono:** o resultado de cada teste em uma linha, o que isso diz dele e onde ele provavelmente se daria uma nota diferente. Pergunte se ele se reconhece. Discordância não muda nota sem prova nova. Ela vira linha em `_sistema/propostas.md` para `autoimagem.md`.
6. **Monte o consultor.** Veja a seção "Montar o consultor", abaixo.

Todo arquivo de teste termina com estas seções:
- **"O que isso diz de você"**: 3 a 5 linhas, para ele ler.
- **"Onde você provavelmente se pontuaria diferente"**: a distância entre o que ele diz e o que ele faz.
- **"Lacunas"**: o que o cofre não sabe responder.

## Os seis testes

### 1. Eneagrama

Nove tipos. Para cada tipo há três frases. Cada frase recebe de 1 (nunca se vê nos fatos) a 5 (aparece o tempo todo). O tipo soma de 3 a 15.

| Tipo | As três frases (pontue pelo que ele faz) |
|---|---|
| 1 Perfeccionista | Corrige o trabalho dos outros até ficar do jeito certo. · Se irrita com regra quebrada e com descuido. · Tem dificuldade de entregar algo que ainda acha imperfeito. |
| 2 Ajudante | Oferece ajuda antes de pedirem. · Mede o próprio valor pelo quanto é útil para os outros. · Tem dificuldade de pedir ajuda e de dizer não. |
| 3 Realizador | Fala muito de meta, número e resultado. · Ajusta a imagem conforme o público. · Fica inquieto quando não está produzindo. |
| 4 Individualista | Busca o que é original e foge do comum. · Fala de sentimento com profundidade. · Sente que ninguém entende de verdade o que ele quer. |
| 5 Investigador | Estuda muito antes de agir. · Guarda energia e evita exposição. · Prefere entender o sistema a lidar com pessoas. |
| 6 Questionador | Antecipa o que pode dar errado. · Pede confirmação antes de decidir. · Desconfia de promessa e testa a lealdade das pessoas. |
| 7 Entusiasta | Abre frente nova com facilidade. · Foge da parte chata, do tédio e da dor. · Tem mais ideias do que consegue terminar. |
| 8 Desafiador | Assume o controle e decide rápido. · Fala direto, mesmo quando incomoda. · Protege os seus e reage forte a injustiça. |
| 9 Pacificador | Evita conflito e adia a conversa difícil. · Concorda para manter a paz. · Deixa as próprias prioridades para depois das dos outros. |

- O tipo principal é a maior soma. A asa é o vizinho do principal com mais pontos: o 9 é vizinho do 1, e o 1 do 2.
- Empate: desempate pelo que ele faz sob pressão.
- `painel`: `{ pontos: [9 somas, do tipo 1 ao 9], principal, asa, leitura, mudar }`.
- A seção "Como aparece quando ele lidera" diz como o tipo funciona com equipe, cliente e IA, com prova.

### 2. DISC

Quatro dimensões, cada uma de 0 a 100.

| Dimensão | Sinais no cofre |
|---|---|
| **D**, dominância | Decide rápido. Dá ordem curta. Cobra resultado. Corta quando não anda. |
| **I**, influência | Convence e ensina. Fala em público. Empolga. Cria relação. |
| **S**, estabilidade | Tem paciência com processo longo. Mantém rotina. Termina o que começou. Evita mudança brusca. |
| **C**, conformidade | Confere detalhe. Exige padrão e regra escrita. Desconfia de dado sem fonte. |

- Leia em dois lugares:
  - **Natural:** quando ele está sozinho, com ferramenta ou com a IA.
  - **Adaptado:** quando ele está com gente (cliente, equipe, aluno).
- `pontos` é o retrato geral, pesando onde ele passa mais tempo. O perfil se nomeia pelas três maiores, em ordem (ex.: I-C-D).
- Descreva também o que muda sob pressão: o que sobe, o que some e quem paga o custo.
- `painel`: `{ pontos: [D, I, S, C], natural: [...], adaptado: [...], leitura, mudar }`.

### 3. Os 5 pilares da liderança

São cinco pilares com três perguntas cada. Cada pergunta recebe uma nota de 0 a 10, dada pelos fatos. A nota do pilar é a média das três. Liderar aqui vale para equipe, sócio, cliente, fornecedor e para a própria IA. Quem trabalha sozinho também lidera.

| Pilar | Perguntas |
|---|---|
| Mentalidade | Assume a responsabilidade pelo resultado, sem culpar os outros? · Usa o erro e a crítica para aprender? · Põe a energia na solução, não na reclamação? |
| Autoconhecimento | Sabe dizer os próprios pontos fortes? · Reconhece o comportamento que o atrapalha? · Está satisfeito com o equilíbrio entre saúde, relações, trabalho e dinheiro? |
| Pessoas | Dá retorno e conversa de desenvolvimento com frequência? · As pessoas em volta se sentem ouvidas? · Conhece a história e os objetivos de quem trabalha com ele? |
| Estratégia | Quem executa sabe o alvo antes de começar? · Acompanha os números com quem executa? · Os combinados de prioridade, responsabilidade e prazo são claros? |
| Confiança | O trabalho anda sem depender dele? · Ele entrega responsabilidade importante para outra pessoa? · Confia, e confere sem tirar o trabalho da mão? |

- `se-daria`: a nota que ele provavelmente se daria. Vem do que ele diz de si (`autoimagem.md`). É opcional e só vale com prova.
- `geral`: a média dos cinco pilares.
- Abra o arquivo com "Sua liderança hoje", uma nota de 0 a 10 com uma frase.
- `painel`: `{ eixos: [Mentalidade, Autoconhecimento, Pessoas, Estratégia, Confiança], pontos: [...], se-daria: [...], geral, leitura, mudar }`.

### 4. Mindset por área

Mostra se ele trata uma capacidade como talento fixo ("sou assim") ou como algo que se aprende ("ainda não sei, vou treinar"). A pessoa costuma ter os dois, cada um numa área.

1. Escolha de 4 a 8 áreas em que o cofre mostra ele falando da própria capacidade. Exemplos: delegar, vender, terminar projeto, receber crítica, finanças, aprender tecnologia, falar em público.
2. Dê uma nota de -2 a 2:

| Nota | Como aparece |
|---|---|
| -2 | Rótulo forte e repetido ("sou péssimo em X", "não nasci para isso"). Ele evita a área. |
| -1 | Rótulo aparece, mas às vezes ele tenta. |
| 0 | Misto, ou sem material suficiente. |
| 1 | Trata como processo. Pergunta como melhorar. |
| 2 | Busca crítica de propósito. Mede o próprio avanço. Falou de um erro como aula. |

- Cada área tem as provas dos dois lados, se houver, e a frase que troca o rótulo por um primeiro passo.
- `painel`: `{ areas: [...], pontos: [...], leitura, mudar }`. Use os mesmos nomes de área todo mês, para o painel comparar.

### 5. Liderança situacional

Quatro jeitos de liderar. O bom líder escolhe o jeito pela maturidade de quem recebe a tarefa.

| Estilo | Como aparece |
|---|---|
| S1 Dirigir | Diz o quê, como e quando. Confere de perto. |
| S2 Orientar | Explica o porquê. Ouve. Ainda decide. |
| S3 Apoiar | A pessoa decide. Ele escuta, encoraja e tira obstáculos. |
| S4 Delegar | Entrega o resultado e solta. Confere só o final. |

- Marque os estilos que ele usa, com um caso real de cada (pessoa ou IA). Diga quais faltam.
- Mostre o padrão. Por exemplo: "pula de dirigir para delegar sem passar pelo meio".
- Na nota de cada pessoa em `12 Pessoas/`, o ingest já anota a dose de direção. Use isso.
- `painel`: `{ usa: [1, 4], leitura, mudar }`.

### 6. Conhecendo um a um

Seis perguntas de vida. Cada resposta vem do cofre, com prova. Não tem gráfico.

1. O que sonhava ser quando criança, e como era.
2. A família: quem são e o que ele valoriza nela. Nota `privado: true`.
3. As referências de vida e de liderança, e por quê.
4. O que mais gosta de fazer no trabalho e fora dele.
5. O que mudaria no próprio trabalho hoje.
6. Onde e como quer estar daqui a 3 anos.

- Pergunta sem registro vai para "Lacunas" e vira pergunta para a entrevista (Modo 6). Nunca vira resposta inventada.
- Termine com "O que isso diz de você": onde o destino que ele diz querer bate com a rotina dele, e onde não bate.

## Montar o consultor

O consultor é um agente que lê o cérebro e fala **com** o dono, para levá-lo ao goal do mês. O agente pessoal fala **como** ele. Os perfis dizem ao consultor como coordenar essa pessoa: o que funciona com ela, o que não funciona e o que cobrar.

1. **Escreva `_sistema/consultor/perfis.md`** a partir de `assets/consultor/perfis.md`. É um documento só, que junta os seis testes:
   - em 5 linhas;
   - o quadro dos perfis;
   - motor e freio;
   - sob pressão;
   - diz × faz;
   - como coordenar: o que funciona, o que não funciona, a mudança por perfil;
   - lacunas;
   - fontes.

   Tudo vem com prova. Rode `conferir_provas.py` nele também.
2. **Escreva `_sistema/consultor/padroes.md`** a partir de `assets/consultor/padroes.md`. Ele traz o goal do mês e de 4 a 8 padrões do Retrato que atrapalham o goal. Cada padrão tem prova, o sinal que o denuncia e o que o consultor faz quando o vê.
3. **Instale o agente**, conforme a IA que o dono usa:
   - **Claude Code:** copie `assets/consultor/agente.md` para `~/.claude/agents/consultor.md` e troque `<NOME>` e `<COFRE>`. Ele chama com "/consultor" ou "me aconselha". Se já existir um arquivo com esse nome, mostre a diferença e pergunte antes.
   - **ChatGPT:** crie um Projeto chamado "Consultor". Cole o texto do agente nas instruções e anexe `perfis.md`, `padroes.md` e o goal do mês. Atualize os anexos todo mês.
   - **Codex:** o mesmo texto vai num arquivo `AGENTS.md` dentro de uma pasta `consultor/`, ao lado do cofre.
4. **Bloco automático (opcional, só Claude Code e com o OK dele):** para o consultor aparecer sozinho nas conversas de trabalho, copie `assets/consultor/regra.md` para `~/.claude/rules/consultor.md`. Sem isso, ele só fala quando é chamado.
5. Teste: peça ao consultor "qual é o meu foco desta semana?". Confira se cada frase entre aspas existe no cofre.

## Refazer todo mês

No fechamento do mês (Modo 4), depois do Retrato novo:

| Teste | Quando refazer | Por quê |
|---|---|---|
| 5 pilares, mindset, liderança situacional, DISC | Todo mês | Mudam com o comportamento. É aqui que se vê se ele melhorou. |
| Eneagrama | A cada 6 meses | O tipo quase não muda. O que muda é o quanto o freio pesa. |
| Conhecendo um a um | Quando uma lacuna ganhar resposta | É história, não comportamento. |

1. Grave arquivos **novos**, com a data do fechamento. Nunca edite o teste antigo: `20 Fontes/` só acumula.
2. Use os mesmos eixos e as mesmas áreas do mês anterior, para o painel comparar. Área nova pode entrar. Área antiga só sai se não houver mais nada sobre ela.
3. O painel desenha o teste anterior tracejado por baixo do atual e escreve o resultado antigo embaixo ("Em 12/11/2026: Média 5,6 de 10").
4. Em cada arquivo novo, escreva a seção "Desde o último teste". Diga o que subiu, o que caiu e o que ficou igual, com a prova da mudança.
5. Atualize `_sistema/consultor/perfis.md` com a seção "Evolução" e reescreva `padroes.md` com o goal novo.
6. No espelho do mês (`30 Diário/espelho AAAA-MM.md`), ponha uma linha por teste: antes, agora e o porquê.
