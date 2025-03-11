import React, { useState, useEffect } from 'react';
import DeliverableRecommender from './DeliverableRecommender';

const RecommenderDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Function to track expanded items on the screen
  const trackExpandedItems = () => {
    // Get all expanded elements on the page
    const expandedElements = document.querySelectorAll('.expanded-item, .expanded-section, [aria-expanded="true"]');
    
    // Extract titles/names from the expanded elements
    const expandedTitles: string[] = [];
    
    expandedElements.forEach(element => {
      // Try to get the title from various attributes
      const title = element.getAttribute('data-title') || 
                   element.getAttribute('title') || 
                   element.getAttribute('aria-label') ||
                   element.textContent;
      
      if (title) {
        expandedTitles.push(title.trim());
      }
    });
    
    setExpandedItems(expandedTitles);
  };
  
  // Track expanded items when the component mounts and periodically
  useEffect(() => {
    // Initial check
    trackExpandedItems();
    
    // Set up periodic checking (every 2 seconds)
    const intervalId = setInterval(trackExpandedItems, 2000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 1000 
    }}>
      {isOpen ? (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 1010,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <DeliverableRecommender expandedItems={expandedItems} />
        </div>
      ) : null}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#0078d4',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        {isOpen ? '×' : '?'}
      </button>
    </div>
  );
};

export default RecommenderDemo;
