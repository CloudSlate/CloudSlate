// Main JavaScript for homepage
document.addEventListener('DOMContentLoaded', function() {
    // Only load these on homepage
    if (document.getElementById('posts-container')) {
        loadPosts();
        loadCategories();
        setupNewsletter();
    }
    
    // Load vision only if vision container exists (about page)
    if (document.getElementById('vision-content')) {
        loadVision();
    }
    
    setupMobileMenu();
    
    // AdSense is now handled by adsense.js
});

// Load and display posts
async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    const featuredContainer = document.getElementById('featured-posts');
    
    if (!postsContainer || !featuredContainer) return;
    
    // Get posts from API (with fallback)
    const posts = await getBlogPosts();
    
    // Get featured posts
    const featuredPosts = posts
        .filter(post => post.featured)
        .slice(0, BLOG_CONFIG.featuredPostsCount);
    
    // Display featured posts
    featuredContainer.innerHTML = featuredPosts.map(post => createPostCard(post)).join('');
    
    // Display all posts
    const allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    postsContainer.innerHTML = allPosts.map(post => createPostCard(post)).join('');
    
    // Update stats
    updateStats(posts, featuredPosts);
    
    // Re-animate newly loaded content
    if (window.visualEffects && window.visualEffects.reanimateContent) {
        setTimeout(() => {
            window.visualEffects.reanimateContent();
        }, 100);
    }
}

// Update homepage stats
function updateStats(posts, featuredPosts) {
    const statPosts = document.getElementById('stat-posts');
    const statCategories = document.getElementById('stat-categories');
    const statFeatured = document.getElementById('stat-featured');
    
    if (statPosts) {
        animateValue(statPosts, 0, posts.length, 1000);
    }
    if (statCategories) {
        const categories = [...new Set(posts.map(p => p.category))];
        animateValue(statCategories, 0, categories.length, 1000);
    }
    if (statFeatured) {
        animateValue(statFeatured, 0, featuredPosts.length, 1000);
    }
}

// Animate number counting
function animateValue(element, start, end, duration) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Create post card HTML
function createPostCard(post) {
    const formattedDate = formatDate(post.date);
    const tags = post.tags.map(tag => `<span class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">${tag}</span>`).join('');
    
    return `
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <a href="post.html?id=${post.id}">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover" loading="lazy" decoding="async">
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

// Load categories
async function loadCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;
    
    const posts = await getBlogPosts();
    const categories = [...new Set(posts.map(post => post.category))];
    
    categoriesContainer.innerHTML = categories.map(category => `
        <a href="index.html?category=${encodeURIComponent(category)}" 
           class="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition">
            ${category}
        </a>
    `).join('');
    
    // Filter by category if specified in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    if (categoryFilter) {
        await filterByCategory(categoryFilter);
    }
}

// Filter posts by category
async function filterByCategory(category) {
    const posts = await getBlogPosts();
    const filteredPosts = posts.filter(post => post.category === category);
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        postsContainer.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
        
        // Re-animate filtered content
        if (window.visualEffects && window.visualEffects.reanimateContent) {
            setTimeout(() => {
                window.visualEffects.reanimateContent();
            }, 100);
        }
    }
}

// Setup newsletter form
function setupNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        
        // Here you would integrate with your email service
        // For now, we'll just show a success message
        alert('Thank you for subscribing! Check your email for confirmation.');
        form.reset();
        
        // Example: Send to your backend or email service
        // fetch('/api/newsletter', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });
    }
}

// Load vision statement
function loadVision() {
    const visionContainer = document.getElementById('vision-content');
    if (!visionContainer || !BLOG_CONFIG.vision) return;
    
    // Format vision as paragraphs
    const paragraphs = BLOG_CONFIG.vision.split('. ').filter(p => p.trim().length > 0);
    visionContainer.innerHTML = paragraphs.map(p => {
        const trimmed = p.trim();
        if (!trimmed.endsWith('.')) {
            return `<p>${trimmed}.</p>`;
        }
        return `<p>${trimmed}</p>`;
    }).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// AdSense functionality moved to assets/js/adsense.js

