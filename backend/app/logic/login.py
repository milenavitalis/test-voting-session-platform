from sqlalchemy.future import select
import os
from dotenv import load_dotenv
from jose import jwt
from datetime import datetime, timedelta, timezone
from app.models import User
from fastapi import HTTPException
from app.logic.utils import clean_cpf 
import bcrypt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24))

async def authenticate_user(credentials, db):
    cpf = clean_cpf(credentials.cpf)
    result = await db.execute(select(User).where(User.cpf == cpf))
    user = result.scalars().first()
    if not user or not bcrypt.checkpw(credentials.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        raise ValueError("Credenciais inválidas")
    return user

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"Token JWT criado: {encoded_jwt}")
    if not encoded_jwt:
        raise HTTPException(status_code=500, detail="Erro ao criar token JWT")
    print("Token JWT criado com sucesso!")
    return encoded_jwt

async def get_user_by_token(token: str, db):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        cpf: str = payload.get("sub")
        if cpf is None:
            raise ValueError("Token inválido")
    except jwt.JWTError:
        raise ValueError("Token inválido")

    cpf = clean_cpf(cpf)
    result = await db.execute(select(User).where(User.cpf == cpf))
    user = result.scalars().first()
    if not user:
        raise ValueError("Usuário não encontrado")
    return user

