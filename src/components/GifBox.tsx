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
      // Fallback to Unsplash
      const fallbackUrls = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop'
      ];
      setUrl(fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)]);
    }
  }, [url]);

  return (
    <BentoBox gridArea={gridArea} className="gif-box p-0 overflow-hidden">
      {!loaded && (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <img 
        src={url} 
        alt="Visual inspiration" 
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setUrl('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop');
          setLoaded(true);
        }}
        className="w-100 h-100 object-fit-cover"
        style={{ 
          transition: 'transform 0.5s ease',
          minHeight: '180px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
      <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-50">
        <small className="text-white">
          <i className="bi bi-image me-1"></i>
          Visual inspiration
        </small>
      </div>
    </BentoBox>
  );
};

export default GifBox;