from datetime import datetime, timedelta
from typing import Optional, List
from config import MASSIVE_API_KEY
from models.market import OHLCVBar, Quote, MarketHistoryResponse
from utils import cache

try:
    from massive import RESTClient as MassiveClient
    MASSIVE_AVAILABLE = True
except ImportError:
    try:
        from polygon import RESTClient as MassiveClient
        MASSIVE_AVAILABLE = True
    except ImportError:
        MASSIVE_AVAILABLE = False
        print("Warning: Neither massive nor polygon-api-client installed")

TIMESPAN_MAP = {
    "1m":  ("1",  "minute"),
    "5m":  ("5",  "minute"),
    "15m": ("15", "minute"),
    "30m": ("30", "minute"),
    "1h":  ("1",  "hour"),
    "4h":  ("4",  "hour"),
    "1d":  ("1",  "day"),
    "1wk": ("1",  "week"),
    "1mo": ("1",  "month"),
}

PERIOD_MAP = {
    "1d":  1,
    "5d":  5,
    "1mo": 30,
    "3mo": 90,
    "6mo": 180,
    "1y":  365,
    "2y":  730,
    "5y":  1825,
}

def _get_client():
    if not MASSIVE_AVAILABLE:
        raise RuntimeError("Massive client not installed")
    if not MASSIVE_API_KEY:
        raise RuntimeError("MASSIVE_API_KEY not configured")
    return MassiveClient(MASSIVE_API_KEY)

def get_quote(symbol: str) -> Optional[Quote]:
    if not MASSIVE_AVAILABLE or not MASSIVE_API_KEY:
        return None

    cache_key = f"massive_quote:{symbol}"
    cached = cache.get(cache_key)
    if cached:
        return Quote(**cached)

    try:
        client = _get_client()

        snapshot = client.get_snapshot_ticker("stocks", symbol)

        if not snapshot:
            return None

        day = snapshot.day
        prev_day = snapshot.prev_day

        if not day:
            return None

        current_price = float(day.c or 0)  # close price
        prev_close = float(prev_day.c or 0) if prev_day else 0.0

        if current_price <= 0:
            return None

        change = current_price - prev_close
        change_percent = (change / prev_close * 100) if prev_close else 0.0

        try:
            details = client.get_ticker_details(symbol)
            name = details.name if details else symbol
            exchange = details.primary_exchange if details else "NYSE"
            # Massive returns MIC codes like XNAS, XNYS — simplify them
            if "NAS" in str(exchange):
                exchange = "NASDAQ"
            elif "NYS" in str(exchange):
                exchange = "NYSE"
        except Exception:
            name = symbol
            exchange = "NYSE"

        quote = Quote(
            symbol=symbol,
            name=name,
            price=round(current_price, 4),
            change=round(change, 4),
            change_percent=round(change_percent, 4),
            volume=int(day.v or 0),
            currency="USD",
            exchange=exchange,
            delay_minutes=0
        )

        cache.set(cache_key, quote.dict(), "quote")
        return quote

    except Exception as e:
        print(f"Massive get_quote error for {symbol}: {e}")
        return None

def get_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d"
) -> Optional[MarketHistoryResponse]:
    if not MASSIVE_AVAILABLE or not MASSIVE_API_KEY:
        return None

    cache_key = f"massive_history:{symbol}:{period}:{interval}"
    cached = cache.get(cache_key)
    if cached:
        return MarketHistoryResponse(**cached)

    timespan_config = TIMESPAN_MAP.get(interval, ("1", "day"))
    multiplier = timespan_config[0]
    timespan = timespan_config[1]

    days_back = PERIOD_MAP.get(period, 30)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)

    from_str = start_date.strftime("%Y-%m-%d")
    to_str = end_date.strftime("%Y-%m-%d")

    try:
        client = _get_client()

        aggs = []
        for agg in client.list_aggs(
            ticker=symbol,
            multiplier=int(multiplier),
            timespan=timespan,
            from_=from_str,
            to=to_str,
            adjusted=True,
            sort="asc",
            limit=50000
        ):
            aggs.append(agg)

        if not aggs:
            return None

        bars = []
        seen_times = set()

        for agg in aggs:
            ts_ms = agg.timestamp
            if ts_ms is None:
                continue

            ts_seconds = int(ts_ms / 1000)

            if ts_seconds in seen_times:
                continue
            seen_times.add(ts_seconds)

            open_p  = float(agg.open  or 0)
            high_p  = float(agg.high  or 0)
            low_p   = float(agg.low   or 0)
            close_p = float(agg.close or 0)
            volume  = float(agg.volume or 0)

            if close_p <= 0:
                continue

            bars.append(OHLCVBar(
                time=ts_seconds,
                open=round(open_p, 4),
                high=round(high_p, 4),
                low=round(low_p, 4),
                close=round(close_p, 4),
                volume=volume
            ))

        if not bars:
            return None

        response = MarketHistoryResponse(
            symbol=symbol,
            timeframe=f"{period}_{interval}",
            bars=bars,
            delay_minutes=0
        )

        cache.set(cache_key, response.dict(), "history")
        return response

    except Exception as e:
        print(f"Massive get_history error for {symbol}: {e}")
        return None

def is_available() -> bool:
    return MASSIVE_AVAILABLE and bool(MASSIVE_API_KEY)