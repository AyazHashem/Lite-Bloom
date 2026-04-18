from fastapi import APIRouter, HTTPException, Query
from typing import List
from services import alphavantage_service

router = APIRouter()

@router.get("/", response_model=List[dict])
async def search_symbols(q: str = Query(default="", min_length=1)):
    results = await alphavantage_service.search_symbol(q)
    
    return results