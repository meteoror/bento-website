import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create formatted date for filename
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    // Create content with timestamp and message
    const content = `Timestamp: ${now.toISOString()}\n\nMessage:\n${message}`;

    // Change filename to .txt and content type to text/plain
    const blob = await put(
      `messages/${year}/${month}/${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}.txt`,
      content,
      { 
        access: 'public',
        contentType: 'text/plain'  // Changed from application/json
      }
    );

    return res.status(200).json({ url: blob.url });
    
  } catch (error) {
    console.error('Error uploading message:', error);
    return res.status(500).json({ error: 'Failed to save message' });
  }
}