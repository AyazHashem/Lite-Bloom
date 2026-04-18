export interface OHLCVBar {
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export interface Quote {
    symbol: string
    name: string
    price: number
    change: number
    change_percent: number
    volume: number
    currency: string
    exchange: string
    delay_minutes: number
}

export interface MarketStat {
    symbol: string
    market_cap: string
    pe_ratio: number | null
    week_high_52: number | null
    week_low_52: number | null
    dividend_yield: number | null
    avg_volume: number | null
}

export interface MarketHistoryResponse {
    symbol: string
    timeframe: string
    bars: OHLCVBar[]
    delay_minutes: number
}

export type DataFreshness =
| 'realtime'
| 'near-realtime'
| 'delayed'
| 'end-of-day'

export function getDataFreshness(delayMinutes: number): DataFreshness {
    if(delayMinutes === 0) return 'realtime'
    if(delayMinutes <= 5) return 'near-realtime'
    if(delayMinutes <= 60) return 'delayed'
    return 'end-of-day'
}