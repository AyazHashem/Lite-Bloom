import api from './api'
import { NewsArticle } from '@/types/news'

export const newsService = {

    async getGeneralNews(): Promise<NewsArticle[]> {
        const res = await api.get<NewsArticle[]>('/api/news/general')
        return res.data
    },

    async getRelevantNews(symbols: string[]): Promise<NewsArticle[]> {
        if (symbols.length === 0) return this.getGeneralNews()
        const res = await api.get<NewsArticle[]>('/api/news/relevant', {
            params: { symbols: symbols.join(',') }
        })
        return res.data
    },
}