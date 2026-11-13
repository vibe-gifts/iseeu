---
name: iseeu
description: >-
  iseeu (segundo cérebro e consultor pessoal). Use sempre que pedirem para criar, instalar ou configurar o segundo cérebro ("acabei de baixar",
  "monta meu cérebro"), "faz o ingest", "processa a inbox", "faz meu DISC", "me analisa pelos
  fatos", "quem eu sou de verdade", "monta meu consultor", "liga as rotinas", "roda o diário", "joga isso no meu cérebro", "audita meu histórico para o cérebro",
  "fecha o mês", "vamos definir o goal", "me entrevista sobre X", "o que eu penso sobre X",
  "responde como eu", ou antes de escrever conteúdo ou decidir em nome do dono do cofre. Vale para
  um segundo cérebro pessoal no Obsidian: o mapa de como a pessoa pensa, fala, decide e se
  relaciona, feito do que ela disse e fez (conversas com IA, aulas, áudios, WhatsApp), não do que
  ela leu. Não use para guardar artigos, cursos e prompts de terceiros (isso é biblioteca, não
  cérebro).
version: 1.2.0
author: taiancarvalho
tags: [pessoal, obsidian, cerebro, ingest]
related_skills: []
---

# Segundo cérebro

Um cofre do Obsidian que guarda **a pessoa**: o que ela pensa, acredita, fala, decide, como se relaciona e para onde quer ir. Não guarda o que ela leu. A diferença importa: uma biblioteca diz "o que existe sobre isso"; o cérebro diz "o que essa pessoa acha disso e como ela faria".

O cofre tem um **dono** (a pessoa) e um arquivo `_sistema/dono.md` com o nome dele, os apelidos, o caminho das fontes e quem é o curador. Leia esse arquivo antes de qualquer coisa: é ele que torna esta skill pessoal sem que a skill precise saber de ninguém.

## Dois papéis

| Papel | Quem | O que faz |
|---|---|---|
| **Capturador** | Qualquer IA (ChatGPT, Codex, Claude do site, subagentes) | Lê conversas e textos e grava **fichas** em `01 Inbox/`. Não escreve em nenhum outro lugar. |
| **Curador** | Uma IA só, a que está em `curador:` no `dono.md` | Faz o ingest: decide o que é ideia, crença, decisão, cria notas, links e tags, reescreve o Retrato. |

Se você não é o curador, use só o **Modo Captura**. O motivo: com duas IAs organizando o mesmo cofre, a mesma ideia nasce com dois nomes e o cérebro se duplica. Quem lê anota; quem cura decide e conecta.

## As camadas (regra de mudança de cada pasta)

| Pasta | Regra |
|---|---|
| `01 Inbox/` | Só passagem. Tudo entra aqui; o ingest esvazia. |
| `02 Goal/` | Um goal por mês, escrito pelo dono. Objetivos só mudam com o OK dele; o acompanhamento só acumula. |
| `20 Fontes/`, `30 Diário/` | Só acumulam. Nunca editar. |
| `40 Ideias/`, `50 Memória/`, `12 Pessoas/`, `15 Projetos/`, `10 Áreas/` | Notas vivas: só crescem. Mudança de opinião vira linha nova na linha do tempo, o antigo fica. |
| `00 Núcleo/` | O Retrato: lista fechada de 11 arquivos, reescrita uma vez por mês, com a versão anterior guardada em `_versoes/`. |

O desenho completo (pastas, Retrato, degraus de crença, tags, privacidade) está em `references/desenho.md`. Leia na primeira vez que usar a skill num cofre.

## Regras que valem em todos os modos

1. **Só a voz do dono.** Texto de IA, avisos do sistema e texto de terceiros colado não são dele. O critério é quem falou, não se foi colado: a transcrição da aula dele é voz dele.
2. **Toda afirmação tem prova:** frase literal e link para a fonte. Sem prova, não entra.
3. **O que ele faz pesa mais do que o que ele diz.** Uma decisão coerente com uma ideia vale mais que três frases.
4. **Nunca inventar a opinião dele.** Sem registro, diga que não sabe e ofereça a entrevista.
5. **Privacidade:** notas com `privado: true` (família, pets, amigos) nunca são usadas para responder a terceiros nem para agir no lugar dele.
6. Tudo tem data. Nada se apaga.
7. **Chaves e senhas nunca entram.** Os scripts já mascaram (`scripts/segredos.py`); lendo à mão, troque por `[chave removida]`.

