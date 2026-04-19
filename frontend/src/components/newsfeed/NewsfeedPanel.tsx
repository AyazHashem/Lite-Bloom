'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, Typography, CircularProgress, Tab, Tabs } from '@mui/material'
import NewsItem from './NewsItem'
import { useNewsfeed } from '@/hooks/useNewsfeed'

interface NewsfeedPanelProps {
    activeSymbols?: string[]
}

export default function NewsfeedPanel({
    activeSymbols = [],
}: NewsfeedPanelProps) {
    const [tab, setTab] = useState(0)

    const {
        articles:    generalArticles,
        loading:     generalLoading,
        lastUpdated,
        newCount,
        clearNewCount,
    } = useNewsfeed([])

    const {
        articles:  relevantArticles,
        loading:   relevantLoading,
    } = useNewsfeed(activeSymbols)

  // Filter relevant to only symbol-specific (has symbols array populated)
    const symbolArticles = relevantArticles.filter(
        a => a.symbols && a.symbols.length > 0
    )

    const hasActiveSymbols = activeSymbols.length > 0
    const scrollRef    = useRef<HTMLDivElement>(null)
    const userScrolled = useRef(false)

  // Auto-scroll to bottom
    const currentArticles = tab === 0 ? generalArticles : symbolArticles
    useEffect(() => {
        if (!scrollRef.current || userScrolled.current) return
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [currentArticles])

    const handleScroll = () => {
        if (!scrollRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        userScrolled.current = scrollHeight - scrollTop - clientHeight > 20
        if (!userScrolled.current) clearNewCount()
    }

    return (
        <Box
        sx={{
            display:         'flex',
            flexDirection:   'column',
            height:          '100%',
            backgroundColor: '#080b12',
            borderTop:       '2px solid #21262d',
        }}
        >
            {/* Header */}
            <Box
            sx={{
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'space-between',
                px:              2,
                py:              0.5,
                borderBottom:    '1px solid #21262d',
                backgroundColor: '#0d1117',
                flexShrink:      0,
            }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                    sx={{
                        width:           6,
                        height:          6,
                        borderRadius:    '50%',
                        backgroundColor: '#3fb950',
                        animation:       'nfPulse 2s infinite',
                        '@keyframes nfPulse': {
                            '0%': { opacity: 1 }, '50%': { opacity: 0.3 }, '100%': { opacity: 1 },
                        },
                    }}
                    />
                    <Typography
                    sx={{
                        fontSize:      '0.62rem',
                        fontFamily:    'monospace',
                        fontWeight:    700,
                        color:         '#7d8590',
                        letterSpacing: 1,
                    }}
                    >
                        MARKET NEWS
                    </Typography>

                    {newCount > 0 && (
                        <Box
                        onClick={clearNewCount}
                        sx={{
                            px:              0.75,
                            py:              0.1,
                            borderRadius:    0.75,
                            backgroundColor: 'rgba(31,111,235,0.2)',
                            border:          '1px solid #1f6feb',
                            cursor:          'pointer',
                        }}
                        >
                            <Typography sx={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#388bfd', fontWeight: 700 }}>
                                +{newCount} NEW
                            </Typography>
                        </Box>
                    )}
                </Box>

                {lastUpdated && (
                    <Typography sx={{ fontSize: '0.58rem', color: '#4a5568', fontFamily: 'monospace' }}>
                        {`UPDATED ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`}
                    </Typography>
                )}
            </Box>

            {/* Tabs — only shown when charts are open */}
            {hasActiveSymbols && (
                <Tabs
                value={tab}
                onChange={(_, v) => { setTab(v); userScrolled.current = false }}
                sx={{
                    minHeight:       32,
                    borderBottom:    '1px solid #21262d',
                    backgroundColor: '#0d1117',
                    flexShrink:      0,
                    '& .MuiTab-root': {
                        minHeight:  32,
                        fontSize:   '0.62rem',
                        fontFamily: 'monospace',
                        color:      '#4a5568',
                        py:         0,
                        '&.Mui-selected': { color: '#388bfd' },
                    },
                    '& .MuiTabs-indicator': { backgroundColor: '#1f6feb', height: 2 },
                }}
                >
                    <Tab label="GENERAL" />
                    <Tab
                    label={
                        `${activeSymbols.join(', ')} NEWS${symbolArticles.length > 0 ? ` (${symbolArticles.length})` : ''}`
                    }
                    />
                </Tabs>
            )}

            {/* Scroll hint */}
            <Box sx={{ px: 2, py: 0.3, borderBottom: '1px solid #161b22', flexShrink: 0 }}>
                <Typography sx={{ fontSize: '0.52rem', color: '#4a5568', fontFamily: 'monospace' }}>
                    ↑ SCROLL FOR OLDER — NEWEST AT BOTTOM
                </Typography>
            </Box>

            {/* Articles */}
            <Box
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{
                flex:          1,
                overflowY:     'auto',
                display:       'flex',
                flexDirection: 'column',
                '&::-webkit-scrollbar':       { width: 3 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#21262d', borderRadius: 2 },
            }}
            >
                {(tab === 0 ? generalLoading : relevantLoading) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, mt: 'auto' }}>
                        <CircularProgress size={18} sx={{ color: '#1f6feb' }} />
                    </Box>
                    ) : (
                        <>
                            <Box sx={{ flex: 1 }} />
                            {(tab === 0 ? generalArticles : symbolArticles).map((article, i) => (
                                <NewsItem key={article.url || i} article={article} />
                            ))}
                        </>
                    )}
            </Box>
        </Box>
    )
}