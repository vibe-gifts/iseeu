"""Confere se cada prova citada existe de verdade no cofre.

Uso: python3 -I conferir_provas.py "<cofre>" arquivo1.md [arquivo2.md ...]

Uma prova é um link seguido de trecho entre aspas, `[[nota]] "trecho"`, ou o contrário,
`"trecho" ([[nota]])`. Para cada uma, procura o trecho primeiro na nota do link e depois no resto
do cofre (fora dos arquivos conferidos e de `20 Fontes/autoavaliacoes/`, que são a própria
análise). Diferença de espaço, aspas curvas e maiúsculas não conta.

Sai com código 1 se algum trecho não foi achado: o que não está no cofre é invenção e não pode
ficar como frase da pessoa.
"""
import os
import re
import sys
import unicodedata

PAR = re.compile(r'\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]\s*[:,]?\s*["“]([^"”]{6,})["”]'
                 r'|["“]([^"”]{6,})["”]\s*\(?\s*\[\[([^\]|#]+)')


def normal(t):
    t = unicodedata.normalize("NFC", t).replace("’", "'").replace("…", "...")
    return re.sub(r"\s+", " ", t).strip().lower()


def main(cofre, alvos):
    alvos = [os.path.abspath(a) for a in alvos]
    notas, textos = {}, {}
    for raiz, _, nomes in os.walk(cofre):
        if "/." in raiz or "/_versoes" in raiz:
            continue
        for n in nomes:
            if n.endswith(".md"):
                p = os.path.join(raiz, n)
                notas.setdefault(n[:-3], p)
                if p not in alvos and "/20 Fontes/autoavaliacoes/" not in p:
                    textos[p] = normal(open(p, encoding="utf-8", errors="ignore").read())
    total = falhas = 0
    for alvo in alvos:
        for m in PAR.finditer(open(alvo, encoding="utf-8").read()):
            nota, trecho = (m.group(1), m.group(2)) if m.group(1) else (m.group(4), m.group(3))
            trecho_n = normal(trecho.strip(" .,…"))
            total += 1
            p = notas.get(nota.strip())
            if p and p in textos and trecho_n in textos[p]:
                continue
            outro = next((q for q, t in textos.items() if trecho_n in t), None)
            if outro:
                print(f"OUTRA NOTA | [[{nota}]] → está em [[{os.path.basename(outro)[:-3]}]] | {trecho[:70]}")
            else:
                falhas += 1
                print(f"NÃO ACHEI  | [[{nota}]] | {trecho[:70]}")
    print(f"{total} provas conferidas, {falhas} sem fonte no cofre")
    return 1 if falhas else 0


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1], sys.argv[2:]))
