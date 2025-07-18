import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/mydb")
Base = declarative_base()

async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True
)

sync_engine = create_engine(
    DATABASE_URL.replace("+asyncpg", "+psycopg2"),
    pool_pre_ping=True
)

AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def test_connection():
    try:
        async with async_engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        print(" Conexão com o banco de dados")
    except Exception as e:
        print(f"Falha na conexão{e}")
        raise

def create_tables():
    print("Criando tabelas...")
    from app.models import Base
    Base.metadata.create_all(bind=sync_engine)
    print("Tabelas criadas com sucesso!")