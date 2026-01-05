import fs from 'fs/promises';
import path from 'path';

export async function ensureDirectories() {
  const dataDir = path.join(process.cwd(), 'public/data');
  const artDir = path.join(process.cwd(), 'public/art');
  
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.mkdir(artDir, { recursive: true });
    console.log('Directories ensured:', { dataDir, artDir });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

export function getFilePath(filename, type = 'data') {
  const dir = type === 'art' ? 'public/art' : 'public/data';
  return path.join(process.cwd(), dir, filename);
}