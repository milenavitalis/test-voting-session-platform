from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.topic import calculate_session_status  

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

class SessionBase(BaseModel):
    topic_id: int
    start_time: Optional[datetime] = None
    duration_minutes: Optional[int] = 1

class SessionCreate(BaseModel):
    duration_minutes: Optional[int] = 1

class SessionResponse(SessionBase):
    id: int
    finish_time: datetime
    status: str 

    class Config:
        orm_mode = True

    @classmethod
    def session_with_status(cls, obj):
        return cls(
            id=obj.id,
            topic_id=obj.topic_id,
            start_time=obj.start_time,
            duration_minutes=obj.duration_minutes,
            finish_time=obj.finish_time,
            status=calculate_session_status(obj.start_time, obj.finish_time),
        )

class VoteCreate(BaseModel):
    vote: str  

class VoteResult(BaseModel):
    sim: int
    nao: int
