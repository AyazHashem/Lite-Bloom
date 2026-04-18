import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PinnedPosition = 'top' | 'bottom' | 'side'
type PinnedDisplayMode = 'sparkline' | 'stats'

interface PinnedItem {
    symbol: string
    name: string
}

interface PinnedStore {
    items: PinnedItem[]
    position: PinnedPosition
    displayMode: PinnedDisplayMode
    pinItem: (symbol: string, name: string) => void
    unpinItem: (symbol: string) => void
    isPinned: (symbol: string) => boolean
    setPosition: (position: PinnedPosition) => void
    setDisplayMode: (mode: PinnedDisplayMode) => void
}

export const usePinnedItems = create<PinnedStore>()(
    persist(
        (set, get) => ({
            items: [],
            position: 'top',
            displayMode: 'stats',
            pinItem: (symbol, name) => {
                if(!get().isPinned(symbol)) {
                    set(state => ({
                        items: [...state.items, { symbol, name}]
                    }))
                }
            },
            unpinItem: (symbol) => {
                set(state => ({
                    items: state.items.filter(i => i.symbol !== symbol)
                }))
            },
            isPinned: (symbol) => {
                return get().items.some(i => i,symbol === symbol)
            },
            setPosition: (position) => set({ position }),
            setDisplayMode: (displayMode) => set({ displayMode }),
        }),
        { name: 'terminal-pinned' }
    )
)