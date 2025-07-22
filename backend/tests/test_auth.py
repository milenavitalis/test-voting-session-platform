import pytest
from datetime import datetime, timezone
from jose import jwt
from app.logic.login import authenticate_user, create_access_token, get_user_by_token
from app.schemas.login import UserLogin
from app.models import User
from app.logic.utils import clean_cpf
import bcrypt
import os

# Variáveis de ambiente simuladas
SECRET_KEY = os.getenv("SECRET_KEY", "testsecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


@pytest.fixture
def fake_user():
    password = "senha123"
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    return User(
        id=1,
        name="Usuário Teste",
        cpf=clean_cpf("123.456.789-09"),
        password_hash=hashed,
    )


@pytest.fixture
def mock_db_session(fake_user, mocker):
    mock = mocker.AsyncMock()

    async def execute(query):
        class Result:
            def scalars(self_inner):
                class Scalar:
                    def first(self_innermost):
                        # Retorna o usuário fake para consultas por CPF
                        return fake_user
                return Scalar()
        return Result()

    mock.execute.side_effect = execute
    return mock


@pytest.mark.asyncio
async def test_authenticate_user_success(mock_db_session):
    credentials = UserLogin(cpf="123.456.789-09", password="senha123")
    user = await authenticate_user(credentials, mock_db_session)
    assert user.name == "Usuário Teste"


@pytest.mark.asyncio
async def test_authenticate_user_invalid_password(mock_db_session):
    credentials = UserLogin(cpf="123.456.789-09", password="senhaERRADA")
    with pytest.raises(ValueError, match="Credenciais inválidas"):
        await authenticate_user(credentials, mock_db_session)


def test_create_access_token():
    data = {"sub": "12345678909"}
    token = create_access_token(data)
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "12345678909"
    assert "exp" in decoded
    assert datetime.fromtimestamp(decoded["exp"], tz=timezone.utc) > datetime.now(timezone.utc)


@pytest.mark.asyncio
async def test_get_user_by_token_success(mock_db_session):
    data = {"sub": "12345678909"}
    token = create_access_token(data)
    user = await get_user_by_token(token, mock_db_session)
    assert user.name == "Usuário Teste"


@pytest.mark.asyncio
async def test_get_user_by_token_invalid_token(mock_db_session):
    invalid_token = "invalid.token.value"
    with pytest.raises(Exception):
        await get_user_by_token(invalid_token, mock_db_session)
