# De onde vem o material

O cérebro só é tão bom quanto a voz do dono que entra nele. Fontes, da mais rica para a menos:

| Fonte | Como entra | Observação |
|---|---|---|
| Conversas do Claude Code neste computador | `scripts/extrair_claude_code.py` | Ótima: é onde muita gente pensa em voz alta hoje. O Claude Code apaga conversas antigas depois de um tempo; puxe cedo. |
| Transcrição de aula, mentoria, reunião, áudio | O dono cola em `01 Inbox/` | Voz dele, mesmo colada. Em transcrição com várias pessoas, só as falas dele viram item. |
| WhatsApp no Mac | `scripts/extrair_whatsapp_mac.py` | Muito bom para pessoas, combinados e decisões. Áudios não vêm como texto. |
| Exportação do ChatGPT e do Claude do site | Arquivo da exportação em `01 Inbox/` | O histórico inteiro, inclusive o mais antigo. Chega por e-mail depois de pedir nas configurações de cada serviço. |
| Auditoria por memória (ChatGPT, Claude do site) | Modo Captura rodando no próprio app | Rápida, mas é resumo do que a IA lembra: `confianca: baixa` quando não há frase literal. Codex e ferramentas sem histórico não servem para isto. |
| Questionários e testes (Eneagrama, autoavaliações) | Em `20 Fontes/autoavaliacoes/` | Mostram como ele se vê, não como age. Viram hipótese para `autoimagem.md`. |

## Claude Code

```bash
# um dia, na tela
python3 -I <skill>/scripts/extrair_claude_code.py 2026-10-27
# um período, um arquivo por dia
python3 -I <skill>/scripts/extrair_claude_code.py 2026-06-01 2026-10-27 "<cofre>/20 Fontes/conversas-ia/claude-code"
```

O script lê `~/.claude/projects/*/*.jsonl` e deixa só o que foi digitado por uma pessoa: tira respostas da IA, resultados de ferramentas, avisos do sistema, mensagens entre sessões, blocos colados e repetições de conversas retomadas. Uma passada só pelos arquivos, mesmo para meses (segundos, não minutos).

Ele **não** separa: botão de sugestão clicado (parece digitado), colagem sem marca e brief escrito por outra IA no começo de uma conversa. Quem faz a ficha resolve isso lendo (`fichas.md`).

Muito material (meses): divida em lotes de dias que somem até ~230 mil caracteres, sem misturar meses, um subagente por lote para as fichas e os diários (em paralelo), e depois o ingest por faixa de datas em fila. Rode um piloto de 2 dias antes, confira e meça o consumo: o custo real em tokens costuma ser bem maior do que o tamanho do texto sugere.

## Exportação do Claude do site

Pedida em claude.ai → Configurações → Privacidade → Exportar dados. Chegam dois e-mails: "em andamento" e "prontos para download". O link do segundo baixa só um **índice** (`manifest-...json`) com um link por parte; cada link baixa um `.zip` e vale uma vez, por 24 horas, no navegador logado na conta. As partes que importam: `conversations` (as conversas), `memories` (o que o Claude resumiu da pessoa) e `projects` (instruções de projeto que ela escreveu).

```bash
python3 -I <skill>/scripts/extrair_claude_export.py conversations.json 2026-01-01 2026-12-31 "<cofre>/20 Fontes/conversas-ia/claude"
```

A memória do Claude entra como fonte de `confianca: baixa`: é resumo da IA, não fala da pessoa.

## Exportação do ChatGPT

Pedida em chatgpt.com → Configurações → Controles de dados → Exportar dados. Chega um e-mail com um link que vale 24 horas e baixa um `.zip`. Dentro dele, o que importa é o `conversations.json`. Exportações grandes dividem em `conversations-000.json`, `conversations-001.json`, e assim por diante.

```bash
python3 -I <skill>/scripts/extrair_chatgpt_export.py <pasta ou conversations.json> 2025-01-01 2026-12-31 "<cofre>/20 Fontes/conversas-ia/chatgpt"
```

