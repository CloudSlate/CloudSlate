// Google AdSense Integration
// Handles AdSense initialization and auto ads

class AdSenseManager {
    constructor() {
        this.config = BLOG_CONFIG?.adsense;
        if (this.config && this.config.enabled) {
            this.init();
        }
    }

    init() {
        this.loadAdSenseScript();
        this.initAutoAds();
        this.initManualAdUnits();
    }

    // ============================================
    // LOAD ADSENSE SCRIPT
    // ============================================
    
    loadAdSenseScript() {
        if (document.querySelector('script[src*="adsbygoogle"]')) {
            return; // Already loaded
        }
        
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config.publisherId}`;
        script.crossOrigin = 'anonymous';
        script.onerror = () => {
            console.warn('AdSense script failed to load');
        };
        document.head.appendChild(script);
    }

    // ============================================
    // AUTO ADS (Recommended by Google)
    // ============================================
    
    initAutoAds() {
        // Auto ads are enabled by default in AdSense dashboard
        // This ensures the script is loaded
        if (window.adsbygoogle && !window.adsbygoogle.loaded) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    // ============================================
    // MANUAL AD UNITS
    // ============================================
    
    initManualAdUnits() {
        // Wait for AdSense script to load
        const checkAdSense = setInterval(() => {
            if (window.adsbygoogle) {
                clearInterval(checkAdSense);
                this.createAdUnits();
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => clearInterval(checkAdSense), 5000);
    }

    createAdUnits() {
        const adUnits = [
            { id: 'adsense-top', slot: this.config.adUnits.top },
            { id: 'adsense-inline-top', slot: this.config.adUnits.inlineTop },
            { id: 'adsense-inline-bottom', slot: this.config.adUnits.inlineBottom },
            { id: 'adsense-sidebar', slot: this.config.adUnits.sidebar }
        ];
        
        adUnits.forEach(unit => {
            const container = document.getElementById(unit.id);
            if (container && unit.slot) {
                this.createAdUnit(container, unit.slot);
            }
        });
    }

    createAdUnit(container, adSlot) {
        // Clear placeholder content
        container.innerHTML = '';
        
        // Create ad unit
        const adUnit = document.createElement('ins');
        adUnit.className = 'adsbygoogle';
        adUnit.style.display = 'block';
        adUnit.setAttribute('data-ad-client', this.config.publisherId);
        adUnit.setAttribute('data-ad-slot', adSlot);
        adUnit.setAttribute('data-ad-format', 'auto');
        adUnit.setAttribute('data-full-width-responsive', 'true');
        
        container.appendChild(adUnit);
        
        // Push to AdSense
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.warn('AdSense push failed:', e);
        }
    }

    // ============================================
    // AD PLACEMENT HELPERS
    // ============================================
    
    static createResponsiveAd(containerId, adSlot, publisherId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const adUnit = document.createElement('ins');
        adUnit.className = 'adsbygoogle';
        adUnit.style.display = 'block';
        adUnit.setAttribute('data-ad-client', publisherId);
        adUnit.setAttribute('data-ad-slot', adSlot);
        adUnit.setAttribute('data-ad-format', 'auto');
        adUnit.setAttribute('data-full-width-responsive', 'true');
        
        container.appendChild(adUnit);
        
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.warn('AdSense push failed');
        }
    }
}

// Initialize AdSense Manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (BLOG_CONFIG?.adsense?.enabled) {
            window.adsenseManager = new AdSenseManager();
        }
    });
} else {
    if (BLOG_CONFIG?.adsense?.enabled) {
        window.adsenseManager = new AdSenseManager();
    }
}

