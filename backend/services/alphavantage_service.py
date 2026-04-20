import httpx
from typing import List, Optional
from config import ALPHAVANTAGE_API_KEY
from utils import cache

BASE_URL = "https://www.alphavantage.co/query"

async def get_indicator(
    symbol: str,
    indicator: str,
    interval: str = "daily"
) -> Optional[dict]:
    cache_key = f"alphavantage:{indicator}:{symbol}:{interval}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    function_map = {
        "RSI": "RSI",
        "MACD": "MACD",
        "BBANDS": "BBANDS",
        "EMA": "EMA",
        "SMA": "SMA",
    }
    
    function = function_map.get(indicator.upper())
    if not function:
        return None
    
    try:
        params = {
            "function": function,
            "symbol": symbol,
            "interval": interval,
            "apikey": ALPHAVANTAGE_API_KEY,
            "time_period": 14,
            "series_type": "close"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            if "Note" in data:
                print("Alphavantage rate limit reached")
                return None
            
            if "Error Message" in data:
                print(f"Alpha Vantage error: {data['Error Message']}")
                return None
            
            cache.set(cache_key, data, "indicators")
            return data
        
        return None
    
    except Exception as e:
        print(f"Alpha Vantage error for {symbol} {indicator}: {e}")
        return None

async def search_symbol(query: str) -> Optional[List]:
    cache_key = f"search:{query}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                BASE_URL,
                params = {
                    "function": "SYMBOL_SEARCH",
                    "keywords": query,
                    "apikey": ALPHAVANTAGE_API_KEY
                }
            )
        
        if response.status_code == 200:
            data = response.json()
            
            if "Note" in data:
                print("Alpha Vantage rate limit reached")
                return []
            
            matches = data.get("bestMatches", [])
            
            results = [
                {
                    "symbol": m.get("1. symbol"),
                    "name": m.get("2. name"),
                    "type": m.get("3. type"),
                    "region": m.get("4. region"),
                    "currency": m.get("8. currency"),
                }
                
                for m in matches
            ]
            
            cache.set(cache_key, results, "search")
            return results
        
        return []
    
    except Exception as e:
        print(f"Symbol search error: {e}")
        return []