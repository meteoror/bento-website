import React, { useState, useEffect } from 'react';
import { generateRandomLayout, getGifUrls, BentoItem } from './utils/layoutRandomizer';
import ParagraphBox from './components/ParagraphBox';
import ResponseBox from './components/ResponseBox';
import DrawingBox from './components/DrawingBox';
import GifBox from './components/GifBox';
import './styles.css';

const AppProgress: React.FC = () => {
  const [layout, setLayout] = useState<BentoItem[]>([]);
  const [gifUrls, setGifUrls] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [greeting] = useState("Welcome to Bento Space");
  const [subtitle] = useState("A dynamic, interactive grid where creativity meets technology");

  useEffect(() => {
    // Generate initial random layout
    const newLayout = generateRandomLayout();
    setLayout(newLayout);
    
    // Get random GIFs
    const urls = getGifUrls();
    setGifUrls(urls);
  }, []);

  useEffect(() => {
    // Clear status message after 3 seconds
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleMessageSent = (message: string) => {
    setStatusMessage(message);
  };

  const handleDrawingSaved = (message: string) => {
    setStatusMessage(message);
  };

  // Separate boxes by type for rendering
  const paragraphBoxes = layout.filter(box => box.type === 'paragraph');
  const gifBoxes = layout.filter(box => box.type === 'gif');
  const responseBox = layout.find(box => box.type === 'response');
  const drawingBox = layout.find(box => box.type === 'drawing');

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <h1>{greeting}</h1>
        <p className="subtitle">{subtitle}</p>
      </header>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Render Paragraph Boxes */}
        {paragraphBoxes.map((box, index) => (
          <ParagraphBox
            key={box.id}
            gridArea={box.gridArea}
            content={box.size === 'large' 
              ? "This is a larger paragraph area. It can accommodate more text and provide detailed information or stories. The bento layout ensures that each element has its own space while contributing to the overall harmony of the design. Refresh the page to see how everything rearranges itself randomly!" 
              : undefined}
          />
        ))}

        {/* Render Response Box */}
        {responseBox && (
          <ResponseBox
            key={responseBox.id}
            gridArea={responseBox.gridArea}
            onMessageSent={handleMessageSent}
          />
        )}

        {/* Render Drawing Box */}
        {drawingBox && (
          <DrawingBox
            key={drawingBox.id}
            gridArea={drawingBox.gridArea}
            onDrawingSaved={handleDrawingSaved}
          />
        )}

        {/* Render GIF Boxes */}
        {gifBoxes.map((box, index) => (
          <GifBox
            key={box.id}
            gridArea={box.gridArea}
            gifUrl={gifUrls[index]}
          />
        ))}
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default AppProgress;