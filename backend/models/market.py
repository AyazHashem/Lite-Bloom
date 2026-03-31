from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class OilType(str, Enum):
    WTI = "WTI"
    BRENT = "BRENT"

class OHLCVBar(BaseModel):
    time: int
    open: float
    high: float
    low: float
    close: float
    volume: float 

class Quote(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    volume: float
    currency: str
    delay_minutes: int

class MarketStat(BaseModel):
    symbol: str
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    week_high_52: Optional[float] = None
    week_low_52: Optional[float] = None
    dividend_yield: Optional[float] = None
    avg_volume: Optional[float] = None
    
class MarketHistoryResponse(BaseModel):
    symbol: str
    timeframe: str
    bars: List[OHLCVBar]
    delay_minutes: int

class IndexItem(BaseModel):
    symbol: str
    name: str
    price: float
    change_percent: float
    region: str
    currency: str

class MetalQuote(BaseModel):
    symbol: str
    name: str
    spot_price: float
    futures_price: Optional[float] = None
    currency: str
    change: float
    change_percent: float
    unit: str
    delay_minutes: int

class CommodityQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    currency: str
    unit: str
    category: str
    delay_minutes: int