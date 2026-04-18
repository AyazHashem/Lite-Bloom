'use client'

import { Box, Typography, CircularProgress } from '@mui/material'
import PriceChange from '@/components/shared/PriceChange'
import { useBonds } from '@/hooks/useLandingData'

export default function BondsSection(){
    const { data: bonds, loading } = useBonds()

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
                US TREASURY YIELD CURVE
            </Typography>

            <Box
            sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
            }}
            >
                {loading ? (
                    <CircularProgress size={22} sx={{ color: '#1f6feb' }} />
                    ) : (
                        bonds.map((bond: any) => (
                            <Box
                            key={bond.maturity}
                            sx={{
                                flex: 1,
                                minWidth: 120,
                                p: 1.5,
                                backgroundColor: '#161b22',
                                border: '1px solid #21262d',
                                borderRadius: 1,
                            }}
                            >
                                <Typography
                                sx={{
                                    fontSize: '0.65rem',
                                    color: '#7d8590',
                                    fontFamily: 'monospace',
                                    mb: 0.25,
                                }}
                                >
                                    {bond.maturity} TREASURY
                                </Typography>
                                <Typography
                                sx={{
                                    fontSize: '1rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    color: '#cdd9e5',
                                }}
                                >
                                    {bond.yield?.toFixed(2)}%
                                </Typography>
                                <PriceChange
                                change={bond.change || 0}
                                changePercent={bond.change || 0}
                                showBoth={false}
                                />
                                <Typography
                                sx={{
                                    fontSize: '0.58rem',
                                    color: '#4a5568',
                                    mt: 0.5,
                                }}
                                >
                                    {bond.date}
                                </Typography>
                            </Box>
                        ))
                )}
            </Box>
        </Box>
    )
}