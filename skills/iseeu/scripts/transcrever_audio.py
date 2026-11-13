"""Transcreve um áudio do dono com o Whisper deste Mac. Nada sai do computador.

  python3 -I transcrever_audio.py <arquivo>
  python3 -I transcrever_audio.py --url "<link assinado>"   (DeskComm: o link nunca entra no cofre)

Imprime só o texto, com chaves e senhas mascaradas. Sem texto ou com falha, sai com código 1.
"""
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from segredos import mascarar  # noqa: E402

MODELO = os.path.expanduser("~/.local/share/whisper-models/ggml-large-v3-turbo-q5_0.bin")
LIMITE = 600  # segundos por áudio


def programa(nome):
    # A rotina agendada pode rodar sem o PATH do Terminal.
    return shutil.which(nome) or f"/opt/homebrew/bin/{nome}"


def transcrever(arquivo):
    """Devolve o texto do áudio, ou None se não deu para transcrever."""
    with tempfile.TemporaryDirectory(prefix="audio-") as pasta:
        wav = os.path.join(pasta, "a.wav")
        try:
            subprocess.run([programa("ffmpeg"), "-v", "error", "-y", "-i", arquivo, "-ar", "16000", "-ac", "1", wav],
                           capture_output=True, timeout=LIMITE, check=True)
            r = subprocess.run([programa("whisper-cli"), "-m", MODELO, "-l", "pt", "-nt", "-np", "-f", wav],
                               capture_output=True, text=True, timeout=LIMITE, check=True)
        except (OSError, subprocess.SubprocessError):
            return None
    texto = " ".join(linha.strip() for linha in r.stdout.splitlines() if linha.strip())
    return mascarar(texto) if texto else None


def transcrever_url(url):
    with tempfile.TemporaryDirectory(prefix="audio-") as pasta:
        arquivo = os.path.join(pasta, "audio")
        try:
            with urllib.request.urlopen(url, timeout=120) as resposta, open(arquivo, "wb") as f:
                shutil.copyfileobj(resposta, f)
        except OSError:
            return None
        return transcrever(arquivo)


if __name__ == "__main__":
    args = sys.argv[1:]
    texto = transcrever_url(args[1]) if args[:1] == ["--url"] and len(args) == 2 else transcrever(args[0]) if len(args) == 1 else None
    if not texto:
        sys.exit(1)
    print(texto)
