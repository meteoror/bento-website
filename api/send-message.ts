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
    // Body is already parsed with VercelRequest
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const content = JSON.stringify({
      message,
      timestamp: new Date().toISOString(),
    });

    const blob = await put(
      `messages/message-${Date.now()}.json`,
      content,
      { 
        access: 'public',
        contentType: 'application/json'
      }
    );

    return res.status(200).json({ url: blob.url });
    
  } catch (error) {
    console.error('Error uploading message:', error);
    return res.status(500).json({ error: 'Failed to save message' });
  }
}