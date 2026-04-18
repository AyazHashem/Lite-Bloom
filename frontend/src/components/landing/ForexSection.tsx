'use client'

import { Box, Typography, CircularProgress } from '@mui/material'
import WatchlistButton from '@/components/shared/WatchlistButton'
import { useForex } from '@/hooks/useLandingData'

export default function ForexSection(){
    const { data: pairs, loading } = useForex()

    return(
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
                FOREX
            </Typography>

            <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 0.75,
            }}
            >
                {loading ? (
                    <CircularProgress size={22} sx={{ color: '#1f6feb' }} />
                    ) : (
                            pairs.map((pair: any) => (
                                <Box
                                key={pair.pair}
                                sx={{
                                    p: 1.25,
                                    backgroundColor: '#161b22',
                                    border: '1px solid #21262d',
                                    borderRadius: 1,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    '&:hover': { backgroundColor: '#1c2128' },
                                }}
                                >
                                    <Box>
                                        <Typography
                                        sx={{
                                            fontSize: '0.72rem',
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            color: '#cdd9e5',
                                        }}
                                        >
                                            {pair.pair}
                                        </Typography>
                                        <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontFamily: 'monospace',
                                            color: '#cdd9e5',
                                        }}
                                        >
                                            {pair.rate?.toFixed(4)}
                                        </Typography>
                                    </Box>
                                    <WatchlistButton
                                    symbol={pair.pair}
                                    name={pair.pair}
                                    />
                                </Box>
                            ))
                )}
            </Box>
        </Box>
    )
}