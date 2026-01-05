import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image' });
    }

    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create formatted date for filename
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    // Format: drawings/YYYY/MM/YYYY-MM-DD_HH-MM-SS-SSS.png
    const blob = await put(
      `drawings/${year}/${month}/${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}.png`,
      buffer,
      { access: 'public' }
    );

    return res.status(200).json({ url: blob.url });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}