export interface OrganizationSettings {
  currency: CurrencyCode
  sessionDefaultLengthMinutes: number
}

export interface Organization {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  settings: OrganizationSettings
}

export interface UserOrganization {
  userId: string
  organizationId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface CreateOrganizationInput {
  name: string
}

export interface UpdateOrganizationSettingsInput {
  currency?: CurrencyCode
  sessionDefaultLengthMinutes?: number
}

export type CurrencyCode = 'USD' | 'VND' | 'EUR' | 'GBP' | 'JPY' | 'KRW' | 'SGD'

export interface Currency {
  code: CurrencyCode
  symbol: string
  name: string
  locale: string
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
}

