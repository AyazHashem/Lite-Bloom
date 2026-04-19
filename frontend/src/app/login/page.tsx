import { Box, Typography } from '@mui/material'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <Box
        sx={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            minHeight:       '100vh',
            backgroundColor: '#0d1117',
            p:               2,
        }}
        >
            <Box
            sx={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                width:         '100%',
                maxWidth:      400,
            }}
            >
                {/* Logo / Brand */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                    sx={{
                        fontSize:      '1.8rem',
                        fontFamily:    'monospace',
                        fontWeight:    700,
                        color:         '#1f6feb',
                        letterSpacing: 4,
                    }}
                    >
                        TERMINAL
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#4a5568', mt: 0.5 }}>
                        Financial Data Platform
                    </Typography>
                </Box>

                {/* Card */}
                <Box
                sx={{
                    width:           '100%',
                    backgroundColor: '#161b22',
                    border:          '1px solid #21262d',
                    borderRadius:    1.5,
                    p:               3,
                }}
                >
                    <LoginForm />
                </Box>
            </Box>
        </Box>
    )
}