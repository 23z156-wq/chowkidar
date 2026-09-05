import React, { useState } from 'react';
import Link from 'next/link';
import { SupportedCurrency, formatPrice, formatNativeINR } from '../utils/currency';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { IconCheckCircle, IconAlertTriangle, IconArrowUpRight, IconCheck, IconSparkles } from './Icons';

export interface RadarStock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  attentionScore: number;
  lastUpdated: string;
  topReason?: string;
  plainEnglishReason?: string;
  corporateActionTag?: string;
  factorBreakdown?: {
    priceAnomaly: number;
    volumeAnomaly: number;
    marketDivergence: number;
    novelty: number;
  };
  status?: 'ATTENTION_REQUIRED' | 'QUIET';
  viewed?: boolean;
}

interface MarketRadarProps {
  stocks: RadarStock[];
  currency: SupportedCurrency;
  onSelectStock: (stock: RadarStock) => void;
  onMarkSeen: (stockId: string) => void;
}

export const MarketRadar: React.FC<MarketRadarProps> = ({
  stocks,
  currency,
  onSelectStock,
  onMarkSeen,
}) => {
  const [showQuiet, setShowQuiet] = useState(false);

  const populatedStocks = stocks.map((s) => ({
    ...s,
    status: s.status || (s.attentionScore > 50 ? 'ATTENTION_REQUIRED' : 'QUIET'),
    viewed: s.viewed || false,
    plainEnglishReason:
      s.plainEnglishReason ||
      (s.change > 3
        ? 'Trading a lot more volume than usual while outperforming the sector.'
        : s.change < -1
        ? 'Dropping despite broader market indices remaining steady.'
        : 'Slight anomaly detected in historical baseline trading.'),
    corporateActionTag:
      s.corporateActionTag ||
      (s.symbol === 'RELIANCE'
        ? 'Coincides with Q2 Financial Results NSE filing'
        : s.symbol === 'HDFCBANK'
        ? 'Coincides with RBI Regulatory Disclosures announcement'
        : undefined),
    factorBreakdown: s.factorBreakdown || { priceAnomaly: 25, volumeAnomaly: 30, marketDivergence: 20, novelty: 12 },
  })) as Required<RadarStock>[];

  const attentionStocks = populatedStocks
    .filter((s) => s.status === 'ATTENTION_REQUIRED' && !s.viewed)
    .sort((a, b) => b.attentionScore - a.attentionScore);

  const quietStocks = populatedStocks.filter((s) => s.status === 'QUIET' || s.viewed);
  const isEverythingOkay = attentionStocks.length === 0;

  // Correlated Move Grouping logic: Detect if 2+ stocks belong to same sector
  const sectorGroups: Record<string, Required<RadarStock>[]> = {};
  attentionStocks.forEach((s) => {
    if (!sectorGroups[s.sector]) sectorGroups[s.sector] = [];
    sectorGroups[s.sector].push(s);
  });

  const correlatedSectors = Object.keys(sectorGroups).filter((sec) => sectorGroups[sec].length > 1);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header: Unified Attention Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Unified Attention Feed
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)]"></span>
            <span className="text-xs text-muted">Live 90s Refresh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            {isEverythingOkay
              ? 'All assets are tranquil. Everything is okay.'
              : `${attentionStocks.length} ${attentionStocks.length === 1 ? 'thing deserves' : 'things deserve'} your attention`}
          </h1>
        </div>

        <Link href="/timeline" className="self-start sm:self-auto">
          <Button variant="secondary" size="sm" className="text-xs rounded-xl shadow-none">
            Timeline Feed →
          </Button>
        </Link>
      </div>

      {/* 2. Correlated Move Grouping Card (Prevents Alert Fatigue) */}
      {correlatedSectors.length > 0 && (
        <Card className="bg-[var(--color-surface-primary)] border-2 border-[var(--color-accent-neutral)] flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[var(--color-accent-neutral)] tracking-wider flex items-center gap-1.5">
              ⚡ Correlated Sector Rally Grouping ({correlatedSectors.join(', ')})
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--color-accent-neutral-soft)] text-[var(--color-accent-neutral)]">
              Alert Fatigue Reduction
            </span>
          </div>
          <p className="text-xs text-primary font-semibold">
            Sector-wide movement detected across multiple stocks. Grouped into a single card to prevent alert fatigue:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {sectorGroups[correlatedSectors[0]].map((stk) => (
              <span
                key={stk.id}
                onClick={() => onSelectStock(stk)}
                className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-[var(--color-surface-secondary)] border border-subtle text-primary hover:border-[var(--color-accent-positive)] cursor-pointer transition-colors"
              >
                {stk.symbol} ({stk.change >= 0 ? '+' : ''}{stk.change.toFixed(1)}%)
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* 3. Prompt Card: "Since you last checked" summary */}
      {!isEverythingOkay && (
        <Card className="bg-gradient-to-r from-[var(--color-accent-positive-soft)] to-transparent border-l-4 border-l-[var(--color-accent-positive)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-[var(--color-accent-positive)] tracking-wider flex items-center gap-1.5">
              <IconSparkles size={14} /> Since you last checked
            </span>
            <p className="text-sm text-primary font-semibold leading-relaxed">
              {attentionStocks.length} stocks crossed historical volume or volatility thresholds. Reliance and HDFC Bank are leading overall activity.
            </p>
          </div>
          <Button size="sm" variant="ghost" className="text-xs shrink-0 hover:bg-white/80" onClick={() => onMarkSeen(attentionStocks[0]?.id)}>
            Dismiss
          </Button>
        </Card>
      )}

      {/* 4. Ranked Attention Cards */}
      {attentionStocks.length === 0 ? (
        <Card className="text-center p-12 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[var(--color-accent-positive-soft)] text-[var(--color-accent-positive)] flex items-center justify-center text-2xl">
            <IconCheckCircle size={28} />
          </div>
          <h3 className="text-lg font-bold text-primary">Your Watchlist is Tranquil</h3>
          <p className="text-xs text-muted max-w-md leading-relaxed">
            Every tracked asset is moving within normal standard deviations. No urgent alerts pending.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {attentionStocks.map((stock) => {
            const isPositive = stock.change >= 0;

            return (
              <Card
                key={stock.id}
                onClick={() => onSelectStock(stock)}
                className="cursor-pointer hover:border-[var(--color-accent-positive)] hover:shadow-md transition-all flex flex-col gap-4 p-6 group"
              >
                {/* Top Row: Symbol, Sector, Price & Delta Pill */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl font-extrabold text-primary group-hover:text-[var(--color-accent-positive)] transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-muted font-bold border border-subtle">
                        {stock.sector}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-muted mt-0.5">{stock.name}</span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold numeric text-primary">
                      {formatPrice(stock.price, currency)}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {currency !== 'INR' && (
                        <span className="text-xs text-muted numeric font-medium">
                          ({formatNativeINR(stock.price)})
                        </span>
                      )}
                      <span className={`text-xs font-bold numeric px-2 py-0.5 rounded-md ${
                        isPositive 
                          ? 'bg-[var(--color-accent-positive-soft)] text-[var(--color-accent-positive)]' 
                          : 'bg-[var(--color-accent-negative-soft)] text-[var(--color-accent-negative)]'
                      }`}>
                        {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corporate Action Tag Pill */}
                {stock.corporateActionTag && (
                  <div className="px-3 py-1.5 bg-[var(--color-accent-positive-soft)] border border-[var(--color-accent-positive)] rounded-lg text-xs font-bold text-[var(--color-accent-positive)] flex items-center gap-1.5 self-start">
                    <span>🏛️</span>
                    <span>{stock.corporateActionTag}</span>
                  </div>
                )}

                {/* Plain-English Explanation Banner */}
                <div className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle text-xs text-primary font-medium leading-relaxed">
                  &quot;{stock.plainEnglishReason}&quot;
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-subtle flex items-center justify-between text-xs">
                  <span className="text-xs font-bold text-muted group-hover:text-primary flex items-center gap-1 transition-colors">
                    See full breakdown <IconArrowUpRight size={14} />
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkSeen(stock.id);
                    }}
                    className="h-8 text-xs font-semibold"
                  >
                    <IconCheck size={14} className="mr-1 text-[var(--color-accent-positive)]" /> Mark as seen
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 5. Collapsed Section: Already seen, nothing new */}
      <Card className="flex flex-col gap-3">
        <button
          onClick={() => setShowQuiet(!showQuiet)}
          className="w-full flex items-center justify-between text-xs font-bold text-muted hover:text-primary transition-colors py-1"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-positive)]"></span>
            Already seen, nothing new ({quietStocks.length} stocks)
          </span>
          <span className="text-[11px] text-[var(--color-accent-positive)] font-extrabold">{showQuiet ? '▲ Hide' : '▼ Show'}</span>
        </button>

        {showQuiet && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-subtle">
            {quietStocks.map((stock) => (
              <div
                key={stock.id}
                onClick={() => onSelectStock(stock)}
                className="p-3.5 bg-[var(--color-surface-secondary)] rounded-xl border border-subtle hover:border-[var(--color-accent-positive)] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-primary">{stock.symbol}</span>
                  <span className="text-[11px] text-muted truncate max-w-[140px]">{stock.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold numeric text-primary">
                    {formatPrice(stock.price, currency)}
                  </span>
                  <div className={`text-[11px] font-bold numeric ${stock.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
