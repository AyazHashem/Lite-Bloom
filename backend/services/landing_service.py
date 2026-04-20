import yfinance as yf
import asyncio
import time
from typing import List, Optional, Dict
from utils import cache
from utils.market_hours import is_market_open
from lib.exchange_config import EXCHANGES, COMMODITY_SYMBOLS, CRYPTO_SYMBOLS

def _safe_float(value, default=0.0) -> float:
    try:
        if value is None:
            return default
        return float(value)
    except (TypeError, ValueError):
        return default

def get_quote_sync(symbol: str) -> Optional[Dict]:
    """
    Uses yf.download() instead of ticker.info to avoid rate limiting.
    download() is more reliable and less likely to get 429 errors.
    """
    cache_key = f"landing_quote:{symbol}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        # Use download() — more stable than ticker.info for bulk requests
        df = yf.download(
            symbol,
            period="5d",
            interval="1d",
            auto_adjust=True,
            progress=False
        )

        if df is None or df.empty:
            return None

        # Handle MultiIndex columns that yf.download returns
        if hasattr(df.columns, 'levels'):
            df.columns = df.columns.droplevel(1)

        latest = df.iloc[-1]
        prev   = df.iloc[-2] if len(df) > 1 else df.iloc[-1]

        current_price  = _safe_float(latest.get('Close'))
        previous_close = _safe_float(prev.get('Close'))

        if current_price <= 0:
            return None

        change         = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close else 0.0

        # Get sparkline from close prices
        sparkline = [round(_safe_float(v), 2) for v in df['Close'].tolist()[-10:]]

        result = {
            "symbol":         symbol,
            "name":           symbol,
            "price":          round(current_price, 4),
            "change":         round(change, 4),
            "change_percent": round(change_percent, 4),
            "volume":         int(_safe_float(latest.get('Volume'))),
            "currency":       "USD",
            "exchange":       "",
            "market_cap":     None,
            "pe_ratio":       None,
            "industry":       "",
            "sector":         "",
            "high_24h":       round(_safe_float(latest.get('High')), 4),
            "low_24h":        round(_safe_float(latest.get('Low')), 4),
            "open":           round(_safe_float(latest.get('Open')), 4),
            "previous_close": round(previous_close, 4),
            "delay_minutes":  15,
            "sparkline":      sparkline,
        }

        cache.set(cache_key, result, "quote")
        return result

    except Exception as e:
        print(f"Landing quote error for {symbol}: {e}")
        return None


async def get_exchange_composite(
    exchange_id: str,
    composite_symbol: str
) -> Optional[Dict]:
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

    # Fetch all symbols at once using yf.download bulk mode
    # This is much more efficient and less likely to rate limit
    try:
        symbols_str = " ".join(symbols)
        df = yf.download(
            symbols_str,
            period="2d",
            interval="1d",
            auto_adjust=True,
            progress=False
        )

        if df is None or df.empty:
            return []

        stocks = []
        for symbol in symbols:
            try:
                # Extract per-symbol data from MultiIndex DataFrame
                if len(symbols) > 1:
                    close  = df['Close'][symbol]
                    high   = df['High'][symbol]
                    low    = df['Low'][symbol]
                    open_p = df['Open'][symbol]
                    volume = df['Volume'][symbol]
                else:
                    close  = df['Close']
                    high   = df['High']
                    low    = df['Low']
                    open_p = df['Open']
                    volume = df['Volume']

                latest = close.iloc[-1]
                prev   = close.iloc[-2] if len(close) > 1 else close.iloc[-1]

                current_price  = _safe_float(latest)
                previous_close = _safe_float(prev)

                if current_price <= 0:
                    continue

                change         = current_price - previous_close
                change_percent = (change / previous_close * 100) if previous_close else 0.0
                sparkline      = [round(_safe_float(v), 2) for v in close.tolist()[-10:]]

                stocks.append({
                    "symbol":         symbol,
                    "name":           symbol,
                    "price":          round(current_price, 4),
                    "change":         round(change, 4),
                    "change_percent": round(change_percent, 4),
                    "volume":         int(_safe_float(volume.iloc[-1])),
                    "high_24h":       round(_safe_float(high.iloc[-1]), 4),
                    "low_24h":        round(_safe_float(low.iloc[-1]), 4),
                    "open":           round(_safe_float(open_p.iloc[-1]), 4),
                    "previous_close": round(previous_close, 4),
                    "market_cap":     None,
                    "pe_ratio":       None,
                    "industry":       "",
                    "currency":       "USD",
                    "exchange":       exchange_id,
                    "delay_minutes":  15,
                    "sparkline":      sparkline,
                })

            except Exception as e:
                print(f"Stock parse error for {symbol}: {e}")
                continue

        # Sort
        if sort_by == "gain":
            stocks.sort(key=lambda x: x.get("change_percent", 0), reverse=True)
        elif sort_by == "volume":
            stocks.sort(key=lambda x: x.get("volume", 0), reverse=True)
        elif sort_by == "marketcap":
            stocks.sort(key=lambda x: x.get("market_cap") or 0, reverse=True)

        cache.set(cache_key, stocks, "quote")
        return stocks

    except Exception as e:
        print(f"get_top_stocks error for {exchange_id}: {e}")
        return []


