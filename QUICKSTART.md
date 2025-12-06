# Quick Start Guide

Get your blog up and running in 5 minutes!

## Step 1: Customize Configuration (2 minutes)

Open `config.js` and update:

```javascript
const BLOG_CONFIG = {
    name: "Your Blog Name",           // Change this
    description: "Your description",   // Change this
    url: "https://yourblog.com",      // Your domain
    author: "Your Name",              // Your name
    // ... update social links
};
```

## Step 2: Add Your First Post (2 minutes)

In `config.js`, add a new post to the `BLOG_POSTS` array:

```javascript
{
    id: "my-first-post",
    title: "My First Blog Post",
    slug: "my-first-post",
    excerpt: "This is my first post!",
    content: "# My First Post\n\nWelcome to my blog!",
    author: "Your Name",
    date: "2024-01-15",
    category: "General",
    tags: ["first", "welcome"],
    featured: true,
    image: "https://images.unsplash.com/photo-xxx",
    readTime: "2 min read"
}
```

## Step 3: Deploy to Cloudflare Pages (1 minute)

### Option A: Quick Upload
1. Go to [Cloudflare Pages](https://dash.cloudflare.com/)
2. Click "Create a project" → "Upload assets"
3. Drag your project folder
4. Click "Deploy site"

### Option B: Git Integration
1. Push to GitHub
2. Connect to Cloudflare Pages
3. Auto-deploy on every push

## Step 4: Update URLs

After deployment, update:
- `config.js` → `url` field
- `sitemap.xml` → Replace `yourblog.com` with your domain
- `robots.txt` → Replace `yourblog.com` with your domain

## That's It! 🎉

Your blog is now live. Next steps:

- ✅ Add more posts
- ✅ Customize colors and styling
- ✅ Set up Google AdSense (when approved)
- ✅ Connect newsletter service
- ✅ Submit sitemap to Google Search Console

## Need Help?

- See `README.md` for detailed documentation
- See `DEPLOYMENT.md` for deployment help
- Check `config.js` for all configuration options

---

**Happy Blogging!** 🚀

