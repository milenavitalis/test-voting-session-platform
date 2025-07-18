from sqlalchemy.orm import Session
from app.models import User
from app.schemas.user import UserCreate
import bcrypt

def create_user(user_data: UserCreate, db: Session):
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())

    user = User(
        name=user_data.name,
        cpf=user_data.cpf,
        password_hash=hashed_password.decode('utf-8')
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user