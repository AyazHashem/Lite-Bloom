'use client'

import  { Box } from '@mui/material'
import ChartPanel from './ChartPanel'

const DEMO_SYMBOLS = ['AAPL', 'STI']

export default function ChartGrid() {
    return (
        <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            height: '100%',
            p: 1,
        }}
        >
            {DEMO_SYMBOLS.map((symbol) => (
                <ChartPanel key={symbol} symbol={symbol} />
            ))}
        </Box>
    )
}