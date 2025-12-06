// Dynamic Sitemap Generator
// Run this to generate/update sitemap.xml

const fs = require('fs');
const path = require('path');

// This would be used in a Node.js environment
// For static sites, you can run this before deployment

async function generateSitemap() {
    const baseUrl = 'https://cloudslate.com'; // Update with your domain
    const today = new Date().toISOString().split('T')[0];
    
    // Load posts from config or API
    // This is a template - adapt based on your data source
    const posts = []; // Load your posts here
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>${baseUrl}/about.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Contact Page -->
  <url>
    <loc>${baseUrl}/contact.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog Posts -->
`;

    posts.forEach(post => {
        sitemap += `  <url>
    <loc>${baseUrl}/post.html?id=${post.id}</loc>
    <lastmod>${post.date || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.excerpt}</image:caption>
    </image:image>
  </url>
`;
    });

    sitemap += `</urlset>`;

    // Write to file
    fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');
    console.log('Sitemap generated successfully!');
}

// Uncomment to run
// generateSitemap();

module.exports = { generateSitemap };

