'use client'

import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

interface SparklineProps {
    data: number[]
    width?: number
    height?: number
    positive?: boolean
}

export default function Sparkline({
    data,
    width = 80,
    height = 30,
    positive = true,
}: SparklineProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
    if (!canvasRef.current || !data || data.length < 2) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const padding = 2
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    const points = data.map((value, index) => ({
      x: padding + (index / (data.length - 1)) * chartWidth,
      y: padding + chartHeight - ((value - min) / range) * chartHeight,
    }))

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    const color = positive ? '#3fb950' : '#f85149'
    gradient.addColorStop(0,
        positive ? 'rgba(63, 185, 80, 0.3)' : 'rgba(248, 81, 73, 0.3)'
    )
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, height)
    ctx.lineTo(points[0].x, height)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.lineJoin = 'round'
    ctx.moveTo(points[0].x, points[0].y)
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
    ctx.stroke()

    }, [data, width, height, positive])

    return (
        <Box
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        >
            <canvas
            ref={canvasRef}
            style={{ width, height, display: 'block' }}
            />
        </Box>
    )
}