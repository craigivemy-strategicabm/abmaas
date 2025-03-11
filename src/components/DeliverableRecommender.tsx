import React, { useState, useRef, useEffect } from 'react';
import { ITEM_GROUPS, itemDescriptions } from '../abmTiersComponent';
import { ALL_PLAYBOOKS } from './PlaybooksNetflixLayout';
import TypewriterEffect from './TypewriterEffect';

// Import the itemGroups which contains activation items
import { itemGroups } from '../abmTiersComponent';
import { API_CONFIG } from '../config/apiConfig';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  hasDetailedVersion?: boolean; // Flag to indicate if this message has a detailed version
  detailedText?: string; // The detailed version of the text
}

interface DeliverableItem {
  title: string;
  tacticalCredits: string;
  impactCredits: string;
  enterpriseCredits: string;
  customPrice: string;
  description?: string;
}

interface DeliverableRecommenderProps {
  onSelectDeliverable?: (deliverable: DeliverableItem) => void;
  selectedTier?: 'Tactical ABM' | 'Impact ABM' | 'Enterprise ABM';
  expandedItems?: string[]; // Track expanded items on the screen
}

// GPT-4 service for production use
const gpt4Service = async (
  query: string, 
  deliverables: Record<string, DeliverableItem[]>,
  selectedTier: string,
  expandedItems: string[] = []
): Promise<string> => {
  try {
    // Call our backend API proxy
    const response = await fetch(API_CONFIG.endpoints.recommendations, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        deliverables,
        selectedTier,
        playbooks: ALL_PLAYBOOKS,
        descriptions: itemDescriptions,
        // Include activation items
        activationItems: itemGroups.activation,
        // Include information about which items are currently expanded on the screen
        expandedItems: expandedItems
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to get recommendations');
    }

    const data = await response.json();
    return data.recommendation;
  } catch (error) {
    console.error('Error calling recommendation API:', error);
    return `I'm sorry, I encountered an error while processing your request. Please try again later.`;
  }
};

// Fallback mock service for development/testing
const mockLLMService = async (
  query: string, 
  deliverables: Record<string, DeliverableItem[]>
): Promise<string> => {
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Convert query to lowercase for case-insensitive matching
  const lowercaseQuery = query.toLowerCase();
  
  // Keywords to categories mapping
  const categoryKeywords: Record<string, string[]> = {
    foundations: ['foundation', 'start', 'begin', 'discovery', 'workshop', 'audit', 'icp', 'account selection'],
    insights: ['insight', 'data', 'market', 'account', 'stakeholder', 'intelligence'],
    engagement: ['engagement', 'manifesto', 'report', 'cluster'],
    revenueContent: ['content', 'executive', 'briefing', 'roadmap'],
    revenue: ['revenue', 'playbook', 'design'],
    training: ['training', 'learn', 'improve', 'develop', 'introduction']
  };
  
  // Check if query mentions specific categories
  const mentionedCategories: string[] = [];
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      mentionedCategories.push(category);
    }
  });
  
  // If no categories are mentioned, provide a general response
  if (mentionedCategories.length === 0) {
    return `I can help you find the right ABM deliverables for your needs. Could you tell me more about what you're looking to achieve? For example, are you interested in insights, engagement, revenue generation, or training?`;
  }
  
  // Generate recommendations based on mentioned categories
  let response = `Based on your needs, I'd recommend the following deliverables:\n\n`;
  
  mentionedCategories.forEach(category => {
    response += `**${category.charAt(0).toUpperCase() + category.slice(1)} Deliverables:**\n`;
    
    // Get up to 3 deliverables from this category
    const categoryDeliverables = deliverables[category] || [];
    const recommendations = categoryDeliverables.slice(0, 3);
    
    recommendations.forEach(deliverable => {
      response += `- **${deliverable.title}** (${deliverable.tacticalCredits} credits)\n`;
    });
    
    response += '\n';
  });
  
  response += `Would you like more specific information about any of these deliverables?`;
  
  return response;
};

