import { put } from '@vercel/blob';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { message } = await req.json();

  const content = JSON.stringify({
    message,
    timestamp: new Date().toISOString(),
  });

  const blob = await put(
    `messages/message-${Date.now()}.json`,
    content,
    { access: 'private' }
  );

  return new Response(JSON.stringify({ url: blob.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
