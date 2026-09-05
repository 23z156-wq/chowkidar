import Head from 'next/head';
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';
import { MarketRadar, RadarStock } from '../components/MarketRadar';
import { useCurrency } from '../context/CurrencyContext';

export default function Home() {
  const { currency } = useCurrency();
  const { data, error, isLoading } = useSWR<{ stocks: RadarStock[] }>('/api/watchlists/default', fetcher, {
    refreshInterval: 90000,
  });

  return (
    <>
      <Head>
        <title>Home - Chowkidar</title>
      </Head>
      <div className="flex flex-col gap-[var(--space-6)]">
        {isLoading && (
          <div className="p-6 bg-surface-primary border border-subtle rounded-[var(--radius-lg)] shadow-sm animate-pulse">
            <div className="h-6 bg-surface-secondary rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-surface-secondary rounded w-2/4"></div>
          </div>
        )}
        
        {error && (
          <div className="p-6 bg-surface-primary border border-subtle rounded-[var(--radius-lg)] shadow-sm flex flex-col items-center justify-center gap-2">
            <span className="text-negative font-bold">Failed to load radar data</span>
            <button className="text-sm text-primary underline" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {data && (
          <MarketRadar 
            stocks={data.stocks} 
            currency={currency}
            onSelectStock={(stock) => window.location.href = `/stock/${stock.symbol}`}
            onMarkSeen={(id) => console.log('Mark seen:', id)}
          />
        )}
      </div>
    </>
  );
}
