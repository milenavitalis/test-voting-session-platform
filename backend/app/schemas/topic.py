from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TopicCreate(BaseModel):
    title: str
    description: Optional[str]

    class Config:
     orm_mode = True
class TopicOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    created_at: datetime
    status: Optional[str] = None

    class Config:
        orm_mode = True

class SessionCreate(BaseModel):
    duration_minutes: Optional[int] = 1

class VoteCreate(BaseModel):
    vote: str  

class VoteResult(BaseModel):
    sim: int
    nao: int
