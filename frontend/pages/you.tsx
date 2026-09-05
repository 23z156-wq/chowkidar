import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCurrency } from '../context/CurrencyContext';
import { SupportedCurrency, CURRENCY_CONFIG } from '../utils/currency';

export default function YouPage() {
  const { currency, setCurrency } = useCurrency();
  const [watchlists, setWatchlists] = useState([
    { id: '1', name: 'Core Holdings', count: 4 },
    { id: '2', name: 'High Beta Tech', count: 2 },
  ]);

  const weights = [
    { factor: 'Price Anomaly', weight: 0.8, bar: '80%' },
    { factor: 'Volume Velocity', weight: 1.0, bar: '100%' },
    { factor: 'Sector Divergence', weight: 0.9, bar: '90%' },
    { factor: 'Signal Novelty', weight: 0.6, bar: '60%' },
  ];

  const dataStatusList = [
    { symbol: 'RELIANCE', status: 'Live', age: '12s ago', state: 'live' },
    { symbol: 'HDFCBANK', status: 'Live', age: '45s ago', state: 'live' },
    { symbol: 'INFY', status: 'Delayed', age: '6m old', state: 'delayed' },
    { symbol: 'TCS', status: 'Live', age: '18s ago', state: 'live' },
  ];

  const currenciesList: SupportedCurrency[] = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'AED'];

  const handleDeleteWatchlist = (id: string) => {
    if (confirm('Are you sure you want to delete this watchlist?')) {
      setWatchlists(watchlists.filter((w) => w.id !== id));
    }
  };

  return (
    <>
      <Head>
        <title>You — Account &amp; Settings — Chowkidar</title>
      </Head>

      <div className="flex flex-col gap-6 max-w-[920px] mx-auto">
        {/* User Account Header */}
        <Card className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent-positive-soft)] border border-[var(--color-accent-positive)] flex items-center justify-center text-base font-black text-[var(--color-accent-positive)]">
              CK
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-primary">demo@chowkidar.app</span>
              <span className="text-xs font-semibold text-muted">Pro Telemetry Feed · Active</span>
            </div>
          </div>
          <Link href="/login">
            <Button variant="secondary" size="sm" className="text-xs">
              Sign Out
            </Button>
          </Link>
        </Card>

        {/* 1. Watchlists Management */}
        <Card className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-subtle pb-3">
            <h2 className="text-base font-black text-primary">Your Watchlists</h2>
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => alert('New watchlist created')}>
              + New Watchlist
            </Button>
          </div>

          <div className="flex flex-col gap-2.5">
            {watchlists.map((wl) => (
              <div
                key={wl.id}
                className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle flex items-center justify-between text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{wl.name}</span>
                  <span className="text-xs text-muted">({wl.count} stocks)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newName = prompt('Rename watchlist:', wl.name);
                      if (newName) setWatchlists(watchlists.map((w) => (w.id === wl.id ? { ...w, name: newName } : w)));
                    }}
                    className="text-xs font-bold text-muted hover:text-primary"
                  >
                    Rename
                  </button>
                  <button onClick={() => handleDeleteWatchlist(wl.id)} className="text-xs font-bold text-negative">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 2. Preferences: Read-only Horizontal Bar Chart */}
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-black text-primary">Learned Attention Weights</h2>
            <p className="text-xs text-muted mt-0.5">
              Read-only view. These parameters shift dynamically based on your interaction behavior.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {weights.map((w) => (
              <div key={w.factor} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-primary">{w.factor}</span>
                  <span className="numeric text-muted">{w.weight.toFixed(1)}</span>
                </div>
                <div className="w-full h-3 bg-[var(--color-surface-secondary)] rounded-full overflow-hidden border border-subtle">
                  <div
                    className="h-full bg-[var(--color-accent-positive)] rounded-full transition-all duration-500"
                    style={{ width: w.bar }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 3. Data Status Feed Health */}
        <Card className="flex flex-col gap-3">
          <h2 className="text-base font-black text-primary border-b border-subtle pb-3">
            Feed Health &amp; Data Freshness
          </h2>
          <div className="divide-y divide-subtle text-xs">
            {dataStatusList.map((item) => (
              <div key={item.symbol} className="py-3 flex items-center justify-between">
                <span className="font-extrabold text-primary">{item.symbol}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold border text-[11px] ${
                      item.state === 'live'
                        ? 'bg-[var(--color-accent-positive-soft)] text-[var(--color-accent-positive)] border-[var(--color-accent-positive)]'
                        : 'bg-[var(--color-accent-neutral-soft)] text-[var(--color-accent-neutral)] border-[var(--color-accent-neutral)]'
                    }`}
                  >
                    {item.status} · {item.age}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Display Currency (Global Sync) */}
        <Card className="flex flex-col gap-3">
          <h2 className="text-base font-black text-primary border-b border-subtle pb-3">
            Active Display Currency (Global Nav Sync)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {currenciesList.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  currency === c
                    ? 'border-[var(--color-accent-positive)] bg-[var(--color-accent-positive-soft)] text-[var(--color-accent-positive)] shadow-sm'
                    : 'border-subtle text-muted hover:text-primary bg-[var(--color-surface-primary)]'
                }`}
              >
                <span>{CURRENCY_CONFIG[c].flag}</span>
                <span>{CURRENCY_CONFIG[c].symbol} {c}</span>
              </button>
            ))}
          </div>
          <span className="text-[11px] text-muted font-medium">
            Toggling currency here or in the top navigation bar updates prices across all screens in real-time. Native INR pricing is always displayed alongside converted values.
          </span>
        </Card>
      </div>
    </>
  );
}
