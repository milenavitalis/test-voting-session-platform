from pydantic import BaseModel

class UserLogin(BaseModel):
    cpf: str
    password: str
