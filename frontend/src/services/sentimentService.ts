import api from './api'
import { SentimentResult, SentimentRequest } from '@/types/sentiment'

export const sentimentService = {

    async analyze(request: SentimentRequest): Promise<SentimentResult> {
        const res = await api.post<SentimentResult>(
            '/api/sentiment/analyze',
            request
        )
        return res.data
    },
}