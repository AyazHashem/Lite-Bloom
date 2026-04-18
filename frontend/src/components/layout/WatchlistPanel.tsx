'use client'

import { useEffect, useState } from "react"
import { Box, Typography, IconButton, Tooltip, CircularProgress } from "@mui/material"
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import CloseIcon from '@mui/icons-material/Close'
import PriceChange from "@/components/shared/PriceChange"
import Sparkline from "@/components/shared/SparkLine"
import MarketBadge from "@/components/shared/MarketBadge"
import { useWatchlist } from "@/hooks/useWatchlist"
import { usePinnedItems } from "@/hooks/usePinnedItems"
import api from '@/services/api'

export default function WatchlistPanel(){
    const { items, removeFromWatchlist } = useWatchlist()
    const { pinItems, unpinItem, isPinned } = usePinnedItems()
    const [quotes, setQuotes] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(items.length === 0) return

        const fetchQuotes = async () => {
            setLoading(true)
            const results: Record<string, any> = {}
            await Promise.all(
                items.map(async item => {
                    try {
                        const res = await api.get(`/api/market/quote/${item.symbol}`)
                        results[item.symbol] = res.data
                    } catch {
                        // Quote fails silently
                    }
                })
            )
            setQuotes(results)
            setLoading(false)
        }

        fetchQuotes()
        const interval = setInterval(fetchQuotes, 30000)
        return () => clearInterval(interval)
    }, [items])

    if (items.length === 0) {
        return (
            <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                gap: 1,
            }}
            >
                <Typography
                sx={{
                    fontSize: '0.7rem',
                    color: '#7d8590',
                    textAlign: 'center',
                }}
                >
                    No items in watchlist
                </Typography>
                <Typography
                sx={{
                    fontSize: '0.65rem',
                    color: '#4a5568',
                    textAlign: 'center',
                }}
                >
                    Click the bookmark icon on an instrument to add it here
                </Typography>
            </Box>
        )
    }

    return (
        <Box
        sx={{
            flex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 3 },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#21262d',
                borderRadius: 2,
            },
        }}
        >
            {loading && items.length === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={20} sx={{ color: '#1f6feb' }} />
                </Box>
            )}

            {items.map(item => {
                const quote = quotes[item.symbol]
                const isPositive = quote ? quote.change >= 0 : true
                const pinned = isPinned(item.symbol)

                return(
                <Box
                key={item.symbol}
                sx={{
                    p: 1.5,
                    borderBottom: '1px solid #21262d',
                    '&:hover': { backgroundColor: '#1c2128' },
                }}
                >
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.5,
                    }}
                    >
                        <Box>
                            <Typography
                            sx={{
                                fontSize: '0.78rem',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: '#cdd9e5'
                            }}
                            >
                                {item.symbol}
                            </Typography>
                            <Typography
                            sx={{ fontSize: '0.6rem', color: '#7d8590' }}
                            >
                                {item.name}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.25 }}>
                            <Tooltip title={pinned ? 'Unpin' : 'Pin to strip' }>
                                <IconButton
                                size="small"
                                onClick={() => pinned
                                    ? unpinItem(item.symbol)
                                    : pinItems(item.symbol, item.name)
                                }
                                sx={{
                                    padding: '2px',
                                    color: pinned ? '#1f6feb' : '#7d8590'
                                }}
                                >
                                    {
                                        pinned
                                        ? <PushPinIcon sx={{ fontSize: 12 }} />
                                        : <PushPinOutlinedIcon sx={{ fontsize: 12 }} />
                                    }
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove from watchlist">
                                <IconButton
                                size="small"
                                onClick={() => removeFromWatchlist(item.symbol)}
                                sx={{ padding: '2px', color: '#7d8590' }}
                                >
                                    <CloseIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    {quote ? (
                        <Box
                        sx={{
                            displat: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Box>
                                <Typography
                                sx={{
                                    fontSize: '0.82rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 600,
                                    color: '#cdd9e5'
                                }}
                                >
                                    {quote.price?.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </Typography>
                                <PriceChange 
                                change={quote.change}
                                changePercent={quote.change_percent}
                                showBoth={false}
                                />
                            </Box>
                            {quote.sparkline && (
                                <Sparkline
                                data={quote.sparkline}
                                width={60}
                                height={24}
                                positive={isPositive}
                                />
                            )}
                        </Box>
                    ) : (
                        <Typography
                        sx={{ fontSize: '0.65rem', color: '#4a5568' }}
                        >
                            Loading...
                        </Typography>
                    )}
                </Box>
                )
            })}
        </Box>
    )
}