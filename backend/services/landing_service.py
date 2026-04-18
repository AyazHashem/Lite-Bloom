import yfinance as yf
import asyncio
from typing import List, Dict, Optional
from utils import cache
from utils.market_hours import is_market_open
from lib.exchange_config import EXCHANGES, COMMODITY_SYMBOLS

def get_quote_sync(symbol: str) -> Optional[Dict]:
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        if not info:
            return None
        
        previous_close = info.get("previousClose") or info.get("regularMarketPreviousClose", 0)
        current_price = (
            info.get("currentPrice") or
            info.get("regularMarketPrice") or
            info.get("navPrice", 0)
        )
        
        if not current_price:
            return None
        
        change = current_price - previous_close if previous_close else 0
        change_percent = (change/previous_close*100) if previous_close else 0
        hist = ticker.history(period="5d", interval="1h")
        sparkline = []
        
        if not hist.empty:
            sparkline = [round(float(v), 2) for v in hist["Close"].tolist()[-20:]]
            
        return {
            "symbol": symbol,
            "name": info.get("shortName") or info.get("longName", symbol),
            "price": round(float(current_price), 4),
            "change": round(float(change), 4),
            "change_percent": round(float(change_percent), 4),
            "volume": info.get("volume") or info.get("regularMarketVolume", 0),
            "currency": info.get("currency", "USD"),
            "exchange": info.get("exchange", ""),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "industry": info.get("industry", ""),
            "sector": info.get("sector", ""),
            "high_24h": info.get("dayHigh") or info.get("regularMarketDayHigh", 0),
            "low_24h": info.get("dayLow") or info.get("regularMarketDayLow", 0),
            "open": info.get("open") or info.get("regularMarketOpen", 0),
            "previous_close": previous_close,
            "delay_minutes": 15,
            "sparkline": sparkline,
        }
    
    except Exception as e:
        print(f"Landing service quote error for {symbol}: {e}")
        return None

async def get_exchange_composite(exchange_id: str, composite_symbol: str) -> Optional[Dict]:
    cache_key = f"landing_composite:{composite_symbol}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, get_quote_sync, composite_symbol)
    
    if result:
        result["is_open"] = is_market_open(exchange_id)
        cache.set(cache_key, result, "quote")
    
    return result

async def get_top_stocks(
    exchange_id: str,
    symbols: List[str],
    sort_by: str = "gain"
) -> List[Dict]:
    cache_key = f"landing_stocks:{exchange_id}:{sort_by}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    loop = asyncio.get_event_loop()
    tasks = [
        loop.run_in_executor(None, get_quote_sync, symbol)
        for symbol in symbols
    ]
    results = await asyncio.gather(*tasks)
    stocks = [r for r in results if r is not None]
    
    if sort_by == "gain":
        stocks.sort(key=lambda x: x.get("change_percent", 0), reverse=True)
    elif sort_by == "volume":
        stocks.sort(key=lambda x: x.get("volume", 0), reverse=True)
    elif sort_by == "marketcap":
        stocks.sort(key=lambda x: x.get("market_cap") or 0, reverse=True)
    
    cache.set(cache_key, stocks, "quote")
    return stocks

async def get_all_commodities() -> List[Dict]:
    cache_key = f"landing_commodities"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    loop = asyncio.get_event_loop()
    tasks = [
        loop.run_in_executor(None, get_quote_sync, c["symbol"])
        for c in COMMODITY_SYMBOLS
    ]
    results = await asyncio.gather(*tasks)
    commodities = []
    
    for i, result in enumerate(results):
        if result:
            result["type"] = COMMODITY_SYMBOLS[i]["type"]
            result["unit"] = COMMODITY_SYMBOLS[i]["unit"]
            commodities.append(result)
    
    commodities.sort(key=lambda x: x.get("change_percent", 0), reverse=True)
    
    cache.set(cache_key, commodities, "quote")
    return commodities

async def get_landing_forex() -> List[Dict]:
    import httpx
    cache_key = "landing_forex"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient as client:
            response = await client.get(
                "https://api.frankfurter.app/latest",
                params={"from": "USD"}
            )
        
        if response.status_code == 200:
            data = response.json()
            rates = data.get("rates", {})
            pairs = []
            
            target_currencies = [
                "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "HKD", "SGD", "AED", "SAR"
            ]
            
            for currency in target_currencies:
                if currency in rates:
                    pairs.append({
                        "pair": f"USD/{currency}",
                        "from_currency": "USD",
                        "to_currency": currency,
                        "rate": rates[currency],
                        "change": 0,
                        "change_percent": 0,
                    })
            
            cache.set(cache_key, pairs, "forex")
            return pairs
    
    except Exception as e:
        print(f"Landing forex error: {e}")
        return []

async def get_landing_crypto() -> List[Dict]:
    from lib.exchange_config import CRYPTO_SYMBOLS
    
    cache_key = "landing_crypto"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    loop = asyncio.get_event_loop()
    tasks = [
        loop.run_in_executor(None, get_quote_sync, c["symbol"])
        for c in CRYPTO_SYMBOLS
    ]
    results = await asyncio.gather(*tasks)
    crypto = [r for r in results if r is not None]
    crypto.sort(key=lambda x: x.get("change_percent", 0), reverse=True)
    cache.set(cache_key, crypto, "quote")
    return crypto

async def get_landing_bonds () -> List[Dict]:
    from services.fred_service import get_treasury_yields
    return get_treasury_yields() or []