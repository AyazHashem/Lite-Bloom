import { Box, Typography } from '@mui/material'
import MarketOverview from '@/components/landing/MarketOverview'
import CommoditiesSection from '@/components/landing/CommoditiesSection'
import ForexSection from '@/components/landing/ForexSection'
import CryptoSection from '@/components/landing/CryptoSection'
import BondsSection from '@/components/landing/BondsSection'
import NewsfeedPanel from '@/components/newsfeed/NewsfeedPanel'

export default function DashboardPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0d1117',
      }}
    >
      {/* Scrollable content area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          pt: 2,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#21262d',
            borderRadius: 2,
          },
        }}
      >
        {/* Page title */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontFamily: 'monospace',
              color: '#4a5568',
              letterSpacing: 1,
            }}
          >
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).toUpperCase()}
          </Typography>
        </Box>

        <MarketOverview />
        <CommoditiesSection />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <ForexSection />
          <CryptoSection />
        </Box>

        <BondsSection />
      </Box>

      {/* Newsfeed at bottom */}
      <Box sx={{ height: 180, flexShrink: 0 }}>
        <NewsfeedPanel />
      </Box>
    </Box>
  )
}