import pytest
from app.logic.login import authenticate_user, create_access_token
from app.logic.user import create_user
from app.schemas.user import UserCreate
from app.models import User

@pytest.mark.asyncio
async def test_create_user_new_user(db_session):
    user_data = UserCreate(name="Milena", cpf="123.456.789-00", password="1234")
    user = await create_user(user_data, db_session)
    
    assert user.id is not None
    assert user.name == "Milena"
    assert user.cpf == "12345678900"
    assert user.password_hash != "1234"

@pytest.mark.asyncio
async def test_create_user_existing_user(db_session):
    user_data = UserCreate(name="Milena", cpf="123.456.789-00", password="1234")
    await create_user(user_data, db_session)
    user_again = await create_user(user_data, db_session)

    assert user_again.cpf == "12345678900"

@pytest.mark.asyncio
async def test_authenticate_user_success(db_session):
    user_data = UserCreate(name="Test", cpf="111.111.111-11", password="secret")
    await create_user(user_data, db_session)

    class Credentials:
        cpf = "111.111.111-11"
        password = "secret"

    user = await authenticate_user(Credentials(), db_session)
    assert isinstance(user, User)
    assert user.cpf == "11111111111"

@pytest.mark.asyncio
async def test_authenticate_user_invalid_password(db_session):
    user_data = UserCreate(name="Test", cpf="222.222.222-22", password="correct")
    await create_user(user_data, db_session)

    class Credentials:
        cpf = "222.222.222-22"
        password = "wrong"

    with pytest.raises(ValueError, match="Credenciais inválidas"):
        await authenticate_user(Credentials(), db_session)
