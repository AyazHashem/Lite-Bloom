'use client'

import { Box, Typography } from '@mui/material'
import ChartGrid from './ChartGrid'
import NewsfeedPanel from '@/components/newsfeed/NewsfeedPanel'

export default function TerminalLayout() {
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: '#060810',
            overflow: 'hidden',
        }}
        >
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                backgroundColor: '#080b12',
                borderBottom: '1px solid #1e2310',
                flexShrink: 0,
            }}
            >
                <Typography
                variant="subtitle2"
                sx={{
                    color: '#26a29a',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: 2,
                    fontSize: '0.8rem'
                }}
                >
                    TERMINAL
                </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0}}>
                <ChartGrid />
            </Box>
            <Box sx={{ height: 200, flexShrink: 0}}>
                <NewsfeedPanel />
            </Box>
        </Box>
    )
}