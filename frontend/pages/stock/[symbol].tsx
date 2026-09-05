import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../utils/fetcher';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { WhyExplanationPanel } from '../../components/WhyExplanationPanel';
import { IconSparkles, IconArrowUpRight, IconTrash } from '../../components/Icons';
import { useCurrency } from '../../context/CurrencyContext';
import { formatPrice, formatNativeINR, CURRENCY_CONFIG } from '../../utils/currency';

export default function StockDetailPage() {
  const router = useRouter();
  const { symbol } = router.query;
  const { currency } = useCurrency();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [hoverPoint, setHoverPoint] = useState<{ time: string; price: number; x: number; y: number } | null>(null);
  const [isWhyPanelOpen, setIsWhyPanelOpen] = useState(false);

  const { data, error, isLoading } = useSWR(
    symbol ? `/api/stocks/${symbol}` : null,
    fetcher
  );

  if (isLoading || !symbol) {
    return (
      <div className="flex flex-col gap-5 max-w-[920px] mx-auto">
        <div className="h-6 w-24 bg-surface-primary rounded animate-pulse" />
        <Card className="h-64 animate-pulse flex flex-col justify-center items-center">
          <span className="text-muted text-xs font-semibold">Loading market telemetry &amp; live quotes...</span>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center max-w-[920px] mx-auto">
        <Card className="p-8 w-full flex flex-col items-center gap-4">
          <h2 className="text-lg font-bold text-primary">Stock telemetry unavailable</h2>
          <p className="text-sm text-muted">We could not fetch information for symbol &quot;{symbol}&quot;.</p>
          <Link href="/">
            <Button variant="primary">Back to Home Radar</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isPositive = data.changePercent >= 0;
  const historyList: { time: string; price: number }[] = data.histories?.[timeframe] || [
    { time: '09:15', price: data.priceINR * 0.97 },
    { time: '12:00', price: data.priceINR * 0.985 },
    { time: '15:30', price: data.priceINR },
  ];

  // Interactive Chart Calculation
  const prices = historyList.map((h) => h.price);
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;
  const width = 600;
  const height = 200;

  const chartPoints = historyList.map((h, i) => {
    const x = (i / (historyList.length - 1)) * width;
    const y = height - ((h.price - minPrice) / (maxPrice - minPrice)) * (height - 30) - 15;
    return { x, y, price: h.price, time: h.time };
  });

  const polylineString = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    
    // Find closest data point
    let closest = chartPoints[0];
    let minDiff = Math.abs(mouseX - closest.x);
    for (let i = 1; i < chartPoints.length; i++) {
      const diff = Math.abs(mouseX - chartPoints[i].x);
      if (diff < minDiff) {
        minDiff = diff;
        closest = chartPoints[i];
      }
    }
    setHoverPoint(closest);
  };

  return (
    <>
      <Head>
        <title>{data.symbol} — Stock Detail — Chowkidar</title>
      </Head>

      <div className="flex flex-col gap-6 max-w-[920px] mx-auto">
        {/* Navigation back */}
        <Link 
          href="/"
          className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1 font-bold self-start"
        >
          ← Back to Dashboard
        </Link>

        {/* Header Block */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                <span>{data.sector} · NSE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-positive)]"></span>
                <span className="text-[var(--color-accent-positive)] font-extrabold">Twelve Data Feed Live</span>
              </span>
              <h1 className="text-3xl font-black text-primary tracking-tight mt-0.5">{data.symbol}</h1>
              <span className="text-xs text-muted font-medium mt-0.5">{data.name}</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-3xl font-black numeric text-primary">
                {formatPrice(hoverPoint ? hoverPoint.price : data.priceINR, currency)}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {currency !== 'INR' && (
                  <span className="text-xs text-muted numeric font-semibold">
                    ({formatNativeINR(hoverPoint ? hoverPoint.price : data.priceINR)})
                  </span>
                )}
                <span className={`text-xs font-extrabold numeric px-2.5 py-0.5 rounded-md ${
                  isPositive 
                    ? 'bg-[var(--color-accent-positive-soft)] text-[var(--color-accent-positive)]' 
                    : 'bg-[var(--color-accent-negative-soft)] text-[var(--color-accent-negative)]'
                }`}>
                  {isPositive ? '+' : ''}{data.changePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted border-t border-subtle pt-2.5 flex items-center justify-between font-medium">
            <span>Display Currency: {CURRENCY_CONFIG[currency].name} ({CURRENCY_CONFIG[currency].flag})</span>
            <span>Twelve Data &amp; Groq Llama 3.3 Connected</span>
          </div>
        </Card>

        {/* Price Chart Block (Functional & Interactive) */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Price Movement — {timeframe} Timeline
              </span>
              {hoverPoint ? (
                <span className="text-xs font-bold text-primary numeric">
                  Hovering: {hoverPoint.time} · {formatPrice(hoverPoint.price, currency)}
                </span>
              ) : (
                <span className="text-[11px] text-muted font-medium">
                  Hover cursor over chart to inspect timestamps
                </span>
              )}
            </div>

            {/* Timeframe Toggler Buttons */}
            <div className="flex gap-1 bg-[var(--color-surface-secondary)] p-1 rounded-xl border border-subtle">
              {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setHoverPoint(null);
                  }}
                  className={`text-xs font-extrabold px-3 py-1 rounded-lg transition-all ${
                    timeframe === tf
                      ? 'bg-[var(--color-surface-primary)] text-[var(--color-accent-positive)] shadow-sm'
                      : 'text-muted hover:text-primary'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Sparkline Chart */}
          <div className="w-full h-[220px] pt-4 pb-2 relative">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-full overflow-visible cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverPoint(null)}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#00b386' : '#e5484d'} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={isPositive ? '#00b386' : '#e5484d'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="var(--color-border)" strokeDasharray="4 4" strokeWidth="1" />

              {/* Gradient Area Fill */}
              <polygon
                points={`0,${height} ${polylineString} ${width},${height}`}
                fill="url(#chartGradient)"
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke={isPositive ? '#00b386' : '#e5484d'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineString}
              />

              {/* Hover Dot & Guideline */}
              {hoverPoint && (
                <g>
                  <line 
                    x1={hoverPoint.x} y1="0" x2={hoverPoint.x} y2={height} 
                    stroke="var(--color-accent-positive)" strokeDasharray="3 3" strokeWidth="1.5" 
                  />
                  <circle 
                    cx={hoverPoint.x} cy={hoverPoint.y} r="6" 
                    fill="var(--color-accent-positive)" stroke="#ffffff" strokeWidth="2.5" 
                  />
                </g>
              )}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[11px] text-muted font-bold font-mono border-t border-subtle pt-2">
            <span>Low: {formatPrice(minPrice, currency)}</span>
            <span>High: {formatPrice(maxPrice, currency)}</span>
          </div>
        </Card>

        {/* Why this is on your radar (Groq AI explanation) */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-primary flex items-center gap-2">
              Why this is on your radar
            </h2>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsWhyPanelOpen(true)}
              className="text-xs font-bold"
            >
              <IconSparkles size={14} className="mr-1.5 text-[var(--color-accent-neutral)]" />
              Why {data.attentionScore}/100? →
            </Button>
          </div>

          {/* Real-time Groq AI Output Box */}
          <div className="p-4 bg-[var(--color-accent-positive-soft)] rounded-xl border border-[var(--color-accent-positive)] text-xs text-primary font-semibold leading-relaxed flex items-start gap-3">
            <IconSparkles size={18} className="text-[var(--color-accent-positive)] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--color-accent-positive)] block mb-1">
                Groq Llama 3.3 Real-time Explanation
              </span>
              &quot;{data.explanationText}&quot;
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle">
              <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Price move</span>
              <div className="text-sm font-extrabold text-primary mt-1">HIGH (+{data.factorBreakdown.priceAnomaly})</div>
            </div>
            <div className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle">
              <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Volume</span>
              <div className="text-sm font-extrabold text-primary mt-1">HIGH (+{data.factorBreakdown.volumeAnomaly})</div>
            </div>
            <div className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle">
              <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Divergence</span>
              <div className="text-sm font-extrabold text-primary mt-1">HIGH (+{data.factorBreakdown.marketDivergence})</div>
            </div>
            <div className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle">
              <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Novelty</span>
              <div className="text-sm font-extrabold text-primary mt-1">NEW (+{data.factorBreakdown.novelty})</div>
            </div>
          </div>
        </Card>

        {/* What changed since your last visit */}
        <Card className="flex flex-col gap-3">
          <h2 className="text-base font-black text-primary">
            What changed since your last visit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle flex justify-between items-center">
              <span className="text-muted font-bold">Price Shift:</span>
              <span className="numeric font-bold text-primary">
                {formatPrice(data.lastVisitPriceINR, currency)} → {formatPrice(data.priceINR, currency)}
              </span>
            </div>
            <div className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle flex justify-between items-center">
              <span className="text-muted font-bold">Volume Velocity:</span>
              <span className="numeric font-bold text-primary">
                {data.lastVisitVolumeMultiplier}× → {data.currentVolumeMultiplier}× normal
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <Button variant="danger" size="md">
            <IconTrash size={16} className="mr-2" />
            Remove from Watchlist
          </Button>
        </div>
      </div>

      {/* Slide-over / Modal for Why Explanation */}
      <WhyExplanationPanel
        isOpen={isWhyPanelOpen}
        onClose={() => setIsWhyPanelOpen(false)}
        symbol={data.symbol}
        attentionScore={data.attentionScore}
        factorBreakdown={data.factorBreakdown}
        explanationText={data.explanationText}
      />
    </>
  );
}
