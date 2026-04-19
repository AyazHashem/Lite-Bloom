import { Box, Skeleton } from '@mui/material'

const skeletonSx = {
    backgroundColor: '#1c2128',
    '&::after': {
        background: 'linear-gradient(90deg, transparent, rgba(48,54,61,0.4), transparent)',
    },
}

export function ChartSkeleton() {
    return (
        <Box
        sx={{
            display:         'flex',
            flexDirection:   'column',
            height:          '100%',
            backgroundColor: '#0d1117',
            border:          '1px solid #21262d',
            borderRadius:    1,
            overflow:        'hidden',
            p:               1.5,
            gap:             1,
        }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Skeleton variant="text" width={80} height={16} sx={skeletonSx} />
                    <Skeleton variant="text" width={120} height={12} sx={skeletonSx} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                    <Skeleton variant="text" width={70} height={18} sx={skeletonSx} />
                    <Skeleton variant="text" width={90} height={12} sx={skeletonSx} />
                </Box>
            </Box>

            {/* Toolbar */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[40, 40, 40, 40, 40].map((w, i) => (
                    <Skeleton key={i} variant="rounded" width={w} height={22} sx={skeletonSx} />
                ))}
            </Box>

            {/* Chart area */}
            <Skeleton
            variant="rounded"
            width="100%"
            sx={{ flex: 1, minHeight: 120, ...skeletonSx }}
            />

            {/* Footer stats */}
            <Box sx={{ display: 'flex', gap: 0.75 }}>
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} variant="rounded" width={80} height={40} sx={skeletonSx} />
                ))}
            </Box>
        </Box>
    )
}

export function NewsItemSkeleton() {
    return (
        <Box
        sx={{
            display:      'flex',
            alignItems:   'flex-start',
            gap:          1.25,
            py:           0.65,
            px:           1.5,
            borderBottom: '1px solid #161b22',
        }}
        >
            <Skeleton variant="text" width={32} height={14} sx={skeletonSx} />
            <Skeleton variant="text" width={60} height={14} sx={skeletonSx} />
            <Skeleton variant="text" width="60%" height={14} sx={skeletonSx} />
        </Box>
    )
}

export function NewsfeedSkeleton() {
    return (
        <Box>
            {Array.from({ length: 8 }).map((_, i) => (
                <NewsItemSkeleton key={i} />
            ))}
        </Box>
    )
}

export function StockRowSkeleton() {
    return (
        <Box
        sx={{
            display:             'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1fr 80px 30px',
            alignItems:          'center',
            px:                  2,
            py:                  0.75,
            borderBottom:        '1px solid #21262d',
            gap:                 1,
        }}
        >
            {[150, 80, 100, 60, 60, 60, 80, 80, 20].map((w, i) => (
                <Skeleton key={i} variant="text" width={w} height={14} sx={skeletonSx} />
            ))}
        </Box>
    )
}

export function ExchangeCardSkeleton() {
    return (
        <Box
        sx={{
            flex:            1,
            p:               1.5,
            backgroundColor: '#161b22',
            border:          '1px solid #21262d',
            borderRadius:    1,
        }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                    <Skeleton variant="text" width={60}  height={18} sx={skeletonSx} />
                    <Skeleton variant="text" width={100} height={12} sx={skeletonSx} />
                </Box>
                <Skeleton variant="rounded" width={50} height={18} sx={skeletonSx} />
            </Box>
            <Skeleton variant="text"    width={80}   height={12} sx={skeletonSx} />
            <Skeleton variant="text"    width={100}  height={28} sx={skeletonSx} />
            <Skeleton variant="text"    width={120}  height={14} sx={skeletonSx} />
            <Skeleton variant="rounded" width="100%" height={32} sx={{ ...skeletonSx, mt: 1 }} />
        </Box>
    )
}

export function StatCardSkeleton() {
    return (
        <Skeleton
        variant="rounded"
        width={100}
        height={40}
        sx={skeletonSx}
        />
    )
}