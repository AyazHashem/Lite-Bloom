import httpx
import yfinance as yf
from typing import Optional
from config import GOLDAPI_KEY, METALS_DEV_KEY
from models.market import MetalQuote
from utils import cache

METALS = {
    "XAU": {
        "name": "Gold",
        "futures": "GC=F",
        "unit": "troy oz",
        "metals_dev": "gold",
        "goldapi_sym": "XAU"
    },
    "XAG": {
        "name": "Silver",
        "futures": "SI=F",
        "unit": "troy oz",
        "metals_dev": "silver",
        "goldapi_sym": "XAG"
    },
    "XPT": {
        "name": "Platinum",
        "futures": "PL=F",
        "unit": "troy oz",
        "metals_dev": "platinum",
        "goldapi_sym": "XPT"
    },
    "XPD": {
        "name": "Palladium",
        "futures": "PA=F",
        "unit": "troy oz",
        "metals_dev": "palladium",
        "goldapi_sym": "XPD"
    },
}

async def _get_goldapi(symbol: str) -> Optional[dict]:
    if not GOLDAPI_KEY:
        print("GoldAPI key not configured")
        return None

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"https://www.goldapi.io/api/{symbol}/USD",
                headers={
                    "x-access-token": GOLDAPI_KEY,
                    "Content-Type":   "application/json"
                }
            )

        if response.status_code == 200:
            data = response.json()
            price = data.get("price")
            if not price or float(price) <= 0:
                print(f"GoldAPI returned invalid price for {symbol}: {price}")
                return None

            return {
                "spot_price":     float(price),
                "change":         float(data.get("ch", 0) or 0),
                "change_percent": float(data.get("chp", 0) or 0),
                "source":         "goldapi"
            }

        print(f"GoldAPI HTTP {response.status_code} for {symbol}")
        return None

    except Exception as e:
        print(f"GoldAPI error for {symbol}: {e}")
        return None

async def _get_metals_dev(symbol: str) -> Optional[dict]:
    if not METALS_DEV_KEY:
        print("metals.dev key not configured")
        return None

    metal_key = METALS[symbol]["metals_dev"]

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.metals.dev/v1/latest",
                params={
                    "api_key":  METALS_DEV_KEY,
                    "currency": "USD",
                    "unit":     "toz"
                }
            )

        if response.status_code == 200:
            data = response.json()
            metals_data = data.get("metals", {})
            price = metals_data.get(metal_key)

            if not price or float(price) <= 0:
                print(f"metals.dev returned invalid price for {metal_key}: {price}")
                return None

            return {
                "spot_price":     float(price),
                "change":         0.0,
                "change_percent": 0.0,
                "source":         "metals_dev"
            }

        print(f"metals.dev HTTP {response.status_code} for {symbol}")
        return None

    except Exception as e:
        print(f"metals.dev error for {symbol}: {e}")
        return None

def _get_yfinance_futures(symbol: str) -> Optional[dict]:
    futures_symbol = METALS[symbol]["futures"]
    try:
        ticker = yf.Ticker(futures_symbol)
        info = ticker.info

        if not info:
            return None

        price = (
            info.get("regularMarketPrice") or
            info.get("currentPrice") or
            info.get("previousClose")
        )

        if not price or float(price) <= 0:
            # Last resort: get from recent history
            hist = ticker.history(period="1d", interval="1h")
            if not hist.empty:
                price = float(hist["Close"].iloc[-1])
            else:
                print(f"yfinance: no price data for {futures_symbol}")
                return None

        previous_close = float(info.get("previousClose") or 0)
        price = float(price)
        change = price - previous_close if previous_close else 0.0
        change_percent = (change / previous_close * 100) if previous_close else 0.0

        return {
            "spot_price":     round(price, 4),
            "change":         round(change, 4),
            "change_percent": round(change_percent, 4),
            "source":         "yfinance"
        }

    except Exception as e:
        print(f"yfinance metals fallback error for {futures_symbol}: {e}")
        return None

async def get_metal_quote(symbol: str) -> Optional[MetalQuote]:
    symbol = symbol.upper()
    if symbol not in METALS:
        print(f"Unknown metal symbol: {symbol}. Valid: {list(METALS.keys())}")
        return None

    metal = METALS[symbol]

    cache_key = f"metal_quote:{symbol}"
    cached = cache.get(cache_key)
    if cached:
        return MetalQuote(**cached)

    spot_data = await _get_goldapi(symbol)

    if not spot_data:
        print(f"GoldAPI failed for {symbol}, trying metals.dev")
        spot_data = await _get_metals_dev(symbol)

    if not spot_data:
        print(f"metals.dev failed for {symbol}, trying yfinance")
        spot_data = _get_yfinance_futures(symbol)

    if not spot_data:
        print(f"All metal data sources failed for {symbol}")
        return None

    futures_price = None
    try:
        futures_ticker = yf.Ticker(metal["futures"])
        futures_info = futures_ticker.info
        futures_price = (
            futures_info.get("regularMarketPrice") or
            futures_info.get("currentPrice")
        )
        if futures_price:
            futures_price = float(futures_price)
    except Exception as e:
        print(f"yfinance futures price unavailable for {symbol}: {e}")

    delay = 0 if spot_data["source"] in ("goldapi", "metals_dev") else 15

    result = MetalQuote(
        symbol=symbol,
        name=metal["name"],
        spot_price=spot_data["spot_price"],
        futures_price=futures_price,
        currency="USD",
        change=spot_data["change"],
        change_percent=spot_data["change_percent"],
        unit=metal["unit"],
        delay_minutes=delay
    )

    cache.set(cache_key, result.dict(), "metals_spot")
    return result