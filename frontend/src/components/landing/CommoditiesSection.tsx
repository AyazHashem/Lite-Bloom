'use client'

import { Box, Typography, CircularProgress } from '@mui/material'
import Sparkline from '@/components/shared/Sparkline'
import PriceChange from '@/components/shared/PriceChange'
import WatchlistButton from '@/components/shared/WatchlistButton'
import { useCommodities } from '@/hooks/useLandingData'
import { StockRowSkeleton } from '@/components/shared/LoadingSkeleton'

const COLUMN_HEADERS = [
    'Name', 'Type', 'Price', 'Change', 'Volume', '24H High', '24H Low', 'Unit', 'Trend', ''
]

export default function CommoditiesSection() {
    const { data: commodities, loading } = useCommodities()

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
            sx={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#7d8590',
                letterSpacing: 1,
                mb: 1,
            }}
            >
                COMMODITIES
            </Typography>

        <Box
        sx={{
            border: '1px solid #21262d',
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: '#161b22',
        }}
        >
        {/* Column headers */}
            <Box
            sx={{
                display: 'grid',
                gridTemplateColumns:
                '1.5fr 0.8fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.6fr 80px 30px',
                px: 2,
                py: 0.75,
                borderBottom: '1px solid #21262d',
                backgroundColor: '#1c2128',
            }}
            >
                {COLUMN_HEADERS.map((h, i) => (
                    <Typography
                    key={i}
                    sx={{
                        fontSize: '0.6rem',
                        color: '#4a5568',
                        fontFamily: 'monospace',
                    letterSpacing: 0.5,
                    }}
                    >
                        {h}
                    </Typography>
                ))}
            </Box>

            {loading ? (
                Array.from({ length: 6 }).map((_, i) => <StockRowSkeleton key={i} />)
                ) : (
                    commodities.map((commodity: any) => {
                    const isPositive = commodity.change_percent >= 0
                    return (
                        <Box
                        key={commodity.symbol}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns:
                            '1.5fr 0.8fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.6fr 80px 30px',
                            alignItems: 'center',
                            px: 2,
                            py: 0.75,
                            borderBottom: '1px solid #21262d',
                            '&:last-child': { borderBottom: 'none' },
                            '&:hover': { backgroundColor: '#1c2128' },
                        }}
                        >
                            <Box>
                                <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 600,
                                    color: '#cdd9e5',
                                }}
                                >
                                    {commodity.name}
                                </Typography>
                                <Typography
                                sx={{ fontSize: '0.6rem', color: '#7d8590' }}
                                >
                                    {commodity.symbol}
                                </Typography>
                            </Box>

                            <Box
                            sx={{
                                display: 'inline-flex',
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 0.5,
                                backgroundColor: '#21262d',
                            }}
                            >
                                <Typography
                                sx={{
                                    fontSize: '0.6rem',
                                    fontFamily: 'monospace',
                                    color: '#7d8590',
                                }}
                                >
                                    {commodity.type}
                                </Typography>
                            </Box>

                            <Typography
                            sx={{
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                color: '#cdd9e5',
                            }}
                            >
                                {commodity.price?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                }) || '--'}
                            </Typography>

                            <PriceChange
                            change={commodity.change}
                            changePercent={commodity.change_percent}
                            />

                            <Typography
                            sx={{
                                fontSize: '0.7rem',
                                fontFamily: 'monospace',
                                color: '#7d8590',
                            }}
                            >
                                {commodity.volume
                                ? `${(commodity.volume / 1000).toFixed(0)}K`
                                : '--'
                                }
                            </Typography>

                            <Typography
                            sx={{
                                fontSize: '0.7rem',
                                fontFamily: 'monospace',
                                color: '#3fb950',
                            }}
                            >
                                {commodity.high_24h?.toFixed(2) || '--'}
                            </Typography>

                            <Typography
                            sx={{
                                fontSize: '0.7rem',
                                fontFamily: 'monospace',
                                color: '#f85149',
                            }}
                            >
                                {commodity.low_24h?.toFixed(2) || '--'}
                            </Typography>

                            <Typography
                            sx={{
                                fontSize: '0.65rem',
                                fontFamily: 'monospace',
                                color: '#7d8590',
                            }}
                            >
                                {commodity.unit}
                            </Typography>

                            {commodity.sparkline?.length > 1 ? (
                                <Sparkline
                                data={commodity.sparkline}
                                width={80}
                                height={24}
                                positive={isPositive}
                                />
                                ) : (
                                    <Box sx={{ width: 80 }} />
                            )}

                            <WatchlistButton
                            symbol={commodity.symbol}
                            name={commodity.name}
                            />
                        </Box>
                    )
                })
            )}
        </Box>
    </Box>
    )
}