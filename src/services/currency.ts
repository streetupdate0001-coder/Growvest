import { CurrencyCode } from '../types';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateToUsd: number; // 1 USD in this currency
  locale: string;
  decimals: number;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1.0, locale: 'en-US', decimals: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 0.92, locale: 'de-DE', decimals: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 0.79, locale: 'en-GB', decimals: 2 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateToUsd: 1.36, locale: 'en-CA', decimals: 2 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', rateToUsd: 1.54, locale: 'en-AU', decimals: 2 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateToUsd: 0.88, locale: 'de-CH', decimals: 2 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUsd: 154.20, locale: 'ja-JP', decimals: 0 },
};

export function formatCurrency(
  amountInUsd: number,
  targetCurrency: CurrencyCode | string = 'USD',
  showSymbol: boolean = true
): string {
  const code = (targetCurrency as CurrencyCode) || 'USD';
  const config = CURRENCY_CONFIGS[code] || CURRENCY_CONFIGS.USD;
  const convertedAmount = amountInUsd * config.rateToUsd;

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(convertedAmount);

    return showSymbol ? `${config.symbol}${formatted}` : formatted;
  } catch (_e) {
    const fixed = convertedAmount.toFixed(config.decimals);
    return showSymbol ? `${config.symbol}${fixed}` : fixed;
  }
}

export function formatCrypto(
  amount: number,
  symbol: string,
  precision: number = 4
): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: precision,
  }).format(amount);
  return `${formatted} ${symbol.toUpperCase()}`;
}
