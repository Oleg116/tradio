import React, { useMemo } from 'react';
import type { Coin } from '@/types/coin';
import CoinRow from './CoinRow';
import { Table, TableHeader, TableHead, TableBody, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface CoinTableProps {
  coins: Coin[];
  loading: boolean;
}

const CoinTable: React.FC<CoinTableProps> = ({ coins, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h</TableHead>
            <TableHead className="text-right hidden md:table-cell">7d</TableHead>
            <TableHead className="text-right hidden lg:table-cell">Market Cap</TableHead>
            <TableHead className="hidden xl:table-cell">7d Chart</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin) => (
            <CoinRow key={coin.id} coin={coin} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoinTable;
