import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconCheck } from '../components/Icons';

export interface EventItem {
  id: string;
  symbol: string;
  type: string;
  title: string;
  description: string;
  status: 'DETECTED' | 'SURFACED' | 'VIEWED' | 'RESOLVED';
  timestamp: string;
  dayGroup?: 'Today' | 'Yesterday' | 'Earlier';
  severity?: 'high' | 'medium' | 'normal';
  corporateActionTag?: string | null;
  reversionNote?: string | null;
}

export default function TimelinePage() {
  const { data, isLoading, mutate } = useSWR<{ events: EventItem[] }>('/api/events', fetcher);
  const [markedAll, setMarkedAll] = useState(false);

  const handleMarkAllSeen = () => {
    setMarkedAll(true);
    if (data) {
      const updated = data.events.map((e) => ({ ...e, status: 'VIEWED' as const }));
      mutate({ events: updated }, false);
    }
  };

  const rawEvents: EventItem[] = data?.events || [
    {
      id: 'e1',
      symbol: 'RELIANCE',
      type: 'VOLUME_SPIKE',
      title: 'Reliance entered HIGH ATTENTION',
      description: 'Volume velocity 2.8x normal rolling average.',
      status: 'SURFACED',
      timestamp: new Date().toISOString(),
      dayGroup: 'Today',
      severity: 'high',
      corporateActionTag: 'Coincides with Q2 Financial Results NSE filing',
    },
    {
      id: 'e2',
      symbol: 'HDFCBANK',
      type: 'MARKET_DIVERGENCE',
      title: 'HDFC Bank crossed observed range',
      description: 'Price diverged -1.2% while NIFTY traded +0.8%.',
      status: 'SURFACED',
      timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      dayGroup: 'Today',
      severity: 'high',
      corporateActionTag: 'Coincides with RBI Regulatory Disclosures announcement',
    },
    {
      id: 'e3',
      symbol: 'TCS',
      type: 'VOLATILITY',
      title: 'TCS became unusually volatile',
      description: 'Intraday swing exceeded 2.2 sigma.',
      status: 'RESOLVED',
      timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      dayGroup: 'Today',
      severity: 'medium',
      reversionNote: 'Auto-resolved: Spiked +4.5%, returned to normal baseline 35 min later',
    },
    {
      id: 'e4',
      symbol: 'INFY',
      type: 'BASELINE_RETURN',
      title: 'INFY returned to normal baseline',
      description: 'Trading activity normalized after earlier spike.',
      status: 'RESOLVED',
      timestamp: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
      dayGroup: 'Yesterday',
      severity: 'normal',
      reversionNote: 'Auto-resolved on reversion to baseline parameters',
    },
  ];

  const eventsList = rawEvents.map((evt) => {
    let dg = evt.dayGroup;
    if (!dg) {
      const diffHours = (Date.now() - new Date(evt.timestamp).getTime()) / (1000 * 3600);
      dg = diffHours < 24 ? 'Today' : diffHours < 48 ? 'Yesterday' : 'Earlier';
    }
    return {
      ...evt,
      dayGroup: dg,
      severity: evt.severity || 'high',
      status: markedAll ? ('VIEWED' as const) : evt.status,
    };
  });

  const groups = ['Today', 'Yesterday', 'Earlier'] as const;

  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-negative)] inline-block shrink-0" />;
      case 'medium':
        return <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-neutral)] inline-block shrink-0" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-positive)] inline-block shrink-0" />;
    }
  };

  return (
    <>
      <Head>
        <title>Change Timeline — Chowkidar</title>
      </Head>

      <div className="flex flex-col gap-6 max-w-[920px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-xs text-muted hover:text-primary font-bold">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-black text-primary tracking-tight mt-1">Change Timeline &amp; State Machine</h1>
            <p className="text-xs text-muted font-medium mt-0.5">
              Event Lifecycle: <code className="text-primary font-bold font-mono">DETECTED → SURFACED → VIEWED → RESOLVED</code>
            </p>
          </div>

          <Button size="sm" variant="secondary" onClick={handleMarkAllSeen} className="self-start sm:self-auto text-xs font-semibold">
            <IconCheck size={14} className="mr-1 text-[var(--color-accent-positive)]" />
            Mark all as seen
          </Button>
        </div>

        {/* Grouped Feed */}
        <div className="flex flex-col gap-6">
          {groups.map((group) => {
            const groupEvents = eventsList.filter((e) => e.dayGroup === group);
            if (groupEvents.length === 0) return null;

            return (
              <div key={group} className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted px-1">
                  {group} ({groupEvents.length})
                </span>

                <Card noPadding className="divide-y divide-[var(--color-border)] overflow-hidden">
                  {groupEvents.map((evt) => (
                    <Link
                      key={evt.id}
                      href={`/stock/${evt.symbol}`}
                      className="p-4 flex flex-col gap-2 hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getSeverityDot(evt.severity)}</div>
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-primary group-hover:text-[var(--color-accent-positive)] transition-colors">
                                {evt.symbol}
                              </span>
                              <span className="text-xs text-primary font-semibold">{evt.title}</span>
                            </div>
                            <p className="text-xs text-muted font-medium leading-relaxed">{evt.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-subtle">
                          <span className="text-muted numeric">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-extrabold uppercase ${
                            evt.status === 'RESOLVED'
                              ? 'bg-[var(--color-accent-positive-soft)] text-[var(--color-accent-positive)] border-[var(--color-accent-positive)]'
                              : 'bg-[var(--color-surface-secondary)] text-muted border-subtle'
                          }`}>
                            {evt.status}
                          </span>
                        </div>
                      </div>

                      {/* Corporate Action Tag */}
                      {evt.corporateActionTag && (
                        <div className="ml-5 text-[11px] font-bold text-[var(--color-accent-positive)] bg-[var(--color-accent-positive-soft)] px-2.5 py-1 rounded-md border border-[var(--color-accent-positive)] self-start flex items-center gap-1.5">
                          <span>🏛️</span>
                          <span>{evt.corporateActionTag}</span>
                        </div>
                      )}

                      {/* Auto-resolve on Reversion Badge */}
                      {evt.reversionNote && (
                        <div className="ml-5 text-[11px] font-bold text-[var(--color-accent-neutral)] bg-[var(--color-accent-neutral-soft)] px-2.5 py-1 rounded-md border border-[var(--color-accent-neutral)] self-start flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>{evt.reversionNote}</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
