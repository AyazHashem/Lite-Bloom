'use client'

import { useState, useCallback } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import LightweightChart from '@/components/charts/LightweightChart'
import ChartToolbar from './ChartToolbar'
import StatCard from '@/components/shared/StatCard'
import { useMarketData } from '@/hooks/useMarketData'
import {
    formatPrice,
    formatChangeFull,
    formatVolume,
    formatMarketCap,
    formatPE,
    formatYield,
    getChangeColor,
    CURRENCY_SYMBOLS,
} from '@/lib/formatters'
import {
    TIMEFRAMES,
    TimeframeOption,
    DEFAULT_CHART_PERIOD,
    DEFAULT_CHART_INTERVAL,
} from '@/lib/constants'

interface ChartPanelProps {
    symbol:       string
    onClose?:     () => void
    onFocus?:     () => void
    isFocused?:   boolean
    showClose?:   boolean
}

// Map symbol prefix to likely exchange
function guessExchange(symbol: string): string {
    if (symbol.endsWith('.L'))   return 'LSE'
    if (symbol.endsWith('.T'))   return 'TSE'
    if (symbol.endsWith('.HK'))  return 'HKEX'
    if (symbol.endsWith('.SI'))  return 'SGX'
    if (symbol.endsWith('.SR'))  return 'TADAWUL'
    if (symbol.includes('-USD') || symbol.includes('/USD')) return 'CRYPTO'
    if (symbol.endsWith('=F'))   return 'COMMODITIES'
    return 'NYSE'
}

export default function ChartPanel({
    symbol:        initialSymbol,
    onClose,
    onFocus,
    isFocused = false,
    showClose = true,
}: ChartPanelProps) {
    const [symbol,    setSymbol]    = useState(initialSymbol)
    const [symName,   setSymName]   = useState(initialSymbol)
    const [timeframe, setTimeframe] = useState<TimeframeOption>(
        TIMEFRAMES.find(tf => tf.label === '1M') ?? TIMEFRAMES[2]
    )
    const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick')

    const exchange = guessExchange(symbol)

    const { quote, history, loading, error } = useMarketData(
        symbol,
        timeframe.period,
        timeframe.interval
    )

    const handleSymbolChange = useCallback((sym: string, name: string) => {
        setSymbol(sym)
        setSymName(name)
    }, [])

    const changeColor = getChangeColor(quote?.change_percent)
    const currencySymbol = CURRENCY_SYMBOLS[quote?.currency ?? 'USD'] ?? '$'

    const stats = quote ? [
        {
            label:   'OPEN',
            value:   formatPrice(quote.price - (quote.change ?? 0), quote.currency),
            tooltip: 'Opening price',
        },
        {
            label:   'CHANGE',
            value:   formatChangeFull(quote.change, quote.change_percent),
            color:   changeColor,
            tooltip: '24h price change',
        },
        {
            label:   'VOLUME',
            value:   formatVolume(quote.volume),
            tooltip: 'Trading volume',
        },
        {
            label:   'EXCH',
            value:   quote.exchange,
            tooltip: 'Exchange',
        },
    ] : []

    return (
        <Box
        onClick={onFocus}
        sx={{
            display:       'flex',
            flexDirection: 'column',
            height:        '100%',
            backgroundColor: '#0d1117',
            border:        `1px solid ${isFocused ? '#1f6feb' : '#21262d'}`,
            borderRadius:  1,
            overflow:      'hidden',
            cursor:        onFocus ? 'pointer' : 'default',
            transition:    'border-color 0.15s',
        }}
        >
            {/* Panel header */}
            <Box
            sx={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                px:             1.5,
                py:             0.75,
                borderBottom:   '1px solid #21262d',
                flexShrink:     0,
                backgroundColor: '#161b22',
            }}
            >
                {/* Symbol + name */}
                <Box>
                    <Typography
                    sx={{
                        fontSize:   '0.82rem',
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

                {/* Price */}
                {quote && (
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography
                        sx={{
                            fontSize:   '0.9rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color:      '#cdd9e5',
                            lineHeight: 1,
                        }}
                        >
                            {formatPrice(quote.price, quote.currency)}
                        </Typography>
                        <Typography
                        sx={{
                            fontSize:   '0.68rem',
                            fontFamily: 'monospace',
                            color:      changeColor,
                        }}
                        >
                            {formatChangeFull(quote.change, quote.change_percent)}
                        </Typography>
                    </Box>
                )}

                {/* Close button */}
                {showClose && onClose && (
                    <IconButton
                    size="small"
                    onClick={e => { e.stopPropagation(); onClose() }}
                    sx={{
                        ml:      0.5,
                        padding: '3px',
                        color:   '#7d8590',
                        '&:hover': { color: '#f85149', backgroundColor: 'rgba(248,81,73,0.1)' },
                    }}
                    >
                        <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                )}
            </Box>

            {/* Toolbar */}
            <ChartToolbar
            symbol={symbol}
            exchange={exchange}
            timeframe={timeframe}
            chartType={chartType}
            delayMinutes={quote?.delay_minutes}
            onSymbolChange={handleSymbolChange}
            onTimeframeChange={setTimeframe}
            onChartTypeChange={setChartType}
            />

            {/* Chart area */}
            <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
                {loading && (
                    <Box
                    sx={{
                        position:        'absolute',
                        inset:           0,
                        display:         'flex',
                        alignItems:      'center',
                        justifyContent:  'center',
                        backgroundColor: '#0d1117',
                        zIndex:          1,
                    }}
                    >
                        <CircularProgress size={28} sx={{ color: '#1f6feb' }} />
                    </Box>
                )}

                {error && !loading && (
                    <Box
                    sx={{
                        position:       'absolute',
                        inset:          0,
                        display:        'flex',
                        flexDirection:  'column',
                        alignItems:     'center',
                        justifyContent: 'center',
                        gap:            1,
                    }}
                    >
                        <Typography sx={{ fontSize: '0.75rem', color: '#f85149' }}>
                            {error}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#4a5568' }}>
                            Check symbol and try again
                        </Typography>
                    </Box>
                )}

                {!loading && !error && history?.bars && history.bars.length > 0 && (
                    <LightweightChart
                    data={history.bars}
                    chartType={chartType}
                    />
                )}
            </Box>

            {/* Stats footer */}
            {stats.length > 0 && (
                <Box
                sx={{
                    display:      'flex',
                    gap:          0.75,
                    px:           1.5,
                    py:           0.75,
                    borderTop:    '1px solid #21262d',
                    flexShrink:   0,
                    overflowX:    'auto',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
                >
                    {stats.map(stat => (
                        <StatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        color={stat.color}
                        tooltip={stat.tooltip}
                        compact
                        />
                    ))}
                </Box>
            )}
        </Box>
    )
}