import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // LeanSubs Brand Colors
        brand: {
          50: { value: '#e8f5ff' },
          100: { value: '#d0ebff' },
          200: { value: '#a3d9ff' },
          300: { value: '#76c7ff' },
          400: { value: '#4CA9FF' }, // Primary
          500: { value: '#3b95e6' },
          600: { value: '#2a81cc' },
          700: { value: '#1e6bb3' },
          800: { value: '#135599' },
          900: { value: '#0a3f80' },
        },
        secondary: {
          50: { value: '#f5f0ff' },
          100: { value: '#ebe1ff' },
          200: { value: '#d7c3ff' },
          300: { value: '#c3a5ff' },
          400: { value: '#af87ff' },
          500: { value: '#B794F4' }, // Lavender
          600: { value: '#9c7cd9' },
          700: { value: '#8164bf' },
          800: { value: '#664ca6' },
          900: { value: '#4b348c' },
        },
        accent: {
          50: { value: '#f8fafc' },
          100: { value: '#f1f5f9' },
          200: { value: '#e2e8f0' },
          300: { value: '#cbd5e1' },
          400: { value: '#94a3b8' },
          500: { value: '#64748b' },
          600: { value: '#475569' },
          700: { value: '#334155' }, // Slate gray
          800: { value: '#1e293b' },
          900: { value: '#0f172a' }, // Graphite
        },
        success: {
          50: { value: '#f0fdf4' },
          100: { value: '#dcfce7' },
          200: { value: '#bbf7d0' },
          300: { value: '#86efac' },
          400: { value: '#4ade80' },
          500: { value: '#22C55E' }, // Spring green
          600: { value: '#16a34a' },
          700: { value: '#15803d' },
          800: { value: '#166534' },
          900: { value: '#14532d' },
        },
        warning: {
          50: { value: '#fff7ed' },
          100: { value: '#ffedd5' },
          200: { value: '#fed7aa' },
          300: { value: '#FDBA74' }, // Apricot orange
          400: { value: '#fb923c' },
          500: { value: '#f97316' },
          600: { value: '#ea580c' },
          700: { value: '#c2410c' },
          800: { value: '#9a3412' },
          900: { value: '#7c2d12' },
        },
        danger: {
          50: { value: '#fef2f2' },
          100: { value: '#fee2e2' },
          200: { value: '#fecaca' },
          300: { value: '#fca5a5' },
          400: { value: '#f87171' }, // Coral red
          500: { value: '#ef4444' },
          600: { value: '#dc2626' },
          700: { value: '#b91c1c' },
          800: { value: '#991b1b' },
          900: { value: '#7f1d1d' },
        },
        light: {
          value: '#F1F5F9', // Mist gray
        },
        dark: {
          value: '#0F172A', // Graphite
        },
      },
      fonts: {
        heading: { value: "'Poppins', 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
        body: { value: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      },
      radii: {
        base: { value: '0.75rem' },
        sm: { value: '0.5rem' },
        md: { value: '0.75rem' },
        lg: { value: '1rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
      },
      shadows: {
        sm: { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
        base: { value: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)' },
        md: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)' },
        lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)' },
        xl: { value: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' },
      },
      borders: {
        subtle: { value: '1px solid #E2E8F0' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
export const theme = system

