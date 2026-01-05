export const generateRandomLayout = () => {
  // Define the types of boxes we have
  const boxTypes = [
    { type: 'paragraph', size: 'small' },
    { type: 'response', size: 'small' },
    { type: 'paragraph', size: 'large' },
    { type: 'drawing', size: 'medium' },
    { type: 'paragraph', size: 'medium' },
    { type: 'gif', size: 'small' },
    { type: 'gif', size: 'small' },
    { type: 'gif', size: 'small' },
    { type: 'gif', size: 'small' },
    { type: 'gif', size: 'small' },
    { type: 'gif', size: 'small' },
    { type: 'gif', size: 'small' }
  ];

  // Shuffle the box types
  const shuffledBoxes = [...boxTypes].sort(() => Math.random() - 0.5);

  // Generate grid areas for desktop (4x3)
  const desktopGridAreas = [];
  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 4; col++) {
      desktopGridAreas.push(`${row} / ${col}`);
    }
  }

  // Shuffle grid areas
  const shuffledGridAreas = [...desktopGridAreas].sort(() => Math.random() - 0.5);

  // Assign grid areas to boxes
  const layout = shuffledBoxes.map((box, index) => ({
    ...box,
    id: `box-${index}-${Date.now()}`,
    gridArea: shuffledGridAreas[index]
  }));

  return layout;
};

export const getGifUrls = () => {
  // Using Pexels for free high-quality placeholder images
  const imageUrls = [
    'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    'https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    'https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
  ];

  // Shuffle and return 6 random images
  return [...imageUrls].sort(() => Math.random() - 0.5).slice(0, 6);
};