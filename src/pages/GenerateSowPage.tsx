import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TypewriterEffect from '../components/TypewriterEffect';

interface Recommendation {
  title: string;
  credits: string;
  category?: string;
}

const GenerateSowPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sowGenerated, setSowGenerated] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [sowText, setSowText] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract recommendations from the URL query params or location state
    const searchParams = new URLSearchParams(location.search);
    const recommendationsParam = searchParams.get('recommendations');
    
    let extractedRecommendations: Recommendation[] = [];
    
    if (recommendationsParam) {
      try {
        extractedRecommendations = JSON.parse(decodeURIComponent(recommendationsParam));
      } catch (err) {
        console.error('Error parsing recommendations:', err);
        setError('Invalid recommendations format');
      }
    } else if (location.state?.recommendations) {
      extractedRecommendations = location.state.recommendations;
    }
    
    setRecommendations(extractedRecommendations);
    setIsLoading(false);
  }, [location]);

  const handleGenerateSow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the API to generate SOW
      const response = await axios.post('/api/generate-sow', { recommendations });
      
      if (response.data.success) {
        // Generate a detailed SOW text to display with the typewriter effect
        const sowDetails = `Generating Statement of Work...

Preparing SOW ID: ${response.data.sowId}

Including the following playbooks:
${response.data.recommendations.map((rec: any) => `• ${rec.title} (${rec.credits} credits)${rec.category ? ` - ${rec.category}` : ''}`).join('\n')}

Calculating total credits...
Total: ${response.data.recommendations.reduce((sum: number, item: any) => sum + parseInt(item.credits || '0', 10), 0)} credits

Finalizing your Statement of Work...

Complete! Redirecting to invoice preview...`;
        
        setSowText(sowDetails);
        setSowGenerated(true);
        
        // We'll navigate after the typing effect is complete
      } else {
        setError('Failed to generate SOW. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error generating SOW:', err);
      setError('An error occurred while generating the SOW. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Handle completion of typing effect
  const handleTypingComplete = () => {
    setTypingComplete(true);
    
    // Navigate to invoice preview after typing is complete
    setTimeout(() => {
      navigate('/invoice-preview', { 
        state: { 
          sowId: 'SOW-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          recommendations: recommendations
        } 
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white">Preparing your Statement of Work...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (sowGenerated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="max-w-2xl w-full mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
          <div className="text-green-500 text-xl mb-4">Generating Statement of Work</div>
          
          <div className="bg-gray-900 p-4 rounded-lg h-64 overflow-auto">
            <TypewriterEffect 
              text={sowText} 
              speed={30} 
              className="text-green-400 font-mono text-sm" 
              onComplete={handleTypingComplete}
            />
          </div>
          
          {typingComplete && (
            <div className="mt-4 text-center">
              <p className="text-green-500">Success! Your Statement of Work has been generated.</p>
              <p className="mt-2">Redirecting to invoice preview...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Generate Statement of Work</h1>
          <p className="mt-2 text-gray-300">
            Review the recommended playbooks below and generate your Statement of Work.
          </p>
        </div>

        <div className="mt-10 bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recommended Playbooks</h2>
          
          {recommendations.length === 0 ? (
            <p className="text-gray-400">No recommendations found. Please go back and try again.</p>
          ) : (
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
                      <span className="inline-block px-2 py-1 bg-gray-700 rounded text-xs">
                        {rec.category}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleGenerateSow}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Generate Statement of Work
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateSowPage;
