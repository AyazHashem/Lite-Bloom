import time
from typing import Any, Optional

TTL = {
    "quote": 30,
    "history": 300,
    "stats": 3600,
    "indicators": 3600,
    "news": 300,
    "sentiment": 3600,
    "forex": 60,
    "search": 3600,
    "metals_spot": 60,
    "metals_futures": 60,
    "oil": 120,
    "commodities": 300,
}

_cache: dict = {}

def get(key:str) -> Optional[Any]:
    if key not in _cache:
        return None
    
    entry = _cache[key]
    age = time.time() - entry["timestamp"]
    
    if age > entry["ttl"]:
        del _cache[key]
        return None

    return entry["data"]

def set(key: str, data: Any, ttl_key: str = "quote") -> None:
    _cache[key] = {
        "data": data,
        "timestamp": time.time(),
        "ttl": TTL.get(ttl_key, 300)
    }
    
def invalidate(key: str) -> None:
    if key in _cache:
        del _cache[key]

def clear_all() -> None:
    _cache.clear()
    
def get_stats() -> dict:
    return {
        "total_entries": len(_cache),
        "keys": list(_cache.keys())
    }

