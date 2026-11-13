"""Cria a estrutura de um segundo cérebro dentro de um cofre do Obsidian.

Uso: python3 -I criar_estrutura.py "<pasta do cofre>"

Não sobrescreve nada: arquivo que já existe fica como está.
"""
import os
import shutil
import sys

PASTAS = [
    "00 Núcleo/_versoes", "01 Inbox", "02 Goal", "10 Áreas",
    "12 Pessoas/familia", "12 Pessoas/pets", "12 Pessoas/socios", "12 Pessoas/equipe",
    "12 Pessoas/clientes", "12 Pessoas/amigos", "12 Pessoas/alunos",
    "15 Projetos", "20 Fontes/fichas",
    "20 Fontes/conversas-ia/claude-code", "20 Fontes/conversas-ia/claude",
    "20 Fontes/conversas-ia/chatgpt", "20 Fontes/conversas-ia/codex",
    "20 Fontes/aulas", "20 Fontes/mentorias", "20 Fontes/reunioes", "20 Fontes/audios",
    "20 Fontes/escritos", "20 Fontes/autoavaliacoes",
    "20 Fontes/whatsapp-pessoal", "20 Fontes/whatsapp-profissional", "30 Diário", "40 Ideias",
    "50 Memória/decisoes", "50 Memória/historias", "50 Memória/aprendizados",
    "60 Criações", "_sistema/modelos",
]


def main(cofre):
    modelo = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "estrutura")
    criadas, copiados, mantidos = 0, 0, 0
    for p in PASTAS:
        alvo = os.path.join(cofre, p)
        if not os.path.isdir(alvo):
            os.makedirs(alvo)
            criadas += 1
    for raiz, _, arquivos in os.walk(modelo):
        for nome in arquivos:
            origem = os.path.join(raiz, nome)
            alvo = os.path.join(cofre, os.path.relpath(origem, modelo))
            if os.path.exists(alvo):
                mantidos += 1
                continue
            os.makedirs(os.path.dirname(alvo), exist_ok=True)
            shutil.copy2(origem, alvo)
            copiados += 1
    print(f"{criadas} pastas criadas, {copiados} arquivos copiados, {mantidos} já existiam e ficaram como estavam")


if __name__ == "__main__":
    main(sys.argv[1])
