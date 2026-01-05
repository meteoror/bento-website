import { put } from '@vercel/blob';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { imageBase64 } = await req.json();

  const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const blob = await put(
    `drawings/drawing-${Date.now()}.png`,
    buffer,
    { access: 'public' }
  );

  return new Response(JSON.stringify({ url: blob.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
