import api from './api'
import {
    Quote,
    MarketHistoryResponse,
    MarketStat,
} from '@/types/market'

export const marketService = {

    async getQuote(symbol: string): Promise<Quote> {
        const res = await api.get<Quote>(`/api/market/quote/${symbol}`)
        return res.data
    },

    async getHistory(
        symbol:   string,
        period:   string = '1mo',
        interval: string = '1d'
    ): Promise<MarketHistoryResponse> {
        const res = await api.get<MarketHistoryResponse>(
            `/api/market/history/${symbol}`,
            { params: { period, interval } }
        )
        return res.data
    },

    async getStats(symbol: string): Promise<MarketStat> {
        const res = await api.get<MarketStat>(`/api/market/stats/${symbol}`)
        return res.data
    },

    async getIndices(): Promise<any[]> {
        const res = await api.get('/api/market/indices')
        return res.data
    },

    async getCryptoQuote(symbol: string): Promise<any> {
        const res = await api.get(`/api/market/crypto/${symbol}`)
        return res.data
    },

    async getCryptoHistory(symbol: string, timeframe: string = '1d'): Promise<any> {
        const res = await api.get(
            `/api/market/crypto/${symbol}/history`,
            { params: { timeframe } }
        )
        return res.data
    },

    async getForexRates(): Promise<any[]> {
        const res = await api.get('/api/market/forex')
        return res.data
    },

    async getForexRate(from: string, to: string): Promise<any> {
        const res = await api.get(`/api/market/forex/${from}/${to}`)
        return res.data
    },

    async getMetalQuote(symbol: string): Promise<any> {
        const res = await api.get(`/api/market/metals/${symbol}`)
        return res.data
    },

    async getAllMetals(): Promise<any[]> {
        const res = await api.get('/api/market/metals')
        return res.data
    },

    async getOilPrice(oilType: 'WTI' | 'BRENT' = 'WTI'): Promise<any> {
        const res = await api.get(`/api/market/oil/${oilType}`)
        return res.data
    },

    async getTreasuryYields(): Promise<any[]> {
        const res = await api.get('/api/market/bonds/yields')
        return res.data
    },

    async searchSymbols(query: string): Promise<any[]> {
        if (!query || query.length < 1) return []
        const res = await api.get('/api/search/', { params: { q: query } })
        return res.data
    },
}