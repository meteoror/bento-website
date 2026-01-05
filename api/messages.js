import fs from 'fs/promises';
import { getFilePath } from './utils.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filePath = getFilePath('messages.json');
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const messages = JSON.parse(data);
      return res.status(200).json(messages);
    } catch (error) {
      // File doesn't exist
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
    return res.status(500).json({ 
      error: 'Failed to load messages',
      details: error.message 
    });
  }
}