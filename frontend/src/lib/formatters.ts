import { format, formatDistanceToNow } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

// ─── Number Formatters ────────────────────────────────────────────

export function formatPrice(
    value: number | null | undefined,
    currency: string = 'USD',
    decimals: number = 2
    ): string {
    if (value === null || value === undefined || isNaN(value)) return '--'

    const symbol = CURRENCY_SYMBOLS[currency] ?? ''
    return `${symbol}${value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`
}

export function formatPriceCompact(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '--'
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
    if (value >= 1_000_000)     return `$${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000)         return `$${(value / 1_000).toFixed(2)}K`
    return formatPrice(value)
}

export function formatChange(change: number | null | undefined): string {
    if (change === null || change === undefined || isNaN(change)) return '--'
    const prefix = change >= 0 ? '+' : ''
    return `${prefix}${change.toFixed(2)}`
}

export function formatChangePercent(
    percent: number | null | undefined
    ): string {
    if (percent === null || percent === undefined || isNaN(percent)) return '--'
    const prefix = percent >= 0 ? '+' : ''
    return `${prefix}${percent.toFixed(2)}%`
}

export function formatChangeFull(
    change: number | null | undefined,
    percent: number | null | undefined
    ): string {
    if (
        change === null || change === undefined ||
        percent === null || percent === undefined
    ) return '--'
    return `${formatChange(change)} (${formatChangePercent(percent)})`
}

export function formatVolume(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '--'
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000)     return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000)         return `${(value / 1_000).toFixed(1)}K`
    return value.toFixed(0)
}

export function formatMarketCap(value: number | null | undefined): string {
    if (value === null || value === undefined) return '--'
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`
    if (value >= 1_000_000_000)     return `$${(value / 1_000_000_000).toFixed(2)}B`
    if (value >= 1_000_000)         return `$${(value / 1_000_000).toFixed(2)}M`
    return formatPrice(value)
}

export function formatPE(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '--'
    return value.toFixed(2) + 'x'
}

export function formatYield(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '--'
    return (value * 100).toFixed(2) + '%'
}

// ─── Date / Time Formatters ───────────────────────────────────────

export function formatTimestamp(dateStr: string | null | undefined): string {
    if (!dateStr) return '--:--'
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return '--:--'
        return format(date, 'HH:mm')
    } catch {
        return '--:--'
    }
}

export function formatTimestampFull(dateStr: string | null | undefined): string {
    if (!dateStr) return '--'
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return '--'
        return format(date, 'MMM dd, HH:mm')
    } catch {
        return '--'
    }
}

export function formatTimeAgo(dateStr: string | null | undefined): string {
    if (!dateStr) return '--'
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return '--'
        return formatDistanceToNow(date, { addSuffix: true })
    } catch {
        return '--'
    }
}

export function formatMarketTime(
    timezone: string,
    showSeconds: boolean = false
): string {
    try {
        const now = new Date()
        const zoned = toZonedTime(now, timezone)
        return format(zoned, showSeconds ? 'HH:mm:ss' : 'HH:mm')
    } catch {
        return '--:--'
    }
}

export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '--'
    try {
        return format(new Date(dateStr), 'MMM dd, yyyy')
    } catch {
        return '--'
    }
}

// ─── Currency Symbol Map ──────────────────────────────────────────

export const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    JPY: '¥',
    HKD: 'HK$',
    SGD: 'S$',
    AED: 'د.إ ',
    SAR: '﷼ ',
    CNY: '¥',
    KRW: '₩',
    INR: '₹',
    CHF: 'Fr ',
    CAD: 'CA$',
    AUD: 'A$',
}

// ─── Color Helpers ────────────────────────────────────────────────

export function getChangeColor(value: number | null | undefined): string {
    if (value === null || value === undefined) return '#7d8590'
    if (value > 0) return '#3fb950'
    if (value < 0) return '#f85149'
    return '#7d8590'
}

export function isPositive(value: number | null | undefined): boolean {
    return (value ?? 0) >= 0
}