// Trusted Brands Section JavaScript

class TrustedBrands {
    constructor() {
        this.brandsContainer = document.getElementById('brands-container');
        this.brandsData = null;
    }

    /**
     * Initialize the trusted brands section
     * @param {Array} trustedBrands - Array of brand objects from config
     */
    init(trustedBrands) {
        this.brandsData = trustedBrands || [];
        this.render();
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
        
        const content = `
            <div class="brand-logo">${initial}</div>
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
        if (this.brandsContainer) {
            this.brandsContainer.innerHTML = '';
        }
        this.brandsData = null;
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

