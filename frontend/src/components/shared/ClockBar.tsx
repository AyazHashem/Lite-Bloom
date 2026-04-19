'use client'

import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { CLOCK_CITIES, MARKET_CONFIG } from '@/lib/constants'
import { formatMarketTime } from '@/lib/formatters'
import { toZonedTime } from 'date-fns-tz'

function isWeekend(timezone: string): boolean {
    try {
        const now = toZonedTime(new Date(), timezone)
        const day = now.getDay()
        return day === 0 || day === 6
    } catch {
        return false
    }
}

function getExchangeForCity(timezone: string): string | null {
    return (
        Object.values(MARKET_CONFIG).find(m => m.timezone === timezone)?.id ?? null
    )
}

function isMarketOpen(timezone: string): boolean {
    const exchangeId = getExchangeForCity(timezone)
    if (!exchangeId) return false

    const config = MARKET_CONFIG[exchangeId]
    if (!config) return false

    if (isWeekend(timezone)) return false

    try {
        const now            = toZonedTime(new Date(), timezone)
        const currentMinutes = now.getHours() * 60 + now.getMinutes()
        const openMinutes    = config.openHour  * 60 + config.openMinute
        const closeMinutes   = config.closeHour * 60 + config.closeMinute
        return currentMinutes >= openMinutes && currentMinutes < closeMinutes
    } catch {
        return false
    }
}

export default function ClockBar() {
    const [tick, setTick] = useState(0)

  // Update every second
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <Box
        sx={{
            display:         'flex',
            alignItems:      'center',
            gap:             0,
            overflowX:       'auto',
            backgroundColor: '#161b22',
            borderBottom:    '1px solid #21262d',
            flexShrink:      0,
            '&::-webkit-scrollbar': { display: 'none' },
        }}
        >
            {CLOCK_CITIES.map((city, index) => {
                const time   = formatMarketTime(city.timezone, true)
                const open   = isMarketOpen(city.timezone)
                const isLast = index === CLOCK_CITIES.length - 1

                return (
                    <Box
                    key={city.label}
                    sx={{
                        display:      'flex',
                        alignItems:   'center',
                        gap:          0.75,
                        px:           1.5,
                        py:           0.5,
                        borderRight:  isLast ? 'none' : '1px solid #21262d',
                        flexShrink:   0,
                    }}
                    >
                        {/* City flag and name */}
                        <Typography sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
                            {city.flag}
                        </Typography>
                        <Box>
                            <Typography
                            sx={{
                                fontSize:      '0.55rem',
                                color:         '#4a5568',
                                fontFamily:    'monospace',
                                letterSpacing: 0.5,
                                lineHeight:    1,
                            }}
                            >
                                {city.label}
                            </Typography>
                            <Typography
                            sx={{
                                fontSize:   '0.72rem',
                                color:      '#cdd9e5',
                                fontFamily: 'monospace',
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}
                            >
                                {time}
                            </Typography>
                        </Box>

                        {/* Open/closed dot */}
                        <Box
                        sx={{
                            width:        5,
                            height:       5,
                            borderRadius: '50%',
                            flexShrink:   0,
                            backgroundColor: open ? '#3fb950' : '#f85149',
                            ...(open && {
                                animation: 'clockPulse 2s infinite',
                                '@keyframes clockPulse': {
                                    '0%':   { opacity: 1 },
                                    '50%':  { opacity: 0.3 },
                                    '100%': { opacity: 1 },
                                },
                            }),
                        }}
                        />
                    </Box>
                )
            })}
        </Box>
    )
}