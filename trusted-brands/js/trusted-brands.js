// Trusted Brands Section JavaScript

class TrustedBrands {
    constructor() {
        this.brandsContainer = document.getElementById('brands-container');
        this.brandsData = null;

        // rAF-based scroller state (to match testimonials behavior)
        this.scroller = document.querySelector('.brands-marquee');
        this.rafId = null;
        this.direction = -1; // -1: right-to-left, 1: left-to-right
        this.speedPxPerSec = 40; // match testimonial speed
        this.lastTs = 0;
        this.paused = false;
    }

    /**
     * Initialize the trusted brands section
     * @param {Array} trustedBrands - Array of brand objects from config
     */
    init(trustedBrands) {
        this.brandsData = trustedBrands || [];
        this.render();
        this.setupScrolling();
    }

    /**
     * Render the trusted brands in the container
     */
    render() {
        if (!this.brandsContainer || !this.brandsData) return;

        this.brandsContainer.innerHTML = '';
        
        // Duplicate brands for seamless scrolling effect
        const duplicatedBrands = [...this.brandsData, ...this.brandsData];
        
        duplicatedBrands.forEach(brand => {
            const brandElement = this.createBrandElement(brand);
            this.brandsContainer.appendChild(brandElement);
        });

        // Disable CSS keyframe animation so JS controls movement
        this.brandsContainer.style.animation = 'none';
    }

    /**
     * Create a single brand element
     * @param {Object} brand - Brand data object
     * @returns {HTMLElement} Brand element
     */
    createBrandElement(brand) {
        const subs = brand.subs || '';
        const name = brand.name || '';
        const initial = name ? name.charAt(0).toUpperCase() : '?';
        const title = name ? `title="${name}"` : '';
        
        // Accept both logoUrl and logourl (case-insensitive config mistakes)
        const rawLogoUrl = (brand.logoUrl ?? brand.logourl ?? '').toString().trim();
        const hasLogoUrl = rawLogoUrl !== '';
        const logoHtml = hasLogoUrl
            ? `<img src="${rawLogoUrl}" alt="${name} logo" style="width:100%;height:100%;object-fit:contain;display:block;" onerror="this.onerror=null; const p=this.parentElement; this.remove(); if(p){p.textContent='${initial}';}">`
            : initial;

        const content = `
            <div class="brand-logo">${logoHtml}</div>
            <div class="brand-text">
                <div class="brand-name-box">
                    <span class="brand-name">${name}</span>
                </div>
                <div class="brand-subs">${subs}</div>
            </div>`;

        const brandElement = document.createElement('div');
        
        if (brand.ytUrl) {
            brandElement.innerHTML = `<a class="brand-item" href="${brand.ytUrl}" target="_blank" rel="noopener" ${title}>${content}</a>`;
        } else {
            brandElement.innerHTML = `<div class="brand-item" ${title}>${content}</div>`;
        }

        return brandElement.firstElementChild;
    }

    /**
     * Update brands data and re-render
     * @param {Array} trustedBrands - New brands data
     */
    update(trustedBrands) {
        this.brandsData = trustedBrands || [];
        this.render();
        this.restartAuto();
    }

    /**
     * Pause the scrolling animation
     */
    pauseAnimation() {
        if (this.brandsContainer) {
            this.brandsContainer.style.animationPlayState = 'paused';
        }
    }

    /**
     * Resume the scrolling animation
     */
    resumeAnimation() {
        if (this.brandsContainer) {
            this.brandsContainer.style.animationPlayState = 'running';
        }
    }

