'use client'

import { useState } from 'react'
import { Box, Typography, Tab, Tabs } from '@mui/material'
import Sparkline from '@/components/shared/SparkLine'
import PriceChange from '@/components/shared/PriceChange'
import MarketBadge from '@/components/shared/MarketBadge'
import WatchlistButton from '@/components/shared/WatchlistButton'
import ExchangeTab from './ExchangeTab'

interface ExchangeCardProps {
    exchangeData: any
    isActive: boolean
    onClick: () => void
}

export default function ExchangeCard({
    exchangeData,
    isActive,
    onClick
}: ExchangeCardProps) {
    const { exchange, composite, is_open } = exchangeData
    const isPositive = composite.change_percent >= 0

    return (
        <Box
        sx={{
            border: `1px solid ${isActive ? '#1f6feb' : '#21262d'}`,
            borderRadius: 1,
            backgroundColor: isActive ? '#1c2128' : '#161b22',
            overflow: 'hidden',
            transition: 'all 0.15s ease',
            cursor: 'pointer',
            flex: 1,
            minWidth: 0,
        }}
        >
      {/* Header */}
            <Box
            onClick={onClick}
            sx={{
                p: 1.5,
                borderBottom: isActive ? '1px solid #21262d' : 'none',
            }}
            >
        {/* Exchange name + badge */}
                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 0.75,
                }}
                >
                    <Box>
                        <Typography
                        sx={{
                            fontSize: '0.85rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#cdd9e5',
                        }}
                        >
                            {exchange.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.62rem', color: '#7d8590' }}>
                            {exchange.region}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.25 }}>
                        <MarketBadge isOpen={is_open} />
                        <WatchlistButton
                        symbol={composite.symbol}
                        name={composite.name}
                        />
                    </Box>
                </Box>

        {/* Composite name */}
                <Typography
                sx={{
                    fontSize: '0.65rem',
                    color: '#7d8590',
                    mb: 0.25,
                }}
                >
                    {exchange.compositeName}
                </Typography>

        {/* Price */}
                <Typography
                sx={{
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#cdd9e5',
                    mb: 0.25,
                }}
                >
                    {composite.price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    })}
                </Typography>

        {/* Change */}
                <PriceChange
                change={composite.change}
                changePercent={composite.change_percent}
                />

        {/* Sparkline */}
                {composite.sparkline?.length > 1 && (
                    <Box sx={{ mt: 1 }}>
                        <Sparkline
                        data={composite.sparkline}
                        width="100%"
                        height={32}
                        positive={isPositive}
                        />
                    </Box>
                )}

        {/* Stats row */}
                <Box
                sx={{
                    display: 'flex',
                    gap: 1.5,
                    mt: 0.75,
                }}
                >
                    {[
                        { label: 'VOL', value: composite.volume
                        ? `${(composite.volume / 1_000_000).toFixed(1)}M`
                        : '--'
                        },
                        { label: 'CCY', value: exchange.currency },
                    ].map(stat => (
                        <Box key={stat.label}>
                            <Typography
                            sx={{
                                fontSize: '0.55rem',
                                color: '#4a5568',
                                fontFamily: 'monospace',
                            }}
                            >
                                {stat.label}
                            </Typography>
                            <Typography
                            sx={{
                                fontSize: '0.65rem',
                                color: '#7d8590',
                                fontFamily: 'monospace',
                            }}
                            >
                                {stat.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

      {/* Expanded stocks table */}
            {isActive && (
                <ExchangeTab
                exchangeId={exchange.id}
                isOpen={is_open}
                currency={exchange.currency}
                />
            )}
        </Box>
    )
}