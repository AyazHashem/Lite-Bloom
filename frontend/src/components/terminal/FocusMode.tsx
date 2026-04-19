'use client'

import { useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import AddIcon from '@mui/icons-material/Add'
import LightweightChart from '@/components/charts/LightweightChart'
import ChartToolbar from './ChartToolbar'
import StatCard from '@/components/shared/StatCard'
import SentimentButton from '@/components/ai/SentimentButton'
import SentimentModal from '@/components/ai/SentimentModal'
import SearchBar from '@/components/shared/SearchBar'
import { useMarketData } from '@/hooks/useMarketData'
import {
    formatPrice,
    formatChangeFull,
    formatVolume,
    formatMarketCap,
    formatPE,
    getChangeColor,
} from '@/lib/formatters'
import { TIMEFRAMES, TimeframeOption } from '@/lib/constants'
import { SentimentResult } from '@/types/sentiment'

interface FocusedChart {
    id:     number
    symbol: string
    name:   string
}

interface FocusModeProps {
    primary:  FocusedChart
    onExit:   () => void
}

function FocusPanel({
    chart,
    onClose,
    isMain,
}: {
    chart:    FocusedChart
    onClose?: () => void
    isMain:   boolean
}) {
    const [symbol,    setSymbol]    = useState(chart.symbol)
    const [symName,   setSymName]   = useState(chart.name)
    const [timeframe, setTimeframe] = useState<TimeframeOption>(
        TIMEFRAMES.find(tf => tf.label === '1M') ?? TIMEFRAMES[2]
    )
    const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick')
    const [sentimentResult,    setSentimentResult]    = useState<SentimentResult | null>(null)
    const [sentimentModalOpen, setSentimentModalOpen] = useState(false)

    const { quote, history, loading } = useMarketData(
        symbol,
        timeframe.period,
        timeframe.interval
    )

    const changeColor = getChangeColor(quote?.change_percent)

    const guessExchange = (sym: string) => {
        if (sym.endsWith('.L'))  return 'LSE'
        if (sym.endsWith('.T'))  return 'TSE'
        if (sym.endsWith('.HK')) return 'HKEX'
        if (sym.endsWith('.SI')) return 'SGX'
        return 'NYSE'
    }

    const stats = quote ? [
        { label: 'PRICE',   value: formatPrice(quote.price, quote.currency) },
        { label: 'CHANGE',  value: formatChangeFull(quote.change, quote.change_percent), color: changeColor },
        { label: 'VOLUME',  value: formatVolume(quote.volume) },
        { label: 'MKT CAP', value: formatMarketCap(undefined) },
        { label: 'EXCH',    value: quote.exchange },
        { label: 'CCY',     value: quote.currency },
    ] : []

    return (
        <Box
        sx={{
            display:         'flex',
            flexDirection:   'column',
            height:          '100%',
            backgroundColor: '#0d1117',
            border:          `1px solid ${isMain ? '#1f6feb' : '#21262d'}`,
            borderRadius:    1,
            overflow:        'hidden',
        }}
        >
            {/* Header */}
            <Box
            sx={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                px:             1.5,
                py:             0.75,
                borderBottom:   '1px solid #21262d',
                backgroundColor: '#161b22',
                flexShrink:     0,
            }}
            >
                <Box>
                    <Typography
                    sx={{
                        fontSize:   isMain ? '0.9rem' : '0.78rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color:      '#cdd9e5',
                        lineHeight: 1,
                    }}
                    >
                        {symbol}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: '#7d8590' }}>
                        {quote?.name ?? symName}
                    </Typography>
                </Box>

                {quote && (
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography
                        sx={{
                            fontSize:   isMain ? '1rem' : '0.85rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color:      '#cdd9e5',
                        }}
                        >
                            {formatPrice(quote.price, quote.currency)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', fontFamily: 'monospace', color: changeColor }}>
                            {formatChangeFull(quote.change, quote.change_percent)}
                        </Typography>
                    </Box>
                )}

                {onClose && (
                    <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{ color: '#7d8590', padding: '3px', '&:hover': { color: '#f85149' } }}
                    >
                        <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                )}
            </Box>

            {/* Toolbar */}
            <ChartToolbar
            symbol={symbol}
            exchange={guessExchange(symbol)}
            timeframe={timeframe}
            chartType={chartType}
            delayMinutes={quote?.delay_minutes}
            onSymbolChange={(sym, name) => { setSymbol(sym); setSymName(name) }}
            onTimeframeChange={setTimeframe}
            onChartTypeChange={setChartType}
            />

                {/* Chart + Stats side by side for main focus */}
            <Box
            sx={{
                flex:    1,
                display: 'grid',
                gridTemplateColumns: isMain ? '1fr 200px' : '1fr',
                minHeight: 0,
            }}
            >
                {/* Chart */}
                <Box sx={{ minHeight: 0, position: 'relative' }}>
                    {history?.bars && (
                        <LightweightChart data={history.bars} chartType={chartType} />
                    )}
                </Box>
    
                {/* Stats sidebar — only on main focus */}
                {isMain && (
                    <Box
                    sx={{
                        borderLeft:    '1px solid #21262d',
                        p:             1.5,
                        overflowY:     'auto',
                        display:       'flex',
                        flexDirection: 'column',
                        gap:           0.75,
                    }}
                    >
                        <Typography
                        sx={{
                            fontSize:      '0.58rem',
                            fontFamily:    'monospace',
                            color:         '#4a5568',
                            letterSpacing: 1,
                            mb:            0.5,
                        }}
                        >
                            STATISTICS
                        </Typography>

                        {stats.map(stat => (
                            <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            color={stat.color}
                            compact
                            />
                        ))}

                        <Box sx={{ mt: 'auto', pt: 1 }}>
                            <SentimentButton
                            symbol={symbol}
                            name={quote?.name ?? symbol}
                            onShowDetails={result => {
                                setSentimentResult(result)
                                setSentimentModalOpen(true)
                            }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>

            <SentimentModal
            open={sentimentModalOpen}
            result={sentimentResult}
            onClose={() => setSentimentModalOpen(false)}
            />
        </Box>
    )
}

export default function FocusMode({ primary, onExit }: FocusModeProps) {
    const [secondary,    setSecondary]    = useState<FocusedChart | null>(null)
    const [showAddPanel, setShowAddPanel] = useState(false)

    let nextSecId = 100

    return (
        <Box
        sx={{
            position:        'fixed',
            inset:           0,
            backgroundColor: '#0d1117',
            zIndex:          1200,
            display:         'flex',
            flexDirection:   'column',
        }}
        >
            {/* Focus mode toolbar */}
            <Box
            sx={{
                display:         'flex',
                alignItems:      'center',
                gap:             1,
                px:              2,
                py:              0.75,
                borderBottom:    '1px solid #21262d',
                backgroundColor: '#161b22',
                flexShrink:      0,
            }}
            >
                <Typography
                sx={{
                    fontSize:      '0.6rem',
                    fontFamily:    'monospace',
                    color:         '#1f6feb',
                    letterSpacing: 1,
                }}
                >
                    FOCUS MODE
                </Typography>

                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Add secondary panel */}
                    {!secondary && (
                        <>
                            {showAddPanel && (
                                <SearchBar
                                onSelect={(sym, name) => {
                                    setSecondary({ id: nextSecId++, symbol: sym, name })
                                    setShowAddPanel(false)
                                }}
                                placeholder="Add secondary chart..."
                                size="small"
                                />
                            )}
                            <Tooltip title="Add secondary chart">
                                <IconButton
                                size="small"
                                onClick={() => setShowAddPanel(p => !p)}
                                sx={{
                                    color:  '#7d8590',
                                    border: '1px solid #21262d',
                                    borderRadius: 1,
                                    padding: '4px',
                                    '&:hover': { color: '#388bfd', borderColor: '#1f6feb' },
                                }}
                                >
                                    <AddIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}

                    {/* Exit focus */}
                    <Tooltip title="Exit focus mode">
                        <IconButton
                        size="small"
                        onClick={onExit}
                        sx={{
                            color:           '#7d8590',
                            border:          '1px solid #21262d',
                            borderRadius:    1,
                            padding:         '4px',
                            '&:hover': { color: '#f85149', borderColor: '#f85149' },
                        }}
                        >
                            <FullscreenExitIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Charts area */}
            <Box
            sx={{
                flex:    1,
                display: 'grid',
                gridTemplateColumns: secondary ? '3fr 2fr' : '1fr',
                gap:     1,
                p:       1,
                minHeight: 0,
            }}
            >
                {/* Primary focus chart */}
                <FocusPanel
                chart={primary}
                isMain
                />

                {/* Secondary chart */}
                {secondary && (
                    <FocusPanel
                    chart={secondary}
                    onClose={() => setSecondary(null)}
                    isMain={false}
                    />
                )}
            </Box>
        </Box>
    )
}