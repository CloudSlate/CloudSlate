// SEO Optimization System
// Handles dynamic SEO meta tags, structured data, and sitemap generation

class SEOOptimizer {
    constructor() {
        this.config = BLOG_CONFIG;
        this.init();
    }

    init() {
        this.updateMetaTags();
        this.generateStructuredData();
        this.addCanonicalURL();
        this.generateBreadcrumbs();
        this.optimizeImages();
        this.addArticleSchema();
    }

    // ============================================
    // META TAGS OPTIMIZATION
    // ============================================
    
    updateMetaTags() {
        const url = window.location.href;
        const isPost = url.includes('post.html');
        
        if (isPost) {
            this.updatePostMetaTags();
        } else {
            this.updateHomeMetaTags();
        }
    }

    updateHomeMetaTags() {
        // Update title
        document.title = `${this.config.name} - ${this.config.description.substring(0, 50)}`;
        
        // Update meta description (25-160 characters for SEO)
        let description = this.config.description;
        if (description.length > 160) {
            description = description.substring(0, 157) + '...';
        }
        if (description.length < 25) {
            description = `${description} - Modern tech blog and tutorials.`;
        }
        this.setMetaTag('description', description);
        
        // Update keywords
        const keywords = this.extractKeywords();
        this.setMetaTag('keywords', keywords.join(', '));
        
        // Update Open Graph
        this.setOGTag('type', 'website');
        this.setOGTag('url', this.config.url);
        this.setOGTag('title', `${this.config.name} - Modern Tech Blog`);
        this.setOGTag('description', this.config.description);
        this.setOGTag('image', `${this.config.url}/assets/og-image.jpg`);
        this.setOGTag('site_name', this.config.name);
        
        // Update Twitter Card
        this.setTwitterTag('card', 'summary_large_image');
        this.setTwitterTag('url', this.config.url);
        this.setTwitterTag('title', `${this.config.name} - Modern Tech Blog`);
        this.setTwitterTag('description', this.config.description);
        this.setTwitterTag('image', `${this.config.url}/assets/og-image.jpg`);
    }

