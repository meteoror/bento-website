# Vercel Postgres Setup

## Steps to get your database working:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Connect Vercel Postgres:**
   - Go to your Vercel project dashboard
   - Click on the "Storage" tab
   - Click "Create Database" → Select "Postgres"
   - Choose the "Hobby" (free) plan
   - Click "Create"

3. **Link your database:**
   - After creating, Vercel will automatically add the connection string as environment variables
   - The `@vercel/postgres` package will automatically use these variables

4. **Deploy:**
   - Push your code to GitHub (or deploy via Vercel CLI)
   - Vercel will automatically detect the API routes and database

## Viewing your data:

Once deployed, you can view messages and drawings by visiting:
- `https://yourdomain.com/api/messages` - Returns all messages as JSON
- `https://yourdomain.com/api/drawings` - Returns all drawings as JSON

The tables will be automatically created on first API call.
