import { CURRENCIES, type CurrencyCode } from '@/types/organization'

/**
 * Format a number as currency based on the organization's currency settings
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'VND'): string {
  const currency = CURRENCIES[currencyCode]
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currencyCode === 'VND' || currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'VND' || currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
  }).format(amount)
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode: CurrencyCode = 'VND'): string {
  return CURRENCIES[currencyCode].symbol
}

/**
 * Get currency name
 */
export function getCurrencyName(currencyCode: CurrencyCode = 'VND'): string {
  return CURRENCIES[currencyCode].name
}

