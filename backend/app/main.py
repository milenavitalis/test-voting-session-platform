from fastapi import FastAPI
from app.routes import router
from app.database import create_tables, test_connection
from contextlib import asynccontextmanager
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    await test_connection() 
    create_tables() 
    yield

app = FastAPI(
    title="Projeto Sessão de Votação",
    lifespan=lifespan
)

app.include_router(router)