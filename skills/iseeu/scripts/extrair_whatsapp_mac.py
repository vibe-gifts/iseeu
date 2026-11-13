"""Lê o WhatsApp do Mac (banco local) para o segundo cérebro.

Trabalha numa cópia do banco: o WhatsApp não é tocado.

  python3 -I extrair_whatsapp_mac.py resumo [--top 40]
  python3 -I extrair_whatsapp_mac.py extrair --desde 2025-11-01 --conversas "Nome 1" "Nome 2" --saida "<cofre>/20 Fontes/whatsapp"
  python3 -I extrair_whatsapp_mac.py extrair --desde 2026-10-28 --ate 2026-10-29 --por-dia --conversas "Nome 1" --saida "<pasta>"

resumo  : conversas com mais mensagens do dono, com áudios e período.
--banco : usa outro arquivo, por exemplo o ChatStorage.sqlite tirado de um backup do iPhone
          (no backup ele se chama 7c7fba66680ef796b916b067077cc246adacf01d, pasta 7c).
extrair : um arquivo por conversa e por mês (ou por dia, com --por-dia), com as mensagens de texto de todos
          (as dos outros servem de contexto para combinados) e marcas para áudio e mídia.
--ate   : data final, sem incluir esse dia. Com --por-dia, arquivo que já existe não é reescrito
          (a rotina diária só acrescenta).
--transcrever : os áudios do dono viram texto, com o Whisper deste Mac (transcrever_audio.py). Áudio dos outros fica só com a marca.
"""
import argparse
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from segredos import mascarar  # noqa: E402
from transcrever_audio import transcrever  # noqa: E402
import shutil
import sqlite3
import tempfile
from datetime import datetime, timezone

BANCO = os.path.expanduser("~/Library/Group Containers/group.net.whatsapp.WhatsApp.shared/ChatStorage.sqlite")
MIDIA = os.path.join(os.path.dirname(BANCO), "Message")  # ZMEDIALOCALPATH é relativo a esta pasta
EPOCA_APPLE = 978307200  # 2001-01-01, base das datas do WhatsApp no Mac
TIPOS = {0: "texto", 1: "imagem", 2: "vídeo", 3: "áudio", 4: "contato", 5: "local", 7: "link", 8: "documento", 15: "figurinha"}


def copiar_banco(banco=BANCO):
    pasta = tempfile.mkdtemp(prefix="whatsapp-")
    for sufixo in ("", "-wal", "-shm"):
        if os.path.exists(banco + sufixo):
            shutil.copy2(banco + sufixo, os.path.join(pasta, "ChatStorage.sqlite" + sufixo))
    return sqlite3.connect(os.path.join(pasta, "ChatStorage.sqlite"))


def data(segundos):
    return datetime.fromtimestamp(segundos + EPOCA_APPLE, tz=timezone.utc).astimezone()


def resumo(db, top):
    linhas = db.execute("""
        SELECT c.ZPARTNERNAME, c.ZCONTACTJID LIKE '%@g.us', COUNT(*),
               SUM(m.ZISFROMME AND m.ZMESSAGETYPE = 0), SUM(m.ZISFROMME AND m.ZMESSAGETYPE = 3),
               MIN(m.ZMESSAGEDATE), MAX(m.ZMESSAGEDATE)
        FROM ZWAMESSAGE m JOIN ZWACHATSESSION c ON c.Z_PK = m.ZCHATSESSION
        GROUP BY c.Z_PK ORDER BY 4 DESC LIMIT ?""", (top,)).fetchall()
    total, meus, ini, fim = db.execute(
        "SELECT COUNT(*), SUM(ZISFROMME AND ZMESSAGETYPE = 0), MIN(ZMESSAGEDATE), MAX(ZMESSAGEDATE) FROM ZWAMESSAGE").fetchone()
    conversas = db.execute("SELECT COUNT(*) FROM ZWACHATSESSION").fetchone()[0]
    print(f"{conversas} conversas, {total} mensagens, {meus} textos do dono, de {data(ini):%Y-%m-%d} a {data(fim):%Y-%m-%d}\n")
    print("| Conversa | Tipo | Mensagens | Textos do dono | Áudios do dono | De | Até |")
    print("|---|---|---|---|---|---|---|")
    for nome, grupo, n, t, a, de, ate in linhas:
        print(f"| {nome} | {'grupo' if grupo else 'pessoa'} | {n} | {t} | {a} | {data(de):%Y-%m-%d} | {data(ate):%Y-%m-%d} |")


def audio_do_dono(caminho):
    arquivo = os.path.join(MIDIA, caminho) if caminho else None
    if not arquivo or not os.path.exists(arquivo):
        return "[áudio] (sem arquivo no Mac)"
    texto = transcrever(arquivo)
    return f"[áudio] {texto}" if texto else "[áudio] (não consegui transcrever)"


