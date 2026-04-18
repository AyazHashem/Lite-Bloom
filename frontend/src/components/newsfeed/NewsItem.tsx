import { Box, Typography, Link } from '@mui/material'
import { NewsArticle } from '@/types/news'

interface NewsItemProps {
    article: NewsArticle
}

export default function NewsItem({ article }: NewsItemProps) {
    const formatTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            })
        } catch {
            return '--:--'
        }
    }

    return (
        <Box
        sx = {{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            py: 0.75,
            px: 1.5,
            borderBottom: '1px solid #1a1f2e',
            '&:hover': {
                backgroundColor: '#0f1117',
            },
        }}
        >
            <Typography
            variant='caption'
            sx={{
                color: '#758696',
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                mt: 0.2,
            }}
            >
                {formatTime(article.published_at)}
            </Typography>
            <Typography
            variant="caption"
            sx={{
                color: '#26a69a',
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                mt: 0.2,
                minWidth: 80,
            }}
            >
                {article.source.toUpperCase()}
            </Typography>
            <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
                color: '#d1d4dc',
                fontsize: '0.72rem',
                lineHeight: 1.4,
                cursor: 'pointer',
                '&:hover': {
                    color: '#ffffff',
                },
            }}
            >
                {article.headline}
            </Link>
        </Box>
    )
}