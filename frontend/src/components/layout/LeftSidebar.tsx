'use client'

import { usePathname, useRouter } from "next/navigation"
import {
    Box,
    IconButton,
    Tooltip,
    Typography,
    Divider
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import UserMenu from '@/components/auth/UserMenu'

const NAV_ITEMS = [
    { label: 'Dashboard', icon: DashboardIcon, path: '/' },
    { label: 'Chart Analysis', icon: ShowChartIcon, path: '/charts' },
    { label: 'Indices', icon: BarChartIcon, path: '/indices' },
]

const BOTTOM_ITEMS = [
    { label: 'Settings', icon: SettingsIcon, path: '/settings'}
]

interface LeftSidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export default function LeftSidebar({ isOpen, onToggle}: LeftSidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const sidebarWidth = isOpen ? 200: 56
    const NavItem = ({
        label,
        icon: Icon,
        path,
    }: {
        label: string
        icon: any
        path: string
    }) => {
        const isActive = pathname === path

        return (
            <Tooltip title={!isOpen ? label : ''} placement="right">
                <Box
                onClick={() => router.push(path)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    mx: 0.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#1c2128' : 'transparent',
                    borderLeft: isActive
                        ? '2px solid #1f6feb'
                        : '2px solid transparent',
                    '&:hover': {
                        backgroundColor: '#1c2128',
                    },
                    transition: 'all 0.15s ease',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                }}
                >
                    <Icon
                    sx={{
                        fontSize: 18,
                        color: isActive ? '#388bfd' : '#7d8590',
                        flexShrink: 0
                    }}
                    />
                    {isOpen && (
                        <Typography
                        sx={{
                            fontSize: '0.78rem',
                            color: isActive ? '#cdd9e5' : '#7d8590',
                            fontWeight: isActive ? 600 : 400,
                        }}
                        >
                            {label}
                        </Typography>
                    )}
                </Box>
            </Tooltip>
        )
    }

    return (
        <Box
        sx={{
            width: sidebarWidth,
            flexShrink: 0,
            height: '100vh',
            backgroundColor: '#161b22',
            borderRight: '1px solid #21262d',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.2s ease',
            overflow: 'hidden',
            zIndex: 10,
        }}
        >
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOpen ? 'space-between' : 'center',
                px: isOpen ? 1.5 : 0,
                py: 1.5,
                borderBottom: '1px solid #21262d',
                minHeight: 48,
            }}
            >
                {isOpen && (
                    <Typography
                    sx={{
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#1f6feb',
                        letterSpacing: 1.5,
                    }}
                    >
                        TERMINAL
                    </Typography>
                )}
                <IconButton
                size="small"
                onClick={onToggle}
                sx={{ color: '#7d8590', padding: '4px' }}
                >
                    {isOpen
                    ? <ChevronLeftIcon sx={{ fontSize: 16}} />
                    : <ChevronRightIcon sx={{ fontSize: 16}} />
                    }
                </IconButton>
            </Box>
            <Box sx={{ flex: 1, py: 1 }}>
                {NAV_ITEMS.map(item => (
                    <NavItem key={item.path} {...item} />
                ))}
            </Box>
            <Divider sx={{ borderColor: '#21262d' }}/>
            <Box sx={{ py: 1 }}>
                {BOTTOM_ITEMS.map(item => (
                    <NavItem key={item.path} {...item} />
                ))}
                <Box
                sx={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    px:             isOpen ? 1.5 : 0,
                    py:             1,
                }}
                >
                    <UserMenu />
                    {isOpen && (
                        <Typography
                        sx={{
                            fontSize:   '0.72rem',
                            color:      '#7d8590',
                            ml:         1,
                            fontFamily: 'monospace',
                        }}
                        >
                            Account
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    )
}