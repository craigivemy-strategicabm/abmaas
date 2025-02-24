import React from 'react';
import { formatPrice, CurrencyCode } from '../config/currency';
import { InvoiceItem } from './InvoiceSummary';

interface PrintableInvoiceProps {
  items: InvoiceItem[];
  selectedTier: string;
  totalCredits: number;
  customSowCost: string;
  creditsCost: string;
  currencySymbol: string;
  selectedCurrency: CurrencyCode;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  items,
  selectedTier,
  totalCredits,
  customSowCost,
  creditsCost,
  currencySymbol,
  selectedCurrency,
}) => {
  // Group items by category
  const printableItems = Object.entries(items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InvoiceItem[]>))
  .sort(([a], [b]) => {
    const itemA = items.find(i => i.category === a);
    const itemB = items.find(i => i.category === b);
    return (itemA?.order || 0) - (itemB?.order || 0);
  });

  return (
    <div className="hidden print:block print:fixed print:inset-0 print:p-8 print:m-0 print:bg-white print:text-black">
      <div className="print:block">
        <h2 className="text-3xl mb-6">Draft SOW - {selectedTier}</h2>
        
        {printableItems.map(([category, categoryItems]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl mb-4">{category}</h3>
            <div className="space-y-2">
              {categoryItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p>{item.title}</p>
                    <p className="text-sm">{item.credits} {item.credits === 1 ? 'credit' : 'credits'}</p>
                  </div>
                  <p>{(() => {
                    const numStr = item.amount.replace(/[^0-9.]/g, '');
                    const num = parseFloat(numStr);
                    if (numStr.endsWith('k')) {
                      return formatPrice(num * 1000, selectedCurrency);
                    } else if (isNaN(num)) {
                      return item.amount;
                    } else {
                      return formatPrice(num, selectedCurrency);
                    }
                  })()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span>Custom SOW Cost</span>
            <span>{customSowCost}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Credits</span>
            <span>{totalCredits}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Credits Cost</span>
            <span>{creditsCost}</span>
          </div>
          <div className="flex justify-between pt-4 border-t">
            <span>Total Savings</span>
            <span>{(() => {
              const sowCost = parseFloat(customSowCost.replace(/[^0-9.]/g, ''));
              const credCost = parseFloat(creditsCost.replace(/[^0-9.]/g, ''));
              const config = CURRENCY_CONFIG[selectedCurrency];
              // Convert to GBP if in USD
              const sowCostGBP = selectedCurrency === 'USD' ? sowCost / config.rate : sowCost;
              const credCostGBP = selectedCurrency === 'USD' ? credCost / config.rate : credCost;
              // Calculate savings in GBP
              const savingsGBP = sowCostGBP - credCostGBP;
              // Convert savings to target currency
              const savings = selectedCurrency === 'USD' ? savingsGBP * config.rate : savingsGBP;
              return `${currencySymbol}${savings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            })()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
