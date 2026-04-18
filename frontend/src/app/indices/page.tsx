'use client'

import { useState, useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import MarketSelector from '@/components/indices/MarketSelector'
import IndicesTable from '@/components/indices/IndicesTable'
import { useExchangeIndices } from '@/hooks/useIndicesData'
import { useMarkets } from '@/hooks/useLandingData'
import { EXCHANGES } from '@/lib/exchangeConfig'

export default function IndicesPage() {
    const [selection, setSelection] = useState({
        marketType: '' as any,
        exchangeId: '',
        searchQuery: '',
    })

    const { data: stocks, loading } = useExchangeIndices(
        selection.marketType === 'stocks' ? selection.exchangeId : null
    )

    const selectedExchange = EXCHANGES.find(e => e.id === selection.exchangeId)

    const filteredStocks = useMemo(() => {
        if (!selection.searchQuery) return stocks
        const q = selection.searchQuery.toLowerCase()
        return stocks.filter(
            s =>
            s.symbol?.toLowerCase().includes(q) ||
            s.name?.toLowerCase().includes(q)
        )
    }, [stocks, selection.searchQuery])

    return (
        <Box
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}
        >
      {/* Header */}
            <Box
            sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid #21262d',
                backgroundColor: '#161b22',
                flexShrink: 0,
            }}
            >
                <Typography
                sx={{
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    color: '#4a5568',
                    letterSpacing: 1,
                    mb: 1,
                }}
                >
                    INDICES & MARKETS
                </Typography>

                <MarketSelector onSelectionChange={setSelection} />

        {/* Context info when exchange is selected */}
                {selectedExchange && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#7d8590' }}>
                            {selectedExchange.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#7d8590' }}>
                            {selectedExchange.region}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#7d8590' }}>
                            {selectedExchange.currency}
                        </Typography>
                    </Box>
                )}
            </Box>

      {/* Table */}
            <Box
            sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#21262d',
                    borderRadius: 2,
                },
                }}
            >
                {selection.marketType === '' ? (
                    <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '60%',
                    }}
                    >
                        <Typography
                        sx={{
                            fontSize: '0.75rem',
                            color: '#4a5568',
                            fontFamily: 'monospace',
                        }}
                        >
                            Select a market type to begin.
                        </Typography>
                    </Box>
                    ) : (
                        <IndicesTable
                        stocks={filteredStocks}
                        loading={loading}
                        isMarketOpen={true}
                        />
                )}
            </Box>
        </Box>
    )
}