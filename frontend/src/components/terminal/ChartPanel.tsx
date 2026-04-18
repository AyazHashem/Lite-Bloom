'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Chip }  from '@mui/material'
import LightweightChart from '@/components/charts/LightweightChart'
import { MarketHistoryResponse, Quote } from '@/types/market'
import api from '@/services/api'
import MarketBadge from '@/components/shared/MarketBadge'
import DelayBadge from '@/components/shared/DelayBadge'
interface ChartPanelProps {
    symbol: string
    period?: string
    interval?: string
}

export default function ChartPanel({
    symbol,
    period = '1mo',
    interval = '1d',
}: ChartPanelProps) {
    const [history, setHistory] = useState<MarketHistoryResponse | null>(null)
    const [quote, setQuote] = useState<Quote | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            try {
                const [historyRes, quoteRes] = await Promise.all([
                    api.get<MarketHistoryResponse>(
                        `/api/market/history/${symbol}?period=${period}&interval=${interval}`
                    ),
                    api.get<Quote>(`/api/market/quote/${symbol}`),
                ])

                setHistory(historyRes.data)
                setQuote(quoteRes.data)
            } catch (err) {
                console.error(`Failed to fetch data for ${symbol}:`, err)
                setError(`Failed to load data for ${symbol}`)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [symbol, period, interval])

    const isPositive = quote ? quote.change >= 0 : true
    const changeColor = isPositive ? '#26a69a' : '#ef5350'
    const delayLabel = 
    history?.delay_minutes === 0
    ? 'Live'
    : history?.delay_minutes === 15
    ? '15 min delay'
    : `~${history?.delay_minutes} minute delay`

    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#0a0a0a',
            border: '1px solid #1e2130',
            borderRadius: 1,
            overflow: 'hidden',
        }}
        >
            {}
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                borderBottom: '1px solid #1e2130',
                flexShrink: 0,
            }}
            >
                {}
                <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Typography
                    variant="subtitle1"
                    sx={{
                        color: '#ffffff', fontWeight: 700, fontFamily: 'monospace'
                    }}>
                        {symbol}
                    </Typography>
                    {quote && (
                        <Typography
                        variant="caption"
                        sx={{ color: '#758696'}}
                        >
                            {quote.name}
                        </Typography>
                    )}
                </Box>
                {quote && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                        variant="subtitle1"
                        sx={{ color: '#ffffff', fontWeight: 600, fontFamily: 'monospace'}}
                        >
                            {quote.currency === 'USD' ? '$' : ''}
                            {quote.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2.
                            })}
                        </Typography>
                        <Typography
                        variant="caption"
                        sx={{ color: changeColor, fontFamily: 'monospace' }}
                        >
                            {isPositive ? '+' : ''}
                            {quote.change.toFixed(2)} ({isPositive ? '+' : ''}
                            {quote.change_percent.toFixed(2)}%)
                        </Typography>
                        <Chip
                        label={delayLabel}
                        size="small"
                        sx={{
                            backgroundColor:
                                history?.delay_minutes === 0 ? '#1a3a2a' : '#2a2a1a',
                            color:
                                history?.delay_minutes === 0 ? '#26a69a' : '#b0a030',
                            fontSize: '0.65rem',
                            height: 18,
                        }}
                        />
                    </Box>
                )}
            </Box>
            <Box sx={{ flex: 1, position: 'relative', minHeight: 0}}>
                {loading && (
                    <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                        zIndex: 1,
                    }}>
                        <CircularProgress size={32} sx={{ color: '#26a69a' }}/>
                    </Box>
                )}

                {error && (
                    <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Typography variant="body2" sx={{ color: '#ef5350' }}>
                            {error}
                        </Typography>
                    </Box>
                )}

                {!loading && !error && history && (
                    <LightweightChart data={history.bars} />
                )}
            </Box>

            {quote && (
                <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    px: 2,
                    py: 0.75,
                    borderTop: '1px solid #1e2130',
                    flexShrink: 0,
                }}>
                    {[
                        { label: 'VOL', value: (quote.volume / 1_000_000).toFixed(2) + 'M', },
                        { label: 'EXCH', value: quote.exchange },
                        { label: 'CCY', value: quote.currency },
                    ].map((stat) => (
                        <Box key={stat.label}>
                            <Typography
                            variant="caption"
                            sx={{ color: '#758696', display: 'block', fontSize: '0.6rem'}}
                            >
                                {stat.label}
                            </Typography>
                            <Typography
                            variant="caption"
                            sx={{
                                color: '#d1d4dc',
                                fontFamily: 'monospace',
                                fontSize: '0.7rem'
                            }}
                            >
                                {stat.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    )
}