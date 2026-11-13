"""Mascara chaves de acesso e senhas antes de qualquer texto entrar no cofre."""
import re

PADROES = [
    r"sk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}",          # OpenAI, Anthropic
    r"\b(?:re|sb|pk|rk)_[A-Za-z0-9_]{16,}",            # Resend, Supabase, Stripe
    r"\bgh[pousr]_[A-Za-z0-9]{30,}",                   # GitHub
    r"\bAKIA[0-9A-Z]{16}\b",                           # AWS
    r"\bAIza[0-9A-Za-z_-]{30,}",                       # Google
    r"\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}",  # JWT
    r"(?i:\b[A-Z_]*(?:API_?KEY|SECRET|TOKEN|PASSWORD|SENHA)[A-Z_]*\s*[=:]\s*[\"']?[^\s\"']{8,})",
]
_RE = re.compile("|".join(f"(?:{p})" for p in PADROES))


def mascarar(texto):
    return _RE.sub("[chave removida]", texto)
