import { useEffect, useState } from 'react'
import { Box, IconButton, Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import TableRowsIcon from '@mui/icons-material/TableRows'
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop'
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom'
import SidebarIcon from '@mui/icons-material/ViewSidebar'
import { usePinnedItems } from '@/hooks/usePinnedItems'
import PinnedCard from './PinnedCard'
import api from '@/services/api'

export default function PinnedStrip() {
    const {
        items,
        displayMode,
        setDisplayMode,
        position,
        setPosition,
    } = usePinnedItems()

    const [quotes, setQuotes] = useState<Record<string, any>>({})

    useEffect(() => {
        if(items.length === 0) return
        
        const fetchQuotes = async () => {
            const results: Record<string, any> = {}
            await Promise.all(
                items.map(async item => {
                    try {
                        const res = await api.get(`/api/market/quote/${item.symbol}`)
                        results[item.symbol] = res.data
                    } catch {}
                })
            )
            setQuotes(results)
        }

        fetchQuotes()

        const interval = setInterval(fetchQuotes, 30000)
        return () => clearInterval(interval)
    }, [items])

    if (items.length === 0) return null

    return (
        <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            backgroundColor: '#161b22',
            borderTop: position === 'bottom' ? '1px solid #21262d' : 'none',
            borderBottom: position === 'top' ? '1px solid #21262d' : 'none',
            overflowX: 'auto',
            flexShrink: 0,
            '&::-webkit-scrollbar': { height: 3 } ,
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#21262d',
                borderRadius: 2,
            }
        }}
        >
            <Box
            sx={{
                display: 'flex',
                gap: 0.25,
                flexShrink: 0,
                mr: 0.5,
            }}
            >
                <Tooltip title="Toggle sparkline/stats">
                    <IconButton
                    size="small"
                    onClick={() =>
                        setDisplayMode(displayMode === 'sparkline' ? 'stats' : 'sparkline')
                    }
                    sx={{ color: '#7d8590', padding: '3px' }}
                    >
                        {displayMode === 'sparkline'
                        ? <TableRowsIcon sx={{ fontSize: 14 }} />
                        : <BarChartIcon sx={{ fontSize: 14}} />
                        }
                    </IconButton>
                </Tooltip>
                <Tooltip title="Move to top">
                    <IconButton
                    size="small"
                    onClick={() => setPosition('top')}
                    sx={{
                        color: position === 'top' ? '#1f6feb' : '#7d8590',
                        padding: '3px',
                    }}
                    >
                        <VerticalAlignTopIcon sx={{ fontSize: 14}} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Move to bottom">
                    <IconButton
                    size="small"
                    onClick={() => setPosition('bottom')}
                    sx={{
                        color: position === 'bottom' ? '#1f6feb' : '#7d8590',
                        padding: '3px',
                    }}
                    >
                        <VerticalAlignBottomIcon sx={{ fontSize: 14 }}/>
                    </IconButton>
                </Tooltip>
            </Box>
            {items.map(item => (
                <PinnedCard
                key={item.symbol}
                symbol={item.symbol}
                name={item.name}
                quote={quotes[item.symbol]}
                displayMode={displayMode}
                />
            ))}
        </Box>
    )
}