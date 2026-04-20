import httpx
import feedparser
from typing import List, Optional
from datetime import timezone, datetime
from config import GUARDIAN_API_KEY, GNEWS_API_KEY
from utils import cache

RSS_FEEDS = [
    {"url": "https://feeds.reuters.com/reuters/businessNews", "source": "Reuters"},
    {"url": "https://feeds.reuters.com/reuters/companyNews", "source": "Reuters"},
    {"url": "https://feeds.marketwatch.com/marketwatch/topstories", "source": "MarketWatch"},
    {"url": "https://finance.yahoo.com/news/rssindex", "source": "Yahoo Finance"},
    {"url": "https://feeds.bloomberg.com/markets/news.rss", "source": "Bloomberg"},
]

def parse_rss_date(date_str: str) -> Optional[datetime]:
    if not date_str:
        return datetime.now(timezone.utc)
    
    try:
        import email.utils
        parsed = email.utils.parsedate_to_datetime(date_str)
        return parsed.astimezone(timezone.utc)
    
    except Exception:
        return datetime.now(timezone.utc)

async def fetch_rss_feed(feed_url: str, source: str) -> List[dict]:
    try:
        feed = feedparser.parse(feed_url)
        articles = []
        
        for entry in feed.entries[:10]:
            articles.append({
                "headline": entry.get("title", ""),
                "url": entry.get("link", ""),
                "source": source,
                "published_at": parse_rss_date(
                    entry.get("published", "")
                ).isoformat(),
                "summary": entry.get("summary", "")[:300] if entry.get("summary") else "",
                "symbols": [],
                "category": "general"
            })
        
        return articles
    
    except Exception as e:
        print(f"RSS feed error for {feed_url}: {e}")
        return []

async def get_rss_news() -> List[dict]:
    all_articles = []
    seen_urls = set()
    
    for feed in RSS_FEEDS:
        articles = await fetch_rss_feed(feed["url"], feed["source"])
        for article in articles:
            if article["url"] not in seen_urls:
                seen_urls.add(article["url"])
                all_articles.append(article)
    
    return all_articles

async def get_guardian_news(query: str = "financial markets") -> List[dict]:
    cache_key = f"guardian:{query}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                "https://content.guardianapis.com/search",
                params = {
                    "api-key": GUARDIAN_API_KEY,
                    "q": query,
                    "section": "business|money|technology",
                    "show-fields": "headline,short_url,trailText",
                    "order-by": "newest",
                    "page-size": 20
                }
            )
        
        if response.status_code == 200:
            data = response.json()
            results = data.get("response", {}).get("results", [])
            
            articles = [
                {
                    "headline": item.get("webTitle", ""),
                    "url": item.get("webUrl", ""),
                    "source": "The Guardian",
                    "published_at": item.get("webPublicationDate", ""),
                    "summary": item.get("fields", {}).get("trailText", ""),
                    "symbols": [],
                    "category": "general"
                }
                
                for item in results
            ]
            
            cache.set(cache_key, articles, "news")
            return articles
        
        return []
    
    except Exception as e:
        print(f"Guardian API error: {e}")
        return []

async def get_symbol_news(symbols: List[str]) -> List[dict]:
    if not symbols:
        return []
    
    query = " OR ".join(symbols)
    cache_key = f"gnews:{query}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                "https://gnews.io/api/v4/search",
                params={
                    "token": GNEWS_API_KEY,
                    "q": query,
                    "lang": "en",
                    "topic": "business",
                    "max": 10
                }
            )
            
        if response.status_code == 200:
            data = response.json()
            articles_raw = data.get("articles", [])
            
            articles = [
                {
                    "headline": a.get("title", ""),
                    "url": a.get("url", ""),
                    "source": a.get("source", {}).get("name", ""),
                    "published_at": a.get("publishedAt", ""),
                    "summary": a.get("description", ""),
                    "symbols": symbols,
                    "category": "general"
                }
                
                for a in articles_raw
            ]
            
            cache.set(cache_key, articles, "news")
            return articles
        
        return []
    
    except Exception as e:
        print(f"GNews error: {e}")
        return []

async def get_general_news() -> List[dict]:
    rss_articles = await get_rss_news()
    guardian_articles = await get_guardian_news()
    all_articles = rss_articles + guardian_articles
    seen = set()
    unique = []
    
    for article in all_articles:
        if article["url"] not in seen:
            seen.add(article["url"])
            unique.append(article)
    
    unique.sort(key=lambda x: x.get("published_at", ""), reverse = True)
    
    return unique

async def get_relevant_news(symbols: List[str]) -> List[dict]:
    general = await get_general_news()
    symbol_news = await get_symbol_news(symbols)
    all_articles = symbol_news + general
    seen = set()
    unique = []
    
    for article in all_articles:
        if article["url"] not in seen:
            seen.add(article["url"])
            unique.append(article)
    
    unique.sort(key=lambda x: x.get("published_at", ""), reverse = True)
    return unique