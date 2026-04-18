import yfinance as yf
import pandas as pd
from typing import List, Optional
from models.market import OHLCVBar, Quote, MarketStat, MarketHistoryResponse
from utils import cache

EXCHANGE_MAP = {
    "NMS": "NASDAQ",
    "NYQ": "NYSE",
    "NGM": "NASDAQ",
    "PCX": "NYSE",
    "LSE": "LSE",
    "TKS": "TSE",
    "HKG": "HKEX",
    "SES": "SGX",
}

def _safe_float(value, default=0.0) -> float:
    try:
        if value is None:
            return default
        return float(value)
    except (TypeError, ValueError):
        return default

def _get_current_price(info: dict) -> float:
        return _safe_float(
        info.get("currentPrice") or
        info.get("regularMarketPrice") or
        info.get("navPrice") or
        info.get("previousClose"),
        0.0
    )

def _timestamp_to_unix(ts) -> int:
        try:
            if hasattr(ts, 'timestamp'):
                return int(ts.timestamp())
            elif hasattr(ts, 'item'):
                return int(ts.item() / 1e9)
            else:
                return int(pd.Timestamp(ts).timestamp())
        except Exception:
            return 0

def get_quote(symbol: str) -> Optional[Quote]:
    """Fetch current price quote for any yfinance-supported symbol"""
    cache_key = f"quote:{symbol}"
    cached = cache.get(cache_key)
    if cached:
        return Quote(**cached)

    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        if not info:
            return None

        current_price = _get_current_price(info)
        if current_price == 0.0:
            return None

        previous_close = _safe_float(
            info.get("previousClose") or
            info.get("regularMarketPreviousClose")
        )

        change = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close else 0.0

        exchange_code = info.get("exchange", "")
        exchange = EXCHANGE_MAP.get(exchange_code, exchange_code)

        quote = Quote(
            symbol=symbol,
            name=info.get("shortName") or info.get("longName", symbol),
            price=round(current_price, 4),
            change=round(change, 4),
            change_percent=round(change_percent, 4),
            volume=int(info.get("volume") or info.get("regularMarketVolume") or 0),
            currency=info.get("currency", "USD"),
            exchange=exchange,
            delay_minutes=15
        )

        cache.set(cache_key, quote.dict(), "quote")
        return quote

    except Exception as e:
        print(f"yfinance get_quote error for {symbol}: {e}")
        return None

def get_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d"
) -> Optional[MarketHistoryResponse]:
    cache_key = f"history:{symbol}:{period}:{interval}"
    cached = cache.get(cache_key)
    if cached:
        return MarketHistoryResponse(**cached)

    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(
            period=period,
            interval=interval,
            auto_adjust=True,
            prepost=False
        )

        if df is None or df.empty:
            print(f"yfinance returned empty history for {symbol}")
            return None

        df = df.dropna(subset=["Open", "High", "Low", "Close"])

        if df.empty:
            return None

        bars = []
        seen_timestamps = set()

        for timestamp, row in df.iterrows():
            unix_time = _timestamp_to_unix(timestamp)

            if unix_time in seen_timestamps:
                continue
            seen_timestamps.add(unix_time)

            open_price = _safe_float(row.get("Open"))
            high_price = _safe_float(row.get("High"))
            low_price = _safe_float(row.get("Low"))
            close_price = _safe_float(row.get("Close"))

            if close_price <= 0 or open_price <= 0:
                continue

            bars.append(OHLCVBar(
                time=unix_time,
                open=round(open_price, 4),
                high=round(high_price, 4),
                low=round(low_price, 4),
                close=round(close_price, 4),
                volume=_safe_float(row.get("Volume"))
            ))

        if not bars:
            print(f"No valid bars extracted for {symbol}")
            return None

        bars.sort(key=lambda x: x.time)

        response = MarketHistoryResponse(
            symbol=symbol,
            timeframe=f"{period}_{interval}",
            bars=bars,
            delay_minutes=15
        )

        cache.set(cache_key, response.dict(), "history")
        return response

    except Exception as e:
        print(f"yfinance get_history error for {symbol}: {e}")
        return None

def get_stats(symbol: str) -> Optional[MarketStat]:
    cache_key = f"stats:{symbol}"
    cached = cache.get(cache_key)
    if cached:
        return MarketStat(**cached)

    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        if not info:
            return None

        stat = MarketStat(
            symbol=symbol,
            market_cap=info.get("marketCap"),
            pe_ratio=info.get("trailingPE"),
            week_high_52=info.get("fiftyTwoWeekHigh"),
            week_low_52=info.get("fiftyTwoWeekLow"),
            dividend_yield=info.get("dividendYield"),
            avg_volume=info.get("averageVolume")
        )

        cache.set(cache_key, stat.dict(), "stats")
        return stat

    except Exception as e:
        print(f"yfinance get_stats error for {symbol}: {e}")
        return None

WORLD_INDICES = [
    {"symbol": "^GSPC", "name": "S&P 500", "exchange": "NYSE", "region": "US"},
    {"symbol": "^IXIC", "name": "NASDAQ", "exchange": "NASDAQ", "region": "US"},
    {"symbol": "^DJI", "name": "Dow Jones", "exchange": "NYSE", "region": "US"},
    {"symbol": "^FTSE", "name": "FTSE 100", "exchange": "LSE", "region": "UK"},
    {"symbol": "^GDAXI", "name": "DAX", "exchange": "XETRA", "region": "Europe"},
    {"symbol": "^FCHI", "name": "CAC 40", "exchange": "EURONEXT", "region": "Europe"},
    {"symbol": "^N225", "name": "Nikkei 225", "exchange": "TSE", "region": "Japan"},
    {"symbol": "^HSI", "name": "Hang Seng", "exchange": "HKEX", "region": "HK"},
    {"symbol": "^STI", "name": "Straits Times", "exchange": "SGX", "region": "Singapore"},
    {"symbol": "^TASI.SR", "name": "Tadawul (TASI)", "exchange": "TADAWUL", "region": "Saudi Arabia"},
    {"symbol": "^ADX", "name": "ADX Index", "exchange": "ADX", "region": "Abu Dhabi"},
    {"symbol": "^DFMGI", "name": "DFM Index", "exchange": "DFM", "region": "Dubai"},
]

COMMODITY_FUTURES = [
    {"symbol": "GC=F", "name": "Gold", "type": "Metal", "unit": "oz"},
    {"symbol": "SI=F", "name": "Silver", "type": "Metal", "unit": "oz"},
    {"symbol": "CL=F", "name": "WTI Crude", "type": "Energy", "unit": "bbl"},
    {"symbol": "BZ=F", "name": "Brent Crude", "type": "Energy", "unit": "bbl"},
    {"symbol": "NG=F", "name": "Natural Gas", "type": "Energy", "unit": "MMBtu"},
    {"symbol": "HG=F", "name": "Copper", "type": "Metal", "unit": "lb"},
    {"symbol": "PL=F", "name": "Platinum", "type": "Metal", "unit": "oz"},
    {"symbol": "PA=F", "name": "Palladium", "type": "Metal", "unit": "oz"},
    {"symbol": "ZW=F", "name": "Wheat", "type": "Agriculture", "unit": "bu"},
    {"symbol": "ZC=F", "name": "Corn", "type": "Agriculture", "unit": "bu"},
    {"symbol": "ZS=F", "name": "Soybeans", "type": "Agriculture", "unit": "bu"},
    {"symbol": "KC=F", "name": "Coffee", "type": "Agriculture", "unit": "lb"},
]