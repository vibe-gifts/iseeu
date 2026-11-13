# Modo 2. Ingest (só o curador)

Transforma o que está em `01 Inbox/` em notas do cérebro. É aqui que se decide o que é ideia, crença, decisão, e onde se criam links e tags.

Antes de começar, liste `40 Ideias/`, `12 Pessoas/`, `15 Projetos/` e `50 Memória/` (nomes e cabeçalhos) e leia `_sistema/tags.md` e `_sistema/glossario.md`. Processe em ordem de data e hora: a linha do tempo das notas precisa nascer em ordem.

Se o ingest for dividido entre vários agentes, divida **por faixa de datas e rode em fila**, nunca em paralelo: agentes simultâneos mexem nas mesmas notas e um apaga o trabalho do outro.

## 0. Exportações

A pessoa deixa em `01 Inbox/` o que exportou, com o nome que veio. Reconheça cada formato, rode o script certo e guarde o original fora da Inbox:

| Arquivo | O que é | O que fazer |
|---|---|---|
| `.zip` com `conversations.json` (ou `conversations-000.json`...) e `chat.html` | Exportação do ChatGPT | Descompacte numa pasta temporária, fora do cofre. Rode `scripts/extrair_chatgpt_export.py <pasta> <início> <fim> "<cofre>/20 Fontes/conversas-ia/chatgpt"`. Depois faça as fichas dos dias novos. |
| `.zip` ou `.json` com `chat_messages`, ou `manifest-...json` | Exportação do Claude do site | `scripts/extrair_claude_export.py` (veja `fontes.md`). |
| `.txt` com linhas `[dd/mm/aa, hh:mm] Nome: texto` ou `dd/mm/aaaa hh:mm - Nome: texto` | Conversa exportada do WhatsApp | Vire `20 Fontes/whatsapp-<pessoal ou profissional>/whatsapp AAAA-MM <conversa>.md`, com o cabeçalho de fonte. Na dúvida sobre pessoal ou profissional, pergunte. |
| `.m4a`, `.mp3`, `.ogg`, `.opus`, `.wav` | Áudio | `scripts/transcrever_audio.py`. O texto vira material bruto (passo 2). |

O início e o fim do extrato são do dia seguinte ao último já extraído daquela fonte até ontem. Nunca reescreva um dia que já existe. Os scripts já recusam.
O `.zip` original e os arquivos baixados não ficam no cofre: apague-os da pasta temporária depois de extrair. Diga à pessoa que pode apagar o .zip do computador.

## 1. Lote

Arquivo `lote <origem> ...` com várias fichas separadas por `===== FICHA =====`: separe em um arquivo por ficha em `01 Inbox/`, guarde o lote original em `20 Fontes/conversas-ia/<origem>/` e siga com as fichas.

## 2. Material bruto (arquivo sem cabeçalho)

É algo que o dono colou: aula, mentoria, reunião, áudio transcrito, texto dele.

1. Descubra o que é e a data, pelo conteúdo ou pelo nome. Sem data clara: data do arquivo e `data-incerta: true`.
2. Se for de terceiros (artigo, curso, post), não processe: avise que é material de biblioteca.
3. Acrescente o cabeçalho de fonte (`tipo: fonte`, `formato`, `data`, `origem`, `processado`), renomeie para `<formato> AAAA-MM-DD <assunto>` e mova para `20 Fontes/<formato>/`. O texto em si nunca muda.
4. Faça as fichas dele (Modo 1). Em aula ou reunião com várias pessoas, só as falas do dono viram item; a fala dos outros é contexto. Transcrição longa pode virar uma ficha por bloco de assunto.

## 3. Ficha

1. Leia o **Resumo para a IA**. Se não houver nada da voz do dono, `status: descartado`.
2. Para cada item, **procure antes de criar** (por título, sinônimo, apelido e glossário). Reforçar é melhor que duplicar.

| Item | O que fazer |
|---|---|
| ideia, crença, princípio **que já existe** | Linha nova na linha do tempo, em ordem de data (não repita linha da mesma data com o mesmo trecho). `forca` +1 se o dia for novo. Atualize `ultima-vez`. |
| ideia, crença, princípio **novo, tom firme** | Nota em `40 Ideias/` (modelo `ideia`), `status: hipotese`, `forca: 1`. Título: a ideia numa frase, do jeito que ele falaria. Nome do arquivo sem acento, curto. |
| tom **explorando** ou **pergunta** | Não vira nota. Fica só na ficha. |
| **decisão** curta | Linha na linha do tempo do projeto: `**Decidiu:** X em vez de Y. **Porque:** motivo. [[diário AAAA-MM-DD]]` |
| **decisão** grande (dinheiro, pessoas, rumo) | Nota em `50 Memória/decisoes/` (modelo `decisao-grande`, com 5W2H e espaço para o resultado depois). |
| decisão que **confirma uma ideia** | Some força na ideia: o que ele faz pesa mais que o que ele diz. |
| **história** | Nota em `50 Memória/historias/`, ou linha em `contada-em` se já existe. |
| **pessoa**, **combinado** | Procure em `12 Pessoas/` por nome e `apelidos:`. Existe: linha na linha do tempo; combinado vai também em "Combinados em aberto". Não existe: crie (modelo `pessoa`) na subpasta do círculo, só se a pessoa aparece de novo ou tem papel claro na vida dele. Família, pets e amigos: `privado: true`. Da fala dos outros, só o que foi combinado e decidido. |
| equipe ou sócio dirigido, orientado, apoiado ou delegado | Anote na nota da pessoa a dose de direção naquela frente. |
| **projeto** novo com decisão ou ideia firme | Nota em `15 Projetos/` (modelo `projeto`). Tag `projeto/<nome>`, registrada em "Propostas" de `_sistema/tags.md`. |
| algo que **contradiz** uma nota | Ligue com `contradiz:` e anote em `_sistema/propostas.md`. |
| **voz**, **revolta**, **autoimagem**, **correção** | Linha em `_sistema/propostas.md` com o arquivo de destino no Retrato. |

3. **Crença proposta:** ideia com `forca` 3 ou mais, ou confirmada por decisão → linha em `_sistema/propostas.md`: `- AAAA-MM-DD · arquivo do Retrato · afirmação · prova [[fonte]] "trecho"`.
4. Se há goal ativo em `02 Goal/`, item que mostra avanço ou recuo num comportamento do goal vira linha em "Acompanhamento" do goal.
5. **Agora sim**, links `[[nota]]` e tags do vocabulário, com os nomes certos do glossário. Tag nova só como proposta.
6. Ficha pronta: `status: processado`, mova para `20 Fontes/fichas/AAAA-MM/`.

## 4. Fechando

Uma linha em `_sistema/log.md`: `## [AAAA-MM-DD] ingest | N fichas, M brutos | X ideias novas, Y reforçadas, Z propostas`. No chat: um resumo curto e as dúvidas.

Nunca mexa em `00 Núcleo/` no ingest. O Retrato só muda no fechamento do mês.
