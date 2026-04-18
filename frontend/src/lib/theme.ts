import { createTheme } from "@mui/material"

export const terminalTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#0d1117',
            paper: '#161b22',
        },
        primary: {
            main: '#1f6feb',
            light: '#388bfd',
            dark: '#1158c7',
        },
        success: {
            main: '#3fb950',
        },
        text: {
            primary: '#cdd9e5',
            secondary: '#7d8590',
        },
        divider: '#21262d',
    },
    typography: {
        fontFamily: '"Inter", "JetBrains Mono", monospace',
        fontSize: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                },
            },
        },
    },
})

const colors = {
    background: '#0d1117',
    surface: '#161b22',
    surfaceHigh: '#1c2128',
    border: '#21262d',
    borderHover: '#30363d',
    accent: '#1f6feb',
    accentHover: '#388bfd',
    positive: '#3fb950',
    negative: '#f85149',
    newsText: '#e6edf3',
    mutedText: '#7d8590',
    primaryText: '#cdd9e5',
    openBadge: '#238636',
    closedBadge: '#b62324',
}