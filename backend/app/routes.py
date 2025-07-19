from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate
from app.schemas.login import UserLogin
from app.logic.user import create_user
from app.logic.login import create_access_token
from app.database import get_db
from app.logic.login import authenticate_user


router = APIRouter()

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        created_user = await create_user(user, db)
        token = create_access_token({"sub": created_user.cpf})

        return {
            "id": created_user.id,
            "name": created_user.name,
            "access_token": token,
            "token_type": "bearer"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        user = await authenticate_user(credentials, db)
        token = create_access_token({"sub": user.cpf})
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))