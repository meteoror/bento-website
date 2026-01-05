import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,  // NOT Request
  res: VercelResponse   // NOT returning Response
) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    // In VercelRequest, body is already parsed if JSON
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image' });
    }

    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const blob = await put(
      `drawings/drawing-${Date.now()}.png`,
      buffer,
      { access: 'public' }
    );

    return res.status(200).json({ url: blob.url });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}