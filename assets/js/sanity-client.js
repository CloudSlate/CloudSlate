/**
 * Sanity CMS Client
 * Fetches blog posts from Sanity CMS
 */

// Sanity Configuration
const SANITY_CONFIG = {
    projectId: 'pdd2xrq9', // Your Sanity project ID
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
};

// Sanity API URL
const SANITY_API_URL = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;

/**
 * GROQ Query for all posts
 */
const ALL_POSTS_QUERY = encodeURIComponent(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    excerpt,
    "content": content[],
    author,
    "date": publishedAt,
    category,
    tags,
    featured,
    "image": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    readTime,
    "metaDescription": seo.metaDescription,
    "keywords": seo.keywords
}`);

/**
 * GROQ Query for single post by slug
 */
const POST_BY_SLUG_QUERY = (slug) => encodeURIComponent(`*[_type == "post" && slug.current == "${slug}"][0] {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    excerpt,
    "content": content[],
    author,
    "date": publishedAt,
    category,
    tags,
    featured,
    "image": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    readTime,
    "metaDescription": seo.metaDescription,
    "keywords": seo.keywords
}`);

/**
 * GROQ Query for featured posts
 */
const FEATURED_POSTS_QUERY = encodeURIComponent(`*[_type == "post" && featured == true] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    excerpt,
    "content": content[],
    author,
    "date": publishedAt,
    category,
    tags,
    featured,
    "image": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    readTime,
    "metaDescription": seo.metaDescription,
    "keywords": seo.keywords
}`);

/**
 * Fetch data from Sanity API
 */
async function fetchSanityData(encodedQuery) {
    try {
        const response = await fetch(`${SANITY_API_URL}?query=${encodedQuery}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Sanity API error: ${response.status}`);
        }

        const result = await response.json();
        return result.result || [];
    } catch (error) {
        console.error('Failed to fetch from Sanity:', error);
        throw error;
    }
}

/**
 * Transform Sanity content blocks to HTML
 */
function transformContent(content) {
    if (!content || !Array.isArray(content)) {
        return '';
    }

    return content.map(block => {
        if (block._type === 'block') {
            const text = block.children.map(child => child.text).join('');
            const style = block.style || 'normal';
            
            switch (style) {
                case 'h1':
                    return `<h1>${text}</h1>`;
                case 'h2':
                    return `<h2>${text}</h2>`;
                case 'h3':
                    return `<h3>${text}</h3>`;
                case 'h4':
                    return `<h4>${text}</h4>`;
                case 'blockquote':
                    return `<blockquote>${text}</blockquote>`;
                default:
                    return `<p>${text}</p>`;
            }
        } else if (block._type === 'image') {
            const url = block.asset?.url || '';
            const alt = block.alt || '';
            return `<img src="${url}" alt="${alt}" />`;
        }
        return '';
    }).join('');
}

/**
 * Transform Sanity post to match existing structure
 */
function transformPost(post) {
    if (!post) return null;

    return {
        id: post.id || post.slug,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: typeof post.content === 'string' ? post.content : transformContent(post.content),
        author: post.author,
        date: post.date || new Date().toISOString(),
        category: post.category,
        tags: post.tags || [],
        featured: post.featured || false,
        image: post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        readTime: post.readTime ? `${post.readTime} min read` : '5 min read',
        metaDescription: post.metaDescription || post.excerpt,
        keywords: post.keywords || []
    };
}

// Cache for posts
let postsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 300000; // 5 minutes

/**
 * Get all posts from Sanity
 */
async function getSanityPosts() {
    // Return cached posts if still valid
    if (postsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
        return postsCache;
    }

    try {
        const posts = await fetchSanityData(ALL_POSTS_QUERY);
        const transformedPosts = posts.map(transformPost).filter(Boolean);
        
        // Update cache
        postsCache = transformedPosts;
        cacheTimestamp = Date.now();

        return transformedPosts;
    } catch (error) {
        console.error('Error fetching posts from Sanity:', error);
        throw error;
    }
}

/**
 * Get post by slug/ID
 */
async function getSanityPost(slug) {
    try {
        const post = await fetchSanityData(POST_BY_SLUG_QUERY(slug));
        return transformPost(post);
    } catch (error) {
        console.error('Error fetching post from Sanity:', error);
        throw error;
    }
}

/**
 * Get featured posts
 */
async function getSanityFeaturedPosts() {
    try {
        const posts = await fetchSanityData(FEATURED_POSTS_QUERY);
        return posts.map(transformPost).filter(Boolean);
    } catch (error) {
        console.error('Error fetching featured posts from Sanity:', error);
        throw error;
    }
}

/**
 * Get blog posts with fallback system
 */
async function getBlogPosts() {
    try {
        // Try Sanity first
        const posts = await getSanityPosts();
        if (posts && Array.isArray(posts) && posts.length > 0) {
            return posts;
        }
    } catch (error) {
        console.log('Sanity unavailable, using fallback:', error);
    }
    
    // Fallback to Cloudflare Worker API
    try {
        const response = await fetch('https://cloudslate-api.cloudslate.workers.dev/api/posts');
        if (response.ok) {
            const posts = await response.json();
            if (posts && Array.isArray(posts) && posts.length > 0) {
                return posts;
            }
        }
    } catch (error) {
        console.log('API unavailable, using localStorage fallback:', error);
    }
    
    // Fallback to localStorage
    const savedPosts = localStorage.getItem('cloudslate_admin_posts');
    if (savedPosts) {
        try {
            const parsed = JSON.parse(savedPosts);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.error('Error parsing saved posts:', e);
        }
    }
    
    // Final fallback to config.js
    return typeof BLOG_POSTS !== 'undefined' ? BLOG_POSTS : [];
}

// Export functions
window.SanityClient = {
    getPosts: getSanityPosts,
    getPost: getSanityPost,
    getFeaturedPosts: getSanityFeaturedPosts,
    config: SANITY_CONFIG
};

// Export for use in other scripts
window.getBlogPosts = getBlogPosts;

