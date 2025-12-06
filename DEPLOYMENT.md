# Deployment Guide for Cloudflare Pages

This guide will help you deploy your static blog to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (free tier works)
- Your blog files ready to deploy
- (Optional) A Git repository (GitHub, GitLab, or Bitbucket)

## Method 1: Deploy via Cloudflare Dashboard (Easiest)

### Step 1: Prepare Your Files

1. Make sure all your files are in a folder
2. Update `config.js` with your blog information
3. Update `sitemap.xml` and `robots.txt` with your domain

### Step 2: Upload to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on **Pages** in the sidebar
3. Click **Create a project**
4. Choose **Upload assets**
5. Drag and drop your project folder or select it
6. Give your project a name
7. Click **Deploy site**

### Step 3: Configure Custom Domain (Optional)

1. After deployment, click on your project
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain name
5. Follow the DNS configuration instructions

## Method 2: Deploy via Git Integration (Recommended)

### Step 1: Push to Git Repository

1. Initialize a Git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub/GitLab/Bitbucket:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

### Step 2: Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on **Pages** → **Create a project**
3. Choose **Connect to Git**
4. Select your Git provider and authorize
5. Select your repository
6. Configure build settings:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
7. Click **Save and Deploy**

### Step 3: Automatic Deployments

- Every push to your main branch will trigger a new deployment
- Cloudflare will automatically build and deploy your site
- You can preview deployments before making them live

## Method 3: Deploy via Wrangler CLI

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login

```bash
wrangler login
```

### Step 3: Deploy

```bash
wrangler pages deploy .
```

## Post-Deployment Checklist

- [ ] Update `config.js` with your actual domain URL
- [ ] Update `sitemap.xml` with your domain
- [ ] Update `robots.txt` with your domain
- [ ] Test all pages and links
- [ ] Verify SEO meta tags
- [ ] Test dark/light mode toggle
- [ ] Test search functionality
- [ ] Test newsletter form (connect to your service)
- [ ] Set up Google AdSense (when approved)
- [ ] Submit sitemap to Google Search Console
- [ ] Test mobile responsiveness

## Environment Variables (If Needed)

If you need environment variables:

1. Go to your Cloudflare Pages project
2. Click **Settings** → **Environment variables**
3. Add your variables
4. Redeploy

## Custom Domain Setup

1. In Cloudflare Pages, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain
4. Update your DNS records as instructed:
   - Add a CNAME record pointing to your Pages domain
   - Or use Cloudflare's nameservers

## Performance Optimization

Cloudflare Pages automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ DDoS protection
- ✅ Fast page loads

## Monitoring

- View analytics in Cloudflare Dashboard
- Check deployment logs
- Monitor performance metrics
- Set up alerts if needed

## Troubleshooting

### Site not loading
- Check deployment logs
- Verify all files are uploaded
- Check custom domain DNS settings

### Images not showing
- Verify image URLs are correct
- Check CORS settings if using external images
- Ensure images are optimized

### JavaScript errors
- Check browser console
- Verify all script files are loaded
- Check for CORS issues

## Support

For Cloudflare Pages support:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

**Your blog is now live! 🎉**

