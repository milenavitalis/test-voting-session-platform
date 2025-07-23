import os
from dotenv import load_dotenv
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.database import Base
import os

load_dotenv(dotenv_path=".env.test", override=False) 

DATABASE_URL = os.getenv("DATABASE_URL")

engine_test = create_async_engine(DATABASE_URL, future=True, echo=False)
AsyncSessionTest = async_sessionmaker(engine_test, expire_on_commit=False)

@pytest_asyncio.fixture(scope="function")
async def db_session():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionTest() as session:
        yield session

    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


  