import re

def clean_cpf(cpf: str) -> str:
    return re.sub(r'\D', '', cpf) 