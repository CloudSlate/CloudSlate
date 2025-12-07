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
        searchTimeout = setTimeout(async () => {
            if (query.length > 0) {
                await performSearch(query);
            } else {
                await resetSearch();
            }
        }, 300);
    });
    
    // Handle Enter key
    searchInput.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim().toLowerCase();
            if (query.length > 0) {
                await performSearch(query);
            }
        }
    });
}

async function performSearch(query) {
    const postsContainer = document.getElementById('posts-container');
    const featuredContainer = document.getElementById('featured-posts');
    
    if (!postsContainer) return;
    
    // Hide featured posts during search
    if (featuredContainer) {
        featuredContainer.style.display = 'none';
    }
    
    // Get posts from API (with fallback)
    const posts = await getBlogPosts();
    
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
        
        // Re-animate search results
        if (window.visualEffects && window.visualEffects.reanimateContent) {
            setTimeout(() => {
                window.visualEffects.reanimateContent();
            }, 100);
        }
    }
    
    // Update page title
    document.title = `Search: ${query} - ${BLOG_CONFIG.name}`;
}

async function resetSearch() {
    const postsContainer = document.getElementById('posts-container');
    const featuredContainer = document.getElementById('featured-posts');
    
    if (!postsContainer) return;
    
    // Show featured posts again
    if (featuredContainer) {
        featuredContainer.style.display = 'grid';
    }
    
    // Reload all posts
    const posts = await getBlogPosts();
    const allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    postsContainer.innerHTML = allPosts.map(post => createPostCard(post)).join('');
    
    // Re-animate reset content
    if (window.visualEffects && window.visualEffects.reanimateContent) {
        setTimeout(() => {
            window.visualEffects.reanimateContent();
        }, 100);
    }
    
    // Reset page title
    document.title = `${BLOG_CONFIG.name} - Tech Blog & Tutorials`;
}

// Reuse the createPostCard function from main.js
function createPostCard(post) {
    const formattedDate = formatDate(post.date);
    const tags = post.tags.map(tag => `<span class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">${tag}</span>`).join('');
    
    return `
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <a href="post.html?id=${post.id}" class="block relative h-48 overflow-hidden">
                <div class="post-image-fixed" style="background-image: url('${post.image}');"></div>
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover post-image-overlay" loading="lazy" decoding="async">
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

