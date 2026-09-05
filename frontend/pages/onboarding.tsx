import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function OnboardingPage() {
  const router = useRouter();
  const availableStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Financials' },
    { symbol: 'INFY', name: 'Infosys', sector: 'Technology' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Financials' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom' },
  ];

  const [selected, setSelected] = useState<string[]>(['RELIANCE', 'HDFCBANK', 'INFY']);

  const toggleStock = (symbol: string) => {
    if (selected.includes(symbol)) {
      setSelected(selected.filter((s) => s !== symbol));
    } else {
      setSelected([...selected, symbol]);
    }
  };

  const handleFinish = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Onboarding — Chowkidar</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-surface-secondary)]">
        <Card className="w-full max-w-lg p-8 flex flex-col gap-6">
          <div className="flex flex-col text-center gap-1">
            <h1 className="text-xl font-bold text-primary">Seed Your Monitoring Radar</h1>
            <p className="text-sm text-muted">Select the stocks you wish to monitor for statistical anomalies.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {availableStocks.map((stk) => {
              const isSelected = selected.includes(stk.symbol);
              return (
                <div
                  key={stk.symbol}
                  onClick={() => toggleStock(stk.symbol)}
                  className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-colors flex flex-col gap-1 ${
                    isSelected
                      ? 'border-positive bg-[var(--color-surface-secondary)] text-primary'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-primary)] text-muted hover:text-primary'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-primary">{stk.symbol}</span>
                    {isSelected && <span className="text-positive text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-xs truncate">{stk.name}</span>
                </div>
              );
            })}
          </div>

          <Button variant="primary" size="lg" onClick={handleFinish} disabled={selected.length === 0}>
            Start Monitoring ({selected.length} Selected)
          </Button>
        </Card>
      </div>
    </>
  );
}
