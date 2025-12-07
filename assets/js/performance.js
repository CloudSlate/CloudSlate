// Performance Optimization System
// Ensures smooth performance on all devices

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeScrolling();
        this.optimizeAnimations();
        this.optimizeImages();
        this.optimizeTouchEvents();
        this.debounceScrollEvents();
        this.optimizeResize();
        this.detectDevice();
        this.applyDeviceOptimizations();
    }

    // ============================================
    // SMOOTH SCROLLING OPTIMIZATION
    // ============================================
    
    optimizeScrolling() {
        // Use passive event listeners for better scroll performance
        let ticking = false;
        let lastScrollY = 0;
        
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Smooth scroll behavior
        if ('scrollBehavior' in document.documentElement.style) {
            document.documentElement.style.scrollBehavior = 'smooth';
        } else {
            // Polyfill for smooth scrolling
            this.addSmoothScrollPolyfill();
        }
        
        // Fix scroll lag on mobile
        this.fixMobileScrollLag();
    }

    onScroll() {
        // Throttled scroll handler
        const scrollY = window.pageYOffset;
        
        // Update progress bar if exists
        const progressBar = document.querySelector('.reading-progress-fill');
        if (progressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollY / scrollHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        // Update parallax elements
        this.updateParallax(scrollY);
        
        lastScrollY = scrollY;
    }

    fixMobileScrollLag() {
        // Fix iOS scroll lag
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            // Disable momentum scrolling issues
            document.body.style.webkitOverflowScrolling = 'touch';
            
            // Fix scroll performance
            const style = document.createElement('style');
            style.textContent = `
                * {
                    -webkit-transform: translateZ(0);
                    transform: translateZ(0);
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }
                body {
                    -webkit-overflow-scrolling: touch;
                }
            `;
            document.head.appendChild(style);
        }
    }

    addSmoothScrollPolyfill() {
        // Smooth scroll polyfill for older browsers
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ============================================
    // ANIMATION OPTIMIZATION
    // ============================================
    
    optimizeAnimations() {
        // Use will-change only when needed
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.willChange = 'transform, opacity';
                    entry.target.classList.add('visible');
                } else {
                    // Remove will-change when not visible for performance
                    entry.target.style.willChange = 'auto';
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
        
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }
    }

    // ============================================
    // IMAGE OPTIMIZATION
    // ============================================
    
    optimizeImages() {
        // Lazy load images with Intersection Observer
        const images = document.querySelectorAll('img[data-src], img:not([loading])');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.loading = 'lazy';
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }
        
        // Add responsive image sizes
        this.addResponsiveImages();
    }

    addResponsiveImages() {
        const images = document.querySelectorAll('img:not([srcset])');
        images.forEach(img => {
            if (img.src && !img.srcset) {
                // Add srcset for responsive images
                const src = img.src;
                img.srcset = `${src}?w=400 400w, ${src}?w=800 800w, ${src}?w=1200 1200w`;
                img.sizes = '(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px';
            }
        });
    }

    // ============================================
    // TOUCH EVENT OPTIMIZATION
    // ============================================
    
    optimizeTouchEvents() {
        // Prevent double-tap zoom delay on mobile
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // Optimize touch scrolling
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        // Add touch feedback
        this.addTouchFeedback();
    }

    addTouchFeedback() {
        const touchElements = document.querySelectorAll('a, button, .clickable');
        touchElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            el.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });
    }

    // ============================================
    // DEBOUNCE & THROTTLE
    // ============================================
    
    debounceScrollEvents() {
        // Debounce scroll-heavy operations
        let scrollTimeout;
        const originalOnScroll = this.onScroll;
        
        this.onScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                originalOnScroll.call(this);
            }, 16); // ~60fps
        };
    }

    optimizeResize() {
        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        }, { passive: true });
    }

    handleResize() {
        // Recalculate layouts on resize
        if (window.visualEffects && window.visualEffects.reanimateContent) {
            window.visualEffects.reanimateContent();
        }
    }

    // ============================================
    // DEVICE DETECTION
    // ============================================
    
    detectDevice() {
        const ua = navigator.userAgent;
        const device = {
            isMobile: /iPhone|iPad|iPod|Android/i.test(ua),
            isTablet: /iPad|Android/i.test(ua) && !/Mobile/i.test(ua),
            isDesktop: !/iPhone|iPad|iPod|Android/i.test(ua),
            isIOS: /iPhone|iPad|iPod/i.test(ua),
            isAndroid: /Android/i.test(ua),
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            isLowEnd: navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2
        };
        
        document.documentElement.setAttribute('data-device', 
            device.isMobile ? 'mobile' : device.isTablet ? 'tablet' : 'desktop'
        );
        
        if (device.isLowEnd) {
            document.documentElement.classList.add('low-end-device');
        }
        
        window.deviceInfo = device;
        return device;
    }

    applyDeviceOptimizations() {
        const device = this.detectDevice();
        
        if (device.isMobile || device.isLowEnd) {
            // Reduce animations on low-end devices
            document.documentElement.classList.add('reduce-animations');
            
            // Disable parallax on mobile for better performance
            const parallaxElements = document.querySelectorAll('.parallax-img, .parallax');
            parallaxElements.forEach(el => {
                el.style.transform = 'none';
            });
        }
        
        // Optimize for touch devices
        if (device.isTouch) {
            document.body.classList.add('touch-device');
            // Increase tap target sizes
            this.increaseTapTargets();
        }
    }

    increaseTapTargets() {
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
        interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                el.style.minWidth = '44px';
                el.style.minHeight = '44px';
                el.style.padding = '12px';
            }
        });
    }

    // ============================================
    // PARALLAX OPTIMIZATION
    // ============================================
    
    updateParallax(scrollY) {
        if (window.deviceInfo && (window.deviceInfo.isMobile || window.deviceInfo.isLowEnd)) {
            return; // Skip parallax on mobile/low-end
        }
        
        const parallaxElements = document.querySelectorAll('.parallax-img:not(.parallax-disabled)');
        const windowHeight = window.innerHeight;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            
            if (scrollY + windowHeight > elementTop && scrollY < elementTop + rect.height) {
                const speed = element.dataset.parallaxSpeed || 0.1;
                const distance = scrollY - elementTop;
                const yPos = distance * speed;
                
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                element.style.willChange = 'transform';
            }
        });
    }
}

// Initialize performance optimizer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceOptimizer = new PerformanceOptimizer();
    });
} else {
    window.performanceOptimizer = new PerformanceOptimizer();
}

