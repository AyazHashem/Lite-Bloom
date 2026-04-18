import httpx
import yfinance as yf
from typing import Optional
from config import OIL_PRICE_API_KEY
from models.market import CommodityQuote, OilType
from utils import cache

OIL_CONFIG = {
    OilType.WTI: {
        "name":       "WTI Crude Oil",
        "api_code":   "WTI_USD",
        "futures":    "CL=F",
        "unit":       "barrel"
    },
    OilType.BRENT: {
        "name":       "Brent Crude",
        "api_code":   "BRENT_CRUDE_USD",
        "futures":    "BZ=F",
        "unit":       "barrel"
    },
}

async def _get_oilpriceapi(oil_type: OilType) -> Optional[dict]:
    if not OIL_PRICE_API_KEY:
        print("OilPriceAPI key not configured")
        return None

    config = OIL_CONFIG[oil_type]

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.oilpriceapi.com/v1/prices/latest",
                headers={"Authorization": f"Token {OIL_PRICE_API_KEY}"},
                params={"by_code": config["api_code"]}
            )

        if response.status_code == 200:
            data = response.json()

            if data.get("status") != "success":
                print(f"OilPriceAPI returned non-success status: {data}")
                return None

            price_data = data.get("data", {})
            price = price_data.get("price")

            if price is None or float(price) <= 0:
                print(f"OilPriceAPI returned invalid price: {price}")
                return None

            return {
                "price":  float(price),
                "source": "oilpriceapi",
                "code":   price_data.get("code", config["api_code"])
            }

        print(f"OilPriceAPI HTTP {response.status_code} for {oil_type.value}")
        return None

    except Exception as e:
        print(f"OilPriceAPI error for {oil_type.value}: {e}")
        return None

def _get_yfinance_oil(oil_type: OilType) -> Optional[dict]:
    config = OIL_CONFIG[oil_type]
    try:
        ticker = yf.Ticker(config["futures"])
        info = ticker.info

        price = (
            info.get("regularMarketPrice") or
            info.get("currentPrice") or
            info.get("previousClose")
        )

        if not price or float(price) <= 0:
            hist = ticker.history(period="1d", interval="1h")
            if not hist.empty:
                price = float(hist["Close"].iloc[-1])
            else:
                return None

        price = float(price)
        previous_close = float(info.get("previousClose") or 0)
        change = price - previous_close if previous_close else 0.0
        change_percent = (change / previous_close * 100) if previous_close else 0.0

        return {
            "price":          round(price, 4),
            "change":         round(change, 4),
            "change_percent": round(change_percent, 4),
            "source":         "yfinance"
        }

    except Exception as e:
        print(f"yfinance oil fallback error for {oil_type.value}: {e}")
        return None

async def get_oil_price(oil_type: OilType = OilType.WTI) -> Optional[CommodityQuote]:
    cache_key = f"oil:{oil_type.value}"
    cached = cache.get(cache_key)
    if cached:
        return CommodityQuote(**cached)

    config = OIL_CONFIG[oil_type]

    api_data = await _get_oilpriceapi(oil_type)

    if api_data:
        yf_data = _get_yfinance_oil(oil_type)
        change = yf_data["change"] if yf_data else 0.0
        change_percent = yf_data["change_percent"] if yf_data else 0.0
        delay = 2
    else:
        print(f"OilPriceAPI failed, falling back to yfinance for {oil_type.value}")
        yf_data = _get_yfinance_oil(oil_type)
        if not yf_data:
            return None
        api_data = yf_data
        change = yf_data["change"]
        change_percent = yf_data["change_percent"]
        delay = 15

    result = CommodityQuote(
        symbol=oil_type.value,
        name=config["name"],
        price=api_data["price"],
        change=change,
        change_percent=change_percent,
        currency="USD",
        unit="barrel",
        category="energy",
        delay_minutes=delay
    )

    cache.set(cache_key, result.dict(), "oil")
    return result