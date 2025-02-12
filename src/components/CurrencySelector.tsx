import React from 'react';
import { CurrencyCode } from '../config/currency';

interface CurrencySelectorProps {
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
}) => {
  const currencies = [
    { code: 'GBP', symbol: '£', label: 'GBP' },
    { code: 'USD', symbol: '$', label: 'USD' },
    { code: 'EUR', symbol: '€', label: 'EUR' }
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-900 rounded-md p-1 border border-gray-800">
      {currencies.map(({ code, symbol, label }) => (
        <button
          key={code}
          onClick={() => onCurrencyChange(code as CurrencyCode)}
          className={`
            px-2.5 py-1 rounded text-xs font-medium transition-all duration-200
            ${selectedCurrency === code 
              ? 'bg-orange-500 text-white shadow-sm' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'}
          `}
        >
          {symbol}
        </button>
      ))}
    </div>
  );
};
