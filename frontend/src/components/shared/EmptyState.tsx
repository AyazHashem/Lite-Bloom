import { Box, Typography } from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'
import ShowChartIcon from '@mui/icons-material/ShowChart'

interface EmptyStateProps {
    icon?:     SvgIconComponent
    title:     string
    subtitle?: string
}

export default function EmptyState({
    icon: Icon = ShowChartIcon,
    title,
    subtitle,
}: EmptyStateProps) {
    return (
        <Box
        sx={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            height:         '100%',
            gap:            1,
            p:              3,
        }}
        >
            <Icon sx={{ fontSize: 28, color: '#21262d' }} />
            <Typography
            sx={{
                fontSize:   '0.75rem',
                fontFamily: 'monospace',
                color:      '#4a5568',
                textAlign:  'center',
            }}
            >
                {title}
            </Typography>
            {subtitle && (
                <Typography
                sx={{
                    fontSize:  '0.65rem',
                    color:     '#21262d',
                    textAlign: 'center',
                }}
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    )
}