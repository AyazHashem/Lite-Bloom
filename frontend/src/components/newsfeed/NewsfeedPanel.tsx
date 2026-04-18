'use client'

import { useEffect, useRef, useState } from "react"
import { Box, Typography, CircularProgress } from '@mui/material'
import NewsItem from './NewsItem'
import { NewsArticle } from "@/types/news"
import api from '@/services/api'
import DelayBadge from '@/components/shared/DelayBadge'

const POLL_INTERVAL_MS = 5 * 60 * 1000

export default function NewsfeedPanel() {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const isFirstLoad = useRef(true)

    const fetchNews = async () => {
        try {
            const response = await api.get<NewsArticle[]>('/api/news/general')
            setArticles(response.data)
            setLastUpdated(new Date())

            if (isFirstLoad.current && scrollRef.current) {
                scrollRef.current.scrollTop = 0
                isFirstLoad.current = false
            }
        } catch (err) {
            console.error('Failed to fetch news: ', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect (() => {
        fetchNews()
        
        const interval = setInterval(fetchNews, POLL_INTERVAL_MS)

        return () => clearInterval(interval)
    }, [])

    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#080b12',
            borderTop: '2px solid #1e2130',
        }}
        >
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 0.75,
                borderBottom: '1px solid #1e2310',
                flexShrink: 0,
            }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                    <Box
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#26a69a',
                        animation: 'pulse 2s infinite',
                        '@keyframe pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.3 },
                            '100%': { opacity: 1 },
                        },
                    }}
                    />
                    <Typography
                    variant="caption"
                    sx={{
                        color: '#758696',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: 1,
                        fontSize: '0.65rem',
                    }}
                    >
                        MARKET NEWS
                    </Typography>
                </Box>

                {lastUpdated && (
                    <Typography
                    variant="caption"
                    sx={{ color: '#4a5568', fontFamily: 'monospace', fontSize: '0.6rem' }}
                    >
                        {`UPDATED ${lastUpdated.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })}`}
                    </Typography>
                )}
                <DelayBadge delayMinutes={0} size="small" />
            </Box>
            <Box
            ref={scrollRef}
            sx={{
                flex: 1,
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-track': { backgroundColor: '#080b12' },
                '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#2a2e39',
                        borderRadius: 2,
                    },
                }}
            >
                {loading && (
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 4,
                    }}
                    >
                        <CircularProgress size={24} sx={{ color: '#26a69a' }} />
                    </Box>
                )}

                {!loading && articles.length === 0 && (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#758696' }}>
                            No news available
                        </Typography>
                    </Box> 
                )}

                {!loading &&
                articles.map((article, index) => (
                    <NewsItem key={article.url || index} article={article} />
                ))}
            </Box>
        </Box>
    )
}