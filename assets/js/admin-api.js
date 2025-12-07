// Admin API Integration for Cloudflare Workers
// Replace localStorage with API calls

const API_CONFIG = {
    baseUrl: 'https://cloudslate-api.cloudslate.workers.dev',
    token: 'IjgECbOqwUBtamvo964f1zlTiYh2pDFS',
};

// Helper function for API calls
async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add auth token for write operations
    if (method !== 'GET') {
        options.headers['Authorization'] = `Bearer ${API_CONFIG.token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        // API request failed - will use fallback
        throw error;
    }
}

// Replace localStorage functions with API calls
const AdminAPI = {
    // Get all posts
    async getPosts() {
        try {
            return await apiRequest('/api/posts');
        } catch (error) {
            // Fallback to localStorage if API fails
            const saved = localStorage.getItem('cloudslate_admin_posts');
            if (saved) {
                return JSON.parse(saved);
            }
            return BLOG_POSTS || [];
        }
    },

    // Save posts
    async savePosts(posts) {
        try {
            // For now, we'll save all posts at once
            // In a real implementation, you might want to save individually
            // This is a simplified version - you may need to adjust based on your API
            
            // Save to API (if you implement bulk save endpoint)
            // For now, we'll also save to localStorage as backup
            localStorage.setItem('cloudslate_admin_posts', JSON.stringify(posts));
            
            // If you want to sync to API, implement individual post saves
            // for (const post of posts) {
            //     await apiRequest('/api/posts', 'POST', post);
            // }
            
            return true;
        } catch (error) {
            // Fallback to localStorage
            localStorage.setItem('cloudslate_admin_posts', JSON.stringify(posts));
            return false;
        }
    },

    // Create post
    async createPost(post) {
        try {
            return await apiRequest('/api/posts', 'POST', post);
        } catch (error) {
            // Fallback to localStorage
            const posts = await this.getPosts();
            post.id = post.id || `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            posts.push(post);
            localStorage.setItem('cloudslate_admin_posts', JSON.stringify(posts));
            return post;
        }
    },

    // Update post
    async updatePost(postId, postData) {
        try {
            return await apiRequest(`/api/posts/${postId}`, 'PUT', postData);
        } catch (error) {
            // Fallback to localStorage
            const posts = await this.getPosts();
            const index = posts.findIndex(p => p.id === postId);
            if (index !== -1) {
                posts[index] = { ...posts[index], ...postData };
                localStorage.setItem('cloudslate_admin_posts', JSON.stringify(posts));
                return posts[index];
            }
            throw new Error('Post not found');
        }
    },

    // Delete post
    async deletePost(postId) {
        try {
            return await apiRequest(`/api/posts/${postId}`, 'DELETE');
        } catch (error) {
            // Fallback to localStorage
            const posts = await this.getPosts();
            const filtered = posts.filter(p => p.id !== postId);
            localStorage.setItem('cloudslate_admin_posts', JSON.stringify(filtered));
            return true;
        }
    },
};

// Export for use in admin.js
window.AdminAPI = AdminAPI;

