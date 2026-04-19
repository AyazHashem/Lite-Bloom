from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from routes import market, news, sentiment, search, landing
from tasks.news_poller import poll_news
from services.crypto_service import close_exchange

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server starting up...")
    poller_task = asyncio.create_task(poll_news())
    yield
    print("Server shutting down...")
    poller_task.cancel()
    try:
        await poller_task
    except asyncio.CancelledError:
        pass
    await close_exchange()
    print("Shutdown complete.")

app = FastAPI(
    title="Bloomberg Terminal Clone API",
    description="Real-time financial data terminal",
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

app.include_router(market.router,   prefix="/api/market",    tags=["Market Data"])
app.include_router(news.router,     prefix="/api/news",      tags=["News"])
app.include_router(sentiment.router,prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(search.router,   prefix="/api/search",    tags=["Search"])
app.include_router(landing.router,  prefix="/api/landing",   tags=["Landing"])

@app.get("/health")
async def health_check():
    return {
        "status":  "ok",
        "version": "1.0.0"
    }