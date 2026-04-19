'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'

interface Toast {
    id:       number
    message:  string
    severity: AlertColor
}

interface ToastContextValue {
    showToast: (message: string, severity?: AlertColor) => void
}

const ToastContext = createContext<ToastContextValue>({
    showToast: () => {},
})

export function useToast() {
    return useContext(ToastContext)
}

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, severity: AlertColor = 'info') => {
        const id = toastId++
        setToasts(prev => [...prev, { id, message, severity }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map((toast, index) => (
                <Snackbar
                key={toast.id}
                open
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                style={{ bottom: 24 + index * 60 }}
                >
                    <Alert
                    severity={toast.severity}
                    variant="filled"
                    sx={{
                        fontSize:        '0.75rem',
                        fontFamily:      'monospace',
                        backgroundColor:
                        toast.severity === 'success' ? '#1a3a2a' :
                        toast.severity === 'error'   ? '#3a1a1a' :
                        toast.severity === 'warning' ? '#3a2a1a' :
                        '#1a2a3a',
                        color:
                        toast.severity === 'success' ? '#3fb950' :
                        toast.severity === 'error'   ? '#f85149' :
                        toast.severity === 'warning' ? '#d29922' :
                        '#388bfd',
                        border: `1px solid ${
                            toast.severity === 'success' ? '#238636' :
                            toast.severity === 'error'   ? '#b62324' :
                            toast.severity === 'warning' ? '#9e6a03' :
                            '#1f6feb'
                        }`,
                        '& .MuiAlert-icon': {
                            color:
                            toast.severity === 'success' ? '#3fb950' :
                            toast.severity === 'error'   ? '#f85149' :
                            toast.severity === 'warning' ? '#d29922' :
                            '#388bfd',
                        },
                    }}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    )
}