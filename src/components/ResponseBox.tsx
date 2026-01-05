import React, { useState } from 'react';
import BentoBox from './BentoBox';

interface ResponseBoxProps {
  gridArea: string;
  onMessageSent: (message: string) => void;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({ gridArea, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Save to localStorage for now
      const messages = JSON.parse(localStorage.getItem('bento-messages') || '[]');
      messages.push({
        id: `msg-${Date.now()}`,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('bento-messages', JSON.stringify(messages));
      
      setMessage('');
      onMessageSent('Message saved locally! Check localStorage in DevTools.');
    } catch (error: any) {
      onMessageSent(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BentoBox gridArea={gridArea} className="response-box">
      <h5 className="mb-3" style={{ color: 'var(--accent-green)' }}>
        Share Your Thoughts
      </h5>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          disabled={isSubmitting}
          maxLength={500}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            padding: '1rem',
            resize: 'none' as 'none',
            fontFamily: 'inherit'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <small style={{ color: 'var(--text-secondary)' }}>
            {message.length}/500 characters
          </small>
          <button 
            type="submit" 
            disabled={isSubmitting || !message.trim()}
            style={{
              background: 'linear-gradient(135deg, var(--accent-green) 0%, #00cc6a 100%)',
              border: 'none',
              color: '#000',
              padding: '0.5rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </BentoBox>
  );
};

export default ResponseBox;