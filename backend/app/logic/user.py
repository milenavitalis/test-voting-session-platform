from sqlalchemy.future import select
from app.models import User
from app.schemas.user import UserCreate
from app.logic.utils import clean_cpf 
import bcrypt

async def create_user(user_data: UserCreate, db):
    cpf = clean_cpf(user_data.cpf)
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    print("Criando usuário", hashed_password)
    result = await db.execute(select(User).where(User.cpf == cpf))
    existing_user = result.scalars().first()
    if existing_user:
        raise ValueError("CPF já cadastrado")
    user = User(
        name=user_data.name,
        cpf=cpf,
        password_hash=hashed_password.decode('utf-8')
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user