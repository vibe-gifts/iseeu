# Modo 0. Preparação

Rápido. Rode no primeiro uso de cada sessão e sempre que pedirem para criar ou configurar o cérebro.

## Cofre novo (não há `_sistema/dono.md`)

Quem chega aqui acabou de baixar a skill e não sabe nada de pastas ou scripts. Conduza a conversa, **uma pergunta por vez**, e diga sempre o que vai acontecer antes de fazer. O caminho inteiro tem 10 passos. No começo, mostre a lista em uma linha por passo, para a pessoa saber onde está.

1. **Quem é e com o que trabalha.** Pergunte o nome, como prefere ser chamado e o pronome. Pergunte também com quais IAs ela conversa (Claude Code, Claude no site, ChatGPT, Codex) e se usa Mac ou Windows.
   - **Defina o curador** (a IA que organiza o cofre). Ele precisa gravar arquivos no computador. Por isso, o curador é o Claude Code ou o Codex. Grave isso em `curador:` no `dono.md`.
   - Quem só usa o ChatGPT instala o Codex, que vem com a mesma conta. O ChatGPT do site e do app fica como capturador.
   - Se o curador for o Codex, escreva no `AGENTS.md` do cofre o caminho completo da pasta da skill. É por ele que o Codex acha as instruções.
2. **Onde fica o cofre.** Pergunte se ela já usa o Obsidian.
   - Sem Obsidian, guie a pessoa:
     1. Baixar em obsidian.md e abrir o app.
     2. Clicar em **Criar** (ou "Criar novo cofre").
     3. Dar o nome "Segundo cérebro".
     4. Em "Local", escolher uma pasta com backup: iCloud Drive, Google Drive ou Documentos. Clicar em **Criar**.
   - Para achar a pasta do cofre sem perguntar o caminho, procure pela pasta oculta `.obsidian`: `find ~ -maxdepth 7 -type d -name .obsidian -not -path "*/Library/Caches/*" 2>/dev/null`. Confirme com a pessoa pelo nome.
   - Depois, copie o esqueleto **sem sobrescrever** nada que já exista:
     `python3 -I <skill>/scripts/criar_estrutura.py "<cofre>"`
3. **Preencha `_sistema/dono.md`.** Ele leva:
   - nome, pronome, apelidos, idioma e `slug` (nome curto sem acento, usado no agente pessoal);
   - curador;
   - manias de fala que quem lê precisa saber (ex.: "'não sei se' é o jeito dele de propor").
4. **Mapa das fontes** (seção abaixo): descubra onde está a voz dela.
5. **Como o material chega** (seção abaixo): para cada fonte, diga se você pega sozinho ou se ela exporta e manda. Diga também onde deixar.
6. **Conectores** (seção abaixo): só para as fontes que moram fora do computador.
7. **Cor e plugins** (seção abaixo). Depois confira:
   `python3 -I <skill>/scripts/instalar_plugins.py "<cofre>" --verificar`
   Só diga que está pronto com tudo `ok`.
8. **Primeira carga e ingest.** Puxe o histórico das fontes que ela aprovou: os últimos 3 a 12 meses, conforme o volume. Faça as fichas e o ingest (Modos 1 e 2).
   - Muito material: rode um piloto de 2 dias, mostre o resultado e o custo, e só depois siga. Diga o custo em palavras simples. Exemplo: "meses de conversa podem gastar o limite de uso de alguns dias da sua assinatura; posso ir em partes, um mês por dia".
   - Ao terminar, diga quantos dias, fichas e notas entraram.
   - **Retrato inicial:** rode os passos 1 a 3 do fechamento do mês (Modo 4) para escrever o primeiro `00 Núcleo/`, tudo como `hipotese`. Sem Retrato, a análise e o agente pessoal não têm onde se apoiar.
   - **Agente pessoal:** com o OK da pessoa, crie o agente que responde como ela, a partir de `assets/agente.md` (Modo 4, passo 7).
9. **Primeira análise e o consultor** (Modo 8, `references/analise.md`). Esse é o momento que a pessoa espera: os seis testes preenchidos pelo que ela fez, os gráficos no painel e o consultor que sabe como coordená-la.
10. **Rotinas automáticas e goal** (seção abaixo).
    - Ligue a rotina diária e a mensal.
    - Ofereça a entrevista do goal do mês (Modo 5): é o goal que dá direção ao consultor.

O `dono.md` é o arquivo que mais muda a qualidade da leitura. Num teste, a mesma skill acertou 6 de 6 com ele preenchido e 4 de 6 sem ele. Sem o arquivo, a IA:
- tomou o nome de uma loja deformado pela transcrição de voz como se fosse o nome certo;
- não reconheceu os apelidos;
- errou o pronome da dona.

Capriche nos apelidos, nas deformações de voz e nas manias de fala.

