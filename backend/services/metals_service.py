import httpx
import yfinance as yf
from config import GOLDAPI_KEY, METALS_DEV_KEY
from models.market import MetalQuote
from utils import cache

METALS = {
    "XAU": {"name": "Gold", "futures": "GC=F", "unit": "troy oz"},
    "XAG": {"name": "Silver", "futures": "SI=F", "unit": "troy oz"},
    "XPT": {"name": "Platinum", "futures": "PL=F", "unit": "troy oz"},
    "XPD": {"name": "Palladium", "futures": "PA=F", "unit": "troy oz"},
}

async def get_metal_spot_goldapi(symbol: str, currency: str = "USD"):
    cache_key = f"metals_spot:{symbol}:{currency}"
    cached = cache.get(cache_key)
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.goldapi.io/api/{symbol}/{currency}",
                headers={
                    "x-access-toke": GOLDAPI_KEY,
                    "Content-Type": "application/json"
                }
            )
            
        if response.status_code == 200:
            data = response.json()
            result = {
                "spot_price": data.get("price"),
                "change": data.get("ch", 0),
                "change_percent": data.get("chp", 0),
            }
            cache.set(cache_key, result, "metals_spot")
            return result
        
        print(f"GoldAPI returned {response.status_code} for {symbol} - trying yfinance")
        return None
    
    except Exception as e:
        print(f"GoldAPI error for {symbol}: {e} - trying metals.dev")
        return None

async def get_metal_spot_metals_dev(symbol: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.metals.dev/v1/latest",
                params={
                    "api_key": METALS_DEV_KEY,
                    "currency": "USD",
                    "unit": "toz"
                }
            )
        
        if response.status_code == 200:
            data = response.json()
            metals_data = data.get("metals", {})
            metal_key = METALS[symbol]["metals_dev"]
            price = metals_data.get(metal_key)
            
            if not price:
                return None
            
            return{
                "spot_price": price,
                "change": 0,
                "change_percent": 0,
                "source": "metals_dev"
            }
            
        print(f"metals.dev returned {response.status_code} for {symbol} - trying yfinance ")
        return None
    
    except Exception as e:
        print(f"metals.dev error for {symbol}: {e} - trying yfinance ")
        return None
    
def get_metal_spot_yfinance(symbol: str):
    try:
        futures_symbol = METALS[symbol]["futures"]
        ticker = yf.ticker(futures_symbol)
        info = ticker.info
        
        previous_close = info.get("previousClose", 0)
        current_price = info.get("currentPrice") or info.get("regularMarketPrice", 0)
        change = current_price - previous_close
        change_percent = (change/previous_close*100) if previous_close else 0
        
        return {
            "spot_price": current_price,
            "change": round(change, 4),
            "change_percent": round(change_percent, 4),
            "source": "yfinance"
        }
    
    except Exception as e:
        print(f"yfinance metals fallback error for {symbol}: {e}")
        return None

async def get_metal_quote(symbol: str) -> MetalQuote:
    if symbol not in METALS:
        return None
    
    metal = METALS[symbol]
    
    spot_data = await get_metal_spot_goldapi(symbol)
    
    if not spot_data:
        spot_data = await get_metal_spot_metals_dev(symbol)
    
    if not spot_data:
        spot_data = get_metal_spot_yfinance(symbol)
    
    if not spot_data:
        return None
    
    futures_price = None
    
    delay = 0 if spot_data["source"] in ["goldapi", "metals_dev"] else 15
    
    try:
        futures_ticker = yf.Ticker(metal["futures"])
        futures_info = futures_ticker.info
        futures_price = (
            futures_info.get("currentPrice") or
            futures_info.get("regularMarketPrice")
        )
    except Exception as e:
        print(f"yfinance futures error for {symbol}: {e}")
        return None
    
    return MetalQuote(
        symbol=symbol,
        name=metal["name"],
        spot_price=spot_data["spot_price"],
        futures_price=futures_price,
        currency='USD',
        change=spot_data["change"],
        change_percent=spot_data["change_percent"],
        unit=metal["unit"],
        delay_minutes=0
    )