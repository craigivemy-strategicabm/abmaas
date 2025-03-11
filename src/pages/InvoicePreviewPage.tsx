import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TypewriterEffect from '../components/TypewriterEffect';

interface Recommendation {
  title: string;
  credits: string;
  category?: string;
}

const InvoicePreviewPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [sowId, setSowId] = useState<string | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceText, setInvoiceText] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract data from the URL query params or location state
    const searchParams = new URLSearchParams(location.search);
    const sowIdParam = searchParams.get('sowId');
    
    if (sowIdParam) {
      setSowId(sowIdParam);
    } else if (location.state?.sowId) {
      setSowId(location.state.sowId);
    }
    
    if (location.state?.recommendations) {
      setRecommendations(location.state.recommendations);
      
      // Calculate total credits
      const total = location.state.recommendations.reduce(
        (sum: number, item: Recommendation) => sum + parseInt(item.credits || '0', 10), 
        0
      );
      setTotalCredits(total);
    }
    
    // Generate invoice text for typewriter effect
    if (recommendations.length > 0 && sowId) {
      const invoiceDetails = `Statement of Work: ${sowId}

Preparing invoice for the following playbooks:
${recommendations.map((rec, idx) => `${idx + 1}. ${rec.title} - ${rec.credits} credits${rec.category ? `\n   Category: ${rec.category}` : ''}`).join('\n\n')}

Calculating total: ${totalCredits} credits

Invoice ready for review.`;
      
      setInvoiceText(invoiceDetails);
    }
    
    setIsLoading(false);
  }, [location, recommendations, sowId, totalCredits]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white">Loading invoice preview...</p>
        </div>
      </div>
    );
  }

  if (!sowId || recommendations.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <div className="text-yellow-500 text-xl mb-4">No Invoice Data</div>
          <p>No Statement of Work or recommendations found.</p>
          <button 
            onClick={() => navigate('/playbooks')} 
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Playbooks
          </button>
        </div>
      </div>
    );
  }

  // Handle typewriter completion
  const handleTypingComplete = () => {
    setShowInvoice(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Invoice Preview</h1>
          <p className="mt-2 text-gray-300">
            Statement of Work ID: {sowId}
          </p>
        </div>

        {!showInvoice ? (
          <div className="mt-10 bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Preparing Invoice</h2>
            <div className="bg-gray-900 p-4 rounded-lg h-64 overflow-auto">
              <TypewriterEffect 
                text={invoiceText} 
                speed={25} 
                className="text-green-400 font-mono text-sm" 
                onComplete={handleTypingComplete}
              />
            </div>
          </div>
        ) : (
          <div className="mt-10 bg-gray-800 rounded-lg shadow p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-white mb-4">Selected Playbooks</h2>
            
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-700 rounded p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">{rec.title}</h3>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {rec.credits} credits
                    </span>
                  </div>
                  {rec.category && (
                    <div className="mt-2 text-sm text-gray-400">
                      <span className="inline-block px-2 py-1 bg-gray-700 rounded text-xs mr-1">
                        {rec.category}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-white">Total Credits:</span>
                  <span className="text-xl font-bold text-white">{totalCredits}</span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => navigate('/playbooks')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Return to Playbooks
                </button>
                <button
                  onClick={() => alert('This would proceed to checkout in a real application')}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreviewPage;
