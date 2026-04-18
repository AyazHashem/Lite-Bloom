from fastapi import APIRouter, HTTPException
from services import landing_service
from lib.exchange_config import EXCHANGES

router = APIRouter()

@router.get("/markets")
async def get_markets(sort_by: str = "gain"):
    try:
        markets = []
        
        for exchange in EXCHANGES:
            composite = await landing_service.get_exchange_composite(
                exchange["id"],
                exchange["composite"]
            )
            
            if composite:
                markets.append({
                    "exchange": exchange,
                    "composite": composite,
                    "is_open": composite.get("is_open", False),
                })
        
        if sort_by == "gain":
            markets.sort(
                key=lambda x: x["composite"].get("change_percent", 0),
                reverse=True
            )
        elif sort_by == "volume":
            markets.sort(
                key=lambda x: x["composite"].get("volume", 0),
                reverse=True
            )
        
        return markets
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(0))

@router.get("/top-stocks/{exchange_id}")
async def get_top_stocks(exchange_id: str, sort_by: str = "gain"):
    exchange = next(
        (e for e in EXCHANGES if e["id"] == exchange_id.upper()),
        None
    )
    
    if not exchange:
        raise HTTPException(
            status_code=404,
            detail=f"Exchange {exchange_id} not found"
        )
    
    stocks = await landing_service.get_top_stocks(
        exchange_id,
        exchange["top_stocks"],
        sort_by
    )
    
    return stocks

@router.get("/commodities")
async def get_commodities():
    return await landing_service.get_all_commodities()

@router.get("/forex")
async def get_forex():
    return await landing_service.get_landing_forex()

@router.get("/crypto")
async def get_crypto():
    return await landing_service.get_landing_crypto()

@router.get("/bonds")
async def get_bonds():
    result = await landing_service.get_landing_bonds()
    
    if not result:
        raise HTTPException(status_code=503, detail="Bond data unavailable")
    
    return result