## Modos

Escolha o modo pelo pedido. Cada um tem o passo a passo num arquivo de referência; leia o arquivo do modo antes de executar.

| Modo | Quando | Quem | Referência |
|---|---|---|---|
| **0. Preparação** | Primeiro uso numa sessão, ou "cria/configura meu segundo cérebro": pastas, fontes, conectores, cor e plugins | Curador | `references/preparacao.md` |
| **1. Captura** | "audita meu histórico", "faz as fichas de ontem", "manda isso pro meu cérebro" | Qualquer um | `references/fichas.md` |
| **2. Ingest** | "faz o ingest", "processa a inbox" | Curador | `references/ingest.md` |
| **3. Diário** | "roda o diário", rotina diária | Curador | `references/rotinas.md` |
| **4. Fechamento do mês** | "fecha o mês", dia 1 | Curador | `references/rotinas.md` |
| **5. Goal do mês** | "vamos definir o goal" | Curador | `references/rotinas.md` |
| **6. Entrevista** | "me entrevista sobre X" | Curador | `references/rotinas.md` |
| **7. Consulta** | "o que eu penso sobre X", "responde como eu", conteúdo ou decisão em nome dele | Qualquer um (só lê) | `references/rotinas.md` |
| **8. Análise de perfil** | Depois do primeiro ingest grande, "faz meu DISC", "me analisa", e todo mês no fechamento: seis testes preenchidos pelos fatos, gráficos no painel e o consultor | Curador | `references/analise.md` |

**Primeiro uso, de quem acabou de baixar:** comece pelo Modo 0. Ele conduz a instalação inteira em 10 passos, do cofre vazio ao primeiro diário, passando pela primeira análise (Modo 8), pelo consultor e pelas rotinas.

**`<skill>` nos comandos** é a pasta onde está este SKILL.md. Descubra o caminho completo dela no começo da sessão e use sempre o caminho inteiro, entre aspas.

**Rotina diária** = Modo 1 nas conversas do dia anterior + Modo 2 + Modo 3. O primeiro passo é `scripts/rotina_extrair.py "<cofre>" [AAAA-MM-DD]`, que puxa Claude Code, Codex e as conversas de WhatsApp listadas em `_sistema/whatsapp-rotina.txt` (um arquivo por dia, sem reescrever o que já existe).

## De onde vem o material

`references/fontes.md` explica cada fonte e o script que a transforma em texto limpo:

- Conversas do Claude Code no computador: `scripts/extrair_claude_code.py`
- WhatsApp do Mac (banco local): `scripts/extrair_whatsapp_mac.py` (`--transcrever` transforma os áudios do dono em texto)
- Áudio avulso ou do DeskComm: `scripts/transcrever_audio.py` (Whisper deste Mac, nada sai do computador)
- Exportação do ChatGPT: `scripts/extrair_chatgpt_export.py`. Exportação do Claude do site: `scripts/extrair_claude_export.py`
- Conversa exportada do WhatsApp do celular, transcrições de aula, áudios, texto colado: direto na `01 Inbox/` (o ingest reconhece cada formato)

## O que vem junto com a skill

- `assets/estrutura/`: o esqueleto de um cofre novo (pastas, Retrato vazio, modelos, regras para agentes). O Modo 0 copia para o cofre.
- `assets/painel-do-cerebro/`: plugin do Obsidian com o resumo do cérebro numa barra lateral e o mapa do cérebro, na cor que o dono escolher. `scripts/instalar_plugins.py` instala ele e os outros plugins, e confere (`--verificar`).
- `assets/consultor/`: modelos do consultor. São quatro: o agente, o documento de perfis (como coordenar a pessoa), os padrões que ele vigia e o bloco automático nas conversas. O Modo 8 preenche.
- `assets/rotinas/`: o pedido da rotina diária e o da mensal, para agendar no Claude Code ou no Codex.
- `scripts/conferir_provas.py`: confere se cada frase citada como prova existe no cofre. Rode antes de mostrar qualquer análise.
- `assets/agente.md`: modelo do agente pessoal (um subagente do Claude Code que responde como o dono), atualizado no fechamento do mês.
