// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
});

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            if (query.length > 0) {
                performSearch(query);
            } else {
                resetSearch();
            }
        }, 300);
    });
    
    // Handle Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim().toLowerCase();
            if (query.length > 0) {
                performSearch(query);
            }
        }
    });
}

// Get posts from storage or config
function getBlogPosts() {
    const savedPosts = localStorage.getItem('cloudslate_admin_posts');
    if (savedPosts) {
        try {
            return JSON.parse(savedPosts);
        } catch (e) {
            console.error('Error parsing saved posts:', e);
        }
    }
    return BLOG_POSTS || [];
}

function performSearch(query) {
    const postsContainer = document.getElementById('posts-container');
    const featuredContainer = document.getElementById('featured-posts');
    
    if (!postsContainer) return;
    
    // Hide featured posts during search
    if (featuredContainer) {
        featuredContainer.style.display = 'none';
    }
    
    // Get posts from storage or config
    const posts = getBlogPosts();
    
    // Search in title, excerpt, content, tags, and category
    const results = posts.filter(post => {
        const searchableText = [
            post.title,
            post.excerpt,
            post.content,
            post.category,
            ...post.tags
        ].join(' ').toLowerCase();
        
        return searchableText.includes(query);
    });
    
    if (results.length === 0) {
        postsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-600 dark:text-gray-400 text-lg mb-2">No posts found</p>
                <p class="text-gray-500 dark:text-gray-500">Try a different search term</p>
            </div>
        `;
    } else {
        postsContainer.innerHTML = results.map(post => createPostCard(post)).join('');
    }
    
    // Update page title
    document.title = `Search: ${query} - ${BLOG_CONFIG.name}`;
}

function resetSearch() {
    const postsContainer = document.getElementById('posts-container');
    const featuredContainer = document.getElementById('featured-posts');
    
    if (!postsContainer) return;
    
    // Show featured posts again
    if (featuredContainer) {
        featuredContainer.style.display = 'grid';
    }
    
    // Reload all posts
    const posts = getBlogPosts();
    const allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    postsContainer.innerHTML = allPosts.map(post => createPostCard(post)).join('');
    
    // Reset page title
    document.title = `${BLOG_CONFIG.name} - Tech Blog & Tutorials`;
}

// Reuse the createPostCard function from main.js
function createPostCard(post) {
    const formattedDate = formatDate(post.date);
    const tags = post.tags.map(tag => `<span class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">${tag}</span>`).join('');
    
    return `
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <a href="post.html?id=${post.id}">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
            </a>
            <div class="p-6">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>${formattedDate}</span>
                    <span>•</span>
                    <span>${post.readTime}</span>
                </div>
                <a href="post.html?id=${post.id}">
                    <h3 class="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400">${post.title}</h3>
                </a>
                <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">${post.excerpt}</p>
                <div class="flex items-center justify-between">
                    <div class="flex flex-wrap gap-2">
                        ${tags}
                    </div>
                    <a href="post.html?id=${post.id}" class="text-blue-600 dark:text-blue-400 hover:underline">
                        Read more →
                    </a>
                </div>
            </div>
        </article>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

