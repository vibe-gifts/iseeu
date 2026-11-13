"""Liga o Obsidian do cofre e instala os plugins do segundo cérebro.

Uso:
  python3 -I instalar_plugins.py "<cofre>" --cor "#2E9E6B"
  python3 -I instalar_plugins.py "<cofre>" --cor "#2E9E6B" --de-cofre "<outro cofre>"   # copia em vez de baixar
  python3 -I instalar_plugins.py "<cofre>" --verificar                                   # só confere, não mexe

O que faz, sem apagar nada que já exista:
  1. cria .obsidian/ se o cofre ainda não foi aberto no Obsidian;
  2. liga os plugins nativos que o cérebro usa (bases, propriedades, links, modelos);
  3. aponta a pasta de modelos para _sistema/modelos;
  4. copia o Painel do Cérebro (vem com a skill) e grava a cor escolhida;
  5. baixa Advanced Tables, Tag Wrangler e Colored Tags da página oficial de cada um no GitHub
     (ou copia de outro cofre com --de-cofre);
  6. lista os plugins em community-plugins.json e diz o que ficou pronto e o que falhou.

Depois a pessoa recarrega o Obsidian e, na primeira vez, clica em "Ativar plugins da comunidade".
"""
import argparse
import json
import os
import re
import shutil
import sys
import urllib.request

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAINEL = os.path.join(SKILL, "assets", "painel-do-cerebro")

NATIVOS = ["bases", "properties", "backlink", "outgoing-link", "templates", "file-explorer",
           "global-search", "switcher", "graph", "tag-pane", "page-preview", "command-palette"]

# id do plugin -> repositório oficial (o mesmo que a loja do Obsidian usa)
DA_LOJA = {
    "table-editor-obsidian": "tgrosinger/advanced-tables-obsidian",
    "tag-wrangler": "pjeby/tag-wrangler",
    "colored-tags": "pfrankov/obsidian-colored-tags",
}
ARQUIVOS = ["manifest.json", "main.js", "styles.css"]


def ler_json(caminho, padrao):
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return padrao


def gravar_json(caminho, dados):
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)


def baixar(repo, destino):
    os.makedirs(destino, exist_ok=True)
    for nome in ARQUIVOS:
        url = f"https://github.com/{repo}/releases/latest/download/{nome}"
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                conteudo = r.read()
        except Exception as erro:
            if nome == "styles.css":  # nem todo plugin tem estilo
                continue
            raise RuntimeError(f"não consegui baixar {nome} ({erro})")
        with open(os.path.join(destino, nome), "wb") as f:
            f.write(conteudo)


def instalado(pasta, id_plugin):
    m = ler_json(os.path.join(pasta, "manifest.json"), {})
    return m.get("id") == id_plugin and os.path.exists(os.path.join(pasta, "main.js"))


