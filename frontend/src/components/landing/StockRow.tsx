'use client'

import { Box, Typography } from '@mui/material'
import Sparkline from '@/components/shared/SparkLine'
import PriceChange from '@/components/shared/PriceChange'
import WatchlistButton from '@/components/shared/WatchlistButton'

interface StockRowProps {
    stock: any
    isMarketOpen: boolean
    currency: string
}

export default function StockRow({
    stock,
    isMarketOpen,
    currency
}: StockRowProps) {
    const isPositive = stock.change_percent >= 0

    const formatPrice = (val: number | null) => {
        if (val === null || val === undefined) return '--'
        return val.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const formatVolume = (val: number) => {
        if (!val) return '--'
        if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`
        if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
        if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`
        return val.toString()
    }

    return (
        <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.8fr 1fr 80px 30px',
            alignItems: 'center',
            px: 2,
            py: 0.75,
            borderBottom: '1px solid #21262d',
            '&:hover': { backgroundColor: '#1c2128' },
            cursor: 'default',
        }}
        >
            <Box>
                <Typography
                sx={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.8fr 1fr 80px 30px',
                alignItems: 'center',
                px: 2,
                py: 0.75,
                borderBottom: '1px solid #21262d',
                '&:hover': { backgroundColor: '#1c2128' },
                cursor: 'default',
            }}
                >
                    {stock.symbol}
                </Typography>
                <Typography sx={{ fontSize: '0.62rem', color: '#7d8590' }}>
                    {stock.name}
                </Typography>
                    {stock.industry && (
                        <Typography sx={{ fontSize: '0.58rem', color: '#4a5568' }}>
                            {stock.industry}
                        </Typography>
                    )}
            </Box>
            <Typography
            sx={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#cdd9e5',
        }}
            >
                {formatPrice(stock.price)}
            </Typography>
            <PriceChange
            change={stock.change}
            changePercent={stock.change_percent}
            />
            <Typography
            sx={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#7d8590' }}
            >
                {formatVolume(stock.volume)}
            </Typography>
            <Typography
            sx={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#3fb950' }}
            >
                {formatPrice(stock.high_24h)}
            </Typography>
            <Typography
            sx={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#f85149' }}
            >
                {formatPrice(stock.low_24h)}
            </Typography>
            <Box>
                <Typography
                sx={{
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    color: '#7d8590',
                }}
                >
                    0: {formatPrice(stock.open)}
                </Typography>
                <Typography
                sx={{
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    color: '#7d8590',
                }}
                >
                    C: {isMarketOpen ? '--' : formatPrice(stock.previous_close)}
                </Typography>
            </Box>
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
            <WatchlistButton symbol={stock.symbol} name={stock.name} />
        </Box>
    )
}