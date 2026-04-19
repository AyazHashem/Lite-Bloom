'use client'

import type { Metadata } from 'next'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { terminalTheme } from '@/lib/theme'
import AppShell from '@/components/layout/AppShell'
import AuthProvider from '@/components/auth/AuthProvider'
import { ToastProvider } from '@/components/shared/ToastNotification'

export const proxy: Metadata = {
    title: 'Terminal',
    description: 'Financial Terminal',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (  
        <html lang="en">
            <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
                <ThemeProvider theme={terminalTheme}>
                    <CssBaseline />
                    <AuthProvider>
                        <ToastProvider>
                            <AppShell>
                                {children}
                            </AppShell>
                        </ToastProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}