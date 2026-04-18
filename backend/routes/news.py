from fastapi import APIRouter, HTTPException
from typing import List
from services import news_service

router = APIRouter()

@router.get("/general")
async def get_general_news():
    articles = await news_service.get_general_news()
    
    if not articles:
        raise HTTPException(status_code=503, detail="News service unavailable")
    
    return articles

@router.get("/relevant")
async def get_relevant_news(symbols: str = ""):
    symbol_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    articles = await news_service.get_relevant_news(symbol_list)
    
    if not articles:
        raise HTTPException(status_code=503, detail="News service unavailable")
    
    return articles