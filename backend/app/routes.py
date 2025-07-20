from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate
from app.schemas.login import UserLogin
from app.logic.user import create_user
from app.database import get_db
from app.logic.login import authenticate_user, get_user_by_token, create_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()
security = HTTPBearer() 


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(HTTPBearer()),
    db: Session = Depends(get_db)
):
    return await get_user_by_token(credentials.credentials, db)


@router.post("/v1/register")
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

@router.post("/v1/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        user = await authenticate_user(credentials, db)
        token = create_access_token({"sub": user.cpf})
        return {"access_token": token, "token_type": "bearer", "id": user.id, "name": user.name}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    
@router.get("/v1/auth/me")
async def login_by_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    try:
        user = await get_user_by_token(token, db)
        return {
            "id": user.id,
            "name": user.name,
            "cpf": user.cpf,
            "access_token": token,
            "token_type": "bearer"
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))