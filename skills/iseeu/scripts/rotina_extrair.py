"""Primeiro passo da rotina diária: extrai a fala do dono de um dia para `20 Fontes/`.

Uso: python3 -I rotina_extrair.py "<cofre>" [AAAA-MM-DD]   (sem data = ontem)

- Claude Code -> 20 Fontes/conversas-ia/claude-code/claude-code AAAA-MM-DD.md
- Codex       -> 20 Fontes/conversas-ia/codex/codex AAAA-MM-DD.md
- WhatsApp    -> 20 Fontes/whatsapp-pessoal/whatsapp AAAA-MM-DD <conversa>.md, só das conversas
                 listadas em `_sistema/whatsapp-rotina.txt` (uma por linha; # comenta). Os áudios do dono viram texto.

Arquivo que já existe não é reescrito: `20 Fontes/` só acumula.

Fonte que trava ou dá erro não para as outras: sai `FALHOU` na linha dela e, no fim,
`FONTES COM FALHA: ...` (saída 1). O WhatsApp também falha se o banco do app no Mac
não muda há mais de 24 horas (app fechado ou sem sincronizar).
"""
import datetime
import os
import time
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
BANCO_WHATSAPP = os.path.expanduser("~/Library/Group Containers/group.net.whatsapp.WhatsApp.shared/ChatStorage.sqlite")
falhas = []


def rodar(nome, script, *args, limite=300):
    try:
        r = subprocess.run([sys.executable, "-I", os.path.join(AQUI, script), *args],
                           capture_output=True, text=True, timeout=limite)
    except subprocess.TimeoutExpired:
        falhas.append(nome)
        return f"FALHOU: travou por mais de {limite // 60} minutos e foi parado"
    saida = (r.stdout + r.stderr).strip()
    if r.returncode != 0:
        falhas.append(nome)
        return f"FALHOU (código {r.returncode}): {saida[-500:]}"
    return saida or "nada"


def main(cofre, dia):
    fontes = os.path.join(cofre, "20 Fontes")
    seguinte = (datetime.date.fromisoformat(dia) + datetime.timedelta(days=1)).isoformat()
    for nome, script, pasta, raiz in (("Claude Code", "extrair_claude_code.py", "conversas-ia/claude-code", "~/.claude/projects"),
                                      ("Codex", "extrair_codex.py", "conversas-ia/codex", "~/.codex/sessions")):
        if not os.path.isdir(os.path.expanduser(raiz)):
            print(f"{nome}: não é usado neste computador")
            continue
        destino = os.path.join(fontes, pasta)
        os.makedirs(destino, exist_ok=True)
        prefixo = pasta.split("/")[-1]
        if os.path.exists(os.path.join(destino, f"{prefixo} {dia}.md")):
            print(f"{nome}: já extraído")
            continue
        print(f"{nome}: {rodar(nome, script, dia, dia, destino)}")

    lista = os.path.join(cofre, "_sistema", "whatsapp-rotina.txt")
    conversas = [l.strip() for l in open(lista) if l.strip() and not l.startswith("#")] if os.path.exists(lista) else []
    if not conversas:
        print("WhatsApp: sem lista em _sistema/whatsapp-rotina.txt")
        return
    try:
        horas = (time.time() - os.path.getmtime(BANCO_WHATSAPP)) / 3600
    except OSError:
        horas = None
    if horas is None:
        falhas.append("WhatsApp pessoal")
        print("WhatsApp: FALHOU: não achei o banco do WhatsApp no Mac")
        return
    if horas > 24:
        falhas.append("WhatsApp pessoal")
        print(f"WhatsApp: FALHOU: o WhatsApp do Mac não recebe mensagem há {horas:.0f} horas (abra o app e deixe sincronizar)")
    print("WhatsApp: " + rodar("WhatsApp pessoal", "extrair_whatsapp_mac.py", "extrair", "--desde", dia, "--ate", seguinte,
                               "--por-dia", "--transcrever", "--saida", os.path.join(fontes, "whatsapp-pessoal"),
                               "--conversas", *conversas, limite=900))


if __name__ == "__main__":
    ontem = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else ontem)
    if falhas:
        print("FONTES COM FALHA: " + ", ".join(dict.fromkeys(falhas)))
        sys.exit(1)