const DeliverableRecommender: React.FC<DeliverableRecommenderProps> = ({ 
  onSelectDeliverable,
  selectedTier = 'Tactical ABM',
  expandedItems = []
}) => {
  // Development toggle for API service
  const [useRealAPI, setUseRealAPI] = useState(API_CONFIG.useGPT4);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you find the right ABM deliverables for your needs. What are you looking to achieve?',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: false // Initial message doesn't need typewriter effect
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [awaitingDetailResponse, setAwaitingDetailResponse] = useState<string | null>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Function to show detailed version of a message
  const showDetailedVersion = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message?.hasDetailedVersion && message.detailedText) {
      // Add the detailed response as a new message
      const detailedMessage: Message = {
        id: Date.now().toString(),
        text: message.detailedText,
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages(prev => [...prev, detailedMessage]);
      
      // After a delay, mark the message as no longer typing
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === detailedMessage.id ? { ...msg, isTyping: false } : msg
          )
        );
      }, message.detailedText.length * 15 + 1000);
    }
  };
  
  const handleSendMessage = async () => {
    // Check if we're awaiting a yes/no response for detailed view
    if (awaitingDetailResponse && (inputValue.toLowerCase().includes('yes') || inputValue.toLowerCase() === 'y')) {
      // User wants to see detailed version
      setInputValue('');
      setAwaitingDetailResponse(null);
      
      // Add user's confirmation message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Show the detailed version
      showDetailedVersion(awaitingDetailResponse);
      return;
    } else if (awaitingDetailResponse) {
      // User doesn't want details or said something else
      setAwaitingDetailResponse(null);
      // Continue with normal message flow
    }
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get response from selected LLM service based on configuration
      let response;
      if (useRealAPI) {
        response = await gpt4Service(userMessage.text, ITEM_GROUPS, selectedTier, expandedItems);
      } else {
        response = await mockLLMService(userMessage.text, ITEM_GROUPS);
      }
      
      // Process the response to extract summary and details
      let summaryResponse = '';
      let detailedResponse = response;
      
      // Always create a summary version
      const lines = response.split('\n');
      const summaryLines = [];
      let inRecommendation = false;
      let recommendationCount = 0;
      let foundRecommendations = false;
      let currentSection = 'intro';
      
      // First, add any introductory text
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Look for patterns that indicate the start of a recommendation
        if (line.match(/^\d+\.\s|^•\s|^\*\s|^-\s|^Recommendation/i)) {
          foundRecommendations = true;
          currentSection = 'recommendation';
          inRecommendation = true;
          recommendationCount++;
          
          // Add the recommendation title
          summaryLines.push(line);
          
          // Add a very brief description (just 1 line)
          let descriptionLineCount = 0;
          for (let j = i + 1; j < lines.length && descriptionLineCount < 1; j++) {
            const descLine = lines[j];
            // Stop if we hit another recommendation or an empty line
            if (descLine.match(/^\d+\.\s|^•\s|^\*\s|^-\s|^Recommendation/i) || descLine.trim() === '') {
              break;
            }
            summaryLines.push(descLine);
            descriptionLineCount++;
          }
          
          // Add a blank line after each recommendation summary
          summaryLines.push('');
          
          // Skip to next recommendation
          while (i < lines.length - 1) {
            i++;
            if (lines[i].match(/^\d+\.\s|^•\s|^\*\s|^-\s|^Recommendation/i)) {
              i--; // Back up so the outer loop can process this line
              break;
            }
          }
          
          // Stop after we've processed a few recommendations
          if (recommendationCount >= 3) {
            break;
          }
        } else if (currentSection === 'intro') {
          // Include introductory text before recommendations
          summaryLines.push(line);
        }
      }
      
      // Create a concise summary with just titles and brief descriptions
      summaryResponse = summaryLines.join('\n');
      
      // Add prompt for more details
      summaryResponse += '\n\nWould you like more details about these recommendations?';
      
      // Add bot response with summary
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: summaryResponse,
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true, // Add a flag to indicate this message should use the typewriter effect
        hasDetailedVersion: true, // Always provide the option for detailed version
        detailedText: detailedResponse
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // After a delay, mark the message as no longer typing (for future reference if needed)
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessage.id ? { ...msg, isTyping: false } : msg
          )
        );
      }, response.length * 15 + 1000); // Reduced time for typewriter to finish with faster speed
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true // Use typewriter effect for error messages too
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // After a delay, mark the message as no longer typing
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === errorMessage.id ? { ...msg, isTyping: false } : msg
          )
        );
      }, 1500); // Even shorter delay for error messages
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="deliverable-recommender" style={{
      display: 'flex',
      flexDirection: 'column',
      height: isExpanded ? '80vh' : '500px',
      width: isExpanded ? '800px' : '600px',
      maxWidth: isExpanded ? '80vw' : '600px',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      background: '#1a1a1a',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      position: 'relative',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div className="recommender-header" style={{
        padding: '16px',
        borderBottom: '1px solid #2a2a2a',
        background: '#232323',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ margin: 0, color: '#fff' }}>ABM Deliverable Advisor</h3>
          
          {/* Expand/Collapse button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#aaa',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s',
              marginLeft: '8px',
              opacity: 0.7,
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '⤢' : '⤡'}
          </button>
        </div>
        
        {/* Development toggle switch */}
        {process.env.NODE_ENV !== 'production' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#aaa', fontSize: '12px' }}>Mock</span>
            <label className="toggle-switch" style={{
              position: 'relative',
              display: 'inline-block',
              width: '40px',
              height: '20px'
            }}>
              <input 
                type="checkbox" 
                checked={useRealAPI}
                onChange={() => setUseRealAPI(!useRealAPI)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0
                }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: useRealAPI ? '#0078d4' : '#444',
                transition: '.4s',
                borderRadius: '34px',
                '&:before': {
                  position: 'absolute',
                  content: '""',
                  height: '16px',
                  width: '16px',
                  left: useRealAPI ? '20px' : '4px',
                  bottom: '2px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '16px',
                  width: '16px',
                  left: useRealAPI ? '20px' : '4px',
                  bottom: '2px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
            <span style={{ color: '#aaa', fontSize: '12px' }}>GPT-4</span>
          </div>
        )}
      </div>
      
      <div className="messages-container" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: isExpanded ? 'calc(80vh - 130px)' : '370px',
        transition: 'height 0.3s ease-in-out'
      }}>
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender}`}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '18px',
              background: message.sender === 'user' ? '#0078d4' : '#2a2a2a',
              color: '#fff'
            }}
          >
            {message.sender === 'bot' && message.isTyping ? (
              <TypewriterEffect 
                text={message.text}
                speed={10} // Faster typing speed
                className="typewriter-message"
                onComplete={() => {
                  // When typing is complete, check if this message has a prompt for details
                  if (message.hasDetailedVersion && message.text.includes('Would you like more details')) {
                    setAwaitingDetailResponse(message.id);
                  }
                }}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ 
                __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') 
              }} />
            )}
            {message.hasDetailedVersion && !message.isTyping && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => showDetailedVersion(message.id)}
                  style={{
                    background: '#0078d4',
                    color: 'white',
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Yes, show details
                </button>
                <button 
                  onClick={() => setAwaitingDetailResponse(null)}
                  style={{
                    background: '#444',
                    color: 'white',
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  No, thanks
                </button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator" style={{
            alignSelf: 'flex-start',
            padding: '12px 16px',
            borderRadius: '18px',
            background: '#2a2a2a',
            color: '#fff'
          }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container" style={{
        padding: '16px',
        borderTop: '1px solid #2a2a2a',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about ABM deliverables..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: 'none',
            background: '#2a2a2a',
            color: '#fff'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          style={{
            padding: '12px 16px',
            borderRadius: '24px',
            border: 'none',
            background: '#0078d4',
            color: '#fff',
            cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !inputValue.trim() ? 0.7 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DeliverableRecommender;
