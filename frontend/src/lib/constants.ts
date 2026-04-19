// ─── Market Hours Configuration ──────────────────────────────────

export interface MarketConfig {
    id:           string
    name:         string
    fullName:     string
    timezone:     string
    openHour:     number
    openMinute:   number
    closeHour:    number
    closeMinute:  number
    currency:     string
    region:       string
    flag:         string
}

export const MARKET_CONFIG: Record<string, MarketConfig> = {
    NYSE: {
        id:          'NYSE',
        name:        'NYSE',
        fullName:    'New York Stock Exchange',
        timezone:    'America/New_York',
        openHour:    9,
        openMinute:  30,
        closeHour:   16,
        closeMinute: 0,
        currency:    'USD',
        region:      'United States',
        flag:        '🇺🇸',
    },
    NASDAQ: {
        id:          'NASDAQ',
        name:        'NASDAQ',
        fullName:    'NASDAQ Stock Market',
        timezone:    'America/New_York',
        openHour:    9,
        openMinute:  30,
        closeHour:   16,
        closeMinute: 0,
        currency:    'USD',
        region:      'United States',
        flag:        '🇺🇸',
    },
    LSE: {
        id:          'LSE',
        name:        'LSE',
        fullName:    'London Stock Exchange',
        timezone:    'Europe/London',
        openHour:    8,
        openMinute:  0,
        closeHour:   16,
        closeMinute: 30,
        currency:    'GBP',
        region:      'United Kingdom',
        flag:        '🇬🇧',
    },
    XETRA: {
        id:          'XETRA',
        name:        'XETRA',
        fullName:    'Deutsche Börse XETRA',
        timezone:    'Europe/Berlin',
        openHour:    9,
        openMinute:  0,
        closeHour:   17,
        closeMinute: 30,
        currency:    'EUR',
        region:      'Germany',
        flag:        '🇩🇪',
    },
    EURONEXT: {
        id:          'EURONEXT',
        name:        'Euronext',
        fullName:    'Euronext Paris',
        timezone:    'Europe/Paris',
        openHour:    9,
        openMinute:  0,
        closeHour:   17,
        closeMinute: 30,
        currency:    'EUR',
        region:      'France',
        flag:        '🇫🇷',
    },
    TSE: {
        id:          'TSE',
        name:        'TSE',
        fullName:    'Tokyo Stock Exchange',
        timezone:    'Asia/Tokyo',
        openHour:    9,
        openMinute:  0,
        closeHour:   15,
        closeMinute: 30,
        currency:    'JPY',
        region:      'Japan',
        flag:        '🇯🇵',
    },
    HKEX: {
        id:          'HKEX',
        name:        'HKEX',
        fullName:    'Hong Kong Stock Exchange',
        timezone:    'Asia/Hong_Kong',
        openHour:    9,
        openMinute:  30,
        closeHour:   16,
        closeMinute: 0,
        currency:    'HKD',
        region:      'Hong Kong',
        flag:        '🇭🇰',
    },
    SGX: {
        id:          'SGX',
        name:        'SGX',
        fullName:    'Singapore Exchange',
        timezone:    'Asia/Singapore',
        openHour:    9,
        openMinute:  0,
        closeHour:   17,
        closeMinute: 0,
        currency:    'SGD',
        region:      'Singapore',
        flag:        '🇸🇬',
    },
    TADAWUL: {
        id:          'TADAWUL',
        name:        'Tadawul',
        fullName:    'Saudi Exchange (Tadawul)',
        timezone:    'Asia/Riyadh',
        openHour:    10,
        openMinute:  0,
        closeHour:   15,
        closeMinute: 0,
        currency:    'SAR',
        region:      'Saudi Arabia',
        flag:        '🇸🇦',
    },
    ADX: {
        id:          'ADX',
        name:        'ADX',
        fullName:    'Abu Dhabi Securities Exchange',
        timezone:    'Asia/Dubai',
        openHour:    10,
        openMinute:  0,
        closeHour:   14,
        closeMinute: 0,
        currency:    'AED',
        region:      'Abu Dhabi',
        flag:        '🇦🇪',
    },
    DFM: {
        id:          'DFM',
        name:        'DFM',
        fullName:    'Dubai Financial Market',
        timezone:    'Asia/Dubai',
        openHour:    10,
        openMinute:  0,
        closeHour:   14,
        closeMinute: 0,
        currency:    'AED',
        region:      'Dubai',
        flag:        '🇦🇪',
    },
}

