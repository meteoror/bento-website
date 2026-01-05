import React, { useState, useRef, useEffect } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from '@pshihn/react-sketch-canvas';
import BentoBox from './BentoBox';
import './DrawingBox.css'; // Optional styling

interface DrawingBoxProps {
  gridArea: string;
  onDrawingSaved: (message: string) => void;
}

interface DrawingTools {
  color: string;
  strokeWidth: number;
}

const DrawingBox: React.FC<DrawingBoxProps> = ({ gridArea, onDrawingSaved }) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [tools, setTools] = useState<DrawingTools>({
    color: '#00ff88',
    strokeWidth: 3
  });
  const [isSaving, setIsSaving] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 200 });

  // Handle responsive canvas size
  useEffect(() => {
    const updateSize = () => {
      const box = document.querySelector('.drawing-box');
      if (box) {
        const { width, height } = box.getBoundingClientRect();
        setCanvasSize({
          width: width - 32, // Account for padding
          height: height - 120 // Account for header and buttons
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleSave = async () => {
    if (!canvasRef.current) return;

    setIsSaving(true);
    
    try {
      // Get drawing as data URL
      const dataUrl = await canvasRef.current.exportImage('png');
      
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
      canvasRef.current.clearCanvas();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  const handleColorChange = (color: string) => {
    setTools(prev => ({ ...prev, color }));
  };

  const handleStrokeWidthChange = (width: number) => {
    setTools(prev => ({ ...prev, strokeWidth: Math.max(1, width) }));
  };

  return (
    <BentoBox gridArea={gridArea} className="drawing-box">
      <div className="drawing-header">
        <h5 style={{ color: 'var(--accent-green)', margin: 0 }}>
          Create Art
        </h5>
        <div className="drawing-stats">
          <small style={{ color: 'var(--text-secondary)' }}>
            Draw freely!
          </small>
        </div>
      </div>

      {/* Drawing Tools */}
      <div className="drawing-tools">
        <div className="color-palette">
          {['#00ff88', '#ff0088', '#0088ff', '#ffff00', '#ffffff', '#000000'].map(color => (
            <button
              key={color}
              className={`color-btn ${tools.color === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              title={`Color: ${color}`}
            />
          ))}
        </div>
        
        <div className="stroke-controls">
          <button
            onClick={() => handleStrokeWidthChange(tools.strokeWidth - 1)}
            className="btn-control"
            disabled={tools.strokeWidth <= 1}
          >
            −
          </button>
          <div className="stroke-indicator">
            <div 
              className="stroke-preview"
              style={{
                backgroundColor: tools.color,
                width: `${tools.strokeWidth * 4}px`,
                height: `${tools.strokeWidth * 4}px`
              }}
            />
            <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
              {tools.strokeWidth}px
            </span>
          </div>
          <button
            onClick={() => handleStrokeWidthChange(tools.strokeWidth + 1)}
            className="btn-control"
          >
            +
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <ReactSketchCanvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          strokeWidth={tools.strokeWidth}
          strokeColor={tools.color}
          canvasColor="transparent"
          style={{
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)'
          }}
          withViewBox={true}
        />
      </div>

      {/* Action Buttons */}
      <div className="drawing-actions">
        <button
          onClick={handleUndo}
          className="btn-action"
          title="Undo"
        >
          <span>↶</span>
        </button>
        <button
          onClick={handleRedo}
          className="btn-action"
          title="Redo"
        >
          <span>↷</span>
        </button>
        <button
          onClick={handleClear}
          className="btn-action"
          title="Clear Canvas"
        >
          <span>🗑️</span>
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-save"
        >
          {isSaving ? (
            <>
              <span className="spinner"></span>
              Saving...
            </>
          ) : (
            'Save Drawing'
          )}
        </button>
      </div>
    </BentoBox>
  );
};

export default DrawingBox;