def extrair(db, desde, nomes, saida, ate=None, por_dia=False, com_audio=False):
    corte = datetime.fromisoformat(desde).astimezone().timestamp() - EPOCA_APPLE
    fim = datetime.fromisoformat(ate).astimezone().timestamp() - EPOCA_APPLE if ate else float("inf")
    os.makedirs(saida, exist_ok=True)
    escritos = 0
    for nome in nomes:
        sessoes = db.execute("SELECT Z_PK, ZCONTACTJID FROM ZWACHATSESSION WHERE ZPARTNERNAME = ?", (nome,)).fetchall()
        if not sessoes:
            print(f"não achei a conversa: {nome}")
            continue
        por_mes = {}
        for (pk, jid) in sessoes:
            pk_pessoa = not (jid or "").endswith("@g.us")
            for quando, meu, tipo, texto, autor, midia in db.execute("""
                    SELECT m.ZMESSAGEDATE, m.ZISFROMME, m.ZMESSAGETYPE, m.ZTEXT,
                           COALESCE(g.ZCONTACTNAME, g.ZFIRSTNAME), i.ZMEDIALOCALPATH
                    FROM ZWAMESSAGE m LEFT JOIN ZWAGROUPMEMBER g ON g.Z_PK = m.ZGROUPMEMBER
                    LEFT JOIN ZWAMEDIAITEM i ON i.ZMESSAGE = m.Z_PK
                    WHERE m.ZCHATSESSION = ? AND m.ZMESSAGEDATE >= ? AND m.ZMESSAGEDATE < ? ORDER BY m.ZMESSAGEDATE""", (pk, corte, fim)):
                if tipo not in TIPOS or (tipo == 0 and not texto):
                    continue  # avisos do sistema, reações, mensagens apagadas
                d = data(quando)
                quem = "DONO" if meu else (autor or (nome if pk_pessoa else "membro do grupo"))
                if com_audio and meu and tipo == 3:
                    conteudo = audio_do_dono(midia)
                else:
                    conteudo = mascarar(texto) if tipo == 0 else f"[{TIPOS[tipo]}]" + (f" {texto}" if texto else "")
                por_mes.setdefault(f"{d:%Y-%m-%d}" if por_dia else f"{d:%Y-%m}", []).append((d, quem, conteudo))
        for mes, msgs in sorted(por_mes.items()):
            seguro = "".join(ch for ch in nome if ch.isalnum() or ch in " -_").strip()
            caminho = os.path.join(saida, f"whatsapp {mes} {seguro}.md")
            if por_dia and os.path.exists(caminho):
                print(f"já existe, não reescrevi: {caminho}")
                continue
            meus = sum(1 for _, q, _ in msgs if q == "DONO")
            with open(caminho, "w") as f:
                f.write(f"---\ntipo: fonte\nformato: whatsapp\nconversa: \"{nome}\"\n{'data' if por_dia else 'mes'}: {mes}\n"
                        f"mensagens: {len(msgs)}\nmensagens-do-dono: {meus}\n---\n\n")
                f.write("> Linhas do dono começam com **DONO**. As dos outros são contexto: na ficha entra só o que foi combinado ou decidido.\n\n")
                dia = None
                for d, quem, conteudo in msgs:
                    if d.date() != dia:
                        dia = d.date()
                        f.write(f"\n## {dia:%Y-%m-%d}\n\n")
                    marca = "**DONO**" if quem == "DONO" else quem
                    f.write(f"- {d:%H:%M} {marca}: " + conteudo.replace("\n", " / ") + "\n")
            escritos += 1
    print(f"{escritos} arquivos em {saida}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("resumo")
    r.add_argument("--top", type=int, default=40)
    e = sub.add_parser("extrair")
    e.add_argument("--desde", required=True)
    e.add_argument("--conversas", nargs="+", required=True)
    e.add_argument("--saida", required=True)
    e.add_argument("--ate", help="data final (AAAA-MM-DD), sem incluir esse dia")
    e.add_argument("--por-dia", action="store_true", help="um arquivo por conversa e por dia")
    e.add_argument("--transcrever", action="store_true", help="transcreve os áudios do dono")
    for s in (r, e):
        s.add_argument("--banco", default=BANCO, help="outro ChatStorage.sqlite (ex.: tirado de um backup do iPhone)")
    a = ap.parse_args()
    db = copiar_banco(a.banco)
    if a.cmd == "resumo":
        resumo(db, a.top)
    else:
        extrair(db, a.desde, a.conversas, a.saida, a.ate, a.por_dia, a.transcrever)
