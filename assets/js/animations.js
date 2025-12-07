// Visual Effects and Animations JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initImageLoading();
    initParallaxEffects();
    initStaggerAnimations();
    initButtonEffects();
    initScrollProgress();
    initRevealAnimations();
    
    // Re-initialize animations when new content is loaded (for dynamic posts)
    observeDynamicContent();
});

// ============================================
// SCROLL ANIMATIONS (Enhanced)
// ============================================

let scrollObserver = null;

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger delay based on index
                const siblings = Array.from(entry.target.parentElement.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.setProperty('--animation-delay', `${index * 0.1}s`);
                
                // Optional: Unobserve after animation for performance
                // scrollObserver.unobserve(entry.target);
            } else {
                // Reset animation when element leaves viewport (for repeat animations)
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    observeAnimatedElements();
    
    // Add animation classes to cards and sections automatically
    autoAnimateElements();
}

function observeAnimatedElements() {
    if (!scrollObserver) return;
    
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down, ' +
        '.scale-in, .rotate-in, .flip-in, .bounce-in, .zoom-in, .reveal-text, ' +
        '.reveal-left, .reveal-right, .reveal-up, .reveal-down'
    );
    
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });
}

function autoAnimateElements() {
    if (!scrollObserver) return;
    
    // Auto-animate articles and cards
    const cards = document.querySelectorAll('article, .post-card, .bg-white.rounded-lg, .bg-gray-800.rounded-lg');
    cards.forEach((card, index) => {
        if (!card.classList.contains('fade-in') && 
            !card.classList.contains('slide-in-left') && 
            !card.classList.contains('slide-in-right')) {
            card.classList.add('fade-in');
            card.style.setProperty('--animation-delay', `${index * 0.08}s`);
        }
        scrollObserver.observe(card);
    });
    
    // Auto-animate headings
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach((heading, index) => {
        if (!heading.closest('article') && !heading.classList.contains('fade-in')) {
            heading.classList.add('slide-in-up');
            heading.style.setProperty('--animation-delay', `${index * 0.1}s`);
            scrollObserver.observe(heading);
        }
    });
    
    // Auto-animate sections
    const sections = document.querySelectorAll('section:not(.no-animate)');
    sections.forEach((section, index) => {
        if (!section.classList.contains('fade-in')) {
            section.classList.add('fade-in');
            section.style.setProperty('--animation-delay', `${index * 0.1}s`);
            scrollObserver.observe(section);
        }
    });
}

// Observe dynamically loaded content
function observeDynamicContent() {
    // Use MutationObserver to watch for new content
    const contentObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Re-run auto-animation for new elements
                    if (node.matches && (node.matches('article') || node.matches('.post-card'))) {
                        if (!node.classList.contains('fade-in')) {
                            node.classList.add('fade-in');
                            if (scrollObserver) {
                                scrollObserver.observe(node);
                            }
                        }
                    }
                    
                    // Observe children
                    const newCards = node.querySelectorAll ? node.querySelectorAll('article, .post-card') : [];
                    newCards.forEach(card => {
                        if (!card.classList.contains('fade-in')) {
                            card.classList.add('fade-in');
                            if (scrollObserver) {
                                scrollObserver.observe(card);
                            }
                        }
                    });
                }
            });
        });
    });
    
    // Observe the main content areas
    const mainContent = document.querySelector('main, #posts-container, #featured-posts');
    if (mainContent) {
        contentObserver.observe(mainContent, {
            childList: true,
            subtree: true
        });
    }
    
    // Also observe body for any dynamically added sections
    contentObserver.observe(document.body, {
        childList: true,
        subtree: false
    });
}

// ============================================
// IMAGE LOADING EFFECTS
// ============================================

function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            // Fallback for broken images
            img.addEventListener('error', function() {
                this.style.opacity = '0.5';
            });
        }
    });
}

// ============================================
// PARALLAX EFFECTS (Enhanced)
// ============================================

let parallaxRaf = null;
let isParallaxEnabled = true;

function initParallaxEffects() {
    // Disable parallax on mobile/low-end devices for better performance
    if (window.deviceInfo && (window.deviceInfo.isMobile || window.deviceInfo.isLowEnd)) {
        isParallaxEnabled = false;
        return;
    }
    
    const parallaxElements = document.querySelectorAll('.parallax-img, article img, .parallax');
    
    if (parallaxElements.length === 0 || !isParallaxEnabled) return;

    let ticking = false;
    
    function updateParallax() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const windowHeight = window.innerHeight;
                
                parallaxElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + scrolled;
                    const elementHeight = rect.height;
                    
                    // Only apply parallax if element is in viewport
                    if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
                        const speed = element.dataset.parallaxSpeed || 0.1;
                        const distance = scrolled - elementTop;
                        const yPos = distance * speed;
                        
                        // Use translate3d for GPU acceleration
                        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                        element.style.willChange = 'transform';
                    } else {
                        element.style.willChange = 'auto';
                    }
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Throttled scroll handler
    window.addEventListener('scroll', updateParallax, { passive: true });
}

// ============================================
// STAGGERED ANIMATIONS
// ============================================

function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-children');
    
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

// ============================================
// BUTTON EFFECTS
// ============================================

function initButtonEffects() {
    const buttons = document.querySelectorAll('button, a[class*="bg-"]');
    
    buttons.forEach(button => {
        // Add click ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ============================================
// SMOOTH SCROLL TO ELEMENT
// ============================================

function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================
// CURSOR EFFECTS (Optional - can be enabled)
// ============================================

function initCursorEffects() {
    // Only enable on desktop
    if (window.innerWidth < 768) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Expand cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
}

// Uncomment to enable cursor effects
// initCursorEffects();

// ============================================
// PAGE TRANSITION EFFECTS
// ============================================

function initPageTransitions() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(href);
            }
        });
    });
}

initPageTransitions();

// ============================================
// TYPING EFFECT (for hero text)
// ============================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// ============================================
// REVEAL ANIMATIONS (Text and Elements)
// ============================================

function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-left, .reveal-right, .reveal-up, .reveal-down');
    
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// ============================================
// SMOOTH SCROLL WITH OFFSET
// ============================================

function smoothScrollTo(target, offset = 80) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================
// RE-ANIMATE FUNCTION (for dynamic content)
// ============================================

function reanimateContent() {
    if (scrollObserver) {
        observeAnimatedElements();
        autoAnimateElements();
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.visualEffects = {
    smoothScrollTo,
    typeWriter,
    initScrollAnimations,
    initParallaxEffects,
    reanimateContent,
    observeAnimatedElements,
    autoAnimateElements
};

// Re-animate when posts are loaded dynamically
if (typeof window.getBlogPosts === 'function') {
    const originalLoadPosts = window.loadPosts;
    if (originalLoadPosts) {
        window.loadPosts = async function() {
            await originalLoadPosts();
            setTimeout(() => {
                reanimateContent();
            }, 100);
        };
    }
}

