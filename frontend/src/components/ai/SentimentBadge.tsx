import { Box, Typography } from '@mui/material'
import { SENTIMENT_COLORS } from '@/lib/constants'

interface SentimentBadgeProps {
    label:   'BUY' | 'SELL' | 'HOLD'
    score?:  number
    size?:   'small' | 'medium' | 'large'
}

const CONFIG = {
    BUY: {
        color:  SENTIMENT_COLORS.BUY,
        bg:     'rgba(63, 185, 80, 0.15)',
        border: 'rgba(63, 185, 80, 0.4)',
    },
    SELL: {
        color:  SENTIMENT_COLORS.SELL,
        bg:     'rgba(248, 81, 73, 0.15)',
        border: 'rgba(248, 81, 73, 0.4)',
    },
    HOLD: {
        color:  SENTIMENT_COLORS.HOLD,
        bg:     'rgba(210, 153, 34, 0.15)',
        border: 'rgba(210, 153, 34, 0.4)',
    },
}

const SIZES = {
    small:  { px: 1,   py: 0.3,  fontSize: '0.65rem', scoreFontSize: '0.58rem' },
    medium: { px: 1.5, py: 0.5,  fontSize: '0.82rem', scoreFontSize: '0.68rem' },
    large:  { px: 2,   py: 0.75, fontSize: '1.1rem',  scoreFontSize: '0.78rem' },
}

export default function SentimentBadge({
    label,
    score,
    size = 'medium',
}: SentimentBadgeProps) {
    const config = CONFIG[label]
    const sizing = SIZES[size]

    return (
        <Box
        sx={{
            display:         'inline-flex',
            flexDirection:   'column',
            alignItems:      'center',
            px:              sizing.px,
            py:              sizing.py,
            borderRadius:    1,
            backgroundColor: config.bg,
            border:          `1px solid ${config.border}`,
            minWidth:        80,
        }}
        >
            <Typography
            sx={{
                fontSize:      sizing.fontSize,
            fontFamily:    'monospace',
            fontWeight:    700,
            color:         config.color,
            letterSpacing: 2,
            lineHeight:    1,
            }}
            >
                {label}
            </Typography>

            {score !== undefined && (
                <Typography
                sx={{
                    fontSize:   sizing.scoreFontSize,
                    fontFamily: 'monospace',
                    color:      config.color,
                    opacity:    0.75,
                    mt:         0.25,
                    lineHeight: 1,
                }}
                >
                    {(score * 100).toFixed(1)}%
                </Typography>
            )}
        </Box>
    )
}