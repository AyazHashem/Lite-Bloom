'use client'

import { useEffect, useRef } from 'react'
import {
    createChart,
    IChartApi,
    ISeriesApi,
    CandlestickSeries,
    LineSeries,
    ColorType,
    Time,
} from 'lightweight-charts'
import { OHLCVBar } from '@/types/market'

interface LightweightChartProps {
    data: OHLCVBar[]
    chartType?: 'candlestick' | 'line'
}

export default function LightweightChart({
    data,
    chartType = 'candlestick',
}: LightweightChartProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<any> | null>(null)
    const chartTypeRef = useRef(chartType)

    useEffect(() => {
        if (!containerRef.current) return

        const chart = createChart(containerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#0d1117' },
                textColor: '#7d8590',
                fontSize: 11,
            },
            grid: {
                vertLines: { color: '#21262d' },
                horzLines: { color: '#21262d' },
            },
            crosshair: {
                vertLine: { color: '#388bfd', width: 1 },
                horzLine: { color: '#388bfd', width: 1 },
            },
            rightPriceScale: {
                borderColor: '#21262d',
                textColor: '#7d8590',
            },
            timeScale: {
                borderColor: '#21262d',
                timeVisible: true,
                secondsVisible: false,
                rightOffset: 5,
            },
            width:  containerRef.current.clientWidth,
            height: containerRef.current.clientHeight || 300,
        })

        chartRef.current = chart

        const handleResize = () => {
            if (containerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width:  containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight || 300,
                })
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
            chartRef.current = null
            seriesRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!chartRef.current) return

        if (seriesRef.current) {
            chartRef.current.removeSeries(seriesRef.current)
            seriesRef.current = null
        }

        if (chartType === 'candlestick') {
            seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
                upColor:       '#3fb950',
                downColor:     '#f85149',
                borderVisible: false,
                wickUpColor:   '#3fb950',
                wickDownColor: '#f85149',
            })
        } else {
            seriesRef.current = chartRef.current.addSeries(LineSeries, {
                color:     '#1f6feb',
                lineWidth: 2,
            })
        }

        chartTypeRef.current = chartType
    }, [chartType])

    useEffect(() => {
        if (!seriesRef.current || !data || data.length === 0) return

        try {

            const sortedData = [...data].sort((a, b) => a.time - b.time)

            const processedData = sortedData.map(bar => {
                let time = bar.time

                if (time > 1e12) {
                    time = Math.floor(time / 1000)
                }
                return { ...bar, time }
            })

            if (chartTypeRef.current === 'candlestick') {
                seriesRef.current.setData(
                    processedData.map(bar => ({
                        time:  bar.time as Time,
                        open:  bar.open,
                        high:  bar.high,
                        low:   bar.low,
                        close: bar.close,
                    }))
                )
            } else {
                seriesRef.current.setData(
                    processedData.map(bar => ({
                        time:  bar.time as Time,
                        value: bar.close,
                    }))
                )
            }

            chartRef.current?.timeScale().fitContent()

        } catch (err) {
            console.error('LightweightChart setData error:', err)
        }
    }, [data, chartType])

    return (
        <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', minHeight: 200 }}
        />
    )
}