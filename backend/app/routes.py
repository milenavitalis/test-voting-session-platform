from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate
from app.logic.user import create_user
from app.database import get_db

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        created_user = create_user(user, db)
        return {"id": created_user.id, "name": created_user.name}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Erro ao criar usuário")