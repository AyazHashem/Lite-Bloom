import httpx
import yfinance as yf
from config import OIL_PRICE_API_KEY
from models.market import CommodityQuote, OilType
from utils import cache

OIL_TYPES = {
    OilType.WTI: {
        "name": "WTI Crude Oil",
        "futures": "CL=F",
        "unit": "barrel"
        },
    OilType.BRENT: {
        "name": "Brent Crude",
        "futures": "BZ=F",
        "unit": "barrel"
        },
}

async def get_oil_price(oil_type: OilType = OilType.WTI) -> CommodityQuote:
    cache_key = f"oil:{oil_type.value}"
    cached = cache.get(cache_key)
    if cached:
        return CommodityQuote(**cached)
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://api.oilpriceapi.com/v1/prices/latest",
                headers={"Authorization": f"Token {OIL_PRICE_API_KEY}"},
                params={"by_code": oil_type}
            )
            
        if response.status_code == 200:
            data = response.json()
            price = float(data["data"]["price"])
            
            result = CommodityQuote(
                symbol=oil_type.value,
                name=OIL_TYPES[oil_type]["name"],
                price=price,
                change=0,
                change_percent=0,
                currency="USD",
                unit="barrel",
                category="energy",
                delay_minutes=2
            )
            
            cache.set(cache_key, result.dict(), "oil")
            return result
        
    except Exception as e:
        print(f"oilpriceapi error: {e} - falling back to yfinance")
    
    return get_oil_yfinance(oil_type)

def get_oil_yfinance(oil_type: OilType) -> CommodityQuote:
    try:
        futures_symbol = OIL_TYPES[oil_type]["futures"]
        ticker = yf.Ticker(futures_symbol)
        info = ticker.info
        
        previous_close = info.get("previousClose", 0)
        current_price = info.get("currentPrice", 0)
        change = current_price - previous_close
        change_percent = (change/previous_close*100) if previous_close else 0
        
        return CommodityQuote(
            symbol=oil_type.value,
            name=OIL_TYPES[oil_type]["name"],
            price=current_price,
            change=round(change_percent, 4),
            change_percent=round(change_percent, 4),
            currency="USD",
            unit="barrel",
            category="energy",
            delay_minutes=15
        )
        
    except Exception as e:
        print(f"yfinance fallback error: {e}")
        return None
        