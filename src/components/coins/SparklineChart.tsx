import React from 'react';

interface SparklineChartProps {
  data: number[];
  positive: boolean;
}

const SparklineChart: React.FC<SparklineChartProps> = React.memo(({ data, positive }) => {
  if (!data || data.length === 0) return null;
  const step = Math.max(1, Math.floor(data.length / 20));
  const sampled = data.filter((_, i) => i % step === 0);

  return (
    <div className="w-24 h-8">
      <svg viewBox={`0 0 ${sampled.length - 1} 1`} className="w-full h-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={positive ? 'hsl(142, 60%, 45%)' : 'hsl(0, 72%, 51%)'}
          strokeWidth="0.06"
          points={sampled
            .map((v, i) => {
              const min = Math.min(...sampled);
              const max = Math.max(...sampled);
              const range = max - min || 1;
              return `${i},${1 - (v - min) / range}`;
            })
            .join(' ')}
        />
      </svg>
    </div>
  );
});

SparklineChart.displayName = 'SparklineChart';
export default SparklineChart;
