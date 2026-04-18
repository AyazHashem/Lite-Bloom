'use client'

import { useState } from 'react'
import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
} from '@mui/material'
import ExchangeCard from './ExchangeCard'
import { useMarkets } from '@/hooks/useLandingData'

type SortMode = 'gain' | 'volume'

export default function MarketOverview() {
    const [sortBy, setSortBy] = useState<SortMode>('gain')
    const [activeExchange, setActiveExchange] = useState<string | null>(null)
    const { data: markets, loading } = useMarkets(sortBy)

    return(
        <Box sx={{ mb: 3 }}>
      {/* Section header */}
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1.5,
            }}
            >
                <Typography
                sx={{
                    fontSize: '0.72rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#7d8590',
                    letterSpacing: 1,
                }}
                >
                    TOP PERFORMING MARKETS
                </Typography>
                <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={(_, val) => val && setSortBy(val)}
                size="small"
                >
                    {(['gain', 'volume'] as SortMode[]).map(mode => (
                        <ToggleButton
                        key={mode}
                        value={mode}
                        sx={{
                            fontSize: '0.65rem',
                            py: 0.25,
                            px: 1.25,
                            color: '#7d8590',
                            border: '1px solid #21262d',
                            '&.Mui-selected': {
                                color: '#388bfd',
                                backgroundColor: '#1c2128',
                            },
                        }}
                        >
                            {mode === 'gain' ? 'By Gain' : 'By Volume'}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>
      {/* Exchange cards */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} sx={{ color: '#1f6feb' }} />
                </Box>
            ) : (
                <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-start',
                }}
                >
                    {markets.map((market: any) => (
                        <ExchangeCard
                        key={market.exchange.id}
                        exchangeData={market}
                        isActive={activeExchange === market.exchange.id}
                        onClick={() =>
                            setActiveExchange(
                            activeExchange === market.exchange.id
                            ? null
                            : market.exchange.id
                            )
                        }
                        />
                    ))}
                </Box>
            )}
        </Box>
    )
}