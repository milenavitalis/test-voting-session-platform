import pytest
from app.models import Topic, Session, Vote, SessionStatusEnum, User
from app.logic.topic import (
    create_topic,
    list_topics,
    open_session,
    vote,
    get_result,
)
from app.schemas.topic import TopicCreate
from datetime import timedelta, datetime
from sqlalchemy import insert


@pytest.mark.asyncio
async def test_create_topic(test_db):
    data = TopicCreate(title="Nova Pauta", description="Descrição da pauta")
    topic = await create_topic(data, test_db)

    assert topic["title"] == "Nova Pauta"
    assert topic["status"] == "Aguardando Abertura"


@pytest.mark.asyncio
async def test_open_session(test_db):
    topic = Topic(title="Sessão Teste", description="Teste")
    test_db.add(topic)
    await test_db.commit()
    await test_db.refresh(topic)

    session = await open_session(topic.id, 5, test_db)
    assert session.topic_id == topic.id
    assert session.status == SessionStatusEnum.open


@pytest.mark.asyncio
async def test_vote_flow(test_db):
    # Criação do tópico e sessão
    topic = Topic(title="Votação", description="Testando")
    user = User(name="Usuário", cpf="12345678901", password_hash="abc")
    test_db.add_all([topic, user])
    await test_db.commit()
    await test_db.refresh(topic)
    await test_db.refresh(user)

    session = await open_session(topic.id, 1, test_db)

    vote_obj = await vote(topic.id, user.id, "Sim", test_db)

    assert vote_obj.topic_id == topic.id
    assert vote_obj.vote == "Sim"


@pytest.mark.asyncio
async def test_vote_duplicate(test_db):
    topic = Topic(title="Duplicado", description="Teste")
    user = User(name="Repetido", cpf="98765432100", password_hash="abc")
    test_db.add_all([topic, user])
    await test_db.commit()
    await test_db.refresh(topic)
    await test_db.refresh(user)

    session = await open_session(topic.id, 1, test_db)
    await vote(topic.id, user.id, "Sim", test_db)

    with pytest.raises(ValueError, match="Pauta já votada pelo usuário"):
        await vote(topic.id, user.id, "Não", test_db)


@pytest.mark.asyncio
async def test_get_result(test_db):
    # Simulando tópico e sessão encerrada
    topic = Topic(title="Resultado", description="Final")
    user1 = User(name="User1", cpf="111", password_hash="x")
    user2 = User(name="User2", cpf="222", password_hash="y")

    session = Session(
        topic=topic,
        start_time=datetime.utcnow() - timedelta(minutes=10),
        duration_minutes=1,
        status=SessionStatusEnum.close
    )
    vote1 = Vote(session=session, topic=topic, user=user1, vote="Sim")
    vote2 = Vote(session=session, topic=topic, user=user2, vote="Não")

    test_db.add_all([topic, user1, user2, session, vote1, vote2])
    await test_db.commit()

    result = await get_result(topic.id, test_db)

    assert result["positive_count"] == 1
    assert result["negative_count"] == 1
    assert result["session_id"] == session.id
