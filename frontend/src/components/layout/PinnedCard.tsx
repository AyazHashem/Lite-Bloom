'use client'

import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Sparkline from '@/components/shared/Sparkline'
import PriceChange from '@/components/shared/PriceChange'
import MarketBadge from '@/components/shared/MarketBadge'
import { usePinnedItems } from '@/hooks/usePinnedItems'

interface PinnedCardProps {
    symbol: string
    name: string
    quote: any
    displayMode: 'sparkline' | 'stats'
}

export default function PinnedCard({
    symbol,
    name,
    quote,
    displayMode,
}: PinnedCardProps) {
    const { unpinItem } = usePinnedItems()
    const isPositive = quote ? quote.change >= 0 : true

    return (
        <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            backgroundColor: '#1c2128',
            border: '1px solid #21262d',
            borderRadius: 1,
            flexShrink: 0,
            minWidth: displayMode === 'sparkline' ? 180 : 140,
            position: 'relative',
            '&:hover .close-btn': { opacity: 1 },
        }}
        >
            {/* Symbol and price */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                    sx={{
                        fontSize: '0.72rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#cdd9e5',
                    }}
                    >
                        {symbol}
                    </Typography>
                    {quote && (
                        <MarketBadge
                        isOpen={quote.is_open ?? true}
                        size="small"
                        />
                    )}
                </Box>

                {quote ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography
                        sx={{
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            color: '#cdd9e5',
                        }}
                        >
                            {quote.price?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                        <PriceChange
                        change={quote.change}
                        changePercent={quote.change_percent}
                        showBoth={false}
                        />
                    </Box>
                    ) : (
                        <Typography sx={{ fontSize: '0.65rem', color: '#4a5568' }}>
                            Loading...
                        </Typography>
                )}

                {/* Stats mode — show extra info */}
                {displayMode === 'stats' && quote && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.25 }}>
                        <Typography sx={{ fontSize: '0.6rem', color: '#7d8590' }}>
                            H: {quote.high_24h?.toFixed(2)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#7d8590' }}>
                            L: {quote.low_24h?.toFixed(2)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#7d8590' }}>
                            V: {((quote.volume || 0) / 1_000_000).toFixed(1)}M
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Sparkline mode */}
            {displayMode === 'sparkline' && quote?.sparkline && (
                <Sparkline
                data={quote.sparkline}
                width={70}
                height={28}
                positive={isPositive}
                />
            )}

            {/* Close button */}
            <IconButton
            className="close-btn"
            size="small"
            onClick={() => unpinItem(symbol)}
            sx={{
                position: 'absolute',
                top: 1,
                right: 1,
                padding: '1px',
                opacity: 0,
                transition: 'opacity 0.15s',
                color: '#7d8590',
                '&:hover': { color: '#f85149' },
            }}
            >
                <CloseIcon sx={{ fontSize: 10 }} />
            </IconButton>
        </Box>
    )
}