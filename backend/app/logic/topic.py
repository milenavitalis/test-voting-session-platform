from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from app.models.topic import Topic, Session, Vote, SessionStatusEnum
from app.schemas.topic import TopicCreate, TopicOut 
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_


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
async def update_session_status(session: Session, db: AsyncSession):
    now = datetime.now(timezone.utc) .replace(tzinfo=timezone.utc)
    end_time = session.start_time + timedelta(minutes=session.duration_minutes)

    if session.status == SessionStatusEnum.close:
        return

    if session.status == SessionStatusEnum.pending and now >= session.start_time:
        session.status = SessionStatusEnum.open
        db.add(session)
        await db.commit()

    if session.status == SessionStatusEnum.open and now > end_time:
        session.status = SessionStatusEnum.close
        db.add(session)
        await db.commit()

async def list_topics(db: AsyncSession):
    result = await db.execute(
        select(Topic)
        .options(joinedload(Topic.sessions))
        .order_by(Topic.created_at.desc())
    )
    topics = result.unique().scalars().all()

    for topic in topics:
        for session in topic.sessions:
            await update_session_status(session, db)

    def get_status(topic: Topic) -> str:
        if not topic.sessions:
            return "pending"
        has_open = any(session.status == SessionStatusEnum.open for session in topic.sessions)
        has_pending = any(session.status == SessionStatusEnum.pending for session in topic.sessions)
        if has_open:
            return "open"
        elif has_pending:
            return "pending"
        else:
            return "close"

    return [
        TopicOut(
            id=topic.id,
            title=topic.title,
            description=topic.description,
            created_at=topic.created_at,
            status=get_status(topic),
        )
        for topic in topics
    ]


async def open_session(topic_id: int, duration_minutes: int, db: AsyncSession):
    # Verificar se existe sessão aberta
    q = select(Session).where(
        Session.topic_id == topic_id,
        Session.status == SessionStatusEnum.open
    )
    result = await db.execute(q)
    active_session = result.scalars().first()
    if active_session:
        raise ValueError("Sessão já está aberta para essa pauta")

    session = Session(
        topic_id=topic_id,
        duration_minutes=duration_minutes,
        status=SessionStatusEnum.open,
        start_time=datetime.now(timezone.utc).replace(tzinfo=timezone.utc)
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

async def vote(topic_id: int, user_id: int, vote_value: str, db: AsyncSession):
    now = datetime.now(timezone.utc).replace(tzinfo=timezone.utc)
    # Buscar sessão ativa para a pauta
    q = select(Session).where(
        Session.topic_id == topic_id,
        Session.status == SessionStatusEnum.open
    )
    result = await db.execute(q)
    session = result.scalars().first()
    if not session:
        raise ValueError("Sessão de votação não está aberta para essa pauta")

    end_time = session.start_time + timedelta(minutes=session.duration_minutes)
    if now > end_time:
        session.status = SessionStatusEnum.close
        db.add(session)
        await db.commit()
        raise ValueError("Sessão de votação já foi encerrada")

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