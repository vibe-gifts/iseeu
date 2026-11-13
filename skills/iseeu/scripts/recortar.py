"""Recorta uma conversa longa em volta das falas do dono, para ler menos sem perder o contexto.

Uso: python3 -I recortar.py "<nome do dono>" ANTES DEPOIS arquivo1 [arquivo2 ...] --saida "pasta"

Serve para transcrição de reunião ("Nome: fala" ou "**Nome:** fala") e para extrato de WhatsApp
("- HH:MM **DONO**: ..."). Mantém cada fala do dono mais ANTES linhas anteriores e DEPOIS seguintes;
os trechos cortados viram "[...]". O arquivo original não muda; o recorte vai para a pasta de saída.
"""
import os
import re
import sys


def falante(linha, dono):
    if "**DONO**" in linha:
        return True
    m = re.match(r"^\s*(?:- \d\d:\d\d )?\**([^:*\n]{2,60}?)\**:\**\s", linha)
    return bool(m) and m.group(1).strip().lower() == dono.lower()


def eh_fala(linha):
    return bool(re.match(r"^\s*(?:- \d\d:\d\d )?\**[^:*\n]{2,60}?\**:\**\s", linha))


def recortar(texto, dono, antes, depois):
    linhas = texto.splitlines()
    falas = [i for i, l in enumerate(linhas) if eh_fala(l)]
    manter = set(range(0, min(len(linhas), 40)))  # cabeçalho, título e resumo do topo
    for pos, i in enumerate(falas):
        if falante(linhas[i], dono):
            ini = falas[max(0, pos - antes)]
            fim = falas[pos + depois + 1] if pos + depois + 1 < len(falas) else len(linhas)
            manter.update(range(ini, fim))
    saida, cortado = [], False
    for i, l in enumerate(linhas):
        if i in manter:
            saida.append(l)
            cortado = False
        elif not cortado:
            saida.append("[...]")
            cortado = True
    return "\n".join(saida) + "\n"


if __name__ == "__main__":
    args = sys.argv[1:]
    destino = args[args.index("--saida") + 1]
    args = args[: args.index("--saida")]
    dono, antes, depois, arquivos = args[0], int(args[1]), int(args[2]), args[3:]
    os.makedirs(destino, exist_ok=True)
    total_in = total_out = 0
    for a in arquivos:
        t = open(a, encoding="utf-8").read()
        r = recortar(t, dono, antes, depois)
        open(os.path.join(destino, os.path.basename(a)), "w", encoding="utf-8").write(r)
        total_in += len(t)
        total_out += len(r)
    print(f"{len(arquivos)} arquivos: {total_in:,} -> {total_out:,} caracteres")
