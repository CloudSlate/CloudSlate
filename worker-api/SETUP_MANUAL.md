# Manual Worker Setup Guide

Follow these steps in your terminal to create and deploy the Cloudflare Worker manually.

## Prerequisites

1. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/
   - Install the LTS version
   - Verify installation: `node --version` and `npm --version`

2. **Install Wrangler CLI globally**:
   ```bash
   npm install -g wrangler
   ```

## Step-by-Step Setup

### Step 1: Navigate to worker-api directory
```bash
cd worker-api
```

### Step 2: Login to Cloudflare
```bash
wrangler login
```
This will open your browser to authenticate with Cloudflare.

### Step 3: Create KV Namespace
```bash
wrangler kv:namespace create "BLOG_STORAGE"
```

**Important**: Copy the `id` from the output. It will look like:
```
🌀  Creating namespace with title "cloudslate-api-BLOG_STORAGE"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "BLOG_STORAGE", id = "abc123def456..." }
```

### Step 4: Update wrangler.toml

Open `wrangler.toml` and replace:
- `YOUR_KV_NAMESPACE_ID` with the actual namespace ID from Step 3
- `your-secret-token-change-this` with a secure random token (use a password generator)

### Step 5: Install Dependencies
```bash
npm install
```

### Step 6: Deploy the Worker
```bash
wrangler deploy
```

After successful deployment, you'll see output like:
```
✨  Deployed cloudslate-api
🌍  https://cloudslate-api.your-subdomain.workers.dev
```

### Step 7: Test the Worker

Test the health endpoint:
```bash
curl https://cloudslate-api.your-subdomain.workers.dev/api/health
```

Or visit the URL in your browser.

## Quick Command Reference

```bash
# Login
wrangler login

# Create KV namespace
wrangler kv:namespace create "BLOG_STORAGE"

# Deploy
wrangler deploy

# View logs
wrangler tail

# Delete worker (if needed)
wrangler delete
```

## Troubleshooting

- **"wrangler not found"**: Make sure you installed it globally with `npm install -g wrangler`
- **"npm not found"**: Install Node.js from nodejs.org
- **Authentication errors**: Run `wrangler login` again
- **KV namespace errors**: Make sure you updated the `id` in `wrangler.toml`

