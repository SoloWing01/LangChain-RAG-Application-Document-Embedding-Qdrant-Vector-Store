from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db.mongodb import connect_mongodb, close_mongodb
from app.rag.memory import create_memory_index

from app.routes.health import router as health_router
from app.routes.chat import router as chat_router
from app.routes.documents import router as documents_router



@asynccontextmanager
async def lifespan(app: FastAPI):

    await connect_mongodb()
    await create_memory_index()

    yield

    await close_mongodb()


app = FastAPI(
    title="RAG Application",
    description="Document-based Retrieval Augmented Generation API",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
async def root():
    return {
        "message": "RAG Application API is running",
        "docs": "/docs"
    }
app.include_router(health_router)
app.include_router(chat_router)
app.include_router(documents_router)