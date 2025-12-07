// JavaScript for individual post pages
document.addEventListener('DOMContentLoaded', function() {
    loadPost();
    setupNewsletter();
    setupMobileMenu();
    
    // AdSense is now handled by adsense.js
});

// Load post content
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }
    
    const posts = await getBlogPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        document.body.innerHTML = '<div class="max-w-4xl mx-auto px-4 py-12 text-center"><h1 class="text-3xl font-bold mb-4">Post Not Found</h1><p class="mb-6">The post you're looking for doesn't exist.</p><a href="index.html" class="text-blue-600 hover:underline">Go back home</a></div>';
        return;
    }
    
    // Update page title and meta tags
    document.title = `${post.title} - ${BLOG_CONFIG.name}`;
    updateMetaTags(post);
    
    // Update breadcrumbs
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    if (breadcrumbCategory) {
        breadcrumbCategory.innerHTML = `<a href="index.html?category=${encodeURIComponent(post.category)}" class="hover:text-gray-900 dark:hover:text-white">${post.category}</a>`;
    }
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = post.title;
    }
    
    // Update post content
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-title-breadcrumb').textContent = post.title;
    document.getElementById('post-date').textContent = formatDate(post.date);
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-read-time').textContent = post.readTime;
    document.getElementById('post-category').innerHTML = `<a href="index.html?category=${encodeURIComponent(post.category)}" class="hover:text-gray-900 dark:hover:text-white">${post.category}</a>`;
    
    // Render tags
    const tagsContainer = document.getElementById('post-tags');
    tagsContainer.innerHTML = post.tags.map(tag => 
        `<a href="index.html?tag=${encodeURIComponent(tag)}" class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800">${tag}</a>`
    ).join('');
    
    // Render markdown content
    const contentContainer = document.getElementById('post-content');
    if (typeof marked !== 'undefined') {
        contentContainer.innerHTML = marked.parse(post.content);
        
        // Highlight code blocks with Prism
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(contentContainer);
        }
    } else {
        contentContainer.innerHTML = `<pre>${post.content}</pre>`;
    }
    
    // Setup social sharing
    setupSocialSharing(post);
    
    // Load related posts
    loadRelatedPosts(post);
}

// Update meta tags for SEO
function updateMetaTags(post) {
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = post.excerpt;
    }
    
    // Update keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.content = post.tags.join(', ');
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    if (ogTitle) ogTitle.content = post.title;
    if (ogDescription) ogDescription.content = post.excerpt;
    if (ogImage) ogImage.content = post.image;
    if (ogUrl) ogUrl.content = `${BLOG_CONFIG.url}/post.html?id=${post.id}`;
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    
    if (twitterTitle) twitterTitle.content = post.title;
    if (twitterDescription) twitterDescription.content = post.excerpt;
    if (twitterImage) twitterImage.content = post.image;
    if (twitterUrl) twitterUrl.content = `${BLOG_CONFIG.url}/post.html?id=${post.id}`;
    
    // Add structured data
    addStructuredData(post);
}

// Add structured data for SEO
function addStructuredData(post) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": BLOG_CONFIG.name,
            "logo": {
                "@type": "ImageObject",
                "url": `${BLOG_CONFIG.url}/assets/logo.png`
            }
        }
    };
    
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
}

// Setup social sharing buttons
function setupSocialSharing(post) {
    const shareContainer = document.getElementById('social-share');
    if (!shareContainer) return;
    
    const url = encodeURIComponent(`${BLOG_CONFIG.url}/post.html?id=${post.id}`);
    const title = encodeURIComponent(post.title);
    const description = encodeURIComponent(post.excerpt);
    
    const twitterIcon = window.Icons ? Icons.twitter : '';
    const facebookIcon = window.Icons ? Icons.facebook : '';
    const linkedinIcon = window.Icons ? Icons.linkedin : '';
    const copyIcon = window.Icons ? Icons.copy : '';
    
    shareContainer.innerHTML = `
        <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="group px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
            <span class="text-xl">🐦</span>
            <span>Twitter</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="group px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
            <span class="text-xl">📘</span>
            <span>Facebook</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
        </a>
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="group px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
            <span class="text-xl">💼</span>
            <span>LinkedIn</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
        </a>
        <button onclick="copyToClipboard('${BLOG_CONFIG.url}/post.html?id=${post.id}')" 
                class="group px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
            <span class="text-xl">📋</span>
            <span>Copy Link</span>
            <span class="group-hover:rotate-90 transition-transform">↻</span>
        </button>
    `;
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
    });
}

// Load related posts
async function loadRelatedPosts(currentPost) {
    const relatedContainer = document.getElementById('related-posts');
    if (!relatedContainer) return;
    
    const posts = await getBlogPosts();
    
    // Find posts in the same category, excluding current post
    const relatedPosts = posts
        .filter(post => 
            post.id !== currentPost.id && 
            (post.category === currentPost.category || 
             post.tags.some(tag => currentPost.tags.includes(tag)))
        )
        .slice(0, 4);
    
    if (relatedPosts.length === 0) {
        relatedContainer.innerHTML = '<p class="text-gray-600 dark:text-gray-400">No related posts found.</p>';
        return;
    }
    
    relatedContainer.innerHTML = relatedPosts.map(post => `
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <a href="post.html?id=${post.id}">
                <img src="${post.image}" alt="${post.title}" class="w-full h-40 object-cover" loading="lazy" decoding="async">
            </a>
            <div class="p-4">
                <a href="post.html?id=${post.id}">
                    <h3 class="text-lg font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400">${post.title}</h3>
                </a>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">${post.excerpt}</p>
            </div>
        </article>
    `).join('');
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

// Setup newsletter (same as main.js)
function setupNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        alert('Thank you for subscribing! Check your email for confirmation.');
        form.reset();
    });
}

// Setup mobile menu (same as main.js)
function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });
    }
}