    async updatePostMetaTags() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) return;
        
        const posts = await getBlogPosts();
        const post = posts.find(p => p.id === postId);
        
        if (!post) return;
        
        // Update title (max 60 characters for SEO)
        const title = `${post.title} - ${this.config.name}`;
        document.title = title.length > 60 ? title.substring(0, 57) + '...' : title;
        
        // Update meta description (25-160 characters for SEO)
        let description = post.excerpt || post.title;
        if (description.length < 25) {
            // If too short, add more context
            description = `${description} - ${this.config.name} blog post about ${post.category}.`;
        }
        if (description.length > 160) {
            description = description.substring(0, 157) + '...';
        }
        this.setMetaTag('description', description);
        
        // Update keywords
        const keywords = [post.category, ...post.tags].join(', ');
        this.setMetaTag('keywords', keywords);
        
        // Update Open Graph for article
        this.setOGTag('type', 'article');
        this.setOGTag('url', `${this.config.url}/post.html?id=${post.id}`);
        this.setOGTag('title', post.title);
        this.setOGTag('description', description);
        this.setOGTag('image', post.image);
        this.setOGTag('article:published_time', post.date);
        this.setOGTag('article:author', post.author);
        this.setOGTag('article:section', post.category);
        post.tags.forEach(tag => {
            this.addOGTag('article:tag', tag);
        });
        
        // Update Twitter Card
        this.setTwitterTag('card', 'summary_large_image');
        this.setTwitterTag('url', `${this.config.url}/post.html?id=${post.id}`);
        this.setTwitterTag('title', post.title);
        this.setTwitterTag('description', description);
        this.setTwitterTag('image', post.image);
    }

    setMetaTag(name, content) {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = name;
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    setOGTag(property, content) {
        let tag = document.querySelector(`meta[property="og:${property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', `og:${property}`);
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    addOGTag(property, content) {
        const tag = document.createElement('meta');
        tag.setAttribute('property', `og:${property}`);
        tag.content = content;
        document.head.appendChild(tag);
    }

    setTwitterTag(name, content) {
        let tag = document.querySelector(`meta[property="twitter:${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', `twitter:${name}`);
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    extractKeywords() {
        const keywords = ['web development', 'programming', 'technology', 'tutorials', 'coding'];
        // Add category-based keywords
        if (typeof getBlogPosts === 'function') {
            getBlogPosts().then(posts => {
                const categories = [...new Set(posts.map(p => p.category))];
                keywords.push(...categories);
            });
        }
        return keywords;
    }

    // ============================================
    // STRUCTURED DATA (JSON-LD)
    // ============================================
    
    generateStructuredData() {
        const url = window.location.href;
        const isPost = url.includes('post.html');
        
        if (isPost) {
            this.generateArticleSchema();
        } else {
            this.generateWebsiteSchema();
            this.generateBreadcrumbList();
        }
    }

    generateWebsiteSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": this.config.name,
            "url": this.config.url,
            "description": this.config.description,
            "author": {
                "@type": "Person",
                "name": this.config.author,
                "email": this.config.contact.email
            },
            "publisher": {
                "@type": "Organization",
                "name": this.config.name,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${this.config.url}/assets/logo.png`
                }
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${this.config.url}/?search={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        };
        
        this.injectSchema(schema);
    }

    async generateArticleSchema() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) return;
        
        const posts = await getBlogPosts();
        const post = posts.find(p => p.id === postId);
        
        if (!post) return;
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": {
                "@type": "ImageObject",
                "url": post.image,
                "width": 1200,
                "height": 630
            },
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
                "@type": "Person",
                "name": post.author,
                "url": this.config.url
            },
            "publisher": {
                "@type": "Organization",
                "name": this.config.name,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${this.config.url}/assets/logo.png`,
                    "width": 600,
                    "height": 60
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${this.config.url}/post.html?id=${post.id}`
            },
            "articleSection": post.category,
            "keywords": post.tags.join(', '),
            "wordCount": post.content.split(' ').length,
            "inLanguage": "en-US"
        };
        
        this.injectSchema(schema);
    }

    generateBreadcrumbList() {
        const url = window.location.href;
        const breadcrumbs = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": this.config.url
            }
        ];
        
        if (url.includes('post.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');
            if (postId) {
                getBlogPosts().then(posts => {
                    const post = posts.find(p => p.id === postId);
                    if (post) {
                        breadcrumbs.push({
                            "@type": "ListItem",
                            "position": 2,
                            "name": post.category,
                            "item": `${this.config.url}/?category=${encodeURIComponent(post.category)}`
                        });
                        breadcrumbs.push({
                            "@type": "ListItem",
                            "position": 3,
                            "name": post.title,
                            "item": `${this.config.url}/post.html?id=${post.id}`
                        });
                    }
                    
                    const schema = {
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": breadcrumbs
                    };
                    
                    this.injectSchema(schema);
                });
            }
        } else {
            const schema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbs
            };
            
            this.injectSchema(schema);
        }
    }

    generateBreadcrumbs() {
        // Visual breadcrumbs for users
        const breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (!breadcrumbContainer) return;
        
        const url = window.location.href;
        let breadcrumbs = `<a href="${this.config.url}">Home</a>`;
        
        if (url.includes('post.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');
            if (postId) {
                getBlogPosts().then(posts => {
                    const post = posts.find(p => p.id === postId);
                    if (post) {
                        breadcrumbs += ` / <a href="${this.config.url}/?category=${encodeURIComponent(post.category)}">${post.category}</a>`;
                        breadcrumbs += ` / <span>${post.title}</span>`;
                        breadcrumbContainer.innerHTML = breadcrumbs;
                    }
                });
            }
        }
    }

    injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // ============================================
    // CANONICAL URL
    // ============================================
    
    addCanonicalURL() {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = window.location.href.split('?')[0]; // Remove query params for canonical
    }

    // ============================================
    // IMAGE OPTIMIZATION
    // ============================================
    
    optimizeImages() {
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            if (!img.alt) {
                img.alt = img.title || 'CloudSlate blog image';
            }
            // Add loading="lazy" for better performance
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    // ============================================
    // ARTICLE SCHEMA
    // ============================================
    
    addArticleSchema() {
        // This is handled in generateArticleSchema
    }
}

// Initialize SEO optimizer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.seoOptimizer = new SEOOptimizer();
    });
} else {
    window.seoOptimizer = new SEOOptimizer();
}

// Generate dynamic sitemap
async function generateSitemap() {
    const posts = await getBlogPosts();
    const baseUrl = BLOG_CONFIG.url;
    const today = new Date().toISOString().split('T')[0];
    
    const urls = [
        {
            loc: baseUrl,
            lastmod: today,
            changefreq: 'daily',
            priority: '1.0'
        },
        {
            loc: `${baseUrl}/about.html`,
            lastmod: today,
            changefreq: 'monthly',
            priority: '0.9'
        },
        {
            loc: `${baseUrl}/contact.html`,
            lastmod: today,
            changefreq: 'monthly',
            priority: '0.9'
        }
    ];
    
    posts.forEach(post => {
        urls.push({
            loc: `${baseUrl}/post.html?id=${post.id}`,
            lastmod: post.date,
            changefreq: 'monthly',
            priority: '0.8'
        });
    });
    
    return urls;
}

// Export for use in sitemap generation
window.generateSitemap = generateSitemap;

