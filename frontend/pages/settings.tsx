import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function SettingsPage() {
  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  useEffect(() => {
    // Sync data-theme attribute on html element
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  const currencies = [
    { code: 'INR', label: '₹ INR (Indian Rupee)' },
    { code: 'USD', label: '$ USD (US Dollar)' },
    { code: 'EUR', label: '€ EUR (Euro)' },
    { code: 'GBP', label: '£ GBP (British Pound)' },
    { code: 'JPY', label: '¥ JPY (Japanese Yen)' },
    { code: 'SGD', label: 'S$ SGD (Singapore Dollar)' },
    { code: 'AED', label: 'د.إ AED (UAE Dirham)' },
  ];

  return (
    <>
      <Head>
        <title>Settings — Chowkidar</title>
      </Head>

      <div className="flex flex-col gap-[var(--space-6)] max-w-[640px] mx-auto">
        <div>
          <h1 className="text-xl font-bold text-primary">App Settings</h1>
          <p className="text-sm text-muted mt-1">
            Display units, theme appearance, and account options.
          </p>
        </div>

        {/* Display Currency */}
        <Card className="flex flex-col gap-[var(--space-4)]">
          <h2 className="text-base font-bold text-primary border-b border-[var(--color-border)] pb-2">
            Display Currency
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currencies.map((c) => (
              <label
                key={c.code}
                className={`flex items-center gap-3 p-3 rounded-[var(--radius-sm)] border cursor-pointer transition-colors text-sm ${
                  currency === c.code
                    ? 'border-positive bg-[var(--color-surface-secondary)] text-primary font-bold'
                    : 'border-[var(--color-border)] text-muted hover:text-primary'
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  value={c.code}
                  checked={currency === c.code}
                  onChange={() => setCurrency(c.code)}
                  className="accent-[var(--color-accent-positive)]"
                />
                {c.label}
              </label>
            ))}
          </div>
          <span className="text-[var(--text-xs)] text-muted">
            FX Exchange rates automatically updated every hour. Native INR always displayed alongside converted values.
          </span>
        </Card>

        {/* Appearance */}
        <Card className="flex flex-col gap-[var(--space-4)]">
          <h2 className="text-base font-bold text-primary border-b border-[var(--color-border)] pb-2">
            Appearance
          </h2>
          <div className="flex gap-3">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-2.5 px-4 rounded-[var(--radius-sm)] border text-sm font-semibold capitalize transition-colors ${
                  theme === t
                    ? 'border-positive bg-[var(--color-surface-secondary)] text-primary'
                    : 'border-[var(--color-border)] text-muted hover:text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="flex flex-col gap-[var(--space-4)]">
          <h2 className="text-base font-bold text-primary border-b border-[var(--color-border)] pb-2">
            Account
          </h2>
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="font-semibold text-primary">Signed in as</div>
              <div className="text-muted">user@chowkidar.app</div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.href = '/login'}
            >
              Log out
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
