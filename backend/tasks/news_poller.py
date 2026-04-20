import asyncio
from services import news_service
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

supabase = None

if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        print(f"Supabase client init error: {type(e).__name__}: {e!r}")

async def store_articles(articles: list):
    if not articles or not supabase:
        return
    
    try:
        supabase.table("news_articles").upsert(
            articles,
            on_conflict="url"
        ).execute()
    
    except Exception as e:
        print(f"Supabase insert error: {type(e).__name__}: {e!r}")

async def poll_news():
    while True:
        try:
            print("News poller: fetching articles...")
            articles = await news_service.get_general_news()
            await store_articles(articles)
            print(f"News poller: stored {len(articles)} articles")
        
        except Exception as e:
            print(f"News poller error: {e}")
        
        await asyncio.sleep(600)