O script segue só o ramo final de cada conversa: mensagem editada ou resposta regenerada não aparece duas vezes. Ficam de fora as instruções personalizadas e as respostas da IA. A memória do ChatGPT não vem na exportação. Para ela, use o Modo Captura no próprio ChatGPT, com `confianca: baixa`.

## Reuniões e aulas gravadas

Google Meet guarda as transcrições numa pasta do Google Drive (normalmente "Meet Recordings"), dentro das "Anotações do Gemini": o mesmo documento tem o resumo e, numa segunda aba, a transcrição completa com o nome de quem fala. Os arquivos `.gdoc` da pasta local são só atalhos (trazem o ID do documento, não o texto). O conector do Drive nem sempre acha esses documentos pela busca; pelo ID costuma abrir. Se não abrir, o navegador em que o dono está logado abre `https://docs.google.com/document/d/<ID>/mobilebasic?authuser=<conta>` com o texto inteiro. Com o Google Drive instalado no computador, a pasta aparece em `~/Library/CloudStorage/GoogleDrive-<conta>/`; sem ele, use um conector do Drive. Zoom, tl;dv e Fathom exportam a transcrição em texto. Copie para `01 Inbox/` só as reuniões em que o dono fala; o ingest separa as falas dele.

## Anotações que o dono já tem

Outro cofre do Obsidian, Notion, Apple Notes, uma pasta de textos. Entra só o que **ele escreveu**: diário, reflexões, rascunhos, roteiros. O que ele salvou de terceiros (artigos, cursos, prompts) é biblioteca, não cérebro.

## WhatsApp

| Onde o WhatsApp está | Dá para puxar tudo? | Como |
|---|---|---|
| App do WhatsApp no Mac | Sim, o que foi sincronizado | `scripts/extrair_whatsapp_mac.py` lê uma cópia do banco local |
| WhatsApp Web (navegador) | Não, na prática | O Web guarda pouco e cifrado no navegador. Conecte a mesma conta no app do Mac (o app sincroniza o histórico ao conectar) e use o script |
| Só no celular | Uma conversa por vez | No celular: conversa → nome no topo (iPhone) ou ⋮ → Mais (Android) → Exportar conversa → Sem mídia. Arquivo `.txt` em `01 Inbox/` |

O app do Mac guarda uma conta por vez. Para puxar a outra (pessoal × profissional), o dono troca a conta no app e roda o script de novo.

**Duas pastas, nunca uma terceira:** `20 Fontes/whatsapp-pessoal/` e `20 Fontes/whatsapp-profissional/`. A primeira puxada (o histórico) e a rotina diária da mesma conta vão para a mesma pasta; o nome do arquivo já diz se é do mês (`whatsapp AAAA-MM conversa.md`) ou do dia (`whatsapp AAAA-MM-DD conversa.md`). A rotina diária (`rotina_extrair.py`) grava o WhatsApp do Mac em `whatsapp-pessoal`; se o app do Mac estiver com a conta profissional, ajuste a saída.

**Atenção ao conectar uma conta nova no Mac:** o app só traz as últimas ~15 mensagens de cada conversa (mais os grupos e conversas muito ativos). O histórico só cresce dali para frente. Um WhatsApp conectado há anos tem tudo; um recém-conectado, quase nada. Para o passado de uma conta recém-conectada: exportar pelo celular as conversas que importam, ou ler o banco dentro de um backup do iPhone feito no Mac (Finder, sem criptografia), que tem o histórico completo.

### O que costuma valer e o que não vale

Num WhatsApp de trabalho típico, um terço das mensagens do dono tem menos de 20 caracteres ("ok", "bom dia") e outra boa parte é logística (convite de reunião, link, Pix). O que vale:

- **Grupos de clientes e de equipe:** decisões, combinados, como ele cobra e orienta. Alimenta `12 Pessoas/` e `lideranca.md`.
- **Grupos de alunos ou mentoria:** como ele ensina e o que ele repete.
- **Conversas com sócios e parceiros:** decisões de negócio.

