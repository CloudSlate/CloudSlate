# Images Directory

## Current Structure

This directory currently contains:
- **Favicon files** (favicon.ico, favicon-16x16.png, favicon-32x32.png)
- **Apple touch icon** (apple-touch-icon.png)
- **Android Chrome icons** (android-chrome-192x192.png, android-chrome-512x512.png)
- **Web manifest** (site.webmanifest)

## Blog Post Images

Blog post images are currently stored as external URLs (e.g., Unsplash). 

### Option 1: Use External URLs (Current)
- Pros: No storage needed, unlimited images
- Cons: Dependency on external service, potential loading issues

### Option 2: Store Locally (Recommended for Production)
Create subdirectories for better organization:

```
assets/images/
├── posts/          # Blog post images
│   ├── featured/   # Featured post images
│   └── thumbnails/ # Thumbnail images
├── authors/        # Author profile images
└── categories/     # Category images
```

## Image Optimization Guidelines

### Recommended Image Sizes:
- **Featured images**: 1200x630px (Open Graph standard)
- **Thumbnails**: 800x450px (16:9 aspect ratio)
- **Author avatars**: 200x200px (square)
- **Category images**: 400x300px

### Image Formats:
- **WebP** (preferred) - Best compression, modern browsers
- **JPEG** - Good for photos, universal support
- **PNG** - Good for graphics with transparency
- **AVIF** - Best compression (newer browsers)

### Optimization Tools:
- [TinyPNG](https://tinypng.com/) - Compress images
- [Squoosh](https://squoosh.app/) - Convert and optimize
- [ImageOptim](https://imageoptim.com/) - Batch optimization

## Adding Local Images

1. **Upload image** to `assets/images/posts/`
2. **Optimize** the image (compress, resize)
3. **Update post** in admin panel with path:
   ```
   assets/images/posts/your-image.jpg
   ```
   or use relative path:
   ```
   /assets/images/posts/your-image.jpg
   ```

## Performance Tips

- ✅ All images use lazy loading (`loading="lazy"`)
- ✅ Images have async decoding (`decoding="async"`)
- ✅ Responsive images with proper aspect ratios
- ✅ Images are optimized for web delivery

## Current Image Usage

Blog posts reference images via the `image` field in post data:
```javascript
{
    image: "https://images.unsplash.com/photo-xxx" // External URL
    // or
    image: "assets/images/posts/my-image.jpg"      // Local path
}
```

The system supports both external URLs and local paths.

