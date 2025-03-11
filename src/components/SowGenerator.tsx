import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SowGeneratorProps {
  recommendedPlaybooks: string[];
  onSuccess?: (sowId: string) => void;
}

const SowGenerator: React.FC<SowGeneratorProps> = ({ recommendedPlaybooks, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGenerateSow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Extract playbook titles from the recommendation text
      const recommendations = recommendedPlaybooks.map(title => ({
        title,
        type: 'playbook'
      }));

      // Call the API to generate SOW
      const response = await axios.post('/api/generate-sow', { recommendations });
      
      if (response.data.success) {
        // If onSuccess callback is provided, call it with the SOW ID
        if (onSuccess) {
          onSuccess(response.data.sowId);
        }
        
        // Redirect to the SOW page or add items to cart
        navigate(`/sow/${response.data.sowId}`);
      } else {
        setError('Failed to generate SOW. Please try again.');
      }
    } catch (err) {
      console.error('Error generating SOW:', err);
      setError('An error occurred while generating the SOW. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleGenerateSow}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Statement of Work'}
      </button>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default SowGenerator;
