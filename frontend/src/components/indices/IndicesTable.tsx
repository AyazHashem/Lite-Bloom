'use client'

import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import IndicesRow from './IndicesRow'

interface IndicesTableProps {
    stocks: any[]
    loading: boolean
    isMarketOpen: boolean
}

const COLUMN_HEADERS = [
    'Symbol / Name', 'Price', 'Change', 'Volume',
    '24H High', '24H Low', 'Open / Close', 'Trend', ''
]

export default function IndicesTable({
    stocks,
    loading,
    isMarketOpen,
}: IndicesTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    const toggleRow = (symbol: string) => {
    setExpandedRows(prev => {
        const next = new Set(prev)
        if (next.has(symbol)) {
            next.delete(symbol)
        } else {
            next.add(symbol)
        }
        return next
        })
    }

    if (loading) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#4a5568' }}>
                    Loading...
                </Typography>
            </Box>
        )
    }

    if (stocks.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#4a5568' }}>
                    Select a market and exchange to view listings.
                </Typography>
            </Box>
        )
    }

    return (
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
                    '1.5fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1fr 80px 60px',
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

      {/* Rows */}
            {stocks.map(stock => (
                <IndicesRow
                key={stock.symbol}
                stock={stock}
                isExpanded={expandedRows.has(stock.symbol)}
                isMarketOpen={isMarketOpen}
                onToggle={() => toggleRow(stock.symbol)}
                />
            ))}
        </Box>
    )
}