    /**
     * Destroy the trusted brands instance
     */
    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
        if (this.brandsContainer) {
            this.brandsContainer.innerHTML = '';
            this.brandsContainer.style.animation = '';
        }
        this.brandsData = null;
        this.teardownScrolling();
    }

    // ===== Scrolling behavior (mirrors TestimonialCarousel) =====
    setupScrolling() {
        if (!this.scroller) this.scroller = document.querySelector('.brands-marquee');
        if (!this.scroller) return;

        // Reset timing baseline on hover like testimonials (no pause)
        this.scroller.addEventListener('mouseenter', this.resetTimestampBaseline);
        this.scroller.addEventListener('mouseleave', this.resetTimestampBaseline);
        window.addEventListener('resize', this.handleResize);

        // Bind methods to instance for add/removeEventListener symmetry
        this._boundStep = this.step.bind(this);
        this._boundReset = this.resetTimestampBaseline.bind(this);
        this._boundResize = this.handleResize.bind(this);

        // Swap listeners to bound versions
        this.scroller.removeEventListener('mouseenter', this.resetTimestampBaseline);
        this.scroller.removeEventListener('mouseleave', this.resetTimestampBaseline);
        this.scroller.addEventListener('mouseenter', this._boundReset);
        this.scroller.addEventListener('mouseleave', this._boundReset);
        window.removeEventListener('resize', this.handleResize);
        window.addEventListener('resize', this._boundResize);

        this.startAuto();
    }

    teardownScrolling() {
        if (!this.scroller) return;
        if (this._boundReset) {
            this.scroller.removeEventListener('mouseenter', this._boundReset);
            this.scroller.removeEventListener('mouseleave', this._boundReset);
        }
        if (this._boundResize) {
            window.removeEventListener('resize', this._boundResize);
        }
        this._boundStep = null;
        this._boundReset = null;
        this._boundResize = null;
    }

    resetTimestampBaseline = () => {
        this.lastTs = 0;
    }

    getMaxScroll() {
        if (!this.scroller) return 0;
        return Math.max(0, this.scroller.scrollWidth - this.scroller.clientWidth);
    }

    step(ts) {
        if (!this.scroller) return;
        if (this.paused) {
            this.rafId = requestAnimationFrame(this._boundStep);
            return;
        }
        if (!this.lastTs) this.lastTs = ts;
        const dt = (ts - this.lastTs) / 1000;
        this.lastTs = ts;
        const delta = this.direction * this.speedPxPerSec * dt;
        this.scroller.scrollLeft += -delta; // invert so -1 moves content left

        const maxScroll = this.getMaxScroll();
        if (this.scroller.scrollLeft <= 0) {
            this.scroller.scrollLeft = 0;
            this.direction = -this.direction;
        } else if (this.scroller.scrollLeft >= maxScroll) {
            this.scroller.scrollLeft = maxScroll;
            this.direction = -this.direction;
        }

        this.rafId = requestAnimationFrame(this._boundStep);
    }

    startAuto() {
        if (!this.scroller) return;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.lastTs = 0;
        this.rafId = requestAnimationFrame(this._boundStep || this.step.bind(this));
    }

    restartAuto() {
        if (!this.scroller) return;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
        this.startAuto();
    }

    handleResize = () => {
        const maxScroll = this.getMaxScroll();
        if (!this.scroller) return;
        if (this.scroller.scrollLeft > maxScroll) {
            this.scroller.scrollLeft = maxScroll;
            this.direction = -1;
        }
    }
}

// Global instance
let trustedBrandsInstance = null;

/**
 * Initialize trusted brands section
 * @param {Array} trustedBrands - Array of brand objects
 */
function initTrustedBrands(trustedBrands) {
    trustedBrandsInstance = new TrustedBrands();
    trustedBrandsInstance.init(trustedBrands);
}

/**
 * Update trusted brands data
 * @param {Array} trustedBrands - New brands data
 */
function updateTrustedBrands(trustedBrands) {
    if (trustedBrandsInstance) {
        trustedBrandsInstance.update(trustedBrands);
    }
}

/**
 * Pause trusted brands animation
 */
function pauseTrustedBrandsAnimation() {
    if (trustedBrandsInstance) {
        trustedBrandsInstance.pauseAnimation();
    }
}

/**
 * Resume trusted brands animation
 */
function resumeTrustedBrandsAnimation() {
    if (trustedBrandsInstance) {
        trustedBrandsInstance.resumeAnimation();
    }
}

/**
 * Destroy trusted brands instance
 */
function destroyTrustedBrands() {
    if (trustedBrandsInstance) {
        trustedBrandsInstance.destroy();
        trustedBrandsInstance = null;
    }
}

// Export functions for global use
window.initTrustedBrands = initTrustedBrands;
window.updateTrustedBrands = updateTrustedBrands;
window.pauseTrustedBrandsAnimation = pauseTrustedBrandsAnimation;
window.resumeTrustedBrandsAnimation = resumeTrustedBrandsAnimation;
window.destroyTrustedBrands = destroyTrustedBrands;

