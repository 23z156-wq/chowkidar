import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Compass, LayoutDashboard, User, Clock } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { SupportedCurrency, CURRENCY_CONFIG } from '../../utils/currency';
import { AIChatWidget } from '../AIChatWidget';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();

  const navItems = [
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'You', href: '/you', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/' && router.pathname === '/') return true;
    if (path !== '/' && router.pathname.startsWith(path)) return true;
    return false;
  };

  const currencies: SupportedCurrency[] = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'AED'];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] antialiased relative">
      {/* Top Header - Groww Minimal Style */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface-primary)] border-b border-[var(--color-border)] px-4 sm:px-8 shadow-sm">
        <div className="max-w-[920px] mx-auto h-[60px] flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="font-black text-xl text-primary tracking-tight flex items-center gap-2.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[var(--color-accent-positive)] ring-4 ring-[var(--color-accent-positive-soft)] animate-pulse"></span>
            <span>Chowkidar</span>
          </Link>

          {/* Desktop Nav Tabs */}
          <nav className="hidden sm:flex items-center gap-1 bg-[var(--color-surface-secondary)] p-1 rounded-xl border border-[var(--color-border)]">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                    active
                      ? 'bg-[var(--color-surface-primary)] text-[var(--color-accent-positive)] shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-primary'
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} className={active ? 'text-[var(--color-accent-positive)]' : 'text-muted'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Currency Selector Pill + Timeline */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Currency Selector Dropdown Pill */}
            <div className="flex items-center gap-1.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] px-3 py-1.5 rounded-xl hover:border-[var(--color-accent-positive)] transition-colors shadow-sm cursor-pointer">
              <span className="text-xs font-bold">{CURRENCY_CONFIG[currency].flag}</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="bg-transparent text-xs font-black text-primary outline-none cursor-pointer border-none p-0 pr-1 font-mono"
              >
                {currencies.map((c) => (
                  <option key={c} value={c} className="bg-[var(--color-surface-primary)] text-primary font-bold">
                    {CURRENCY_CONFIG[c].symbol} {c}
                  </option>
                ))}
              </select>
            </div>

            <Link href="/timeline" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors border border-[var(--color-border)] px-3.5 py-1.5 rounded-xl bg-[var(--color-surface-primary)] hover:border-[var(--color-accent-positive)] shadow-sm">
              <Clock size={14} className="text-[var(--color-accent-neutral)]" />
              <span>Timeline</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[920px] mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12">
        {children}
      </main>

      {/* Floating Context-Aware AI Chatbot Widget */}
      <AIChatWidget />

      {/* Mobile Bottom Tab Bar (3 Tabs: Explore | Dashboard | You) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface-primary)] border-t border-[var(--color-border)] h-[64px] z-40 flex items-center justify-around px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                active ? 'text-[var(--color-accent-positive)] font-bold' : 'text-[var(--color-text-muted)]'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[11px] font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
