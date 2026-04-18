import { ExchangeConfig } from "@/lib/exchangeConfig"

export interface MarketQuote {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    currency: string
    exchange: string
    delay_minutes: number
    sparklineData?: number[]
}

export interface StockRow extends MarketQuote {
    ticker: string
    industry: string
    marketCap: number | null
    high24h: number
    low24h: number
    open: number
    close: number | null
    lastSale: number
    lastBuy: number
}

export interface CommodityRow {
    symbol: string
    name: string
    type: string
    price: number
    change: number
    changePercent: number
    unit: string
    high24h: number
    low24h: number
    open: number
    volume: number
    sparklineData?: number[]
}

export interface ForexRate {
    pair: string
    fromCurrency: string
    toCurrency: string
    rate: number
    change: number
    changePercent: number
    high24h: number
    low24h: number
}

export interface BondYield {
    maturity: string
    yield: string
    change: number
    date: string
}

export interface ExchangeData {
    exchange: ExchangeConfig
    composite: MarketQuote
    isOpen: boolean
    topStocks: StockRow[]
    sortBy: 'gain' | 'volume' | 'marketcap'
}

export type SortMode = 'gain' | 'volume'

import { ExchangeConfig } from "@/lib/exchangeConfig"