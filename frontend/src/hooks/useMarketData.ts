import { useState, useEffect, useCallback } from 'react'
import { marketService } from '@/services/marketService'
import { Quote, MarketHistoryResponse } from '@/types/market'

interface UseMarketDataReturn {
    quote:          Quote | null
    history:        MarketHistoryResponse | null
    loading:        boolean
    error:          string | null
    refetch:        () => void
}

export function useMarketData(
    symbol:   string | null,
    period:   string = '1mo',
    interval: string = '1d'
): UseMarketDataReturn {
    const [quote,   setQuote]   = useState<Quote | null>(null)
    const [history, setHistory] = useState<MarketHistoryResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!symbol) return

        setLoading(true)
        setError(null)

        try {
            const [quoteData, historyData] = await Promise.all([
                marketService.getQuote(symbol),
                marketService.getHistory(symbol, period, interval),
            ])
            setQuote(quoteData)
            setHistory(historyData)
        } catch (err: any) {
            const message = err?.response?.data?.detail ?? `Failed to load ${symbol}`
            setError(message)
            console.error(`useMarketData error for ${symbol}:`, err)
        } finally {
            setLoading(false)
        }
    }, [symbol, period, interval])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Auto-refresh quote every 30 seconds when symbol is active
    useEffect(() => {
        if (!symbol) return

        const interval_id = setInterval(async () => {
            try {
                const quoteData = await marketService.getQuote(symbol)
                setQuote(quoteData)
            } catch {
        // Silent fail on refresh — don't show error for background refresh
            }
        }, 30_000)

        return () => clearInterval(interval_id)
    }, [symbol])

    return { quote, history, loading, error, refetch: fetchData }
}