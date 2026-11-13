"""Extrai só o que a pessoa digitou nas conversas do Claude Code de um dia.

Uso: python3 -I extrair_claude_code.py AAAA-MM-DD > saida.md
     python3 -I extrair_claude_code.py INICIO FIM "pasta"   (um arquivo por dia)

Fica de fora: respostas da IA, resultados de ferramentas, avisos do sistema,
mensagens entre sessões, botões de sugestão aceitos e conteúdo colado
(blocos <pasted_content> e blocos de código), que vira só uma marca com o tamanho.
"""
import datetime
import glob
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from segredos import mascarar  # noqa: E402

RAIZ = os.path.expanduser("~/.claude/projects")
FONTES_HUMANAS = {"typed", "sdk", "queued", None}

COLADO = re.compile(r"<pasted_content[^>]*>.*?</pasted_content[^>]*>", re.S)
CODIGO = re.compile(r"```.*?```", re.S)
TAG_SISTEMA = re.compile(r"<(system-reminder|command-[a-z-]+|local-command-[a-z-]+)[^>]*>.*?</\1>", re.S)


def texto_da_mensagem(conteudo):
    if isinstance(conteudo, str):
        return conteudo
    if isinstance(conteudo, list):
        return "\n".join(p.get("text", "") for p in conteudo if p.get("type") == "text")
    return ""


def limpar(texto):
    colado = 0

    def marca(m):
        nonlocal colado
        colado += len(m.group(0))
        return f"[colou {len(m.group(0))} caracteres]"

    texto = TAG_SISTEMA.sub("", texto)
    texto = COLADO.sub(marca, texto)
    texto = CODIGO.sub(marca, texto)
    return mascarar(texto.strip()), colado


def nome_do_projeto(caminho):
    pasta = os.path.basename(os.path.dirname(caminho))
    casa = os.path.expanduser("~").replace("/", "-") + "-"  # ex.: -Users-fulano-
    return pasta.replace(casa, "").replace("-", " ").strip() or pasta


def coletar(inicio, fim):
    """Junta as mensagens dele de inicio a fim (datas ISO), numa só passada pelos arquivos."""
    corte = datetime.datetime.fromisoformat(inicio).timestamp()
    por_dia = {}
    vistas = set()  # conversas retomadas repetem mensagens antigas
    for arquivo in glob.glob(f"{RAIZ}/*/*.jsonl"):
        if os.path.getmtime(arquivo) < corte:
            continue
        msgs = {}
        for linha in open(arquivo, errors="ignore"):
            if '"type":"user"' not in linha:
                continue
            try:
                d = json.loads(linha)
            except ValueError:
                continue
            if d.get("type") != "user" or d.get("isMeta") or d.get("isSidechain"):
                continue
            try:
                local = datetime.datetime.fromisoformat(d["timestamp"].replace("Z", "+00:00")).astimezone()
            except (KeyError, ValueError):
                continue
            dia = local.date().isoformat()
            if not inicio <= dia <= fim:
                continue
            if (d.get("origin") or {}).get("kind") != "human":
                continue
            if d.get("promptSource") not in FONTES_HUMANAS:
                continue
            texto, colado = limpar(texto_da_mensagem(d.get("message", {}).get("content")))
            if not texto or texto.startswith("<") or texto.startswith("Base directory for this skill"):
                continue
            chave = (d["timestamp"][:16], texto)
            if chave in vistas:
                continue
            vistas.add(chave)
            msgs.setdefault(dia, []).append((local.strftime("%H:%M"), texto, colado))
        for dia, lista in msgs.items():
            por_dia.setdefault(dia, []).append((lista[0][0], arquivo, lista))
    return por_dia


def escrever(dia, conversas, saida):
    conversas.sort()
    total = sum(len(m) for _, _, m in conversas)
    saida.write(f"---\ntipo: fonte\nformato: conversa-ia\ndata: {dia}\norigem: \"Claude Code neste Mac, só mensagens digitadas\"\n"
                f"conversas: {len(conversas)}\nmensagens: {total}\n---\n\n")
    for hora, arquivo, msgs in conversas:
        saida.write(f"## {hora} · {nome_do_projeto(arquivo)}\n\n")
        saida.write(f"Original: `{arquivo.replace(os.path.expanduser('~'), '~')}`\n\n")
        for h, texto, _ in msgs:
            saida.write(f"**{h}**\n\n")
            saida.write("\n".join("> " + l for l in texto.splitlines()) + "\n\n")


if __name__ == "__main__":
    # Um dia: imprime na tela. Período e pasta: um arquivo por dia na pasta.
    #   python3 -I extrair_claude_code.py 2026-10-27
    #   python3 -I extrair_claude_code.py 2026-06-01 2026-10-27 "20 Fontes/conversas-ia/claude-code"
    inicio = sys.argv[1]
    fim = sys.argv[2] if len(sys.argv) > 2 else inicio
    dias = coletar(inicio, fim)
    if len(sys.argv) > 3:
        for dia, conversas in sorted(dias.items()):
            with open(os.path.join(sys.argv[3], f"claude-code {dia}.md"), "w") as f:
                escrever(dia, conversas, f)
        print(f"{len(dias)} dias")
    else:
        escrever(inicio, dias.get(inicio, []), sys.stdout)
