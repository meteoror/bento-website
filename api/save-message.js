import fs from 'fs/promises';
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
    
    const { message, timestamp } = req.body;
    
    if (!message || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const filePath = getFilePath('messages.json');
    
    let messages = [];
    
    try {
      const existingData = await fs.readFile(filePath, 'utf8');
      messages = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is invalid, start fresh
      console.log('Creating new messages file');
    }
    
    const newMessage = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      message: message.trim(),
      timestamp,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };
    
    messages.push(newMessage);
    
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));
    
    console.log('Message saved:', newMessage.id);
    
    return res.status(200).json({ 
      success: true, 
      id: newMessage.id,
      count: messages.length 
    });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ 
      error: 'Failed to save message',
      details: error.message 
    });
  }
}