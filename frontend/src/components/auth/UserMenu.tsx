'use client'

import { useState } from 'react'
import {
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Avatar,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '@/hooks/useAuth'

export default function UserMenu() {
    const { user, logout }                  = useAuth()
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)

    if (!user) return null

    const email    = user.email ?? 'User'
    const initials = email.slice(0, 2).toUpperCase()

    return (
        <>
            <IconButton
            onClick={e => setAnchor(e.currentTarget)}
            size="small"
            sx={{ p: 0 }}
            >
                <Avatar
                sx={{
                    width:           28,
                    height:          28,
                    fontSize:        '0.65rem',
                    fontFamily:      'monospace',
                    fontWeight:      700,
                    backgroundColor: '#1f6feb',
                    color:           '#ffffff',
                }}
                >
                    {initials}
                </Avatar>
            </IconButton>

            <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
                sx: {
                    backgroundColor: '#161b22',
                    border:          '1px solid #21262d',
                    borderRadius:    1,
                    minWidth:        200,
                    boxShadow:       '0 8px 24px rgba(0,0,0,0.4)',
                    mt:              0.5,
                },
            }}
            >
                {/* User info */}
                <Box sx={{ px: 2, py: 1.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 14, color: '#7d8590' }} />
                        <Typography
                        noWrap
                        sx={{
                            fontSize:   '0.72rem',
                            color:      '#cdd9e5',
                            fontFamily: 'monospace',
                            maxWidth:   150,
                        }}
                        >
                            {email}
                        </Typography>
                    </Box>
                    <Typography
                    sx={{
                        fontSize: '0.6rem',
                        color:    '#4a5568',
                        mt:       0.25,
                    }}
                    >
                        {user.id.slice(0, 8)}...
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: '#21262d' }} />

                <MenuItem
                onClick={async () => {
                    setAnchor(null)
                    await logout()
                }}
                sx={{
                    py:      1,
                    px:      2,
                    gap:     1,
                    '&:hover': { backgroundColor: '#1c2128' },
                }}
                >
                    <LogoutIcon sx={{ fontSize: 14, color: '#f85149' }} />
                    <Typography
                    sx={{
                        fontSize:   '0.75rem',
                        color:      '#f85149',
                        fontFamily: 'monospace',
                    }}
                    >
                        Sign Out
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    )
}