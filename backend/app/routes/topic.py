from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.topic import TopicCreate, SessionCreate, VoteCreate, TopicOut, VoteResult
from app.logic.topic import create_topic, list_topics, open_session, vote, get_result
from app.routes.login import get_current_user 
from app.models.user import User

router = APIRouter()

@router.post("/v1/topics", response_model=TopicOut)
async def post_topic(data: TopicCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        return await create_topic(data, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/v1/topics", response_model=list[TopicOut])
async def get_topics(db: AsyncSession = Depends(get_db)):
    return await list_topics(db)

@router.post("/v1/topics/{topic_id}/session")
async def post_session(topic_id: int, data: SessionCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    duration = data.duration_minutes or 1
    try:
        return await open_session(topic_id, duration, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/v1/topics/{topic_id}/vote")
async def post_vote(topic_id: int, data: VoteCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        return await vote(topic_id, user.id, data.vote, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/v1/topics/{topic_id}/result", response_model=VoteResult)
async def get_vote_result(topic_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_result(topic_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
