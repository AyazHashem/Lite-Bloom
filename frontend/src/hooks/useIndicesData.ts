import { useState, useEffect } from 'react'
import api from '@/services/api'

export function useIndexHistory(
    symbol: string | null,
    period: string = '1mo',
    interval: string = '1d'
) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!symbol) return
        const fetch = async () => {
        setLoading(true)
        try {
            const res = await api.get(
                `/api/market/history/${symbol}?period=${period}&interval=${interval}`
            )
            setData(res.data)
        } catch (e) {
            console.error('History fetch failed:', e)
        } finally {
            setLoading(false)
        }
        }
        fetch()
    }, [symbol, period, interval])

    return { data, loading }
}

export function useExchangeIndices(exchangeId: string | null) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!exchangeId) return
        const fetch = async () => {
            setLoading(true)
            try{
                const res = await api.get(
                    `/api/landing/top-stocks/${exchangeId}?sort_by=marketcap`
                )
                setData(res.data)
            } catch (e) {
                console.error('Exchange indices fetch failed:', e)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [exchangeId])
    return { data, loading }
}