// Dynamic Sitemap Generator for CloudSlate
// Run this script to automatically generate sitemap.xml from your blog posts
// Usage: node generate-sitemap.js

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://cloudslate.pages.dev';
const TODAY = new Date().toISOString().split('T')[0];

// Load posts from config.js (you may need to adjust this based on your setup)
function loadPosts() {
    try {
        // Try to read from config.js
        const configPath = path.join(__dirname, 'config.js');
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        // Extract BLOG_POSTS array using regex (simple approach)
        const postsMatch = configContent.match(/const BLOG_POSTS = (\[[\s\S]*?\]);/);
        if (postsMatch) {
            // Evaluate the array (in production, use a proper JSON parser)
            const posts = eval(postsMatch[1]);
            return posts;
        }
        
        // Fallback: return empty array
        return [];
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

// Generate sitemap XML
function generateSitemap() {
    const posts = loadPosts();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>${BASE_URL}/about.html</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Contact Page -->
  <url>
    <loc>${BASE_URL}/contact.html</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
`;

    // Add blog posts
    posts.forEach(post => {
        const postDate = post.date || TODAY;
        const postUrl = `${BASE_URL}/post.html?id=${encodeURIComponent(post.id)}`;
        const imageUrl = post.image || '';
        const imageTitle = escapeXml(post.title);
        const imageCaption = escapeXml(post.excerpt || '');
        
        sitemap += `  <!-- Blog Post: ${post.title} -->
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>`;
        
        // Add image if available
        if (imageUrl) {
            sitemap += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${imageTitle}</image:title>
      <image:caption>${imageCaption}</image:caption>
    </image:image>`;
        }
        
        sitemap += `
  </url>
  
`;
    });

    sitemap += `</urlset>`;

    // Write to file
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   - Total URLs: ${3 + posts.length} (3 pages + ${posts.length} posts)`);
    console.log(`   - Saved to: ${sitemapPath}`);
    console.log(`   - Sitemap URL: ${BASE_URL}/sitemap.xml`);
}

// Escape XML special characters
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Run if called directly
if (require.main === module) {
    generateSitemap();
}

module.exports = { generateSitemap };
