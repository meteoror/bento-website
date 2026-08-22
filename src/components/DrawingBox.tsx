import React, { useState, useRef, useEffect } from 'react';

interface DrawingBoxProps {
  onDrawingSaved: (message: string) => void;
}

const DrawingBox: React.FC<DrawingBoxProps> = ({ onDrawingSaved }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#00ff88');
  const [brushSize, setBrushSize] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(300, rect.height);
      
      // Set styles
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = brushColor;
    };

    // Use ResizeObserver for better container tracking
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    
    resizeCanvas();
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Update brush styles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
  }, [brushSize, brushColor]);

  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(clientX, clientY);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setLastPos({ x, y });
  };

  const draw = (clientX: number, clientY: number) => {
    if (!isDrawing || !canvasRef.current || !lastPos) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(clientX, clientY);
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    startDrawing(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    draw(e.clientX, e.clientY);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling and highlighting
    const touch = e.touches[0];
    startDrawing(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    if (!isDrawing) return;
    const touch = e.touches[0];
    draw(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent tap highlight
    stopDrawing();
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);

    try {
      const dataUrl = canvas.toDataURL('image/png');

      await fetch('/api/upload-drawing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl }),
      });

      onDrawingSaved('Drawing sent!');
    } catch {
      onDrawingSaved('Error sending drawing');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const colorOptions = [
    '#00ff88', '#00ff41', '#ffffff', '#ff0088', '#0088ff', '#ffff00', '#ff8800'
  ];

  return (
    <div className="portfolio-box d-flex flex-column">
      <div 
        ref={containerRef} 
        className="canvas-container mb-3"
        style={{ 
          minHeight: '300px',
          touchAction: 'none' // Prevent browser touch actions
        }}
      >
        <canvas
          ref={canvasRef}
          // Mouse events
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          // Touch events
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{
            cursor: 'crosshair',
            touchAction: 'none', // Prevent default touch behaviors
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      </div>

      {/* Tools */}
      <div className="border-top" style={{ borderColor: 'rgba(0, 255, 136, 0.2)', paddingTop: '1rem' }}>
        {/* Color Picker & Brush Size */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <small style={{ color: 'var(--text-secondary)' }}>colors:</small>
            <div className="d-flex gap-1">
              {colorOptions.map(color => (
                <button
                  key={color}
                  className={`btn btn-sm p-0 rounded-circle ${brushColor === color ? 'border border-2' : 'border-0'}`}
                  style={{
                    backgroundColor: color,
                    width: '24px',
                    height: '24px',
                    borderColor: brushColor === color ? 'var(--accent-green)' : 'transparent'
                  }}
                  onClick={() => setBrushColor(color)}
                  title={`Color: ${color}`}
                />
              ))}
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <small style={{ color: 'var(--text-secondary)' }}>size:</small>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
                className="btn btn-outline-secondary btn-sm"
                disabled={brushSize <= 1}
              >
                <i className="bi bi-dash"></i>
              </button>
              <div className="text-center" style={{ minWidth: '40px', color: 'var(--text-secondary)' }}>
                <div 
                  className="mx-auto rounded-circle border"
                  style={{
                    width: `${brushSize * 3}px`,
                    height: `${brushSize * 3}px`,
                    backgroundColor: brushColor,
                    borderColor: 'var(--accent-green)'
                  }}
                />
                <small className="d-block mt-1">{brushSize}px</small>
              </div>
              <button
                onClick={() => setBrushSize(brushSize + 1)}
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between gap-2">
          <button
            onClick={handleClear}
            className="btn btn-outline-danger"
          >
            <i className="bi bi-trash me-2"></i>
            clear
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-success"
          >
            {isSaving ? (
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
      </div>
    </div>
  );
};

export default DrawingBox;