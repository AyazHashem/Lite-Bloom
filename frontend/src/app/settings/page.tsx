import { Box, Typography } from '@mui/material'

export default function SettingsPage() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography
            sx={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#7d8590',
                letterSpacing: 1,
            }}
            >
                SETTINGS
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#4a5568', mt: 1 }}>
                Coming soon.
            </Typography>
        </Box>
    )
}