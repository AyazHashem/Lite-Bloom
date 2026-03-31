from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class NewsArticle(BaseModel):
    id: Optional[str] = None
    headline: str
    url: str
    source: str 
    published_at: datetime
    symbols: List[str] = []
    category: str
    summary: Optional[str] = None