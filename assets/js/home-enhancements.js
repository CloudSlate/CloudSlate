// Home Page Enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Search suggestions
    setupSearchSuggestions();
    
    // Filter buttons
    setupFilterButtons();
    
    // Newsletter form enhancement
    enhanceNewsletterForm();
    
    // Smooth scroll to sections
    setupSmoothScroll();
});

// Search suggestions
function setupSearchSuggestions() {
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('search-suggestions');
    
    if (!searchInput || !suggestions) return;
    
    // Show suggestions on focus
    searchInput.addEventListener('focus', () => {
        suggestions.classList.remove('hidden');
    });
    
    // Hide on blur (with delay to allow clicks)
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            suggestions.classList.add('hidden');
        }, 200);
    });
    
    // Handle tag clicks
    document.querySelectorAll('.search-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent.trim();
            searchInput.dispatchEvent(new Event('input'));
            suggestions.classList.add('hidden');
        });
    });
}

// Filter buttons
function setupFilterButtons() {
    const filterAll = document.getElementById('filter-all');
    const filterRecent = document.getElementById('filter-recent');
    const filterPopular = document.getElementById('filter-popular');
    const postsContainer = document.getElementById('posts-container');
    
    if (!filterAll || !postsContainer) return;
    
    const buttons = [filterAll, filterRecent, filterPopular];
    
    buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
            // Update active state
            buttons.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            });
            btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            btn.classList.add('bg-blue-600', 'text-white');
            
            // Show loading
            const loading = document.getElementById('posts-loading');
            if (loading) {
                loading.classList.remove('hidden');
                postsContainer.classList.add('opacity-50');
            }
            
            // Get posts
            const posts = await getBlogPosts();
            let filtered = [...posts];
            
            // Apply filter
            if (btn === filterRecent) {
                filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
            } else if (btn === filterPopular) {
                // Sort by featured first, then by date
                filtered = filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return new Date(b.date) - new Date(a.date);
                }).slice(0, 6);
            }
            
            // Render
            setTimeout(() => {
                postsContainer.innerHTML = filtered.map(post => createPostCard(post)).join('');
                postsContainer.classList.remove('opacity-50');
                if (loading) loading.classList.add('hidden');
                
                // Re-animate
                if (window.visualEffects && window.visualEffects.reanimateContent) {
                    window.visualEffects.reanimateContent();
                }
            }, 300);
        });
    });
}

// Enhanced newsletter form
function enhanceNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    
    if (!form || !emailInput) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if (!email) return;
        
        // Show success message
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = '✓ Subscribed!';
        button.classList.add('bg-green-600', 'hover:bg-green-700');
        button.classList.remove('bg-white', 'hover:bg-blue-50');
        
        // Store in localStorage (or send to API)
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600', 'hover:bg-green-700');
            button.classList.add('bg-white', 'hover:bg-blue-50');
            emailInput.value = '';
        }, 3000);
    });
}

// Smooth scroll to sections
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

