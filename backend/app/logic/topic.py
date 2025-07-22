from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from app.models.topic import Topic, Session, Vote,  calculate_session_status
from app.schemas.topic import TopicCreate, TopicOut 
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.schemas.topic import SessionResponse


async def create_topic(data: TopicCreate, db: AsyncSession):
    topic = Topic(title=data.title, description=data.description)
    db.add(topic)
    await db.commit()
    await db.refresh(topic)
    return {
        "id": topic.id,
        "title": topic.title,
        "description": topic.description,
        "created_at": topic.created_at,
        "status": "Aguardando Abertura",
    }

async def list_topics(db: AsyncSession):
    result = await db.execute(
        select(Topic)
        .options(joinedload(Topic.sessions))
        .order_by(Topic.created_at.desc())
    )
    topics = result.unique().scalars().all()

    def get_topic_status(topic: Topic) -> str:
        if not topic.sessions:
            return "pending"
        
        statuses = [
            calculate_session_status(s.start_time, s.finish_time)
            for s in topic.sessions
        ]

        if "open" in statuses:
            return "open"
        elif "pending" in statuses:
            return "pending"
        else:
            return "close"

    return [
        TopicOut(
            id=topic.id,
            title=topic.title,
            description=topic.description,
            created_at=topic.created_at,
            status=get_topic_status(topic),
        )
        for topic in topics
    ]

async def open_session(topic_id: int, duration_minutes: int, db: AsyncSession):
    # Verifica se já existe sessão ativa
    result = await db.execute(
        select(Session).where(
            Session.topic_id == topic_id
        )
    )
    existing_sessions = result.scalars().all()

    for session in existing_sessions:
        if calculate_session_status(session.start_time, session.finish_time) == "open":
            raise ValueError("Sessão já está aberta para essa pauta")

    start_time = datetime.now(timezone.utc)
    finish_time = start_time + timedelta(minutes=duration_minutes or 1)

    session = Session(
        topic_id=topic_id,
        duration_minutes=duration_minutes,
        start_time=start_time,
        finish_time=finish_time
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return SessionResponse.session_with_status(session)

async def vote(topic_id: int, user_id: int, vote_value: str, db: AsyncSession):
    now = datetime.now(timezone.utc)

    # Buscar sessão com status "open"
    result = await db.execute(
        select(Session).where(Session.topic_id == topic_id)
    )
    sessions = result.scalars().all()

    session = next(
        (s for s in sessions if calculate_session_status(s.start_time, s.finish_time) == "open"),
        None
    )
    if not session:
        raise ValueError("Sessão de votação não está aberta para essa pauta")

    # Verifica se o usuário já votou
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
    result = await db.execute(
    select(Session)
    .where(Session.topic_id == topic_id)
    .order_by(Session.finish_time.desc())
)
    session = next(
    (s for s in result.scalars() if calculate_session_status(s.start_time, s.finish_time) == "close"),
    None
)
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