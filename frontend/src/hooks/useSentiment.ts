import { useState, useCallback } from 'react'
import { sentimentService } from '@/services/sentimentService'
import { SentimentResult } from '@/types/sentiment'

interface UseSentimentReturn {
    result:   SentimentResult | null
    loading:  boolean
    error:    string | null
    analyze:  (symbol: string, name: string) => Promise<void>
    reset:    () => void
}

export function useSentiment(): UseSentimentReturn {
    const [result,  setResult]  = useState<SentimentResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)

    const analyze = useCallback(async (symbol: string, name: string) => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const data = await sentimentService.analyze({ symbol, name })
            setResult(data)
        } catch (err: any) {
            const message =
            err?.response?.data?.detail ??
            'Sentiment analysis unavailable. Please try again.'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    const reset = useCallback(() => {
        setResult(null)
        setError(null)
        setLoading(false)
    }, [])

    return { result, loading, error, analyze, reset }
}