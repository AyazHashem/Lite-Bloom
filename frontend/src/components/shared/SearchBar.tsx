'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Box,
    InputBase,
    Typography,
    CircularProgress,
    Popper,
    Paper,
    ClickAwayListener,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { marketService } from '@/services/marketService'

interface SearchResult {
    symbol:   string
    name:     string
    type?:    string
    region?:  string
}

interface SearchBarProps {
    onSelect:    (symbol: string, name: string) => void
    placeholder?: string
    size?:        'small' | 'medium'
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounced
}

export default function SearchBar({
    onSelect,
    placeholder = 'Search symbol...',
    size = 'small',
}: SearchBarProps) {
    const [query,   setQuery]   = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [open,    setOpen]    = useState(false)
    const anchorRef = useRef<HTMLDivElement>(null)

    const debouncedQuery = useDebounce(query, 350)

    const searchSymbols = useCallback(async (q: string) => {
        if (!q || q.length < 1) {
            setResults([])
            setOpen(false)
            return
        }

        setLoading(true)
        try {
            const data = await marketService.searchSymbols(q)
            setResults(data.slice(0, 8))  // Max 8 results
            setOpen(data.length > 0)
        } catch (err) {
            console.error('Search error:', err)
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        searchSymbols(debouncedQuery)
    }, [debouncedQuery, searchSymbols])

    const handleSelect = (result: SearchResult) => {
        onSelect(result.symbol, result.name)
        setQuery('')
        setOpen(false)
        setResults([])
    }

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box ref={anchorRef} sx={{ position: 'relative' }}>
                {/* Input */}
                <Box
                sx={{
                    display:         'flex',
                    alignItems:      'center',
                    gap:             0.75,
                    px:              1.25,
                    py:              size === 'small' ? 0.5 : 0.75,
                    backgroundColor: '#0d1117',
                    border:          `1px solid ${open ? '#1f6feb' : '#21262d'}`,
                    borderRadius:    1,
                    transition:      'border-color 0.15s',
                    '&:focus-within': { borderColor: '#1f6feb' },
                    minWidth:        size === 'small' ? 160 : 220,
                }}
                >
                    {loading
                        ? <CircularProgress size={12} sx={{ color: '#7d8590', flexShrink: 0 }} />
                        : <SearchIcon sx={{ fontSize: 14, color: '#7d8590', flexShrink: 0 }} />
                    }
                    <InputBase
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={placeholder}
                    sx={{
                        fontSize:    size === 'small' ? '0.75rem' : '0.82rem',
                        color:       '#cdd9e5',
                        fontFamily:  'monospace',
                        flex:        1,
                        '& input': { padding: 0 },
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Escape') {
                            setOpen(false)
                            setQuery('')
                        }
                        if (e.key === 'Enter' && results.length > 0) {
                            handleSelect(results[0])
                        }
                    }}
                />
            </Box>

            {/* Dropdown */}
            <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            style={{ zIndex: 1400, width: anchorRef.current?.offsetWidth }}
            >
                <Paper
                sx={{
                    backgroundColor: '#161b22',
                    border:          '1px solid #21262d',
                    borderRadius:    1,
                    mt:              0.5,
                    overflow:        'hidden',
                    boxShadow:       '0 8px 24px rgba(0,0,0,0.4)',
                }}
                >
                    {results.map((result, index) => (
                        <Box
                        key={`${result.symbol}-${index}`}
                        onClick={() => handleSelect(result)}
                        sx={{
                            display:    'flex',
                            alignItems: 'center',
                            gap:        1.5,
                            px:         1.5,
                            py:         0.75,
                            cursor:     'pointer',
                            borderBottom: index < results.length - 1
                            ? '1px solid #21262d'
                            : 'none',
                            '&:hover': { backgroundColor: '#1c2128' },
                        }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                sx={{
                                    fontSize:   '0.78rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    color:      '#388bfd',
                                }}
                                >
                                    {result.symbol}
                                </Typography>
                                    <Typography
                                    noWrap
                                    sx={{ fontSize: '0.65rem', color: '#7d8590' }}
                                    >
                                        {result.name}
                                    </Typography>
                                </Box>
                                {result.type && (
                                    <Typography
                                    sx={{
                                        fontSize:        '0.58rem',
                                        color:           '#4a5568',
                                        fontFamily:      'monospace',
                                        backgroundColor: '#21262d',
                                        px:              0.75,
                                        py:              0.2,
                                        borderRadius:    0.5,
                                        flexShrink:      0,
                                    }}
                                    >
                                        {result.type}
                                    </Typography>
                                )}
                            </Box>
                    ))}
                </Paper>
            </Popper>
            </Box>
        </ClickAwayListener>
    )
}