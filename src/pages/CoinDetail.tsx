import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { getCoinDetail, clearDetail } from '@/store/coinsSlice';
import { getChartData, setTimeRange } from '@/store/chartSlice';
import PriceChart from '@/components/charts/PriceChart';
import StatCard from '@/components/coins/StatCard';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TimeRange } from '@/types/coin';

const CoinDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { detail, detailLoading } = useAppSelector((s) => s.coins);
  const { data: chartData, loading: chartLoading, timeRange } = useAppSelector((s) => s.chart);

  useEffect(() => {
    if (id) {
      dispatch(getCoinDetail(id));
      dispatch(getChartData({ id, days: timeRange }));
    }
    return () => { dispatch(clearDetail()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getChartData({ id, days: timeRange }));
    }
  }, [timeRange, id, dispatch]);

  const handleTimeRangeChange = (range: TimeRange) => {
    dispatch(setTimeRange(range));
  };

  if (detailLoading || !detail) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-72 w-full rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const md = detail.market_data;
  const isPositive = md.price_change_percentage_24h >= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Tradio</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Coin header */}
        <div className="flex items-center gap-4">
          <img src={detail.image.large} alt={detail.name} className="w-12 h-12 rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{detail.name}</h2>
              <span className="text-sm text-muted-foreground font-mono uppercase">{detail.symbol}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-md font-mono">
                Rank #{detail.market_cap_rank}
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-bold font-mono">
                {formatCurrency(md.current_price.usd)}
              </span>
              <span className={`text-sm font-mono font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                {formatPercent(md.price_change_percentage_24h)}
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <PriceChart
          data={chartData}
          loading={chartLoading}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Market Cap" value={formatCurrency(md.market_cap.usd, true)} />
          <StatCard label="24h Volume" value={formatCurrency(md.total_volume.usd, true)} />
          <StatCard label="24h High" value={formatCurrency(md.high_24h.usd)} />
          <StatCard label="24h Low" value={formatCurrency(md.low_24h.usd)} />
          <StatCard
            label="7d Change"
            value={formatPercent(md.price_change_percentage_7d)}
            positive={md.price_change_percentage_7d >= 0}
          />
          <StatCard
            label="30d Change"
            value={formatPercent(md.price_change_percentage_30d)}
            positive={md.price_change_percentage_30d >= 0}
          />
          <StatCard label="Circulating Supply" value={formatNumber(md.circulating_supply)} />
          <StatCard
            label="All-Time High"
            value={formatCurrency(md.ath.usd)}
            subValue={formatPercent(md.ath_change_percentage.usd)}
            positive={false}
          />
        </div>

        {/* Description */}
        {detail.description.en && (
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-3">About {detail.name}</h3>
            <div
              className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: detail.description.en.split('. ').slice(0, 4).join('. ') + '.' }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default CoinDetail;
