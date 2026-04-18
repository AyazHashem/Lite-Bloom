import ccxt.async_support as ccxt
import asyncio
from typing import Optional, List
from utils import cache

_exchange: Optional[ccxt.kraken] = None
_markets_loaded = False

async def get_exchange() -> ccxt.kraken:
    global _exchange, _markets_loaded

    if _exchange is None:
        _exchange = ccxt.kraken({
            'timeout': 15000,
            'enableRateLimit': True,
            'options': {
                'defaultType': 'spot',
            }
        })

    if not _markets_loaded:
        try:
            await _exchange.load_markets()
            _markets_loaded = True
            print("Kraken markets loaded successfully")
        except Exception as e:
            print(f"Failed to load Kraken markets: {e}")

    return _exchange

CRYPTO_SYMBOLS = [
    {"symbol": "BTC/USD", "name": "Bitcoin", "short": "BTC"},
    {"symbol": "ETH/USD", "name": "Ethereum", "short": "ETH"},
    {"symbol": "SOL/USD", "name": "Solana", "short": "SOL"},
    {"symbol": "XRP/USD", "name": "XRP", "short": "XRP"},
    {"symbol": "ADA/USD", "name": "Cardano", "short": "ADA"},
    {"symbol": "DOGE/USD",  "name": "Dogecoin", "short": "DOGE"},
    {"symbol": "DOT/USD", "name": "Polkadot", "short": "DOT"},
    {"symbol": "LTC/USD", "name": "Litecoin", "short": "LTC"},
    {"symbol": "AVAX/USD", "name": "Avalanche", "short": "AVAX"},
    {"symbol": "LINK/USD", "name": "Chainlink", "short": "LINK"},
]

TIMEFRAME_MAP = {
    "1m":  "1m",
    "5m":  "5m",
    "15m": "15m",
    "30m": "30m",
    "1h":  "1h",
    "4h":  "4h",
    "1d":  "1d",
    "1w":  "1w",
}

async def get_crypto_quote(symbol: str) -> Optional[dict]:
    cache_key = f"crypto_quote:{symbol}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        exchange = await get_exchange()
        ticker = await exchange.fetch_ticker(symbol)

        if not ticker:
            return None

        result = {
            "symbol": symbol,
            "name": next(
                (c["name"] for c in CRYPTO_SYMBOLS if c["symbol"] == symbol),
                symbol.split("/")[0]
            ),
            "price": float(ticker.get("last") or 0),
            "change": float(ticker.get("change") or 0),
            "change_percent": float(ticker.get("percentage") or 0),
            "volume": float(ticker.get("baseVolume") or 0),
            "high_24h": float(ticker.get("high") or 0),
            "low_24h": float(ticker.get("low") or 0),
            "bid": float(ticker.get("bid") or 0),
            "ask": float(ticker.get("ask") or 0),
            "currency": "USD",
            "exchange": "Kraken",
            "delay_minutes": 0
        }

        cache.set(cache_key, result, "quote")
        return result

    except ccxt.BadSymbol:
        print(f"Kraken does not support symbol: {symbol}")
        return None
    except ccxt.NetworkError as e:
        print(f"Kraken network error for {symbol}: {e}")
        return None
    except Exception as e:
        print(f"Crypto quote error for {symbol}: {e}")
        return None

async def get_crypto_history(
    symbol: str,
    timeframe: str = "1d",
    limit: int = 100
) -> Optional[dict]:
    cache_key = f"crypto_history:{symbol}:{timeframe}:{limit}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    kraken_timeframe = TIMEFRAME_MAP.get(timeframe, "1d")

    try:
        exchange = await get_exchange()
        ohlcv = await exchange.fetch_ohlcv(
            symbol,
            kraken_timeframe,
            limit=limit
        )

        if not ohlcv:
            return None

        bars = []
        seen_times = set()

        for candle in ohlcv:
            ts_ms = candle[0]
            ts_seconds = int(ts_ms / 1000)

            if ts_seconds in seen_times:
                continue
            seen_times.add(ts_seconds)

            open_p  = float(candle[1]) if candle[1] else 0
            high_p  = float(candle[2]) if candle[2] else 0
            low_p   = float(candle[3]) if candle[3] else 0
            close_p = float(candle[4]) if candle[4] else 0
            volume  = float(candle[5]) if candle[5] else 0

            if close_p <= 0:
                continue

            bars.append({
                "time":   ts_seconds,
                "open":   open_p,
                "high":   high_p,
                "low":    low_p,
                "close":  close_p,
                "volume": volume
            })

        bars.sort(key=lambda x: x["time"])

        result = {
            "symbol": symbol,
            "timeframe": timeframe,
            "bars": bars,
            "delay_minutes": 0
        }

        cache.set(cache_key, result, "history")
        return result

    except ccxt.BadSymbol:
        print(f"Kraken does not support symbol: {symbol}")
        return None
    except Exception as e:
        print(f"Crypto history error for {symbol}: {e}")
        return None

async def get_all_crypto_quotes() -> List[dict]:
    results = []
    for crypto in CRYPTO_SYMBOLS:
        quote = await get_crypto_quote(crypto["symbol"])
        if quote:
            results.append(quote)
    return results

async def close_exchange():
    global _exchange, _markets_loaded
    if _exchange:
        await _exchange.close()
        _exchange = None
        _markets_loaded = False