## Cofre que já existe

1. **Plugins:** rode `python3 -I <skill>/scripts/instalar_plugins.py "<cofre>" --verificar`. Se faltar algum, diga qual e ofereça instalar. Só instale com o OK do dono; depois ele recarrega o Obsidian e, na primeira vez, aceita ligar os plugins da comunidade.
2. **Goal:** sem `02 Goal/goal AAAA-MM.md` do mês atual com `status: ativo`, ofereça a entrevista do goal antes de qualquer outra coisa.
3. **Caixa de entrada:** diga quantos arquivos esperam em `01 Inbox/`.

## Mapa das fontes

O cérebro só aprende com o que entra nele, e cada pessoa guarda a própria voz num lugar diferente. Antes de puxar qualquer coisa, pergunte ao dono, um item por vez, e **diga o que vai pegar, de onde e o que fica de fora**:

| Pergunte | Exemplos de resposta | O que fazer |
|---|---|---|
| Com quais IAs você conversa? | Claude Code, Claude no site, ChatGPT, Codex | Claude Code: script local. Site e ChatGPT: captura no próprio app e exportação de dados. Codex: as conversas ficam em `~/.codex/sessions`. |
| Suas reuniões e aulas são gravadas ou transcritas? Onde ficam? | Pasta do Google Meet no Drive, Zoom, tl;dv, Fathom | Ler as transcrições da pasta (pelo Google Drive instalado no computador ou por um conector) e copiar para `01 Inbox/`. Só as falas do dono viram item. |
| Você já anota coisas em algum lugar? | Outro cofre do Obsidian, Notion, Apple Notes, pasta de anotações, Google Docs | Puxar só o que **ele escreveu** (diário, reflexões, rascunhos). Material salvo de terceiros fica de fora. |
| Qual WhatsApp tem mais de você? Ele está no app do Mac, no WhatsApp Web ou só no celular? | Profissional no app do Mac, pessoal no Web | Ver "WhatsApp" em `fontes.md`. Sempre mostrar o resumo e deixar ele escolher as conversas. |
| Você grava áudios para si mesmo ou para outros? | Memos de voz, áudios no WhatsApp | Áudio só entra transcrito. Combinar como transcrever antes. |
| Tem algo que nunca deve entrar? | Conversas com cliente X, saúde, um grupo da família | Anotar em "Nunca entra" no `dono.md`. |

Registre a resposta em `_sistema/dono.md`, seção "Fontes", numa tabela: fonte, onde está, como entra, o que fica de fora, situação (a puxar, puxado até AAAA-MM-DD, recusado).

## Como o material chega

Para cada fonte do mapa, há dois caminhos: **eu pego sozinho**, quando a fonte está neste computador, ou **você me manda**, quando só ela consegue exportar. Diga qual vale para cada uma, com o passo exato.

**Tudo o que ela mandar vai para uma pasta só: `01 Inbox/`.** Pode ser arquivo .zip, .json, .txt, áudio ou texto colado, com qualquer nome. O ingest reconhece cada formato e sabe o que fazer (veja "0. Exportações" em `ingest.md`). Ela não precisa organizar nada.

| Fonte | Eu pego sozinho, se... | Você me manda: o passo a passo | Quanto demora |
|---|---|---|---|
| Claude Code | ...ele roda neste computador (`~/.claude/projects`) | Nada a fazer. | Na hora |
| Codex | ...ele roda neste computador (`~/.codex/sessions`) | Nada a fazer. | Na hora |
| WhatsApp | ...o app do WhatsApp está instalado e conectado neste Mac. Mostre o resumo, ela escolhe as conversas, e as que entram todo dia vão para `_sistema/whatsapp-rotina.txt`, uma por linha | No celular: abrir a conversa → nome no topo (iPhone) ou ⋮ → Mais (Android) → **Exportar conversa** → **Sem mídia**. Mandar o .txt para o computador e deixar em `01 Inbox/`. Uma conversa por vez: escolha as 10 a 20 mais importantes. | 1 minuto por conversa |
| ChatGPT | Não dá: o histórico só sai pela exportação | chatgpt.com → foto do perfil → **Configurações** → **Controles de dados** → **Exportar dados** → Confirmar. Chega um e-mail com o link (vale 24 horas). Baixar o .zip e deixar em `01 Inbox/`. | De minutos a 1 dia |
| Claude do site e do app | ...a pessoa usa o Chrome com a extensão do Claude conectada: o script `scripts/claude_site_chrome.js` baixa as conversas direto, na conta dela (veja `fontes.md`) | claude.ai → **Configurações** → **Privacidade** → **Exportar dados**. Chegam dois e-mails. Clicar no link do segundo e deixar em `01 Inbox/` o que baixar. Se vier só um arquivo de índice (`manifest-...json`), abra você os links dele no navegador dela, um por vez. | De minutos a 1 dia |
| Reuniões e aulas gravadas | ...o Google Drive está instalado no computador, ou há conector do Drive | Exportar a transcrição em texto (Meet, Zoom, tl;dv, Fathom) e deixar em `01 Inbox/`. | 1 minuto por reunião |
| Áudios | ...estão numa pasta do computador | Mandar os arquivos de áudio para `01 Inbox/`. Eles são transcritos aqui mesmo, sem sair do computador (`scripts/transcrever_audio.py`). Na primeira vez, instale a transcrição (veja abaixo). | Alguns minutos |
| Anotações (Notion, Apple Notes, outro cofre) | ...estão numa pasta do computador | Exportar como Markdown ou texto e deixar em `01 Inbox/`. Só o que ela escreveu. | Alguns minutos |

