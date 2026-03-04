import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { ChartDataPoint, TimeRange } from '@/types/coin.ts';
import { formatCurrency } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceChartProps {
  data: ChartDataPoint[];
  loading: boolean;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const ranges: { label: string; value: TimeRange }[] = [
  { label: '24H', value: '1' },
  { label: '7D', value: '7' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
  { label: '1Y', value: '365' },
];

const PriceChart: React.FC<PriceChartProps> = ({ data, loading, timeRange, onTimeRangeChange }) => {
  const isPositive = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1].price >= data[0].price;
  }, [data]);

  const color = isPositive ? 'hsl(142, 60%, 45%)' : 'hsl(0, 72%, 51%)';

  const formattedData = useMemo(() => {
    // Sample to ~100 points for smooth rendering
    const step = Math.max(1, Math.floor(data.length / 100));
    return data
      .filter((_, i) => i % step === 0 || i === data.length - 1)
      .map((d) => ({
        time: new Date(d.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          ...(timeRange === '1' ? { hour: '2-digit', minute: '2-digit' } : {}),
        }),
        price: d.price,
      }));
  }, [data, timeRange]);

  return (
    <div className="rounded-xl border bg-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Price Chart</h3>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => onTimeRangeChange(r.value)}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                timeRange === r.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-72 w-full rounded-lg" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" opacity={0.3} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v, true)}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(224, 24%, 10%)',
                border: 'none',
                borderRadius: '8px',
                color: 'hsl(210, 20%, 94%)',
                fontSize: 13,
              }}
              formatter={(value: number) => [formatCurrency(value), 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PriceChart;
