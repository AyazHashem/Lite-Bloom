'use client'

import { Box, Typography, Collapse } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Sparkline from '@/components/shared/SparkLine'
import PriceChange from '@/components/shared/PriceChange'
import WatchlistButton from '@/components/shared/WatchlistButton'
import IndicesRowExpanded from './IndicesRowExpanded'

interface IndicesRowProps {
    stock: any
    isExpanded: boolean
    isMarketOpen: boolean
    onToggle: () => void
}

export default function IndicesRow({
    stock,
    isExpanded,
    isMarketOpen,
    onToggle,
}: IndicesRowProps) {
    const isPositive = stock.change_percent >= 0

    return (
        <Box sx={{ borderBottom: '1px solid #21262d' }}>
        {/* Main row */}
            <Box
            onClick={onToggle}
            sx={{
                display: 'grid',
                gridTemplateColumns:
                    '1.5fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1fr 80px 60px',
                alignItems: 'center',
                px: 2,
                py: 0.75,
                cursor: 'pointer',
                backgroundColor: isExpanded ? '#1c2128' : 'transparent',
                '&:hover': { backgroundColor: '#1c2128' },
                transition: 'background-color 0.1s ease',
            }}
            >
                {/* Symbol */}
                <Box>
                    <Typography
                    sx={{
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#cdd9e5',
                    }}
                    >
                        {stock.symbol}
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#7d8590' }}>
                        {stock.name}
                    </Typography>
                </Box>

                {/* Price */}
                <Typography
                sx={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: '#cdd9e5',
                }}
                >
                    {stock.price?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </Typography>

        {/* Change */}
                <PriceChange
                change={stock.change}
                changePercent={stock.change_percent}
                />

        {/* Volume */}
                <Typography
                sx={{
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    color: '#7d8590',
                }}
                >
                    {stock.volume
                    ? `${(stock.volume / 1_000_000).toFixed(1)}M`
                    : '--'
                    }
                </Typography>

        {/* High */}
                <Typography
                sx={{
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    color: '#3fb950',
                }}
                >
                    {stock.high_24h?.toFixed(2) || '--'}
                </Typography>

        {/* Low */}
                <Typography
                sx={{
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    color: '#f85149',
                }}
                >
                    {stock.low_24h?.toFixed(2) || '--'}
                </Typography>

        {/* Open/Close */}
                <Box>
                    <Typography
                    sx={{
                        fontSize: '0.65rem',
                        fontFamily: 'monospace',
                        color: '#7d8590',
                    }}
                    >
                        O: {stock.open?.toFixed(2) || '--'}
                    </Typography>
                    <Typography
                    sx={{
                        fontSize: '0.65rem',
                        fontFamily: 'monospace',
                        color: '#7d8590',
                    }}
                    >
                        C: {isMarketOpen ? '--' : stock.previous_close?.toFixed(2) || '--'}
                    </Typography>
                </Box>

        {/* Sparkline */}
                {stock.sparkline?.length > 1 ? (
                    <Sparkline
                    data={stock.sparkline}
                    width={80}
                    height={24}
                    positive={isPositive}
                    />
                    ) : (
                    <Box sx={{ width: 80 }} />
                )}

        {/* Actions */}
                <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                }}
                onClick={e => e.stopPropagation()}
                >
                    <WatchlistButton symbol={stock.symbol} name={stock.name} />
                    <Box onClick={onToggle} sx={{ cursor: 'pointer' }}>
                        {isExpanded
                            ? <KeyboardArrowUpIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                            : <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                        }
                    </Box>
                </Box>
            </Box>

      {/* Expanded content */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <IndicesRowExpanded stock={stock} isMarketOpen={isMarketOpen} />
            </Collapse>
        </Box>
    )
}