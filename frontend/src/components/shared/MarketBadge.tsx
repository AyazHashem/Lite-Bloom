import { Box, Typography, Tooltip } from '@mui/material'
import { getDataFreshness } from '@/types/market'

interface MarketBadgeProps {
    isOpen: boolean
    delayMinutes?: number
    size?: 'small' | 'medium'
    showDelay?: boolean   // whether to show the delay badge alongside open/closed
}

// Delay badge config
const DELAY_CONFIG = {
    'realtime': {
        label:    'LIVE',
        color:    '#3fb950',
        bg:       'rgba(63, 185, 80, 0.12)',
        border:   '#238636',
        pulse:    true,
        tooltip:  'Real-time data'
    },
    'near-realtime': {
        label:    '~5 MIN',
        color:    '#d29922',
        bg:       'rgba(210, 153, 34, 0.12)',
        border:   '#9e6a03',
        pulse:    false,
        tooltip:  'Data delayed up to 5 minutes'
    },
    'delayed': {
        label:    '15 MIN',
        color:    '#f0883e',
        bg:       'rgba(240, 136, 62, 0.12)',
        border:   '#bd561d',
        pulse:    false,
        tooltip:  'Data delayed 15 minutes — using fallback data source'
    },
    'end-of-day': {
        label:    'EOD',
        color:    '#8b949e',
        bg:       'rgba(139, 148, 158, 0.12)',
        border:   '#484f58',
        pulse:    false,
        tooltip:  'End of day data — updates once daily'
    },
}

const STATUS_CONFIG = {
    open: {
        label:  'OPEN',
        color:  '#3fb950',
        bg:     'rgba(35, 134, 54, 0.15)',
        border: '#238636',
        pulse:  true,
    },
    closed: {
        label:  'CLOSED',
        color:  '#f85149',
        bg:     'rgba(182, 35, 36, 0.15)',
        border: '#b62324',
        pulse:  false,
    },
}

function Badge({
    label,
    color,
    bg,
    border,
    pulse,
    size,
    tooltip,
}: {
    label: string
    color: string
    bg: string
    border: string
    pulse: boolean
    size: 'small' | 'medium'
    tooltip?: string
}) {
        const inner = (
            <Box
            sx={{
                display:         'inline-flex',
                alignItems:      'center',
                gap:             0.5,
                px:              size === 'small' ? 0.75 : 1,
                py:              size === 'small' ? 0.2  : 0.4,
                borderRadius:    0.75,
                backgroundColor: bg,
                border:          `1px solid ${border}`,
                cursor:          tooltip ? 'help' : 'default',
            }}
            >
                <Box
                sx={{
                    width:           size === 'small' ? 5 : 6,
                    height:          size === 'small' ? 5 : 6,
                    borderRadius:    '50%',
                    backgroundColor: color,
                    flexShrink:      0,
                    ...(pulse && {
                            animation: 'badgePulse 2s infinite',
                            '@keyframes badgePulse': {
                                '0%':   { opacity: 1,   transform: 'scale(1)' },
                                '50%':  { opacity: 0.4, transform: 'scale(0.8)' },
                                '100%': { opacity: 1,   transform: 'scale(1)' },
                            },
                    }),
                }}
                />
                <Typography
                sx={{
                    fontSize:    size === 'small' ? '0.58rem' : '0.65rem',
                    fontFamily:  'monospace',
                    fontWeight:  700,
                    color:       color,
                    letterSpacing: 0.5,
                    lineHeight:  1,
                }}
                >
                    {label}
                </Typography>
            </Box>
        )

    if (tooltip) {
        return <Tooltip title={tooltip} placement="top">{inner}</Tooltip>
    }
    return inner
}

export default function MarketBadge({
    isOpen,
    delayMinutes,
    size = 'small',
    showDelay = true,
}: MarketBadgeProps) {
    const statusConfig = isOpen ? STATUS_CONFIG.open : STATUS_CONFIG.closed

    const hasDelay = delayMinutes !== undefined
    const freshness = hasDelay ? getDataFreshness(delayMinutes!) : null
    const delayConfig = freshness ? DELAY_CONFIG[freshness] : null

    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            {/* Open / Closed badge */}
            <Badge
            label={statusConfig.label}
            color={statusConfig.color}
            bg={statusConfig.bg}
            border={statusConfig.border}
            pulse={statusConfig.pulse}
            size={size}
            />

      {/* Data freshness badge — only shown when delay info is available */}
            {showDelay && delayConfig && (
                <Badge
                label={delayConfig.label}
                color={delayConfig.color}
                bg={delayConfig.bg}
                border={delayConfig.border}
                pulse={delayConfig.pulse}
                size={size}
                tooltip={delayConfig.tooltip}
            />
            )}
        </Box>
    )
}