import { Box, Typography, Link } from '@mui/material'
import { NewsArticle } from '@/types/news'
import { formatTimestamp, formatTimeAgo } from '@/lib/formatters'

interface NewsItemProps {
    article: NewsArticle
}

export default function NewsItem({ article }: NewsItemProps) {
  // Use published_at from the article data — NOT the time the component rendered
    const publishTime = formatTimestamp(article.published_at)
    const timeAgo     = formatTimeAgo(article.published_at)

    return (
        <Box
        sx={{
            display:      'flex',
            alignItems:   'flex-start',
            gap:          1.25,
            py:           0.65,
            px:           1.5,
            borderBottom: '1px solid #161b22',
            '&:hover':    { backgroundColor: '#0d1117' },
        }}
        >
            {/* Published time */}
            <Box sx={{ flexShrink: 0, minWidth: 38 }}>
                <Typography
                sx={{
                    fontSize:   '0.62rem',
                    fontFamily: 'monospace',
                    color:      '#4a5568',
                    lineHeight: 1,
                }}
                >
                    {publishTime}
                </Typography>
            </Box>

            {/* Source */}
            <Typography
            sx={{
                fontSize:   '0.62rem',
                fontFamily: 'monospace',
                color:      '#1f6feb',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                minWidth:   72,
                lineHeight: 1.4,
            }}
            >
                {article.source?.toUpperCase()?.slice(0, 12)}
            </Typography>

            {/* Headline */}
            <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
                color:      '#cdd9e5',
                fontSize:   '0.7rem',
                lineHeight: 1.4,
                flex:       1,
                cursor:     'pointer',
                '&:hover':  { color: '#e6edf3' },
            }}
            >
                {article.headline}
            </Link>

            {/* Time ago — right side */}
            <Typography
            sx={{
                fontSize:   '0.58rem',
                color:      '#4a5568',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                lineHeight: 1.4,
            }}
            >
                {timeAgo}
            </Typography>
        </Box>
    )
}