'use client'

import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Divider,
    Link,
    LinearProgress,
    Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SentimentBadge from './SentimentBadge'
import { SentimentResult, HeadlineScore } from '@/types/sentiment'
import { SENTIMENT_COLORS } from '@/lib/constants'

interface SentimentModalProps {
    open:     boolean
    result:   SentimentResult | null
    onClose:  () => void
}

function HeadlineRow({ headline }: { headline: HeadlineScore }) {
    const dominantColor =
        headline.label === 'positive' ? SENTIMENT_COLORS.BUY  :
        headline.label === 'negative' ? SENTIMENT_COLORS.SELL :
        SENTIMENT_COLORS.HOLD

    return (
        <Box
        sx={{
            py:           1,
            borderBottom: '1px solid #21262d',
            '&:last-child': { borderBottom: 'none' },
        }}
        >
            {/* Headline text */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
                <Box
                sx={{
                    width:           3,
                    borderRadius:    1,
                    flexShrink:      0,
                    alignSelf:       'stretch',
                    minHeight:       16,
                    backgroundColor: dominantColor,
                }}
                />
                <Link
                href={headline.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                    fontSize:   '0.72rem',
                    color:      '#cdd9e5',
                    flex:       1,
                    lineHeight: 1.4,
                    '&:hover':  { color: '#e6edf3' },
                }}
                >
                    {headline.headline}
                </Link>
                <OpenInNewIcon sx={{ fontSize: 11, color: '#4a5568', flexShrink: 0, mt: 0.2 }} />
            </Box>

            {/* Source + sentiment bars */}
            <Box sx={{ pl: 1.5, display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                <Typography sx={{ fontSize: '0.6rem', color: '#4a5568', mb: 0.25 }}>
                    {headline.source}
                </Typography>

                {[
                    { label: 'POS', value: headline.positive, color: SENTIMENT_COLORS.BUY  },
                    { label: 'NEG', value: headline.negative, color: SENTIMENT_COLORS.SELL },
                    { label: 'NEU', value: headline.neutral,  color: SENTIMENT_COLORS.HOLD },
                    ].map(bar => (
                        <Box key={bar.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                            sx={{
                                fontSize:   '0.55rem',
                                fontFamily: 'monospace',
                                color:      '#4a5568',
                                width:      24,
                                flexShrink: 0,
                            }}
                            >
                                {bar.label}
                            </Typography>
                            <LinearProgress
                            variant="determinate"
                            value={bar.value * 100}
                            sx={{
                                flex:            1,
                                height:          4,
                                borderRadius:    2,
                                backgroundColor: '#21262d',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: bar.color,
                                    borderRadius:    2,
                                },
                            }}
                            />
                            <Typography
                            sx={{
                                fontSize:   '0.55rem',
                                fontFamily: 'monospace',
                                color:      '#7d8590',
                                width:      32,
                                textAlign:  'right',
                                flexShrink: 0,
                            }}
                            >
                                {(bar.value * 100).toFixed(0)}%
                            </Typography>
                        </Box>
                ))}
            </Box>
        </Box>
    )
}

export default function SentimentModal({
    open,
    result,
    onClose,
}: SentimentModalProps) {
    if (!result) return null

    const totalHeadlines = result.headlines_analyzed.length
    const positiveCount  = result.headlines_analyzed.filter(h => h.label === 'positive').length
    const negativeCount  = result.headlines_analyzed.filter(h => h.label === 'negative').length
    const neutralCount   = result.headlines_analyzed.filter(h => h.label === 'neutral').length

    return (
        <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
        sx: {
            backgroundColor: '#161b22',
            border:          '1px solid #21262d',
            borderRadius:    1.5,
            boxShadow:       '0 16px 48px rgba(0,0,0,0.6)',
        },
        }}
        >
            <DialogContent sx={{ p: 0 }}>
                {/* Header */}
                <Box
                sx={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    px:             2.5,
                    py:             1.5,
                    borderBottom:   '1px solid #21262d',
                }}
                >
                    <Box>
                        <Typography
                        sx={{
                            fontSize:      '0.65rem',
                            fontFamily:    'monospace',
                            color:         '#4a5568',
                            letterSpacing: 1,
                        }}
                        >
                            AI SENTIMENT ANALYSIS
                        </Typography>
                        <Typography
                        sx={{
                            fontSize:   '0.95rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color:      '#cdd9e5',
                        }}
                        >
                            {result.symbol} — {result.name}
                        </Typography>
                    </Box>

                    <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{ color: '#7d8590', '&:hover': { color: '#cdd9e5' } }}
                    >
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>

                {/* Result summary */}
                <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2.5,
                }}
                >
                    {/* Badge */}
                    <SentimentBadge
                    label={result.label}
                    score={result.score}
                    size="large"
                    />

                    {/* Reasoning */}
                    <Box sx={{ flex: 1 }}>
                        <Typography
                        sx={{
                            fontSize:   '0.75rem',
                            color:      '#cdd9e5',
                            lineHeight: 1.6,
                            mb:         1,
                        }}
                        >
                            {result.reasoning}
                        </Typography>

                        {/* Headline breakdown */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {[
                                { label: 'Positive', count: positiveCount, color: SENTIMENT_COLORS.BUY  },
                                { label: 'Negative', count: negativeCount, color: SENTIMENT_COLORS.SELL },
                                { label: 'Neutral',  count: neutralCount,  color: SENTIMENT_COLORS.HOLD },
                                ].map(item => (
                                    <Box key={item.label}>
                                        <Typography
                                        sx={{
                                            fontSize:   '1rem',
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            color:      item.color,
                                            lineHeight: 1,
                                            }}
                                        >
                                            {item.count}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.62rem', color: '#4a5568' }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                            ))}
                            <Box>
                                <Typography
                                sx={{
                                    fontSize:   '1rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    color:      '#cdd9e5',
                                    lineHeight: 1,
                                }}
                                >
                                    {totalHeadlines}
                                </Typography>
                                <Typography sx={{ fontSize: '0.62rem', color: '#4a5568' }}>
                                    Total
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: '#21262d' }} />

                    {/* Headlines */}
                <Box sx={{ px: 2.5, py: 1.5 }}>
                    <Typography
                    sx={{
                        fontSize:      '0.6rem',
                        fontFamily:    'monospace',
                        color:         '#4a5568',
                        letterSpacing: 1,
                        mb:            1,
                    }}
                    >
                        HEADLINES ANALYZED ({totalHeadlines})
                    </Typography>

                    <Box
                    sx={{
                        maxHeight:  300,
                        overflowY:  'auto',
                        '&::-webkit-scrollbar':       { width: 3 },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#21262d',
                            borderRadius:    2,
                        },
                    }}
                    >
                        {result.headlines_analyzed.map((headline, index) => (
                            <HeadlineRow key={index} headline={headline} />
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ borderColor: '#21262d' }} />

        {/* Disclaimer */}
                <Box sx={{ px: 2.5, py: 1.25 }}>
                    <Typography
                    sx={{
                        fontSize:   '0.62rem',
                        color:      '#4a5568',
                        lineHeight: 1.5,
                        fontStyle:  'italic',
                    }}
                    >
                        {result.disclaimer}
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    )
}