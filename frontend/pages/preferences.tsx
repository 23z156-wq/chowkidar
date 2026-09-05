import React, { useState } from 'react';
import Head from 'next/head';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function PreferencesPage() {
  const [weights, setWeights] = useState({
    price: 0.8,
    volume: 1.0,
    divergence: 0.9,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Preferences — Chowkidar</title>
      </Head>

      <div className="flex flex-col gap-[var(--space-6)] max-w-[640px] mx-auto">
        <div>
          <h1 className="text-xl font-bold text-primary">Attention Profile &amp; Tuning</h1>
          <p className="text-sm text-muted mt-1">
            Personalize the scoring engine weights. Higher weight makes Chowkidar more sensitive to that signal.
          </p>
        </div>

        {/* Attention Weights Card */}
        <Card className="flex flex-col gap-[var(--space-5)]">
          <h2 className="text-base font-bold text-primary border-b border-[var(--color-border)] pb-2">
            Signal Sensitivity Weights
          </h2>

          <div className="flex flex-col gap-[var(--space-4)]">
            {/* Price Movements Weight */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-primary">Price Movements</span>
                <span className="numeric text-positive">{weights.price.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={weights.price}
                onChange={(e) => setWeights({ ...weights, price: parseFloat(e.target.value) })}
                className="w-full accent-[var(--color-accent-positive)] cursor-pointer"
              />
            </div>

            {/* Volume Anomalies Weight */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-primary">Volume Velocity Anomalies</span>
                <span className="numeric text-positive">{weights.volume.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={weights.volume}
                onChange={(e) => setWeights({ ...weights, volume: parseFloat(e.target.value) })}
                className="w-full accent-[var(--color-accent-positive)] cursor-pointer"
              />
            </div>

            {/* Market Divergence Weight */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-primary">Sector Market Divergence</span>
                <span className="numeric text-positive">{weights.divergence.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={weights.divergence}
                onChange={(e) => setWeights({ ...weights, divergence: parseFloat(e.target.value) })}
                className="w-full accent-[var(--color-accent-positive)] cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Notification Triggers */}
        <Card className="flex flex-col gap-[var(--space-4)]">
          <h2 className="text-base font-bold text-primary border-b border-[var(--color-border)] pb-2">
            Alert Delivery Thresholds
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--color-accent-positive)]" />
              <span className="text-primary">Instant notification for Attention Score &gt; 75</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--color-accent-positive)]" />
              <span className="text-primary">Daily market calm summary report (09:00 AM)</span>
            </label>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </>
  );
}
