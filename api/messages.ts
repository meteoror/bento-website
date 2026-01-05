import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    if (request.method === 'GET') {
      // Create table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const result = await sql`SELECT * FROM messages ORDER BY created_at DESC`;
      return response.status(200).json(result.rows);
    }

    if (request.method === 'POST') {
      const { message } = request.body;

      if (!message || !message.trim()) {
        return response.status(400).json({ error: 'Message is required' });
      }

      // Create table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const result = await sql`
        INSERT INTO messages (message)
        VALUES (${message.trim()})
        RETURNING *
      `;

      return response.status(201).json(result.rows[0]);
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return response.status(500).json({ error: error.message });
  }
}
