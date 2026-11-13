"""Extrai só o que a pessoa escreveu na exportação de dados do ChatGPT.

Uso: python3 -I extrair_chatgpt_export.py conversations.json INICIO FIM "pasta de saída"
     (datas AAAA-MM-DD; um arquivo por dia, no mesmo formato do extrato do Claude Code)

A exportação é pedida em ChatGPT → Configurações → Controles de dados → Exportar dados. Chega um
e-mail com um .zip; dentro dele está o conversations.json (exportações novas podem dividir em
conversations-000.json, conversations-001.json...: passe a pasta e o script lê todos).

Fica de fora: respostas da IA, mensagens do sistema, ferramentas, anexos e chaves (mascaradas).
Só segue o ramo final de cada conversa: mensagens editadas e regeneradas não se repetem.
Arquivo de um dia que já existe não é reescrito: `20 Fontes/` só acumula.
"""
import glob
import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from segredos import mascarar  # noqa: E402


def arquivos(caminho):
    if os.path.isdir(caminho):
        return sorted(glob.glob(os.path.join(caminho, "conversations*.json")))
    return [caminho]


def ramo_final(conv):
    """Mensagens do ramo que a pessoa viu por último, da primeira para a última."""
    mapa = conv.get("mapping") or {}
    no = conv.get("current_node")
    if no not in mapa:  # sem nó final: pega a folha mais recente
        folhas = [k for k, v in mapa.items() if not v.get("children")]
        no = max(folhas, key=lambda k: ((mapa[k].get("message") or {}).get("create_time") or 0), default=None)
    caminho = []
    while no and no in mapa:
        caminho.append(mapa[no].get("message"))
        no = mapa[no].get("parent")
    return [m for m in reversed(caminho) if m]


def texto(msg):
    c = msg.get("content") or {}
    if c.get("content_type") not in ("text", "multimodal_text"):
        return ""
    return "\n".join(p for p in c.get("parts") or [] if isinstance(p, str))


def main(origem, inicio, fim, saida):
    por_dia = {}
    for arq in arquivos(origem):
        for conv in json.load(open(arq, encoding="utf-8")):
            cid = conv.get("conversation_id") or conv.get("id") or ""
            nome = conv.get("title") or "sem título"
            for m in ramo_final(conv):
                if (m.get("author") or {}).get("role") != "user":
                    continue
                if (m.get("metadata") or {}).get("is_visually_hidden_from_conversation"):
                    continue  # instruções personalizadas e afins, não é fala do dia
                t = mascarar(texto(m).strip())
                quando = m.get("create_time") or conv.get("create_time")
                if not t or not quando:
                    continue
                q = datetime.fromtimestamp(quando).astimezone()
                dia = q.date().isoformat()
                if inicio <= dia <= fim:
                    por_dia.setdefault(dia, {}).setdefault(cid, (nome, []))[1].append((q.strftime("%H:%M"), t))
    os.makedirs(saida, exist_ok=True)
    for dia, convs in sorted(por_dia.items()):
        total = sum(len(m) for _, m in convs.values())
        caminho = os.path.join(saida, f"chatgpt {dia}.md")
        if os.path.exists(caminho):
            print(f"já existe, não reescrevi: chatgpt {dia}.md")
            continue
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(f"---\ntipo: fonte\nformato: conversa-ia\ndata: {dia}\norigem: \"ChatGPT (exportação), só mensagens digitadas\"\n"
                    f"conversas: {len(convs)}\nmensagens: {total}\n---\n\n")
            for cid, (nome, msgs) in sorted(convs.items(), key=lambda x: x[1][1][0][0]):
                f.write(f"## {msgs[0][0]} · {nome}\n\nOriginal: chatgpt.com/c/{cid}\n\n")
                for hora, t in msgs:
                    f.write(f"**{hora}**\n\n" + "\n".join("> " + l for l in t.splitlines()) + "\n\n")
    print(f"{len(por_dia)} dias")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    main(*sys.argv[1:5])
