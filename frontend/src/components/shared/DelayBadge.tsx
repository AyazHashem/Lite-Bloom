import { Box, Typography, Tooltip } from '@mui/material'
import { getDataFreshness } from '@/types/market'

interface DelayBadgeProps {
    delayMinutes: number
    size?: 'small' | 'medium'
}

export default function DelayBadge({ delayMinutes, size = 'small' }: DelayBadgeProps) {
    const freshness = getDataFreshness(delayMinutes)

    const config = {
        'realtime':      { label: 'LIVE',    color: '#3fb950', bg: 'rgba(63,185,80,0.12)',    border: '#238636', pulse: true,  tip: 'Real-time data' },
        'near-realtime': { label: '~5 MIN',  color: '#d29922', bg: 'rgba(210,153,34,0.12)',   border: '#9e6a03', pulse: false, tip: 'Data delayed up to 5 minutes' },
        'delayed':       { label: '15 MIN',  color: '#f0883e', bg: 'rgba(240,136,62,0.12)',   border: '#bd561d', pulse: false, tip: 'Data delayed 15 minutes — fallback source active' },
        'end-of-day':    { label: 'EOD',     color: '#8b949e', bg: 'rgba(139,148,158,0.12)', border: '#484f58', pulse: false, tip: 'End of day data' },
    }[freshness]

    return (
        <Tooltip title={config.tip} placement="top">
            <Box
            sx={{
                display:         'inline-flex',
                alignItems:      'center',
                gap:             0.5,
                px:              size === 'small' ? 0.75 : 1,
                py:              size === 'small' ? 0.2  : 0.4,
                borderRadius:    0.75,
                backgroundColor: config.bg,
                border:          `1px solid ${config.border}`,
                cursor:          'help',
            }}
            >
                <Box
                sx={{
                    width:           size === 'small' ? 5 : 6,
                    height:          size === 'small' ? 5 : 6,
                    borderRadius:    '50%',
                    backgroundColor: config.color,
                    flexShrink:      0,
                    ...(config.pulse && {
                        animation: 'delayPulse 2s infinite',
                        '@keyframes delayPulse': {
                            '0%':   { opacity: 1,   transform: 'scale(1)' },
                            '50%':  { opacity: 0.4, transform: 'scale(0.8)' },
                            '100%': { opacity: 1,   transform: 'scale(1)' },
                        },
                    }),
                }}
                />
                <Typography
                sx={{
                    fontSize:      size === 'small' ? '0.58rem' : '0.65rem',
                    fontFamily:    'monospace',
                    fontWeight:    700,
                    color:         config.color,
                    letterSpacing: 0.5,
                    lineHeight:    1,
                }}
                >
                    {config.label}
                </Typography>
            </Box>
        </Tooltip>
    )
}