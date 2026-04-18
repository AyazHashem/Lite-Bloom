export interface NewsArticle {
    id?: string
    headline: string
    url: string
    source: string
    published_at: string
    symbols: string[]
    category: string
    summary?: string
}