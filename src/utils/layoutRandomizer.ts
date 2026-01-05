export interface BentoItem {
  id: string;
  type: 'paragraph' | 'response' | 'drawing' | 'gif';
  gridArea: string;
  rows?: number;
  cols?: number;
}

export const generateRandomLayout = (): BentoItem[] => {
  // Define grid template - 3 rows x 4 columns
  const gridTemplate = [
    ['', '', '', ''], // Row 1
    ['', '', '', ''], // Row 2  
    ['', '', '', ''], // Row 3
  ];

  // Available positions in the grid (row, col)
  const availablePositions: [number, number][] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      availablePositions.push([row, col]);
    }
  }

  // Define all boxes with their sizes
  const boxes = [
    // Drawing box - 2 rows tall
    { type: 'drawing' as const, rows: 2, cols: 1, id: 'drawing' },
    // Response box - 1 row
    { type: 'response' as const, rows: 1, cols: 1, id: 'response' },
    // Paragraph boxes - different sizes
    { type: 'paragraph' as const, rows: 1, cols: 1, id: 'p1' },
    { type: 'paragraph' as const, rows: 1, cols: 1, id: 'p2' },
    { type: 'paragraph' as const, rows: 1, cols: 1, id: 'p3' },
    // GIF boxes - 1 row
    { type: 'gif' as const, rows: 1, cols: 1, id: 'g1' },
    { type: 'gif' as const, rows: 1, cols: 1, id: 'g2' },
    { type: 'gif' as const, rows: 1, cols: 1, id: 'g3' },
    { type: 'gif' as const, rows: 1, cols: 1, id: 'g4' },
    { type: 'gif' as const, rows: 1, cols: 1, id: 'g5' },
    { type: 'gif' as const, rows: 1, cols: 1, id: 'g6' },
    { type: 'gif' as const, rows: 1, cols: 1, id: 'g7' },
  ];

  // Shuffle boxes
  const shuffledBoxes = [...boxes].sort(() => Math.random() - 0.5);
  const placedBoxes: BentoItem[] = [];
  
  // Helper to check if a position is available
  const isPositionAvailable = (startRow: number, startCol: number, rows: number, cols: number): boolean => {
    // Check bounds
    if (startRow + rows > 3 || startCol + cols > 4) return false;
    
    // Check if all cells are empty
    for (let r = startRow; r < startRow + rows; r++) {
      for (let c = startCol; c < startCol + cols; c++) {
        if (gridTemplate[r][c] !== '') return false;
      }
    }
    return true;
  };
  
  // Helper to occupy a position
  const occupyPosition = (startRow: number, startCol: number, rows: number, cols: number, id: string) => {
    for (let r = startRow; r < startRow + rows; r++) {
      for (let c = startCol; c < startCol + cols; c++) {
        gridTemplate[r][c] = id;
      }
    }
  };

  // Place each box
  for (const box of shuffledBoxes) {
    let placed = false;
    
    // Try all available positions
    for (const [row, col] of availablePositions) {
      if (isPositionAvailable(row, col, box.rows, box.cols)) {
        // Generate grid area string
        const gridArea = `${row + 1} / ${col + 1} / ${row + 1 + box.rows} / ${col + 1 + box.cols}`;
        
        placedBoxes.push({
          ...box,
          id: `${box.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          gridArea
        });
        
        occupyPosition(row, col, box.rows, box.cols, box.id);
        placed = true;
        break;
      }
    }
    
    // If couldn't place, try a single cell spot
    if (!placed) {
      for (const [row, col] of availablePositions) {
        if (gridTemplate[row][col] === '') {
          const gridArea = `${row + 1} / ${col + 1}`;
          placedBoxes.push({
            ...box,
            rows: 1,
            cols: 1,
            id: `${box.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            gridArea
          });
          occupyPosition(row, col, 1, 1, box.id);
          break;
        }
      }
    }
  }

  return placedBoxes;
};

export const getGifUrls = (): string[] => {
  const imageUrls = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop&auto=format',
  ];

  return [...imageUrls].sort(() => Math.random() - 0.5).slice(0, 7);
};