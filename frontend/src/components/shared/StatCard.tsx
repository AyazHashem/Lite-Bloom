import { Box, Typography, Tooltip } from '@mui/material'

interface StatCardProps {
    label:      string
    value:      string | number | null | undefined
    subValue?:  string
    color?:     string
    tooltip?:   string
    compact?:   boolean
}

export default function StatCard({
    label,
    value,
    subValue,
    color,
    tooltip,
    compact = false,
}: StatCardProps) {
    const displayValue = value === null || value === undefined ? '--' : String(value)

    const inner = (
        <Box
        sx={{
            px:              compact ? 1 : 1.5,
            py:              compact ? 0.5 : 0.75,
            backgroundColor: '#161b22',
            border:          '1px solid #21262d',
            borderRadius:    1,
            minWidth:        compact ? 80 : 100,
        }}
        >
            <Typography
            sx={{
                fontSize:      compact ? '0.55rem' : '0.6rem',
                color:         '#4a5568',
                fontFamily:    'monospace',
                letterSpacing: 0.5,
                lineHeight:    1,
                mb:            0.25,
            }}
            >
                {label}
            </Typography>
            <Typography
            sx={{
                fontSize:   compact ? '0.72rem' : '0.82rem',
                color:      color ?? '#cdd9e5',
                fontFamily: 'monospace',
                fontWeight: 600,
                lineHeight: 1,
            }}
            >
                {displayValue}
            </Typography>
            {subValue && (
                <Typography
                sx={{
                    fontSize: '0.58rem',
                    color:    '#7d8590',
                    mt:       0.25,
                }}
                >
                    {subValue}
                </Typography>
            )}
        </Box>
    )

    if (tooltip) {
        return <Tooltip title={tooltip} placement="top">{inner}</Tooltip>
    }

    return inner
}