'use client'

import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Sparkline from '@/components/shared/SparkLine'
import PriceChange from '@/components/shared/PriceChange'
import MarketBadge from '@/components/shared/MarketBadge'
import { usePinnedItems } from '@/hooks/usePinnedItems'

interface PinnedCardProps{
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
        <Box>
            <Box>
                <Box>
                    <Typography>
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
                    <Box>
                        <Typography>
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
                    <Typography>
                        Loading...
                    </Typography>
                )}
                {displayMode === 'stats' && quote && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.25,}}>
                        <Typography sx={{ fontSize: '0.6rem', color: '#7d8590'}}>
                            H: {quote.high_24h?.toFixed(2)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#7d8590'}}>
                            L: {quote.low_24h?.toFixed(2)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#7d8590'}}>
                            V: {((quote.volume || 0) / 1_000_000).toFixed(1)}M
                        </Typography>
                    </Box>
                )}
            </Box>
            {displayMode === 'sparkline' && quote?.sparkline &&(
                <Sparkline
                data={quote.sparkline}
                width={70}
                height={28}
                positive={isPositive}
                />
            )}
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