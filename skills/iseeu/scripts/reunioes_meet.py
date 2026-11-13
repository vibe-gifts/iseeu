"""Reuniões do Google Meet (Anotações do Gemini) para `20 Fontes/reunioes/`.

Uso:
  python3 -I reunioes_meet.py listar "<cofre>" AAAA-MM-DD
      Lista as anotações do Gemini daquele dia no Google Drive do computador
      (~/Library/CloudStorage/GoogleDrive-*/My Drive), uma por linha: ID, conta e título.
      Pula as que já estão no cofre (o ID do documento aparece em 20 Fontes/reunioes).
  python3 -I reunioes_meet.py gravar "<cofre>" arquivo.json
      Grava cada reunião do JSON baixado pelo navegador ({id: {title, text}}) como
      `20 Fontes/reunioes/reuniao AAAA-MM-DD <título>.md`. Não reescreve o que já existe.
  python3 -I reunioes_meet.py gravar-txt "<cofre>" ID "título do documento" arquivo.txt
      Grava uma reunião baixada como texto pelo Composio (GOOGLEDRIVE_DOWNLOAD_FILE, mime_type text/plain):
      o texto já traz o resumo e a transcrição. Pula a reunião cujo ID já está no cofre.

Os arquivos `.gdoc` do Drive são só atalhos: o texto vem do navegador logado na conta,
pela página `https://docs.google.com/document/d/<ID>/mobilebasic?authuser=<conta>`.
"""
import glob
import json
import os
import re
import sys
import unicodedata

DRIVE = os.path.expanduser("~/Library/CloudStorage")


def ids_no_cofre(cofre):
    pasta = os.path.join(cofre, "20 Fontes", "reunioes")
    vistos = set()
    for p in glob.glob(os.path.join(pasta, "*.md")):
        with open(p, errors="ignore") as f:
            vistos.update(re.findall(r"/document/d/([\w-]{20,})", f.read(3000)))
    return vistos


def listar(cofre, dia):
    marca = dia.replace("-", " ")
    vistos, titulos = ids_no_cofre(cofre), set()
    achados = []
    for conta_dir in sorted(glob.glob(os.path.join(DRIVE, "GoogleDrive-*"))):
        conta = os.path.basename(conta_dir).removeprefix("GoogleDrive-")
        for p in glob.glob(os.path.join(conta_dir, "My Drive", "**", "*Gemini*.gdoc"), recursive=True):
            nome = os.path.basename(p)[:-5]
            if marca not in nome or nome in titulos:
                continue
            try:
                doc = json.load(open(p)).get("doc_id", "")
            except (OSError, ValueError):
                continue
            titulos.add(nome)
            if doc and doc not in vistos:
                achados.append((doc, conta, nome))
    for doc, conta, nome in achados:
        print(f"{doc}\t{conta}\t{nome}")
    if not achados:
        print("nenhuma reunião nova")


def limpar(titulo):
    t = re.sub(r"\s*-\s*\d{4}/\d\d/\d\d.*$", "", titulo)
    t = re.sub(r"^Reunião iniciada às.*$", "Reuniao", t)
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"[^\w ]+", " ", t)
    return re.sub(r"\s+", " ", t).strip() or "Reuniao"


def gravar(cofre, arquivo):
    pasta = os.path.join(cofre, "20 Fontes", "reunioes")
    os.makedirs(pasta, exist_ok=True)
    vistos = ids_no_cofre(cofre)
    for doc, v in json.load(open(arquivo)).items():
        if doc in vistos:
            print("já está no cofre:", v["title"])
            continue
        m = re.search(r"(\d{4})/(\d\d)/(\d\d) (\d\d):(\d\d)", v["title"])
        if not m:
            print("sem data no título, pulei:", v["title"])
            continue
        dia = "-".join(m.groups()[:3])
        base = os.path.join(pasta, f"reuniao {dia} {limpar(v['title'])}")
        p = base + ".md"
        if os.path.exists(p):
            p = f"{base} {m.group(4)}{m.group(5)}.md"
        if os.path.exists(p):
            print("já existe:", os.path.basename(p))
            continue
        texto = re.sub(r"\n{3,}", "\n\n", v["text"]).strip()
        with open(p, "w") as f:
            f.write(f'---\ntipo: fonte\nformato: reuniao\ndata: {dia}\norigem: "Google Meet (Anotações do Gemini)"\n---\n\n'
                    f'# {v["title"]}\nFonte: Google Meet, https://docs.google.com/document/d/{doc}/edit, {dia}\n\n{texto}\n')
        print(f"{len(texto)} caracteres: {os.path.basename(p)}")


def gravar_txt(cofre, doc, titulo, arquivo):
    """Uma reunião baixada como texto (Composio: GOOGLEDRIVE_DOWNLOAD_FILE com mime_type text/plain)."""
    with open(arquivo, encoding="utf-8-sig") as f:
        texto = f.read()
    tmp = arquivo + ".json"
    with open(tmp, "w") as f:
        json.dump({doc: {"title": titulo, "text": texto}}, f)
    gravar(cofre, tmp)
    os.remove(tmp)


if __name__ == "__main__":
    {"listar": lambda: listar(sys.argv[2], sys.argv[3]), "gravar": lambda: gravar(sys.argv[2], sys.argv[3]),
     "gravar-txt": lambda: gravar_txt(*sys.argv[2:6])}[sys.argv[1]]()
