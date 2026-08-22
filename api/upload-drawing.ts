import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_STORAGE_REPO!;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

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

    // Strip the data URL prefix - GitHub wants raw base64
    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');

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
    const path = `drawings/${year}/${month}/${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}.png`;

    const ghRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add drawing ${path}`,
          content: base64Data,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    if (!ghRes.ok) {
      const errText = await ghRes.text();
      console.error('GitHub upload failed:', ghRes.status, errText);
      return res.status(500).json({ error: 'Upload failed' });
    }

    const data = await ghRes.json();

    return res.status(200).json({ url: data.content?.download_url });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
