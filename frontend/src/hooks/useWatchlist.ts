import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WatchlistItem {
    symbol: string
    name: string
    addedAt: string
}

interface WatchlistStore {
    items: WatchlistItem[]
    addToWatchlist: (symbol: string, name: string) => void
    removeFromWatchlist: (symbol: string) => void
    isInWatchlist: (symbol: string) => boolean
    clearWatchlist: () => void
}

export const useWatchlist = create<WatchlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToWatchlist: (symbol, name) => {
                const existing = get().items.find(i => i.symbol === symbol)
                if(!existing) {
                    set(state => ({
                        items: [...state.items, {
                            symbol,
                            name,
                            addedAt: new Date().toISOString()
                        }]
                    }))
                }
            },
            removeFromWatchlist: (symbol) => {
                set(state => ({
                    items: state.items.filter(i => i.symbol !== symbol)
                }))
            },
            isInWatchlist: (symbol) => {
                return get().items.some(i => i.symbol === symbol)
            },
            clearWatchlist: () => set({ items: [] }),
        }),
        {
            name: 'terminal-watchlist',
        }
    )
)