**Transcrição de áudio (só Mac, uma vez):** ela precisa de três coisas. Instale com o OK da pessoa:
```bash
brew install whisper-cpp ffmpeg          # sem o Homebrew, instale antes: brew.sh
mkdir -p ~/.local/share/whisper-models
curl -L -o ~/.local/share/whisper-models/ggml-large-v3-turbo-q5_0.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q5_0.bin
```
O modelo tem cerca de 550 MB e roda no próprio computador. Teste com um áudio curto antes de ligar `--transcrever` no WhatsApp.

Combine também a frequência. As fontes que eu pego entram todo dia pela rotina diária. As exportações (ChatGPT, Claude do site, WhatsApp do celular) a pessoa refaz **uma vez por mês**, antes do fechamento do mês. A rotina mensal lembra disso.

## Conectores (MCP e Composio)

O conector é o que deixa a IA ler uma fonte que mora fora do computador (e-mail, Drive, WhatsApp num sistema). Fonte que já está no computador não precisa de conector: Claude Code, Codex e WhatsApp do app do Mac entram pelos scripts.

Pergunte o que ele usa e sugira só o que serve às fontes dele. Antes de sugerir, veja o que já está ligado (a lista de ferramentas da sessão ou `claude mcp list`): conector repetido para a mesma fonte é custo sem ganho.

| Fonte dele | Conector sugerido | O que ele traz |
|---|---|---|
| Reuniões do Google Meet, documentos no Drive | **Composio** com Google Drive (ou o conector do Google Drive do Claude) | Transcrições das "Anotações do Gemini"; `scripts/reunioes_meet.py` grava o texto baixado |
| Gmail | Composio com Gmail | E-mails que **ele escreveu** (combinados, propostas). Caixa de entrada inteira não entra |
| Google Agenda | Composio com Google Calendar | Contexto do diário: com quem ele esteve e quando |
| Notion, Google Docs, Apple Notes | Composio com Notion / Google Docs; Apple Notes pelo Mac | Só o que ele escreveu |
| Slack, ClickUp, Trello | Composio (ou o conector oficial de cada um) | Decisões e como ele cobra a equipe |
| WhatsApp num sistema de atendimento (DeskComm, Evolution, Z-API) | O MCP do próprio sistema, só leitura | Conversas do número profissional sem depender do app do Mac |
| Zoom, tl;dv, Fathom | Composio, se o serviço estiver lá; senão, exportar o texto | Transcrições |

O Composio (`https://connect.composio.dev/mcp`) é um conector só que dá acesso a centenas de serviços; cada serviço é ligado uma vez, com o login do dono, na tela do Composio. Para instalar no Claude Code:

```bash
claude mcp add --transport http composio https://connect.composio.dev/mcp
```

Ligar conector pede o login dele: mostre o passo, e ele faz. Registre em `_sistema/dono.md`, na tabela de fontes, qual conector cada fonte usa.

## Cor e plugins

O cérebro é Markdown puro: nenhum plugin é obrigatório para ele funcionar. Os plugins servem para o dono ler e mexer melhor.

**Cor:** antes de instalar, pergunte de que cor ele quer o painel e o mapa do cérebro. Ofereça 4 ou 5 opções com o código (azul `#286EEA`, verde `#2E9E6B`, roxo `#7C4DFF`, laranja `#F07A1A`, rosa `#E0457B`) e aceite qualquer cor da marca dele. Sem resposta, use o azul. Os tons mais claros e mais escuros saem dessa cor sozinhos. Ele pode trocar depois em Configurações → Painel do Cérebro.

**Instalar** (cria `.obsidian/` se o cofre nunca foi aberto, liga os nativos, aponta os modelos para `_sistema/modelos`, copia o painel com a cor e baixa os outros três da página oficial de cada um no GitHub):

```bash
python3 -I <skill>/scripts/instalar_plugins.py "<cofre>" --cor "#2E9E6B"
# sem internet, copiando de outro cofre que já tem os plugins:
python3 -I <skill>/scripts/instalar_plugins.py "<cofre>" --cor "#2E9E6B" --de-cofre "<outro cofre>"
```

