'use client'

import { Icon, IconButton, Tooltip } from "@mui/material"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useWatchlist } from '@/hooks/useWatchlist'

interface WatchlistButtonProps {
    symbol: string
    name: string
}

export default function WatchlistButton ({
    symbol,
    name
}: WatchlistButtonProps) {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
    const inList = isInWatchlist(symbol)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (inList) {
            removeFromWatchlist(symbol)
        } else {
            addToWatchlist(symbol, name)
        }
    }

    return (
        <Tooltip title={inList ? 'Remove from watchlist' : 'Add to watchlist'}>
            <IconButton
            size="small"
            onClick={handleClick}
            sx={{
                color: inList ? '#1f6feb' : '#7d8590',
                padding: '2px',
                '&:hover': { color: '#388bfd' },
            }}
            >
                {inList
                    ? <BookmarkIcon sx={{ fontSize: 14 }} />
                    : <BookmarkBorderIcon sx={{ fontSize: 14 }} />
                }
            </IconButton>
        </Tooltip>
    )
}