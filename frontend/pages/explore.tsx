import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconSearch, IconPlus, IconCheck } from '../components/Icons';
import { useCurrency } from '../context/CurrencyContext';
import { formatPrice } from '../utils/currency';

export default function ExplorePage() {
  const { currency } = useCurrency();
  const [query, setQuery] = useState('');
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['RELIANCE', 'HDFCBANK', 'INFY']);

  const allStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy', price: 1477.20, change: 7.2 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Financials', price: 1422.10, change: -1.2 },
    { symbol: 'INFY', name: 'Infosys Ltd', sector: 'Technology', price: 1530.00, change: 0.4 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', price: 3890.25, change: 1.1 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Financials', price: 1050.40, change: 2.3 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', price: 1180.00, change: -0.8 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automotive', price: 980.50, change: 3.5 },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financials', price: 745.20, change: 0.9 },
  ];

  const filtered = allStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase())
  );

  const toggleWatchlist = (sym: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (watchlistSymbols.includes(sym)) {
      setWatchlistSymbols(watchlistSymbols.filter((s) => s !== sym));
    } else {
      setWatchlistSymbols([...watchlistSymbols, sym]);
    }
  };

  return (
    <>
      <Head>
        <title>Explore Stocks — Chowkidar</title>
      </Head>

      <div className="flex flex-col gap-6 max-w-[920px] mx-auto">
        {/* Search Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-primary tracking-tight">Explore &amp; Discover</h1>
          <div className="relative w-full">
            <input
              type="text"
              autoFocus
              placeholder="Search stocks by symbol, name, or sector (e.g. RELIANCE, Tech...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 text-sm bg-[var(--color-surface-primary)] border border-[var(--color-border)] rounded-xl text-primary outline-none focus:border-[var(--color-accent-positive)] shadow-sm font-medium"
            />
            <IconSearch className="absolute left-4 top-3.5 text-muted" size={18} />
          </div>
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            {filtered.length} {filtered.length === 1 ? 'stock found' : 'stocks found'}
          </span>

          {filtered.length === 0 ? (
            <Card className="p-12 text-center text-muted">
              No stock matching &quot;{query}&quot; found. Search for symbols like RELIANCE, TCS, or INFY.
            </Card>
          ) : (
            <Card noPadding className="divide-y divide-[var(--color-border)] overflow-hidden">
              {filtered.map((stock) => {
                const inWatchlist = watchlistSymbols.includes(stock.symbol);
                const isPositive = stock.change >= 0;

                return (
                  <Link
                    key={stock.symbol}
                    href={`/stock/${stock.symbol}`}
                    className="p-4 flex items-center justify-between hover:bg-[var(--color-surface-secondary)] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-primary group-hover:text-[var(--color-accent-positive)] transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-muted font-bold border border-subtle">
                            {stock.sector}
                          </span>
                        </div>
                        <span className="text-xs text-muted font-medium mt-0.5">{stock.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end text-right">
                        <span className="text-base font-bold numeric text-primary">
                          {formatPrice(stock.price, currency)}
                        </span>
                        <span className={`text-xs font-bold numeric ${isPositive ? 'text-positive' : 'text-negative'}`}>
                          {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant={inWatchlist ? 'secondary' : 'primary'}
                        onClick={(e) => toggleWatchlist(stock.symbol, e)}
                        className="h-8 px-3 text-xs rounded-lg"
                      >
                        {inWatchlist ? (
                          <>
                            <IconCheck size={14} className="mr-1 text-[var(--color-accent-positive)]" /> Tracked
                          </>
                        ) : (
                          <>
                            <IconPlus size={14} className="mr-1" /> Add
                          </>
                        )}
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
