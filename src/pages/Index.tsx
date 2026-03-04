import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getCoins } from '@/store/coinsSlice';
import CoinTable from '@/components/coins/CoinTable';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp } from 'lucide-react';

const Index: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.coins);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(getCoins(1));
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    );
  }, [list, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Tradio</h1>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Cryptocurrency Prices</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Top {list.length} coins by market capitalization
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <CoinTable coins={filtered} loading={loading} />
      </main>
    </div>
  );
};

export default Index;
