from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.sentiment import SentimentResult
from services import sentiment_service

router = APIRouter()

class SentimentRequest(BaseModel):
    symbol: str
    name: str

@router.post("/analyze", response_model=SentimentResult)
async def analyze_sentiment(request: SentimentRequest):
    result = await sentiment_service.get_sentiment(
        request.symbol.upper(),
        request.name
    )
    
    if not result:
        raise HTTPException(
            status_code=503,
            detail="Sentiment analysis unavailable - no recent news found or AI service error"
        )
    
    return result