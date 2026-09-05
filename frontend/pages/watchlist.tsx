import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconSearch, IconPlus, IconTrash, IconArrowUpRight } from '../components/Icons';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../utils/currency';

export default function WatchlistPage() {
  const { currency } = useCurrency();
  const { data, isLoading, mutate } = useSWR('/api/watchlists/default', fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddStock = () => {
    if (!searchQuery.trim()) return;
    setIsAdding(true);
    if (data) {
      const newStock = {
        id: `stk_${Date.now()}`,
        symbol: searchQuery.toUpperCase(),
        name: `${searchQuery.toUpperCase()} Corp`,
        price: 1250.00,
        change: 1.5,
        attentionScore: 42,
        lastUpdated: new Date().toISOString()
      };
      mutate({ ...data, stocks: [...data.stocks, newStock] }, false);
    }
    setSearchQuery('');
    setIsAdding(false);
  };

  const handleRemoveStock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (data) {
      const updated = data.stocks.filter((s: any) => s.id !== id);
      mutate({ ...data, stocks: updated }, false);
    }
  };

  return (
    <>
      <Head>
        <title>Watchlist — Chowkidar</title>
      </Head>

      <div className="flex flex-col gap-6 max-w-[920px] mx-auto">
        {/* Header & Add Stock Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-primary">Monitored Watchlist</h1>
            <p className="text-xs text-muted mt-1">
              Assets monitored for statistical anomalies and price divergence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Add symbol (e.g. TATAMOTORS)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStock()}
                className="h-10 pl-9 pr-3 text-xs bg-[var(--color-surface-primary)] border border-[var(--color-border)] rounded-xl text-primary outline-none focus:border-[var(--color-accent-positive)] w-56 font-medium shadow-sm"
              />
              <IconSearch className="absolute left-3 top-3 text-muted" size={14} />
            </div>
            <Button size="md" variant="primary" onClick={handleAddStock} disabled={isAdding} className="h-10 text-xs">
              <IconPlus size={14} className="mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Watchlist Content */}
        {isLoading ? (
          <Card className="p-8 animate-pulse text-center text-muted">
            Loading watchlist items...
          </Card>
        ) : !data || data.stocks.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-base font-bold text-primary">Watchlist is Empty</h3>
            <p className="text-xs text-muted max-w-md mt-1">
              Search for stock symbols above to add them to your automated monitoring radar.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            <Card noPadding className="overflow-hidden">
              <table className="w-full text-left text-sm divide-y divide-[var(--color-border)]">
                <thead className="bg-[var(--color-surface-secondary)] text-muted text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Price ({currency})</th>
                    <th className="py-3 px-4">24h Change</th>
                    <th className="py-3 px-4">Attention Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {data.stocks.map((stock: any) => {
                    const isPositive = stock.change >= 0;
                    return (
                      <tr 
                        key={stock.id} 
                        className="hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/stock/${stock.symbol}`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-primary flex items-center gap-1">
                              {stock.symbol} <IconArrowUpRight size={14} className="text-muted" />
                            </span>
                            <span className="text-xs text-muted">{stock.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 numeric font-bold text-primary">
                          {formatPrice(stock.price, currency)}
                        </td>
                        <td className={`py-3.5 px-4 numeric font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                          {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded border border-subtle bg-[var(--color-surface-secondary)] numeric font-bold text-primary text-xs">
                            {stock.attentionScore} / 100
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleRemoveStock(stock.id, e)}
                            className="text-negative hover:bg-[var(--color-accent-negative-soft)] h-8"
                          >
                            <IconTrash size={14} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
