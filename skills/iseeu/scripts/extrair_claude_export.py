"""Extrai só o que a pessoa escreveu na exportação de dados do Claude (claude.ai).

Uso: python3 -I extrair_claude_export.py conversations.json INICIO FIM "pasta de saída"
     (datas AAAA-MM-DD; um arquivo por dia, no mesmo formato do extrato do Claude Code)

Fica de fora: respostas da IA, anexos e chaves (mascaradas).
Arquivo de um dia que já existe não é reescrito: `20 Fontes/` só acumula.
Serve também para o JSON que a rotina diária baixa do claude.ai pelo navegador (mesmo formato).
"""
import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from segredos import mascarar  # noqa: E402


def texto(msg):
    if msg.get("text"):
        return msg["text"]
    return "\n".join(p.get("text", "") for p in msg.get("content") or [] if p.get("type") == "text")


def main(arquivo, inicio, fim, saida):
    por_dia = {}
    for conv in json.load(open(arquivo)):
        msgs = []
        for m in conv.get("chat_messages") or []:
            if m.get("sender") != "human":
                continue
            t = mascarar(texto(m).strip())
            if not t:
                continue
            quando = datetime.fromisoformat(m["created_at"].replace("Z", "+00:00")).astimezone()
            dia = quando.date().isoformat()
            if inicio <= dia <= fim:
                msgs.append((dia, quando.strftime("%H:%M"), t))
        for dia, hora, t in msgs:
            por_dia.setdefault(dia, {}).setdefault(conv["uuid"], (conv.get("name") or "sem título", []))[1].append((hora, t))
    os.makedirs(saida, exist_ok=True)
    for dia, convs in sorted(por_dia.items()):
        total = sum(len(m) for _, m in convs.values())
        caminho = os.path.join(saida, f"claude-site {dia}.md")
        if os.path.exists(caminho):
            print(f"já existe, não reescrevi: claude-site {dia}.md")
            continue
        with open(caminho, "w") as f:
            f.write(f"---\ntipo: fonte\nformato: conversa-ia\ndata: {dia}\norigem: \"Claude do site (exportação), só mensagens digitadas\"\n"
                    f"conversas: {len(convs)}\nmensagens: {total}\n---\n\n")
            for uuid, (nome, msgs) in sorted(convs.items(), key=lambda x: x[1][1][0][0]):
                f.write(f"## {msgs[0][0]} · {nome}\n\nOriginal: claude.ai/chat/{uuid}\n\n")
                for hora, t in msgs:
                    f.write(f"**{hora}**\n\n" + "\n".join("> " + l for l in t.splitlines()) + "\n\n")
    print(f"{len(por_dia)} dias")


if __name__ == "__main__":
    main(*sys.argv[1:5])
