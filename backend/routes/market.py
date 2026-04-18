from fastapi import APIRouter, HTTPException, Depends
from models.market import Quote, MarketHistoryResponse, MarketStat, OilType, MetalQuote, CommodityQuote
from services import (
    yfinance_service, 
    twelvedata_service,
    crypto_service,
    forex_service,
    fred_service,
    metals_service,
    oil_service,
    polygon_service
)

router = APIRouter()

@router.get("/quote/{symbol}", response_model=Quote)
async def get_quote(symbol: str):
    symbol = symbol.upper()
    result = None
    
    if polygon_service.is_available():
        result = polygon_service.get_quote(symbol)
    if not result:
        result = yfinance_service.get_quote(symbol)
    if not result:
        raise HTTPException(status_code = 404, detail=f"Symbol {symbol} not found")
    
    return result

@router.get("/history/{symbol}", response_model=MarketHistoryResponse)
async def get_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d"
):
    result = None
    if polygon_service.is_available():
        result = polygon_service.get_history(symbol, period, interval)
    if not result:
        result = yfinance_service.get_history(symbol, period, interval)
    if not result:
        raise HTTPException(status_code=404, detail=f"No history found for {symbol}")
    
    return result

@router.get("/stats/{symbol}", response_model = MarketStat)
async def get_stats(symbol: str):
    result = yfinance_service.get_stats(symbol.upper())
    if not result:
        raise HTTPException(status_code=404, detail=f"No stats found for {symbol}")
    return 

@router.get("/indices")
async def get_indices():
    return yfinance_service.WORLD_INDICES

@router.get("/indices/{symbol}")
async def get_index_quote(symbol: str):
    result = await twelvedata_service.get_quote(symbol)
    
    if not result:
        result = yfinance_service.get_quote(symbol)
    
    if not result:
        raise HTTPException(status_code=404, detail=f"Index {symbol} not found")
    
    return result

@router.get("/crypto")
async def get_all_crypto():
    return await crypto_service.get_all_crypto_quotes()

@router.get("/crypto/{symbol}")
async def get_crypto_quote(symbol: str):
    formatted = f"{symbol.upper()}/USDT"
    result = await crypto_service.get_crypto_quote(formatted)
    
    if not result:
        raise HTTPException(status_code=404, detail=f"Crypto {symbol} not found")
    
    return result

@router.get("/crypto/{symbol}/history")
async def get_crypto_history(symbol: str, timeframe: str = "1d"):
    formatted = f"{symbol.upper()}/USDT"
    result = await crypto_service.get_crypto_history(formatted, timeframe)
    
    if not result:
        raise HTTPException(status_code=404, detail=f"No crypto history for {symbol}")
    
    return result

@router.get("/forex")
async def get_all_forex():
    return await forex_service.get_all_rates()

@router.get("/forex/{from_currency}/{to_currency}")
async def get_forex_rate(from_currency: str, to_currency: str):
    result = await forex_service.get_rate(
        from_currency.upper(),
        to_currency.upper()
    )
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Rate not found for {from_currency}/{to_currency}"
        )
    
    return result

@router.get("/forex/{from_currency}/{to_currency}/history")
async def get_forex_history(
    from_currency: str,
    to_currency: str,
    start_date: str = "2024-01-01",
    end_date: str = "2024-12-31"
):
    result = await forex_service.get_historical_rates(
        from_currency.upper(),
        to_currency.upper(),
        start_date,
        end_date
    )
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Forex history not found for pair {from_currency/to_currency}"
        )
    
    return result

@router.get("/commodities")
async def get_commodities():
    return yfinance_service.COMMODITY_FUTURES

@router.get("/metals", response_model=list[MetalQuote])
async def get_all_metals():
    symbols = ["XAU", "XAG", "XPT", "XPD"]
    results = []
    for symbol in symbols:
        quote = await metals_service.get_metal_quote(symbol)
        if quote:
            results.append(quote)
            
    return 

@router.get("/metals/{symbol}", response_model=MetalQuote)
async def get_metal(symbol: str):
    result = await metals_service.get_metal_quote(symbol.upper())
    
    if not result:
        raise HTTPException(status_code=404, detail=f"Metal {symbol} not found")
    
    return result

@router.get("/oil/{oil_type}", response_model=CommodityQuote)
async def get_oil(oil_type: OilType = OilType.WTI):
    result = await oil_service.get_oil_price(oil_type)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Could not fetch price for {oil_type.value}"
        )
    
    return result

@router.get("/bonds/yields")
async def get_treasury_yields():
    result = fred_service.get_treasury_yields()
    
    if not result:
        raise HTTPException(status_code=404, detail="Treasury yields unavailable")
    
    return result

@router.get("/bonds/yields/{maturity}/history")
async def get_yield_history(maturity: str):
    result = fred_service.get_yield_curve_history(maturity.upper())
    
    if not result:
        raise HTTPException(status_code=404, detail=f"Yield history not found for {maturity}")
    
    return result

@router.get("/macro/{indicator}")
async def get_macro(indicator: str):
    result = fred_service.get_macro_indicator(indicator.lower())
    
    if not result:
        raise HTTPException(status_code=404, detail=f"Macro indicator {indicator} not found")
    
    return result