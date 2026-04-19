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

export default function RegisterForm() {
    const { register } = useAuth()
    const router       = useRouter()

    const [email,     setEmail]     = useState('')
    const [password,  setPassword]  = useState('')
    const [confirm,   setConfirm]   = useState('')
    const [error,     setError]     = useState<string | null>(null)
    const [success,   setSuccess]   = useState(false)
    const [loading,   setLoading]   = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password || !confirm) {
            setError('Please fill in all fields.')
            return
        }

        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        setLoading(true)
        setError(null)

        const { error: authError } = await register(email, password)

        if (authError) {
            setError(authError)
            setLoading(false)
        } else {
      // Supabase sends a confirmation email by default
      // Show success message and redirect to login
            setSuccess(true)
            setLoading(false)
            setTimeout(() => router.push('/login'), 3000)
        }
    }

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            fontSize:        '0.85rem',
            color:           '#cdd9e5',
            backgroundColor: '#0d1117',
            '& fieldset':             { borderColor: '#21262d' },
            '&:hover fieldset':       { borderColor: '#30363d' },
            '&.Mui-focused fieldset': { borderColor: '#1f6feb' },
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
            display:       'flex',
            flexDirection: 'column',
            gap:           2,
            width:         '100%',
            maxWidth:      400,
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
                    CREATE ACCOUNT
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#7d8590', mt: 0.5 }}>
                    Get access to your financial terminal
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

            {success && (
                <Alert
                severity="success"
                sx={{
                    fontSize:        '0.75rem',
                    backgroundColor: 'rgba(63,185,80,0.1)',
                    color:           '#3fb950',
                    border:          '1px solid rgba(63,185,80,0.3)',
                    '& .MuiAlert-icon': { color: '#3fb950' },
                }}
                >
                    Account created. Check your email to confirm, then sign in.
                    Redirecting to login...
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
            autoComplete="new-password"
            size="small"
            helperText="Minimum 8 characters"
            FormHelperTextProps={{
                sx: { fontSize: '0.65rem', color: '#4a5568' }
            }}
            sx={inputSx}
            />

            <TextField
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            fullWidth
            autoComplete="new-password"
            size="small"
            sx={inputSx}
            />

            <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || success}
            sx={{
                backgroundColor: '#1f6feb',
                color:           '#ffffff',
                fontFamily:      'monospace',
                fontWeight:      700,
                letterSpacing:   0.5,
                py:              1,
                mt:              0.5,
                '&:hover':    { backgroundColor: '#388bfd' },
                '&:disabled': { backgroundColor: '#21262d', color: '#4a5568' },
            }}
            >
                {loading
                    ? <CircularProgress size={18} sx={{ color: '#7d8590' }} />
                    : 'CREATE ACCOUNT'
                }
            </Button>

            <Typography
            sx={{
                fontSize:  '0.75rem',
                color:     '#7d8590',
                textAlign: 'center',
            }}
            >
                Already have an account?{' '}
                <MuiLink
                component={Link}
                href="/login"
                sx={{
                    color:          '#388bfd',
                    textDecoration: 'none',
                    '&:hover':      { textDecoration: 'underline' },
                }}
                >
                    Sign in
                </MuiLink>
            </Typography>
        </Box>
    )
}