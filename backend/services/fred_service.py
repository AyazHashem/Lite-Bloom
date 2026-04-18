from fredapi import Fred
from typing import Optional, List
from config import FRED_API_KEY
from utils import cache
import pandas as pd

fred = Fred(api_key=FRED_API_KEY)

TREASURY_SERIES = {
    "2Y": "DGS2",
    "5Y": "DGS5",
    "10Y": "DGS10",
    "30Y": "DGS30"
}

MACRO_SERIES = {
    "oil_wti": "DCOILWTICO",
    "gold": "GOLDAMGBD228NLBM",
    "cpi": "CPIAUCSL",
    "gdp": "GDP",
    "unemployment": "UNRATE"
}

def get_treasury_yields() -> Optional[List[dict]]:
    cache_key = f"fred:treasury_yields"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    try:
        yields = []
        for maturity, series_id in TREASURY_SERIES.items():
            series = fred.get_series(series_id, limit=1)
            if not series.empty:
                yields.append({
                    "maturity": maturity,
                    "yield": float(series.iloc[-1]),
                    "date": str(series.index[-1].date()),
                    "series_id": series_id
                })
        
        cache.set(cache_key, yields, "stats")
        return yields
    
    except Exception as e:
        print(f"FRED treasury yields error: {e}")
        return None

def get_yield_curve_history(maturity: str = "10Y", periods: int = 252) -> Optional[dict]:
    cache_key = f"fred:yield_history:{maturity}:{periods}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    try:
        series_id = TREASURY_SERIES.get(maturity)
        if not series_id:
            return None
        
        series = fred.get_series(series_id, limit=periods)
        
        bars = [
            {
                "date": str(date.date()),
                "yield": float(value) if not pd.isna(value) else None
            }
            
            for date, value in series.items()
        ]
        
        result = {
            "maturity": maturity,
            "series_id": series_id,
            "bars": bars,
            "delay_minutes": 1440
        }
        
        cache.set(cache_key, result, "history")
        return result
    
    except Exception as e:
        print(f"FRED yield history error for {maturity}: {e}")
        return None

def get_macro_indicator(indicator: str) -> Optional[dict]:
    cache_key = f"fred:macro:{indicator}"
    cached = cache.get(cache_key)
    
    if cached:
        return cache
    
    try:
        series_id = MACRO_SERIES.get(indicator)
        
        if not series_id:
            return None
        
        series = fred.get_series(series_id, limit=1)
        
        if series.empty:
            return None
        
        result = {
            "indicator": indicator,
            "value": float(series.iloc[-1]),
            "date": str(series.index[-1].date()),
            "series_id": series_id
        }
        
        cache.set(cache_key, result, "stats")
        return result
    
    except Exception as e:
        print(f"FRED macro error for {indicator}: {e}")
        return None