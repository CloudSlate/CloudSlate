# Cloudflare Worker API Setup

This Worker provides a backend API for storing blog posts in Cloudflare KV storage instead of browser localStorage.

## Setup Instructions

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create KV Namespace

```bash
wrangler kv:namespace create "BLOG_STORAGE"
```

This will output a namespace ID. Copy it.

### 4. Update wrangler.toml

1. Open `wrangler.toml`
2. Replace `YOUR_KV_NAMESPACE_ID` with the namespace ID from step 3
3. Change `ADMIN_TOKEN` to a secure random token (use a password generator)

### 5. Deploy Worker

```bash
cd worker-api
npm install
wrangler deploy
```

After deployment, you'll get a URL like: `https://cloudslate-api.your-subdomain.workers.dev`

### 6. Update Admin Panel

Update `assets/js/admin.js` to use the API endpoint instead of localStorage.

## Alternative: Using Cloudflare Dashboard

1. Go to Cloudflare Dashboard > Workers & Pages
2. Create a new Worker
3. Copy the code from `worker.js`
4. Go to Settings > Variables
5. Add KV namespace binding: `BLOG_STORAGE`
6. Create a KV namespace if you don't have one
7. Add environment variable: `ADMIN_TOKEN`
8. Deploy

## API Endpoints

- `GET /api/posts` - Get all posts (public)
- `POST /api/posts` - Create post (requires auth)
- `PUT /api/posts/:id` - Update post (requires auth)
- `DELETE /api/posts/:id` - Delete post (requires auth)
- `GET /api/health` - Health check

## Authentication

Include the token in the Authorization header:
```
Authorization: Bearer your-secret-token-change-this
```

## Cost

Cloudflare Workers Free Tier includes:
- 100,000 requests/day
- 10ms CPU time per request
- KV: 100,000 reads/day, 1,000 writes/day

This should be more than enough for a personal blog!

