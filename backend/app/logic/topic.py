from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.models.topic import Topic, Session, Vote 
from app.schemas.topic import TopicCreate 
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession

async def create_topic(data: TopicCreate, db: AsyncSession):
    topic = Topic(title=data.title, description=data.description)
    db.add(topic)
    await db.commit()
    await db.refresh(topic)
    return topic

async def list_topics(db: AsyncSession):
    result = await db.execute(select(Topic).order_by(Topic.created_at.desc()))
    return result.scalars().all()

async def open_session(topic_id: int, duration_minutes: int, db: AsyncSession):
    # Verificar se já existe sessão aberta
    q = select(Session).where(
        Session.topic_id == topic_id,
        Session.is_active == True,
        Session.start_time + timedelta(minutes=Session.duration_minutes) > datetime.now(timezone.utc)
    )
    result = await db.execute(q)
    active_session = result.scalars().first()
    if active_session:
        raise ValueError("Sessão já está aberta para essa pauta")

    session = Session(topic_id=topic_id, duration_minutes=duration_minutes)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

async def vote(topic_id: int, user_id: int, vote_value: str, db: AsyncSession):
    # Buscar sessão ativa para a pauta
    q = select(Session).where(
        Session.topic_id == topic_id,
        Session.is_active == True,
        Session.start_time + timedelta(minutes=Session.duration_minutes) > datetime.utcnow()
    )
    result = await db.execute(q)
    session = result.scalars().first()
    if not session:
        raise ValueError("Sessão de votação não está aberta para essa pauta")

    # Verificar se o usuário já votou nessa sessão
    q = select(Vote).where(
        Vote.session_id == session.id,
        Vote.user_id == user_id
    )
    result = await db.execute(q)
    existing_vote = result.scalars().first()
    if existing_vote:
        raise ValueError("Usuário já votou nessa pauta")

    vote = Vote(session_id=session.id, topic_id=topic_id, user_id=user_id, vote=vote_value)
    db.add(vote)
    await db.commit()
    await db.refresh(vote)
    return vote

async def get_result(topic_id: int, db: AsyncSession):
    # Buscar sessão (passada ou ativa) para a pauta
    q = select(Session).where(Session.topic_id == topic_id)
    result = await db.execute(q)
    session = result.scalars().first()
    if not session:
        raise ValueError("Nenhuma sessão encontrada para essa pauta")

    # Contar votos sim e não
    q = select(func.count(Vote.id)).where(Vote.topic_id == topic_id, Vote.vote == "Sim")
    positive_result = await db.execute(q)
    positive_count = positive_result.scalar() or 0

    q = select(func.count(Vote.id)).where(Vote.topic_id == topic_id, Vote.vote == "Não")
    negative_result = await db.execute(q)
    negative_count = negative_result.scalar() or 0

    return {"sim": positive_count, "nao": negative_count}