'use client'

import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import SearchBar from '@/components/shared/SearchBar'
import { TIMEFRAMES, TimeframeOption } from '@/lib/constants'
import MarketBadge from '@/components/shared/MarketBadge'
import { useMarketStatus } from '@/hooks/useMarketStatus'

interface ChartToolbarProps {
    symbol:      string
    exchange:    string
    timeframe:   TimeframeOption
    chartType:   'candlestick' | 'line'
    delayMinutes?: number
    onSymbolChange:    (symbol: string, name: string) => void
    onTimeframeChange: (tf: TimeframeOption) => void
    onChartTypeChange: (type: 'candlestick' | 'line') => void
}

export default function ChartToolbar({
    symbol,
    exchange,
    timeframe,
    chartType,
    delayMinutes,
    onSymbolChange,
    onTimeframeChange,
    onChartTypeChange,
}: ChartToolbarProps) {
    const marketStatus = useMarketStatus(exchange)

    return (
        <Box
        sx={{
            display:      'flex',
            alignItems:   'center',
            gap:          1,
            px:           1.5,
            py:           0.75,
            borderBottom: '1px solid #21262d',
            backgroundColor: '#161b22',
            flexShrink:   0,
            flexWrap:     'wrap',
        }}
        >
            {/* Symbol search */}
            <SearchBar
            onSelect={onSymbolChange}
            placeholder={symbol || 'Search...'}
            size="small"
            />

            {/* Timeframe selector */}
            <Box sx={{ display: 'flex', gap: 0.25 }}>
                {TIMEFRAMES.map(tf => (
                    <Box
                    key={tf.label}
                    onClick={() => onTimeframeChange(tf)}
                    sx={{
                        px:              0.75,
                        py:              0.3,
                        borderRadius:    0.5,
                        cursor:          'pointer',
                        border:          `1px solid ${
                            timeframe.label === tf.label ? '#1f6feb' : '#21262d'
                        }`,
                        backgroundColor: timeframe.label === tf.label
                        ? '#1c2128'
                        : 'transparent',
                        '&:hover': { backgroundColor: '#1c2128' },
                        transition: 'all 0.1s',
                    }}
                    >
                        <Typography
                        sx={{
                            fontSize:   '0.65rem',
                            fontFamily: 'monospace',
                            color:      timeframe.label === tf.label
                            ? '#388bfd'
                            : '#7d8590',
                            lineHeight: 1,
                        }}
                        >
                            {tf.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Chart type toggle */}
            <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, val) => val && onChartTypeChange(val)}
            size="small"
            >
                <ToggleButton
                value="candlestick"
                sx={{
                    py:      0.3,
                    px:      0.75,
                    border:  '1px solid #21262d',
                    color:   '#7d8590',
                    '&.Mui-selected': {
                        color:           '#388bfd',
                        backgroundColor: '#1c2128',
                    },
                }}
                >
                    <CandlestickChartIcon sx={{ fontSize: 14 }} />
                </ToggleButton>
                <ToggleButton
                value="line"
                sx={{
                    py:      0.3,
                    px:      0.75,
                    border:  '1px solid #21262d',
                    color:   '#7d8590',
                    '&.Mui-selected': {
                        color:           '#388bfd',
                        backgroundColor: '#1c2128',
                },
                }}
                >
                    <ShowChartIcon sx={{ fontSize: 14 }} />
                </ToggleButton>
            </ToggleButtonGroup>

            {/* Market status */}
            <Box sx={{ ml: 'auto' }}>
                <MarketBadge
                isOpen={marketStatus.isOpen}
                delayMinutes={delayMinutes}
                size="small"
                showDelay
                />
            </Box>

            {/* Market time */}
            {marketStatus.localTime !== '--:--' && (
                <Typography
                sx={{
                    fontSize:   '0.62rem',
                    fontFamily: 'monospace',
                    color:      '#4a5568',
                }}
                >
                    {marketStatus.localTime}
                </Typography>
            )}
        </Box>
    )
}