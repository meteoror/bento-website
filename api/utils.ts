import fs from 'fs/promises';
import path from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';

export interface Message {
  id: string;
  message: string;
  timestamp: string;
  ip?: string;
}

export interface Drawing {
  id: string;
  fileName: string;
  timestamp: string;
  path: string;
  size: number;
}

export async function ensureDirectories(): Promise<void> {
  const dataDir = path.join(process.cwd(), 'public/data');
  const artDir = path.join(process.cwd(), 'public/art');
  
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.mkdir(artDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

export function getFilePath(filename: string, type: 'data' | 'art' = 'data'): string {
  const dir = type === 'art' ? 'public/art' : 'public/data';
  return path.join(process.cwd(), dir, filename);
}