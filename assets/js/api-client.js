// Public API Client for fetching posts from Cloudflare Worker
// This is used by the public-facing site (index.html, post.html, etc.)

const PUBLIC_API_URL = 'https://cloudslate-api.cloudslate.workers.dev';

// Cache posts to avoid multiple requests
let cachedPosts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 1 minute cache

// Fetch posts from API
async function fetchPostsFromAPI() {
    try {
        const response = await fetch(`${PUBLIC_API_URL}/api/posts`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const posts = await response.json();
        
        // Update cache
        cachedPosts = posts;
        cacheTimestamp = Date.now();
        
        return posts;
    } catch (error) {
        // Silently handle error - fallback system will handle it
        throw error;
    }
}

// Get posts with caching
async function getPostsFromAPI() {
    // Return cached posts if still valid
    if (cachedPosts && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
        return cachedPosts;
    }
    
    // Fetch fresh posts
    return await fetchPostsFromAPI();
}

// Get posts with fallback to localStorage/config
async function getBlogPosts() {
    // Try API first
    try {
        const posts = await getPostsFromAPI();
        if (posts && Array.isArray(posts) && posts.length > 0) {
            return posts;
        }
    } catch (error) {
        // Fallback to alternative data source
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
            // Silently handle parsing error
        }
    }
    
    // Final fallback to config.js
    return BLOG_POSTS || [];
}

// Export for use in other scripts
window.getBlogPosts = getBlogPosts;
window.fetchPostsFromAPI = fetchPostsFromAPI;

