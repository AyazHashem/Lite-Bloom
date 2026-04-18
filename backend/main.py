from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from routes import market, news, sentiment, search, landing
from tasks.news_poller import poll_news

@asynccontextmanager
async def lifespan(app: FastAPI):
    poller_task = asyncio.create_task(poll_news())
    print("Server starting up...news poller started")
    yield
    poller_task.cancel()
    print("Server shutting down...news poller stopped")

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
app.include_router(news.router, prefix = "/api/news", tags=["News"])
app.include_router(sentiment.router, prefix = "/api/sentiment", tags=["Sentiment"])
app.include_router(search.router, prefix = "/api/search", tags=["Search"])
app.include_router(landing.router, prefix="/api/landing", tags=["Landing"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}