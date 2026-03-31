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
}

def get_quote(symbol: str) -> Optional[Quote]:
    cache_key = f"quote:{symbol}"
    cached = cache.get(cache_key)
    if cached:
        return Quote(**cached)
    
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        if not info or "currentPrice" not in info:
            return None
        
        previous_close = info.get("previousClose", 0)
        current_price = info.get("currentPrice", 0)
        change = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close else 0
        
        exchange_code = info.get("exchange", "")
        exchange = EXCHANGE_MAP.get(exchange_code, exchange_code)
        
        quote = Quote(
            symbol = symbol,
            name = info.get("shortName", symbol),
            price = current_price,
            change = round(change, 4),
            change_percent = round(change_percent, 4),
            volume = info.get("volume", 0),
            currency = info.get("currency", "USD"),
            exchange = exchange,
            delay_minutes = 15
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
        df = ticker.history(period = period, interval = interval)
        
        if df.empty:
            return None
        
        bars = []
        for timestamp, row in df.iterrows():
            bars.append(OHLCVBar(
                time = int(timestamp.timestamp()),
                open = round(float(row["Open"]), 4),
                high = round(float(row["High"]), 4),
                low = round(float(row["Low"]), 4),
                close = round(float(row["Close"]), 4),
                volume = float(row["Volume"])
            ))
            
        response = MarketHistoryResponse(
            symbol = symbol,
            timeframe = f"{period}_{interval}",
            bars = bars,
            delay_minutes = 15
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
            symbol = symbol,
            market_cap = info.get("marketCap"),
            pe_ratio = info.get("trailingPE"),
            week_high_52 = info.get("fiftyTwoWeekHigh"),
            week_low_52 = info.get("fiftyTwoWeekLow"),
            dividend_yield = info.get("dividendYield"),
            avg_volume = info.get("averageVolume")
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
    {"symbol": "^GDAXI", "name": "DAX", "exchange": "XERTA", "region": "Europe"},
    {"symbol": "^FCHI", "name": "CAC 40", "exchange": "EURONEXT", "region": "Europe"},
    {"symbol": "^N225", "name": "Nikkei 225", "exchange": "TSE", "region": "Japan"},
    {"symbol": "^HSI", "name": "Hang Seng", "exchange": "HKEX", "region": "HK"},
    {"symbol": "^STI", "name": "Strait Times", "exchange": "SGX", "region": "Singapore"},
    {"symbol": "^TASI.SR", "name": "Tadawul (TASI)", "exchange": "TADAWUL", "region": "Saudi Arabia"},
    {"symbol": "^ADX", "name": "ADX Index", "exchange": "ADX", "region": "Abu Dhabi"},
    {"symbol": "^DFMGI", "name": "DFM Index", "exchange": "DFM", "region": "Dubai"},
]

COMMODITY_FUTURES = [
    {"symbol": "GC=F", "name": "Gold"},
    {"symbol": "SI=F", "name": "Silver"},
    {"symbol": "CL=F", "name": "WTI Crude Oil"},
    {"symbol": "BZ=F", "name": "Brent Crude"},
    {"symbol": "NG=F", "name": "Natural Gas"},
    {"symbol": "HG=F", "name": "Copper"},
    {"symbol": "ZW=F", "name": "Wheat"},
    {"symbol": "ZC=F", "name": "Corn"},
]