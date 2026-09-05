export interface LiveQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  volume: number;
  previous_close: number;
  day_high: number;
  day_low: number;
  fifty_two_week?: {
    high: number;
    low: number;
  };
  timestamp: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY || '7683b71f12cf4957b8d27947cc9065cc';

export async function fetchLiveQuotes(symbols: string[]): Promise<Record<string, LiveQuote> | null> {
  try {
    const symbolStr = symbols.join(',');
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbolStr)}&apikey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    // If single symbol, Twelve Data returns object; if multiple, returns map
    const result: Record<string, LiveQuote> = {};

    if (data.symbol) {
      result[data.symbol] = {
        symbol: data.symbol,
        name: data.name || data.symbol,
        price: parseFloat(data.close || data.price || '0'),
        change: parseFloat(data.change || '0'),
        percent_change: parseFloat(data.percent_change || '0'),
        volume: parseInt(data.volume || '0', 10),
        previous_close: parseFloat(data.previous_close || '0'),
        day_high: parseFloat(data.high || '0'),
        day_low: parseFloat(data.low || '0'),
        timestamp: data.datetime || new Date().toISOString(),
      };
      return result;
    }

    for (const key of Object.keys(data)) {
      const item = data[key];
      if (item && item.symbol) {
        result[item.symbol] = {
          symbol: item.symbol,
          name: item.name || item.symbol,
          price: parseFloat(item.close || item.price || '0'),
          change: parseFloat(item.change || '0'),
          percent_change: parseFloat(item.percent_change || '0'),
          volume: parseInt(item.volume || '0', 10),
          previous_close: parseFloat(item.previous_close || '0'),
          day_high: parseFloat(item.high || '0'),
          day_low: parseFloat(item.low || '0'),
          timestamp: item.datetime || new Date().toISOString(),
        };
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  } catch (err) {
    console.warn('Failed to fetch from Twelve Data, using fallback', err);
    return null;
  }
}

