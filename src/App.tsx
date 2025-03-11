import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Import pages
import GenerateSowPage from './pages/GenerateSowPage'
import InvoicePreviewPage from './pages/InvoicePreviewPage'

// We'll use a placeholder for now since PlaybooksNetflixLayout requires props
// This would be replaced with the actual component with proper props in the real app

function App() {
  // State to store the last API response with recommendations
  const [lastRecommendations, setLastRecommendations] = useState<any>(null);

  // Listen for API responses with recommendations
  useEffect(() => {
    // Function to handle messages from the API
    const handleApiResponse = (event: MessageEvent) => {
      if (event.data && event.data.type === 'API_RESPONSE' && event.data.recommendedPlaybooks) {
        setLastRecommendations(event.data.recommendedPlaybooks);
      }
    };

    // Add event listener
    window.addEventListener('message', handleApiResponse);

    // Clean up
    return () => {
      window.removeEventListener('message', handleApiResponse);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main app routes */}
        <Route path="/" element={<Navigate to="/playbooks" />} />
        <Route path="/playbooks" element={<div className="p-8 text-white">Playbooks Layout (Placeholder)</div>} />
        
        {/* SOW generation route */}
        <Route 
          path="/generate-sow" 
          element={
            <GenerateSowPage />
          } 
        />
        
        {/* Invoice preview route */}
        <Route path="/invoice-preview" element={<InvoicePreviewPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
