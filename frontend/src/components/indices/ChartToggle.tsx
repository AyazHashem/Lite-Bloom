import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'

interface ChartToggleProps {
    mode: 'candlestick' | 'line'
    onChange: (mode: 'candlestick' | 'line') => void
}

export default function ChartToggle({ mode, onChange }: ChartToggleProps) {
    return (
        <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, val) => val && onChange(val)}
        size="small"
        >
            <ToggleButton
            value="candlestick"
            sx={{
                fontSize: '0.6rem',
                py: 0.25,
                px: 0.75,
                color: '#7d8590',
                border: '1px solid #21262d',
                '&.Mui-selected': {
                    color: '#388bfd',
                    backgroundColor: '#1c2128',
                },
            }}
            >
                <CandlestickChartIcon sx={{ fontSize: 14, mr: 0.5 }} />
                Candles
            </ToggleButton>
            <ToggleButton
            value="line"
            sx={{
                fontSize: '0.6rem',
                py: 0.25,
                px: 0.75,
                color: '#7d8590',
                border: '1px solid #21262d',
                '&.Mui-selected': {
                    color: '#388bfd',
                    backgroundColor: '#1c2128',
                },
            }}
            >
                <ShowChartIcon sx={{ fontSize: 14, mr: 0.5 }} />
                Line
            </ToggleButton>
        </ToggleButtonGroup>
    )
}