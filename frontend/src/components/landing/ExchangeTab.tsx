'use client'

import { useState } from 'react'
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import StockRow from './StockRow'
import { useTopStocks } from '@/hooks/useLandingData'

type SortMode = 'gain' | 'volume' | 'marketcap'

interface ExchangeTabProps {
    exchangeId: string
    isOpen: boolean
    currency: string
}

const COLUMN_HEADERS = [
    { label: 'Symbol / Name', flex: 1.5 },
    { label: 'Price',         flex: 1 },
    { label: 'Change',        flex: 1 },
    { label: 'Volume',        flex: 0.8 },
    { label: '24H High',      flex: 0.8 },
    { label: '24H Low',       flex: 0.8 },
    { label: 'Open / Close',  flex: 1 },
    { label: 'Trend',         flex: 0, width: 80 },
    { label: '',              flex: 0, width: 30 },
]

export default function ExchangeTab({
    exchangeId,
    isOpen,
    currency,
}: ExchangeTabProps) {
    const[sortBy, setSortBy] = useState<SortMode>('gain')
    const { data: stocks, loading } = useTopStocks(exchangeId, sortBy)

    return (
        <Box>
      {/* Sort controls */}
        <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 0.75,
            borderBottom: '1px solid #21262d',
        }}
        >
            <Typography
            sx={{
                fontSize: '0.65rem',
                color: '#7d8590',
                fontFamily: 'monospace',
            }}
            >
                TOP 10 CONSTITUENTS
            </Typography>
            <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={(_, val) => val && setSortBy(val)}
            size="small"
            >
            {(['gain', 'volume', 'marketcap'] as SortMode[]).map(mode => (
            <ToggleButton
            key={mode}
            value={mode}
            sx={{
                fontSize: '0.6rem',
                py: 0.25,
                px: 1,
                color: '#7d8590',
                border: '1px solid #21262d',
                '&.Mui-selected': {
                    color: '#388bfd',
                    backgroundColor: '#1c2128',
                },
            }}
            >
                {mode === 'gain'
                ? 'By Gain'
                : mode === 'volume'
                ? 'By Volume'
                : 'By Mkt Cap'}
            </ToggleButton>
            ))}
        </ToggleButtonGroup>
        </Box>

      {/* Column headers */}
        <Box
        sx={{
            display: 'grid',
            gridTemplateColumns:
            '1.5fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1fr 80px 30px',
            px: 2,
            py: 0.5,
            borderBottom: '1px solid #21262d',
        }}
        >
            {COLUMN_HEADERS.map((col, i) => (
            <Typography
            key={i}
            sx={{
                fontSize: '0.6rem',
                color: '#4a5568',
                fontFamily: 'monospace',
                letterSpacing: 0.5,
                ...(col.width && { width: col.width }),
            }}
            >
                {col.label}
            </Typography>
            ))}
        </Box>

      {/* Stocks, mistake here about setLoading */}
        {loading ? (
            <Box sx={{ py: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#4a5568' }}>
                    Loading...
                </Typography>
            </Box>
            ) : (
            stocks.map(stock => (
            <StockRow
            key={stock.symbol}
            stock={stock}
            isMarketOpen={isOpen}
            currency={currency}
            />
            ))
        )}
    </Box>
    )
}