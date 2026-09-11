import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
  Tooltip
} from 'recharts';
import { formatCurrency } from '../../services/currency';
import { CurrencyCode } from '../../types';

interface MarketSparklineProps {
  prices?: number[];
  currentPrice: number;
  change24h: number;
  currency?: CurrencyCode | string;
  height?: number;
  width?: number | string;
  showGradient?: boolean;
  showTooltip?: boolean;
  idPrefix?: string;
}

interface SparkPoint {
  index: number;
  price: number;
  formattedHour: string;
}

export const MarketSparkline: React.FC<MarketSparklineProps> = ({
  prices,
  currentPrice,
  change24h,
  currency = 'USD',
  height = 36,
  width = '100%',
  showGradient = true,
  showTooltip = true,
  idPrefix = 'spark'
}) => {
  const isPositive = change24h >= 0;
  const strokeColor = isPositive ? '#10b981' : '#f43f5e'; // emerald-500 : rose-500
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';
  const gradId = `${idPrefix}-grad-${isPositive ? 'up' : 'down'}-${Math.random().toString(36).substring(2, 7)}`;
  const validCurrency = (currency as CurrencyCode) || 'USD';

  // Prepare 24-hour data points
  const chartData: SparkPoint[] = useMemo(() => {
    // 1. If valid array exists with multiple data points
    if (prices && prices.length >= 2) {
      // If full 7-day 168 hours provided, take last 24-28 points (last 24 hours)
      const sliceCount = prices.length >= 100 ? 24 : Math.min(prices.length, 24);
      const recentPrices = prices.slice(-sliceCount);

      return recentPrices.map((p, idx) => {
        const hoursAgo = recentPrices.length - 1 - idx;
        return {
          index: idx,
          price: Number(p.toFixed(4)),
          formattedHour: hoursAgo === 0 ? 'Now' : `-${hoursAgo}h`
        };
      });
    }

    // 2. Fallback: generate smooth 24-hour trend based on 24h change & current price
    const pointsCount = 20;
    const startPrice = currentPrice / (1 + (change24h || 0) / 100);
    const priceDelta = currentPrice - startPrice;
    const generated: SparkPoint[] = [];

    for (let i = 0; i < pointsCount; i++) {
      const progress = i / (pointsCount - 1);
      // Add subtle curve wave
      const wave = Math.sin(progress * Math.PI * 2) * (Math.abs(priceDelta) * 0.15);
      const intermediatePrice = startPrice + priceDelta * progress + (i === pointsCount - 1 ? 0 : wave);
      const hoursAgo = Math.round((pointsCount - 1 - i) * (24 / (pointsCount - 1)));

      generated.push({
        index: i,
        price: Number(Math.max(intermediatePrice, 0.0001).toFixed(4)),
        formattedHour: hoursAgo === 0 ? 'Now' : `-${hoursAgo}h`
      });
    }

    return generated;
  }, [prices, currentPrice, change24h]);

  const minPrice = useMemo(() => {
    if (chartData.length === 0) return 0;
    const min = Math.min(...chartData.map(d => d.price));
    return min * 0.998;
  }, [chartData]);

  const maxPrice = useMemo(() => {
    if (chartData.length === 0) return 1;
    const max = Math.max(...chartData.map(d => d.price));
    return max * 1.002;
  }, [chartData]);

  return (
    <div
      className="w-full relative flex items-center justify-center select-none"
      style={{ height, minWidth: typeof width === 'number' ? `${width}px` : '100px' }}
    >
      <ResponsiveContainer width={width} height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <YAxis
            type="number"
            domain={[minPrice, maxPrice]}
            hide
          />

          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as SparkPoint;
                  return (
                    <div className="px-2 py-1 rounded-md bg-slate-900/95 text-slate-100 border border-slate-700/80 shadow-lg text-[10px] font-mono pointer-events-none z-30">
                      <div className="text-slate-400 font-sans text-[9px]">{data.formattedHour}</div>
                      <div className="font-bold text-emerald-400">
                        {formatCurrency(data.price, validCurrency)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              isAnimationActive={false}
              cursor={{
                stroke: strokeColor,
                strokeWidth: 1,
                strokeDasharray: '2 2'
              }}
            />
          )}

          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={1.8}
            fill={showGradient ? `url(#${gradId})` : 'transparent'}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
