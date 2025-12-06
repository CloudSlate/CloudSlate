// Cloudflare Worker API for Blog Posts Storage
// Deploy this as a Cloudflare Worker with KV namespace binding

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // Handle preflight requests
        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Simple authentication check
        const authHeader = request.headers.get('Authorization');
        const validToken = env.ADMIN_TOKEN || 'your-secret-token-change-this';
        
        if (path.startsWith('/api/posts') && method !== 'GET') {
            if (authHeader !== `Bearer ${validToken}`) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        // Routes
        if (path === '/api/posts' && method === 'GET') {
            // Get all posts
            const posts = await env.BLOG_STORAGE.get('posts', 'json') || [];
            return new Response(JSON.stringify(posts), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (path === '/api/posts' && method === 'POST') {
            // Create new post
            const post = await request.json();
            const posts = await env.BLOG_STORAGE.get('posts', 'json') || [];
            post.id = post.id || `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            post.createdAt = new Date().toISOString();
            posts.push(post);
            await env.BLOG_STORAGE.put('posts', JSON.stringify(posts));
            return new Response(JSON.stringify(post), {
                status: 201,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (path.startsWith('/api/posts/') && method === 'PUT') {
            // Update post
            const postId = path.split('/').pop();
            const updatedPost = await request.json();
            const posts = await env.BLOG_STORAGE.get('posts', 'json') || [];
            const index = posts.findIndex(p => p.id === postId);
            
            if (index === -1) {
                return new Response(JSON.stringify({ error: 'Post not found' }), {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
            
            posts[index] = { ...posts[index], ...updatedPost, updatedAt: new Date().toISOString() };
            await env.BLOG_STORAGE.put('posts', JSON.stringify(posts));
            return new Response(JSON.stringify(posts[index]), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (path.startsWith('/api/posts/') && method === 'DELETE') {
            // Delete post
            const postId = path.split('/').pop();
            const posts = await env.BLOG_STORAGE.get('posts', 'json') || [];
            const filtered = posts.filter(p => p.id !== postId);
            await env.BLOG_STORAGE.put('posts', JSON.stringify(filtered));
            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (path === '/api/health' && method === 'GET') {
            // Health check
            return new Response(JSON.stringify({ status: 'ok' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    },
};

