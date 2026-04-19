'use client'

import { useState, useCallback } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChartPanel from './ChartPanel'
import SearchBar from '@/components/shared/SearchBar'
import { MAX_CHARTS, DEFAULT_CHART_SYMBOL } from '@/lib/constants'
import FocusMode from './FocusMode'


interface ChartEntry {
    id:     number
    symbol: string
    name:   string
}

let nextId = 1

function getGridLayout(count: number): string {
    switch (count) {
        case 1:  return '1fr'
        case 2:  return '1fr 1fr'
        case 3:  return '1fr 1fr'
        case 4:  return '1fr 1fr'
        default: return '1fr'
    }
}

function getGridRows(count: number): string {
    switch (count) {
        case 1:  return '1fr'
        case 2:  return '1fr'
        case 3:  return '1fr 1fr'
        case 4:  return '1fr 1fr'
        default: return '1fr'
    }
}

// For 3 charts: first chart spans both rows on left, two stack on right
function getGridArea(index: number, count: number): string | undefined {
    if (count === 3 && index === 0) return '1 / 1 / 3 / 2'
    return undefined
}

export default function ChartGrid() {
    const [charts,       setCharts]       = useState<ChartEntry[]>([
        { id: nextId++, symbol: DEFAULT_CHART_SYMBOL, name: DEFAULT_CHART_SYMBOL },
    ])
    const [focusModeChart, setFocusModeChart] = useState<ChartEntry | null>(null)
    const [focusedId,    setFocusedId]    = useState<number | null>(null)
    const [showAddSearch, setShowAddSearch] = useState(false)

    const addChart = useCallback((symbol: string, name: string) => {
        if (charts.length >= MAX_CHARTS) return
        setCharts(prev => [...prev, { id: nextId++, symbol, name }])
        setShowAddSearch(false)
    }, [charts.length])

    const removeChart = useCallback((id: number) => {
        setCharts(prev => {
            const next = prev.filter(c => c.id !== id)
            return next.length === 0
            ? [{ id: nextId++, symbol: DEFAULT_CHART_SYMBOL, name: DEFAULT_CHART_SYMBOL }]
            : next
        })
        setFocusedId(prev => prev === id ? null : prev)
    }, [])

    const count = charts.length

    return (
        <Box
        sx={{
            position: 'relative',
            height:   '100%',
            display:  'flex',
            flexDirection: 'column',
        }}
        >
            {/* Toolbar — add chart button */}
            <Box
            sx={{
                display:         'flex',
                alignItems:      'center',
                gap:             1,
                px:              1.5,
                py:              0.5,
                borderBottom:    '1px solid #21262d',
                backgroundColor: '#161b22',
                flexShrink:      0,
            }}
            >
                <Typography
                sx={{
                    fontSize:      '0.6rem',
                    fontFamily:    'monospace',
                    color:         '#4a5568',
                    letterSpacing: 1,
                }}
                >
                    CHART ANALYSIS
                </Typography>

                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Symbol count */}
                    <Typography
                    sx={{
                        fontSize:   '0.6rem',
                        fontFamily: 'monospace',
                        color:      '#4a5568',
                    }}
                    >
                        {count}/{MAX_CHARTS}
                    </Typography>

                    {/* Add search bar — appears when + is clicked */}
                    {showAddSearch && (
                        <SearchBar
                        onSelect={addChart}
                        placeholder="Add symbol..."
                        size="small"
                        />
                    )}

                    {/* Add chart button */}
                    {count < MAX_CHARTS && (
                        <Tooltip title="Add chart">
                            <IconButton
                            size="small"
                            onClick={() => setShowAddSearch(prev => !prev)}
                            sx={{
                                color:           showAddSearch ? '#388bfd' : '#7d8590',
                                backgroundColor: showAddSearch ? 'rgba(31,111,235,0.1)' : 'transparent',
                                border:          `1px solid ${showAddSearch ? '#1f6feb' : '#21262d'}`,
                                borderRadius:    1,
                                padding:         '3px',
                                '&:hover': { color: '#388bfd', borderColor: '#1f6feb' },
                            }}
                            >
                                <AddIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Focus on Chart">
                        <Typography
                        sx={{
                            fontSize:   '0.58rem',
                            color:      '#4a5568',
                            fontFamily: 'monospace',
                            ml:         1,
                        }}
                        >
                            Double-click chart to focus
                        </Typography>
                    </Tooltip>
                </Box>
            </Box>

            {/* Chart grid */}
            <Box
            sx={{
                flex:                1,
                display:             'grid',
                gridTemplateColumns: getGridLayout(count),
                gridTemplateRows:    getGridRows(count),
                gap:                 1,
                p:                   1,
                minHeight:           0,
            }}
            >
                {charts.map((chart, index) => (
                    <Box
                    key={chart.id}
                    onDoubleClick={() => setFocusModeChart(chart)}
                    sx={{
                        gridArea:  getGridArea(index, count),
                        minHeight: 0,
                        minWidth:  0,
                        cursor: 'pointer'
                    }}
                    >
                        <ChartPanel
                        symbol={chart.symbol}
                        onClose={() => removeChart(chart.id)}
                        onFocus={() => setFocusedId(chart.id)}
                        isFocused={focusedId === chart.id}
                        showClose={charts.length > 1}
                        />
                    </Box>
                ))}
                {focusModeChart && (
                    <FocusMode
                    primary={focusModeChart}
                    onExit={() => setFocusModeChart(null)}
                    />
                )}
            </Box>
        </Box>
    )
}