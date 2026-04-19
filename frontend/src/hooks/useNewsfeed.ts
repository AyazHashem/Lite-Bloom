import { useState, useEffect, useRef, useCallback } from 'react'
import { newsService } from '@/services/newsService'
import { NewsArticle } from '@/types/news'

const POLL_INTERVAL_MS = 5 * 60 * 1000  // 5 minutes

interface UseNewsfeedReturn {
    articles:     NewsArticle[]
    loading:      boolean
    lastUpdated:  Date | null
    newCount:     number          // articles added since last user interaction
    clearNewCount: () => void
}

export function useNewsfeed(activeSymbols: string[] = []): UseNewsfeedReturn {
    const [articles,    setArticles]    = useState<NewsArticle[]>([])
    const [loading,     setLoading]     = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [newCount,    setNewCount]    = useState(0)
    const knownUrls = useRef<Set<string>>(new Set())
    const isFirst   = useRef(true)

    const fetchNews = useCallback(async () => {
        try {
            const data = activeSymbols.length > 0
            ? await newsService.getRelevantNews(activeSymbols)
            : await newsService.getGeneralNews()

      // Count genuinely new articles since last fetch
            let added = 0
            data.forEach(article => {
                if (article.url && !knownUrls.current.has(article.url)) {
                    knownUrls.current.add(article.url)
                if (!isFirst.current) added++
                }
            })

      // Sort oldest first — newest at bottom (terminal convention)
            const sorted = [...data].sort(
                (a, b) =>
                new Date(a.published_at).getTime() -
                new Date(b.published_at).getTime()
            )

            setArticles(sorted)
            setLastUpdated(new Date())

            if (added > 0) setNewCount(prev => prev + added)
            isFirst.current = false

        } catch (err) {
            console.error('useNewsfeed fetch error:', err)
        } finally {
            setLoading(false)
        }
    }, [activeSymbols.join(',')])

    useEffect(() => {
        fetchNews()
        const timer = setInterval(fetchNews, POLL_INTERVAL_MS)
        return () => clearInterval(timer)
    }, [fetchNews])

    return {
        articles,
        loading,
        lastUpdated,
        newCount,
        clearNewCount: () => setNewCount(0),
    }
}