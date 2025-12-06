// Sitemap Generator Script
// Run this script to generate sitemap.xml from your blog posts
// Usage: node assets/js/sitemap-generator.js

// This would typically be run as a build script
// For now, it's included for reference

function generateSitemap() {
    const baseUrl = BLOG_CONFIG.url;
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    BLOG_POSTS.forEach(post => {
        const postDate = post.date || currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/post.html?id=${post.id}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    sitemap += `
</urlset>`;
    
    return sitemap;
}

// If running in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateSitemap };
}

