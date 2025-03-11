import React, { useState, useEffect, useRef } from 'react';

interface TypewriterEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  preserveIndentation?: boolean;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 12, // Faster default typing speed
  onComplete,
  className = '',
  preserveIndentation = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Calculate a slightly randomized speed for more natural typing
      const randomizedSpeed = speed + Math.random() * 6 - 2;
      
      const timeout = setTimeout(() => {
        const nextChar = text[currentIndex];
        let newText = displayedText + nextChar;
        
        // Handle special formatting for line breaks
        if (preserveIndentation && nextChar === '\n') {
          // Find the next non-whitespace character after the newline
          let i = currentIndex + 1;
          let indentation = '';
          while (i < text.length && (text[i] === ' ' || text[i] === '\t')) {
            indentation += text[i];
            i++;
          }
          // Add the newline and indentation
          newText = displayedText + '\n' + indentation;
          setCurrentIndex(i - 1); // Skip the whitespace characters
        }
        
        setDisplayedText(newText);
        setCurrentIndex(prevIndex => prevIndex + 1);
        
        // Auto-scroll to keep up with the typing
        if (containerRef.current) {
          // Get the container and its parent (the chat message container)
          const container = containerRef.current;
          const chatContainer = container.closest('.messages-container');
          
          // Scroll the immediate container
          container.scrollTop = container.scrollHeight;
          
          // Also scroll the parent chat container if it exists
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        }
      }, randomizedSpeed); // Use the randomized speed defined above

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, isComplete, onComplete, displayedText, preserveIndentation]);

  // Function to render text with markdown-like formatting
  const renderFormattedText = () => {
    // Replace markdown-style formatting with HTML
    const formattedText = displayedText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };
  
  // Ensure scrolling happens after each render
  useEffect(() => {
    // Auto-scroll to keep up with the typing
    if (containerRef.current) {
      // Get the container and its parent (the chat message container)
      const container = containerRef.current;
      const chatContainer = container.closest('.messages-container');
      
      // Scroll the immediate container
      container.scrollTop = container.scrollHeight;
      
      // Also scroll the parent chat container if it exists
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [displayedText]); // Re-run this effect whenever the displayed text changes

  return (
    <div 
      ref={containerRef}
      className={`${className} relative`}
      style={{ 
        whiteSpace: 'pre-wrap', 
        overflowY: 'auto',
        lineHeight: '1.5',
        wordBreak: 'break-word'
      }}
    >
      {renderFormattedText()}
      {!isComplete && (
        <span 
          className="inline-block animate-pulse"
          style={{ 
            width: '2px', 
            height: '1em', 
            backgroundColor: 'currentColor', 
            marginLeft: '2px',
            verticalAlign: 'middle',
            opacity: '0.8'
          }}
        />
      )}
    </div>
  );
};

export default TypewriterEffect;
