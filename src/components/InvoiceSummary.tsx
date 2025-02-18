import React, { useState } from 'react';
import InvoicePDF from './InvoicePDF';
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
  const [showPDF, setShowPDF] = useState(false);

  const handlePrint = () => {
    setShowPDF(true);
  };

  const allItems = items.map(item => ({
    ...item,
    amount: formatPrice(parseFloat(item.amount), selectedCurrency)
  }));

  const handlePrintOld = async () => {
    try {
      const element = document.querySelector('.invoice-content');
      if (!element) return;

      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '1200px'; // Much wider container
      container.style.backgroundColor = 'white';
      container.style.padding = '40px 60px';
      container.style.zIndex = '-9999';
      container.style.opacity = '1';
      container.style.visibility = 'visible';
      container.style.boxSizing = 'border-box';
      document.body.appendChild(container);

      // Debug log container width
      console.log('Container width:', container.offsetWidth);

      // Clone the content
      const printElement = element.cloneNode(true) as HTMLElement;
      container.appendChild(printElement);

      // Force all text to be visible and black
      const allElements = container.querySelectorAll('*');
      allElements.forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          // Base styles for all elements
          el.style.color = 'black';
          el.style.backgroundColor = 'white';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          
          // Handle tables
          if (el.tagName === 'TABLE') {
            el.style.width = '100%';
            el.style.borderCollapse = 'collapse';
            el.style.marginBottom = '1rem';
            el.style.tableLayout = 'fixed';
          }
          
          // Handle table cells
          if (el.tagName === 'TD') {
            if (el.classList.contains('text-left')) {
              el.style.width = '80%';
              el.style.paddingRight = '3rem';
              el.style.wordBreak = 'break-word';
              el.style.whiteSpace = 'normal';
              el.style.verticalAlign = 'top';
              el.style.maxWidth = '0';
              el.style.overflow = 'hidden';
              el.style.textOverflow = 'ellipsis';
            } else if (el.classList.contains('text-right')) {
              el.style.width = '20%';
              el.style.textAlign = 'right';
              el.style.whiteSpace = 'nowrap';
              el.style.verticalAlign = 'top';
            }
          }

          // Handle paragraphs and headings
          if (el.tagName === 'P' || el.tagName === 'H3') {
            el.style.margin = '0';
            el.style.padding = '0';
            el.style.pageBreakInside = 'avoid';
            if (el.classList.contains('text-xs')) {
              el.style.marginTop = '0.5rem';
            }
          }
          
          // Handle containers that should avoid page breaks
          if (el.classList.contains('page-break-inside-avoid')) {
            el.style.pageBreakInside = 'avoid';
          }
        }
      });

      // Wait a bit for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the content
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: 'white',
        width: 1200, // Match container width
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.invoice-content');
          if (clonedElement instanceof HTMLElement) {
            clonedElement.style.opacity = '1';
            clonedElement.style.visibility = 'visible';
          }
        }
      });

      // Remove the container
      document.body.removeChild(container);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = -pdfHeight * page;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        page++;
      }

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
          print:static print:w-full print:h-auto print:bg-white print:text-black print:border-none print:shadow-none print:transform-none print:z-auto
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
        <div className={`h-full overflow-y-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} print:block print:h-auto print:overflow-visible print:opacity-100 print:visible`}>
          <div className="p-6 invoice-content">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-white mb-3 print:text-black !print:text-black">Draft SOW</h2>
          <p className="text-xl text-[#e95a0c] font-light print:text-black">{selectedTier} tier</p>
        </div>

        <div className="space-y-12 my-8">
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
                <span className="text-white font-light !print:text-black">{category}</span>
                <span className="text-gray-500 font-light !print:text-black"> credits</span>
                <span className="text-[#e95a0c] !print:text-[#e95a0c]">.</span>
              </h3>
              <div className="space-y-4">
                {categoryItems.map(item => (
                  <table key={item.id} className="w-full mb-4 border-collapse page-break-inside-avoid">
                    <tr>
                      <td className="text-left" style={{ width: '80%', paddingRight: '3rem' }}>
                        <p className="text-gray-300 text-sm font-light !print:text-black whitespace-normal break-words">{item.title}</p>
                        <p className="text-xs text-gray-500 font-light !print:text-black">
                          {item.credits} {item.credits === 1 ? 'credit' : 'credits'}
                        </p>
                      </td>
                      <td className="text-right" style={{ width: '20%' }}>
                        <p className="text-green-500 text-sm font-light !print:text-green-500">{item.amount}</p>
                      </td>
                    </tr>
                  </table>
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

      {showPDF && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowPDF(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
          <InvoicePDF items={allItems} currency={selectedCurrency} />
        </div>
      )}
    </div>
  );
};
