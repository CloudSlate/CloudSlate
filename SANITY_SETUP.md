# Sanity CMS Setup Guide

Clean setup guide for integrating Sanity CMS with CloudSlate blog.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Sanity account (free tier available)

## 🚀 Quick Start

### Step 1: Install Sanity CLI

```bash
npm install -g @sanity/cli
```

### Step 2: Login to Sanity

```bash
sanity login
```

### Step 3: Initialize Sanity Studio ✅ (Already Done!)

Sanity Studio has been initialized in the `cloudslate-cms` folder.

**Project Details:**
- **Project ID**: `pdd2xrq9`
- **Project Name**: `cloudslate-cms`
- **Dataset**: `production`
- **Location**: `cloudslate-cms/`

### Step 4: Install Dependencies ✅ (Already Done!)

Dependencies have been installed automatically during initialization.

### Step 5: Configuration ✅ (Already Done!)

The `cloudslate-cms/sanity.config.ts` file is configured with:
- ✅ Project ID: `pdd2xrq9`
- ✅ Schema imports from `./schemaTypes`
- ✅ All necessary plugins
- ✅ Base path: `/studio`

The blog post schema has been added to `cloudslate-cms/schemaTypes/post.ts`.

### Step 6: Start Sanity Studio

From the `cloudslate-cms` folder:
```bash
cd cloudslate-cms
npm run dev
```

Or from project root:
```bash
npm run sanity:dev
```

Studio will be available at: `http://localhost:3333`

### Step 7: Deploy Studio (Optional)

Deploy your studio to make it accessible online:

From the `cloudslate-cms` folder:
```bash
cd cloudslate-cms
npm run deploy
```

Or from project root:
```bash
npm run sanity:deploy
```

This gives you a URL like: `https://cloudslate-cms.sanity.studio`

## 📝 Creating Your First Post

1. Open Sanity Studio (local or deployed)
2. Click "Create new" → "Blog Post"
3. Fill in the required fields:
   - **Title**: Your post title
   - **Slug**: Auto-generated from title (or customize)
   - **Excerpt**: 25-160 characters
   - **Content**: Rich text editor
   - **Author**: Default is "Muhammad Khuhro"
   - **Published Date**: Auto-set to current date
   - **Category**: Select from dropdown
   - **Tags**: Add relevant tags
   - **Featured**: Toggle if featured post
   - **Featured Image**: Upload or use URL
   - **Read Time**: Estimated reading time in minutes
   - **SEO Settings**: Optional meta description and keywords

4. Click "Publish"

## 🔗 Frontend Integration

The frontend is already configured! The `assets/js/sanity-client.js` file:
- ✅ Fetches posts from Sanity
- ✅ Transforms content to HTML
- ✅ Includes caching (5 minutes)
- ✅ Has fallback system (Sanity → API → localStorage → config.js)

### How It Works

1. **Sanity CMS** → Content management
2. **Sanity API** → Fetches via GROQ queries
3. **Frontend** → Displays posts automatically
4. **Fallback** → If Sanity is unavailable, uses backup sources

## 📁 Project Structure

```
CloudSlate/
├── cloudslate-cms/            # Sanity Studio
│   ├── schemaTypes/
│   │   ├── post.ts           # Blog post schema (TypeScript)
│   │   └── index.ts          # Schema exports
│   ├── sanity.config.ts      # Studio configuration
│   ├── sanity.cli.ts         # CLI configuration
│   └── package.json          # Studio dependencies
├── assets/
│   └── js/
│       └── sanity-client.js  # Frontend Sanity client
└── package.json              # Root dependencies
```

## ⚙️ Configuration

### Update Project ID

If you need to change the project ID, update it in:
- `cloudslate-cms/sanity.config.ts`
- `assets/js/sanity-client.js`

**Current Project ID**: `pdd2xrq9`

### CORS Settings

If you encounter CORS errors:
1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **CORS origins**
4. Add: `https://cloudslate.pages.dev`
5. Enable credentials if needed

## 🎯 Features

### Schema Features
- ✅ Rich text editor with formatting
- ✅ Image uploads with optimization
- ✅ Category selection
- ✅ Tag system
- ✅ Featured post flag
- ✅ SEO settings (meta description, keywords)
- ✅ Read time calculator
- ✅ Preview with author and date

### Frontend Features
- ✅ Automatic content fetching
- ✅ Content transformation (blocks to HTML)
- ✅ Caching for performance
- ✅ Graceful fallback system
- ✅ Featured posts support
- ✅ Single post fetching

## 🔄 Migration

To migrate existing posts to Sanity:

1. Export posts as JSON
2. Use Sanity's import tool:
   ```bash
   sanity dataset import posts.json production
   ```
3. Or manually create posts in Studio

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Studio Guide](https://www.sanity.io/docs/studio)

## 🎉 You're Ready!

Your blog is now powered by Sanity CMS. Create and manage content through the beautiful Sanity Studio interface!

---

**Need Help?**
- Check [Sanity Documentation](https://www.sanity.io/docs)
- Visit [Sanity Community](https://slack.sanity.io/)

