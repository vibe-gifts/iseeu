"""Extrai só o que a pessoa digitou nas conversas do Codex (~/.codex/sessions).

Uso: python3 -I extrair_codex.py INICIO FIM "pasta de saída"   (datas AAAA-MM-DD; um arquivo por dia)

Fica de fora: respostas da IA, instruções de sistema e de projeto que o Codex injeta,
ferramentas, repetições e chaves (mascaradas).
"""
import glob
import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from segredos import mascarar  # noqa: E402

RAIZ = os.path.expanduser("~/.codex/sessions")
INJETADO = ("<", "The following is", "# AGENTS", "#AGENTS")


def main(inicio, fim, saida):
    por_dia, vistas = {}, set()
    for arquivo in sorted(glob.glob(f"{RAIZ}/**/*.jsonl", recursive=True)):
        for linha in open(arquivo, errors="ignore"):
            try:
                d = json.loads(linha)
            except ValueError:
                continue
            p = d.get("payload") or {}
            if d.get("type") != "response_item" or p.get("type") != "message" or p.get("role") != "user":
                continue
            t = "\n".join(c.get("text", "") for c in p.get("content", []) if c.get("type") == "input_text").strip()
            if not t or t.startswith(INJETADO) or "<environment_context>" in t[:200]:
                continue
            chave = (d["timestamp"][:16], t[:200])
            if chave in vistas:
                continue
            vistas.add(chave)
            quando = datetime.fromisoformat(d["timestamp"].replace("Z", "+00:00")).astimezone()
            dia = quando.date().isoformat()
            if inicio <= dia <= fim:
                sessao = os.path.basename(arquivo)
                por_dia.setdefault(dia, {}).setdefault(sessao, []).append((quando.strftime("%H:%M"), mascarar(t)))
    os.makedirs(saida, exist_ok=True)
    for dia, sessoes in sorted(por_dia.items()):
        total = sum(len(m) for m in sessoes.values())
        with open(os.path.join(saida, f"codex {dia}.md"), "w") as f:
            f.write(f"---\ntipo: fonte\nformato: conversa-ia\ndata: {dia}\norigem: \"Codex neste Mac, só mensagens digitadas\"\n"
                    f"conversas: {len(sessoes)}\nmensagens: {total}\n---\n\n")
            for sessao, msgs in sorted(sessoes.items(), key=lambda x: x[1][0][0]):
                f.write(f"## {msgs[0][0]} · codex\n\nOriginal: `~/.codex/sessions/.../{sessao}`\n\n")
                for hora, t in msgs:
                    f.write(f"**{hora}**\n\n" + "\n".join("> " + l for l in t.splitlines()) + "\n\n")
    print(f"{len(por_dia)} dias")


if __name__ == "__main__":
    main(*sys.argv[1:4])
