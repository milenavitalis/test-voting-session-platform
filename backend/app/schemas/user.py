from pydantic import BaseModel, constr

class UserCreate(BaseModel):
    name: str
    cpf: constr(min_length=11, max_length=11)
    password: constr(min_length=6)