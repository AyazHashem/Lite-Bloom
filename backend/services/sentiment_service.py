import httpx
from typing import List, Optional
from config import HF_TOKEN
from models.sentiment import SentimentResult, HeadlineScore
from services import news_service
from utils import cache

FINBERT_URL = "https://api-inference.huggingface.co/models/ProsusAI/finbert"

async def analyze_headline(headlines: List[str]) -> Optional[List[dict]]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                FINBERT_URL,
                headers = {"Authorization": f"Bearer {HF_TOKEN}"},
                json={"inputs": headlines}
            )
        
        if response.status_code == 200:
            return response.json()
        
        if response.status_code == 503:
            print("FinBERT model is loading, retry in a few seconds")
            return None
        
        print(f"FinBERT error: {response.status_code}")
        return None
    
    except Exception as e:
        print(f"FinBERT request error: {e}")
        return None

async def get_sentiment(symbol: str, name: str) -> Optional[SentimentResult]:
    cache_key = f"sentiment: {symbol}"
    cached = cache.get(cache_key)
    
    if cached:
        return SentimentResult(**cached)
    
    articles = await news_service.get_symbol_news([symbol, name])
    
    if not articles:
        return None
    
    articles = articles[:15]
    headlines = [a["headline"] for a in articles]
    raw_scores = await analyze_headline(headlines)
    
    if not raw_scores:
        return None
    
    headline_scores = []
    total_positive = 0
    total_negative = 0
    total_neutral = 0
    
    for i, scores in enumerate(raw_scores):
        if i >= len(articles):
            break
        
        score_dict = {s["label"].lower(): s["score"] for s in scores}
        
        positive = score_dict.get("positive", 0)
        negative = score_dict.get("negative", 0)
        neutral = score_dict.get("neutral", 0)
        
        total_positive += positive
        total_negative += negative
        total_neutral += neutral
        
        headline_scores.append(HeadlineScore(
            headline=articles[i]["headline"],
            url=articles[i]["url"],
            source=articles[i]["source"],
            positive=round(positive, 4),
            negative=round(negative, 4),
            neutral=round(neutral, 4),
            label="positive" if positive > negative and positive > neutral
                else "negative" if negative > positive and negative > neutral
                else "neutral"
        ))
    
    count = len(headline_scores)
    
    if count == 0:
        return None
    
    avg_positive = total_positive/count
    avg_negative = total_negative/count
    avg_neutral = total_neutral/count
    
    if avg_positive > avg_negative and avg_positive > avg_neutral and avg_positive > 0.55:
        label = "BUY"
        score = avg_positive
        reasoning = (
            f"Analysis of {count} recent headlines shows predominantly positive "
            f"sentiment ({avg_positive:.1%} positive). Market indicators suggest "
            f"favorable conditions for {name}."
        )
    
    elif avg_negative >avg_positive and avg_negative > avg_neutral and avg_neutral > 0.55:
        label = "SELL"
        score = avg_negative
        reasoning = (
            f"Analysis of {count} recent headlines shows predominantly negative "
            f"sentiment ({avg_negative:.1%} negative). Market indicators suggest "
            f"caution {name}."
        )
    
    else:
        label = "HOLD"
        score = avg_neutral
        reasoning = (
            f"Analysis of {count} recent headlines show mixed sentiment "
            f"(positive: {avg_positive:.1%}, negative: {avg_negative:.1%}, "
            f"neutral: {avg_neutral:.1%}). Insufficient signal to recommend "
            f"a strong position on {name}"
        )
    
    result = SentimentResult(
        symbol=symbol,
        name=name,
        label=label,
        score=round(score, 4),
        reasoning=reasoning,
        headlines_analyzed=headline_scores
    )
    
    cache.set(cache_key, result.dict(), "sentiment")
    return result