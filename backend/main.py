from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from routes import market

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server starting up...")
    yield
    print("Server shutting down...")

app = FastAPI(
    title="Bloomberg-Lite",
    description="Real-time financial data aggregator",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market.router, prefix="/api/market", tags=["Market Data"])
# app.include_router(news.router, prefix = "/api/news", tags=["News"])
# app.include_router(sentiment.router, prefix = "/api/sentiment", tags=["Sentiment"])
# app.include_router(search.router, prefix = "/api/search", tags=["Search"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}

