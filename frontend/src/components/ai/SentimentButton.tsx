'use client'

import { useState } from 'react'
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import SentimentBadge from './SentimentBadge'
import { useSentiment } from '@/hooks/useSentiment'
import { SentimentResult } from '@/types/sentiment'
import { SENTIMENT_COLORS } from '@/lib/constants'

interface SentimentButtonProps {
    symbol:         string
    name:           string
    onShowDetails:  (result: SentimentResult) => void
}

export default function SentimentButton({
    symbol,
    name,
    onShowDetails,
}: SentimentButtonProps) {
    const { result, loading, error, analyze, reset } = useSentiment()

  // Pre-analysis state — single clickable button
    if (!result && !loading) {
        return (
            <Tooltip
            title={error ?? 'AI sentiment analysis — uses recent news headlines'}
            placement="top"
            >
                <Button
                onClick={() => analyze(symbol, name)}
                size="small"
                startIcon={<AutoGraphIcon sx={{ fontSize: 13 }} />}
                sx={{
                    fontSize:        '0.65rem',
                    fontFamily:      'monospace',
                    color:           '#7d8590',
                    borderColor:     '#21262d',
                    border:          '1px solid',
                    py:              0.4,
                    px:              1,
                    minWidth:        0,
                    backgroundColor: 'transparent',
                    '&:hover': {
                        borderColor:     '#1f6feb',
                        color:           '#388bfd',
                        backgroundColor: 'rgba(31,111,235,0.08)',
                    },
                }}
                >
                    ANALYZE
                </Button>
            </Tooltip>
        )
    }

  // Loading state
    if (loading) {
        return (
            <Box
            sx={{
                display:    'flex',
                alignItems: 'center',
                gap:        0.75,
                px:         1,
                py:         0.5,
                border:     '1px solid #21262d',
                borderRadius: 1,
            }}
            >
                <CircularProgress size={12} sx={{ color: '#1f6feb' }} />
                <Box
                sx={{
                    fontSize:   '0.62rem',
                    fontFamily: 'monospace',
                    color:      '#4a5568',
                }}
                component="span"
                >
                    Analyzing...
                </Box>
            </Box>
        )
    }

  // Post-analysis state — badge + action buttons
    if (result) {
        const borderColor = SENTIMENT_COLORS[result.label]

        return (
            <Box
            sx={{
                display:         'flex',
                alignItems:      'center',
                gap:             0.5,
                border:          `1px solid ${borderColor}40`,
                borderRadius:    1,
                backgroundColor: `${borderColor}08`,
                pl:              0.75,
                pr:              0.5,
                py:              0.35,
            }}
            >
                {/* Result badge */}
                <SentimentBadge
                label={result.label}
                score={result.score}
                size="small"
                />

                {/* Retry button */}
                <Tooltip title="Re-analyze">
                    <IconButton
                    size="small"
                    onClick={() => { reset(); analyze(symbol, name) }}
                    sx={{
                        padding: '2px',
                        color:   '#7d8590',
                        '&:hover': { color: '#cdd9e5' },
                    }}
                    >
                        <RefreshIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                </Tooltip>

            {/* Expand details */}
                <Tooltip title="View reasoning">
                    <IconButton
                    size="small"
                    onClick={() => onShowDetails(result)}
                    sx={{
                        padding: '2px',
                        color:   '#7d8590',
                        '&:hover': { color: '#cdd9e5' },
                    }}
                    >
                        <KeyboardArrowDownIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        )
    }

    return null
}