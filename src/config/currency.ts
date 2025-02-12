import { useEffect, useState } from 'react';

export type CurrencyCode = 'GBP' | 'USD' | 'EUR';

export interface CurrencyConfig {
  symbol: string;
  rate: number;
  suffix: string;
  lastUpdated?: string;
}

export interface ExchangeRates {
  [key: string]: number;
  timestamp: number;
}

const CURRENCY_CONFIG: Record<CurrencyCode, CurrencyConfig> = {
  GBP: {
    symbol: '£',
    rate: 1,
    suffix: 'k'
  },
  USD: {
    symbol: '$',
    rate: 1.26,
    suffix: 'k'
  },
  EUR: {
    symbol: '€',
    rate: 1.17,
    suffix: 'k'
  }
};

// Function to check if rates need updating (24 hour check)
const needsRateUpdate = (): boolean => {
  const lastUpdate = localStorage.getItem('exchangeRatesLastUpdate');
  if (!lastUpdate) return true;
  
  const lastUpdateTime = new Date(lastUpdate).getTime();
  const currentTime = new Date().getTime();
  const hoursSinceUpdate = (currentTime - lastUpdateTime) / (1000 * 60 * 60);
  
  return hoursSinceUpdate >= 24;
};

// Fetch latest exchange rates
const fetchExchangeRates = async (): Promise<void> => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
    const data = await response.json();
    
    // Update rates in config
    CURRENCY_CONFIG.USD.rate = Number(data.rates.USD);
    CURRENCY_CONFIG.EUR.rate = Number(data.rates.EUR);
    
    // Store last update time
    localStorage.setItem('exchangeRatesLastUpdate', new Date().toISOString());
    localStorage.setItem('exchangeRates', JSON.stringify({
      USD: data.rates.USD,
      EUR: data.rates.EUR,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Fall back to stored rates if available
    const storedRates = localStorage.getItem('exchangeRates');
    if (storedRates) {
      const rates = JSON.parse(storedRates);
      CURRENCY_CONFIG.USD.rate = rates.USD;
      CURRENCY_CONFIG.EUR.rate = rates.EUR;
    }
  }
};

// Format price with currency
export const formatPrice = (amount: number, currency: CurrencyCode): string => {
  const config = CURRENCY_CONFIG[currency];
  const convertedAmount = (amount * config.rate) / 1000;
  return `${config.symbol}${Math.round(convertedAmount)}${config.suffix}`;
};

// Custom hook for currency management
export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('selectedCurrency') as CurrencyCode) || 'GBP';
  });

  useEffect(() => {
    if (needsRateUpdate()) {
      fetchExchangeRates();
    }
  }, []);

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency);
  };

  return {
    selectedCurrency,
    handleCurrencyChange,
    formatPrice: (amount: number) => formatPrice(amount, selectedCurrency),
    getCurrentRate: () => CURRENCY_CONFIG[selectedCurrency].rate,
    getCurrencySymbol: () => CURRENCY_CONFIG[selectedCurrency].symbol,
  };
};