O que não vale: conversas com bots e automações (inclusive a conversa do dono "consigo mesmo", que às vezes é só um robô respondendo), mensagens curtas, avisos automáticos. O script já mascara chaves de acesso e senhas; mesmo assim, não copie para o cofre conversa que é só troca de credenciais.

Sugestão de corte: as 20 a 30 conversas com mais texto do dono, dos últimos 12 meses.

## WhatsApp no Mac: comandos

O app do WhatsApp para Mac guarda as conversas sincronizadas em `~/Library/Group Containers/group.net.whatsapp.WhatsApp.shared/ChatStorage.sqlite`. Exportar pelo celular é uma conversa por vez; o banco traz tudo.

```bash
# 1. ver o que tem: conversas, mensagens dele, áudios, período
python3 -I <skill>/scripts/extrair_whatsapp_mac.py resumo
# 2. extrair as conversas escolhidas, um arquivo por conversa e por mês
python3 -I <skill>/scripts/extrair_whatsapp_mac.py extrair --desde 2025-11-01 --conversas "Nome 1" "Nome 2" --saida "<cofre>/20 Fontes/whatsapp-profissional"   # ou whatsapp-pessoal
```

O script trabalha numa cópia do banco; o WhatsApp não é tocado. Antes de extrair, mostre o resumo ao dono e deixe ele escolher as conversas: é a vida inteira dele e de outras pessoas ali.

- O extrato traz as mensagens dele e as dos outros (as dos outros só como contexto, para entender combinados). Na ficha entram só a voz dele e o que foi combinado ou decidido.
- Conversa com família ou amigos: sugira ao dono perguntar à outra pessoa antes; metade daquilo é a voz dela.
- Conversa do dono consigo mesmo (notas para si) costuma ser a mais rica de todas.
- Um WhatsApp por vez fica sincronizado no Mac. Para puxar outra conta (pessoal × profissional), o dono troca a conta no app e roda de novo.

## Gráficos dos perfis no painel

Cada autoavaliação em `20 Fontes/autoavaliacoes/` pode guardar os números no cabeçalho, em `painel:`. O Painel do Cérebro
desenha um cartão por teste no topo, com o resultado, a leitura e a mudança que vale cobrar (`mudar`). Sem `painel:`, a
seção não aparece. De cada tipo vale o arquivo de `data` mais recente.

```yaml
painel:
  eneagrama: { pontos: [13, 9, 12, 13, 7, 13, 14, 12, 11], principal: 7, asa: 6, leitura: "...", mudar: "..." }  # tipos 1 a 9, máx. 15
  disc: { pontos: [60, 82, 38, 68], natural: [75, 55, 30, 75], adaptado: [40, 85, 55, 65], leitura: "...", mudar: "..." }  # D, I, S, C de 0 a 100
  pilares: { eixos: [Mentalidade, Autoconhecimento, Pessoas, Estratégia, Confiança], pontos: [7, 6.3, 5.7, 5, 4.3], se-daria: [null, 7, null, 7, 3], geral: 5.6 }
  mindset: { areas: [Crítica, Delegar], pontos: [2, -1] }  # -2 foge muito, 2 encara
  situacional: { usa: [1, 4] }  # S1 dirigir, S2 orientar, S3 apoiar, S4 delegar
```

`natural`, `adaptado`, `se-daria`, `leitura` e `mudar` são opcionais.

Quando há dois testes do mesmo tipo com datas diferentes, o painel compara os dois:
- desenha o anterior tracejado por baixo do atual (no 5 pilares e no mindset);
- escreve o resultado antigo embaixo do novo, em todos os tipos.

Para a comparação funcionar, mantenha os mesmos `eixos` e os mesmos nomes de `areas` de um mês para o outro. Quem preenche os testes é o Modo 8 (`references/analise.md`).
