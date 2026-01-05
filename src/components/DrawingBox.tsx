import React, { useState, useRef, useEffect } from 'react';
import BentoBox from './BentoBox';
import './DrawingBox.css';

interface DrawingBoxProps {
  gridArea: string;
  onDrawingSaved: (message: string) => void;
}

const DrawingBox: React.FC<DrawingBoxProps> = ({ gridArea, onDrawingSaved }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#00ff88');
  const [brushSize, setBrushSize] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Set initial background
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);

    try {
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Save to localStorage for now
      const drawings = JSON.parse(localStorage.getItem('bento-drawings') || '[]');
      drawings.push({
        id: `drawing-${Date.now()}`,
        dataUrl,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('bento-drawings', JSON.stringify(drawings));
      
      onDrawingSaved('Drawing saved locally! Check localStorage in DevTools.');
    } catch (error: any) {
      onDrawingSaved(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            onClick={() => setBrushSize(prev => Math.max(1, prev - 1))}
            className="btn-sm"
          >
            −
          </button>
          <span style={{ color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
            {brushSize}px
          </span>
          <button
            onClick={() => setBrushSize(prev => prev + 1)}
            className="btn-sm"
          >
            +
          </button>
        </div>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            width: '100%',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '8px',
            cursor: 'crosshair',
            touchAction: 'none'
          }}
        />
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button
          onClick={handleClear}
          className="btn-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'var(--text-primary)',
            padding: '0.5rem 1rem',
            borderRadius: '6px'
          }}
        >
          Clear Canvas
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            background: 'linear-gradient(135deg, var(--accent-green) 0%, #00cc6a 100%)',
            border: 'none',
            color: '#000',
            padding: '0.5rem 1.5rem',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {isSaving ? 'Saving...' : 'Save Drawing'}
        </button>
      </div>
    </BentoBox>
  );
};

export default DrawingBox;