O script termina com a conferência. Depois o dono abre (ou recarrega) o cofre no Obsidian e, na primeira vez, clica em "Ativar plugins da comunidade". Se algum plugin falhar no download, ele instala pela loja (Configurações → Plugins da comunidade → Procurar) e você roda `--verificar` de novo.

| Plugin | Para quê | Como instalar |
|---|---|---|
| Painel do Cérebro (vem com a skill) | Resumo do cérebro numa barra lateral (inbox, goal, termômetro, ideias mais fortes, últimos diários) e o mapa do cérebro no lugar do grafo | `instalar_plugins.py` copia e grava a cor |
| Advanced Tables (`table-editor-obsidian`) | As notas têm muitas tabelas | `instalar_plugins.py` baixa |
| Tag Wrangler (`tag-wrangler`) | Renomear e juntar tags quando o vocabulário mudar | Idem |
| Colored Tags (`colored-tags`) | Áreas e projetos com cor | Idem |

Nativos que o script liga em `core-plugins.json`: `bases`, `properties`, `backlink`, `outgoing-link`, `templates` (pasta de modelos: `_sistema/modelos`), além dos de navegação.

Não fazem falta: Dataview (o Bases nativo cobre), Templater (a IA escreve as notas), Kanban (o goal usa checklist).

## Rotinas automáticas

O cérebro só cresce se o material entrar sozinho. Ligue duas rotinas, com o horário que a pessoa escolher, e mostre como desligar.

| Rotina | Quando | O que faz | Modelo do pedido |
|---|---|---|---|
| Diária | Todo dia de manhã (sugira 7h ou 9h) | Puxa a fala de ontem, faz as fichas, roda o ingest e escreve o diário. Às segundas, faz também o foco da semana. | `assets/rotinas/diaria.md` |
| Mensal | Dia 1, de manhã | Fecha o mês, refaz a análise de perfil para ver se melhorou e atualiza o consultor. | `assets/rotinas/mensal.md` |

Troque `<NOME>`, `<COFRE>` e `<SKILL>` no modelo antes de criar.

**Claude Code (app do Claude no computador).**
- Se a sessão tem a ferramenta de tarefas agendadas (`create_scheduled_task`), crie as duas com ela. Use o texto do modelo como pedido e o cofre como pasta de trabalho.
- As tarefas rodam no computador, então ele precisa estar ligado e com o app aberto na hora marcada. Se estiver desligado, a tarefa roda quando o app abrir.
- A primeira execução pede licença para os comandos da rotina. Rode a rotina uma vez com a pessoa olhando. Em cada pedido de licença, ela clica na opção de permitir sempre. Depois disso, a rotina roda sozinha.
- **Sem essa ferramenta** (só o terminal): use o agendador do sistema. No Mac e no Linux, é o `crontab -e`, com uma linha por rotina:
  ```
  0 7 * * * cd "<COFRE>" && claude -p "$(cat '<COFRE>/_sistema/rotina-diaria.md')" --permission-mode acceptEdits >> "<COFRE>/_sistema/rotina.log" 2>&1
  ```
  Você mesmo escreve tudo isso. A pessoa só aprova. Grave o pedido em `_sistema/rotina-diaria.md` (e `rotina-mensal.md`).
  Libere os scripts da skill em `.claude/settings.json` do cofre (`"allow": ["Bash(python3 -I <SKILL>/scripts/*)"]`). Sem isso, a rotina para esperando licença.

**Windows:** no lugar do `crontab`, use o Agendador de Tarefas, com o mesmo comando. Os scripts do WhatsApp e da transcrição de áudio só funcionam no Mac: no Windows, o WhatsApp entra pela exportação do celular.

**Codex.**
- Use a automação agendada do app do Codex, se a versão dela tiver.
- Se não tiver, use o mesmo `crontab`, trocando o comando por `codex exec "<pedido>"`, rodado de dentro do cofre.
- O Codex lê o `AGENTS.md` do cofre, que aponta para a skill.

**ChatGPT (site ou app).** Ele não grava no computador, então não roda a rotina. Ele ajuda de dois jeitos:
1. **Projeto "Segundo cérebro"** no ChatGPT, com o texto de `references/fichas.md` nas instruções. No fim do dia, ela pede "faz as fichas de hoje", copia a resposta e cola num arquivo em `01 Inbox/`. A rotina do curador faz o resto.
2. **Lembrete mensal:** uma tarefa agendada no próprio ChatGPT, todo dia 28: "me lembre de exportar meus dados do ChatGPT e deixar o .zip em `01 Inbox/` do cofre".

Depois de ligar, rode a rotina diária uma vez, na frente da pessoa, e mostre o recado. Só diga que está pronto quando ela tiver visto o primeiro diário escrito.
