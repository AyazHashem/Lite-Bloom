import React, { useState } from "react";
import { Box } from "@mui/material";
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import PinnedStrip from './PinnedStrip'
import { usePinnedItems } from "@/hooks/usePinnedItems";

interface AppShellProps {
    children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
    const [leftOpen, setLeftOpen] = useState(true)
    const [rightOpen, setRightOpen] = useState(false)
    const { items: pinnedItems, position } = usePinnedItems()

    const hasPinned = pinnedItems.length > 0

    return (
        <Box
        sx={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#0d1117',
            overflow: 'hidden'
        }}
        >
            <LeftSidebar
            isOpen={leftOpen}
            onToggle={() => setLeftOpen(prev => !prev)}
            />
            <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                overflow: 'hidden'
            }}
            >
                {hasPinned && position === 'top' && <PinnedStrip />}
                <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                    {children}
                </Box>
                {hasPinned && position === 'bottom' && <PinnedStrip />}
            </Box>
            <RightSidebar
            isOpen={rightOpen}
            onToggle={() => setRightOpen(prev => !prev)}
            />
        </Box>
    )
}