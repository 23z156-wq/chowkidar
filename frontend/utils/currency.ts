export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'SGD' | 'AED';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateFromINR: number; // 1 INR = rateFromINR units of Currency
  flag: string;
}

export const CURRENCY_CONFIG: Record<SupportedCurrency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (Native)', rateFromINR: 1, flag: '🇮🇳' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromINR: 0.0119, flag: '🇺🇸' }, // ~₹83.80 / USD
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateFromINR: 0.0108, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateFromINR: 0.0091, flag: '🇬🇧' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateFromINR: 1.76, flag: '🇯🇵' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateFromINR: 0.0156, flag: '🇸🇬' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateFromINR: 0.0439, flag: '🇦🇪' },
};

export function formatPrice(priceInINR: number, currency: SupportedCurrency = 'INR'): string {
  const config = CURRENCY_CONFIG[currency];
  const converted = priceInINR * config.rateFromINR;
  
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(converted);
  }

  if (currency === 'JPY') {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${config.symbol}${converted.toFixed(2)}`;
}

export function formatNativeINR(priceInINR: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(priceInINR);
}

export function getExchangeRateLabel(currency: SupportedCurrency): string {
  if (currency === 'INR') return 'Native NSE/BSE Pricing';
  const inrPerUnit = (1 / CURRENCY_CONFIG[currency].rateFromINR).toFixed(2);
  return `₹${inrPerUnit} / ${currency}`;
}

