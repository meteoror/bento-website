import React, { useState } from 'react';
import BentoBox from './BentoBox';

const ResponseBox = ({ gridArea, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/save-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('');
        if (onMessageSent) {
          onMessageSent('Message sent successfully!');
        }
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (onMessageSent) {
        onMessageSent(error.message || 'Failed to send message. Please try again.');
      }
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
          rows="4"
          disabled={isSubmitting}
          maxLength="500"
        />
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small style={{ color: 'var(--text-secondary)' }}>
            {message.length}/500 characters
          </small>
          <button type="submit" disabled={isSubmitting || !message.trim()}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </BentoBox>
  );
};

export default ResponseBox;