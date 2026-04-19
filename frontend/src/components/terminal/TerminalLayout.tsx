'use client'

import { useState } from 'react'
import { Box } from '@mui/material'
import ChartGrid from './ChartGrid'
import NewsfeedPanel from '@/components/newsfeed/NewsfeedPanel'
import ClockBar from '@/components/shared/ClockBar'

export default function TerminalLayout() {
  // Active symbols get passed down from ChartGrid
  // For now pass empty — ChartGrid will lift state in a follow-up
    const [activeSymbols] = useState<string[]>([])

    return (
        <Box
        sx={{
            display:         'flex',
            flexDirection:   'column',
            height:          '100%',
            backgroundColor: '#0d1117',
            overflow:        'hidden',
        }}
        >
            <ClockBar />        
            <Box sx={{ flex: 1, minHeight: 0 }}>
                <ChartGrid />
            </Box>
            <Box sx={{ height: 220, flexShrink: 0 }}>
                <NewsfeedPanel activeSymbols={activeSymbols} />
            </Box>
        </Box>
    )
}