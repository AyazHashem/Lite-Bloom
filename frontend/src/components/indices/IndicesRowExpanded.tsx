'use client'

import { useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import LightweightChart from '@/components/charts/LightweightChart'
import ChartToggle from './ChartToggle'
import PriceChange from '@/components/shared/PriceChange'
import { useIndexHistory } from '@/hooks/useIndicesData'

interface IndicesRowExpandedProps {
    stock: any
    isMarketOpen: boolean
}

type Timeframe = '1d' | '1w' | '1mo' | '3mo' | '1y'

const TIMEFRAMES: { label: string; period: string; interval: string }[] = [
    { label: '1D',  period: '1d',  interval: '5m' },
    { label: '1W',  period: '5d',  interval: '1h' },
    { label: '1M',  period: '1mo', interval: '1d' },
    { label: '3M',  period: '3mo', interval: '1d' },
    { label: '1Y',  period: '1y',  interval: '1wk' },
]

export default function IndicesRowExpanded({
    stock,
    isMarketOpen,
}: IndicesRowExpandedProps) {
    const [chartMode, setChartMode] = useState<'candlestick' | 'line'>('candlestick')
    const [timeframe, setTimeframe] = useState(TIMEFRAMES[2])
    const { data: history, loading } = useIndexHistory(
        stock.symbol,
        timeframe.period,
        timeframe.interval
    )

    const stats = [
        { label: 'OPEN', value: stock.open?.toFixed(2) || '--' },
        { label: 'HIGH', value: stock.high_24h?.toFixed(2) || '--' },
        { label: 'LOW', value: stock.low_24h?.toFixed(2) || '--' },
        { label: 'CLOSE', value: isMarketOpen ? '--' : stock.previous_close?.toFixed(2) || '--' },
        { label: 'VOLUME', value: stock.volume ? `${(stock.volume / 1_000_000).toFixed(1)}M` : '--' },
        { label: 'MKT CAP', value: stock.market_cap ? `${(stock.market_cap / 1_000_000_000).toFixed(1)}B` : '--' },
        { label: 'P/E', value: stock.pe_ratio?.toFixed(2) || '--' },
        { label: 'SECTOR', value: stock.sector || '--' },
        { label: 'INDUSTRY', value: stock.industry || '--' },
    ]

    return (
        <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px',
            gap: 2,
            p: 2,
            backgroundColor: '#0d1117',
            borderTop: '1px solid #21262d',
        }}
        >
        {/* Chart area */}
            <Box>
            {/* Chart controls */}
                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                }}
                >
                {/* Timeframe buttons */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {TIMEFRAMES.map(tf => (
                            <Box
                            key={tf.label}
                            onClick={() => setTimeframe(tf)}
                            sx={{
                                px: 1,
                                py: 0.25,
                                borderRadius: 0.5,
                                cursor: 'pointer',
                                backgroundColor:
                                    timeframe.label === tf.label ? '#1c2128' : 'transparent',
                                border: `1px solid ${
                                    timeframe.label === tf.label ? '#1f6feb' : '#21262d'
                                }`,
                            }}
                            >
                                <Typography
                                sx={{
                                    fontSize: '0.65rem',
                                    fontFamily: 'monospace',
                                    color:
                                        timeframe.label === tf.label ? '#388bfd' : '#7d8590',
                                }}
                                >
                                    {tf.label}
                                </Typography>
                            </Box>
                        ))}
                        </Box>
                        <ChartToggle mode={chartMode} onChange={setChartMode} />
                    </Box>

                    {/* Chart */}
                    <Box
                    sx={{
                        height: 280,
                        backgroundColor: '#161b22',
                        border: '1px solid #21262d',
                        borderRadius: 1,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                    >
                        {loading ? (
                            <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                            >
                                <CircularProgress size={24} sx={{ color: '#1f6feb' }} />
                            </Box>
                            ) : history?.bars ? (
                            <LightweightChart
                            data={history.bars}
                            chartType={chartMode}
                            />
                        ) : null}
                    </Box>
                </Box>

                {/* Stats panel */}
                <Box
                sx={{
                    backgroundColor: '#161b22',
                    border: '1px solid #21262d',
                    borderRadius: 1,
                    p: 1.5,
                }}
                >
                    <Typography
                    sx={{
                        fontSize: '0.65rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#cdd9e5',
                        mb: 1,
                    }}
                    >
                        {stock.symbol}
                    </Typography>

                    <Typography
                    sx={{
                        fontSize: '1.1rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#cdd9e5',
                        mb: 0.25,
                    }}
                    >
                        {stock.price?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </Typography>

                    <PriceChange
                    change={stock.change}
                    changePercent={stock.change_percent}
                    size="medium"
                    />

                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {stats.map(stat => (
                            <Box
                            key={stat.label}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #21262d',
                                pb: 0.5,
                            }}
                            >
                                <Typography
                                sx={{
                                    fontSize: '0.6rem',
                                    color: '#4a5568',
                                    fontFamily: 'monospace',
                                    letterSpacing: 0.5,
                                }}
                                >
                                    {stat.label}
                                </Typography>
                                <Typography
                                sx={{
                                    fontSize: '0.68rem',
                                    color: '#cdd9e5',
                                    fontFamily: 'monospace',
                                }}
                                >
                                    {stat.value}
                                </Typography>
                            </Box>
                        ))}
                </Box>
            </Box>
        </Box>
    )
}