async def get_all_commodities() -> List[Dict]:
    cache_key = "landing_commodities"
    cached = cache.get(cache_key)
    if cached:
        return cached

    symbols = [c["symbol"] for c in COMMODITY_SYMBOLS]
    symbols_str = " ".join(symbols)

    try:
        df = yf.download(
            symbols_str,
            period="2d",
            interval="1d",
            auto_adjust=True,
            progress=False
        )

        if df is None or df.empty:
            return []

        commodities = []
        for i, commodity in enumerate(COMMODITY_SYMBOLS):
            symbol = commodity["symbol"]
            try:
                if len(symbols) > 1:
                    close  = df['Close'][symbol]
                    high   = df['High'][symbol]
                    low    = df['Low'][symbol]
                    open_p = df['Open'][symbol]
                    volume = df['Volume'][symbol]
                else:
                    close  = df['Close']
                    high   = df['High']
                    low    = df['Low']
                    open_p = df['Open']
                    volume = df['Volume']

                latest = _safe_float(close.iloc[-1])
                prev   = _safe_float(close.iloc[-2] if len(close) > 1 else close.iloc[-1])

                if latest <= 0:
                    continue

                change         = latest - prev
                change_percent = (change / prev * 100) if prev else 0.0
                sparkline      = [round(_safe_float(v), 2) for v in close.tolist()[-10:]]

                commodities.append({
                    "symbol":         symbol,
                    "name":           commodity["name"],
                    "type":           commodity["type"],
                    "unit":           commodity["unit"],
                    "price":          round(latest, 4),
                    "change":         round(change, 4),
                    "change_percent": round(change_percent, 4),
                    "volume":         int(_safe_float(volume.iloc[-1])),
                    "high_24h":       round(_safe_float(high.iloc[-1]), 4),
                    "low_24h":        round(_safe_float(low.iloc[-1]), 4),
                    "open":           round(_safe_float(open_p.iloc[-1]), 4),
                    "delay_minutes":  15,
                    "sparkline":      sparkline,
                })

            except Exception as e:
                print(f"Commodity parse error for {symbol}: {e}")
                continue

        commodities.sort(key=lambda x: x.get("change_percent", 0), reverse=True)
        cache.set(cache_key, commodities, "quote")
        return commodities

    except Exception as e:
        print(f"get_all_commodities error: {e}")
        return []


async def get_landing_forex() -> List[Dict]:
    import httpx
    cache_key = "landing_forex"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        # httpx.AsyncClient must be used as async context manager
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.frankfurter.app/latest",
                params={"from": "USD"}
            )

        if response.status_code == 200:
            data  = response.json()
            rates = data.get("rates", {})
            pairs = []

            target_currencies = [
                "EUR", "GBP", "JPY", "CHF",
                "AUD", "CAD", "HKD", "SGD", "AED", "SAR"
            ]

            for currency in target_currencies:
                if currency in rates:
                    pairs.append({
                        "pair":            f"USD/{currency}",
                        "from_currency":   "USD",
                        "to_currency":     currency,
                        "rate":            rates[currency],
                        "change":          0,
                        "change_percent":  0,
                        "delay_minutes":   0,
                    })

            cache.set(cache_key, pairs, "forex")
            return pairs

        return []

    except Exception as e:
        print(f"Landing forex error: {e}")
        return []


async def get_landing_crypto() -> List[Dict]:
    cache_key = "landing_crypto"
    cached = cache.get(cache_key)
    if cached:
        return cached

    symbols = [c["symbol"] for c in CRYPTO_SYMBOLS]
    symbols_str = " ".join(symbols)

    try:
        df = yf.download(
            symbols_str,
            period="2d",
            interval="1d",
            auto_adjust=True,
            progress=False
        )

        if df is None or df.empty:
            return []

        crypto_list = []
        for crypto in CRYPTO_SYMBOLS:
            symbol = crypto["symbol"]
            try:
                if len(symbols) > 1:
                    close = df['Close'][symbol]
                else:
                    close = df['Close']

                latest = _safe_float(close.iloc[-1])
                prev   = _safe_float(close.iloc[-2] if len(close) > 1 else close.iloc[-1])

                if latest <= 0:
                    continue

                change         = latest - prev
                change_percent = (change / prev * 100) if prev else 0.0
                sparkline      = [round(_safe_float(v), 2) for v in close.tolist()[-10:]]

                crypto_list.append({
                    "symbol":         symbol,
                    "name":           crypto["name"],
                    "price":          round(latest, 4),
                    "change":         round(change, 4),
                    "change_percent": round(change_percent, 4),
                    "volume":         0,
                    "sparkline":      sparkline,
                    "delay_minutes":  15,
                })

            except Exception as e:
                print(f"Crypto parse error for {symbol}: {e}")
                continue

        crypto_list.sort(key=lambda x: x.get("change_percent", 0), reverse=True)
        cache.set(cache_key, crypto_list, "quote")
        return crypto_list

    except Exception as e:
        print(f"get_landing_crypto error: {e}")
        return []


async def get_landing_bonds() -> List[Dict]:
    from services.fred_service import get_treasury_yields
    return get_treasury_yields() or []