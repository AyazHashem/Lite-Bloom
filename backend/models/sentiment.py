from pydantic import BaseModel
from typing import List
from models.news import NewsArticle

class HeadlineScore(BaseModel):
    headline: str
    url: str
    source: str
    positive: float
    negative: float
    neutral: float
    label: str

class SentimentResult(BaseModel):
    symbol: str
    name: str
    label: str
    score: float
    reasoning: str
    headlines_analyzed: List[HeadlineScore]
    disclaimer: str = ("This analysis is for information purposes only and does not constitute financial advice. Always consult a licensed financial advisor before making investment decisions")