import pytest
from app.models import Topic, Session, Vote,  User
from app.logic.topic import (
    create_topic,
    open_session,
    vote,
    get_result,
)
from app.schemas.topic import TopicCreate
from datetime import timedelta, datetime
from sqlalchemy import insert


@pytest.mark.asyncio
async def test_create_topic(db_session):
    data = TopicCreate(title="Nova Pauta", description="Descrição da pauta")
    topic = await create_topic(data, db_session)

    assert topic["title"] == "Nova Pauta"
    assert topic["status"] == "Aguardando Abertura"


@pytest.mark.asyncio
async def test_open_session(db_session):
    topic = Topic(title="Sessão Teste", description="Teste")
    db_session.add(topic)

    await db_session.flush()  
    await db_session.refresh(topic)

    session = await open_session(topic.id, 5, db_session)
    
    assert session.topic_id == topic.id
    assert session.status == "open"


@pytest.mark.asyncio
async def test_vote_flow(db_session):
    # Criação do tópico e sessão
    topic = Topic(title="Votação", description="Testando")
    user = User(name="Usuário", cpf="12345678901", password_hash="abc")
    db_session.add_all([topic, user])
    await db_session.commit()
    await db_session.refresh(topic)
    await db_session.refresh(user)

    session = await open_session(topic.id, 1, db_session)

    vote_obj = await vote(topic.id, user.id, "Sim", db_session)

    assert vote_obj.topic_id == topic.id
    assert vote_obj.vote == "Sim"


@pytest.mark.asyncio
async def test_vote_duplicate(db_session):
    topic = Topic(title="Duplicado", description="Teste")
    user = User(name="Repetido", cpf="98765432100", password_hash="abc")
    db_session.add_all([topic, user])
    await db_session.commit()
    await db_session.refresh(topic)
    await db_session.refresh(user)

    session = await open_session(topic.id, 1, db_session)
    await vote(topic.id, user.id, "Sim", db_session)

    with pytest.raises(ValueError, match="Pauta já votada pelo usuário"):
        await vote(topic.id, user.id, "Não", db_session)


@pytest.mark.asyncio
async def test_get_result(db_session):
    topic = Topic(title="Resultado", description="Final")
    user1 = User(name="User1", cpf="11111111111", password_hash="x")
    user2 = User(name="User2", cpf="22222222222", password_hash="y")

    # Sessão já encerrada (com finish_time no passado)
    start_time = datetime.utcnow() - timedelta(minutes=10)
    finish_time = start_time + timedelta(minutes=1)

    session = Session(
        topic=topic,
        start_time=start_time,
        finish_time=finish_time,
        duration_minutes=1,
    )
    vote1 = Vote(session=session, topic=topic, user=user1, vote="Sim")
    vote2 = Vote(session=session, topic=topic, user=user2, vote="Não")

    db_session.add_all([topic, user1, user2, session, vote1, vote2])
    await db_session.commit()
    await db_session.refresh(session)

    result = await get_result(topic.id, db_session)

    assert result["positive_count"] == 1
    assert result["negative_count"] == 1
    assert result["session_id"] == session.id