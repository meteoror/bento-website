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
        CREATE TABLE IF NOT EXISTS drawings (
          id SERIAL PRIMARY KEY,
          data_url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const result = await sql`SELECT * FROM drawings ORDER BY created_at DESC`;
      return response.status(200).json(result.rows);
    }

    if (request.method === 'POST') {
      const { dataUrl } = request.body;

      if (!dataUrl) {
        return response.status(400).json({ error: 'Data URL is required' });
      }

      // Create table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS drawings (
          id SERIAL PRIMARY KEY,
          data_url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const result = await sql`
        INSERT INTO drawings (data_url)
        VALUES (${dataUrl})
        RETURNING *
      `;

      return response.status(201).json(result.rows[0]);
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return response.status(500).json({ error: error.message });
  }
}
