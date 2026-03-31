from fastapi import APIRouter, HTTPException, Depends
from services import yfinance_service, metals_service, oil_service
from models.market import Quote, MarketHistoryResponse, MarketStat

router = APIRouter()

@router.get("/quote/{symbol}", response_model=Quote)
async def get_quote(symbol: str):
    result = yfinance_service.get_quote(symbol.upper())
    if not result:
        raise HTTPException(status_code=404, detail = f"Symbol {symbol} not found")
    return result

@router.get("/history/{symbol}", response_model=MarketHistoryResponse)
async def get_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d"
):
    result = yfinance_service.get_history(symbol.upper(), period, interval)
    if not result:
        raise HTTPException(status_code=404, detail = f"No history found for {symbol}")
    return result

@router.get("/stats/{symbol}", response_model = MarketStat)
async def get_stats(symbol: str):
    result = yfinance_service.get_stats(symbol.upper())
    if not result:
        raise HTTPException(status_code=404, detail=f"No stats found for {symbol}")
    return 

@router.get("/metals/{symbol}")
async def get_metal(symbol: str):
    result = await metals_service.get_metal_quote(symbol.upper())
    if not result:
        raise HTTPException(status_code=404, detail=f"Metal {symbol} not found")
    
    return result

@router.get("/metals")
async def get_all_metals():
    symbols = ["XAU", "XAG", "XPT", "XPD"]
    results = []
    for symbol in symbols:
        quote = await metals_service.get_metal_quote(symbol)
        if quote:
            results.append(quote)
            
    return results

@router.get("/oil/{oil_type}")
async def get_oil(oil_type: str):
    result = await oil_service.get_oil_price(oil_type.upper())
    if not result:
        raise HTTPException(status_code=404, detail=f"Oil type {oil_type} not found")
    
    return result

@router.get("/indices")
async def get_indices():
    return yfinance_service.WORLD_INDICES

@router.get("/commodities")
async def get_commodities():
    return yfinance_service.COMMODITY_FUTURES