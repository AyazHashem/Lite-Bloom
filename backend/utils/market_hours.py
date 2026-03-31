from datetime import datetime
import pytz

MARKETS = {
    "NYSE": {
        "timezone": "America/New_York",
        "open": (9, 30),
        "close": (16, 0),
        "currency": "USD",
        "region": "North America"
        },
    "NASDAQ": {
        "timezone": "America/New_York",
        "open": (9, 30),
        "close": (16, 0),
        "currency": "USD",
        "region": "North America"
        },
    "LSE": {
        "timezone": "Europe/London",
        "open": (8, 0),
        "close": (16, 30),
        "currency": "GBP",
        "region": "Europe"
        },
    "TSE": {
        "timezone": "Asia/Tokyo",
        "open": (9, 0),
        "close": (15, 30),
        "currency": "JPY",
        "region": "Asia"
    },
    "HKEX": {
        "timezone": "Asia/Hong_Kong",
        "open": (9, 30),
        "close": (16, 0),
        "currency": "HKD",
        "region": "Asia"
    },
    "SGX": {
        "timezone": "Asia/Singapore",
        "open": (9, 0),
        "close": (17, 0),
        "currency": "SGD",
        "region": "Asia"
    },
    "TADAWUL": {
        "timezone": "Asia/Riyadh",
        "open": (10, 0),
        "close": (15, 0),
        "currency": "SAR",
        "region": "Middle East"
    },
    "ADX": {
        "timezone": "Asia/Dubai",
        "open": (10, 0),
        "close": (14, 0),
        "currency": "AED",
        "region": "Middle East"
    },
    "DFM": {
        "timezone": "Asia/Dubai",
        "open": (10, 0),
        "close": (14, 0),
        "currency": "AED",
        "region": "Middle East"
    },
    "XETRA": {
        "timezone": "Europe/Berlin",
        "open": (9, 0),
        "close": (17, 30),
        "currency": "EUR",
        "region": "Europe"
    },
    "EURONEXT": {
        "timezone": "Europe/Paris",
        "open": (9, 0),
        "close": (17, 30),
        "currency": "EUR",
        "region": "Europe"
    }
}

def is_market_open(exchange: str) -> bool:
    if exchange not in MARKETS:
        return False
    
    market = MARKETS[exchange]
    tz = pytz.timezone(market["timezone"])
    now = datetime.now(tz)
    
    if now.weekday() >= 5: #5 = Saturday, 6 = Sunday
        return False
    
    open_time = now.replace(
        hour = market["open"][0],
        minute = market["open"][1],
        second = 0,
        microsecond = 0
    )
    
    close_time = now.replace(
        hour = market["close"][0],
        minute = market["close"][1],
        second = 0,
        microsecond = 0
    )
    
    return open_time <= now <= close_time

def get_market_time(exchange: str) -> dict:
    if exchange not in MARKETS:
        return {"error": f"Unknown exchange: {exchange}"}
    
    market = MARKETS[exchange]
    tz = pytz.timezone(market["timezone"])
    now = datetime.now(tz)
    
    return {
        "exchange": exchange,
        "local_time": now.strftime("%H:%M:%S"),
        "local_date": now.strftime("%Y-%m-%d"),
        "timezone": market["timezone"],
        "is_open": is_market_open(exchange),
        "currency": market["currency"],
        "region": market["region"]
    }
    
def get_all_market_times() -> list:
    return [get_market_time(exchange) for exchange in MARKETS]
