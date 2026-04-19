'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Link as MuiLink,
} from '@mui/material'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
    const { login }  = useAuth()
    const router     = useRouter()

    const [email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState<string | null>(null)
    const [loading,  setLoading]  = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setError('Please enter your email and password.')
            return
        }

        setLoading(true)
        setError(null)

        const { error: authError } = await login(email, password)

        if (authError) {
            setError(authError)
            setLoading(false)
        } else {
            router.push('/')
        }
    }

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            fontSize:        '0.85rem',
            color:           '#cdd9e5',
            backgroundColor: '#0d1117',
            '& fieldset':               { borderColor: '#21262d' },
            '&:hover fieldset':         { borderColor: '#30363d' },
            '&.Mui-focused fieldset':   { borderColor: '#1f6feb' },
        },
        '& .MuiInputLabel-root': {
            fontSize: '0.82rem',
            color:    '#7d8590',
            '&.Mui-focused': { color: '#388bfd' },
        },
    }

    return (
        <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
            display:        'flex',
            flexDirection:  'column',
            gap:            2,
            width:          '100%',
            maxWidth:       400,
        }}
        >
            <Box sx={{ mb: 1 }}>
                <Typography
                sx={{
                    fontSize:      '1.4rem',
                    fontFamily:    'monospace',
                    fontWeight:    700,
                    color:         '#cdd9e5',
                    letterSpacing: 1,
                }}
                >
                    SIGN IN
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#7d8590', mt: 0.5 }}>
                    Access your financial terminal
                </Typography>
            </Box>

            {error && (
                <Alert
                severity="error"
                sx={{
                    fontSize:        '0.75rem',
                    backgroundColor: 'rgba(248,81,73,0.1)',
                    color:           '#f85149',
                    border:          '1px solid rgba(248,81,73,0.3)',
                    '& .MuiAlert-icon': { color: '#f85149' },
                }}
                >
                    {error}
                </Alert>
            )}

            <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            autoComplete="email"
            autoFocus
            size="small"
            sx={inputSx}
            />

            <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            autoComplete="current-password"
            size="small"
            sx={inputSx}
            />

            <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
                backgroundColor: '#1f6feb',
                color:           '#ffffff',
                fontFamily:      'monospace',
                fontWeight:      700,
                letterSpacing:   0.5,
                py:              1,
                mt:              0.5,
                '&:hover':       { backgroundColor: '#388bfd' },
                '&:disabled':    { backgroundColor: '#21262d', color: '#4a5568' },
            }}
            >
                {loading
                    ? <CircularProgress size={18} sx={{ color: '#7d8590' }} />
                    : 'SIGN IN'
                }
            </Button>

            <Typography
            sx={{
                fontSize:  '0.75rem',
                color:     '#7d8590',
            textAlign: 'center',
            }}
            >
                Don&apos;t have an account?{' '}
                <MuiLink
                component={Link}
                href="/register"
                sx={{
                    color:          '#388bfd',
                    textDecoration: 'none',
                    '&:hover':      { textDecoration: 'underline' },
                }}
                >
                    Create one
                </MuiLink>
            </Typography>
        </Box>
    )
}