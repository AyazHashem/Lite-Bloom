import { useEffect, useState } from 'react'
import api from '@/services/api'

export function useMarkets(sortBy: 'gain' | 'volume' = 'gain') {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true)
                const res = await api.get(`/api/landing/markets?sort_by=${sortBy}`)
                setData(res.data)
            } catch (e) {
                setError('Failed to load markets')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [sortBy])

    return { data, loading, error }
}

export function useTopStocks(
    exchangeId: string,
    sortBy: 'gain' | 'volume' | 'marketcap' = 'gain'
) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!exchangeId) return
        const fetch = async () => {
            try {
                setLoading(true)
                const res = await api.get(
                    `/api/landing/top-stocks/${exchangeId}?sort_by=${sortBy}`
                )
                setData(res.data)
            } catch (e) {
                console.error('Failed to load top stocks:', e)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [exchangeId, sortBy])

    return { data, loading }
}

export function useCommodities() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    
}