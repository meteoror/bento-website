import React, { useState, useEffect } from 'react';
import BentoBox from './BentoBox';

const GifBox = ({ gridArea, gifUrl }) => {
  const [url, setUrl] = useState(gifUrl);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!url) {
      // Fallback if no URL provided
      setUrl('https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=400&h=300');
    }
  }, [url]);

  return (
    <BentoBox gridArea={gridArea} className="gif-box">
      {!loaded && (
        <div className="loading" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      )}
      <img 
        src={url} 
        alt="Random image" 
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setUrl('https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=400&h=300');
          setLoaded(true);
        }}
        style={{ 
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
    </BentoBox>
  );
};

export default GifBox;