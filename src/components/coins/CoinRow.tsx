import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Coin } from '@/types/coin';
import { formatCurrency, formatPercent } from '@/lib/format';
import SparklineChart from './SparklineChart';
import { TableRow, TableCell } from '@/components/ui/table';

interface CoinRowProps {
  coin: Coin;
}

const CoinRow: React.FC<CoinRowProps> = React.memo(({ coin }) => {
  const navigate = useNavigate();
  const isPositive24h = coin.price_change_percentage_24h >= 0;
  const isPositive7d = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

  return (
    <TableRow
      className="cursor-pointer transition-colors hover:bg-muted/60"
      onClick={() => navigate(`/coin/${coin.id}`)}
    >
      <TableCell className="font-mono text-muted-foreground w-10">
        {coin.market_cap_rank}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" loading="lazy" />
          <div>
            <span className="font-semibold">{coin.name}</span>
            <span className="ml-2 text-xs text-muted-foreground uppercase font-mono">{coin.symbol}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono font-medium">
        {formatCurrency(coin.current_price)}
      </TableCell>
      <TableCell className={`text-right font-mono font-medium ${isPositive24h ? 'text-success' : 'text-danger'}`}>
        {formatPercent(coin.price_change_percentage_24h)}
      </TableCell>
      <TableCell className={`text-right font-mono font-medium hidden md:table-cell ${isPositive7d ? 'text-success' : 'text-danger'}`}>
        {coin.price_change_percentage_7d_in_currency != null
          ? formatPercent(coin.price_change_percentage_7d_in_currency)
          : '—'}
      </TableCell>
      <TableCell className="text-right font-mono hidden lg:table-cell">
        {formatCurrency(coin.market_cap, true)}
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        {coin.sparkline_in_7d?.price && (
          <SparklineChart
            data={coin.sparkline_in_7d.price}
            positive={isPositive7d}
          />
        )}
      </TableCell>
    </TableRow>
  );
});

CoinRow.displayName = 'CoinRow';
export default CoinRow;
