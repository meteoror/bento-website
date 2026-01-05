import React, { useEffect } from 'react';

const Debug: React.FC = () => {
  useEffect(() => {
    console.log('Debug component mounted');
    console.log('CSS loaded:', document.styleSheets.length);
    
    // Check if our CSS is loaded
    const styles = Array.from(document.styleSheets);
    const hasOurCss = styles.some(sheet => {
      try {
        return sheet.href?.includes('styles.css') || 
               Array.from(sheet.cssRules).some(rule => 
                 rule.cssText.includes('--primary-bg')
               );
      } catch {
        return false;
      }
    });
    
    console.log('Has our CSS:', hasOurCss);
    console.log('Body classes:', document.body.className);
    console.log('Root element:', document.getElementById('root')?.innerHTML?.substring(0, 100));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'rgba(0,0,0,0.9)',
      color: '#00ff88',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3>Debug Info</h3>
      <div>CSS Sheets: {document.styleSheets.length}</div>
      <div>Viewport: {window.innerWidth} x {window.innerHeight}</div>
      <div>Body BG: {getComputedStyle(document.body).backgroundColor}</div>
      <button onClick={() => window.location.reload()}>Refresh</button>
    </div>
  );
};

export default Debug;