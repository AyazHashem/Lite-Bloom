import { useState, useEffect } from 'react'
import { MARKET_CONFIG } from '@/lib/constants'
import { toZonedTime } from 'date-fns-tz'

interface MarketStatus {
  isOpen:    boolean
  localTime: string
  openTime:  string
  closeTime: string
  timezone:  string
  nextEvent: string
}

function checkIsOpen(exchange: string): boolean {
  const config = MARKET_CONFIG[exchange]
  if (!config) return false

  const now = toZonedTime(new Date(), config.timezone)
  const day = now.getDay() // 0=Sun, 1=Mon ... 6=Sat

  // Middle Eastern exchanges trade Sun-Thu
  const isMiddleEast = ['TADAWUL', 'ADX', 'DFM'].includes(exchange)
  if (isMiddleEast) {
    if (day === 5 || day === 6) return false // Fri/Sat closed
  } else {
    if (day === 0 || day === 6) return false // Sat/Sun closed
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes    = config.openHour  * 60 + config.openMinute
  const closeMinutes   = config.closeHour * 60 + config.closeMinute

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function getNextEvent(exchange: string): string {
  const config = MARKET_CONFIG[exchange]
  if (!config) return ''

  const now            = toZonedTime(new Date(), config.timezone)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes    = config.openHour  * 60 + config.openMinute
  const closeMinutes   = config.closeHour * 60 + config.closeMinute
  const isOpen         = checkIsOpen(exchange)

  if (isOpen) {
    return `Closes in ${formatMinutes(closeMinutes - currentMinutes)}`
  }

  if (currentMinutes < openMinutes) {
    return `Opens in ${formatMinutes(openMinutes - currentMinutes)}`
  }

  // After close — opens next trading day
  const minsUntilOpen = (24 * 60 - currentMinutes) + openMinutes
  return `Opens in ${formatMinutes(minsUntilOpen)}`
}

function buildStatus(exchange: string): MarketStatus {
  const config = MARKET_CONFIG[exchange]

  if (!config) {
    return {
      isOpen:    false,
      localTime: '--:--',
      openTime:  '--:--',
      closeTime: '--:--',
      timezone:  '',
      nextEvent: '',
    }
  }

  const now    = toZonedTime(new Date(), config.timezone)
  const pad    = (n: number) => String(n).padStart(2, '0')

  return {
    isOpen:    checkIsOpen(exchange),
    localTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    openTime:  `${pad(config.openHour)}:${pad(config.openMinute)}`,
    closeTime: `${pad(config.closeHour)}:${pad(config.closeMinute)}`,
    timezone:  config.timezone,
    nextEvent: getNextEvent(exchange),
  }
}

export function useMarketStatus(exchange: string): MarketStatus {
  const [status, setStatus] = useState<MarketStatus>(() => buildStatus(exchange))

  useEffect(() => {
    // Recalculate immediately when exchange changes
    setStatus(buildStatus(exchange))

    // Then update every 30 seconds
    const timer = setInterval(() => {
      setStatus(buildStatus(exchange))
    }, 30_000)

    return () => clearInterval(timer)
  }, [exchange])

  return status
}