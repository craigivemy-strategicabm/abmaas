import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatPrice, CurrencyCode } from '../config/currency';

interface InvoiceItem {
  id: string;
  title: string;
  credits: number;
  amount: string;
  category: string;
  order: number;
}

interface InvoiceSummaryProps {
  isOpen: boolean;
  onClose: (newState: boolean) => void;
  selectedTier: string;
  items: InvoiceItem[];
  totalCredits: number;
  customSowCost: string;
  creditsCost: string;
  currencySymbol: string;
  selectedCurrency: CurrencyCode;
}





export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  isOpen,
  onClose,
  selectedTier,
  items,
  totalCredits,
  customSowCost,
  creditsCost,
  currencySymbol,
  selectedCurrency
}) => {
  const handlePrint = async () => {
    try {
      const element = document.querySelector('.invoice-content');
      if (!element) return;

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      // Create PDF in A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('draft-sow.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div 
        className={`invoice-summary fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50
          ${isOpen ? 'lg:w-[400px] w-[85vw]' : 'w-[50px]'}
          translate-x-0
          shadow-xl
          print:relative print:w-full print:h-auto print:bg-white print:text-black print:p-8 print:m-0 print:border-none print:shadow-none print:left-0 print:top-0
        `}
    >
      <div className="relative h-full">
        {/* Expand/Collapse Toggle */}
        <button 
          onClick={() => onClose(!isOpen)}
          className="absolute -right-4 top-8 bg-gray-900 border border-gray-800 rounded-full p-2 hover:bg-gray-800 transition-colors shadow-lg cursor-pointer"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Content */}
        <div className={`h-full overflow-y-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} print:block print:h-auto print:overflow-visible print:opacity-100`}>
          <div className="p-6 invoice-content">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-white mb-3 print:text-black">Draft SOW</h2>
          <p className="text-xl text-[#e95a0c] font-light">{selectedTier} tier</p>
        </div>

        <div className="space-y-8 my-6">
          {/* Group items by category */}
          {Object.entries(items.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
          }, {} as Record<string, InvoiceItem[]>))
          .sort(([a], [b]) => {
            const itemA = items.find(i => i.category === a);
            const itemB = items.find(i => i.category === b);
            return (itemA?.order || 0) - (itemB?.order || 0);
          })
          .map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="text-xl mb-6">
                <span className="text-white font-light print:text-black">{category}</span>
                <span className="text-gray-500 font-light"> credits</span>
                <span className="text-orange-500">.</span>
              </h3>
              <div className="space-y-4">
                {categoryItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="text-gray-300 text-sm font-light print:text-black">{item.title}</p>
                      <p className="text-xs text-gray-500 font-light print:text-black">
                        {item.credits} {item.credits === 1 ? 'credit' : 'credits'}
                      </p>
                    </div>
                    <p className="text-green-500 text-sm font-light print:text-black">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 space-y-5">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-400 font-light print:text-black">Custom SOW Cost</span>
            <span className="text-base font-light text-gray-500 print:text-black">{customSowCost}</span>
          </div>
          <div className="border-t border-gray-800 mt-5 pt-5 space-y-5">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-400 font-light print:text-black">Total Credits</span>
              <span className="text-base font-light text-white print:text-black">{totalCredits}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-400 font-light print:text-black">Credits Cost</span>
              <span className="text-base font-light text-green-500 print:text-black">{creditsCost}</span>
            </div>
          </div>
          <div className="flex justify-between items-baseline border-t border-gray-800 pt-6 mt-6">
            <span className="text-sm text-gray-400 font-light print:text-black">Total Savings</span>
            <span className="text-base font-light font-medium text-green-500 print:text-black">{(() => {
              const sowCost = parseFloat(customSowCost.replace(/[^0-9.]/g, ''));
              const credCost = parseFloat(creditsCost.replace(/[^0-9.]/g, ''));
              const savings = sowCost - credCost;
              return formatPrice(savings, selectedCurrency);
            })()}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            onClick={handlePrint}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white"
          >
            Print
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};
