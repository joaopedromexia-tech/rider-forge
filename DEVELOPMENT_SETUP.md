# Development Setup

## Local Development

To run the application locally with API support, you have two options:

### Option 1: Full Development Setup (Recommended)

This runs both the Vite dev server and the API server concurrently:

```bash
npm run dev:full
```

This will start:
- Vite dev server on http://localhost:5173
- API server on http://localhost:3001
- API requests are proxied from Vite to the API server

### Option 2: Separate Servers

Run the API server in one terminal:
```bash
npm run api
```

Run the Vite dev server in another terminal:
```bash
npm run dev
```

## Environment Variables

Make sure you have the following environment variables set:

```bash
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Production Deployment

For production, deploy to Vercel which will automatically serve the API routes from the `src/api/` directory.

## Troubleshooting

If you get 404 errors for API routes:
1. Make sure the API server is running on port 3001
2. Check that the Vite proxy configuration is correct
3. Verify your environment variables are set
4. For production, ensure the API files are in `src/api/` directory
