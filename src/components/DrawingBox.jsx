import React, { useState, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import BentoBox from './BentoBox';

const DrawingBox = ({ gridArea, onDrawingSaved }) => {
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState('#00ff88');
  const [brushRadius, setBrushRadius] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!canvasRef.current) return;

    setIsSaving(true);
    
    try {
      const dataUrl = canvasRef.current.getDataURL('png', false, '#151515');
      
      const response = await fetch('/api/save-drawing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: dataUrl,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (onDrawingSaved) {
          onDrawingSaved('Drawing saved successfully!');
        }
      } else {
        throw new Error(data.error || 'Failed to save drawing');
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
      if (onDrawingSaved) {
        onDrawingSaved(error.message || 'Failed to save drawing. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  return (
    <BentoBox gridArea={gridArea} className="drawing-box">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 style={{ color: 'var(--accent-green)', margin: 0 }}>
          Create Art
        </h5>
        <div className="drawing-tools">
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="color-picker"
            title="Brush Color"
          />
          <button
            onClick={() => setBrushRadius(prev => Math.max(1, prev - 1))}
            className="btn-sm"
          >
            -
          </button>
          <span style={{ color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
            {brushRadius}
          </span>
          <button
            onClick={() => setBrushRadius(prev => prev + 1)}
            className="btn-sm"
          >
            +
          </button>
          <button onClick={handleUndo} className="btn-sm">
            Undo
          </button>
          <button onClick={handleClear} className="btn-sm">
            Clear
          </button>
        </div>
      </div>
      <div className="canvas-container">
        <CanvasDraw
          ref={canvasRef}
          brushColor={brushColor}
          brushRadius={brushRadius}
          canvasWidth="100%"
          canvasHeight="100%"
          lazyRadius={0}
          hideGrid={true}
          backgroundColor="transparent"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-3"
        style={{
          background: 'linear-gradient(135deg, var(--accent-green) 0%, #00cc6a 100%)',
          border: 'none',
          color: '#000',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          alignSelf: 'flex-end',
          fontSize: '0.9rem'
        }}
      >
        {isSaving ? 'Saving...' : 'Save Drawing'}
      </button>
    </BentoBox>
  );
};

export default DrawingBox;