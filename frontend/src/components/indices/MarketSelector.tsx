'use client'

import { useState } from 'react'
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { EXCHANGES } from '@/lib/exchangeConfig'

type MarketType = 'stocks' | 'forex' | 'crypto' | 'commodities' | 'bonds' | ''

interface MarketSelectorProps {
    onSelectionChange: (params: {
        marketType: MarketType
        exchangeId: string
        searchQuery: string
    }) => void
}

const MARKET_TYPES = [
    { value: 'stocks',      label: 'Stock Markets' },
    { value: 'forex',       label: 'Forex' },
    { value: 'crypto',      label: 'Cryptocurrency' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'bonds',       label: 'Bonds' },
]

const CRYPTO_BASE_CURRENCIES = ['USD', 'EUR', 'GBP', 'USDT']

export default function MarketSelector({
    onSelectionChange,
}: MarketSelectorProps) {
    const [marketType, setMarketType] = useState<MarketType>('')
    const [exchangeId, setExchangeId] = useState('')
    const [cryptoBase, setCryptoBase] = useState('USD')
    const [forexBase, setForexBase] = useState('USD')
    const [searchQuery, setSearchQuery] = useState('')

    const handleMarketChange = (value: MarketType) => {
        setMarketType(value)
        setExchangeId('')
        setSearchQuery('')
        onSelectionChange({ marketType: value, exchangeId: '', searchQuery: '' })
    }

    const handleExchangeChange = (value: string) => {
        setExchangeId(value)
        setSearchQuery('')
        onSelectionChange({ marketType, exchangeId: value, searchQuery: '' })
    }

    const handleSearch = (value: string) => {
        setSearchQuery(value)
        onSelectionChange({ marketType, exchangeId, searchQuery: value })
    }

    const showExchangeDropdown = marketType === 'stocks'
    const showForexBase = marketType === 'forex'
    const showCryptoBase = marketType === 'crypto'
    const showSearch = marketType !== '' && (
        marketType !== 'stocks' || exchangeId !== ''
    )

    const selectSx = {
        fontSize: '0.78rem',
        color: '#cdd9e5',
        backgroundColor: '#161b22',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#21262d',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#30363d',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1f6feb',
        },
    }

    return (
        <Box
        sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            flexWrap: 'wrap',
            mb: 2,
        }}
        >
            {/* Market type */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel
                sx={{
                    fontSize: '0.75rem',
                    color: '#7d8590',
                    '&.Mui-focused': { color: '#388bfd' },
                }}
                >
                    Market Type
                </InputLabel>
                <Select
                value={marketType}
                label="Market Type"
                onChange={e => handleMarketChange(e.target.value as MarketType)}
                sx={selectSx}
                >
                    {MARKET_TYPES.map(m => (
                        <MenuItem key={m.value} value={m.value} sx={{ fontSize: '0.75rem' }}>
                            {m.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

      {/* Exchange dropdown for stocks */}
            {showExchangeDropdown && (
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel
                    sx={{
                        fontSize: '0.75rem',
                        color: '#7d8590',
                        '&.Mui-focused': { color: '#388bfd' },
                    }}
                    >
                        Exchange
                    </InputLabel>
                    <Select
                    value={exchangeId}
                    label="Exchange"
                    onChange={e => handleExchangeChange(e.target.value)}
                    sx={selectSx}
                    >
                        {EXCHANGES.map(e => (
                            <MenuItem
                            key={e.id}
                            value={e.id}
                            sx={{ fontSize: '0.75rem' }}
                            >
                                {e.name} — {e.region}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

      {/* Forex base currency */}
            {showForexBase && (
                <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel
                    sx={{
                        fontSize: '0.75rem',
                        color: '#7d8590',
                        '&.Mui-focused': { color: '#388bfd' },
                    }}
                    >
                        Base Currency
                    </InputLabel>
                    <Select
                    value={forexBase}
                    label="Base Currency"
                    onChange={e => {
                        setForexBase(e.target.value)
                        onSelectionChange({
                            marketType,
                            exchangeId: e.target.value,
                            searchQuery,
                        })
                    }}
                    sx={selectSx}
                    >
                        {['USD', 'EUR', 'GBP', 'JPY', 'AED', 'SAR'].map(c => (
                            <MenuItem key={c} value={c} sx={{ fontSize: '0.75rem' }}>
                                {c}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

      {/* Crypto base currency */}
            {showCryptoBase && (
                <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel
                    sx={{
                        fontSize: '0.75rem',
                        color: '#7d8590',
                        '&.Mui-focused': { color: '#388bfd' },
                    }}
                    >
                        Quoted In
                    </InputLabel>
                    <Select
                    value={cryptoBase}
                    label="Quoted In"
                    onChange={e => {
                        setCryptoBase(e.target.value)
                        onSelectionChange({
                            marketType,
                            exchangeId: e.target.value,
                            searchQuery,
                        })
                    }}
                    sx={selectSx}
                    >
                        {CRYPTO_BASE_CURRENCIES.map(c => (
                            <MenuItem key={c} value={c} sx={{ fontSize: '0.75rem' }}>
                                {c}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

      {/* Search bar */}
            {showSearch && (
                <TextField
                size="small"
                placeholder="Search symbol or name..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    minWidth: 220,
                    '& .MuiInputBase-root': {
                        fontSize: '0.75rem',
                        color: '#cdd9e5',
                        backgroundColor: '#161b22',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#21262d',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#30363d',
                    },
                }}
                />
            )}
        </Box>
    )
}