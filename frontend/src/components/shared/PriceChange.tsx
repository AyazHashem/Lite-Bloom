import { Typography } from "@mui/material";

interface PriceChangeProps {
    change: number
    changePercent: number
    showBoth?: boolean
    size?: 'small' | 'medium'
}

export default function PriceChange({
    change,
    changePercent,
    showBoth = true,
    size = 'small',
}: PriceChangeProps) {
    const isPositive = change >= 0
    const color = isPositive ? '#3fb950' : '#f85249'
    const prefix = isPositive ? '+' : ''
    const fontSize = size === 'small' ? '0.7rem' : '0.85rem'

    return (
        <Typography
        component="span"
        sx={{
            color,
            fontFamily: 'monospace',
            fontSize,
            fontWeight: 500,
            whiteSpace: 'nowrap',
        }}
        >
            {showBoth
            ? `${prefix}${change.toFixed(2)} (${prefix}${changePercent.toFixed(2)}%)`
            : `${prefix}${changePercent.toFixed(2)}%`
            }
        </Typography>
    )
}