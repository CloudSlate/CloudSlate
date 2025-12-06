# Cloudflare Storage Setup Guide

Since Cloudflare Pages is static hosting, we need to use Cloudflare Workers + KV for persistent storage.

## Option 1: Cloudflare Workers + KV (Recommended)

### Why This Solution?
- ✅ Free tier is generous (100K requests/day)
- ✅ Fast edge network (global CDN)
- ✅ No additional services needed
- ✅ Secure and reliable
- ✅ Works seamlessly with Cloudflare Pages

### Setup Steps

#### Step 1: Create KV Namespace

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **KV**
3. Click **Create a namespace**
4. Name it: `BLOG_STORAGE`
5. Copy the **Namespace ID**

#### Step 2: Create Worker

1. In Cloudflare Dashboard, go to **Workers & Pages**
2. Click **Create application** > **Create Worker**
3. Name it: `cloudslate-api`
4. Copy the code from `worker-api/worker.js` into the editor
5. Click **Save and deploy**

#### Step 3: Configure Worker

1. In your Worker, go to **Settings** > **Variables**
2. Under **KV Namespace Bindings**, click **Add binding**
3. Variable name: `BLOG_STORAGE`
4. Select the namespace you created
5. Click **Save**

#### Step 4: Set Environment Variables

1. Still in **Settings** > **Variables**
2. Under **Environment Variables**, click **Add variable**
3. Variable name: `ADMIN_TOKEN`
4. Value: Generate a secure random token (use a password generator)
5. Click **Save**

#### Step 5: Get Worker URL

After deployment, you'll get a URL like:
```
https://cloudslate-api.your-subdomain.workers.dev
```

#### Step 6: Update Admin Panel

1. Open `assets/js/admin-api.js`
2. Update `API_CONFIG.baseUrl` with your Worker URL
3. Update `API_CONFIG.token` with your ADMIN_TOKEN
4. In `admin.html`, add this script before `admin.js`:
   ```html
   <script src="assets/js/admin-api.js"></script>
   ```
5. Update `admin.js` to use `AdminAPI` instead of localStorage functions

### Cost

**Free Tier Includes:**
- 100,000 requests/day
- 10ms CPU time per request
- KV: 100,000 reads/day, 1,000 writes/day

**Paid Tier (if needed):**
- $5/month for additional requests
- Very affordable for personal blogs

---

## Option 2: Alternative Services (If You Prefer)

### A. Firebase (Google)

**Pros:**
- Free tier: 1GB storage, 10GB/month transfer
- Real-time updates
- Easy setup

**Setup:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Get your API keys
5. Update admin panel to use Firebase SDK

### B. Supabase

**Pros:**
- Free tier: 500MB database, 2GB bandwidth
- PostgreSQL database
- Real-time subscriptions

**Setup:**
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Create a `posts` table
4. Get your API keys
5. Update admin panel to use Supabase client

### C. GitHub as Database

**Pros:**
- Free
- Version control built-in
- No additional service

**Setup:**
1. Create a private GitHub repository
2. Store posts as JSON files
3. Use GitHub API to read/write
4. Requires GitHub Personal Access Token

---

## Quick Start: Using the Provided Worker

1. **Deploy the Worker:**
   ```bash
   cd worker-api
   npm install -g wrangler
   wrangler login
   wrangler kv:namespace create "BLOG_STORAGE"
   # Copy the namespace ID and update wrangler.toml
   wrangler deploy
   ```

2. **Update Admin Panel:**
   - Open `assets/js/admin-api.js`
   - Update `API_CONFIG` with your Worker URL and token
   - Include `admin-api.js` in `admin.html`

3. **Test:**
   - Visit your admin panel
   - Create a post
   - Check Cloudflare Dashboard > Workers > KV to see stored data

---

## Migration from localStorage

If you already have posts in localStorage:

1. Export from admin panel (Settings > Export All Data)
2. After setting up API, import the data
3. Posts will now be stored in Cloudflare KV

---

## Security Notes

1. **Keep ADMIN_TOKEN secret** - Don't commit it to Git
2. **Use environment variables** in Cloudflare Dashboard
3. **Consider adding rate limiting** for production
4. **Enable Cloudflare Access** for additional security (optional)

---

## Troubleshooting

**Worker not responding?**
- Check Worker logs in Cloudflare Dashboard
- Verify KV namespace binding is correct
- Check environment variables are set

**CORS errors?**
- Worker already includes CORS headers
- Make sure your domain is allowed

**Authentication failing?**
- Verify ADMIN_TOKEN matches in Worker and admin panel
- Check Authorization header format: `Bearer <token>`

---

## Need Help?

Contact: info.cloudslate@gmail.com

