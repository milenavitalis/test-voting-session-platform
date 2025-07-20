from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import login, topic
from app.database import create_tables, test_connection
from contextlib import asynccontextmanager
import traceback

@asynccontextmanager
async def lifespan(app: FastAPI):
    await test_connection() 
    create_tables() 
    yield

app = FastAPI(
    title="Projeto Sessão de Votação",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        print("Erro inesperado:", traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"detail": "Ocorreu um erro. Tente novamente mais tarde."},
        )

app.include_router(login.router)
app.include_router(topic.router)