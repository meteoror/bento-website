import fs from 'fs/promises';
import path from 'path';
import { ensureDirectories, getFilePath } from './utils.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await ensureDirectories();
    
    const { image, timestamp } = req.body;
    
    if (!image || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Remove data URL prefix
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    if (!base64Data) {
      return res.status(400).json({ error: 'Invalid image data' });
    }
    
    const fileName = `drawing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
    const artDir = path.join(process.cwd(), 'public/art');
    const filePath = path.join(artDir, fileName);
    
    // Save PNG file
    await fs.writeFile(filePath, base64Data, 'base64');
    
    // Save metadata
    const metadataPath = getFilePath('drawings.json', 'art');
    let drawings = [];
    
    try {
      const existingData = await fs.readFile(metadataPath, 'utf8');
      drawings = JSON.parse(existingData);
    } catch (error) {
      console.log('Creating new drawings metadata file');
    }
    
    const drawingData = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      fileName,
      timestamp,
      path: `/art/${fileName}`,
      size: Buffer.byteLength(base64Data, 'base64')
    };
    
    drawings.push(drawingData);
    
    await fs.writeFile(metadataPath, JSON.stringify(drawings, null, 2));
    
    console.log('Drawing saved:', drawingData.id);
    
    return res.status(200).json({ 
      success: true, 
      id: drawingData.id,
      fileName,
      count: drawings.length 
    });
  } catch (error) {
    console.error('Error saving drawing:', error);
    return res.status(500).json({ 
      error: 'Failed to save drawing',
      details: error.message 
    });
  }
}