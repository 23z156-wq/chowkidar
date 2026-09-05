import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { IconX, IconSparkles } from './Icons';

interface FactorBreakdown {
  priceAnomaly: number;
  volumeAnomaly: number;
  marketDivergence: number;
  novelty: number;
}

interface WhyExplanationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  attentionScore: number;
  factorBreakdown: FactorBreakdown;
  explanationText?: string;
  corporateActionTag?: string;
}

export const WhyExplanationPanel: React.FC<WhyExplanationPanelProps> = ({
  isOpen,
  onClose,
  symbol,
  attentionScore,
  factorBreakdown,
  explanationText,
  corporateActionTag,
}) => {
  const [showFormula, setShowFormula] = useState(false);

  if (!isOpen) return null;

  const defaultExplanation = explanationText || `${symbol} stands out because its movement is significantly larger than usual and it's outperforming the sector on unusually high volume.`;

  const total = 
    factorBreakdown.priceAnomaly + 
    factorBreakdown.volumeAnomaly + 
    factorBreakdown.marketDivergence + 
    factorBreakdown.novelty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-md bg-[var(--color-surface-primary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-xl relative flex flex-col gap-[var(--space-5)]">
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2">
            <IconSparkles className="text-[var(--color-accent-neutral)]" size={20} />
            <h2 className="text-base font-bold text-primary">Score Explanation — {symbol}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-primary hover:bg-[var(--color-surface-secondary)] transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Attention Score Banner */}
        <div className="flex flex-col items-center justify-center py-3 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
          <span className="text-[var(--text-xs)] font-semibold text-muted uppercase tracking-wider">Attention Score</span>
          <div className="text-3xl font-extrabold numeric text-primary mt-1">
            {attentionScore} <span className="text-sm font-normal text-muted">/ 100</span>
          </div>
        </div>

        {/* Corporate Action Tagging Banner */}
        {corporateActionTag && (
          <div className="p-3 bg-[var(--color-accent-positive-soft)] border border-[var(--color-accent-positive)] rounded-[var(--radius-sm)] flex items-start gap-2 text-xs font-bold text-[var(--color-accent-positive)]">
            <span className="shrink-0 text-base">🏛️</span>
            <div>
              <span className="text-[10px] uppercase font-black text-muted block mb-0.5">NSE Corporate Announcement</span>
              {corporateActionTag}
            </div>
          </div>
        )}

        {/* Additive Breakdown Table */}
        <div className="flex flex-col gap-2">
          <span className="text-[var(--text-xs)] font-bold uppercase text-muted">Additive Factors</span>
          <div className="flex flex-col divide-y divide-[var(--color-border)] text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-primary">Price Anomaly</span>
              <span className="numeric font-bold text-primary">+{factorBreakdown.priceAnomaly}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-primary">Volume Anomaly</span>
              <span className="numeric font-bold text-primary">+{factorBreakdown.volumeAnomaly}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-primary">Market Divergence</span>
              <span className="numeric font-bold text-primary">+{factorBreakdown.marketDivergence}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-primary">Novelty / New Signal</span>
              <span className="numeric font-bold text-primary">+{factorBreakdown.novelty}</span>
            </div>
            <div className="flex items-center justify-between py-2 font-bold bg-[var(--color-surface-secondary)] px-2 rounded">
              <span className="text-primary">Total Score</span>
              <span className="numeric text-[var(--color-accent-neutral)]">{total}</span>
            </div>
          </div>
        </div>

        {/* AI Explanation Box */}
        <div className="p-3 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-primary leading-relaxed font-medium">
          &quot;{defaultExplanation}&quot;
        </div>

        {/* Expandable Formula Detail */}
        <div className="flex flex-col">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="text-xs text-muted hover:text-primary font-semibold flex items-center justify-between py-1"
          >
            <span>How we calculated this</span>
            <span>{showFormula ? '▲' : '▼'}</span>
          </button>
          {showFormula && (
            <div className="text-[var(--text-xs)] text-muted bg-[var(--color-surface-secondary)] p-3 rounded mt-1 font-mono leading-relaxed border border-[var(--color-border)]">
              Score = w_p · σ(Price) + w_v · σ(Vol) + w_d · σ(Divergence) + Novelty_Bonus.<br/>
              Standardized against a 4-hour historical baseline rolling window.
            </div>
          )}
        </div>

        {/* Close Button */}
        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      </Card>
    </div>
  );
};
