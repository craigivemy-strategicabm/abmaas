// API configuration
export const API_CONFIG = {
  // Set to true to use the real GPT-4 API, false to use the mock service
  // Default to true to ensure GPT-4 is used unless explicitly set to false
  useGPT4: process.env.REACT_APP_USE_GPT4 !== 'true',
  
  // API endpoints
  endpoints: {
    recommendations: process.env.REACT_APP_API_URL || 'http://localhost:3001/api/recommendations'
  }
};
