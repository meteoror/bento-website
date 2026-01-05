// src/components/GifBox.tsx
import React, { useState, useEffect } from 'react';
import BentoBox from './BentoBox';

interface GifBoxProps {
  gridArea: string;
  gifUrl?: string;
}

const GifBox: React.FC<GifBoxProps> = ({ gridArea, gifUrl }) => {
  const [url, setUrl] = useState(gifUrl);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!url) {
      // Fallback image
      setUrl('https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=400&h=300');
    }
  }, [url]);

  return (
    <BentoBox gridArea={gridArea} className="gif-box">
      {!loaded && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: '#888',
          fontSize: '0.9rem'
        }}>
          Loading...
        </div>
      )}
      <img 
        src={url} 
        alt="Random" 
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setUrl('https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=400&h=300');
          setLoaded(true);
        }}
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          borderRadius: '16px'
        }}
      />
    </BentoBox>
  );
};

export default GifBox;