def verificar(cofre):
    obs = os.path.join(cofre, ".obsidian")
    ligados = ler_json(os.path.join(obs, "community-plugins.json"), [])
    nativos = ler_json(os.path.join(obs, "core-plugins.json"), {})
    problemas = []
    for id_plugin in ["painel-do-cerebro", *DA_LOJA]:
        pasta = os.path.join(obs, "plugins", id_plugin)
        ok_pasta, ok_lista = instalado(pasta, id_plugin), id_plugin in ligados
        print(f"  {'ok ' if ok_pasta and ok_lista else 'FALTA'} {id_plugin}"
              + ("" if ok_pasta else " (arquivos ausentes)") + ("" if ok_lista else " (não está ligado)"))
        if not (ok_pasta and ok_lista):
            problemas.append(id_plugin)
    faltam = [n for n in ["bases", "properties", "backlink", "outgoing-link", "templates"] if nativos.get(n) is not True]
    print("  nativos: " + ("todos ligados" if not faltam else "desligados: " + ", ".join(faltam)))
    cor = ler_json(os.path.join(obs, "plugins", "painel-do-cerebro", "data.json"), {}).get("cor")
    print(f"  cor do painel: {cor or 'padrão (azul)'}")
    return not problemas and not faltam


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cofre")
    ap.add_argument("--cor", help="cor principal do painel, em hex (ex.: #2E9E6B)")
    ap.add_argument("--de-cofre", help="copiar os plugins da loja deste outro cofre em vez de baixar")
    ap.add_argument("--verificar", action="store_true")
    a = ap.parse_args()

    cofre = os.path.abspath(a.cofre)
    if not os.path.isdir(cofre):
        sys.exit(f"Não achei a pasta do cofre: {cofre}")
    if a.verificar:
        sys.exit(0 if verificar(cofre) else 1)
    if a.cor and not re.fullmatch(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})", a.cor):
        sys.exit("A cor precisa estar em hex, por exemplo #2E9E6B")

    obs = os.path.join(cofre, ".obsidian")
    plugins = os.path.join(obs, "plugins")
    os.makedirs(plugins, exist_ok=True)

    # nativos: só liga, nunca desliga o que a pessoa já usa
    caminho = os.path.join(obs, "core-plugins.json")
    nativos = ler_json(caminho, {})
    if isinstance(nativos, list):  # formato antigo do Obsidian
        nativos = {n: True for n in nativos}
    for n in NATIVOS:
        nativos[n] = True
    gravar_json(caminho, nativos)

    caminho = os.path.join(obs, "templates.json")
    modelos = ler_json(caminho, {})
    modelos.setdefault("folder", "_sistema/modelos")
    gravar_json(caminho, modelos)

    falhas = []
    # Painel do Cérebro: cópia de verdade (o cofre não depende da pasta da skill)
    destino = os.path.join(plugins, "painel-do-cerebro")
    if not os.path.islink(destino):
        os.makedirs(destino, exist_ok=True)
        for nome in ARQUIVOS:
            shutil.copy2(os.path.join(PAINEL, nome), os.path.join(destino, nome))
    if a.cor:
        dados = ler_json(os.path.join(destino, "data.json"), {})
        dados["cor"] = a.cor
        gravar_json(os.path.join(destino, "data.json"), dados)

    for id_plugin, repo in DA_LOJA.items():
        destino = os.path.join(plugins, id_plugin)
        if instalado(destino, id_plugin):
            continue
        try:
            if a.de_cofre:
                origem = os.path.join(a.de_cofre, ".obsidian", "plugins", id_plugin)
                if not instalado(origem, id_plugin):
                    raise RuntimeError("não está no outro cofre")
                os.makedirs(destino, exist_ok=True)
                for nome in ARQUIVOS:  # data.json fica de fora: são os ajustes do outro cofre
                    if os.path.exists(os.path.join(origem, nome)):
                        shutil.copy2(os.path.join(origem, nome), os.path.join(destino, nome))
            else:
                baixar(repo, destino)
            if not instalado(destino, id_plugin):
                raise RuntimeError("o arquivo baixado não é deste plugin")
        except RuntimeError as erro:
            falhas.append(f"{id_plugin}: {erro}")

    caminho = os.path.join(obs, "community-plugins.json")
    ligados = ler_json(caminho, [])
    for id_plugin in ["painel-do-cerebro", *DA_LOJA]:
        if id_plugin not in ligados and instalado(os.path.join(plugins, id_plugin), id_plugin):
            ligados.append(id_plugin)
    gravar_json(caminho, ligados)

    print("Conferência:")
    tudo_ok = verificar(cofre)
    for f in falhas:
        print(f"  FALHOU {f}")
    print("\nPróximo passo da pessoa: abrir (ou recarregar) o cofre no Obsidian e, na primeira vez,"
          " clicar em \"Ativar plugins da comunidade\".")
    sys.exit(0 if tudo_ok else 1)


if __name__ == "__main__":
    main()
