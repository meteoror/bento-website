import React, { useState } from 'react';

interface ResponseBoxProps {
  onMessageSent: (message: string) => void;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({ onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Save to localStorage (will be replaced with server-side later)
      const messages = JSON.parse(localStorage.getItem('bento-messages') || '[]');
      messages.push({
        id: `msg-${Date.now()}`,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('bento-messages', JSON.stringify(messages));
      
      setMessage('');
      onMessageSent('Message saved!');
    } catch (error: any) {
      onMessageSent(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="portfolio-box">
      <form onSubmit={handleSubmit} className="d-flex flex-column">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="type your message here..."
          className="form-control mb-3"
          style={{
            resize: 'none',
            minHeight: '120px',
            fontFamily: 'inherit'
          }}
          rows={4}
          disabled={isSubmitting}
          maxLength={500}
        />
        
        <div className="d-flex justify-content-between align-items-center">
          <small style={{ color: 'var(--text-secondary)' }}>
            {message.length}/500
          </small>
          <button 
            type="submit" 
            disabled={isSubmitting || !message.trim()}
            className="btn btn-success"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                sending...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResponseBox;
