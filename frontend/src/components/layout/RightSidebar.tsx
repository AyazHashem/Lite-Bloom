'use client'

import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import WatchlistPanel from './WatchlistPanel'

interface RightSidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export default function RightSidebar({
    isOpen,
    onToggle,
}: RightSidebarProps) {
    const sidebarWidth = isOpen ? 260 : 40

    return (
        <Box
        sx={{
            width: sidebarWidth,
            flexShrink: 0,
            height: '100vh',
            backgroundColor: '#161b22',
            borderLeft: '1px solid #21262d',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.2s ease',
            overflow: 'hidden',
            zIndex: 10,
        }}
        >
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOpen? 'space-between' : 'center',
                px: isOpen ? 1.5 : 0,
                py: 1.5,
                borderBottom: '1px solid #21262d',
                minHeight: 48,
            }}
            >
                <IconButton
                size="small"
                onClick={onToggle}
                sx={{ color: '#7d8590', padding: '4px' }}
                >
                    {isOpen
                    ? <ChevronRightIcon sx={{ fontSize: 16}} />
                    : <ChevronLeftIcon sx={{ fontSize: 16}} />
                    }
                </IconButton>
                {isOpen && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BookmarkIcon sx={{ fontSize: 14, color: '#1f6feb' }} />
                        <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#cdd9e5',
                            letterSpacing: 0.5,
                        }}
                        >
                            WATCHLIST
                        </Typography>
                    </Box>
                )}
            </Box>
            {isOpen && <WatchlistPanel />}
            {!isOpen && (
                <Box sx={{ pt: 1 }}>
                    <Tooltip title="Watchlist" placement="left">
                        <IconButton
                        size="small"
                        onClick={onToggle}
                        sx={{ color: '#7d8590', width: '100%', borderRadius: 0, py: 1 }}
                        >
                            <BookmarkIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Box>
    )
}