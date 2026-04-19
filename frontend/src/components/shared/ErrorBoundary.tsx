'use client'

import { Component, ReactNode } from 'react'
import { Box, Typography, Button } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'

interface Props {
    children:    ReactNode
    fallback?:   ReactNode
    label?:      string
}

interface State {
    hasError: boolean
    message:  string
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, message: '' }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message }
    }

    componentDidCatch(error: Error) {
        console.error(`ErrorBoundary [${this.props.label ?? 'unknown'}]:`, error)
    }

    render() {
        if (!this.state.hasError) return this.props.children

        if (this.props.fallback) return this.props.fallback

        return (
            <Box
            sx={{
                display:         'flex',
                flexDirection:   'column',
                alignItems:      'center',
                justifyContent:  'center',
                height:          '100%',
                gap:             1.5,
                backgroundColor: '#0d1117',
                border:          '1px solid #21262d',
                borderRadius:    1,
                p:               2,
            }}
            >
                <WarningAmberIcon sx={{ fontSize: 22, color: '#d29922' }} />
                <Typography
                sx={{
                    fontSize:   '0.72rem',
                    color:      '#7d8590',
                    fontFamily: 'monospace',
                    textAlign:  'center',
                }}
                >
                    {this.props.label
                        ? `${this.props.label} failed to load`
                        : 'Something went wrong'
                    }
                </Typography>
                <Button
                size="small"
                startIcon={<RefreshIcon sx={{ fontSize: 13 }} />}
                onClick={() => this.setState({ hasError: false, message: '' })}
                sx={{
                    fontSize:    '0.65rem',
                    fontFamily:  'monospace',
                    color:       '#7d8590',
                    border:      '1px solid #21262d',
                    borderRadius: 0.75,
                    py:          0.35,
                    px:          1,
                    '&:hover':   { color: '#cdd9e5', borderColor: '#30363d' },
                }}
                >
                    Retry
                </Button>
            </Box>
        )
    }
}