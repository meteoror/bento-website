import React from 'react';
import './styles.css';

const App: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '20px',
      background: '#0a0a0a',
      color: '#f0f0f0'
    }}>
      <h1 style={{ 
        color: '#00ff88',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        Bento Website Test
      </h1>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Test Box 1 */}
        <div style={{
          background: '#151515',
          borderRadius: '16px',
          padding: '20px',
          gridColumn: 'span 1',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h3 style={{ color: '#00ff88' }}>Paragraph</h3>
          <p style={{ color: '#888' }}>This is a test paragraph box.</p>
        </div>
        
        {/* Test Box 2 */}
        <div style={{
          background: '#151515',
          borderRadius: '16px',
          padding: '20px',
          gridColumn: 'span 1',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h3 style={{ color: '#00ff88' }}>Response</h3>
          <textarea 
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,255,136,0.1)',
              color: '#f0f0f0',
              padding: '10px',
              borderRadius: '8px'
            }}
            placeholder="Type something..."
          />
        </div>
        
        {/* Test Box 3 */}
        <div style={{
          background: '#151515',
          borderRadius: '16px',
          padding: '20px',
          gridColumn: 'span 2',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h3 style={{ color: '#00ff88' }}>Drawing Area</h3>
          <div style={{
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            border: '1px dashed rgba(0,255,136,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888'
          }}>
            Drawing canvas would go here
          </div>
        </div>
        
        {/* Test Box 4 */}
        <div style={{
          background: '#151515',
          borderRadius: '16px',
          padding: '20px',
          gridColumn: 'span 1',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h3 style={{ color: '#00ff88' }}>GIF</h3>
          <div style={{
            height: '120px',
            background: 'linear-gradient(45deg, #00ff88, #0088ff)',
            borderRadius: '8px',
            opacity: '0.5'
          }} />
        </div>
        
        {/* More test boxes */}
        {[5, 6, 7, 8].map(num => (
          <div key={num} style={{
            background: '#151515',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(0, 255, 136, 0.1)'
          }}>
            <h4 style={{ color: '#00ff88' }}>Box {num}</h4>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>
              Content for box {num}
            </p>
          </div>
        ))}
      </div>
      
      {/* Debug info at bottom */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: '#00ff88',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        border: '1px solid rgba(0,255,136,0.3)'
      }}>
        <div><strong>Debug Info</strong></div>
        <div>Background: {getComputedStyle(document.body).backgroundColor}</div>
        <div>Text Color: {getComputedStyle(document.body).color}</div>
        <div>CSS Loaded: Yes</div>
      </div>
    </div>
  );
};

export default App;