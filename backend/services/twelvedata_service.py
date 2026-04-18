import httpx
from typing import Optional
from config import TWELVE_DATA_API_KEY
from utils import cache

BASE_URL = "https://api.twelvedata.com"

async def get_quote(symbol: str) -> Optional[dict]:
    cache_key = f"twelvedata_quote:{symbol}"
    cached = cache.get(cache_key)
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get (
                f"{BASE_URL}/quote",
                params = {
                    "symbol": symbol,
                    "apikey": TWELVE_DATA_API_KEY
                }
            )
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get("status") == "error":
                print(f"Twelve Data error {symbol}: {data.get('message')}")
                return None
            
            result = {
                "symbol": symbol,
                "name": data.get("name"),
                "price": float(data.get("close", 0)),
                "change": float(data.get("change", 0)),
                "change_percent": float(data.get("percent_change", 0)),
                "volume": float(data.get("volume", 0)),
                "currency": data.get("currency", "USD"),
                "exchange": data.get("exchange"),
                "delay_minutes": 5
            }
            
            cache.set(cache_key, result, "quote")
            return result
    
    except Exception as e:
        print(f"Twelve Data error for {symbol}: {e}")
        return None
    
async def get_history(
    symbol: str,
    interval: str = "1day",
    outputsize: int = 90
) -> Optional[dict]:
    cache_key = f"twelvedata_history:{symbol}:{interval}:{outputsize}"
    cached = cache.get(cache_key)
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BASE_URL}/time_series",
                params = {
                    "symbol": symbol,
                    "interval": interval,
                    "outputsize": outputsize,
                    "apikey": TWELVE_DATA_API_KEY
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("status") == "error":
                    return None
            
            values = data.get("values", [])
            
            bars = [
                {
                    "time": int(__import__('datetime').datetime.strptime(
                        v['datetime'], "%Y-%m-%d"
                    ).timestamp()),
                    "open": float(v["open"]),
                    "high": float(v["high"]),
                    "low": float(v["low"]),
                    "close": float(v["close"]),
                    "volume": float(v.get("volume", 0))
                }
                
                for v in reversed(values)
            ]
            
            result = {
                "symbol": symbol,
                "timeframe": interval,
                "bars": bars,
                "delay_minutes": 5
            }
            
            cache.set(cache_key, result, "history")
            return result
        
        return None

    except Exception as e:
        print(f"Twelve Data history error for {symbol}: {e}")
        return None

async def get_technical_indicator(
    symbol: str,
    indicator: str,
    interval: str = "1day"
    ) -> Optional[dict]:
    cache_key = f"indicator:{symbol}:{indicator}:{interval}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BASE_URL}/{indicator}",
                params = {
                    "symbol": symbol,
                    "interval": interval,
                    "apikey": TWELVE_DATA_API_KEY,
                    "outputsize": 90
                }
            )
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get("status") == "error":
                return None
            
            cache.set(cache_key, data, "indicators")
            return data
        
        return None

    except Exception as e:
        print(f"Twelve Data indicator error for {symbol}: {e}")
        return None