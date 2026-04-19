'use client'

import { Box, Typography, CircularProgress } from '@mui/material'
import Sparkline from '@/components/shared/Sparkline'
import PriceChange from '@/components/shared/PriceChange'
import WatchlistButton from '@/components/shared/WatchlistButton'
import { useCrypto } from '@/hooks/useLandingData'

export default function CryptoSection() {
    const { data: cryptos, loading } = useCrypto()

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
                CRYPTOCURRENCY
            </Typography>

            <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 0.75,
            }}
            >
                {loading ? (
                    <CircularProgress size={22} sx={{ color: '#1f6feb' }} />
                    ) : (
                        cryptos.map((crypto: any) => {
                            const isPositive = crypto.change_percent >= 0
                            return (
                                <Box
                                key={crypto.symbol}
                                sx={{
                                    p: 1.25,
                                    backgroundColor: '#161b22',
                                    border: '1px solid #21262d',
                                    borderRadius: 1,
                                    '&:hover': { backgroundColor: '#1c2128' },
                                }}
                                >
                                    <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        mb: 0.5,
                                    }}
                                    >
                                        <Box>
                                            <Typography
                                            sx={{
                                                fontSize: '0.78rem',
                                                fontFamily: 'monospace',
                                                fontWeight: 700,
                                                color: '#cdd9e5',
                                            }}
                                            >
                                                {crypto.name}
                                            </Typography>
                                            <Typography
                                            sx={{ fontSize: '0.6rem', color: '#7d8590' }}
                                            >
                                                {crypto.symbol}
                                            </Typography>
                                        </Box>
                                        <WatchlistButton
                                        symbol={crypto.symbol}
                                        name={crypto.name}
                                        />
                                    </Box>

                                    <Typography
                                    sx={{
                                        fontSize: '0.9rem',
                                        fontFamily: 'monospace',
                                        fontWeight: 600,
                                        color: '#cdd9e5',
                                        mb: 0.25,
                                    }}
                                    >
                                        ${crypto.price?.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Typography>

                                    <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                    >
                                        <PriceChange
                                        change={crypto.change}
                                        changePercent={crypto.change_percent}
                                        showBoth={false}
                                        />
                                        {crypto.sparkline?.length > 1 && (
                                            <Sparkline
                                            data={crypto.sparkline}
                                            width={70}
                                            height={24}
                                            positive={isPositive}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            )
                        })
                )}
            </Box>
        </Box>
    )
}