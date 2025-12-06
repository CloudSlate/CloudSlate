// JavaScript for individual post pages
document.addEventListener('DOMContentLoaded', function() {
    loadPost();
    setupNewsletter();
    setupMobileMenu();
    
    // Initialize AdSense if enabled
    if (BLOG_CONFIG.adsense.enabled) {
        loadAdSense();
    }
});

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

// Load post content
function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }
    
    const posts = getBlogPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        document.body.innerHTML = '<div class="max-w-4xl mx-auto px-4 py-12 text-center"><h1 class="text-3xl font-bold mb-4">Post Not Found</h1><p class="mb-6">The post you're looking for doesn't exist.</p><a href="index.html" class="text-blue-600 hover:underline">Go back home</a></div>';
        return;
    }
    
    // Update page title and meta tags
    document.title = `${post.title} - ${BLOG_CONFIG.name}`;
    updateMetaTags(post);
    
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
    
    shareContainer.innerHTML = `
        <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
            Twitter
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
        </a>
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
        </a>
        <button onclick="copyToClipboard('${BLOG_CONFIG.url}/post.html?id=${post.id}')" 
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            Copy Link
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
function loadRelatedPosts(currentPost) {
    const relatedContainer = document.getElementById('related-posts');
    if (!relatedContainer) return;
    
    const posts = getBlogPosts();
    
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
                <img src="${post.image}" alt="${post.title}" class="w-full h-40 object-cover">
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

// Load Google AdSense (same as main.js)
function loadAdSense() {
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${BLOG_CONFIG.adsense.publisherId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    
    setTimeout(() => {
        initializeAdUnits();
    }, 1000);
}

function initializeAdUnits() {
    const adUnits = [
        { id: 'adsense-inline-top', adSlot: BLOG_CONFIG.adsense.adUnits.inlineTop },
        { id: 'adsense-inline-bottom', adSlot: BLOG_CONFIG.adsense.adUnits.inlineBottom }
    ];
    
    adUnits.forEach(unit => {
        const container = document.getElementById(unit.id);
        if (container) {
            container.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${BLOG_CONFIG.adsense.publisherId}"
                     data-ad-slot="${unit.adSlot}"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            `;
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.log('AdSense not ready');
            }
        }
    });
}

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