// ─── Clock Bar Cities ─────────────────────────────────────────────
// Shown in the top clock bar across the terminal

export interface ClockCity {
    label:    string
    timezone: string
    flag:     string
}

export const CLOCK_CITIES: ClockCity[] = [
    { label: 'NEW YORK',   timezone: 'America/New_York',    flag: '🇺🇸' },
    { label: 'LONDON',     timezone: 'Europe/London',       flag: '🇬🇧' },
    { label: 'FRANKFURT',  timezone: 'Europe/Berlin',       flag: '🇩🇪' },
    { label: 'DUBAI',      timezone: 'Asia/Dubai',          flag: '🇦🇪' },
    { label: 'RIYADH',     timezone: 'Asia/Riyadh',         flag: '🇸🇦' },
    { label: 'SINGAPORE',  timezone: 'Asia/Singapore',      flag: '🇸🇬' },
    { label: 'HONG KONG',  timezone: 'Asia/Hong_Kong',      flag: '🇭🇰' },
    { label: 'TOKYO',      timezone: 'Asia/Tokyo',          flag: '🇯🇵' },
]

// ─── Timeframe Options ────────────────────────────────────────────

export interface TimeframeOption {
    label:    string
    period:   string
    interval: string
}

export const TIMEFRAMES: TimeframeOption[] = [
    { label: '1D',  period: '1d',  interval: '5m'  },
    { label: '5D',  period: '5d',  interval: '30m' },
    { label: '1M',  period: '1mo', interval: '1d'  },
    { label: '3M',  period: '3mo', interval: '1d'  },
    { label: '6M',  period: '6mo', interval: '1wk' },
    { label: '1Y',  period: '1y',  interval: '1wk' },
    { label: '5Y',  period: '5y',  interval: '1mo' },
]

// ─── Asset Class Labels ───────────────────────────────────────────

export const ASSET_CLASS_LABELS: Record<string, string> = {
    stocks:      'Equities',
    forex:       'Foreign Exchange',
    crypto:      'Cryptocurrency',
    commodities: 'Commodities',
    bonds:       'Fixed Income',
}

// ─── Delay Display Labels ─────────────────────────────────────────

export const DELAY_LABELS: Record<number, string> = {
    0:    'Real-time',
    2:    '~2 min delay',
    5:    '~5 min delay',
    15:   '15 min delay',
    1440: 'End of day',
}

export function getDelayLabel(minutes: number): string {
    if (minutes === 0)    return 'Real-time'
    if (minutes <= 2)     return '~2 min delay'
    if (minutes <= 5)     return '~5 min delay'
    if (minutes <= 15)    return '15 min delay'
    if (minutes <= 60)    return `${minutes} min delay`
    return 'End of day'
}

// ─── Sentiment Colors ─────────────────────────────────────────────

export const SENTIMENT_COLORS = {
    BUY:  '#3fb950',
    SELL: '#f85149',
    HOLD: '#d29922',
} as const

// ─── API Configuration ────────────────────────────────────────────

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

// ─── Chart Defaults ───────────────────────────────────────────────

export const MAX_CHARTS = 4

export const DEFAULT_CHART_SYMBOL  = 'AAPL'
export const DEFAULT_CHART_PERIOD  = '1mo'
export const DEFAULT_CHART_INTERVAL = '1d'