import httpx
from typing import Optional, List
from utils import cache

FOREX_PAIRS = [
    {"from": "USD", "to": "EUR", "name": "US Dollar / Euro"},
    {"from": "USD", "to": "GBP", "name": "US Dollar / British Pound"},
    {"from": "USD", "to": "JPY", "name": "US Dollar / Japanese Yen"},
    {"from": "USD", "to": "CHF", "name": "US Dollar / Swiss Franc"},
    {"from": "USD", "to": "CAD", "name": "US Dollar / Canadian Dollar"},
    {"from": "USD", "to": "AUD", "name": "US Dollar / Australian Dollar"},
    {"from": "USD", "to": "HKD", "name": "US Dollar / Hong Kong Dollar"},
    {"from": "USD", "to": "SGD", "name": "US Dollar / Singapore Dollar"},
    {"from": "USD", "to": "AED", "name": "US Dollar / UAE Dinar"},
    {"from": "USD", "to": "SAR", "name": "US Dollar / Saudi Riyal"},
    {"from": "EUR", "to": "GBP", "name": "Euro / British Pound"},
    {"from": "EUR", "to": "JPY", "name": "Euro / Japanese Yen"},
    {"from": "GBP", "to": "JPY", "name": "British Pound / Japanese Yen"},
]

async def get_rate (from_currency: str, to_currency: str) -> Optional[dict]:
    cache_key = f"forex{from_currency}:{to_currency}"
    cached = cache.get(cache_key)
    if cached:
        return cache

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.frankfurter.app/latest",
                params={
                    "from": from_currency,
                    "to": to_currency
                }
            )
            
        if response.status_code == 200:
            data = response.json()
            rate = data["rates"].get(to_currency)
            
            result = {
                "from_currency": from_currency,
                "to_currency": to_currency,
                "rate": rate,
                "date": data.get("date"),
                "pair": f"{from_currency}/{to_currency}",
                "delay_minutes": 0
            }
            
            cache.set(cache_key, result, "forex")
            return result
        
        return None
    
    except Exception as e:
        print(f"Forex error for {from_currency}/{to_currency}: {e}")
        return None

async def get_all_rates() -> List[dict]:
    results = []

    for pair in FOREX_PAIRS:
        rate = await get_rate(pair["from"], pair["to"])
        
        if rate:
            rate["name"] = pair["name"]
            results.append(rate)
    
    return results

async def get_historical_rates(
    from_currency: str,
    to_currency: str,
    start_date: str,
    end_date: str,
) -> Optional[dict]:
    cache_key = f"forex_history:{from_currency}:{to_currency}:{start_date}:{end_date}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.frankfurter.app/{start_date}...{end_date}",
                params={
                    "from": from_currency,
                    "to": to_currency
                }
            )
        
        if response.status_code == 200:
            data = response.json()
            bars = [
                {"date": date, "rate": rates[to_currency]}
                for date, rates in data.get("rates", {}).items()
            ]
            
            result = {
                "from_currency": from_currency,
                "to_currency": to_currency,
                "bars": sorted(bars, key=lambda x: x["date"]),
                "delay_minutes": 0
            }
            cache.set(cache_key, result, "history")
            return result
    
    except Exception as e:
        print(f"Forex history error: {e}")
        return None